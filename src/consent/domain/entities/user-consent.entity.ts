import { InvalidIdError, InvalidUserConsentIdError } from '../errors/errors';
import { v4 as uuidv4, validate } from 'uuid';

const validConsents = ['email_notifications', 'sms_notifications'];
export type ConsentId = 'email_notifications' | 'sms_notifications';

export interface IUserConsent {
  id: ConsentId;
  enabled: boolean;
}

export class UserConsent {
  readonly #id: string;
  #consentId: ConsentId;
  #enabled: boolean;
  #userId: string;

  constructor({
    id = uuidv4(),
    consentId,
    enabled,
    userId,
  }: {
    id?: string;
    consentId: ConsentId;
    enabled: boolean;
    userId: string;
  }) {
    this.validateId(id);
    this.validateConsentId(consentId);

    this.#id = id;
    this.#consentId = consentId;
    this.#enabled = enabled;
    this.#userId = userId;
  }

  get id(): string {
    return this.#id;
  }

  get consentId(): string {
    return this.#consentId;
  }

  set consentId(consentId: string) {
    this.validateConsentId(consentId as ConsentId);
    this.#consentId = consentId as ConsentId;
  }

  get enabled(): boolean {
    return this.#enabled;
  }

  set enabled(enabled: boolean) {
    this.#enabled = enabled;
  }

  get userId(): string {
    return this.#userId;
  }

  set userId(userId: string) {
    this.#userId = userId;
  }

  validateConsentId(id: ConsentId): void {
    if (!validConsents.some((consent) => consent === id)) {
      throw new InvalidUserConsentIdError(id);
    }
  }

  validateId(id: string): void {
    if (!validate(id)) {
      throw new InvalidIdError(id);
    }
  }
}
