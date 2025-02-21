import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  result: T;
  result_message: {
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  };
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map(data => ({
        result: data,
        result_message: {
          type: 'success',
          title: 'Bilgi',
          message: 'Başarılı'
        }
      })),
    );
  }
} 