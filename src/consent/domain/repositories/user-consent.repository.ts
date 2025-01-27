import { UserConsent } from '../entities/user-consent.entity';

export interface UserConsentRepository {
  create(userId: string, consent: UserConsent): Promise<void>;
}

export const UserConsentRepository = Symbol('UserConsentRepository');
