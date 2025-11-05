import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';
import { CreateQuoteInput } from '../validators/quote.validator';
import { EmailService } from '../services/email.service';
import { NotificationService } from '../services/notification.service';

const prisma = new PrismaClient();
const emailService = EmailService.getInstance();

export class QuoteController {
  // Create a new quote request
  static async create(req: Request, res: Response) {
    try {
      const { name, email, phone, vehicle, equipment, serviceId, message } =
        req.body as CreateQuoteInput;

      // Find or create customer
      let customer = await prisma.customer.findFirst({
        where: { phone },
      });

      if (!customer) {
        customer = await prisma.customer.create({
          data: {
            name,
            email,
            phone,
            vehicle,
          },
        });
      }

      // Create quote
      const quote = await prisma.quote.create({
        data: {
          customerId: customer.id,
          serviceId,
          equipment,
          vehicle: vehicle || customer.vehicle,
          message,
        },
        include: {
          customer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          service: {
            select: {
              id: true,
              title: true,
            },
          },
        },
      });

      // Send emails and create notification (don't wait for them)
      if (customer.email) {
        Promise.all([
          emailService.sendQuoteConfirmation(
            customer.email,
            customer.name,
            {
              vehicle: quote.vehicle,
              equipment: quote.equipment,
              service: quote.service?.title,
            }
          ),
          emailService.sendQuoteNotificationToAdmin({
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            vehicle: quote.vehicle,
            equipment: quote.equipment,
            message: quote.message,
          }),
          NotificationService.notifyNewQuote(quote.id, customer.name),
        ]).catch((error) => console.error('Error sending emails/notifications:', error));
      }

      return ApiResponseUtil.created(res, quote, 'Orçamento solicitado com sucesso! Entraremos em contato em breve.');
    } catch (error) {
      console.error('Error creating quote:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao criar orçamento');
    }
  }

  // Get all quotes (Admin)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, serviceId } = req.query;

      const where: any = {};
      if (status) where.status = status;
      if (serviceId) where.serviceId = serviceId;

      const skip = (Number(page) - 1) * Number(limit);

      const [quotes, total] = await Promise.all([
        prisma.quote.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            customer: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            service: {
              select: {
                id: true,
                title: true,
              },
            },
            assignedTo: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        prisma.quote.count({ where }),
      ]);

      return ApiResponseUtil.paginated(
        res,
        quotes,
        Number(page),
        Number(limit),
        total
      );
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar orçamentos');
    }
  }

  // Get quote by ID (Admin)
  static async getByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const quote = await prisma.quote.findUnique({
        where: { id },
        include: {
          customer: true,
          service: {
            include: {
              items: true,
            },
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          appointment: true,
        },
      });

      if (!quote) {
        return ApiResponseUtil.notFound(res, 'Orçamento não encontrado');
      }

      return ApiResponseUtil.success(res, quote);
    } catch (error) {
      console.error('Error fetching quote:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar orçamento');
    }
  }

  // Update quote (Admin)
  static async updateAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, estimatedValue, notes, assignedToId } = req.body;

      const quote = await prisma.quote.update({
        where: { id },
        data: {
          status,
          estimatedValue,
          notes,
          assignedToId,
          ...(status && { respondedAt: new Date() }),
        },
        include: {
          customer: true,
          service: true,
        },
      });

      // TODO: Send email notification to customer about status change

      return ApiResponseUtil.success(res, quote, 'Orçamento atualizado com sucesso');
    } catch (error) {
      console.error('Error updating quote:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao atualizar orçamento');
    }
  }

  // Delete quote (Admin)
  static async deleteAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      await prisma.quote.delete({
        where: { id },
      });

      return ApiResponseUtil.success(res, null, 'Orçamento excluído com sucesso');
    } catch (error) {
      console.error('Error deleting quote:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao excluir orçamento');
    }
  }
}
