import Assertions from "@shared/common/util/Assertions";
import { afterAll, beforeAll } from "bun:test";
import mongoose from "mongoose";

beforeAll(async () => {
  /**
   * Connect to the db before start
   */
  try {
    await mongoose.connect(
      Assertions.assertNotUndefined(
        Bun.env.MONGODB_CONNECTION_STRING,
        "MONGODB_CONNECTION_STRING cannot be undefined."
      )
    );
  } catch (err) {
    console.error(err);
  }
});

afterAll(async () => {
  /**
   * Factory reset the database
   */
  console.log(`Resetting database...`);
  await mongoose.connection.db?.dropDatabase();
  console.log(`Disconnecting database...`);
  await mongoose.disconnect();
});
