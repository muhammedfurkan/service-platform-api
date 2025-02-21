import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString, IsOptional } from 'class-validator';
import { PaymentStatus } from '../schemas/payment.schema';

export class UpdatePaymentStatusDto {
  @ApiProperty({ enum: PaymentStatus })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ example: 'TR123456789', required: false })
  @IsString()
  @IsOptional()
  transactionId?: string;

  @ApiProperty({ example: 'Payment failed: Insufficient funds', required: false })
  @IsString()
  @IsOptional()
  error?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
} 