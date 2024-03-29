import express, { Express } from "express";
import { pigPgConnection } from "./utils/pingPgConnection";
import bodyParser from "body-parser";
import routes from "./http/routes";
import globalExceptionHandler from "./http/middlewares/globalExceptionHandler";
import "dotenv/config";
import "express-async-errors";
import pingRedisConnection from "./utils/pingRedisConnection";

const app: Express = express();

app.use(bodyParser.json());

routes(app);

(async () => {
  await pigPgConnection();
  await pingRedisConnection();
})();

app.use(globalExceptionHandler);

export default app;
