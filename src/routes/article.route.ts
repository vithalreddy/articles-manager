import multer from "config/multer";

export default function router(fastify, opts, next) {
  fastify.route({
    method: "GET",
    url: "/",
    preHandler: multer.single("image"),
    schema: {
      body: {
        name: { type: "string" },
        excitement: { type: "integer" }
      },
      response: {
        200: {
          type: "object",
          properties: {
            hello: { type: "string" }
          }
        }
      }
    },
    handler: function(request, reply) {
      reply.send({ hello: "world" });
    }
  });

  next();
}
