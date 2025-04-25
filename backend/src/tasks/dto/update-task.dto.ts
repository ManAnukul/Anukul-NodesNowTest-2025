import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Status } from '../enums/status.enum';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'New title' })
  declare title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'New description' })
  declare description?: string;

  @IsEnum(Status)
  @IsOptional()
  @ApiProperty({ description: 'Use only enum', example: Status.PROGRESS })
  declare status?: Status;
}
