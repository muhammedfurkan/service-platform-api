import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument, NotificationStatus } from './schemas/notification.schema';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { NotificationStrategy } from './strategies/notification.strategy';
import { NotificationEvent, NotificationEventPayload } from './events/notification.events';
import { UsersService } from '../users/users.service';
import { NotificationType } from './schemas/notification.schema';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
    private notificationStrategy: NotificationStrategy,
    private usersService: UsersService,
  ) {}

  async create(createNotificationDto: CreateNotificationDto): Promise<NotificationDocument> {
    const notification = new this.notificationModel(createNotificationDto);
    return notification.save();
  }

  async findAll(query: any = {}): Promise<NotificationDocument[]> {
    return this.notificationModel
      .find(query)
      .populate('userId', '-password')
      .sort({ createdAt: -1 })
      .exec();
  }

  async findById(id: string): Promise<NotificationDocument> {
    const notification = await this.notificationModel
      .findById(id)
      .populate('userId', '-password')
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async findByUser(userId: string, status?: NotificationStatus): Promise<NotificationDocument[]> {
    const query: any = { userId };
    if (status) {
      query.status = status;
    }
    return this.findAll(query);
  }

  async updateStatus(id: string, updateNotificationStatusDto: UpdateNotificationStatusDto): Promise<NotificationDocument> {
    const notification = await this.notificationModel
      .findByIdAndUpdate(
        id,
        {
          status: updateNotificationStatusDto.status,
          ...(updateNotificationStatusDto.status === NotificationStatus.READ && { readAt: new Date() }),
          ...(updateNotificationStatusDto.status === NotificationStatus.ARCHIVED && { archivedAt: new Date() })
        },
        { new: true }
      )
      .exec();

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationModel.updateMany(
      { 
        userId, 
        status: NotificationStatus.UNREAD 
      },
      { 
        status: NotificationStatus.READ,
        readAt: new Date()
      }
    );
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.notificationModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async deleteAll(userId: string): Promise<void> {
    await this.notificationModel.deleteMany({ userId });
  }

  async getUnreadCount(userId: string): Promise<number> {
    return this.notificationModel.countDocuments({
      userId,
      status: NotificationStatus.UNREAD
    });
  }

  // Bildirim gönderme yardımcı metodları
  async sendBookingNotification(
    userId: string,
    bookingId: string,
    status: string,
  ): Promise<NotificationDocument> {
    const title = `Rezervasyon ${status === 'confirmed' ? 'Onaylandı' : 'Güncellendi'}`;
    const message = `Rezervasyonunuz ${status} durumuna güncellendi.`;

    return this.create({
      userId,
      title,
      message,
      type: NotificationType.BOOKING,
      data: { 
        bookingId,
        bookingStatus: status
      },
    });
  }

  async sendPaymentNotification(
    userId: string,
    paymentId: string,
    status: string,
  ): Promise<NotificationDocument> {
    const title = 'Ödeme Durumu';
    const message = `Ödemeniz ${status} durumuna güncellendi.`;

    return this.create({
      userId,
      title,
      message,
      type: NotificationType.PAYMENT,
      data: { 
        paymentId,
        paymentStatus: status
      },
    });
  }

  async notify(event: NotificationEvent, payload: NotificationEventPayload): Promise<void> {
    // Bildirimi veritabanına kaydet
    const notification = new this.notificationModel({
      userId: payload.userId,
      type: event,
      title: payload.title,
      message: payload.message,
      data: payload.data,
      channel: payload.channels?.[0] || 'in-app',
      sentAt: new Date(),
    });
    await notification.save();

    // Kullanıcı bilgilerini al
    const user = await this.usersService.findById(payload.userId);
    if (!user) {
      console.error(`User not found: ${payload.userId}`);
      return;
    }

    // Bildirimi gönder
    await this.notificationStrategy.send(payload, user);
  }

  async notifyBookingCreated(bookingData: any): Promise<void> {
    // Müşteriye bildirim
    await this.notify(NotificationEvent.BOOKING_CREATED, {
      userId: bookingData.customerId,
      type: 'booking.created',
      title: 'Yeni Rezervasyon',
      message: 'Rezervasyonunuz başarıyla oluşturuldu.',
      data: bookingData,
      channels: ['in-app', 'email'],
    });

    // Hizmet sağlayıcıya bildirim
    await this.notify(NotificationEvent.BOOKING_CREATED, {
      userId: bookingData.providerId,
      type: 'booking.created',
      title: 'Yeni Rezervasyon Talebi',
      message: 'Yeni bir rezervasyon talebi aldınız.',
      data: bookingData,
      channels: ['in-app', 'sms'],
    });
  }

  async notifyBookingUpdated(bookingData: any): Promise<void> {
    const parties = [
      {
        userId: bookingData.customerId,
        title: 'Rezervasyon Güncellendi',
        message: `Rezervasyonunuz ${bookingData.status} durumuna güncellendi.`,
      },
      {
        userId: bookingData.providerId,
        title: 'Rezervasyon Güncellendi',
        message: `Rezervasyon durumu ${bookingData.status} olarak güncellendi.`,
      },
    ];

    for (const party of parties) {
      await this.notify(NotificationEvent.BOOKING_UPDATED, {
        ...party,
        type: 'booking.updated',
        data: bookingData,
        channels: ['in-app', 'email'],
      });
    }
  }

  async notifyPaymentCompleted(paymentData: any): Promise<void> {
    await this.notify(NotificationEvent.PAYMENT_COMPLETED, {
      userId: paymentData.customerId,
      type: 'payment.completed',
      title: 'Ödeme Başarılı',
      message: 'Ödemeniz başarıyla tamamlandı.',
      data: paymentData,
      channels: ['in-app', 'email', 'sms'],
    });
  }

  async notifyReviewCreated(reviewData: any): Promise<void> {
    await this.notify(NotificationEvent.REVIEW_CREATED, {
      userId: reviewData.providerId,
      type: 'review.created',
      title: 'Yeni Değerlendirme',
      message: 'Hizmetiniz için yeni bir değerlendirme aldınız.',
      data: reviewData,
      channels: ['in-app', 'email'],
    });
  }
} 