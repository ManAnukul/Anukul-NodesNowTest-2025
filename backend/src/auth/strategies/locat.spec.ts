import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LocalStrategy } from './local.strategy';

describe('LocalStrategy', () => {
  let localStrategy: LocalStrategy;
  let authService: AuthService;

  beforeEach(() => {
    authService = { validateUser: jest.fn() } as unknown as AuthService;
    localStrategy = new LocalStrategy(authService);
  });

  it('should be defined', () => {
    expect(localStrategy).toBeDefined();
  });

  it('should return user if validation is successful', async () => {
    const email = 'mock@mock.com';
    const password = 'M0ck!123';
    const mockUser = { id: 1, email: 'mock@mock.com' };
    authService.validateUser = jest.fn().mockResolvedValue(mockUser);

    const result = await localStrategy.validate(email, password);
    expect(result).toEqual(mockUser);
  });

  it('should throw UnauthorizedException if validation fails', async () => {
    const email = 'test@example.com';
    const password = 'Mock!1234444';
    authService.validateUser = jest.fn().mockResolvedValue(null);

    await expect(localStrategy.validate(email, password)).rejects.toThrow(
      new UnauthorizedException('Email not found or password is incorrect'),
    );
  });
});
