import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';

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
}
