import {
  ISubscription,
  ISubscriptionListPaginated,
} from "../../@types/subscription.types";

export default interface SusbcriptionRepository {
  save(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription>;

  findSubscription(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription | null>;

  findAllByUserId(
    userId: string,
    pagination: { page: number; perPage: number }
  ): Promise<ISubscriptionListPaginated>;
}
