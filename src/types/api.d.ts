export interface ILoginResponse {
  token: string;
  refreshToken: string;
}

export interface IUserResponse {
  _id: string;
  createdAt: Date;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface IUsersResponse {
  users: IUserResponse[];
}
