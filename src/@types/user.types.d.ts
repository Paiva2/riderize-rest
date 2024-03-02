export interface IUser {
  id: string;
  fullName: string;
  password: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;

  pedals?: IPedal[];
}

export interface UserServiceRegisterRequest {
  fullName: string;
  password: string;
  email: string;
}

export interface UserServiceAuthRequest {
  password: string;
  email: string;
}
