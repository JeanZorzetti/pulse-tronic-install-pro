import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';
import { CreateContactInput } from '../validators/contact.validator';
import { EmailService } from '../services/email.service';
import { NotificationService } from '../services/notification.service';
import { Logger } from '../services/logger.service';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();
const emailService = EmailService.getInstance();

export class ContactController {
  // Create a new contact message
  static async create(req: Request, res: Response) {
    try {
      const { name, email, phone, subject, message } = req.body as CreateContactInput;

      const contact = await prisma.contact.create({
        data: {
          name,
          email,
          phone,
          subject,
          message,
        },
      });

      // Send emails and create notification (don't wait for them)
      if (email) {
        Promise.all([
          emailService.sendContactConfirmation(email, name),
          emailService.sendContactNotificationToAdmin({
            name,
            email,
            phone,
            subject,
            message,
          }),
          NotificationService.notifyNewContact(contact.id, name, subject),
        ]).catch((error) => Logger.error('Error sending emails/notifications', { error: error instanceof Error ? error.message : 'Unknown error', contactId: contact.id }));
      }

      Logger.info('Contact created', { contactId: contact.id, name, email });

      return ApiResponseUtil.created(
        res,
        contact,
        'Mensagem enviada com sucesso! Responderemos em breve.'
      );
    } catch (error) {
      Logger.error('Error creating contact', { error: error instanceof Error ? error.message : 'Unknown error' });
      return ApiResponseUtil.serverError(res, 'Erro ao enviar mensagem');
    }
  }

  // Get all contact messages (Admin)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, search } = req.query;

      const where: any = {};
      if (status) where.status = status;

      // Add search functionality
      if (search && typeof search === 'string') {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { subject: { contains: search, mode: 'insensitive' } },
          { message: { contains: search, mode: 'insensitive' } },
        ];
      }

      const skip = (Number(page) - 1) * Number(limit);

      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
          where,
          skip,
          take: Number(limit),
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.contact.count({ where }),
      ]);

      Logger.info('Contacts fetched', {
        userId: (req as AuthRequest).user?.userId,
        total,
        page,
        status: status || 'all',
        search: search || 'none'
      });

      return ApiResponseUtil.paginated(
        res,
        contacts,
        Number(page),
        Number(limit),
        total
      );
    } catch (error) {
      Logger.error('Error fetching contacts', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: (req as AuthRequest).user?.userId
      });
      return ApiResponseUtil.serverError(res, 'Erro ao buscar mensagens');
    }
  }

  // Get contact by ID (Admin)
  static async getByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const contact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!contact) {
        return ApiResponseUtil.notFound(res, 'Mensagem não encontrada');
      }

      // Mark as read
      if (contact.status === 'NEW') {
        await prisma.contact.update({
          where: { id },
          data: { status: 'READ' },
        });
        Logger.info('Contact marked as read', { contactId: id, userId: (req as AuthRequest).user?.userId });
      }

      return ApiResponseUtil.success(res, contact);
    } catch (error) {
      Logger.error('Error fetching contact', {
        error: error instanceof Error ? error.message : 'Unknown error',
        contactId: req.params.id,
        userId: (req as AuthRequest).user?.userId
      });
      return ApiResponseUtil.serverError(res, 'Erro ao buscar mensagem');
    }
  }

  // Update contact status only (Admin)
  static async updateStatusAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!['NEW', 'READ', 'REPLIED'].includes(status)) {
        return ApiResponseUtil.badRequest(res, 'Status inválido');
      }

      // Get current contact to check respondedAt
      const currentContact = await prisma.contact.findUnique({
        where: { id },
      });

      if (!currentContact) {
        return ApiResponseUtil.notFound(res, 'Contato não encontrado');
      }

      const contact = await prisma.contact.update({
        where: { id },
        data: {
          status,
          ...(status === 'REPLIED' && !currentContact.respondedAt ? { respondedAt: new Date() } : {}),
        },
      });

      Logger.info('Contact status updated', {
        contactId: id,
        oldStatus: currentContact.status,
        newStatus: status,
        userId: (req as AuthRequest).user?.userId
      });

      return ApiResponseUtil.success(res, contact, 'Status atualizado com sucesso');
    } catch (error) {
      Logger.error('Error updating contact status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        contactId: req.params.id,
        userId: (req as AuthRequest).user?.userId
      });
      return ApiResponseUtil.serverError(res, 'Erro ao atualizar status');
    }
  }

  // Update/Reply to contact (Admin)
  static async updateAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { response } = req.body;

      const contact = await prisma.contact.update({
        where: { id },
        data: {
          response,
          respondedAt: new Date(),
          status: 'REPLIED',
        },
      });

      Logger.info('Contact replied', {
        contactId: id,
        userId: (req as AuthRequest).user?.userId
      });

      // TODO: Send email response to customer

      return ApiResponseUtil.success(res, contact, 'Resposta enviada com sucesso');
    } catch (error) {
      Logger.error('Error replying to contact', {
        error: error instanceof Error ? error.message : 'Unknown error',
        contactId: req.params.id,
        userId: (req as AuthRequest).user?.userId
      });
      return ApiResponseUtil.serverError(res, 'Erro ao enviar resposta');
    }
  }

  // Delete contact (Admin)
  static async deleteAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.contact.delete({
        where: { id },
      });

      Logger.info('Contact deleted', {
        contactId: id,
        userId: (req as AuthRequest).user?.userId
      });

      return ApiResponseUtil.success(res, null, 'Mensagem excluída com sucesso');
    } catch (error) {
      Logger.error('Error deleting contact', {
        error: error instanceof Error ? error.message : 'Unknown error',
        contactId: req.params.id,
        userId: (req as AuthRequest).user?.userId
      });
      return ApiResponseUtil.serverError(res, 'Erro ao excluir mensagem');
    }
  }
}
