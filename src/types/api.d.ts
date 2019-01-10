export interface ILoginResponse {
  token: string;
  refreshToken: string;
  user: IUser;
}

export interface IUser {
  _id: string;
  createdAt: Date;
  username: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  owned: IQuantity[];
  avatar: string;
  location: string;
  social: {
    twitter: string;
    untappd: string;
    instagram: string;
  };
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
  slug: string;
  untappdId: number;
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
  slug: string;
}

export interface IBreweryResponse {
  brewery: IBrewery;
}

export interface IBreweriesResponse {
  breweries: IBrewery[];
}

export interface IQuantity {
  _id: string;
  amount: number;
  beer: IBeer;
  user: IUser;
}

export interface IQuantityResponse {
  [key: string]: IQuantity;
}

export interface IOwned extends IQuantity {
  forTrade: number;
}

export interface IOwnedResponse {
  beers: IOwned[];
}
