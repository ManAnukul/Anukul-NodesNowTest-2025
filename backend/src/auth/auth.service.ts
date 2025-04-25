import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login-auth.dto';
import { User } from 'src/users/entities/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userService.findUserByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }

    return null;
  }

  async login(user: LoginDto): Promise<{ access_token: string }> {
    const result = await this.userService.findUserByEmail(user.email);
    if (!result) {
      throw new Error('USER_NOT_FOUND');
    }
    const payload = { email: user.email, id: result.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }
}
