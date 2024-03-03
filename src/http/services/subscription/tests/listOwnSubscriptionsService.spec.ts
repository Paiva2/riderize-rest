import type { IUser } from "../../../../@types/user.types";
import { describe, test, expect, beforeEach, vi } from "vitest";
import InMemoryUserModel from "../../../model/in-memory-db/inMemoryUserModel";
import UserService from "../../user/userService";
import InMemoryPedalModel from "../../../model/in-memory-db/inMemoryPedalModel";
import PedalService from "../../pedal/PedalService";
import InMemorySubscriptionModel from "../../../model/in-memory-db/inMemorySubscriptionModel";
import SubscriptionService from "../subscriptionService";
import { randomUUID } from "crypto";

describe("List own subscriptions service", () => {
  let userModel: InMemoryUserModel;
  let pedalModel: InMemoryPedalModel;
  let subscriptionModel: InMemorySubscriptionModel;
  let user: IUser;
  let subscriber: IUser;

  let userService: UserService;

  let pedalService: PedalService;
  let sut: SubscriptionService;

  beforeEach(async () => {
    userModel = new InMemoryUserModel();
    pedalModel = new InMemoryPedalModel();
    subscriptionModel = new InMemorySubscriptionModel();

    subscriptionModel.setPedalRepository(pedalModel);

    userService = new UserService(userModel);

    pedalService = new PedalService(userModel, pedalModel);

    sut = new SubscriptionService(userModel, pedalModel, subscriptionModel);

    user = await userService.register({
      email: "johndoe@test.com",
      fullName: "John Doe",
      password: "123456",
    });

    subscriber = await userService.register({
      email: "subscriber@test.com",
      fullName: "John Doe",
      password: "123456",
    });

    const date = new Date(2070, 1, 1, 0);
    vi.setSystemTime(date);
  });

  test("own subscriptions list", async () => {
    const firstRide = await pedalService.create(user.id, {
      additionalInformation: `Test info 1`,
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 15, 0),
      name: `Test Pedal 1`,
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    const secondRide = await pedalService.create(user.id, {
      additionalInformation: `Test info 2`,
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 15, 0),
      name: `Test Pedal 2`,
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    await sut.create({
      rideId: firstRide.id,
      userId: subscriber.id,
    });

    await sut.create({
      rideId: secondRide.id,
      userId: subscriber.id,
    });

    const list = await sut.listOwn(subscriber.id, { page: 1, perPage: 5 });

    expect(list).toEqual(
      expect.objectContaining({
        page: 1,
        perPage: 5,
        totalItens: 2,
        subscriptions: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            rideId: firstRide.id,
            userId: subscriber.id,
            subscriptionDate: new Date(2070, 1, 1, 0),
            createdAt: new Date(2070, 1, 1, 0),
            updatedAt: new Date(2070, 1, 1, 0),
            pedal: {
              id: firstRide.id,
              name: "Test Pedal 1",
              additionalInformation: "Test info 1",
              startDate: new Date(2070, 1, 20, 0),
              startDateRegistration: new Date(2070, 1, 5, 0),
              endDateRegistration: new Date(2070, 1, 15, 0),
              participantsLimit: 100,
              participantsCount: 1,
              startPlace: "Street X;number 99;neighbourhood X;State X",
              createdAt: new Date(),
              updatedAt: new Date(),
              pedalOwnerId: user.id,
            },
          }),

          expect.objectContaining({
            id: expect.any(String),
            rideId: secondRide.id,
            userId: subscriber.id,
            subscriptionDate: new Date(2070, 1, 1, 0),
            createdAt: new Date(2070, 1, 1, 0),
            updatedAt: new Date(2070, 1, 1, 0),
            pedal: {
              id: secondRide.id,
              name: "Test Pedal 2",
              additionalInformation: "Test info 2",
              startDate: new Date(2070, 1, 20, 0),
              startDateRegistration: new Date(2070, 1, 5, 0),
              endDateRegistration: new Date(2070, 1, 15, 0),
              participantsLimit: 100,
              participantsCount: 1,
              startPlace: "Street X;number 99;neighbourhood X;State X",
              createdAt: new Date(),
              updatedAt: new Date(),
              pedalOwnerId: user.id,
            },
          }),
        ]),
      })
    );
  });

  test("exception over empty userId", async () => {
    await expect(() => {
      return sut.listOwn("", { page: 1, perPage: 5 });
    }).rejects.toThrow("Invalid user id.");
  });

  test("exception over user not found", async () => {
    await expect(() => {
      return sut.listOwn(randomUUID(), { page: 1, perPage: 5 });
    }).rejects.toThrow("User not found.");
  });
});
