import mongoose from "mongoose";
import SchemaName from "../schema";

const userHasRoleSchema = new mongoose.Schema({
  userId: { type: String, ref: SchemaName.User },
  roleId: { type: String, ref: SchemaName.Role },
  assigned_at: {
    type: Date,
    default: () => new Date(),
  },
  assigned_by: {
    type: String,
    ref: SchemaName.User,
    required: false,
  },
});

const UserHasRole = mongoose.model(SchemaName.UserHasRole, userHasRoleSchema);

export default UserHasRole;
