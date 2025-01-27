import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity('users-consents')
export class UserConsentTypeOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column({ name: 'consent_id' })
  consentId: string;

  @Column()
  enabled: boolean;

  @Column({ name: 'user_id' })
  userId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
