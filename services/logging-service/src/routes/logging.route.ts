import type { Context } from "hono";
import mongoose from "mongoose";
import { appFactory } from "../factory";
import { LoggingService } from "../services/LoggingService";

const LoggingRouter = appFactory
  .createApp()
  .post("/", async (context: Context) => {
    const { similarity, image, predict_result } = await context.req.json();

    const loggingResponse = await LoggingService.addLogging({
      similarity,
      image,
      predict_result,
    });
    return context.json(
      {
        id: loggingResponse.id,
      },
      200
    );
  })
  .get("/", async (c) => {
    try {
      const query = c.req.query();

      const result = await LoggingService.getLogging({
        id: query.id,
        fromDate: query.fromDate ? new Date(query.fromDate) : undefined,
        toDate: query.toDate ? new Date(query.toDate) : undefined,
        predicted: query.predicted,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        page: Number(query.page ?? 1),
        limit: Number(query.limit ?? 10),
      });

      return c.json({ ...result });
    } catch (error) {
      console.error("Error handling logging request:", error);
      return c.json(
        { success: false, message: "Failed to fetch logging data" },
        500
      );
    }
  });

export default LoggingRouter;
