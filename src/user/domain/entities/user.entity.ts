import { IUserConsent } from '../../../consent/domain/entities/user-consent.entity';
import { EMAIL_VALIDATION_REGEX } from '../../../core/constants';
import { InvalidIdError, InvalidUserEmailError } from '../errors/errors';
import { v4 as uuidv4, validate } from 'uuid';

export class User {
  readonly #id: string;
  #email: string;
  #consents: IUserConsent[];

  constructor({
    id = uuidv4(),
    email,
    consents = [],
  }: {
    id?: string;
    email: string;
    consents?: IUserConsent[];
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

  get consents(): IUserConsent[] {
    return this.#consents;
  }

  set consents(consents: IUserConsent[]) {
    this.#consents = consents;
  }

  validateEmail(email: string): void {
    if (!EMAIL_VALIDATION_REGEX.test(email)) {
      throw new InvalidUserEmailError(email);
    }
  }

  validateId(id: string): void {
    if (!validate(id)) {
      throw new InvalidIdError(id);
    }
  }
}
