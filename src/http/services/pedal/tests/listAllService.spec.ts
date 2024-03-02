import type { IUser } from "../../../../@types/user.types";
import { describe, test, expect, beforeEach, vi } from "vitest";
import InMemoryUserModel from "../../../model/in-memory-db/inMemoryUserModel";
import UserService from "../../user/userService";
import PedalService from "../PedalService";
import InMemoryPedalModel from "../../../model/in-memory-db/inMemoryPedalModel";
import dayjs from "dayjs";

describe("List Pedals Service", () => {
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

  test("Pedal list", async () => {
    //Expired Pedal
    await pedalModel.save(user.id, {
      additionalInformation: `Test info Expired`,
      startDate: new Date(2070, 0, 20, 0),
      startDateRegistration: new Date(2070, 0, 5, 0),
      endDateRegistration: new Date(2070, 0, 15, 0),
      name: `Test Pedal Expired`,
      participansLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    for (let i = 1; i <= 23; i++) {
      await sut.create(user.id, {
        additionalInformation: `Test info ${i}`,
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 15, 0),
        name: `Test Pedal ${i}`,
        participansLimit: 100,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }

    const page = 3;
    const perPage = 5;
    const list = await sut.listAll(page, perPage);

    expect(list.totalItens).toBe(23);
    expect(list).toEqual({
      page: 3,
      perPage: 5,
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
          participansLimit: 100,
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
          participansLimit: 100,
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
          participansLimit: 100,
          createdAt: new Date(),
          updatedAt: new Date(),

          pedalOwnerId: user.id,
        }),
      ]),
    });
  });
});
