const ENV = process.env;

export const FASTIFY_PORT = Number(ENV.FASTIFY_PORT) || 3000;
export const DB_PORT = Number(ENV.DB_PORT) || 3306;
export const DB = ENV.DB || "articles";
export const DB_HOST = ENV.DB_HOST || "localhost";
export const DB_USERNAME = ENV.DB_USERNAME || "admin";
export const DB_PASSWORD = ENV.DB_PASSWORD || "password";
