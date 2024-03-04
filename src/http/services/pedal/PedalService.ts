import type {
  IPedal,
  IPedalCreationRequest,
  IPedalListPaginated,
} from "../../../@types/pedal.types";
import PedalDtoService from "./pedalDtoService";
import UserRepository from "../../repositories/userRepository";
import PedalRepository from "../../repositories/pedalRepository";
import ConflictException from "../../exceptions/conflictException";
import NotFoundException from "../../exceptions/notFoundException";
import BadRequestException from "../../exceptions/badRequestException";
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

    if (dto.participantsLimit < 1) {
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

  public async listAll(
    page: number,
    perPage: number
  ): Promise<IPedalListPaginated> {
    if (page < 1) {
      page = 0;
    }

    if (perPage < 5) {
      perPage = 5;
    }

    if (perPage > 100) {
      perPage = 100;
    }

    const pedalList = await this.pedalRepository.listAll(page, perPage);

    return pedalList;
  }

  public async listOwn(
    userId: string,
    pagination: { page: number; perPage: number }
  ) {
    if (!userId) {
      throw new BadRequestException("Invalid user id.");
    }
    let perPage = pagination.perPage;
    let page = pagination.page;

    if (pagination.page < 1) {
      page = 1;
    }

    if (pagination.perPage < 5) {
      pagination.page = 5;
    }

    if (pagination.perPage > 100) {
      perPage = 100;
    }

    const doesUserExists = await this.userRepository.findById(userId);

    if (!doesUserExists) {
      throw new BadRequestException("User not found.");
    }

    const listPedals = await this.pedalRepository.findAllByUserId(userId, {
      page,
      perPage,
    });

    return listPedals;
  }
}
