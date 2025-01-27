export class GetUserRequest {
  id: string;
}

export class GetUserResponse {
  id: string;
  email: string;
  consents: [];
}
