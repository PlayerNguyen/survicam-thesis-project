import StreamingProcess from "@shared/streaming/StreamingProcess";
import Device from "@src/entities/Device";
import type { Subprocess } from "bun";
import path from "path";

const STREAM_OUTPUT_DIRECTORY = Bun.env.STREAM_OUTPUT_DIRECTORY || "./data";

class DeviceManagement {
  context: Map<String, Subprocess> = new Map<String, Subprocess>();
  static deviceManagement: DeviceManagement;

  public async init() {
    // Load the list opened into database
    const listOfOpenedDevice = await Device.find({ last_opened: true });
    for (let device of listOfOpenedDevice) {
      const deviceId = device._id.toString();
      console.log(`Put ${deviceId} into the convert process...`);
      const outputName = path.join(
        STREAM_OUTPUT_DIRECTORY,
        deviceId,
        "stream.m3u8"
      );

      const convertToHlsProcess =
        await StreamingProcess.spawnConverterRTSPToHLS(
          device.url,
          outputName,
          deviceId
        );

      this.context.set(device._id.toString(), convertToHlsProcess);
    }
  }

  public static getInstance() {
    if (this.deviceManagement === undefined) {
      this.deviceManagement = new DeviceManagement();
    }

    return this.deviceManagement;
  }
}

export default DeviceManagement;
