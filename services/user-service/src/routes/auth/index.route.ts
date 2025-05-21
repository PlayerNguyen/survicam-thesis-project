import { logger } from "@bogeychan/elysia-logger";
import { Elysia, t } from "elysia";
import jwt from "jsonwebtoken";
import Users from "../../db/User";
import UserHasRole from "../../db/UserHasRole";
import SystemRole from "../../roles";
import Assertions from "../../utils/assertion";
import useTokenSubRoute from "./token.auth.route";

const JWT_SECRET_KEY = Assertions.assertNotUndefined(
  process.env.JWT_SECRET_KEY,
  "Define the JWT_SECRET_KEY in environment variable before load the app.",
);
const JWT_TOKEN_EXPIRED_IN = process.env.JWT_TOKEN_EXPIRED_IN || "30d";

const useAuthRoute = () =>
  new Elysia({ prefix: "/auth" })
    .use(
      logger({
        level: "info",
      }),
    )
    .get("/", () => [
      {
        method: "POST",
        endpoint: "/auth/",
        description: "Creates a new account",
      },
      {
        method: "POST",
        endpoint: "/auth/login",
        description: "Logins with the specific account",
      },
      {
        method: "GET",
        endpoint: "/auth/token",
        description:
          "Gets all user information by passing token into a search query",
      },
      {
        method: "GET",
        endpoint: "/auth/token/permissions",
        description:
          "Gets all user permissions by passing token into a search query",
      },
      {
        method: "PUT",
        endpoint: "/auth/profile",
        description: "Updates the user profile",
      },
      {
        method: "PUT",
        endpoint: "/auth/password",
        description: "Changes the user password",
      },
    ])
    .post(
      `/`,
      async (app) => {
        // Email is unique,
        const currentUserWithEmail = await Users.countDocuments({
          $or: [
            {
              email: app.body.email,
            },
            {
              username: app.body.username,
            },
          ],
        });
        if (currentUserWithEmail > 0) {
          return app.error("Conflict", {
            message: `The user with current email or username is already existed. Check out the email or username.`,
          });
        }

        // Creates a new user
        const { password, ...bodyWithoutPassword } = app.body;
        const hashedPassword = await Bun.password.hash(password);
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

        return {
          message: `The user is created.`,
          _id: willGenerateUser._id,
        };
      },
      {
        body: t.Object({
          email: t.String({ format: "email" }),
          username: t.String({ minLength: 3 }),
          password: t.String({ minLength: 6 }),
          name: t.String({ minLength: 2 }),
        }),
      },
    )
    .post(
      "/login",
      async ({ body, error }) => {
        const user = await Users.findOne({
          $or: [
            {
              username: body.username,
            },
            {
              email: body.username,
            },
          ],
        });

        // Check if the user is existed or not.
        if (user === undefined || user === null) {
          return error("Unauthorized", { message: `Cannot found the user.` });
        }

        // Check password
        const isPasswordValid = await Bun.password.verify(
          body.password,
          user!.hash!,
        );
        if (!isPasswordValid) {
          return error("Unauthorized", {
            message: `The password is incorrect.`,
          });
        }

        // Generate token
        const token = jwt.sign(
          {
            _id: user?._id,
            created_at: user?.created_at,
            username: user?.username,
            name: user?.name,
            email: user?.name,
            avatar: user?.avatar || undefined,
          },
          JWT_SECRET_KEY,
          {
            expiresIn: JWT_TOKEN_EXPIRED_IN,
          },
        );
        return {
          token,
        };
      },
      {
        body: t.Object({
          username: t.String({ minLength: 1 }),
          password: t.String({ minLength: 1 }),
        }),
      },
    )
    .put(
      "/profile",
      async ({ body, headers, error }) => {
        // const token = request.headers.authorization?.split(" ")[1];
        const headerToken = headers["authorization"];
        if (!headerToken)
          return error("Unauthorized", {
            message: "No token provided on header of the request.",
          });

        const token = headerToken.split(" ")[1];
        if (!token)
          return error("Unauthorized", {
            message: "Cannot found the token. The token could be invalid",
          });

        try {
          const decoded = jwt.verify(token, JWT_SECRET_KEY) as { _id: string };
          const user = await Users.findById(decoded._id);

          if (!user) {
            return error("Not Found", { message: "User not found." });
          }

          Object.assign(user, body);
          await user.save();

          return { message: "Profile updated successfully." };
        } catch (err) {
          return error("Unauthorized", {
            message: "Invalid or expired token.",
          });
        }
      },
      {
        body: t.Object({
          name: t.Optional(t.String({ minLength: 2 })),
          username: t.Optional(t.String({ minLength: 3 })),
          email: t.Optional(t.String({ format: "email" })),
          avatar: t.Optional(t.String()),
        }),
      },
    )
    .put(
      "/password",
      async ({ body, headers, error }) => {
        // const token = request.headers.authorization?.split(" ")[1];
        const headerToken = headers["authorization"];
        if (!headerToken)
          return error("Unauthorized", {
            message: "No token provided on header of the request.",
          });

        const token = headerToken.split(" ")[1];
        if (!token)
          return error("Unauthorized", {
            message: "Cannot found the token. The token could be invalid",
          });

        try {
          const decoded = jwt.verify(token, JWT_SECRET_KEY) as { _id: string };
          const user = await Users.findById(decoded._id);

          if (!user) {
            return error("Not Found", { message: "User not found." });
          }

          // Verify old password
          const isOldPasswordValid = await Bun.password.verify(
            body.oldPassword,
            user.hash,
          );
          if (!isOldPasswordValid) {
            return error("Unauthorized", {
              message: "Old password is incorrect.",
            });
          }

          // Hash new password
          user.hash = await Bun.password.hash(body.newPassword);
          await user.save();

          return { message: "Password changed successfully." };
        } catch (err) {
          return error("Unauthorized", {
            message: "Invalid or expired token.",
          });
        }
      },
      {
        body: t.Object({
          oldPassword: t.String({ minLength: 6 }),
          newPassword: t.String({ minLength: 6 }),
        }),
      },
    )
    .use(useTokenSubRoute());

export default useAuthRoute;
