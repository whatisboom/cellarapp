export interface ILoginResponse {
  token: string;
  refreshToken: string;
}

export interface IUser {
  _id: string;
  createdAt: Date;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

export interface IUserResponse {
  user: IUser;
}

export interface IUsersResponse {
  users: IUser[];
}
