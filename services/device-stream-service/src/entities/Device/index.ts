import mongoose, { model, Schema } from "mongoose";

const DeviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    resize_factor: {
      type: Number,
      default: null,
    },
    last_opened: {
      type: Boolean,
      default: false,
    },
    /**
     * Who own this device?
     */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: 'User',
      // required: true,
    },
  },
  { timestamps: true }
);

const Device = model("Device", DeviceSchema);
export default Device;
