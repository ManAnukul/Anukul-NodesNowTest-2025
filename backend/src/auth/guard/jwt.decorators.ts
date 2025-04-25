import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { jwtDto } from '../dto/jwt-auth.dto';

export const JwtDecorator = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): jwtDto => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as jwtDto;
  },
);
