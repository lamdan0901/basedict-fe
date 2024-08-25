export type TAuthBody = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  expires_at: number;
  user: TUser;
};
