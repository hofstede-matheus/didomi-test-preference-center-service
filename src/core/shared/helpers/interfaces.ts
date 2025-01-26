import { HttpException } from '@nestjs/common';
import { DomainError } from './errors';

export interface DomainErrorToHttpExceptionTransform {
  from: DomainError;
  to: HttpException;
  message: string;
}
