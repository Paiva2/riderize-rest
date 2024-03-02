import { Express } from "express";
import SubscriptionController from "../controller/subscriptionController";

export default function subscriptionRoute(app: Express) {
  const subscriptionController = new SubscriptionController();

  app.post("/subscription", subscriptionController.newSubscription);
}
