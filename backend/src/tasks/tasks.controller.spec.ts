import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './tasks.controller';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthenticatedRequest } from './authenticated-request.interface';
import { NotFoundException } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Status } from './enums/status.enum';

describe('TaskController', () => {
  let controller: TaskController;

  // Mock Data
  const mockCreateTaskDto: CreateTaskDto = {
    title: 'Test Task',
    description: 'Test Description',
  };

  const mockUpdatedTaskDto: UpdateTaskDto = {
    title: 'Updated Task Title',
    description: 'Updated Task Description',
  };

  const mockTaskResponse = {
    id: 'taskID',
    status: 'pending',
    title: 'Test Task',
    description: 'Test Description',
    userId: 'userId',
  };

  const mockTaskId = 'taskID';

  const mockAuthRequest = {
    user: {
      id: 'userId',
      email: 'mock@mock.com',
    },
  } as AuthenticatedRequest;

  const mockTaskService = {
    createTask: jest.fn(),
    findAll: jest.fn(),
    updateTask: jest.fn(),
    findTaskById: jest.fn(),
    removeTask: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    })
      // Mocking JwtAuthGuard
      .overrideGuard(JwtAuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create task', () => {
    it('should create task successfully', async () => {
      mockTaskService.createTask.mockResolvedValue(mockTaskResponse);
      const result = await controller.create(
        mockAuthRequest,
        mockCreateTaskDto,
      );

      expect(mockTaskService.createTask).toHaveBeenCalled();
      expect(result).toMatchObject({
        statusCode: 201,
        message: 'Create task successfully',
        data: mockTaskResponse,
      });
    });

    it('should throw BadRequestException if user id not found', async () => {
      const error = new Error('USER_NOT_FOUND');
      mockTaskService.createTask.mockRejectedValue(error);

      await expect(
        controller.create(mockAuthRequest, mockCreateTaskDto),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });
  });

  describe('Get all tasks', () => {
    it('should return all tasks', async () => {
      const mockAllTasks = [mockTaskResponse];
      mockTaskService.findAll.mockResolvedValue(mockAllTasks);

      const result = await controller.findAll();

      expect(mockTaskService.findAll).toHaveBeenCalled();
      expect(result).toMatchObject({
        statusCode: 200,
        data: mockAllTasks,
      });
    });
  });

  describe('Find task by ID', () => {
    it('should return task by ID', async () => {
      mockTaskService.findTaskById.mockResolvedValue(mockTaskResponse);
      const result = await controller.findOne(mockTaskId);
      expect(mockTaskService.findTaskById).toHaveBeenCalled();
      expect(result).toMatchObject({
        statusCode: 200,
        data: mockTaskResponse,
      });
    });

    it('should throw BadRequestException if task not found', async () => {
      const error = new Error('TASK_NOT_FOUND');
      mockTaskService.findTaskById.mockRejectedValue(error);

      await expect(controller.findOne(mockTaskId)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
    });
  });

  describe('Update task', () => {
    it('should update task successfully', async () => {
      mockTaskService.updateTask.mockResolvedValue({
        ...mockTaskResponse,
        ...mockUpdatedTaskDto,
      });
      const result = await controller.update(mockTaskId, mockUpdatedTaskDto);

      expect(mockTaskService.updateTask).toHaveBeenCalled();
      expect(result).toMatchObject({
        statusCode: 200,
        message: 'Update task successfully',
        data: { ...mockTaskResponse, ...mockUpdatedTaskDto },
      });
    });

    it('should throw BadRequestException if task not found', async () => {
      const error = new Error('TASK_NOT_FOUND');
      mockTaskService.updateTask.mockRejectedValue(error);

      await expect(
        controller.update(mockTaskId, mockUpdatedTaskDto),
      ).rejects.toThrow(new NotFoundException('Task not found'));
    });
  });

  describe('Delete task', () => {
    it('should delete task successfully', async () => {
      mockTaskService.removeTask.mockResolvedValue(true);
      const result = await controller.remove(mockTaskId);

      expect(mockTaskService.removeTask).toHaveBeenCalled();
      expect(result).toMatchObject({
        statusCode: 200,
        message: 'Delete task successfully',
      });
    });

    it('should throw BadRequestException if task not found', async () => {
      const error = new Error('TASK_NOT_FOUND');
      mockTaskService.removeTask.mockRejectedValue(error);

      await expect(controller.remove(mockTaskId)).rejects.toThrow(
        new NotFoundException('Task not found'),
      );
    });
  });

  describe('CreateTaskDto Validation', () => {
    it('should pass validation if tile is not empty', async () => {
      const createDto = plainToInstance(CreateTaskDto, {
        title: 'Test Task',
        description: 'Test Description',
      });
      const error = await validate(createDto);
      expect(error.length).toBe(0);
    });

    it('should fail validation if tile is empty', async () => {
      const createDto = plainToInstance(CreateTaskDto, {
        description: 'Test Description',
      });
      const error = await validate(createDto);
      expect(error.length).toBeGreaterThan(0);
      expect(error[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation if tile,description is not string', async () => {
      const createDto = plainToInstance(CreateTaskDto, {
        title: 1,
        description: 1,
      });
      const error = await validate(createDto);
      expect(error.length).toBeGreaterThan(0);
      expect(error[0].constraints).toHaveProperty('isString');
      expect(error[1].constraints).toHaveProperty('isString');
    });
  });

  describe('UpdateTaskDto Validation', () => {
    it('should pass validation if data is correct', async () => {
      const updateDto = plainToInstance(UpdateTaskDto, {
        title: 'Test Task new',
        description: 'Test Description new',
        status: Status.PENDING,
      });
      const error = await validate(updateDto);
      expect(error.length).toBe(0);
    });

    it('should fail validation if tile,description is not string', async () => {
      const updateDto = plainToInstance(UpdateTaskDto, {
        title: 1,
        description: 1,
        status: Status.PENDING,
      });
      const error = await validate(updateDto);
      expect(error.length).toBeGreaterThan(0);
      expect(error[0].constraints).toHaveProperty('isString');
      expect(error[1].constraints).toHaveProperty('isString');
    });

    it('should fail validation if status is not specified', async () => {
      const updateDto = plainToInstance(UpdateTaskDto, {
        status: 'this is not enum',
      });
      const error = await validate(updateDto);
      expect(error.length).toBeGreaterThan(0);
      expect(error[0].constraints).toHaveProperty('isEnum');
    });
  });
});
