import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, IsOptional, IsArray, IsDateString } from 'class-validator';
import { UserRole } from '../../users/schemas/user.schema';

export class RegisterDto {

}