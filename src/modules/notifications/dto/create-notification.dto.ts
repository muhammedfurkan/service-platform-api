import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsMongoId, 
  IsOptional, 
  IsObject,
  IsUrl,
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationType } from '../schemas/notification.schema';

class NotificationDataDto {
  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  bookingId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bookingStatus?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  paymentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentStatus?: string;

  @ApiPropertyOptional()
  @IsMongoId()
  @IsOptional()
  reviewId?: string;

  [key: string]: any;
}

export class CreateNotificationDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  userId: string;

  @ApiProperty({ example: 'Yeni Rezervasyon' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Yeni bir rezervasyon talebi aldınız.' })
  @IsString()
  message: string;

  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => NotificationDataDto)
  @IsOptional()
  data?: NotificationDataDto;

  @ApiPropertyOptional({ example: '/bookings/123' })
  @IsUrl()
  @IsOptional()
  link?: string;

  @ApiPropertyOptional({ example: 'fas fa-calendar' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: {
    platform?: string;
    browser?: string;
    device?: string;
    [key: string]: any;
  };
} 