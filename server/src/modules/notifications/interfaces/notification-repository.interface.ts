export interface INotificationRepository {
  findTypeByCode(code: string): Promise<any | null>;
  createType(code: string, label: string): Promise<any>;
  createNotification(data: any): Promise<any>;
  findNotificationsForUser(userId: string, query: any): Promise<[any[], number]>;
  countUnreadForUser(userId: string): Promise<number>;
  findNotificationByIdAndUser(notificationId: string, userId: string): Promise<any | null>;
  markRead(notificationId: string): Promise<any>;
  markAllReadForUser(userId: string): Promise<number>;
  deleteNotification(notificationId: string): Promise<void>;
}
