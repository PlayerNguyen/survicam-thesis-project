import Device from "@src/entities/Device";
import Elysia, { t } from "elysia";
import mongoose, { isValidObjectId } from "mongoose";

const appInstance = new Elysia({ prefix: "/devices" });

appInstance.post(
  `/`,
  async ({ body, set }) => {
    const device = Device.create({
      ...body,
    });

    const savedDevice = await (await device).save();

    set.status = 201;
    return {
      success: true,
      device: savedDevice,
    };
  },
  {
    body: t.Object({
      name: t.String({ minLength: 1 }),
      url: t.String({
        minLength: 1,
      }),
      resize_factor: t.Nullable(t.Number({})),
      last_opened: t.Optional(t.Boolean()),
    }),
    detail: {
      summary: `Adds new device`,
    },
  }
);

appInstance.put(
  `/:id`,
  async ({ error, params, body }) => {
    // Device id is invalid
    if (!isValidObjectId(params.id)) {
      return error(500, {
        success: false,
        message: `Invalid object id.`,
        hint: `The input must be a 24 character hex string, 12 byte Uint8Array, or an integer.`,
      });
    }

    // Look up for the params body
    let currentDevice = await Device.findById(
      new mongoose.Types.ObjectId(params.id)
    );

    if (!currentDevice) {
      return error("Not Found", {
        success: false,
        message: `The device with id ${params.id} cannot be found.`,
      });
    }

    currentDevice.last_opened = body.last_opened || currentDevice.last_opened;
    currentDevice.name = body.name || currentDevice.name;
    currentDevice.resize_factor =
      body.resize_factor || currentDevice.resize_factor;
    currentDevice.url = body.url || currentDevice.url;
    await currentDevice.save();

    return {
      success: true,
      device: currentDevice,
    };
  },
  {
    params: t.Object({
      id: t.String(),
    }),
    body: t.Object({
      name: t.Optional(t.String({ minLength: 1 })),
      url: t.Optional(
        t.String({
          minLength: 1,
        })
      ),
      resize_factor: t.Optional(t.Nullable(t.Number({}))),
      last_opened: t.Optional(t.Boolean()),
    }),
    detail: {
      summary: `Updates generated device`,
    },
  }
);

appInstance.get(
  `/`,
  async ({ query }) => {
    const filter = query.name ? { name: new RegExp(query.name, "i") } : {};
    const devices = await Device.find(filter);
    return { success: true, devices };
  },
  {
    query: t.Object({ name: t.Optional(t.String()) }),
    detail: { summary: `Gets all devices, optionally filtering by name` },
  }
);

appInstance.get(
  `/:id`,
  async ({ params, error }) => {
    if (!isValidObjectId(params.id)) {
      return error(400, { success: false, message: "Invalid object id." });
    }

    const device = await Device.findById(params.id);
    if (!device) {
      return error(404, { success: false, message: `Device not found.` });
    }

    return { success: true, device };
  },
  {
    params: t.Object({ id: t.String() }),
    detail: { summary: `Gets a device by ID` },
  }
);

appInstance.delete(
  `/:id`,
  async ({ params, error }) => {
    if (!isValidObjectId(params.id)) {
      return error(400, { success: false, message: "Invalid object id." });
    }

    const deletedDevice = await Device.findByIdAndDelete(params.id);
    if (!deletedDevice) {
      return error(404, { success: false, message: `Device not found.` });
    }

    return { success: true, message: "Device deleted successfully." };
  },
  {
    params: t.Object({ id: t.String() }),
    detail: { summary: `Deletes a device by ID` },
  }
);

const useDevice = () => appInstance;

export default useDevice;
