import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { NotificationStatus } from '../schemas/notification.schema';

export class UpdateNotificationStatusDto {
  @ApiProperty({ enum: NotificationStatus })
  @IsEnum(NotificationStatus)
  status: NotificationStatus;
} 