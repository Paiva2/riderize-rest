import { IPedal, IPedalCreationRequest } from "../../@types/pedal.types";

export default interface PedalRepository {
  save(userId: string, newPedal: IPedalCreationRequest): Promise<IPedal>;
}
