import "reflect-metadata";
import * as fastify from "fastify";

import { Server, IncomingMessage, ServerResponse } from "http";

import registerRoutes from "./routes";
import multer from "config/multer";

export async function createApp() {
  const serverOptions: fastify.ServerOptions = {
    // Logger only for production
    logger: true || !!(process.env.NODE_ENV !== "development"),
    ignoreTrailingSlash: true
  };

  const app: fastify.FastifyInstance<
    Server,
    IncomingMessage,
    ServerResponse
  > = fastify(serverOptions);

  // Middlewares
  app.register(multer.contentParser);
  registerRoutes(app);

  app.setErrorHandler((error: any, req, reply) => {
    if (error && error.isBoom) {
      reply.code(error.output.statusCode).send(error.output.payload);
      return;
    }
  });

  return app;
}
