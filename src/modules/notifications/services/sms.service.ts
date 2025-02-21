import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class SmsService {
  private client: twilio.Twilio;

  constructor(private configService: ConfigService) {
    const accountSid = this.configService.get('TWILIO_ACCOUNT_SID');
    const authToken = this.configService.get('TWILIO_AUTH_TOKEN');
    this.client = twilio(accountSid, authToken);
  }

  async sendSms(phone: string, message: string): Promise<boolean> {
    try {
      // SMS gönderme işlemleri
      console.log(`Sending SMS to ${phone}:`, message);
      return true;
    } catch (error) {
      console.error('SMS sending error:', error);
      return false;
    }
  }

  async sendBookingConfirmation(phone: string, bookingData: any): Promise<boolean> {
    const message = `Rezervasyonunuz onaylandı!\n
Tarih: ${bookingData.date}\n
Saat: ${bookingData.time}\n
Hizmet: ${bookingData.service.title}\n
Tutar: ${bookingData.price} ${bookingData.currency}`;

    return this.sendSms(phone, message);
  }

  async sendPaymentConfirmation(phone: string, paymentData: any): Promise<boolean> {
    const message = `Ödemeniz alındı!\n
Tutar: ${paymentData.amount} ${paymentData.currency}\n
İşlem No: ${paymentData.transactionId}\n
Tarih: ${new Date().toLocaleString()}`;

    return this.sendSms(phone, message);
  }

  async sendOtp(phone: string, otp: string): Promise<boolean> {
    const message = `Doğrulama kodunuz: ${otp}\n
Bu kodu kimseyle paylaşmayın.`;

    return this.sendSms(phone, message);
  }
} 