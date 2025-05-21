import { logger } from "@bogeychan/elysia-logger";
import { cors } from "@elysiajs/cors";
import { Elysia } from "elysia";
import useAuthRoute from "./routes/auth/index.route";

const app = new Elysia()
  .use(
    logger({
      level: "error",
    })
  )
  .use(cors())
  .get("/", () => ({
    auth: "/auth",
  }))
  .use(useAuthRoute());
export default app;
