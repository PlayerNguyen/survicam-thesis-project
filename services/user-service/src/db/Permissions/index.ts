import mongoose from "mongoose";
import SchemaName from "../schema";

const permissionSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  description: String,
});

const Permissions = mongoose.model(SchemaName.Permission, permissionSchema);

export default Permissions;
