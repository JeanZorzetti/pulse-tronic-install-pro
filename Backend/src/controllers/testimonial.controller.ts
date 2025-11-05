import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';

const prisma = new PrismaClient();

export class TestimonialController {
  // Get all approved testimonials (Public)
  static async getAll(req: Request, res: Response) {
    try {
      const { featured } = req.query;

      const where: any = { isApproved: true };
      if (featured === 'true') where.isFeatured = true;

      const testimonials = await prisma.testimonial.findMany({
        where,
        select: {
          id: true,
          name: true,
          rating: true,
          comment: true,
          isFeatured: true,
          createdAt: true,
        },
        orderBy: [
          { isFeatured: 'desc' },
          { createdAt: 'desc' },
        ],
      });

      return ApiResponseUtil.success(res, testimonials);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar depoimentos');
    }
  }
}
