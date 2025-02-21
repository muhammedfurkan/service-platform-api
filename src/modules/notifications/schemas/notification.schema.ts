import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type NotificationDocument = Notification & Document;

export enum NotificationType {
  BOOKING = 'booking',
  PAYMENT = 'payment',
  REVIEW = 'review',
  SYSTEM = 'system'
}

export enum NotificationStatus {
  UNREAD = 'unread',
  READ = 'read',
  ARCHIVED = 'archived'
}

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'User' })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ required: true, enum: NotificationType })
  type: NotificationType;

  @Prop({ enum: NotificationStatus, default: NotificationStatus.UNREAD })
  status: NotificationStatus;

  @Prop({ type: Object })
  data?: {
    bookingId?: string;
    paymentId?: string;
    reviewId?: string;
    [key: string]: any;
  };

  @Prop()
  link?: string;

  @Prop()
  icon?: string;

  @Prop({ type: Date })
  readAt?: Date;

  @Prop({ type: Date })
  archivedAt?: Date;

  @Prop({ type: Object })
  metadata?: {
    platform?: string;
    browser?: string;
    device?: string;
    [key: string]: any;
  };
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);

// Kullanıcı ve durum bazlı indeks
NotificationSchema.index({ userId: 1, status: 1 });

// Tarih bazlı indeks
NotificationSchema.index({ createdAt: -1 });

// Tip bazlı indeks
NotificationSchema.index({ type: 1 }); 