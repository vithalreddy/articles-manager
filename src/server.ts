import { createApp } from "./app";
import { FASTIFY_PORT } from "config";
import connectToDB from "models";
import { createArticle, getArticle } from "controllers/article.controller";

(async () => {
  await connectToDB();
  const app = await createApp();

  app.listen(FASTIFY_PORT);
  console.log(`🚀Fastify server running on port ${FASTIFY_PORT}`);

  //   const article = await createArticle({
  //     title: `tesstss2s1 ${new Date()}`,
  //     description: "nsns naann",
  //     imageTempPath: "/home/v/Pictures/Screenshot from 2020-02-26 13-42-15.png"
  //   });

  getArticle(76);
})();
