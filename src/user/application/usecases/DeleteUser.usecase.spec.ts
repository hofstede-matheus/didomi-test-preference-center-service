import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '../../domain/repositories/user.repository';
import { DeleteUserUseCase } from './DeleteUser.usecase';
import { v4 as uuidv4 } from 'uuid';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let userRepository: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserUseCase,
        {
          provide: UserRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    deleteUserUseCase = module.get<DeleteUserUseCase>(DeleteUserUseCase);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  it('should delete a user', async () => {
    // Arrange
    const validId = uuidv4();
    jest.spyOn(userRepository, 'delete').mockResolvedValueOnce();

    // Act
    await deleteUserUseCase.execute(validId);

    // Assert
    expect(userRepository.delete).toHaveBeenCalledTimes(1);
  });

  it('should delete a user with an invalid, but not call repository', async () => {
    // Arrange
    const validId = 'valid-id';
    jest.spyOn(userRepository, 'delete').mockResolvedValueOnce();

    // Act
    await deleteUserUseCase.execute(validId);

    // Assert
    expect(userRepository.delete).toHaveBeenCalledTimes(0);
  });
});
