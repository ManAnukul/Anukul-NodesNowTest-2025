import { ApiProperty } from '@nestjs/swagger';
import { TaskData } from './task-data.dto';

export class CreateTaskResponseDto {
  @ApiProperty({
    description: 'The status code of the response',
    example: 201,
  })
  declare statusCode: number;

  @ApiProperty({
    description: 'The message of the response',
    example: 'Create task successfully',
  })
  declare message: string;

  @ApiProperty({
    description: 'The task data',
    type: TaskData,
  })
  declare data: TaskData;
}

export class UnAuthResponseDto {
  @ApiProperty({ example: 401 })
  declare statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  declare error: string;
}
