import type {
  IPedal,
  IPedalCreationRequest,
} from "../../../@types/pedal.types";
import PedalDtoService from "./pedalDtoService";
import UserRepository from "../../repositories/userRepository";
import PedalRepository from "../../repositories/pedalRepository";
import ConflictException from "../../exceptions/conflictException";
import NotFoundException from "../../exceptions/notFoundException";
import dayjs from "dayjs";

export default class PedalService {
  private pedalDtoService = new PedalDtoService();

  constructor(
    private readonly userRepository: UserRepository,
    private readonly pedalRepository: PedalRepository
  ) {}

  public async create(
    userId: string,
    dto: IPedalCreationRequest
  ): Promise<IPedal> {
    this.pedalDtoService.createDtoCheck(dto);

    const doesUserExists = await this.userRepository.findById(userId);

    if (!doesUserExists) {
      throw new NotFoundException("User not found.");
    }

    if (dto.participansLimit < 1) {
      throw new ConflictException("participantsLimit can't be less than 1.");
    }

    const today = dayjs();

    const startDate = dayjs(dto.startDate);

    const startDateRegistration = dayjs(dto.startDateRegistration);
    const endDateRegistration = dayjs(dto.endDateRegistration);

    if (startDate.isBefore(today)) {
      throw new ConflictException("startDate can't be before today.");
    }

    if (
      startDate.isBefore(startDateRegistration) ||
      startDate.isBefore(endDateRegistration)
    ) {
      throw new ConflictException(
        "startDate can't be before startDateRegistration or endDateRegistration."
      );
    }

    if (startDateRegistration.isAfter(endDateRegistration)) {
      throw new ConflictException(
        "startDateRegistration can't be after endDateRegistration."
      );
    }

    if (
      endDateRegistration.isBefore(today) ||
      startDateRegistration.isBefore(today)
    ) {
      throw new ConflictException(
        "startDateRegistration or endDateRegistration can't be before today."
      );
    }

    const creation = await this.pedalRepository.save(userId, dto);

    return creation;
  }
}
