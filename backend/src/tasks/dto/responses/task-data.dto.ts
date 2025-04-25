import { ApiProperty } from '@nestjs/swagger';

export class TaskData {
  @ApiProperty({ example: 'fd2b3927-8413-45a8-9fdb-df8021c62f66' })
  declare id: string;

  @ApiProperty({ example: 'pending' })
  declare status: string;

  @ApiProperty({ example: 'Title name' })
  declare title: string;

  @ApiProperty({ example: 'Description' })
  declare description: string;

  @ApiProperty({ example: '0a4c2f87-9ac7-4cd3-90db-59ee4d3bc8e1' })
  declare userId: string;

  @ApiProperty({ example: '2025-03-31T10:27:59.300Z' })
  declare updatedAt?: string;

  @ApiProperty({ example: '2025-03-31T10:27:59.300Z' })
  declare createdAt?: string;
}
