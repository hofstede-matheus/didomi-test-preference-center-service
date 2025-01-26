import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from '../../../../domain/repositories/user.repository';
import { UserTypeOrmEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { User } from '../../../../domain/entities/user.entity';

export class TypeOrmUsersRepository implements UserRepository {
  constructor(
    @InjectRepository(UserTypeOrmEntity)
    private readonly shiftsRepository: Repository<UserTypeOrmEntity>,
  ) {}

  async create(user: User): Promise<void> {
    const userEntity = this.shiftsRepository.create(user);
    await this.shiftsRepository.save(userEntity);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.shiftsRepository.findOneBy({ email });
    return user ? new User(user) : null;
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.shiftsRepository.findOne({
      where: { id },
    });
    return user ? new User(user) : null;
  }

  async delete(id: string): Promise<void> {
    await this.shiftsRepository.delete(id);
    return;
  }
}
