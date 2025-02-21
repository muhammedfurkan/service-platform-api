import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ProviderResponseDto {
  @ApiProperty({ 
    example: 'Değerlendirmeniz için teşekkür ederim.',
    description: 'Provider response to the review'
  })
  @IsString()
  @MinLength(5)
  comment: string;
} 