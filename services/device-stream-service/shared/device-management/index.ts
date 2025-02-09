import StreamingProcess from "@shared/streaming/StreamingProcess";
import Assertions from "@shared/util/Assertions";
import Device from "@src/entities/Device";
import { $, type Subprocess } from "bun";
import { log } from "console";
import path from "path";

const STREAM_OUTPUT_DIRECTORY = Bun.env.STREAM_OUTPUT_DIRECTORY || "./data";

class DeviceManagement {
  context: Map<String, Subprocess[]> = new Map<String, Subprocess[]>();
  static deviceManagement: DeviceManagement;

  public async init() {
    const listOfOpenedDevice = await Device.find({ last_opened: true });
    console.log(`Found ${listOfOpenedDevice.length} devices...`);

    for (let device of listOfOpenedDevice) {
      await this.start(device._id.toString());
    }
  }

  public async cancel(id: string) {
    await this.stop(id);
  }

  public async cancelAll() {
    for (const id of this.context.keys()) {
      await this.stop(id);
    }
  }

  public static getInstance() {
    if (this.deviceManagement === undefined) {
      this.deviceManagement = new DeviceManagement();
    }
    return this.deviceManagement;
  }

  // Added: Start a single device process
  public async start(id: string) {
    if (this.context.has(id)) {
      throw new Error(`Device with id ${id} is already running.`);
    }

    const device = await Device.findById(id);
    if (!device) {
      throw new Error(`Device with id ${id} not found.`);
    }

    console.log(`Starting device process for id=${id}...`);
    const outputName = path.join(STREAM_OUTPUT_DIRECTORY, id, "stream.m3u8");

    const HLSStreamProcess = await StreamingProcess.spawnConverterRTSPToHLS(
      device.url,
      outputName,
      id,
    );

    const adapterProcess = await StreamingProcess.spawnAdapterRtsp2Mq(
      device.url,
      Assertions.assertNotUndefined(
        Bun.env.RABBIT_MQ_URI,
        "Please setup the RABBIT_MQ_URI in environment variable.",
      ),
      id,
    );

    this.context.set(id, [HLSStreamProcess, adapterProcess]);
    console.log(`Device process started for id=${id}`);
  }

  // Added: Stop a single device process
  public async stop(id: string) {
    const processes = this.context.get(id);
    if (!processes) {
      throw new Error(`Cannot find processes with id ${id}`);
    }

    console.log(`Stopping device process for id=${id}...`);
    for (const subprocess of processes) {
      console.log(`Killing process with pid=${subprocess.pid}`);
      try {
        subprocess.kill("SIGINT")
        
      } catch (err) {
        console.error((err as Error).message);
        throw err;
      }
    }

    this.context.delete(id);
    console.log(`Device process stopped for id=${id}`);
  }
}

export default DeviceManagement;
