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
  owned: Array<
    | string
    | {
        amount: number;
        beer: IBeer;
      }
  >;
  avatar: string;
}

export interface IUserResponse {
  user: IUser;
}

export interface IUsersResponse {
  users: IUser[];
}

export interface IBeer {
  _id: string;
  name: string;
  abv: number;
  brewery: IBrewery;
}

export interface IBeerResponse {
  beer: IBeer;
}

export interface IBeersResponse {
  beers: IBeer[];
}

export interface IBrewery {
  name: string;
  city: string;
  state: string;
  beers: IBeer[];
}

export interface IBreweryResponse {
  brewery: IBrewery;
}

export interface IBreweriesResponse {
  breweries: IBrewery[];
}
