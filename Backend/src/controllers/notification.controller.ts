import { Request, Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { ApiResponseUtil } from '../utils/response';
import { Logger } from '../services/logger.service';
import { AuthRequest } from '../types';

/**
 * Notification Controller
 * Handles admin notifications (new quotes, contacts, etc)
 */
export class NotificationController {
  /**
   * GET /api/admin/notifications
   * Get user's notifications with pagination
   */
  static async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ApiResponseUtil.error(res, 'User not authenticated', 401);
      }

      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 20;
      const onlyUnread = req.query.onlyUnread === 'true';

      const result = await NotificationService.getUserNotifications(userId, {
        skip,
        take,
        onlyUnread,
      });

      return ApiResponseUtil.success(res, result, 'Notifications retrieved successfully');
    } catch (error) {
      Logger.error('Get notifications error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.userId,
      });
      return ApiResponseUtil.error(
        res,
        'Failed to retrieve notifications',
        500
      );
    }
  }

  /**
   * GET /api/admin/notifications/unread-count
   * Get count of unread notifications
   */
  static async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ApiResponseUtil.error(res, 'User not authenticated', 401);
      }

      const result = await NotificationService.getUserNotifications(userId, {
        take: 0, // We only need the count
      });

      return ApiResponseUtil.success(
        res,
        { unreadCount: result.unreadCount },
        'Unread count retrieved successfully'
      );
    } catch (error) {
      Logger.error('Get unread count error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.userId,
      });
      return ApiResponseUtil.error(res, 'Failed to get unread count', 500);
    }
  }

  /**
   * PATCH /api/admin/notifications/:id/read
   * Mark notification as read
   */
  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ApiResponseUtil.error(res, 'User not authenticated', 401);
      }

      const { id } = req.params;

      const notification = await NotificationService.markAsRead(id, userId);

      return ApiResponseUtil.success(
        res,
        notification,
        'Notification marked as read'
      );
    } catch (error) {
      Logger.error('Mark as read error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.userId,
        notificationId: req.params.id,
      });
      return ApiResponseUtil.error(res, 'Failed to mark notification as read', 500);
    }
  }

  /**
   * PATCH /api/admin/notifications/mark-all-read
   * Mark all notifications as read
   */
  static async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ApiResponseUtil.error(res, 'User not authenticated', 401);
      }

      const result = await NotificationService.markAllAsRead(userId);

      return ApiResponseUtil.success(
        res,
        { count: result.count },
        'All notifications marked as read'
      );
    } catch (error) {
      Logger.error('Mark all as read error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.userId,
      });
      return ApiResponseUtil.error(
        res,
        'Failed to mark all notifications as read',
        500
      );
    }
  }

  /**
   * DELETE /api/admin/notifications/:id
   * Delete notification
   */
  static async deleteNotification(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return ApiResponseUtil.error(res, 'User not authenticated', 401);
      }

      const { id } = req.params;

      await NotificationService.delete(id, userId);

      return ApiResponseUtil.success(res, null, 'Notification deleted successfully');
    } catch (error) {
      Logger.error('Delete notification error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.user?.userId,
        notificationId: req.params.id,
      });
      return ApiResponseUtil.error(res, 'Failed to delete notification', 500);
    }
  }
}
