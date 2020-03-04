import { createApp } from "./app";
import { FASTIFY_PORT } from "config";
import connectToDB from "models";

(async () => {
  await connectToDB();
  const app = await createApp();

  app.ready(() => {
    console.info(app.printRoutes());
  });

  app.listen(FASTIFY_PORT);
  console.log(`🚀Fastify server running on port ${FASTIFY_PORT}`);
})();
