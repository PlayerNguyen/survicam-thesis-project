import app from "./app";

const APP_PORT = Bun.env.APP_PORT ?? 3234;

export default {
  fetch: app.fetch,
  port: APP_PORT,
};
