import type { IPedalCreationRequest } from "../../../@types/pedal.types";
import BadRequestException from "../../exceptions/badRequestException";

export default class PedalDtoService {
  public constructor() {}

  public createDtoCheck(dto: IPedalCreationRequest) {
    if (!dto) {
      throw new BadRequestException("Dto can't be null.");
    }

    if (!dto.name) {
      throw new BadRequestException("name dto can't be null.");
    }

    if (!dto.startDate) {
      throw new BadRequestException("startDate dto can't be empty.");
    }

    if (!dto.startDateRegistration) {
      throw new BadRequestException(
        "startDateRegistration dto can't be empty."
      );
    }

    if (!dto.endDateRegistration) {
      throw new BadRequestException("endDateRegistration dto can't be empty.");
    }

    if (!dto.startPlace) {
      throw new BadRequestException("startPlace dto can't be empty.");
    }
  }
}
