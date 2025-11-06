import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';
import { CreateQuoteInput } from '../validators/quote.validator';
import { EmailService } from '../services/email.service';
import { NotificationService } from '../services/notification.service';
import { Logger } from '../services/logger.service';
import { AuthRequest } from '../types';

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
        ]).catch((error) => Logger.error('Error sending emails/notifications', { error: error instanceof Error ? error.message : 'Unknown error', quoteId: quote.id }));
      }

      Logger.info('Quote created', { quoteId: quote.id, customerId: customer.id, equipment });

      return ApiResponseUtil.created(res, quote, 'Orçamento solicitado com sucesso! Entraremos em contato em breve.');
    } catch (error) {
      Logger.error('Error creating quote', { error: error instanceof Error ? error.message : 'Unknown error' });
      return ApiResponseUtil.serverError(res, 'Erro ao criar orçamento');
    }
  }

  // Get all quotes (Admin)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { page = 1, limit = 20, status, serviceId, search, dateFrom, dateTo } = req.query;

      const where: any = {};
      if (status) where.status = status;
      if (serviceId) where.serviceId = serviceId;

      // Search filter
      if (search) {
        where.OR = [
          { customer: { name: { contains: search as string, mode: 'insensitive' } } },
          { customer: { email: { contains: search as string, mode: 'insensitive' } } },
          { equipment: { contains: search as string, mode: 'insensitive' } },
          { vehicle: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      // Date range filter
      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) where.createdAt.gte = new Date(dateFrom as string);
        if (dateTo) {
          const endDate = new Date(dateTo as string);
          endDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = endDate;
        }
      }

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

      Logger.info('Quotes fetched', {
        userId: (req as AuthRequest).user?.userId,
        total,
        page,
        status: status || 'all',
      });

      return ApiResponseUtil.paginated(
        res,
        quotes,
        Number(page),
        Number(limit),
        total
      );
    } catch (error) {
      Logger.error('Error fetching quotes', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: (req as AuthRequest).user?.userId,
      });
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

      Logger.info('Quote fetched by ID', { quoteId: id, userId: (req as AuthRequest).user?.userId });

      return ApiResponseUtil.success(res, quote);
    } catch (error) {
      Logger.error('Error fetching quote', {
        error: error instanceof Error ? error.message : 'Unknown error',
        quoteId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao buscar orçamento');
    }
  }

  // Update quote status only (Admin)
  static async updateStatusAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['NEW', 'ANALYZING', 'QUOTE_SENT', 'APPROVED', 'REJECTED', 'COMPLETED'];
      if (!validStatuses.includes(status)) {
        return ApiResponseUtil.error(res, 'Status inválido', 400);
      }

      // Get current quote
      const currentQuote = await prisma.quote.findUnique({
        where: { id },
        include: { customer: true },
      });

      if (!currentQuote) {
        return ApiResponseUtil.notFound(res, 'Orçamento não encontrado');
      }

      const quote = await prisma.quote.update({
        where: { id },
        data: {
          status,
          ...(status !== 'NEW' && !currentQuote.respondedAt ? { respondedAt: new Date() } : {}),
        },
        include: {
          customer: true,
          service: true,
        },
      });

      Logger.info('Quote status updated', {
        quoteId: id,
        oldStatus: currentQuote.status,
        newStatus: status,
        userId: (req as AuthRequest).user?.userId,
      });

      // TODO: Send email notification to customer about status change

      return ApiResponseUtil.success(res, quote, 'Status atualizado com sucesso');
    } catch (error) {
      Logger.error('Error updating quote status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        quoteId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao atualizar status');
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

      Logger.info('Quote updated', {
        quoteId: id,
        userId: (req as AuthRequest).user?.userId,
      });

      // TODO: Send email notification to customer about status change

      return ApiResponseUtil.success(res, quote, 'Orçamento atualizado com sucesso');
    } catch (error) {
      Logger.error('Error updating quote', {
        error: error instanceof Error ? error.message : 'Unknown error',
        quoteId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
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

      Logger.info('Quote deleted', {
        quoteId: id,
        userId: (req as AuthRequest).user?.userId,
      });

      return ApiResponseUtil.success(res, null, 'Orçamento excluído com sucesso');
    } catch (error) {
      Logger.error('Error deleting quote', {
        error: error instanceof Error ? error.message : 'Unknown error',
        quoteId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao excluir orçamento');
    }
  }
}
