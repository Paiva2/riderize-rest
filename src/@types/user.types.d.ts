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

export interface IPedal {
  id: string;
  name: string;
  startDate: Date;
  startDateRegistration: Date;
  endDateRegistration: Date;
  additionalInformation: Date;
  startPlace: string;
  participansLimit: number;
}
