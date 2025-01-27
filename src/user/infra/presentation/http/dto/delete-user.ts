import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserRequest {
  @ApiProperty({
    type: 'string',
    description: 'User id',
    example: 'b7c0a2ee-e4d7-4d2a-bc4a-7908f1de7731',
  })
  id: string;
}
