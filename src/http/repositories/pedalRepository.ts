import {
  IPedal,
  IPedalCreationRequest,
  IPedalListPaginated,
} from "../../@types/pedal.types";

export default interface PedalRepository {
  save(userId: string, newPedal: IPedalCreationRequest): Promise<IPedal>;

  listAll(page: number, perPage: number): Promise<IPedalListPaginated>;
}
