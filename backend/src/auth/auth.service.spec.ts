import { CreateUserDto } from './../users/dto/create-user.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/users.service';
import { UserModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/entities/users.entity';
import { JwtService } from '@nestjs/jwt';
// import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService; // Mock UsersService
  // let JwtService: JwtService;
  let userId: string;

  const createUserDto: CreateUserDto = {
    email: 'mock1@mock.com',
    password: 'M0ck!123',
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SequelizeModule.forFeature([User]),
      ],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mocked-jwt') },
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('Validate user', () => {
    it('should pass validate user password is correct', async () => {
      const userRes = await userService.createUser(createUserDto);
      userId = userRes.id;

      const result = await authService.validateUser(
        createUserDto.email,
        createUserDto.password,
      );
      expect(result).toBeDefined();
      expect(result?.email).toBe(userRes.email);
    });

    it('should fail validate user password is not correct', async () => {
      const result = await authService.validateUser(
        'mock1@mock.com',
        'Password!123',
      );
      expect(result).toBeDefined();
      expect(result).toBe(null);
    });
  });

  describe('Login', () => {
    it('should return access token', async () => {
      const result = await authService.login(createUserDto);

      expect(result.access_token).toBe('mocked-jwt');
    });

    it('should throw error if user not found', async () => {
      await expect(
        authService.login({
          email: 'mockNotFound@mock.com',
          password: 'M0ck!123',
        }),
      ).rejects.toThrow(new Error('USER_NOT_FOUND'));
    });
  });

  afterAll(async () => {
    await userService.removeUser(userId);
  });
});
