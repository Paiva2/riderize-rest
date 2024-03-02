import { randomUUID } from "node:crypto";
import { IUser, UserServiceRegisterRequest } from "../../../@types/user.types";
import UserRepository from "../../repositories/userRepository";

export default class InMemoryUserModel implements UserRepository {
  private users: IUser[] = [];

  public constructor() {}

  async findByEmail(email: string): Promise<IUser | null> {
    return this.users.find((user) => user.email === email) ?? null;
  }

  async save(newUser: UserServiceRegisterRequest): Promise<IUser> {
    const user: IUser = {
      id: randomUUID(),
      email: newUser.email,
      fullName: newUser.fullName,
      password: newUser.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.users.push(user);

    return user;
  }

  async findById(id: string): Promise<IUser | null> {
    return this.users.find((user) => user.id === id) ?? null;
  }
}
