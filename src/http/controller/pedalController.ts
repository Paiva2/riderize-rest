import JwtService from "../services/jwt/jwtService";
import PedalFactory from "./factories/pedalFactory";
import { Request, Response } from "express";

export default class PedalController {
  private factory: PedalFactory;
  private jwtService: JwtService;

  public constructor() {
    this.jwtService = new JwtService();
    this.factory = new PedalFactory();
  }

  public createPedal = async (req: Request, res: Response) => {
    const pedalDto = req.body;

    const parseToken = this.jwtService.decode(
      req.headers.authorization!.replace("Bearer ", "")
    );

    const pedalService = await this.factory.exec();

    const newPedal = await pedalService.create(parseToken, pedalDto);

    return res.status(201).send({
      message: "Pedal created successfully!",
      newPedal: {
        id: newPedal.id,
        name: newPedal.name,
      },
    });
  };
}
