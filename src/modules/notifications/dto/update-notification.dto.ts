import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiProperty({ type: Date })
  @IsDate()
  @IsOptional()
  readAt?: Date;
} 