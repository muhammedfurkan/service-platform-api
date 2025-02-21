import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { NotificationsService } from '../notifications.service';
import { NotificationStatus } from '../schemas/notification.schema';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/notifications',
})
export class NotificationsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly notificationsService: NotificationsService) {}

  async handleConnection(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (!userId) {
      client.disconnect();
      return;
    }

    await client.join(`user:${userId}`);
    
    // Okunmamış bildirimleri gönder
    const unreadNotifications = await this.notificationsService.findByUser(
      userId, 
      NotificationStatus.UNREAD
    );
    client.emit('notifications:unread', unreadNotifications);
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth.userId;
    if (userId) {
      client.leave(`user:${userId}`);
    }
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('notifications:markAsRead')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { notificationId: string },
  ) {
    const userId = client.handshake.auth.userId;
    const notification = await this.notificationsService.findById(data.notificationId);

    if (notification.userId.toString() !== userId) {
      return { error: 'Unauthorized' };
    }

    await this.notificationsService.updateStatus(
      data.notificationId,
      { status: NotificationStatus.READ }
    );
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('notifications:markAllAsRead')
  async handleMarkAllAsRead(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.auth.userId;
    await this.notificationsService.markAllAsRead(userId);
    return { success: true };
  }
} 