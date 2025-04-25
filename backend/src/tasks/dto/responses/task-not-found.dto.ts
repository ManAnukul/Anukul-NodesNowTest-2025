import { ApiProperty } from '@nestjs/swagger';

export class TaskNotFoundResponseDto {
  @ApiProperty({ example: 404 })
  declare statusCode: number;

  @ApiProperty({ example: 'Not Found' })
  declare error: string;

  @ApiProperty({ example: 'Task not found' })
  declare message: string;
}
