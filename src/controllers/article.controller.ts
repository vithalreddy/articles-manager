import { copyFile, createReadStream, statSync } from "fs";
import { promisify } from "util";

import { getManager } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import * as boom from "@hapi/boom";
import * as mime from "mime-types";

import { Article, ArticleStatus } from "models/Article";
import { connection as DBConn } from "models";
import { SERVER_URL } from "config";

const copyFilePromise = promisify(copyFile);

const IsDuplicateArticle = async title => {
  const IsDuplicate = await DBConn.manager.findOne(Article, {
    title
  });

  if (IsDuplicate) {
    throw boom.conflict(`Article with title: ${title} already exists.`);
  }
};

const getImageURL = articleId => {
  return `${SERVER_URL}/api/v1/articles/${articleId}/image`;
};

export const createArticle = async ({ title, description, imageTempPath }) => {
  let article = new Article();
  article.title = title.toLowerCase().trim();
  article.description = description;

  await IsDuplicateArticle(article.title);

  const imageDestPath = `uploads/${uuidv4()}.${
    imageTempPath.split(".").slice(-1)[0]
  }`;
  await copyFilePromise(imageTempPath, imageDestPath);

  article.image = imageDestPath;
  article = await DBConn.manager.save(article);

  article.image = getImageURL(article.id);

  return article;
};

export const updateArticle = async (
  id,
  {
    title = null,
    description = null,
    imageTempPath = null,
    readyForReview = null
  }
) => {
  let article = await DBConn.manager.findOne(Article, id);

  if (!article) {
    throw boom.notFound(`Article with id: ${id} not found.`);
  }

  if (title) {
    title = title.toLowerCase().trim();
    if (title != article.title) {
      article.title = title;
      await IsDuplicateArticle(article.title);
    }
  }

  if (description) article.description = description;

  if (imageTempPath) {
    const imageDestPath = `uploads/${uuidv4()}.${
      imageTempPath.split(".").slice(-1)[0]
    }`;
    await copyFilePromise(imageTempPath, imageDestPath);

    article.image = getImageURL(imageDestPath);
  }

  if (readyForReview) article.status = ArticleStatus.UNDER_REVIEW;

  article = await DBConn.manager.save(article);

  article.image = getImageURL(article.id);

  return article;
};

export const deleteArticle = async id => {
  let article = await DBConn.manager.findOne(Article, id);

  if (!article) {
    throw boom.notFound(`Article with id: ${id} not found.`);
  }

  await DBConn.manager.delete(Article, article.id);
};

export const listArticles = async ({
  articlesPerPage = 50,
  title = null,
  status = null,
  page = 1
}) => {
  if (page && isNaN(page)) {
    throw boom.badRequest("Page Number Must Be A Valid Number");
  }

  if (articlesPerPage && isNaN(articlesPerPage)) {
    throw boom.badRequest("Articles Per Page Must Be A Valid Number");
  }

  page = page || 1;
  articlesPerPage = articlesPerPage || 50;

  if (articlesPerPage > 50) {
    throw boom.badRequest("Articles Per Page Can't be greater than 50.");
  }

  const limit = articlesPerPage;
  const offset = page * limit - limit;

  const query = await DBConn.manager
    .createQueryBuilder()
    .select("article")
    .from(Article, "article");

  const [articles, totalCount] = await Promise.all([
    query
      .skip(offset)
      .limit(limit)
      .execute(),
    query.getCount()
  ]);

  if (!articles.length) {
    throw boom.notFound("No Articles Not Found for This Query.");
  }

  for (let i = 0; i < articles.length; i++) {
    const el = articles[i];
    el.image = getImageURL(el.id);
  }

  const data = {
    articles,
    totalCount,
    selectedPage: page,
    articlesPerPage,
    totalPages: Math.ceil(totalCount / articlesPerPage)
  };

  return data;
};

export const getArticle = async id => {
  let article = await DBConn.manager.getRepository(Article).findOne(id, {
    relations: ["ratings"]
  });

  if (!article) {
    throw boom.notFound(`Article with id: ${id} not found.`);
  }

  article.image = getImageURL(article.id);

  console.log(article);

  return article;
};

export const getArticleImage = async id => {
  let article = await DBConn.manager.findOne(Article, id);

  if (!article) {
    throw boom.notFound(`Article with id: ${id} not found.`);
  }
  console.log("mimeType", id);
  const mimeType = mime.lookup(article.image);
  console.log("mimeType", mimeType);
  const stream = createReadStream(article.image);

  return { stream, mimeType };
};
