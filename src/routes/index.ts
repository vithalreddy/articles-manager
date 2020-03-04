import articleRoutes from "./article.route";

export default fastify => {
  fastify.register(articleRoutes, { prefix: "/api/v1/articles" });
};
