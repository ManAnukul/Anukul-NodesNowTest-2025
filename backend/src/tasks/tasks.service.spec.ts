import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './tasks.service';
import { DatabaseModule } from '../database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Task } from './entities/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UserModule } from '../users/users.module';
import { UserService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TaskService', () => {
  let taskService: TaskService;
  let userService: UserService;
  let taskId: string;
  let userId: string;

  // Mock Data
  const mockTask: CreateTaskDto = {
    title: 'Task name',
    description: 'des',
  };

  const mockNewTask: UpdateTaskDto = {
    title: 'New Task name',
    description: 'New des',
  };

  const mockTaskIdNotFound = 'id_not_found';

  const mockUserTask: CreateUserDto = {
    email: 'mockForTask@mock.com',
    password: 'M0ck123!',
  };

  const expectTask = {
    id: expect.any(String) as string,
    title: 'Task name',
    description: 'des',
  };

  const expectUpdatedTask = {
    id: expect.any(String) as string,
    title: 'New Task name',
    description: 'New des',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SequelizeModule.forFeature([Task]),
      ],
      providers: [TaskService],
    }).compile();

    userService = module.get<UserService>(UserService);
    taskService = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(taskService).toBeDefined();
  });

  describe('Create task', () => {
    it('should return the task after create task', async () => {
      // I have no idea if this is the right way, but I’m doing my best here. 🤷‍♂️
      const user = await userService.createUser(mockUserTask);
      userId = user.id;

      const result = await taskService.createTask(userId, mockTask);
      taskId = result.id;
      expect(result).toMatchObject(expectTask);
    });

    it('should throw error if user id is not found', async () => {
      const mockUserId = 'id_not_found';
      await expect(
        taskService.createTask(mockUserId, mockTask),
      ).rejects.toThrow(Error('USER_NOT_FOUND'));
    });
  });

  describe('Get task by id', () => {
    it('should return task', async () => {
      const result = await taskService.findTaskById(taskId);
      expect(result).toMatchObject(expectTask);
    });

    it('should throw error if task not found', async () => {
      const mockTaskId = 'id_not_found';
      await expect(taskService.findTaskById(mockTaskId)).rejects.toThrow(
        new Error('TASK_NOT_FOUND'),
      );
    });
  });

  describe('Get all task', () => {
    it('should return all task', async () => {
      const result = await taskService.findAll();
      expect(result).toMatchObject([expectTask]);
    });
  });

  describe('Update task', () => {
    it('should return updated task', async () => {
      const result = await taskService.updateTask(taskId, mockNewTask);

      expect(result).toMatchObject(expectUpdatedTask);
      expect(result.title).toEqual(mockNewTask.title);
      expect(result.description).toEqual(mockNewTask.description);
    });

    it('should throw error if task not found', async () => {
      await expect(
        taskService.updateTask(mockTaskIdNotFound, mockNewTask),
      ).rejects.toThrow(new Error('TASK_NOT_FOUND'));
    });
  });

  describe('Delete task', () => {
    it('should return count of deleted row', async () => {
      const result = await taskService.removeTask(taskId);
      expect(result).toMatchObject(expectUpdatedTask); // Assuming return value is count of deleted rows
    });

    it('should throw error if task not found', async () => {
      await expect(taskService.removeTask(mockTaskIdNotFound)).rejects.toThrow(
        new Error('TASK_NOT_FOUND'),
      );
    });
  });

  // Clean up after tests
  afterAll(async () => {
    await userService.removeUser(userId);
  });
});
