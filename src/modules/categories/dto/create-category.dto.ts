import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean, IsNumber, IsMongoId, IsObject } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Ev Temizliği' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'ev-temizligi' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ example: 'Profesyonel ev temizlik hizmetleri' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'fas fa-home' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ example: 'temizlik.jpg' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  order?: number;

  @ApiPropertyOptional({ example: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  metadata?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
} 