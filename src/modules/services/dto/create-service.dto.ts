import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsMongoId, 
  IsArray, 
  IsOptional, 
  IsEnum,
  IsBoolean,
  ValidateNested,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize
} from 'class-validator';
import { Type } from 'class-transformer';
import { ServiceStatus } from '../schemas/service.schema';
import { WorkingHoursDto } from './working-hours.dto';

class LocationPropertiesDto {
  @ApiProperty({ example: 'İstiklal Caddesi No: 50, Beyoğlu' })
  @IsString()
  address: string;

  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'İstanbul' })
  @IsString()
  state: string;
}

export class LocationDto {
  @ApiProperty({ example: 28.9784 })
  @IsNumber()
  lng: number;

  @ApiProperty({ example: 41.0082 })
  @IsNumber()
  lat: number;

  @ApiProperty({ type: LocationPropertiesDto })
  @ValidateNested()
  @Type(() => LocationPropertiesDto)
  properties: LocationPropertiesDto;
}

class AvailabilityDto {
  @ApiProperty({ example: { start: '09:00', end: '18:00' } })
  @ValidateNested()
  @Type(() => WorkingHoursDto)
  workingHours: WorkingHoursDto;

  @ApiProperty({ example: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] })
  @IsArray()
  @IsString({ each: true })
  workingDays: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  exceptions?: {
    date: Date;
    isAvailable: boolean;
  }[];
}

class SettingsDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  instantBooking: boolean;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(0)
  minNotice: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  maxBookingsPerDay: number;
}

export class CreateServiceDto {
  @ApiProperty({ example: 'Profesyonel Ev Temizliği' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Detaylı ev temizlik hizmeti...' })
  @IsString()
  description: string;

  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  categoryId: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 250 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'TRY' })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ type: LocationDto })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
  

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ enum: ServiceStatus })
  @IsEnum(ServiceStatus)
  @IsOptional()
  status?: ServiceStatus;

  @ApiProperty()
  @ValidateNested()
  @Type(() => AvailabilityDto)
  availability: AvailabilityDto;

  @ApiProperty()
  @ValidateNested()
  @Type(() => SettingsDto)
  settings: SettingsDto;
} 