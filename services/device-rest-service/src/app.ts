import cors from "@elysiajs/cors";
import swagger from "@elysiajs/swagger";
import Assertions from "@shared/common/util/Assertions";
import { Elysia } from "elysia";
import mongoose from "mongoose";
import useDevice from "./modules/Device";
import { Logestic } from "logestic";

mongoose.connect(
  Assertions.assertNotUndefined(
    Bun.env.MONGODB_CONNECTION_STRING,
    "MONGODB_CONNECTION_STRING cannot be undefined.",
  ),
);

const app = new Elysia()
  .use(cors({}))
  .use(Logestic.preset("common"))
  .use(swagger({ path: "/docs" }))
  .use(useDevice());

export default app;
