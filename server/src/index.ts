import http from "http";
import { createApp } from "./appcreator";
import logger from "./utils/Logger";
import dotenv from "dotenv";

dotenv.config();

const app = createApp();
const server = http.createServer(app);

server.listen(process.env.SERVER_PORT, () => {
  logger.info(`Server started on port ${process.env.SERVER_PORT}.`);
});
