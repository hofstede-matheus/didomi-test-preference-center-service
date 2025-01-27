import { IUserConsent } from '../../../../../consent/domain/entities/user-consent.entity';

export class GetUserRequest {
  id: string;
}

export class GetUserResponse {
  id: string;
  email: string;
  consents: IUserConsent[];
}
