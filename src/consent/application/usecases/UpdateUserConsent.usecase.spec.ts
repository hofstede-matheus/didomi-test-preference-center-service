import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUserConsentUseCase } from './UpdateUserConsent.usecase';
import { UserConsentRepository } from '../../domain/repositories/user-consent.repository';
import { UserRepository } from '../../../user/domain/repositories/user.repository';
import { UserNotFoundError } from '../../../user/domain/errors/errors';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../../user/domain/entities/user.entity';
import { InvalidUserConsentIdError } from '../../domain/errors/errors';

describe('UpdateUserConsentUseCase', () => {
  let updateUserConsentUseCase: UpdateUserConsentUseCase;
  let userRepository: UserRepository;
  let userConsentRepository: UserConsentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserConsentUseCase,
        {
          provide: UserRepository,
          useValue: {
            findById: jest.fn(),
          },
        },
        {
          provide: UserConsentRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    updateUserConsentUseCase = module.get<UpdateUserConsentUseCase>(
      UpdateUserConsentUseCase,
    );
    userRepository = module.get<UserRepository>(UserRepository);
    userConsentRepository = module.get<UserConsentRepository>(
      UserConsentRepository,
    );
  });

  it('should not create a consent with invalid user id', async () => {
    // Arrange
    const id = 'invalid-id';

    // Act & Assert
    await expect(
      updateUserConsentUseCase.execute({
        user: { id },
        consents: [],
      }),
    ).rejects.toThrow(UserNotFoundError);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userConsentRepository.create).toHaveBeenCalledTimes(0);
  });

  it('should not create a consent with invalid consent id', async () => {
    // Arrange
    const id = uuidv4();
    const validEmail = 'valid@email.com';
    const consents = [{ id: 'invalid-id', enabled: true }];
    jest
      .spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User({ email: validEmail }));

    // Act & Assert
    await expect(
      updateUserConsentUseCase.execute({
        user: { id },
        consents,
      }),
    ).rejects.toThrow(InvalidUserConsentIdError);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userConsentRepository.create).toHaveBeenCalledTimes(0);
  });

  it('should create a consent', async () => {
    // Arrange
    const id = uuidv4();
    const validEmail = 'valid@email.com';
    const consents = [{ id: 'email_notifications', enabled: true }];
    jest
      .spyOn(userRepository, 'findById')
      .mockResolvedValueOnce(new User({ email: validEmail }));

    // Act
    await updateUserConsentUseCase.execute({
      user: { id },
      consents,
    });

    // Assert
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
    expect(userConsentRepository.create).toHaveBeenCalledTimes(1);
  });
});
