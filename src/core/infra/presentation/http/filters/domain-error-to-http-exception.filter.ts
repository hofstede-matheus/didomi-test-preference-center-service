import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import {
  InvalidIdError,
  InvalidUserEmailError,
  UserEmailAlreadyExistsError,
  UserNotFoundError,
} from '../../../../../user/domain/errors/errors';
import { Response } from 'express';
import { InvalidUserConsentIdError } from '../../../../../consent/domain/errors/errors';

@Catch()
export class DomainErrorToHttpExceptionFilter implements ExceptionFilter {
  readonly #logger: Logger = new Logger(DomainErrorToHttpExceptionFilter.name);

  catch(
    exception: Error,
    host: Pick<ArgumentsHost, 'switchToHttp' | 'getArgs'>,
  ) {
    const response: Response = host.switchToHttp().getResponse<Response>();
    const args: { method: string; originalUrl: string }[] = host.getArgs();

    const error = this.transformError(exception);

    if (error.getStatus() === 500)
      this.#logger.error(
        `Error happened on route ${JSON.stringify({
          method: args[0]?.method,
          url: args[0]?.originalUrl,
          exception: {
            name: exception.name,
            message: exception.message,
            stack: exception.stack,
          },
        })}`,
      );

    response.status(error.getStatus()).json(error.getResponse());
  }

  private transformError(exception: Error): HttpException {
    switch (exception.constructor) {
      case InvalidUserEmailError:
        return new HttpException({ message: exception.message }, 422);

      case InvalidIdError:
        return new HttpException({ message: exception.message }, 422);

      case UserEmailAlreadyExistsError:
        return new HttpException({ message: exception.message }, 422);

      case UserNotFoundError:
        return new HttpException({ message: exception.message }, 404);

      case InvalidUserConsentIdError:
        return new HttpException({ message: exception.message }, 422);

      default:
        return new HttpException({ message: 'Internal server error' }, 500);
    }
  }
}
