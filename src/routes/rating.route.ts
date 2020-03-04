import multer from "config/multer";

import * as ratingCtrl from "controllers/rating.controller";

export default function(fastify, opts, next) {
  fastify.route({
    method: "POST",
    url: "/:articleID/comments",
    handler: async (req, reply) => {
      const { articleID } = req.params;
      const { comment, commentedBy, rating } = req.body;

      if (!comment || !commentedBy) {
        return reply
          .code(400)
          .send({ message: "Requried Fields are missing." });
      }

      const ratingParsed = Number(rating);
      if (0 >= ratingParsed && ratingParsed <= 9) {
        return reply
          .code(400)
          .send({ message: "Requried Fields are missing." });
      }

      const ratingInstance = await ratingCtrl.createRating(articleID, {
        comment,
        commentedBy,
        rating
      });

      reply.send(ratingInstance);
    }
  });

  next();
}
