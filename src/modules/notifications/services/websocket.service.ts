import { Injectable } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
@Injectable()
export class WebsocketService implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets: Map<string, string[]> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const userSocketIds = this.userSockets.get(userId) || [];
      userSocketIds.push(client.id);
      this.userSockets.set(userId, userSocketIds);
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      const userSocketIds = this.userSockets.get(userId) || [];
      const updatedSocketIds = userSocketIds.filter(id => id !== client.id);
      if (updatedSocketIds.length > 0) {
        this.userSockets.set(userId, updatedSocketIds);
      } else {
        this.userSockets.delete(userId);
      }
    }
  }

  async sendToUser(userId: string, event: string, data: any): Promise<void> {
    // Websocket üzerinden bildirim gönderme işlemleri
    console.log(`Sending websocket event to ${userId}:`, { event, data });
  }

  async sendBookingNotification(userId: string, bookingData: any) {
    await this.sendToUser(userId, 'booking_update', {
      type: 'booking',
      title: 'Rezervasyon Güncellendi',
      message: `Rezervasyonunuz ${bookingData.status} durumuna güncellendi.`,
      data: bookingData,
    });
  }

  async sendPaymentNotification(userId: string, paymentData: any) {
    await this.sendToUser(userId, 'payment_update', {
      type: 'payment',
      title: 'Ödeme Durumu',
      message: `Ödemeniz ${paymentData.status} durumuna güncellendi.`,
      data: paymentData,
    });
  }

  async broadcastMessage(event: string, data: any) {
    this.server.emit(event, data);
  }
} 