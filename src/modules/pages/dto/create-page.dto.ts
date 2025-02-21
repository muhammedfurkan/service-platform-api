import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsEnum, 
  IsOptional, 
  IsObject, 
  IsArray,
  IsBoolean,
  IsNumber,
  MinLength,
  ValidateNested 
} from 'class-validator';
import { Type } from 'class-transformer';
import { PageStatus, PageType } from '../schemas/page.schema';

class LayoutDto {
  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  header?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  footer?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  sidebar?: boolean;
}

class SeoDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  keywords?: string[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  ogImage?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  noIndex?: boolean;
}

class PageSectionDto {
  @ApiProperty()
  @IsString()
  type: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty()
  @IsNumber()
  order: number;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  settings?: Record<string, any>;
}

export class CreatePageDto {
  @ApiProperty({ example: 'Hakkımızda' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'hakkimizda' })
  @IsString()
  @MinLength(3)
  slug: string;

  @ApiProperty({ example: 'Sayfa içeriği...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: PageType })
  @IsEnum(PageType)
  type: PageType;

  @ApiPropertyOptional({ enum: PageStatus })
  @IsEnum(PageStatus)
  @IsOptional()
  status?: PageStatus;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  template?: string;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => LayoutDto)
  @IsOptional()
  layout?: LayoutDto;

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SeoDto)
  @IsOptional()
  seo?: SeoDto;

  @ApiPropertyOptional()
  @ValidateNested({ each: true })
  @Type(() => PageSectionDto)
  @IsOptional()
  sections?: PageSectionDto[];
} 