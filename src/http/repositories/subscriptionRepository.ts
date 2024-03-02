import { ISubscription } from "../../@types/subscription.types";

export default interface SusbcriptionRepository {
  save(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription>;

  findSubscription(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription | null>;
}
