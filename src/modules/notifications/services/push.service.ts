import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';

@Injectable()
export class PushService {
  private isInitialized = false;

  constructor(private configService: ConfigService) {
    // Firebase yapılandırmasını geliştirme aşamasında devre dışı bırakalım
    this.isInitialized = false;
    console.warn('Firebase yapılandırması devre dışı bırakıldı. Push bildirimleri simüle edilecek.');
  }

  async sendPushNotification(token: string, title: string, body: string, data?: any): Promise<boolean> {
    try {
      // Push notification gönderme işlemleri
      console.log(`Sending push notification to ${token}:`, { title, body, data });
      return true;
    } catch (error) {
      console.error('Push notification error:', error);
      return false;
    }
  }

  async sendToMultipleDevices(
    tokens: string[],
    title: string,
    body: string,
    data?: any,
  ): Promise<boolean> {
    if (!this.isInitialized) {
      console.log('Multiple Push Notification simülasyonu:', {
        tokens,
        title,
        body,
        data,
      });
      return true;
    }

    try {
      const batchResponse = await admin.messaging().sendEachForMulticast({
        tokens,
        notification: {
          title,
          body,
        },
        data,
      });
      
      return batchResponse.failureCount === 0;
    } catch (error) {
      console.error('Push notification gönderme hatası:', error);
      return false;
    }
  }

  async sendBookingNotification(token: string, bookingData: any): Promise<boolean> {
    return this.sendPushNotification(
      token,
      'Rezervasyon Onayı',
      'Rezervasyonunuz başarıyla onaylandı.',
      {
        type: 'booking',
        bookingId: bookingData._id.toString(),
        status: bookingData.status,
      }
    );
  }

  async sendPaymentNotification(token: string, paymentData: any): Promise<boolean> {
    return this.sendPushNotification(
      token,
      'Ödeme Onayı',
      'Ödemeniz başarıyla alındı.',
      {
        type: 'payment',
        paymentId: paymentData._id.toString(),
        status: paymentData.status,
      }
    );
  }
}