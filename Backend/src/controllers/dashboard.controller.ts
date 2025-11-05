import { Response } from 'express';
import { PrismaClient, QuoteStatus } from '@prisma/client';
import { ApiResponseUtil } from '../utils/response';
import { Logger } from '../services/logger.service';
import { AuthRequest } from '../types';

const prisma = new PrismaClient();

/**
 * Dashboard Controller
 * Provides statistics and metrics for the admin dashboard
 */
export class DashboardController {
  /**
   * GET /api/admin/dashboard/stats
   * Get dashboard statistics
   */
  static async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ApiResponseUtil.error(res, 'User not authenticated', 401);
      }

      // Date calculations
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      // Run all queries in parallel for better performance
      const [
        quotesToday,
        quotesWeek,
        quotesMonth,
        pendingQuotes,
        contactsToday,
        unreadNotifications,
        approvedQuotes,
        totalQuotes,
      ] = await Promise.all([
        // Quotes today
        prisma.quote.count({
          where: {
            createdAt: {
              gte: today,
            },
          },
        }),

        // Quotes this week
        prisma.quote.count({
          where: {
            createdAt: {
              gte: weekAgo,
            },
          },
        }),

        // Quotes this month
        prisma.quote.count({
          where: {
            createdAt: {
              gte: monthAgo,
            },
          },
        }),

        // Pending quotes
        prisma.quote.count({
          where: {
            status: {
              in: [QuoteStatus.NEW, QuoteStatus.ANALYZING],
            },
          },
        }),

        // Contacts today
        prisma.contact.count({
          where: {
            createdAt: {
              gte: today,
            },
          },
        }),

        // Unread notifications for this user
        prisma.notification.count({
          where: {
            OR: [{ userId }, { userId: null }],
            isRead: false,
          },
        }),

        // Approved quotes (for conversion rate)
        prisma.quote.count({
          where: {
            status: QuoteStatus.APPROVED,
          },
        }),

        // Total quotes (for conversion rate)
        prisma.quote.count(),
      ]);

      // Calculate conversion rate
      const conversionRate = totalQuotes > 0 ? (approvedQuotes / totalQuotes) * 100 : 0;

      const stats = {
        quotesToday,
        quotesWeek,
        quotesMonth,
        pendingQuotes,
        contactsToday,
        unreadNotifications,
        conversionRate: Math.round(conversionRate * 10) / 10, // Round to 1 decimal
      };

      Logger.info('Dashboard stats retrieved', {
        userId,
        stats,
      });

      return ApiResponseUtil.success(res, stats, 'Statistics retrieved successfully');
    } catch (error) {
      Logger.error('Get dashboard stats error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.userId,
      });
      return ApiResponseUtil.error(res, 'Failed to retrieve statistics', 500);
    }
  }

  /**
   * GET /api/admin/dashboard/charts
   * Get data for dashboard charts
   */
  static async getCharts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ApiResponseUtil.error(res, 'User not authenticated', 401);
      }

      // Get quotes by status
      const quotesByStatus = await prisma.quote.groupBy({
        by: ['status'],
        _count: {
          id: true,
        },
      });

      const statusData = quotesByStatus.map((item) => ({
        status: item.status,
        count: item._count.id,
      }));

      // Get quotes by last 7 days
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const quotesByDay = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
        SELECT
          DATE(created_at) as date,
          COUNT(*)::bigint as count
        FROM "Quote"
        WHERE created_at >= ${sevenDaysAgo}
        GROUP BY DATE(created_at)
        ORDER BY date ASC
      `;

      const timelineData = quotesByDay.map((item) => ({
        date: item.date,
        count: Number(item.count),
      }));

      const charts = {
        statusData,
        timelineData,
      };

      Logger.info('Dashboard charts retrieved', {
        userId,
        statusCount: statusData.length,
        timelineCount: timelineData.length,
      });

      return ApiResponseUtil.success(res, charts, 'Charts data retrieved successfully');
    } catch (error) {
      Logger.error('Get dashboard charts error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.userId,
      });
      return ApiResponseUtil.error(res, 'Failed to retrieve charts data', 500);
    }
  }
}
