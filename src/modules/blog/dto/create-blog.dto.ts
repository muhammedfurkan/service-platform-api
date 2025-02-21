import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsArray, 
  IsEnum, 
  IsOptional, 
  IsObject,
  MinLength,
  IsUrl 
} from 'class-validator';
import { BlogStatus } from '../schemas/blog.schema';

export class CreateBlogDto {
  @ApiProperty({ example: 'Blog Başlığı' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({ example: 'blog-basligi' })
  @IsString()
  @MinLength(3)
  slug: string;

  @ApiProperty({ example: 'Blog içeriği...' })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({ example: 'Kısa özet...' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  categories?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ enum: BlogStatus })
  @IsEnum(BlogStatus)
  @IsOptional()
  status?: BlogStatus;

  @ApiPropertyOptional()
  @IsObject()
  @IsOptional()
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
  };
} 