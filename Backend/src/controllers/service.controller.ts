import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';
import { Logger } from '../services/logger.service';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

export class ServiceController {
  // Get all active services (Public)
  static async getAll(req: Request, res: Response) {
    try {
      const { category } = req.query;

      const where: any = { isActive: true };
      if (category) where.category = category;

      const services = await prisma.service.findMany({
        where,
        include: {
          items: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
        },
        orderBy: {
          displayOrder: 'asc',
        },
      });

      return ApiResponseUtil.success(res, services);
    } catch (error) {
      console.error('Error fetching services:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar serviços');
    }
  }

  // Get service by slug (Public)
  static async getBySlug(req: Request, res: Response) {
    try {
      const { slug } = req.params;

      const service = await prisma.service.findUnique({
        where: { slug },
        include: {
          items: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
        },
      });

      if (!service) {
        return ApiResponseUtil.notFound(res, 'Serviço não encontrado');
      }

      return ApiResponseUtil.success(res, service);
    } catch (error) {
      console.error('Error fetching service:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar serviço');
    }
  }

  // ==========================================
  // ADMIN ENDPOINTS
  // ==========================================

  // Get all services (Admin - includes inactive)
  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { category, isActive } = req.query;

      const where: any = {};
      if (category) where.category = category;
      if (isActive !== undefined) where.isActive = isActive === 'true';

      const services = await prisma.service.findMany({
        where,
        include: {
          items: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
          _count: {
            select: {
              quotes: true,
            },
          },
        },
        orderBy: {
          displayOrder: 'asc',
        },
      });

      Logger.info('Services fetched (admin)', {
        userId: (req as AuthRequest).user?.userId,
        total: services.length,
        category: category || 'all',
      });

      return ApiResponseUtil.success(res, services);
    } catch (error) {
      Logger.error('Error fetching services (admin)', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao buscar serviços');
    }
  }

  // Get service by ID (Admin)
  static async getByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const service = await prisma.service.findUnique({
        where: { id },
        include: {
          items: {
            orderBy: {
              displayOrder: 'asc',
            },
          },
        },
      });

      if (!service) {
        return ApiResponseUtil.notFound(res, 'Serviço não encontrado');
      }

      Logger.info('Service fetched by ID (admin)', {
        serviceId: id,
        userId: (req as AuthRequest).user?.userId,
      });

      return ApiResponseUtil.success(res, service);
    } catch (error) {
      Logger.error('Error fetching service (admin)', {
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao buscar serviço');
    }
  }

  // Create service (Admin)
  static async createAdmin(req: Request, res: Response) {
    try {
      const {
        title,
        description,
        category,
        estimatedTime,
        isActive,
        displayOrder,
        slug,
        metaTitle,
        metaDescription,
        items,
      } = req.body;

      // Check if slug already exists
      const existingService = await prisma.service.findUnique({
        where: { slug },
      });

      if (existingService) {
        return ApiResponseUtil.error(res, 'Slug já está em uso', 400);
      }

      // Create service with items
      const service = await prisma.service.create({
        data: {
          title,
          description,
          category,
          estimatedTime,
          isActive: isActive ?? true,
          displayOrder: displayOrder ?? 0,
          slug,
          metaTitle,
          metaDescription,
          items: items
            ? {
                create: items.map((item: any, index: number) => ({
                  item: item.item,
                  displayOrder: item.displayOrder ?? index,
                })),
              }
            : undefined,
        },
        include: {
          items: true,
        },
      });

      Logger.info('Service created', {
        serviceId: service.id,
        title,
        userId: (req as AuthRequest).user?.userId,
      });

      return ApiResponseUtil.created(res, service, 'Serviço criado com sucesso');
    } catch (error) {
      Logger.error('Error creating service', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao criar serviço');
    }
  }

  // Update service (Admin)
  static async updateAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const {
        title,
        description,
        category,
        estimatedTime,
        isActive,
        displayOrder,
        slug,
        metaTitle,
        metaDescription,
        items,
      } = req.body;

      // Check if service exists
      const existingService = await prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return ApiResponseUtil.notFound(res, 'Serviço não encontrado');
      }

      // Check if slug is being changed and if it's already in use
      if (slug && slug !== existingService.slug) {
        const slugInUse = await prisma.service.findUnique({
          where: { slug },
        });

        if (slugInUse) {
          return ApiResponseUtil.error(res, 'Slug já está em uso', 400);
        }
      }

      // Update service
      const service = await prisma.service.update({
        where: { id },
        data: {
          title,
          description,
          category,
          estimatedTime,
          isActive,
          displayOrder,
          slug,
          metaTitle,
          metaDescription,
          ...(items !== undefined && {
            items: {
              deleteMany: {},
              create: items.map((item: any, index: number) => ({
                item: item.item,
                displayOrder: item.displayOrder ?? index,
              })),
            },
          }),
        },
        include: {
          items: true,
        },
      });

      Logger.info('Service updated', {
        serviceId: id,
        title,
        userId: (req as AuthRequest).user?.userId,
      });

      return ApiResponseUtil.success(res, service, 'Serviço atualizado com sucesso');
    } catch (error) {
      Logger.error('Error updating service', {
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao atualizar serviço');
    }
  }

  // Delete service (Admin)
  static async deleteAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      // Check if service exists
      const existingService = await prisma.service.findUnique({
        where: { id },
        include: {
          _count: {
            select: {
              quotes: true,
            },
          },
        },
      });

      if (!existingService) {
        return ApiResponseUtil.notFound(res, 'Serviço não encontrado');
      }

      // Check if service has associated quotes
      if (existingService._count.quotes > 0) {
        return ApiResponseUtil.error(
          res,
          `Não é possível excluir este serviço pois ele possui ${existingService._count.quotes} orçamentos associados. Desative-o ao invés de excluir.`,
          400
        );
      }

      await prisma.service.delete({
        where: { id },
      });

      Logger.info('Service deleted', {
        serviceId: id,
        title: existingService.title,
        userId: (req as AuthRequest).user?.userId,
      });

      return ApiResponseUtil.success(res, null, 'Serviço excluído com sucesso');
    } catch (error) {
      Logger.error('Error deleting service', {
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao excluir serviço');
    }
  }

  // Toggle service active status (Admin)
  static async toggleActiveAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const existingService = await prisma.service.findUnique({
        where: { id },
      });

      if (!existingService) {
        return ApiResponseUtil.notFound(res, 'Serviço não encontrado');
      }

      const service = await prisma.service.update({
        where: { id },
        data: {
          isActive: !existingService.isActive,
        },
      });

      Logger.info('Service active status toggled', {
        serviceId: id,
        newStatus: service.isActive,
        userId: (req as AuthRequest).user?.userId,
      });

      return ApiResponseUtil.success(
        res,
        service,
        `Serviço ${service.isActive ? 'ativado' : 'desativado'} com sucesso`
      );
    } catch (error) {
      Logger.error('Error toggling service status', {
        error: error instanceof Error ? error.message : 'Unknown error',
        serviceId: req.params.id,
        userId: (req as AuthRequest).user?.userId,
      });
      return ApiResponseUtil.serverError(res, 'Erro ao alterar status do serviço');
    }
  }
}
