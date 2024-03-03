import { randomUUID } from "node:crypto";
import {
  ISubscription,
  ISubscriptionListPaginated,
} from "../../../@types/subscription.types";
import SusbcriptionRepository from "../../repositories/subscriptionRepository";
import PedalRepository from "../../repositories/pedalRepository";
import InMemoryPedalModel from "./inMemoryPedalModel";

export default class InMemorySubscriptionModel
  implements SusbcriptionRepository
{
  public subscriptions: ISubscription[] = [];
  private pedalRepository: PedalRepository;

  public constructor() {
    this.pedalRepository = new InMemoryPedalModel();
  }

  public async setPedalRepository(repository: PedalRepository) {
    this.pedalRepository = repository;
  }

  public async getPedalRepository() {
    return this.pedalRepository;
  }

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

  async findAllByUserId(
    userId: string,
    { page, perPage }: { page: number; perPage: number }
  ): Promise<ISubscriptionListPaginated> {
    const subscriptions = this.subscriptions
      .filter((sub) => sub.userId === userId)
      .splice((page - 1) * perPage, perPage * page);

    for (let sub of subscriptions) {
      const getPedal = await this.pedalRepository.findById(sub.rideId);

      if (getPedal) {
        sub.pedal = getPedal;
      }
    }

    return {
      page,
      perPage,
      totalItens: this.subscriptions.length,
      subscriptions,
    };
  }
}
