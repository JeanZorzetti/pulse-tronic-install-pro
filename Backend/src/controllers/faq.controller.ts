import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';

const prisma = new PrismaClient();

export class FAQController {
  // Get all active FAQs (Public)
  static async getAll(req: Request, res: Response) {
    try {
      const faqs = await prisma.fAQ.findMany({
        where: { isActive: true },
        orderBy: {
          displayOrder: 'asc',
        },
      });

      return ApiResponseUtil.success(res, faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar perguntas frequentes');
    }
  }
}
