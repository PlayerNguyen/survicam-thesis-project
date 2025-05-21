import mongoose from "mongoose";
import { LoggingModel, type ILogging } from "../models/LoggingModel";

export interface LoggingRequestParams {
  id?: string;
  fromDate?: Date;
  toDate?: Date;
  predicted?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}

export interface LoggingPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export class LoggingService {
  public static async addLogging(params: ILogging) {
    const data = await LoggingModel.create(params);

    await data.save();
    return data;
  }

  public static async getLogging(params: LoggingRequestParams = {}) {
    try {
      // Set default pagination values
      const page = params.page || 1;
      const limit = params.limit || 10;
      const skip = (page - 1) * limit;

      // Build query based on parameters
      const query: any = {};

      // Filter by ID if provided
      if (params.id) {
        query._id = new mongoose.Types.ObjectId(params.id);
      }

      // Filter by date range if provided
      if (params.fromDate || params.toDate) {
        query.createdAt = {};
        if (params.fromDate) {
          query.createdAt.$gte = new Date(params.fromDate);
        }
        if (params.toDate) {
          query.createdAt.$lte = new Date(params.toDate);
        }
      }

      // Filter by predicted ID if provided
      if (params.predicted) {
        query["predict_result.id"] = params.predicted;
      }

      // Set up sorting
      const sortOptions: any = {};
      if (params.sortBy) {
        sortOptions[params.sortBy] = params.sortOrder === "desc" ? -1 : 1;
      } else {
        // Default sort by createdAt in descending order
        sortOptions.createdAt = -1;
      }

      // Execute query with pagination
      const loggings = await LoggingModel.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .exec();

      // Get total count for pagination info
      const totalItems = await LoggingModel.countDocuments(query);
      const totalPages = Math.ceil(totalItems / limit);

      // Prepare pagination object
      const pages: LoggingPagination = {
        page,
        limit,
        totalItems,
        totalPages,
      };

      return {
        loggings,
        pages,
        success: true,
      };
    } catch (error) {
      console.error("Error fetching logging data:", error);
      throw error;
    }
  }
}
