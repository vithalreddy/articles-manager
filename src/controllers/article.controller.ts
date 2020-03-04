import { copyFile, createReadStream } from "fs";
import { promisify } from "util";

import { getManager } from "typeorm";
import { v4 as uuidv4 } from "uuid";
import { Boom } from "@hapi/boom";

import { Article, ArticleStatus } from "models/Article";
import { connection as DBConn } from "models";
import { SERVER_URL } from "config";

const copyFilePromise = promisify(copyFile);

const IsDuplicateArticle = async title => {
  const IsDuplicate = await DBConn.manager.findOne(Article, {
    title
  });

  if (IsDuplicate) {
    throw new Boom(`Article with title: ${title} already exists.`, {
      statusCode: 409
    });
  }
};

const getImageURL = articleId => {
  return `${SERVER_URL}/articles/${articleId}/image`;
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
    throw new Boom(`Article with id: ${id} not found.`, {
      statusCode: 404
    });
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
    throw new Boom(`Article with id: ${id} not found.`, {
      statusCode: 404
    });
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
    throw new Boom("Page Number Must Be A Valid Number", { statusCode: 400 });
  }

  if (articlesPerPage && isNaN(articlesPerPage)) {
    throw new Boom("Articles Per Page Must Be A Valid Number", {
      statusCode: 400
    });
  }

  page = page || 1;
  articlesPerPage = articlesPerPage || 50;

  if (articlesPerPage > 50) {
    throw new Boom("Articles Per Page Can't be greater than 50.", {
      statusCode: 400
    });
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
    throw new Boom("No Articles Not Found for This Query.", {
      statusCode: 404
    });
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

export const getArticleImage = async id => {
  let article = await DBConn.manager.findOne(Article, id);

  if (!article) {
    throw new Boom(`Article with id: ${id} not found.`, {
      statusCode: 404
    });
  }

  return createReadStream(article.image);
};
