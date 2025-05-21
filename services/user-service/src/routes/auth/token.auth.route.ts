import { logger } from "@bogeychan/elysia-logger";
import Elysia, { t } from "elysia";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Roles from "../../db/Roles";
import Users from "../../db/User";
import UserHasRole from "../../db/UserHasRole";

type TokenBody = {
  _id: string;
  created_at: Date;
  username: string;
  name: string;
  email: string;
  avatar?: string;
};

const useTokenSubRoute = () =>
  new Elysia({ prefix: `/token` })
    .use(
      logger({
        level: "info",
      })
    )
    .guard({
      query: t.Object({
        token: t.String({ minLength: 5 }),
      }),
    })
    .resolve(async ({ query, log, error }) => {
      try {
        let decodedToken = jwt.decode(query.token as any) as TokenBody;
        if (decodedToken === null) {
          // return error("Bad Request", {
          //   message: `The provided token is unauthorized.`,
          // });
          return {
            errorType: "Bad Request",
            message: "The provided token is unauthorized.",
          };
        }

        const response = await Users.findById(
          {
            _id: new mongoose.Types.ObjectId(decodedToken._id),
          },
          "-hash"
        );

        if (response === undefined) {
          // return error("Bad Request", {
          //   message: `The user is not exists or has been deleted.`,
          // });
          return {
            errorType: "Bad Request",
            message: "The user is not exists or has been deleted.",
          };
        }

        const roles = await UserHasRole.aggregate([
          {
            $match: { userId: response!._id.toString() },
          },
          {
            $limit: 1,
          },

          {
            $lookup: {
              from: Roles.collection.name,
              localField: "roleId",
              foreignField: "_id",
              as: "roles",
            },
          },
          { $unwind: "$roles" },
          {
            $project: {
              "roles._id": 1,
              "roles.name": 1,
              "roles.permissions": 1,
            },
          },
          { $limit: 1 },
        ]);

        // If the user has no role existed
        if (roles.length === 0) {
          // return error("Bad Request", {
          //   message: `The user role is invalid. Please contact admin for this error.`,
          // });
          return {
            errorType: "Bad Request",
            message:
              "The user role is invalid. Please contact admin for this error.",
          };
        }

        return {
          user: { ...response?.toObject(), role: roles[0].roles },
        };
      } catch (err) {
        log.error(err);
        // return error("Bad Request", {
        //   message: `The provided token is unauthorized.`,
        // });

        return {
          errorType: "Bad Request",
          message: "The provided token is unauthorized.",
        };
      }
    })
    .onBeforeHandle(async ({}) => {})
    .get("/", ({ errorType, message, user, error }) => {
      // console.log(errorType, message, user);
      if (errorType !== undefined) {
        return error(errorType, {
          message,
        });
      }
      return {
        user,
      };
    })
    .get("/permissions", ({ errorType, message, user, error }) => {
      if (errorType !== undefined) {
        return error(errorType, {
          message,
        });
      }
      return {
        permissions: [...user!.role.permissions],
      };
    });

export default useTokenSubRoute;
