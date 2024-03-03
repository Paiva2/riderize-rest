import {
  IPedal,
  IPedalCreationRequest,
  IPedalListPaginated,
} from "../../@types/pedal.types";

export default interface PedalRepository {
  save(userId: string, newPedal: IPedalCreationRequest): Promise<IPedal>;

  listAll(page: number, perPage: number): Promise<IPedalListPaginated>;

  findById(pedalId: string): Promise<IPedal | null>;

  insertSubscriber(pedalId: string): Promise<IPedal>;

  findAllByUserId(
    userId: string,
    pagination: { page: number; perPage: number }
  ): Promise<IPedalListPaginated>;
}
