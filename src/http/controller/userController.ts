import { Request, Response } from "express";
import { UserFactory } from "./factories/userFactory";
import JwtService from "../services/jwt/jwtService";

export default class UserController {
  private factory = new UserFactory();
  private jwtService = new JwtService();

  public registerController = async (req: Request, res: Response) => {
    const newUserDto = req.body;

    const { userService } = await this.factory.exec();

    try {
      await userService.register(newUserDto);

      return res.status(200).send({ message: "Register successfull." });
    } catch (e) {
      console.log(e);

      return res.status(500).send({ message: e });
    }
  };

  public authController = async (req: Request, res: Response) => {
    const authDto = req.body;

    const { userService } = await this.factory.exec();

    const userAuth = await userService.auth(authDto);

    const authToken = this.jwtService.sign(userAuth.id);

    return res.status(200).send({ token: authToken });
  };
}
