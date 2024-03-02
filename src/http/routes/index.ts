import { Express } from "express";
import userRoutes from "./userRoutes";
import pedalRoutes from "./pedalRoutes";

export default function routes(app: Express) {
  userRoutes(app);
  pedalRoutes(app);
}
