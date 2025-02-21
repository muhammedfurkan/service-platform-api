export enum NotificationEvent {
  BOOKING_CREATED = 'booking.created',
  BOOKING_UPDATED = 'booking.updated',
  BOOKING_CANCELLED = 'booking.cancelled',
  PAYMENT_CREATED = 'payment.created',
  PAYMENT_COMPLETED = 'payment.completed',
  PAYMENT_FAILED = 'payment.failed',
  REVIEW_CREATED = 'review.created',
  REVIEW_RESPONDED = 'review.responded',
  SYSTEM_ALERT = 'system.alert'
}

export interface NotificationEventPayload {
  userId: string;
  type: string;
  title: string;
  message: string;
  data?: any;
  channels?: string[];
} 