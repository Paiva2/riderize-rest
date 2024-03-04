import type {
  UserServiceAuthRequest,
  UserServiceRegisterRequest,
} from "../../../@types/user.types";
import BadRequestException from "../../exceptions/badRequestException";

export default class UserDtoService {
  public constructor() {}

  public registerDtoCheck(dto: UserServiceRegisterRequest) {
    if (!dto.email) {
      throw new BadRequestException("email DTO can't be empty.");
    }

    if (!dto.fullName) {
      throw new BadRequestException("fullName DTO can't be empty.");
    }

    if (!dto.password) {
      throw new BadRequestException("password DTO can't be empty.");
    }

    if (dto.password.length < 6) {
      throw new BadRequestException(
        "password DTO can't be less than 6 characters."
      );
    }
  }

  public authDtoCheck(dto: UserServiceAuthRequest) {
    if (!dto) {
      throw new BadRequestException("Dto can't be null.");
    }

    if (!dto.email) {
      throw new BadRequestException("email DTO can't be empty.");
    }

    if (!dto.password) {
      throw new BadRequestException("password DTO can't be empty.");
    }
  }
}
