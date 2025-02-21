import { Injectable } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { SmsService } from '../services/sms.service';
import { PushService } from '../services/push.service';
import { WebsocketService } from '../services/websocket.service';
import { NotificationEventPayload } from '../events/notification.events';
import { NotificationTemplates, NotificationTemplate } from '../templates/notification.templates';
import { User } from '../../users/schemas/user.schema';

@Injectable()
export class NotificationStrategy {
  constructor(
    private emailService: EmailService,
    private smsService: SmsService,
    private pushService: PushService,
    private websocketService: WebsocketService,
  ) {}

  async send(payload: NotificationEventPayload, user: User): Promise<void> {
    const channels = payload.channels || ['in-app'];
    const template = this.findTemplate(payload.type);

    for (const channel of channels) {
      switch (channel) {
        case 'email':
          if (user.email && template?.email) {
            await this.sendEmail(payload, user, template);
          }
          break;
        case 'sms':
          if (user.phone && template?.message) {
            await this.sendSMS(payload, user, template);
          }
          break;
        case 'push':
          if (template?.push) {
            await this.sendPushNotification(payload, user, template);
          }
          break;
        case 'in-app':
        default:
          // In-app bildirimleri zaten veritabanına kaydediliyor
          break;
      }
    }
  }

  private async sendEmail(
    payload: NotificationEventPayload, 
    user: User, 
    template: NotificationTemplate
  ): Promise<void> {
    if (!template.email) return;
    
    const subject = this.replaceVariables(template.email.subject, payload.data);
    const html = this.replaceVariables(template.email.template, payload.data);
    console.log(`Sending email to ${user.email}:`, { subject, html });
  }

  private async sendSMS(
    payload: NotificationEventPayload, 
    user: User, 
    template: NotificationTemplate
  ): Promise<void> {
    if (!template.message) return;
    
    const message = this.replaceVariables(template.message, payload.data);
    console.log(`Sending SMS to ${user.phone}:`, message);
  }

  private async sendPushNotification(
    payload: NotificationEventPayload, 
    user: User, 
    template: NotificationTemplate
  ): Promise<void> {
    if (!template.push) return;
    
    const title = this.replaceVariables(template.push.title, payload.data);
    const body = this.replaceVariables(template.push.body, payload.data);
    console.log(`Sending push notification to user ${user.id}:`, { title, body });
  }

  private findTemplate(type: string): NotificationTemplate | null {
    const [category, action] = type.split('.');
    return NotificationTemplates[category]?.[action] || null;
  }

  private replaceVariables(template: string, data: any = {}): string {
    return template.replace(/{{(\w+)}}/g, (match, key) => 
      data[key]?.toString() || match
    );
  }
} 