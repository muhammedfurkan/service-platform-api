import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsDate, 
  IsOptional, 
  IsObject,
  IsArray,
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReportType, ReportPeriod } from '../schemas/report.schema';

class FiltersDto {
  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  services?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  providers?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  customers?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  statuses?: string[];
}

export class CreateReportDto {
  @ApiProperty({ example: 'Aylık Gelir Raporu' })
  @IsString()
  title: string;

  @ApiProperty({ enum: ReportType })
  @IsEnum(ReportType)
  type: ReportType;

  @ApiProperty({ enum: ReportPeriod })
  @IsEnum(ReportPeriod)
  period: ReportPeriod;

  @ApiProperty({ example: '2024-01-01' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ example: '2024-01-31' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => FiltersDto)
  @IsOptional()
  filters?: FiltersDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fileType?: string;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: {
    format?: string;
    [key: string]: any;
  };
} 