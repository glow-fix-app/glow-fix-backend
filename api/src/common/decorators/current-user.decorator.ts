import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@glow-fix/types';

export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | unknown => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

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
