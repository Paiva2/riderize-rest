import { describe, test, expect, beforeEach } from "vitest";
import InMemoryUserModel from "../../../model/in-memory-db/inMemoryUserModel";
import UserService from "../userService";
import bcrypt from "bcryptjs";

describe("Auth user service", () => {
  let userModel: InMemoryUserModel;

  let sut: UserService;

  beforeEach(async () => {
    userModel = new InMemoryUserModel();

    sut = new UserService(userModel);

    await sut.register({
      email: "johndoe@test.com",
      fullName: "John Doe",
      password: "123456",
    });
  });

  test("User auth", async () => {
    const auth = await sut.auth({
      email: "johndoe@test.com",
      password: "123456",
    });

    const checkHashedPassword = await bcrypt.compare("123456", auth.password);

    expect(checkHashedPassword).toBeTruthy();
    expect(auth).toEqual(
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
      return sut.auth({
        email: "",
        password: "123456",
      });
    }).rejects.toThrowError("email DTO can't be empty.");
  });

  test("exception over empty password dto", async () => {
    await expect(() => {
      return sut.auth({
        email: "johndoe@test.com",
        password: "",
      });
    }).rejects.toThrowError("password DTO can't be empty.");
  });

  test("exception over not found user", async () => {
    await expect(() => {
      return sut.auth({
        email: "inexistent@test.com",
        password: "123456",
      });
    }).rejects.toThrowError("User not found.");
  });

  test("exception over wrong credentials", async () => {
    await expect(() => {
      return sut.auth({
        email: "johndoe@test.com",
        password: "wrong password",
      });
    }).rejects.toThrowError("Wrong credentials.");
  });
});
