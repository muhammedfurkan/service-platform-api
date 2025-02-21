import {
  Controller,
  Get,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { NotificationsService } from './notifications.service';
import { UpdateNotificationStatusDto } from './dto/update-notification-status.dto';
import { NotificationStatus } from './schemas/notification.schema';
import { UserRole } from '../users/schemas/user.schema';

@ApiTags('Notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Return user notifications' })
  async findAll(
    @Request() req,
    @Query('status') status?: NotificationStatus
  ) {
    return this.notificationsService.findByUser(req.user.id, status);
  }

  @Get('unread-count')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, description: 'Return unread notifications count' })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get notification details' })
  @ApiResponse({ status: 200, description: 'Return notification details' })
  async findOne(@Request() req, @Param('id') id: string) {
    const notification = await this.notificationsService.findById(id);
    
    if (notification.userId.toString() !== req.user.id) {
      throw new BadRequestException('You can only view your own notifications');
    }
    
    return notification;
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update notification status' })
  @ApiResponse({ status: 200, description: 'Notification status updated' })
  async updateStatus(
    @Request() req,
    @Param('id') id: string,
    @Body() updateNotificationStatusDto: UpdateNotificationStatusDto,
  ) {
    const notification = await this.notificationsService.findById(id);
    
    if (notification.userId.toString() !== req.user.id) {
      throw new BadRequestException('You can only update your own notifications');
    }
    
    return this.notificationsService.updateStatus(id, updateNotificationStatusDto);
  }

  @Put('mark-all-read')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete notification (Admin)' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  async remove(@Param('id') id: string) {
    return this.notificationsService.delete(id);
  }

  @Delete()
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete all notifications of a user (Admin)' })
  @ApiResponse({ status: 200, description: 'All notifications deleted successfully' })
  async removeAll(@Query('userId') userId: string) {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    return this.notificationsService.deleteAll(userId);
  }
} 