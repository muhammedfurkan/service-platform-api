import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationStrategy } from './strategies/notification.strategy';
import { Notification, NotificationSchema } from './schemas/notification.schema';
import { EmailService } from './services/email.service';
import { SmsService } from './services/sms.service';
import { PushService } from './services/push.service';
import { WebsocketService } from './services/websocket.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notification.name, schema: NotificationSchema }
    ]),
    UsersModule,
  ],
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationStrategy,
    EmailService,
    SmsService,
    PushService,
    WebsocketService,
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {} 