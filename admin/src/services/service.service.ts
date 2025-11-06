import { api } from '../lib/axios';
import type { ApiResponse, Service } from '../types';

export const serviceService = {
  async getAll(params?: {
    category?: string;
    isActive?: boolean;
  }): Promise<Service[]> {
    const response = await api.get<ApiResponse<Service[]>>('/admin/services', {
      params,
    });
    return response.data.data;
  },

  async getById(id: string): Promise<Service> {
    const response = await api.get<ApiResponse<Service>>(`/admin/services/${id}`);
    return response.data.data;
  },

  async create(data: {
    title: string;
    description: string;
    category: string;
    estimatedTime?: number;
    isActive?: boolean;
    displayOrder?: number;
    slug: string;
    metaTitle?: string;
    metaDescription?: string;
    items?: Array<{ item: string; displayOrder?: number }>;
  }): Promise<Service> {
    const response = await api.post<ApiResponse<Service>>('/admin/services', data);
    return response.data.data;
  },

  async update(
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      estimatedTime?: number;
      isActive?: boolean;
      displayOrder?: number;
      slug?: string;
      metaTitle?: string;
      metaDescription?: string;
      items?: Array<{ item: string; displayOrder?: number }>;
    }
  ): Promise<Service> {
    const response = await api.put<ApiResponse<Service>>(`/admin/services/${id}`, data);
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/services/${id}`);
  },

  async toggleActive(id: string): Promise<Service> {
    const response = await api.patch<ApiResponse<Service>>(
      `/admin/services/${id}/toggle-active`
    );
    return response.data.data;
  },
};
