import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserConsentRepository } from '../../../../domain/repositories/user-consent.repository';
import { UserConsentTypeOrmEntity } from '../entities/user-consent.entity';
import { UserConsent } from '../../../../domain/entities/user-consent.entity';

export class TypeOrmUserConsentRepository implements UserConsentRepository {
  constructor(
    @InjectRepository(UserConsentTypeOrmEntity)
    private readonly userConsentRepository: Repository<UserConsentTypeOrmEntity>,
  ) {}

  async create(userId: string, consent: UserConsent): Promise<void> {
    const userConsentEntity = this.userConsentRepository.create({
      id: consent.id,
      consentId: consent.consentId,
      enabled: consent.enabled,
      userId,
    });
    await this.userConsentRepository.save(userConsentEntity);
    return;
  }
}
