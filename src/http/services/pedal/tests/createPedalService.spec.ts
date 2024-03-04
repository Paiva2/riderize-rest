import type { IUser } from "../../../../@types/user.types";
import { describe, test, expect, beforeEach, vi } from "vitest";
import InMemoryUserModel from "../../../model/in-memory-db/inMemoryUserModel";
import UserService from "../../user/userService";
import PedalService from "../PedalService";
import InMemoryPedalModel from "../../../model/in-memory-db/inMemoryPedalModel";
import dayjs from "dayjs";

describe("New pedal service", () => {
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

  test("New pedal creation", async () => {
    const newPedal = await sut.create(user.id, {
      additionalInformation: "Test info",
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 5, 0),
      name: "Test Pedal",
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    expect(newPedal).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: "Test Pedal",
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 5, 0),
        additionalInformation: "Test info",
        startPlace: "Street X;number 99;neighbourhood X;State X",
        participantsLimit: 100,
        participantsCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),

        pedalOwnerId: user.id,
      })
    );
  });

  test("exception over null dto", async () => {
    await expect(() => {
      //@ts-ignore
      return sut.create(user.id, null);
    }).rejects.toThrowError("Dto can't be null.");
  });

  test("exception over name dto null", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 5, 0),
        name: "",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrowError("name dto can't be null.");
  });

  test("exception over startDate dto null", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        //@ts-ignore
        startDate: null,
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 5, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrowError("startDate dto can't be empty.");
  });

  test("exception over startDateRegistration dto null", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 20, 0),
        //@ts-ignore
        startDateRegistration: null,
        endDateRegistration: new Date(2070, 1, 5, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrowError("startDateRegistration dto can't be empty.");
  });

  test("exception over endDateRegistration dto null", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        //@ts-ignore
        endDateRegistration: null,
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrowError("endDateRegistration dto can't be empty.");
  });

  test("exception over startPlace dto null", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 5, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        //@ts-ignore
        startPlace: null,
      });
    }).rejects.toThrowError("startPlace dto can't be empty.");
  });

  test("exception over startDate beeing before today", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 0, 20, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 5, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrow("startDate can't be before today.");
  });

  test("exception over startDate beeing before startDateRegistration", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 4, 0),
        startDateRegistration: new Date(2070, 1, 5, 0),
        endDateRegistration: new Date(2070, 1, 5, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrow(
      "startDate can't be before startDateRegistration or endDateRegistration."
    );
  });

  test("exception over startDate beeing before endDateRegistration", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 8, 0),
        startDateRegistration: new Date(2070, 1, 6, 0),
        endDateRegistration: new Date(2070, 1, 10, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrow(
      "startDate can't be before startDateRegistration or endDateRegistration."
    );
  });

  test("exception over startDateRegistration beeing after endDateRegistration", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: new Date(2070, 1, 11, 0),
        endDateRegistration: new Date(2070, 1, 10, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrow(
      "startDateRegistration can't be after endDateRegistration."
    );
  });

  test("exception over startDateRegistration beeing before today", async () => {
    await expect(() => {
      return sut.create(user.id, {
        additionalInformation: "Test info",
        startDate: new Date(2070, 1, 20, 0),
        startDateRegistration: dayjs().add(-10, "days").toDate(),
        endDateRegistration: new Date(2070, 1, 10, 0),
        name: "Test Pedal",
        participantsLimit: 100,
        participantsCount: 0,
        startPlace: "Street X;number 99;neighbourhood X;State X",
      });
    }).rejects.toThrow(
      "startDateRegistration or endDateRegistration can't be before today."
    );
  });
});
