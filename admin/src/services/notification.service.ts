import { api } from '../lib/axios';
import type { ApiResponse, Notification, PaginatedResponse } from '../types';

export const notificationService = {
  async getAll(params?: {
    skip?: number;
    take?: number;
    onlyUnread?: boolean;
  }): Promise<PaginatedResponse<Notification> & { unreadCount: number }> {
    const response = await api.get<
      ApiResponse<PaginatedResponse<Notification> & { unreadCount: number }>
    >('/admin/notifications', { params });
    return response.data.data;
  },

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await api.get<ApiResponse<{ unreadCount: number }>>(
      '/admin/notifications/unread-count'
    );
    return response.data.data;
  },

  async markAsRead(id: string): Promise<Notification> {
    const response = await api.patch<ApiResponse<Notification>>(
      `/admin/notifications/${id}/read`
    );
    return response.data.data;
  },

  async markAllAsRead(): Promise<{ count: number }> {
    const response = await api.patch<ApiResponse<{ count: number }>>(
      '/admin/notifications/mark-all-read'
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/admin/notifications/${id}`);
  },
};
