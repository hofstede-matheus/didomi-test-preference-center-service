import { DomainError } from '../../../core/shared/helpers/errors';

export class InvalidUserConsentIdError extends DomainError {
  constructor(id: string) {
    super(`The consent id ${id} is invalid.`);
  }
}

export class InvalidIdError extends DomainError {
  constructor(id: string) {
    super(`The id ${id} is invalid.`);
  }
}
