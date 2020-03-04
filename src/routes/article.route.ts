import multer from "config/multer";

import * as articleCtrl from "controllers/article.controller";

export default function(fastify, opts, next) {
  fastify.route({
    method: "POST",
    url: "/",
    preHandler: multer.single("image"),
    handler: async (req, reply) => {
      const { title, description } = req.body;

      if (!req.file || !title || !description) {
        return reply
          .code(400)
          .send({ message: "Requried Fields are missing." });
      }

      const imageTempPath = req.file.path;

      const article = await articleCtrl.createArticle({
        title,
        description,
        imageTempPath
      });

      reply.send(article);
    }
  });

  fastify.route({
    method: "PUT",
    url: "/:articleID",
    preHandler: multer.single("image"),
    handler: async (req, reply) => {
      const { articleID } = req.params;

      const { title, description, readyForReview } = req.body;

      const imageTempPath = req.file ? req.file.path : null;

      const article = await articleCtrl.updateArticle(articleID, {
        title,
        description,
        imageTempPath,
        readyForReview
      });

      reply.send(article);
    }
  });

  fastify.route({
    method: "GET",
    url: "/:articleID",
    handler: async (req, reply) => {
      const { articleID } = req.params;

      const article = await articleCtrl.getArticle(articleID);

      reply.send(article);
    }
  });

  fastify.route({
    method: "DELETE",
    url: "/:articleID",
    handler: async (req, reply) => {
      const { articleID } = req.params;

      await articleCtrl.deleteArticle(articleID);

      reply.send({ deleted: true });
    }
  });

  fastify.route({
    method: "GET",
    url: "/",
    handler: async (req, reply) => {
      const { title, page, articlesPerPage, status } = req.query;

      const data = await articleCtrl.listArticles({
        title,
        page,
        articlesPerPage,
        status
      });

      reply.send(data);
    }
  });

  fastify.route({
    method: "GET",
    url: "/:articleID/image",
    handler: async (req, reply) => {
      const { articleID } = req.params;

      const { stream, mimeType } = await articleCtrl.getArticleImage(articleID);

      reply.type(mimeType).send(stream);
    }
  });

  fastify.route({
    method: "PUT",
    url: "/:articleID/review",
    handler: async (req, reply) => {
      const { articleID } = req.params;
      const { status } = req.body;
      if (status != "reviewed" || status != "published") {
        return reply.code(400).send({ message: "Invalid Article Status." });
      }

      const article = await articleCtrl.reviewArticle(articleID, { status });

      reply.send(article);
    }
  });

  next();
}
