import * as boom from "@hapi/boom";

import { Rating } from "models/Rating";
import { Article } from "models/Article";
import { getImageURL } from "./article.controller";

import { connection as DBConn } from "models";

export const createRating = async (
  articleId,
  { rating, comment = null, commentedBy }
) => {
  const article = await DBConn.manager.findOne(Article, articleId);

  if (!article) {
    throw boom.notFound(`Article with id: ${articleId} not found.`);
  }

  if (article.status != "published") {
    throw boom.badRequest(`Can't comment on unpublished article.`);
  }

  let ratingInstance = new Rating();
  ratingInstance.rating = rating;
  ratingInstance.comment = comment;
  ratingInstance.commentedBy = commentedBy;

  ratingInstance.article = article;

  ratingInstance = await DBConn.manager.save(ratingInstance);
  ratingInstance.article.image = getImageURL(ratingInstance.article.image);

  return ratingInstance;
};
