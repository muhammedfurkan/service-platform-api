import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateServiceDto } from './create-service.dto';
import { ServiceStatus } from '../schemas/service.schema';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsObject, IsOptional } from 'class-validator';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {
  @ApiProperty({ enum: ServiceStatus, required: false })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: {
    rating?: number;
    reviewCount?: number;
    averageRating?: number;
    totalReviews?: number;
    completedBookings?: number;
    [key: string]: any;
  };
} 