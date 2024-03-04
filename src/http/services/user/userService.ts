import type {
  IUser,
  UserServiceAuthRequest,
  UserServiceRegisterRequest,
} from "../../../@types/user.types";
import ConflictException from "../../exceptions/conflictException";
import ForbiddenException from "../../exceptions/forbiddenException";
import NotFoundException from "../../exceptions/notFoundException";
import UserRepository from "../../repositories/userRepository";
import UserDtoService from "./userDtoService";
import bcrypt from "bcryptjs";

export default class UserService {
  private userDtoService = new UserDtoService();

  constructor(private readonly userRepository: UserRepository) {}

  public async register(dto: UserServiceRegisterRequest): Promise<IUser> {
    this.userDtoService.registerDtoCheck(dto);

    const doesEmailAlreadyExists = await this.userRepository.findByEmail(
      dto.email
    );

    if (doesEmailAlreadyExists) {
      throw new ConflictException("E-mail already exists.");
    }

    const hashPassword = await bcrypt.hash(dto.password, 6);

    dto.password = hashPassword;

    const register = await this.userRepository.save(dto);

    return register;
  }

  public async auth(dto: UserServiceAuthRequest): Promise<IUser> {
    this.userDtoService.authDtoCheck(dto);

    const doesUserExists = await this.userRepository.findByEmail(dto.email);

    if (!doesUserExists) {
      throw new NotFoundException("User not found.");
    }

    const doesPasswordMatches = await bcrypt.compare(
      dto.password,
      doesUserExists.password
    );

    if (!doesPasswordMatches) {
      throw new ForbiddenException("Wrong credentials.");
    }

    return doesUserExists;
  }
}
