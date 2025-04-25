import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './users.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './entities/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;
  let userId: string;
  let userEmail: string;
  let userBody: object;
  const mockUser: CreateUserDto = {
    email: 'mock@mock.com',
    password: 'M0ck123!',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        DatabaseModule,
        SequelizeModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('Create user', () => {
    it('should return the user after create user', async () => {
      const expectUser = {
        id: expect.any(String) as string,
        email: 'mock@mock.com',
      };

      const result = await service.createUser(mockUser);
      userId = result.id;
      userEmail = result.email;
      userBody = result;
      expect(result).toMatchObject(expectUser);
    });

    it('should throw error user is already exist', async () => {
      await expect(service.createUser(mockUser)).rejects.toThrow(
        Error('EMAIL_ALREADY_IN_USE'),
      );
    });
  });

  describe('Find user', () => {
    it('should return user if find user by email', async () => {
      const user = await service.findUserByEmail(userEmail);
      expect(user).toMatchObject(userBody);
    });

    it('should return user if find user by id', async () => {
      const user = await service.findUserById(userId);
      expect(user).toMatchObject(userBody);
    });
  });

  describe('Change passwrod', () => {
    it('should return user if change password success', async () => {
      const changPwd: UpdateUserDto = {
        oldPassword: 'M0ck123!',
        newPassword: 'M0ck12345!',
      };
      const user = await service.changePassoword(userId, changPwd);

      expect(user).toMatchObject(userBody);
    });

    it('should throw error if user id not found', async () => {
      const changPwd: UpdateUserDto = {
        oldPassword: 'M0ck123!',
        newPassword: 'M0ck12345!',
      };

      await expect(
        service.changePassoword('notFound', changPwd),
      ).rejects.toThrow(Error('USER_NOT_FOUND'));
    });

    it('should throw error if old password is incorrect', async () => {
      const changPwd: UpdateUserDto = {
        oldPassword: 'M0ck1233132321312!',
        newPassword: 'M0ck12345!',
      };

      await expect(service.changePassoword(userId, changPwd)).rejects.toThrow(
        Error('OLD_PASSWORD_IS_INCIRRECT'),
      );
    });
  });

  describe('Remove user', () => {
    it('should return user deleted', async () => {
      const userDel = await service.removeUser(userId);
      expect(userDel).toMatchObject(userBody);
    });

    it('should throw error if user id not found', async () => {
      await expect(service.removeUser(userId)).rejects.toThrow(
        Error('USER_NOT_FOUND'),
      );
    });
  });
});
