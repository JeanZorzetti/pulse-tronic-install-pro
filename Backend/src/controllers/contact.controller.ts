import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';
import { CreateContactInput } from '../validators/contact.validator';

const prisma = new PrismaClient();

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

      // TODO: Send email notification to admin
      // TODO: Send auto-reply to customer

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
  static async getAll(req: Request, res: Response) {
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
  static async getById(req: Request, res: Response) {
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

  // Reply to contact (Admin)
  static async reply(req: Request, res: Response) {
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
  static async delete(req: Request, res: Response) {
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
