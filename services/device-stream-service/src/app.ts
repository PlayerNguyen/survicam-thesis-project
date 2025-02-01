import cors from "@elysiajs/cors";
import DeviceManagement from "@shared/device-management";
import { staticHls } from "@shared/plugins/elyisiajs-static-hls";
import Assertions from "@shared/util/Assertions";
import Elysia from "elysia";
import mongoose from "mongoose";

console.log(`Connecting to mongodb server...`);

await mongoose
  .connect(Assertions.assertNotUndefined(Bun.env.MONGODB_CONNECTION_STRING))
  .then(() => {
    console.log(`Successfully connected to the mongodb server.`);
  });

// Load all recently opened
await DeviceManagement.getInstance().init();

const app = new Elysia().use(cors({})).use(
  // staticPlugin({
  //   assets: "./.data",
  // })
  staticHls({
    assetDirectory: "./.data",
  })
);

export default app;
