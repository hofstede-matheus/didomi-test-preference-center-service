import { Inject, Injectable } from '@nestjs/common';
import { UseCase } from '../../../core/shared/helpers/usecase';
import { UserConsentRepository } from '../../domain/repositories/user-consent.repository';
import { UserRepository } from '../../../user/domain/repositories/user.repository';
import { UserNotFoundError } from '../../../user/domain/errors/errors';
import {
  ConsentId,
  UserConsent,
} from '../../domain/entities/user-consent.entity';
import { validate } from 'uuid';

interface UpdateUserConsentUseCaseInput {
  user: {
    id: string;
  };
  consents: {
    id: string;
    enabled: boolean;
  }[];
}

@Injectable()
export class UpdateUserConsentUseCase implements UseCase {
  constructor(
    @Inject(UserConsentRepository)
    private readonly userConsentRepository: UserConsentRepository,
    @Inject(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(input: UpdateUserConsentUseCaseInput): Promise<void> {
    if (!validate(input.user.id)) {
      throw new UserNotFoundError(input.user.id);
    }

    const user = await this.userRepository.findById(input.user.id);

    if (!user) {
      throw new UserNotFoundError(input.user.id);
    }

    const arrayOfConsentsToBeUpdated: UserConsent[] = input.consents.map(
      (consent) =>
        new UserConsent({
          consentId: consent.id as ConsentId,
          enabled: consent.enabled,
          userId: user.id,
        }),
    );

    await Promise.all(
      arrayOfConsentsToBeUpdated.map((consent) =>
        this.userConsentRepository.create(user.id, consent),
      ),
    );
  }
}
