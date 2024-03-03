import { Request, Response } from "express";
import SubscriptionFactory from "./factories/subscriptionFactory";
import JwtService from "../services/jwt/jwtService";

export default class SubscriptionController {
  private jwtService = new JwtService();
  private subscriptionFactory = new SubscriptionFactory();

  public constructor() {}

  public newSubscription = async (req: Request, res: Response) => {
    const subscription = req.body;

    const tokenSubject = this.jwtService.decode(
      req.headers.authorization!.replaceAll("Bearer ", "")
    );

    const subscriptionService = await this.subscriptionFactory.exec();

    const performSubscription = await subscriptionService.create({
      rideId: subscription.rideId,
      userId: tokenSubject,
    });

    return res.status(201).send({
      message: "Subscribed successfully!",
      ride: {
        id: performSubscription.id,
        subscriptionDate: performSubscription.subscriptionDate,
        rideId: performSubscription.rideId,
      },
    });
  };

  public listOwnSubscriptions = async (req: Request, res: Response) => {
    const pagination = req.query;

    const parseSubject = this.jwtService.decode(
      req.headers.authorization!.replace("Bearer ", "")
    );

    const subscriptionService = await this.subscriptionFactory.exec();

    const list = await subscriptionService.listOwn(parseSubject, {
      page: Number(pagination.page),
      perPage: Number(pagination.perPage),
    });

    return res.status(200).send(list);
  };
}
