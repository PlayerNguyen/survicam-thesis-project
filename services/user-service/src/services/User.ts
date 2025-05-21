import Users, { IUser } from "../db/User";
import UserHasRole from "../db/UserHasRole";
import SystemRole from "../roles";

/**
 * Checks if a user exists with the given email or username
 * @param email User email to check
 * @param username User username to check
 * @returns True if a user exists with the given email or username, false otherwise
 */
async function checkIfExists(
  email?: string,
  username?: string
): Promise<boolean> {
  if (!email && !username) {
    throw new Error("Either email or username must be provided");
  }

  const query: any = { $or: [] };

  if (email) {
    query.$or.push({ email });
  }

  if (username) {
    query.$or.push({ username });
  }

  const count = await Users.countDocuments(query);
  return count > 0;
}

/**
 * Creates a new user if the email and username don't already exist
 * @param user User data to create
 * @returns The created user document
 */
async function createUser(user: Partial<IUser>): Promise<IUser> {
  // Email is unique,
  const userExists = await checkIfExists(user.email, user.username);
  if (userExists) {
    throw new Error(
      `The user with current email or username is already existed. Check out the email or username.`
    );
  }

  // Creates a new user
  const { hash, ...bodyWithoutPassword } = user;
  if (!hash) {
    throw new Error(`Hash cannot be undefined`);
  }

  const hashedPassword = await Bun.password.hash(hash);
  const willGenerateUser = await Users.create({
    ...bodyWithoutPassword,
    hash: hashedPassword,
  });
  await willGenerateUser.save();

  // assign user to the user role
  await (
    await UserHasRole.create({
      assigned_by: null,
      roleId: SystemRole.User.id,
      userId: willGenerateUser._id,
    })
  ).save();

  return willGenerateUser;
}

/**
 * Finds a user by their email
 * @param email Email to search for
 * @returns User document or null if not found
 */
async function findByEmail(email: string): Promise<IUser | null> {
  return await Users.findOne({ email });
}

/**
 * Finds a user by their username
 * @param username Username to search for
 * @returns User document or null if not found
 */
async function findByUsername(username: string): Promise<IUser | null> {
  return await Users.findOne({ username });
}

export const UserService = {
  createUser,
  checkIfExists,
  findByEmail,
  findByUsername,
};
