import mongoose from "mongoose";
import app from "./app";
import { loadPermissionIntoDatabase } from "./permissions";
import { loadDefaultRole } from "./roles";
import Assertions from "./utils/assertion";
import { Seed } from "./utils/seed";

const PORT = Assertions.assertNotUndefined(
  process.env.PORT,
  "PORT is undefined"
);
const MONGODB_URI = Assertions.assertNotUndefined(process.env.MONGODB_URI);

await mongoose.connect(MONGODB_URI);
await loadPermissionIntoDatabase();
await loadDefaultRole();

await Seed.addAdminUser();

const server = app.listen(PORT);

console.log(`Server is host at: http://localhost:${PORT}`);
// console.log(server);
