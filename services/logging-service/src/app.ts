import { cors } from "hono/cors";
import { logger } from "hono/logger";
import mongoose from "mongoose";
import { appFactory } from "./factory";
import LoggingRouter from "./routes/logging.route";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is undefined. Set the environment.");
}

await mongoose.connect(MONGODB_URI);

const app = appFactory
  .createApp()
  .use(cors())
  .use(logger())
  .get("/", (c) => c.text("OK"))
  .route("/logging", LoggingRouter);

export default app;
