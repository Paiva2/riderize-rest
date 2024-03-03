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

  public listAllValidPedals = async (req: Request, res: Response) => {
    let { page, perPage } = req.query;

    if (!page) page = "1";
    if (!perPage) perPage = "5";

    const pedalService = await this.factory.exec();

    const list = await pedalService.listAll(Number(page), Number(perPage));

    return res.status(200).send(list);
  };

  public listAllOwnPedals = async (req: Request, res: Response) => {
    let pagination = req.query;

    const parseSubject = this.jwtService.decode(
      req.headers.authorization!.replace("Bearer ", "")
    );

    if (!pagination.page) pagination.page = "1";
    if (!pagination.perPage) pagination.perPage = "5";

    const pedalService = await this.factory.exec();

    const list = await pedalService.listOwn(parseSubject, {
      page: Number(pagination.page),
      perPage: Number(pagination.perPage),
    });

    return res.status(200).send(list);
  };
}
