export interface CreateUserConsentEventRequest {
  user: {
    id: string;
  };
  consents: {
    id: string;
    enabled: boolean;
  }[];
}
