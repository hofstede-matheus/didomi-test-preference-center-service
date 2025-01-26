import { DomainError } from '../../../core/shared/helpers/errors';

export class InvalidUserEmailError extends DomainError {
  constructor(email: string) {
    super(`The email ${email} is invalid.`);
  }
}

export class InvalidIdError extends DomainError {
  constructor(id: string) {
    super(`The id ${id} is invalid.`);
  }
}

export class UserEmailAlreadyExistsError extends DomainError {
  constructor(email: string) {
    super(`The email ${email} already exists.`);
  }
}
