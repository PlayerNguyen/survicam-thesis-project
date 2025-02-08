import StreamingProcess from "@shared/streaming/StreamingProcess";
import Assertions from "@shared/util/Assertions";
import Device from "@src/entities/Device";
import type { Subprocess } from "bun";
import path from "path";

const STREAM_OUTPUT_DIRECTORY = Bun.env.STREAM_OUTPUT_DIRECTORY || "./data";

class DeviceManagement {
  context: Map<String, Subprocess[]> = new Map<String, Subprocess[]>();
  static deviceManagement: DeviceManagement;

  public async init() {
    // Load the list opened into database
    const listOfOpenedDevice = await Device.find({ last_opened: true });
    console.log(`Found ${listOfOpenedDevice.length} devices...`);

    // Initial the device
    for (let device of listOfOpenedDevice) {
      const deviceId = device._id.toString();
      console.log(`Put ${deviceId} into the convert process...`);
      const outputName = path.join(
        STREAM_OUTPUT_DIRECTORY,
        deviceId,
        "stream.m3u8",
      );

      // Start HLS processes
      const HLSStreamProcess = await StreamingProcess.spawnConverterRTSPToHLS(
        device.url,
        outputName,
        deviceId,
      );

      // Start adapter
      const adapterProcess = await StreamingProcess.spawnAdapterRtsp2Mq(
        device.url,
        Assertions.assertNotUndefined(
          Bun.env.RABBIT_MQ_URI,
          "Please setup the RABBIT_MQ_URI in environment variable.",
        ),
        deviceId,
      );

      this.context.set(device._id.toString(), [
        HLSStreamProcess,
        adapterProcess,
      ]);
    }
  }

  public async cancel(id: string) {
    const processes = this.context.get(id);
    if (!processes) {
      throw new Error(`Cannot found processes with id ${id}`);
    }

    // Kill all processes
    processes.forEach((process) => {
      console.log(`Kill the process from id=${id} with pid=${process.pid}`);
      process.kill(0);
    });
  }

  public async cancelAll() {
    // const allProcesses = this.context.values();
    for (const processes of this.context.values()) {
      console.log(`Processes size: `, processes.length);
      for (const process of processes) {
        console.log(`Killing process with pid=${process.pid}`);
        process.kill(0);
      }
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
