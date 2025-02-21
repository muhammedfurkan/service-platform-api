import { ApiProperty, PartialType, OmitType } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

export class UpdateBookingDto extends PartialType(
  OmitType(CreateBookingDto, ['serviceId'] as const),
) {
  @ApiProperty({ 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    description: 'Booking status',
    required: false
  })
  @IsEnum(['pending', 'confirmed', 'completed', 'cancelled'])
  @IsOptional()
  status?: string;

  @ApiProperty({ 
    enum: ['pending', 'paid', 'refunded', 'failed'],
    description: 'Payment status',
    required: false
  })
  @IsEnum(['pending', 'paid', 'refunded', 'failed'])
  @IsOptional()
  paymentStatus?: string;
} 