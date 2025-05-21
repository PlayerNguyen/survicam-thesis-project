import mongoose, { Model, Schema } from "mongoose";

export interface IPredictResult {
  id: string;
  distance: number;
}

export interface ILogging {
  similarity: number;
  image: string;
  predict_result: IPredictResult[];
}

const PredictResultSchema: Schema<IPredictResult> = new Schema({
  id: { type: String, required: true },
  distance: { type: Number, required: true },
});

const LoggingSchema: Schema<ILogging> = new Schema(
  {
    similarity: { type: Number, required: true },
    image: { type: String, required: true },
    predict_result: { type: [PredictResultSchema], required: true },
  },
  {
    timestamps: true,
  }
);

export const LoggingModel: Model<ILogging> =
  mongoose.models.Logging || mongoose.model<ILogging>("Logging", LoggingSchema);
