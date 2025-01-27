import { Column, CreateDateColumn, Entity } from 'typeorm';

@Entity('users-consents')
export class UserConsentTypeOrmEntity {
  @Column()
  id: string;

  @Column()
  enabled: boolean;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}
