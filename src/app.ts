import express, { Express } from "express";
import { pigPgConnection } from "./http/lib/pg";
import bodyParser from "body-parser";
import routes from "./http/routes";
import globalExceptionHandler from "./http/middlewares/globalExceptionHandler";
import "dotenv/config";
import "express-async-errors";

const app: Express = express();

app.use(bodyParser.json());

routes(app);

(async () => {
  await pigPgConnection();
})();

app.use(globalExceptionHandler);

export default app;
