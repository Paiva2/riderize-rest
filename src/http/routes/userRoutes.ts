import { Express } from "express";
import UserController from "../controller/userController";

export default function userRoutes(app: Express) {
  const userController = new UserController();

  app.post(`/register`, userController.registerController);

  app.post("/login", userController.authController);
}
