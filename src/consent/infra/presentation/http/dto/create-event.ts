import { ApiProperty } from '@nestjs/swagger';

export class CreateUserConsentEventRequest {
  @ApiProperty({
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'User id',
        example: 'b7c0a2ee-e4d7-4d2a-bc4a-7908f1de7731',
      },
    },
  })
  user: {
    id: string;
  };
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
  consents: {
    id: string;
    enabled: boolean;
  }[];
}
