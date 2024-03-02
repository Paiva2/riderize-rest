import { randomUUID } from "node:crypto";
import { ISubscription } from "../../../@types/subscription.types";
import SusbcriptionRepository from "../../repositories/subscriptionRepository";

export default class InMemorySubscriptionModel
  implements SusbcriptionRepository
{
  public subscriptions: ISubscription[] = [];

  async save(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription> {
    const newSub: ISubscription = {
      id: randomUUID(),
      rideId: subscription.rideId,
      userId: subscription.userId,
      subscriptionDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.subscriptions.push(newSub);

    return newSub;
  }

  async findSubscription(subscription: {
    userId: string;
    rideId: string;
  }): Promise<ISubscription | null> {
    return (
      this.subscriptions.find(
        (sub) =>
          sub.rideId === subscription.rideId &&
          sub.userId === subscription.userId
      ) ?? null
    );
  }
}
