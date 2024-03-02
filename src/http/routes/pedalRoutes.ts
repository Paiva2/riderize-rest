import { Express } from "express";
import PedalController from "../controller/pedalController";
import jwtHandler from "../middlewares/jwtHandler";

export default function pedalRoutes(app: Express) {
  const pedalController = new PedalController();

  app.post("/pedal", [jwtHandler], pedalController.createPedal);

  app.get("/pedal/list", pedalController.listAllValidPedals);
}
