import { describe, test, expect, beforeEach } from "vitest";
import InMemoryUserModel from "../../../model/in-memory-db/inMemoryUserModel";
import UserService from "../userService";
import bcrypt from "bcryptjs";

describe("Register user service", () => {
  let userModel: InMemoryUserModel;

  let sut: UserService;

  beforeEach(() => {
    userModel = new InMemoryUserModel();

    sut = new UserService(userModel);
  });

  test("New user registration", async () => {
    const register = await sut.register({
      email: "johndoe@test.com",
      fullName: "John Doe",
      password: "123456",
    });

    const checkHashedPassword = await bcrypt.compare(
      "123456",
      register.password
    );

    expect(checkHashedPassword).toBeTruthy();
    expect(register).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        fullName: "John Doe",
        password: expect.any(String),
        email: "johndoe@test.com",
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      })
    );
  });

  test("exception over empty email dto", async () => {
    await expect(() => {
      return sut.register({
        email: "",
        fullName: "John Doe",
        password: "123456",
      });
    }).rejects.toThrowError("email DTO can't be empty.");
  });

  test("exception over empty fullName dto", async () => {
    await expect(() => {
      return sut.register({
        email: "johndoe@test.com",
        fullName: "",
        password: "123456",
      });
    }).rejects.toThrowError("fullName DTO can't be empty.");
  });

  test("exception over empty password dto", async () => {
    await expect(() => {
      return sut.register({
        email: "johndoe@test.com",
        fullName: "John Doe",
        password: "",
      });
    }).rejects.toThrowError("password DTO can't be empty.");
  });

  test("exception over password dto having less than 6 characters", async () => {
    await expect(() => {
      return sut.register({
        email: "johndoe@test.com",
        fullName: "John Doe",
        password: "12345",
      });
    }).rejects.toThrowError("password DTO can't be less than 6 characters.");
  });
});
