import "reflect-metadata";
import * as fastify from "fastify";

import { Server, IncomingMessage, ServerResponse } from "http";

import router from "./router";
import multer from "config/multer";

export async function createApp() {
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

  return app;
}
