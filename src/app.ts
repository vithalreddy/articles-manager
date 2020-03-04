import "reflect-metadata";
import * as fastify from "fastify";

import { Server, IncomingMessage, ServerResponse } from "http";

import router from "./router";
import connectToDB from "models";
import multer from "config/multer";

const serverOptions: fastify.ServerOptions = {
  // Logger only for production
  logger: !!(process.env.NODE_ENV !== "development")
};

const app: fastify.FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify(serverOptions);

// Middleware: Router
app.register(multer.contentParser);
app.register(router);

connectToDB().catch(err => {
  console.error(err);
  process.exit(1);
});

export default app;
