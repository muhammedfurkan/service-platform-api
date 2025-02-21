import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { Error } from 'mongoose';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error: any = exception;

    // Detaylı hata loglaması
    this.logger.error(`Exception caught:`, {
      exception,
      path: request?.url,
      method: request?.method,
      body: request?.body,
      query: request?.query,
      params: request?.params,
      stack: exception instanceof Error ? exception.stack : undefined
    });

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const response = exception.getResponse() as any;
      message = response.message || exception.message;
      error = response;
    } 
    else if (exception instanceof Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = 'Validation error';
      error = {
        type: 'ValidationError',
        details: exception.errors
      };
    }
    else if (exception instanceof Error) {
      message = exception.message;
      error = {
        type: exception.name,
        message: exception.message,
        stack: process.env.NODE_ENV === 'development' ? exception.stack : undefined
      };
    }

    try {
      response.status(status).json({
        result: null,
        result_message: {
          type: 'error',
          title: 'Hata',
          message: message,
        },
        error: process.env.NODE_ENV === 'development' ? error : undefined
      });
    } catch (err) {
      this.logger.error('Error sending response:', err);
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        result: null,
        result_message: {
          type: 'error',
          title: 'Sistem Hatası',
          message: 'Beklenmeyen bir hata oluştu'
        }
      });
    }
  }
} 