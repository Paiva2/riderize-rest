export interface IPedal {
  id: string;
  name: string;
  startDate: Date;
  startDateRegistration: Date;
  endDateRegistration: Date;
  additionalInformation: string;
  startPlace: string;
  participansLimit: number;
  createdAt: Date;
  updatedAt: Date;

  pedalOwnerId: string;
}

export interface IPedalCreationRequest
  extends Omit<IPedal, "id" | "pedalOwnerId" | "updatedAt" | "createdAt"> {}
