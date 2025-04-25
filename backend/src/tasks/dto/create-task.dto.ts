import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Required', example: 'Title name' })
  declare title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'Optional', example: 'Description' })
  declare description?: string;
}
