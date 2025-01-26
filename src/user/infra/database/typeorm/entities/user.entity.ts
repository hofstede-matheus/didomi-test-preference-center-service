import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('users')
export class UserTypeOrmEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  email: string;
}
