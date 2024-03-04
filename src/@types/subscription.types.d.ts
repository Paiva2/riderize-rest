import type { IPedal } from "./pedal.types";

export interface ISubscription {
  id: string;
  rideId: string;
  userId: string;
  subscriptionDate: Date;
  createdAt: Date;
  updatedAt: Date;
  pedal?: IPedal;
}

export interface ISubscriptionListPaginated {
  page: number;
  perPage: number;
  totalItens: number;
  subscriptions: ISubscription[];
}

export enum ListFilters {
  LIST_ALL = "list_all",
  LIST_EXPIRED = "list_expired",
  LIST_ACTIVE = "list_active",
}
