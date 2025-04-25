import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email (Must be a valid email address)',
    example: 'mock@mock.com',
  })
  declare email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  @ApiProperty({
    description:
      'Strong password (Must be at least 8 characters, include uppercase, lowercase, number, and special character)',
    example: 'M0ck!123',
  })
  declare password: string;
}

export class LoginResponseDto {
  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ example: 'Login successfully' })
  declare message: string;
}

export class LoginFailResponseDto {
  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  declare error: string;

  @ApiProperty({ example: 'Email not found or password is incorrect' })
  declare message: string;
}
