import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { UserTypeOrmEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';
import { ConsentId } from '../../../../../consent/domain/entities/user-consent.entity';

export class TypeOrmUsersRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly repository: Repository<UserTypeOrmEntity>,
  ) {}

  async create(user: User): Promise<void> {
    const userEntity = this.repository.create(user);
    await this.repository.save(userEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const queryResults: {
      id: string;
      email: string;
      consents: {
        consent_id: string;
        enabled: boolean;
      }[];
    }[] = await this.repository.query(
      `
      SELECT
        u.id,
        u.email,
        COALESCE(
          array_agg (
            json_build_object ('consent_id', uc.consent_id, 'enabled', uc.enabled)
          ) FILTER (WHERE uc.consent_id IS NOT NULL),
          '{}'
        ) as consents
      FROM
        users u
        LEFT JOIN LATERAL (
          SELECT DISTINCT
            ON (consent_id) consent_id,
            id,
            enabled,
            user_id
          FROM
            "users-consents"
          WHERE
            user_id = u.id
            AND consent_id IN ('email_notifications', 'sms_notifications')
          ORDER BY
            consent_id,
            created_at DESC
        ) uc ON true
      WHERE
        u.email = $1
      GROUP BY
        u.id,
        u.email;
      `,
      [email],
    );

    return queryResults.length
      ? new User({
          id: queryResults[0].id,
          email: queryResults[0].email,
          consents: queryResults[0].consents.map((consent) => {
            return {
              id: consent.consent_id as ConsentId,
              enabled: consent.enabled,
            };
          }),
        })
      : null;
  }

  async findById(id: string): Promise<User | null> {
    const queryResults: {
      id: string;
      email: string;
      consents: {
        consent_id: string;
        enabled: boolean;
      }[];
    }[] = await this.repository.query(
      `
      SELECT
        u.id,
        u.email,
        COALESCE(
          array_agg (
            json_build_object ('consent_id', uc.consent_id, 'enabled', uc.enabled)
          ) FILTER (WHERE uc.consent_id IS NOT NULL),
          '{}'
        ) as consents
      FROM
        users u
        LEFT JOIN LATERAL (
          SELECT DISTINCT
            ON (consent_id) consent_id,
            id,
            enabled,
            user_id
          FROM
            "users-consents"
          WHERE
            user_id = u.id
            AND consent_id IN ('email_notifications', 'sms_notifications')
          ORDER BY
            consent_id,
            created_at DESC
        ) uc ON true
      WHERE
        u.id = $1
      GROUP BY
        u.id,
        u.email;
      `,
      [id],
    );

    return queryResults.length
      ? new User({
          id: queryResults[0].id,
          email: queryResults[0].email,
          consents: queryResults[0].consents.map((consent) => {
            return {
              id: consent.consent_id as ConsentId,
              enabled: consent.enabled,
            };
          }),
        })
      : null;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
    return;
  }
}
