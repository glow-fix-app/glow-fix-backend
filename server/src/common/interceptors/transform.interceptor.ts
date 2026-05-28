import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return next.handle().pipe(
      map((data) => {
        // If response already has success flag, pass through as-is
        if (data && typeof data === 'object' && 'success' in data) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return
          return data;
        }

        return {
          success: true,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data,
        };
      }),
    );
  }
}

// import {
//   Injectable,
//   NestInterceptor,
//   ExecutionContext,
//   CallHandler,
// } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { map } from 'rxjs/operators';
// import { ApiResponse } from '@glow-fix/types';

// @Injectable()
// export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
//   intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
//     return next.handle().pipe(
//       map((data) => {
//         // If response already has success property, return as-is
//         if (data && typeof data === 'object' && 'success' in data) {
//           return data;
//         }

//         // Check if data contains pagination meta
//         if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
//           return {
//             success: true,
//             data: data.data,
//             meta: data.meta,
//           };
//         }

//         return {
//           success: true,
//           data,
//         };
//       }),
//     );
//   }
// }

