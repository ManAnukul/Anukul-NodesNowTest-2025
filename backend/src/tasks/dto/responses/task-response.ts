import { ApiProperty } from '@nestjs/swagger';
import { TaskData } from './task-data.dto';

export class GetAllTaskResponseDto {
  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ type: TaskData, isArray: true }) // isArray: true ระบุว่านี่เป็น array
  declare data: TaskData[];
}

export class GetTaskResponseDto {
  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ type: TaskData })
  declare data: TaskData;
}

export class UpdateTaskResponseDto {
  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ example: 'Update task successfully' })
  declare message: string;

  @ApiProperty({ type: TaskData })
  declare data: TaskData;
}

export class DeleteTaskResponseDto {
  @ApiProperty({ example: 200 })
  declare statusCode: number;

  @ApiProperty({ example: 'Delete task successfully' })
  declare message: string;
}
