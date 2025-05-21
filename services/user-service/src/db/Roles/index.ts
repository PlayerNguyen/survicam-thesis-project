import { randomUUID } from "crypto";
import mongoose from "mongoose";
import SchemaName from "../schema";

const roleSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: () => randomUUID(),
  },
  name: String,
  description: String,
  permissions: [
    {
      type: Number,
      ref: SchemaName.Permission,
    },
  ],
});

const Roles = mongoose.model(SchemaName.Role, roleSchema);

export default Roles;
