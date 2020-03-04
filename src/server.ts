import app from "./app";
import { FASTIFY_PORT } from "config";

app.listen(FASTIFY_PORT);

console.log(`🚀  Fastify server running on port ${FASTIFY_PORT}`);
