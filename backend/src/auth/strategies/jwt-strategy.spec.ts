import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';
import { jwtDto } from '../dto/jwt-auth.dto';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;

  beforeEach(() => {
    const configService = {
      get: jest.fn().mockReturnValue('test-secret'),
    } as unknown as ConfigService;
    jwtStrategy = new JwtStrategy(configService);
  });

  it('should validate payload correctly', () => {
    const payload: jwtDto = { id: 'id', email: 'mock@mock.com' };
    expect(jwtStrategy.validate(payload)).toEqual({
      id: 'id',
      email: 'mock@mock.com',
    });
  });

  it('should throw an error if JWT_SECRET is not defined', () => {
    expect(
      () =>
        new JwtStrategy({
          get: jest.fn().mockReturnValue(null),
        } as unknown as ConfigService),
    ).toThrow('JWT_SECRET is not defined in environment variables!');
  });
});
