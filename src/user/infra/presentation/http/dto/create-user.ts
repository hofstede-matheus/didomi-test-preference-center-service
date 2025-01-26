export class CreateUserRequest {
  email: string;
}

export class CreateUserResponse {
  id: string;
  email: string;
  consents: [];
}
