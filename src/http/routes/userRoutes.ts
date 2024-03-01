import { Express } from "express";
import { UserController } from "../controller/userController";

const userController = new UserController();

export default function userRoutes(app: Express) {
  app.post(`/register`, userController.registerController);
}
