import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class WorkingHoursDto {
  @ApiProperty({ example: '09:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'Start time must be in HH:mm format',
  })
  start: string;

  @ApiProperty({ example: '18:00' })
  @IsString()
  @Matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: 'End time must be in HH:mm format',
  })
  end: string;
} 