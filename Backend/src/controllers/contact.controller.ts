import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';
import { CreateContactInput } from '../validators/contact.validator';
import { EmailService } from '../services/email.service';
import { NotificationService } from '../services/notification.service';

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
        ]).catch((error) => console.error('Error sending emails/notifications:', error));
      }

      return ApiResponseUtil.created(
        res,
        contact,
        'Mensagem enviada com sucesso! Responderemos em breve.'
      );
    } catch (error) {
      console.error('Error creating contact:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao enviar mensagem');
    }
  }

  // Get all contact messages (Admin)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status } = req.query;

      const where: any = {};
      if (status) where.status = status;

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

      return ApiResponseUtil.paginated(
        res,
        contacts,
        Number(page),
        Number(limit),
        total
      );
    } catch (error) {
      console.error('Error fetching contacts:', error);
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
      }

      return ApiResponseUtil.success(res, contact);
    } catch (error) {
      console.error('Error fetching contact:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar mensagem');
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

      // TODO: Send email response to customer

      return ApiResponseUtil.success(res, contact, 'Resposta enviada com sucesso');
    } catch (error) {
      console.error('Error replying to contact:', error);
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

      return ApiResponseUtil.success(res, null, 'Mensagem excluída com sucesso');
    } catch (error) {
      console.error('Error deleting contact:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao excluir mensagem');
    }
  }
}
