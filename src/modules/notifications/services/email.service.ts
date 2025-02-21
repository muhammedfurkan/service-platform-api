import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: this.configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      // Email gönderme işlemleri
      console.log(`Sending email to ${to}:`, { subject, html });
      return true;
    } catch (error) {
      console.error('Email sending error:', error);
      return false;
    }
  }

  async sendBookingConfirmation(
    email: string,
    bookingData: any,
  ): Promise<boolean> {
    const subject = 'Rezervasyon Onayı';
    const html = `
      <h1>Rezervasyonunuz Onaylandı</h1>
      <p>Merhaba,</p>
      <p>Rezervasyonunuz başarıyla onaylanmıştır.</p>
      <p>Rezervasyon Detayları:</p>
      <ul>
        <li>Tarih: ${bookingData.date}</li>
        <li>Saat: ${bookingData.time}</li>
        <li>Hizmet: ${bookingData.service.title}</li>
        <li>Tutar: ${bookingData.price} ${bookingData.currency}</li>
      </ul>
      <p>İyi günler dileriz.</p>
    `;

    return this.sendEmail(email, subject, html);
  }

  async sendPaymentConfirmation(
    email: string,
    paymentData: any,
  ): Promise<boolean> {
    const subject = 'Ödeme Onayı';
    const html = `
      <h1>Ödemeniz Alındı</h1>
      <p>Merhaba,</p>
      <p>Ödemeniz başarıyla alınmıştır.</p>
      <p>Ödeme Detayları:</p>
      <ul>
        <li>Tutar: ${paymentData.amount} ${paymentData.currency}</li>
        <li>İşlem No: ${paymentData.transactionId}</li>
        <li>Tarih: ${new Date().toLocaleString()}</li>
      </ul>
      <p>İyi günler dileriz.</p>
    `;

    return this.sendEmail(email, subject, html);
  }
} 