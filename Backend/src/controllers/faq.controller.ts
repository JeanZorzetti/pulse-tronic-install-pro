import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';

const prisma = new PrismaClient();

export class FAQController {
  static async getAll(_req: Request, res: Response) {
    try {
      const faqs = await prisma.fAQ.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: 'asc' },
      });
      return ApiResponseUtil.success(res, faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar perguntas frequentes');
    }
  }

  static async getAllAdmin(req: Request, res: Response) {
    try {
      const { isActive } = req.query;
      const where: any = {};
      if (isActive !== undefined) where.isActive = isActive === 'true';
      const faqs = await prisma.fAQ.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
      });
      return ApiResponseUtil.success(res, faqs);
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar FAQs');
    }
  }

  static async getByIdAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const faq = await prisma.fAQ.findUnique({ where: { id } });
      if (!faq) {
        return ApiResponseUtil.notFound(res, 'FAQ não encontrado');
      }
      return ApiResponseUtil.success(res, faq);
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao buscar FAQ');
    }
  }

  static async createAdmin(req: Request, res: Response) {
    try {
      const { question, answer, displayOrder, isActive } = req.body;
      if (!question || !answer) {
        return ApiResponseUtil.error(res, 'Pergunta e resposta são obrigatórios', 400);
      }
      const faq = await prisma.fAQ.create({
        data: {
          question,
          answer,
          displayOrder: displayOrder !== undefined ? displayOrder : 0,
          isActive: isActive !== undefined ? isActive : true,
        },
      });
      return ApiResponseUtil.success(res, faq, 'FAQ criado com sucesso', 201);
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao criar FAQ');
    }
  }

  static async updateAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { question, answer, displayOrder, isActive } = req.body;
      const existingFAQ = await prisma.fAQ.findUnique({ where: { id } });
      if (!existingFAQ) {
        return ApiResponseUtil.notFound(res, 'FAQ não encontrado');
      }
      const faq = await prisma.fAQ.update({
        where: { id },
        data: {
          question: question !== undefined ? question : existingFAQ.question,
          answer: answer !== undefined ? answer : existingFAQ.answer,
          displayOrder: displayOrder !== undefined ? displayOrder : existingFAQ.displayOrder,
          isActive: isActive !== undefined ? isActive : existingFAQ.isActive,
        },
      });
      return ApiResponseUtil.success(res, faq, 'FAQ atualizado com sucesso');
    } catch (error) {
      console.error('Error updating FAQ:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao atualizar FAQ');
    }
  }

  static async deleteAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existingFAQ = await prisma.fAQ.findUnique({ where: { id } });
      if (!existingFAQ) {
        return ApiResponseUtil.notFound(res, 'FAQ não encontrado');
      }
      await prisma.fAQ.delete({ where: { id } });
      return ApiResponseUtil.success(res, null, 'FAQ excluído com sucesso');
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao excluir FAQ');
    }
  }

  static async toggleActiveAdmin(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const existingFAQ = await prisma.fAQ.findUnique({ where: { id } });
      if (!existingFAQ) {
        return ApiResponseUtil.notFound(res, 'FAQ não encontrado');
      }
      const faq = await prisma.fAQ.update({
        where: { id },
        data: { isActive: !existingFAQ.isActive },
      });
      const message = faq.isActive ? 'FAQ ativado com sucesso' : 'FAQ desativado com sucesso';
      return ApiResponseUtil.success(res, faq, message);
    } catch (error) {
      console.error('Error toggling FAQ:', error);
      return ApiResponseUtil.serverError(res, 'Erro ao atualizar status');
    }
  }
}
