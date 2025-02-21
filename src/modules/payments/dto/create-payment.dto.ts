import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsMongoId, 
  IsEnum, 
  IsOptional, 
  ValidateNested,
  Min 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../schemas/payment.schema';

class PaymentDetailsDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cardLastFour?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  cardBrand?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  bankName?: string;
}

export class CreatePaymentDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  bookingId: string;

  @ApiProperty({ example: 250 })
  @IsNumber()
  @Min(0)
  amount: number;

  @ApiPropertyOptional({ example: 'TRY' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  @IsOptional()
  paymentDetails?: PaymentDetailsDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
} 