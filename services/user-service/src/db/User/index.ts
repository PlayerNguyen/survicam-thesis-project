import mongoose from "mongoose";
import SchemaName from "../schema";

/**
 * Interface for User document
 * Represents the TypeScript type definition for the userSchema
 */
export interface IUser extends Document {
  email: string;
  username: string;
  hash: string;
  created_at: Date;
  name: string;
  avatar?: string; // Optional field based on required: false
}

const userSchema = new mongoose.Schema<IUser>({
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
    unique: true,
  },
  hash: String,
  created_at: {
    type: Date,
    default: new Date(),
  },
  name: String,
  avatar: {
    type: String,
    required: false,
  },
});

const Users = mongoose.model(SchemaName.User, userSchema);

export default Users;
