import { randomUUID } from "crypto";
import {
  IPedalCreationRequest,
  IPedal,
  IPedalListPaginated,
} from "../../../@types/pedal.types";
import PedalRepository from "../../repositories/pedalRepository";

export default class InMemoryPedalModel implements PedalRepository {
  public pedals: IPedal[] = [];

  public async save(
    userId: string,
    newPedal: IPedalCreationRequest
  ): Promise<IPedal> {
    const pedal: IPedal = {
      id: randomUUID(),
      name: newPedal.name,
      additionalInformation: newPedal.additionalInformation,
      startDate: newPedal.startDate,
      startDateRegistration: newPedal.startDateRegistration,
      endDateRegistration: newPedal.endDateRegistration,
      participansLimit: newPedal.participansLimit,
      startPlace: newPedal.startPlace,
      createdAt: new Date(),
      updatedAt: new Date(),
      pedalOwnerId: userId,
    };

    this.pedals.push(pedal);

    return pedal;
  }

  async listAll(page: number, perPage: number): Promise<IPedalListPaginated> {
    const list = this.pedals.filter(
      (pedal) => pedal.endDateRegistration >= new Date()
    );

    return {
      page,
      perPage,
      totalItens: list.length,
      pedals: list.splice((page - 1) * perPage, page * perPage),
    };
  }
}
