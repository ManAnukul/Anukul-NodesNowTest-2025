import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UserService } from './users.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthenticatedRequest } from 'src/tasks/authenticated-request.interface';

describe('UserController', () => {
  let userController: UserController;

  const createUserDto: CreateUserDto = {
    email: 'mock@mock.com',
    password: 'M0ck123!',
  };

  const mockResponse = {
    statusCode: 201,
    message: 'Create user successfully',
    data: {
      id: '1',
      email: 'mock@mock.com',
    },
  };

  const mockAuthRequest = {
    user: {
      id: 'userId',
      email: 'mock@mock.com',
    },
  } as AuthenticatedRequest;

  const mockUserService = {
    createUser: jest.fn(),
    changePassoword: jest.fn(),
    findUserById: jest.fn(),
    removeUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('Create user', () => {
    it('should create a user successfully', async () => {
      mockUserService.createUser.mockResolvedValue(mockResponse.data);

      const result = await userController.createUser(createUserDto);
      expect(mockUserService.createUser).toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const mockResponse = new Error('EMAIL_ALREADY_IN_USE');
      mockUserService.createUser.mockRejectedValue(mockResponse);

      expect(mockUserService.createUser).toHaveBeenCalled();
      await expect(userController.createUser(createUserDto)).rejects.toThrow(
        new BadRequestException('Email already in use'),
      );
    });
  });

  describe('Change password', () => {
    it('should return change password success', async () => {
      mockUserService.changePassoword.mockResolvedValue({
        statusCode: 200,
        message: 'Change password successfully',
      });

      const changPwd: UpdateUserDto = {
        oldPassword: 'M0ck123!',
        newPassword: 'M0ck12345!',
      };

      const result = await userController.updateUser(mockAuthRequest, changPwd);
      expect(mockUserService.changePassoword).toHaveBeenCalled();
      expect(result).toMatchObject({
        statusCode: 200,
        message: 'Change password successfully',
      });
    });

    it('should throw NotFoundException if user id not found', async () => {
      const mockResponse = new Error('USER_NOT_FOUND');
      mockUserService.changePassoword.mockRejectedValue(mockResponse);

      const changPwd: UpdateUserDto = {
        oldPassword: 'M0ck123!',
        newPassword: 'M0ck12345!',
      };
      expect(mockUserService.createUser).toHaveBeenCalled();
      await expect(
        userController.updateUser(mockAuthRequest, changPwd),
      ).rejects.toThrow(new NotFoundException('User not found'));
    });

    it('should throw UnauthorizedException if old password is incorrect', async () => {
      const mockResponse = new Error('OLD_PASSWORD_IS_INCIRRECT');
      mockUserService.changePassoword.mockRejectedValue(mockResponse);

      const changPwd: UpdateUserDto = {
        oldPassword: 'M0ck123131231223!',
        newPassword: 'M0ck12345!',
      };
      expect(mockUserService.createUser).toHaveBeenCalled();
      await expect(
        userController.updateUser(mockAuthRequest, changPwd),
      ).rejects.toThrow(new UnauthorizedException('Old password is incorrect'));
    });
  });

  describe('Get user by id', () => {
    it('should return user', async () => {
      const mockResponse = {
        id: '1',
        email: 'user@example.com',
        password: 'hashedpassword123',
        createdAt: '2025-04-01T12:00:00Z',
      };
      mockUserService.findUserById.mockResolvedValue(mockResponse);

      const result = await userController.getUserbyId('1');
      expect(result).toMatchObject({
        statusCode: 200,
        data: {
          id: '1',
          email: 'user@example.com',
          createdAt: '2025-04-01T12:00:00Z',
        },
      });
    });

    it('should throw NotFoundException if user id not found', async () => {
      const mockResponse = new Error('USER_NOT_FOUND');
      mockUserService.findUserById.mockRejectedValue(mockResponse);

      await expect(userController.getUserbyId('1')).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });

  describe('Remove user', () => {
    it('should retun delete success', async () => {
      mockUserService.removeUser.mockResolvedValue({
        statusCode: 200,
        message: 'Delete user successfully',
      });

      const result = await userController.deleteUser('1');
      expect(result).toMatchObject({
        statusCode: 200,
        message: 'Delete user successfully',
      });
    });

    it('should throw NotFoundException if user id not found', async () => {
      const mockResponse = new Error('USER_NOT_FOUND');
      mockUserService.removeUser.mockRejectedValue(mockResponse);

      await expect(userController.deleteUser('1')).rejects.toThrow(
        new NotFoundException('User not found'),
      );
    });
  });

  describe('CreateUserDto Validation', () => {
    it('should pass validation if data is correct', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 'M0ck123!',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBe(0);
    });

    it('should fail validation if password is empty', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: '',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation if password is not strong', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 'password',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isStrongPassword');
    });

    it('should fail validation if password is less than 8 characters', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 'pass',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('minLength');
    });

    it('should fail validation if email is invalid', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'invalid-email',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isEmail');
    });

    it('should fail validation if email is empty', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: '',
        password: 'M0ck123!',
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isNotEmpty');
    });

    it('should fail validation if password is not string', async () => {
      const createDto = plainToInstance(CreateUserDto, {
        email: 'mock@mock.com',
        password: 111111,
      });

      const errors = await validate(createDto);
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].constraints).toHaveProperty('isString');
    });
  });
});
