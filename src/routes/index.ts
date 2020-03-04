import articleRoutes from "./article.route";
import ratingRoutes from "./article.route";

export default fastify => {
  fastify.register(articleRoutes, { prefix: "/api/v1/articles" });
  fastify.register(ratingRoutes, { prefix: "/api/v1/articles" });
};
