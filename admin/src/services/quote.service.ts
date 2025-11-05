import { api } from '../lib/axios';
import type { ApiResponse, Quote, PaginatedResponse } from '../types';

export const quoteService = {
  async getAll(params?: {
    skip?: number;
    take?: number;
    status?: string;
  }): Promise<PaginatedResponse<Quote>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Quote>>>('/admin/quotes', {
      params,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Quote> {
    const response = await api.get<ApiResponse<Quote>>(`/admin/quotes/${id}`);
    return response.data.data;
  },

  async update(
    id: string,
    data: Partial<Quote>
  ): Promise<Quote> {
    const response = await api.put<ApiResponse<Quote>>(`/admin/quotes/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/quotes/${id}`);
  },
};
