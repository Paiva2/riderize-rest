import type {
  IUser,
  UserServiceRegisterRequest,
} from "../../../@types/user.types";
import ConflictException from "../../exceptions/conflictException";
import UserRepository from "../../repositories/userRepository";
import UserDtoService from "./userDtoService";
import bcrypt from "bcryptjs";

const userDtoService = new UserDtoService();

export default class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async register(dto: UserServiceRegisterRequest): Promise<IUser> {
    userDtoService.registerDtoCheck(dto);

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
}
