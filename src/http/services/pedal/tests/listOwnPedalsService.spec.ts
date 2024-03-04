import type { IUser } from "../../../../@types/user.types";
import { describe, test, expect, beforeEach, vi } from "vitest";
import InMemoryUserModel from "../../../model/in-memory-db/inMemoryUserModel";
import UserService from "../../user/userService";
import PedalService from "../PedalService";
import InMemoryPedalModel from "../../../model/in-memory-db/inMemoryPedalModel";
import { randomUUID } from "crypto";

describe("List Own Pedals Service", () => {
  let userModel: InMemoryUserModel;
  let pedalModel: InMemoryPedalModel;
  let user: IUser;

  let userService: UserService;

  let sut: PedalService;

  beforeEach(async () => {
    userModel = new InMemoryUserModel();
    pedalModel = new InMemoryPedalModel();

    userService = new UserService(userModel);

    sut = new PedalService(userModel, pedalModel);

    user = await userService.register({
      email: "johndoe@test.com",
      fullName: "John Doe",
      password: "123456",
    });

    const date = new Date(2070, 1, 1, 0);
    vi.setSystemTime(date);
  });

  test("Own Pedals list", async () => {
    for (let i = 1; i <= 23; i++) {
      await sut.create(user.id, {
        additionalInformation: `Test info ${i}`,
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 15, 0),
        name: `Test Pedal ${i}`,
        participantsLimit: 100,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }

    const page = 3;
    const perPage = 10;
    const list = await sut.listOwn(user.id, { page, perPage });

    expect(list.totalItens).toBe(23);
    expect(list).toEqual({
      page: 3,
      perPage: 10,
      totalItens: 23,
      pedals: expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: "Test Pedal 21",
          startDate: new Date(2070, 1, 20, 0),
          startDateRegistration: new Date(2070, 1, 5, 0),
          endDateRegistration: new Date(2070, 1, 15, 0),
          additionalInformation: "Test info 21",
          startPlace: "Street X;number 99;neighbourhood X;State X",
          participantsLimit: 100,
          participantsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),

          pedalOwnerId: user.id,
        }),

        expect.objectContaining({
          id: expect.any(String),
          name: "Test Pedal 22",
          startDate: new Date(2070, 1, 20, 0),
          startDateRegistration: new Date(2070, 1, 5, 0),
          endDateRegistration: new Date(2070, 1, 15, 0),
          additionalInformation: "Test info 22",
          startPlace: "Street X;number 99;neighbourhood X;State X",
          participantsLimit: 100,
          participantsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),

          pedalOwnerId: user.id,
        }),

        expect.objectContaining({
          id: expect.any(String),
          name: "Test Pedal 23",
          startDate: new Date(2070, 1, 20, 0),
          startDateRegistration: new Date(2070, 1, 5, 0),
          endDateRegistration: new Date(2070, 1, 15, 0),
          additionalInformation: "Test info 23",
          startPlace: "Street X;number 99;neighbourhood X;State X",
          participantsLimit: 100,
          participantsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),

          pedalOwnerId: user.id,
        }),
      ]),
    });
  });

  test("expect over null user id", async () => {
    await expect(() => {
      //@ts-ignore
      return sut.listOwn(null, { page: 1, perPage: 10 });
    }).rejects.toThrow("Invalid user id.");
  });

  test("expect over non existing user", async () => {
    await expect(() => {
      return sut.listOwn(randomUUID(), { page: 1, perPage: 10 });
    }).rejects.toThrow("User not found.");
  });
});
