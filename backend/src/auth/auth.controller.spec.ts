import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LoginDto } from './dto/login-auth.dto';
import { Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;

  const mockResponse: Partial<Response> = {
    cookie: jest.fn().mockReturnThis(),
  };

  const loginDto: LoginDto = {
    email: 'test@example.com',
    password: 'password',
  };

  const mockAuthService = {
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('JWT_SECRET'),
            signOptions: { expiresIn: '60m' },
          }),
          inject: [ConfigService],
        }),
      ],
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        JwtStrategy,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('Login', () => {
    it('should return success and set cookie', async () => {
      mockAuthService.login.mockResolvedValue({
        access_token: 'fake-jwt-token',
      });

      const result = await authController.login(
        loginDto,
        mockResponse as Response,
      );

      expect(mockAuthService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual({
        message: 'Login successful',
        statusCode: 200,
      });

      expect(mockResponse.cookie).toHaveBeenCalledWith(
        'access_token',
        'fake-jwt-token',
        expect.objectContaining({
          httpOnly: true,
          expires: expect.any(Date) as Date,
        }),
      );
    });

    it('should throw error if user not found', async () => {
      mockAuthService.login.mockRejectedValue(new Error('USER_NOT_FOUND'));

      await expect(
        authController.login(loginDto, mockResponse as Response),
      ).rejects.toThrow(
        new UnauthorizedException('Email not found or password is incorrect'),
      );
    });
  });
});
