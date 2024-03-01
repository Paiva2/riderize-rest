import { Request, Response } from "express";
import { UserFactory } from "./factories/userFactory";

const factory = new UserFactory();

export class UserController {
  public async registerController(req: Request, res: Response) {
    const newUserDto = req.body;

    const { userService } = await factory.exec();

    await userService.register(newUserDto);

    return res.status(200).send({ message: "Register successfull." });
  }
}

export default new UserController();
