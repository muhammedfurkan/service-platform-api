import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CancelBookingDto {
  @ApiProperty({ 
    example: 'Schedule conflict', 
    description: 'Reason for cancellation' 
  })
  @IsString()
  @MinLength(5)
  reason: string;
} 