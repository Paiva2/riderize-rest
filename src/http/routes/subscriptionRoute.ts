import { Express } from "express";
import SubscriptionController from "../controller/subscriptionController";
import jwtHandler from "../middlewares/jwtHandler";

export default function subscriptionRoute(app: Express) {
  const subscriptionController = new SubscriptionController();

  app.post(
    "/subscription",
    [jwtHandler],
    subscriptionController.newSubscription
  );

  app.get(
    "/subscriptions",
    [jwtHandler],
    subscriptionController.listOwnSubscriptions
  );
}
