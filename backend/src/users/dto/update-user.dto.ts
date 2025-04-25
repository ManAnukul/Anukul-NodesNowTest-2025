import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsStrongPassword,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @ApiProperty({
    example: 'M0ck!123',
  })
  declare oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword()
  @ApiProperty({
    description:
      'Strong password (Must be at least 8 characters, include uppercase, lowercase, number, and special character)',
    example: 'M0ck!12345',
  })
  declare newPassword: string;
}
