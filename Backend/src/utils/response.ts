import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export class ApiResponseUtil {
  static success<T>(res: Response, data?: T, message?: string, statusCode: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
    };
    return res.status(statusCode).json(response);
  }

  static error(res: Response, message: string, statusCode: number = 400, error?: any) {
    const response: ApiResponse = {
      success: false,
      message,
      ...(error && { error }),
    };
    return res.status(statusCode).json(response);
  }

  static paginated<T>(
    res: Response,
    data: T,
    page: number,
    limit: number,
    total: number,
    message?: string
  ) {
    const response: PaginatedResponse<T> = {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
    return res.status(200).json(response);
  }

  static created<T>(res: Response, data?: T, message: string = 'Criado com sucesso') {
    return this.success(res, data, message, 201);
  }

  static noContent(res: Response) {
    return res.status(204).send();
  }

  static unauthorized(res: Response, message: string = 'Não autorizado') {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Acesso negado') {
    return this.error(res, message, 403);
  }

  static notFound(res: Response, message: string = 'Recurso não encontrado') {
    return this.error(res, message, 404);
  }

  static conflict(res: Response, message: string = 'Conflito de dados') {
    return this.error(res, message, 409);
  }

  static validationError(res: Response, errors: any) {
    return this.error(res, 'Erro de validação', 422, errors);
  }

  static serverError(res: Response, message: string = 'Erro interno do servidor', error?: any) {
    return this.error(res, message, 500, error);
  }
}
