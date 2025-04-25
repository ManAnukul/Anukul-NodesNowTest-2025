import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    description: 'Email (Must be a valid email address)',
    example: 'mock@mock.com',
  })
  declare email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  @ApiProperty({
    description:
      'Strong password (Must be at least 8 characters, include uppercase, lowercase, number, and special character)',
    example: 'M0ck!123',
  })
  declare password: string;
}

export class CreateUserResponseDto {
  @ApiProperty({ example: 201 })
  declare statusCode: number;

  @ApiProperty({ example: 'Create user successfully' })
  declare message: string;

  @ApiProperty({
    example: {
      id: '0a4c2f87-9ac7-4cd3-90db-59ee4d3bc8e1',
      email: 'mock@mock.com',
    },
  })
  declare data: { id: string; email: string };
}

export class ErrorResponseDto {
  @ApiProperty({ example: 400 })
  declare statusCode: number;

  @ApiProperty({ example: 'Bad Request' })
  declare error: string;

  @ApiProperty({ example: 'Email already in use' })
  declare message: string;
}

export class UserNotFoundResponseDto {
  @ApiProperty({ example: 404 })
  declare statusCode: number;

  @ApiProperty({ example: 'Not Found' })
  declare error: string;

  @ApiProperty({ example: 'User not found' })
  declare message: string;
}

export class updateUserResponseDto {
  @ApiProperty({
    example: 200,
  })
  declare statusCode: number;

  @ApiProperty({
    example: 'Change password successfully',
  })
  declare message: string;
}

export class UserResponseDto {
  @ApiProperty({
    example: 200,
  })
  declare statusCode: number;

  @ApiProperty({
    type: Object,
    example: {
      id: '1',
      email: 'user@example.com',
      password: '',
      createdAt: '2025-04-01T12:00:00Z',
      updatedAt: '2025-04-01T12:00:00Z',
    },
  })
  declare data: {
    id: string;
    email: string;
    password: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

export class UserDeleteResponseDto {
  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ example: 'Delete user successfully' })
  declare message: string;
}

export class OldPwdIncorrectResponseDto {
  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: 'Old password is incorrect' })
  declare message: string;

  @ApiProperty({ example: 'Unauthorized' })
  declare error: string;
}

export class ProfileResponseDto {
  @ApiProperty({
    example: 200,
  })
  declare statusCode: number;

  @ApiProperty({
    type: Object,
    example: {
      id: '1',
      email: 'user@example.com',
      createdAt: '2025-04-01T12:00:00Z',
      updatedAt: '2025-04-01T12:00:00Z',
    },
  })
  declare data: {
    id: string;
    email: string;
    createdAt?: string;
    updatedAt?: string;
  };
}
