import type { IUser } from "../../../../@types/user.types";
import { describe, test, expect, beforeEach, vi } from "vitest";
import InMemoryUserModel from "../../../model/in-memory-db/inMemoryUserModel";
import UserService from "../../user/userService";
import InMemoryPedalModel from "../../../model/in-memory-db/inMemoryPedalModel";
import PedalService from "../../pedal/PedalService";
import InMemorySubscriptionModel from "../../../model/in-memory-db/inMemorySubscriptionModel";
import SubscriptionService from "../subscriptionService";
import { randomUUID } from "crypto";

describe("Create subscription on pedal ride service", () => {
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

  test("Should subscribe to a pedal ride", async () => {
    const pedalRide = await pedalService.create(user.id, {
      additionalInformation: `Test info`,
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 15, 0),
      name: `Test Pedal`,
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    const subcribe = await sut.create({
      rideId: pedalRide.id,
      userId: subscriber.id,
    });

    const getUpdatedPedal = await pedalModel.findById(pedalRide.id);

    expect(getUpdatedPedal?.participantsCount).toBe(1);
    expect(subcribe).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        rideId: pedalRide.id,
        userId: subscriber.id,
        subscriptionDate: new Date(2070, 1, 1, 0),
        createdAt: new Date(2070, 1, 1, 0),
        updatedAt: new Date(2070, 1, 1, 0),
      })
    );
  });

  test("exception over ride owner subscribing to his own ride", async () => {
    const pedalRide = await pedalService.create(user.id, {
      additionalInformation: `Test info`,
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 15, 0),
      name: `Test Pedal`,
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    await expect(() => {
      return sut.create({
        rideId: pedalRide.id,
        userId: user.id,
      });
    }).rejects.toThrow("Ride owner can't subscribe on his own ride.");
  });

  test("exception over empty rideId", async () => {
    await expect(() => {
      return sut.create({
        rideId: "",
        userId: subscriber.id,
      });
    }).rejects.toThrow("rideId can't be empty.");
  });

  test("exception over empty userId", async () => {
    const pedalRide = await pedalService.create(user.id, {
      additionalInformation: `Test info`,
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 15, 0),
      name: `Test Pedal`,
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    await expect(() => {
      return sut.create({
        rideId: pedalRide.id,
        userId: "",
      });
    }).rejects.toThrow("userId can't be empty.");
  });

  test("exception over user not found", async () => {
    const pedalRide = await pedalService.create(user.id, {
      additionalInformation: `Test info`,
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 15, 0),
      name: `Test Pedal`,
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    await expect(() => {
      return sut.create({
        rideId: pedalRide.id,
        userId: randomUUID(),
      });
    }).rejects.toThrow("User not found.");
  });

  test("exception over user not found", async () => {
    await expect(() => {
      return sut.create({
        rideId: randomUUID(),
        userId: subscriber.id,
      });
    }).rejects.toThrow("Ride not found.");
  });

  test("exception over ride reached the max total subscribers", async () => {
    const pedalRide = await pedalService.create(user.id, {
      additionalInformation: `Test info`,
      startDate: new Date(2070, 1, 20, 0),
      startDateRegistration: new Date(2070, 1, 5, 0),
      endDateRegistration: new Date(2070, 1, 15, 0),
      name: `Test Pedal`,
      participantsLimit: 1,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    await sut.create({
      rideId: pedalRide.id,
      userId: subscriber.id,
    });

    await expect(() => {
      return sut.create({
        rideId: pedalRide.id,
        userId: subscriber.id,
      });
    }).rejects.toThrow("Ride has reached the maximum subscriptions limit: 1");
  });

  test("exception over ride date already passed", async () => {
    const pedalRide = await pedalModel.save(user.id, {
      additionalInformation: `Test info`,
      startDate: new Date(2070, 0, 20, 0),
      startDateRegistration: new Date(2070, 0, 5, 0),
      endDateRegistration: new Date(2070, 0, 15, 0),
      name: `Test Pedal`,
      participantsLimit: 100,
      startPlace: "Street X;number 99;neighbourhood X;State X",
    });

    await expect(() => {
      return sut.create({
        rideId: pedalRide.id,
        userId: subscriber.id,
      });
    }).rejects.toThrow("This ride has already started or finished.");
  });
});
