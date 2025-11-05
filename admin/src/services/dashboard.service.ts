import { api } from '../lib/axios';
import type { ApiResponse, DashboardStats } from '../types';

interface ChartData {
  statusData: Array<{
    status: string;
    count: number;
  }>;
  timelineData: Array<{
    date: string;
    count: number;
  }>;
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data.data;
  },

  async getCharts(): Promise<ChartData> {
    const response = await api.get<ApiResponse<ChartData>>('/admin/dashboard/charts');
    return response.data.data;
  },
};
