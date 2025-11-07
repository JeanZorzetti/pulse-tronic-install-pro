import { api } from '../lib/axios';
import type { FAQ } from '../types';

interface FAQFormData {
  question: string;
  answer: string;
  displayOrder?: number;
  isActive?: boolean;
}

export const faqService = {
  /**
   * Get all FAQs (Admin)
   */
  getAllAdmin: async (isActive?: boolean): Promise<FAQ[]> => {
    const params = new URLSearchParams();
    if (isActive !== undefined) {
      params.append('isActive', String(isActive));
    }
    const response = await api.get(`/admin/faqs?${params.toString()}`);
    return response.data.data;
  },

  /**
   * Get FAQ by ID (Admin)
   */
  getByIdAdmin: async (id: string): Promise<FAQ> => {
    const response = await api.get(`/admin/faqs/${id}`);
    return response.data.data;
  },

  /**
   * Create new FAQ (Admin)
   */
  createAdmin: async (data: FAQFormData): Promise<FAQ> => {
    const response = await api.post('/admin/faqs', data);
    return response.data.data;
  },

  /**
   * Update FAQ (Admin)
   */
  updateAdmin: async (id: string, data: Partial<FAQFormData>): Promise<FAQ> => {
    const response = await api.put(`/admin/faqs/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete FAQ (Admin)
   */
  deleteAdmin: async (id: string): Promise<void> => {
    await api.delete(`/admin/faqs/${id}`);
  },

  /**
   * Toggle FAQ active status (Admin)
   */
  toggleActiveAdmin: async (id: string): Promise<FAQ> => {
    const response = await api.patch(`/admin/faqs/${id}/toggle-active`);
    return response.data.data;
  },
};
