import { EMAIL_VALIDATION_REGEX } from '../../../core/constants';
import { InvalidIdError, InvalidUserEmailError } from '../errors/errors';
import { v4 as uuidv4, validate } from 'uuid';

export class User implements User {
  readonly #id: string;
  #email: string;
  #consents: [];

  constructor({
    id = uuidv4(),
    email,
    consents = [],
  }: {
    id?: string;
    email: string;
    consents?: [];
  }) {
    this.validateEmail(email);
    this.validateId(id);

    this.#id = id;
    this.#email = email;
    this.#consents = consents;
  }

  get id(): string {
    return this.#id;
  }

  get email(): string {
    return this.#email;
  }

  set email(email: string) {
    this.validateEmail(email);
    this.#email = email;
  }

  get consents(): [] {
    return this.#consents;
  }

  set consents(consents: []) {
    this.#consents = consents;
  }

  private validateEmail(email: string): void {
    if (!EMAIL_VALIDATION_REGEX.test(email)) {
      throw new InvalidUserEmailError(email);
    }
  }

  private validateId(id: string): void {
    if (!validate(id)) {
      throw new InvalidIdError(id);
    }
  }
}
