import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../../modules/auth/types/auth.types';

export const CurrentUser = createParamDecorator(
  (data: keyof AuthUser | undefined, ctx: ExecutionContext): AuthUser | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as AuthUser;

    if (data) {
      return user[data];
    }

    return user;
  },
);


// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';

// export const CurrentUser = createParamDecorator(
//   (_data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest<Request>();
//     return request.user;
//   },
// );
