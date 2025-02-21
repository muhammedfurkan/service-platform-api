import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsBoolean,
  IsObject,
  ValidateNested,
  IsNumber,
  IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { SettingType } from '../schemas/setting.schema';

class ValidationDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  required?: boolean;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  min?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  max?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  pattern?: string;
}

class MetadataDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  inputType?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => ValidationDto)
  @IsOptional()
  validation?: ValidationDto;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  group?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  order?: number;
}

export class CreateSettingDto {
  @ApiProperty({ example: 'site.title' })
  @IsString()
  key: string;

  @ApiProperty({ example: 'HizmetBul' })
  @IsString()
  value: string;

  @ApiProperty({ enum: SettingType })
  @IsEnum(SettingType)
  type: SettingType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => MetadataDto)
  @IsOptional()
  metadata?: MetadataDto;
} 