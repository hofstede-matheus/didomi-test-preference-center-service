import { InvalidUserConsentIdError } from '../errors/errors';

const validConsents = ['email_notifications', 'sms_notifications'];
export type ConsentId = 'email_notifications' | 'sms_notifications';

export class UserConsent {
  readonly #id: ConsentId;
  #enabled: boolean;
  #userId: string;

  constructor({
    id,
    enabled,
    userId,
  }: {
    id: ConsentId;
    enabled: boolean;
    userId: string;
  }) {
    this.validateConsentId(id);

    this.#id = id;
    this.#enabled = enabled;
    this.#userId = userId;
  }

  get id(): string {
    return this.#id;
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
}
