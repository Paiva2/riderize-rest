import { Express } from "express";
import userRoutes from "./userRoutes";

export default function routes(app: Express) {
  userRoutes(app);
}