import { Express } from "express";
import userRoutes from "./userRoutes";
import pedalRoutes from "./pedalRoutes";
import subscriptionRoute from "./subscriptionRoute";

export default function routes(app: Express) {
  userRoutes(app);
  pedalRoutes(app);
  subscriptionRoute(app);
}
