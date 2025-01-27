import { ApiProperty } from '@nestjs/swagger';
import { IUserConsent } from '../../../../../consent/domain/entities/user-consent.entity';

export class CreateUserRequest {
  @ApiProperty({
    type: 'string',
    description: 'User email',
    example: 'valid@email.com',
  })
  email: string;
}

export class CreateUserResponse {
  @ApiProperty({
    type: 'string',
    description: 'User id',
    example: 'b7c0a2ee-e4d7-4d2a-bc4a-7908f1de7731',
  })
  id: string;

  @ApiProperty({
    type: 'string',
    description: 'User email',
    example: 'valid@email.com',
  })
  email: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          description: 'Consent id',
          example: 'email_notifications',
        },
        enabled: {
          type: 'boolean',
          description: 'Consent enabled',
          example: true,
        },
      },
    },
    description: 'User consents',
  })
  consents: IUserConsent[];
}
