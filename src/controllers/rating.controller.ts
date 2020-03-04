import * as boom from "@hapi/boom";

import { Rating } from "models/Rating";

import { connection as DBConn } from "models";
import { getArticle } from "./article.controller";

export const createRating = async (
  articleId,
  { rating, comment, commentedBy }
) => {
  const article = await getArticle(articleId);

  if (article.status != "published") {
    throw boom.badRequest(`Can't comment on unpublished article.`);
  }

  let ratingInstance = new Rating();
  ratingInstance.rating = rating;
  ratingInstance.comment = comment;
  ratingInstance.commentedBy = commentedBy;

  ratingInstance.article = article;

  ratingInstance = await DBConn.manager.save(ratingInstance);

  return ratingInstance;
};
