import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsDate, 
  IsNumber, 
  IsMongoId, 
  IsOptional, 
  ValidateNested,
  Min,
  Matches 
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationDto {
  @ApiProperty({ example: 'Bağdat Caddesi No:123' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Kadıköy' })
  @IsString()
  state: string;

  @ApiProperty({ example: [29.0335, 41.0053] })
  @IsNumber({}, { each: true })
  coordinates: [number];
}

export class CreateBookingDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  serviceId: string;

  @ApiProperty({ example: '2024-03-20' })
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: '14:30' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Time must be in HH:mm format',
  })
  time: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  @IsOptional()
  location?: LocationDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
} 