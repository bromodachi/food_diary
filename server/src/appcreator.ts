import express from "express";
import routes from "./routes";
import bodyParser from "body-parser";
import { notFoundHandler } from "./utils/NotFound";
import CORS from "./CORS";
import logger from "./utils/Logger";

import pinoHttp from "pino-http";
import { errorHandler } from "./middleware/ErrorHandler";

export function createApp() {
  const app = express();
  const httpLogger = pinoHttp({ logger });
  app.use(httpLogger);
  if (process.env.NODE_ENV !== "production") {
    logger.info("Enabling CORS");
    app.use(CORS.handle);
  }
  app.use("/v1", routes);

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json({ limit: "5MB" }));
  app.use("*", notFoundHandler);
  app.use(errorHandler);

  return app;
}
