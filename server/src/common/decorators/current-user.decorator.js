"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = void 0;
var common_1 = require("@nestjs/common");
exports.CurrentUser = (0, common_1.createParamDecorator)(function (data, ctx) {
    var request = ctx.switchToHttp().getRequest();
    var user = request.user;
    if (data) {
        return user[data];
    }
    return user;
});
// import { createParamDecorator, ExecutionContext } from '@nestjs/common';
// import { Request } from 'express';
// export const CurrentUser = createParamDecorator(
//   (_data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest<Request>();
//     return request.user;
//   },
// );
