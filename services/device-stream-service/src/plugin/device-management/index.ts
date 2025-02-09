import Elysia, { t } from "elysia";
import mongoose from "mongoose";
import Device from "@src/entities/Device";
import DeviceManagement from "@shared/device-management";

const pluginInstance = new Elysia({ prefix: "/device-management" });

// Start a device process
pluginInstance.post(
  "/start/:id",
  async ({ params, error, set }) => {
    if (!mongoose.isValidObjectId(params.id)) {
      return error(400, { success: false, message: "Invalid object id." });
    }

    try {
      await DeviceManagement.getInstance().start(params.id);
      await Device.findByIdAndUpdate(params.id, { last_opened: true });
      set.status = 200;
      return { success: true, message: `Device process started for id=${params.id}` };
    } catch (err) {
      return error(500, { success: false, message: (err as Error).message });
    }
  },
  {
    params: t.Object({ id: t.String() }),
    detail: { summary: "Starts a device process by ID" },
  }
);

// Stop a device process
pluginInstance.post(
  "/stop/:id",
  async ({ params, error, set }) => {
    if (!mongoose.isValidObjectId(params.id)) {
      return error(400, { success: false, message: "Invalid object id." });
    }

    try {
      await DeviceManagement.getInstance().stop(params.id);
      await Device.findByIdAndUpdate(params.id, { last_opened: false });
      set.status = 200;
      return { success: true, message: `Device process stopped for id=${params.id}` };
    } catch (err) {
      return error(500, { success: false, message: (err as Error).message });
    }
  },
  {
    params: t.Object({ id: t.String() }),
    detail: { summary: "Stops a device process by ID" },
  }
);

// Get list of current tasks
pluginInstance.get(
  "/tasks",
  async () => {
    const tasks = Array.from(DeviceManagement.getInstance().context.entries()).map(
      ([id, processes]) => ({
        id,
        pids: processes.map((proc) => proc.pid ?? null),
      })
    );
    return { success: true, tasks };
  },
  {
    detail: { summary: "Gets a list of current device tasks" },
  }
);

const useDeviceManagement = (): Elysia => pluginInstance;

export default useDeviceManagement;