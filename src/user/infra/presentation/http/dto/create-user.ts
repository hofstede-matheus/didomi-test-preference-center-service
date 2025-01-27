import { IUserConsent } from '../../../../../consent/domain/entities/user-consent.entity';

export class CreateUserRequest {
  email: string;
}

export class CreateUserResponse {
  id: string;
  email: string;
  consents: IUserConsent[];
}
