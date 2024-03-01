import { IUser, UserServiceRegisterRequest } from "../../@types/user.types";

export default interface UserRepository {
  findByEmail(email: string): Promise<IUser | null>;

  save(newUser: UserServiceRegisterRequest): Promise<IUser>;
}
