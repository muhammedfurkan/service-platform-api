import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { 
  IsString, 
  IsNumber, 
  IsMongoId, 
  IsArray, 
  IsOptional, 
  Min, 
  Max,
  MinLength 
} from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsMongoId()
  bookingId: string;

  @ApiProperty({ example: 5, description: 'Rating between 1-5' })
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiProperty({ 
    example: 'Çok memnun kaldım, kesinlikle tavsiye ederim.',
    description: 'Review comment'
  })
  @IsString()
  @MinLength(10)
  comment: string;

  @ApiPropertyOptional({ 
    type: [String],
    example: ['image1.jpg', 'image2.jpg']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  images?: string[];

  @ApiPropertyOptional({ 
    type: [String],
    example: ['profesyonel', 'dakik', 'temiz']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
} 