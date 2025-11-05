import { PrismaClient, NotificationType } from '@prisma/client';
import { Logger } from './logger.service';

const prisma = new PrismaClient();

export interface CreateNotificationData {
  userId?: string; // undefined = notify all admins
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
}

/**
 * Notification Service
 * Handles creation and management of admin notifications
 */
export class NotificationService {
  /**
   * Create a new notification
   */
  static async create(data: CreateNotificationData) {
    try {
      const notification = await prisma.notification.create({
        data: {
          userId: data.userId,
          type: data.type,
          title: data.title,
          message: data.message,
          relatedId: data.relatedId,
        },
      });

      Logger.info('Notification created', {
        notificationId: notification.id,
        type: notification.type,
        userId: notification.userId || 'all admins',
      });

      return notification;
    } catch (error) {
      Logger.error('Failed to create notification', {
        error: error instanceof Error ? error.message : 'Unknown error',
        data,
      });
      throw error;
    }
  }

  /**
   * Create notification for all admins (userId = null)
   */
  static async notifyAllAdmins(
    type: NotificationType,
    title: string,
    message: string,
    relatedId?: string
  ) {
    return this.create({
      type,
      title,
      message,
      relatedId,
      // userId is undefined, so notification goes to all admins
    });
  }

  /**
   * Mark notification as read
   */
  static async markAsRead(notificationId: string, userId: string) {
    try {
      const notification = await prisma.notification.update({
        where: {
          id: notificationId,
          userId, // Ensure user can only mark their own notifications
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      Logger.info('Notification marked as read', {
        notificationId,
        userId,
      });

      return notification;
    } catch (error) {
      Logger.error('Failed to mark notification as read', {
        error: error instanceof Error ? error.message : 'Unknown error',
        notificationId,
        userId,
      });
      throw error;
    }
  }

  /**
   * Mark all user notifications as read
   */
  static async markAllAsRead(userId: string) {
    try {
      const result = await prisma.notification.updateMany({
        where: {
          userId,
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: new Date(),
        },
      });

      Logger.info('All notifications marked as read', {
        userId,
        count: result.count,
      });

      return result;
    } catch (error) {
      Logger.error('Failed to mark all notifications as read', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Get user notifications with pagination
   */
  static async getUserNotifications(
    userId: string,
    options: {
      skip?: number;
      take?: number;
      onlyUnread?: boolean;
    } = {}
  ) {
    const { skip = 0, take = 20, onlyUnread = false } = options;

    try {
      const where = {
        OR: [{ userId }, { userId: null }], // User-specific OR all-admins notifications
        ...(onlyUnread && { isRead: false }),
      };

      const [notifications, total, unreadCount] = await Promise.all([
        prisma.notification.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.notification.count({ where }),
        prisma.notification.count({
          where: {
            OR: [{ userId }, { userId: null }],
            isRead: false,
          },
        }),
      ]);

      return {
        notifications,
        total,
        unreadCount,
        skip,
        take,
      };
    } catch (error) {
      Logger.error('Failed to get user notifications', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId,
      });
      throw error;
    }
  }

  /**
   * Delete notification
   */
  static async delete(notificationId: string, userId: string) {
    try {
      await prisma.notification.delete({
        where: {
          id: notificationId,
          userId, // Ensure user can only delete their own notifications
        },
      });

      Logger.info('Notification deleted', {
        notificationId,
        userId,
      });
    } catch (error) {
      Logger.error('Failed to delete notification', {
        error: error instanceof Error ? error.message : 'Unknown error',
        notificationId,
        userId,
      });
      throw error;
    }
  }

  /**
   * Helper: Create notification for new quote
   */
  static async notifyNewQuote(quoteId: string, customerName: string) {
    return this.notifyAllAdmins(
      'NEW_QUOTE',
      'Novo Orçamento Recebido',
      `${customerName} solicitou um orçamento.`,
      quoteId
    );
  }

  /**
   * Helper: Create notification for new contact
   */
  static async notifyNewContact(contactId: string, name: string, subject?: string) {
    return this.notifyAllAdmins(
      'NEW_CONTACT',
      'Nova Mensagem de Contato',
      `${name} enviou uma mensagem${subject ? `: ${subject}` : '.'}`,
      contactId
    );
  }

  /**
   * Helper: Create notification for new appointment
   */
  static async notifyNewAppointment(
    appointmentId: string,
    customerName: string,
    scheduledDate: Date
  ) {
    return this.notifyAllAdmins(
      'NEW_APPOINTMENT',
      'Novo Agendamento',
      `${customerName} agendou um atendimento para ${scheduledDate.toLocaleDateString('pt-BR')}.`,
      appointmentId
    );
  }
}
