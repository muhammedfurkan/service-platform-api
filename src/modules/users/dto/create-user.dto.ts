import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, IsArray, MinLength } from 'class-validator';
import { UserRole } from '../schemas/user.schema';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  confirmPassword: string;

  @ApiProperty({ example: '5551234567' })
  @IsString()
  phone: string;

  @ApiProperty({ enum: UserRole, example: UserRole.CUSTOMER })
  @IsEnum(UserRole)
  userType: UserRole;

  @ApiProperty({ example: 'John' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsString()
  birthDate: string;

  @ApiProperty({ 
    enum: ['Location1', 'Location2', 'Location3'],
    example: ['Location1'],
    isArray: true 
  })
  @IsArray()
  @IsEnum(['Location1', 'Location2', 'Location3'], { each: true })
  selectedLocations: string[];

  @ApiProperty({ example: ['Category1'], isArray: true })
  @IsArray()
  @IsString({ each: true })
  selectedCategories: string[];

  @ApiProperty({ 
    enum: ['Document1', 'Document2', 'Document3'],
    example: ['Document1'],
    isArray: true 
  })
  @IsArray()
  @IsEnum(['Document1', 'Document2', 'Document3'], { each: true })
  selectedDocuments: string[];
}