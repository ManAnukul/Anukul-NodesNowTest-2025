import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthenticatedRequest } from './authenticated-request.interface';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  CreateTaskResponseDto,
  UnAuthResponseDto,
} from './dto/responses/create-task-response.dto';
import { TaskNotFoundResponseDto } from './dto/responses/task-not-found.dto';
import {
  DeleteTaskResponseDto,
  GetAllTaskResponseDto,
  GetTaskResponseDto,
  UpdateTaskResponseDto,
} from './dto/responses/task-response';
@Controller('tasks')
@UseGuards(JwtAuthGuard)
@ApiCookieAuth()
@ApiTags('Task (Require Login)')
@ApiUnauthorizedResponse({
  description: 'Authentication required',
  type: UnAuthResponseDto,
})
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Use to create a new task.' })
  @ApiCreatedResponse({
    description: 'Create task success',
    type: CreateTaskResponseDto,
  })
  @Post()
  async create(
    @Request() req: AuthenticatedRequest,
    @Body() body: CreateTaskDto,
  ): Promise<CreateTaskResponseDto | TaskNotFoundResponseDto | undefined> {
    try {
      const task = await this.taskService.createTask(req.user.id, body);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Create task successfully',
        data: task,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'USER_NOT_FOUND') {
        throw new NotFoundException('User not found');
      }
    }
  }

  @ApiOperation({ summary: 'Use to get all tasks for the authenticated user' })
  @ApiOkResponse({
    description: 'Response all task',
    type: GetAllTaskResponseDto,
  })
  @Get()
  async findAll(): Promise<GetAllTaskResponseDto> {
    const allTask = await this.taskService.findAll();
    return {
      statusCode: HttpStatus.OK,
      data: allTask,
    };
  }

  @ApiOperation({ summary: 'Use to get details of a specific task' })
  @ApiOkResponse({
    description: 'Response specific task',
    type: GetTaskResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
    type: TaskNotFoundResponseDto,
  })
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<GetTaskResponseDto | TaskNotFoundResponseDto | undefined> {
    try {
      const task = await this.taskService.findTaskById(id);
      return { statusCode: HttpStatus.OK, data: task };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new NotFoundException('Task not found');
      }
    }
  }

  @ApiOperation({
    summary: 'Use to update a task (title, description, status)',
  })
  @ApiOkResponse({
    description: 'Update task success',
    type: UpdateTaskResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
    type: TaskNotFoundResponseDto,
  })
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<UpdateTaskResponseDto | TaskNotFoundResponseDto | undefined> {
    try {
      const newTask = await this.taskService.updateTask(id, updateTaskDto);
      return {
        statusCode: HttpStatus.OK,
        message: 'Update task successfully',
        data: newTask,
      };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new NotFoundException('Task not found');
      }
    }
  }

  @ApiOperation({ summary: 'Use to delete a specific task' })
  @ApiOkResponse({
    description: 'Delete task success',
    type: DeleteTaskResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Task not found',
    type: TaskNotFoundResponseDto,
  })
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<DeleteTaskResponseDto | TaskNotFoundResponseDto | undefined> {
    try {
      await this.taskService.removeTask(id);
      return { statusCode: HttpStatus.OK, message: 'Delete task successfully' };
    } catch (error) {
      const err = error as Error;
      if (err.message === 'TASK_NOT_FOUND') {
        throw new NotFoundException('Task not found');
      }
    }
  }
}
