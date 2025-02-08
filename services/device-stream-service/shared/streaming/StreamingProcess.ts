import app from "@src/app";
import chalk from "chalk";

import fs from "fs";
import path from "path";

async function logStream(
  stream: ReadableStream<Uint8Array>,
  prefix: string,
  color: (text: string) => string,
  deviceId?: string,
) {
  const reader = stream.getReader();

  (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const timestamp = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
      console.log(
        `${timestamp} ${color(`[${prefix}]`)} ${color(
          `[${deviceId || "Unknown Id"}]`,
        )} ${chalk.white(new TextDecoder().decode(value))}`,
      );
    }
  })();
}

async function spawnConverterRTSPToHLS(
  input: string,
  output: string,
  deviceId?: string,
) {
  // ffmpeg -i "rtsp://localhost:8554/stream1"
  // -hls_time 3 -hls_segment_filename "%sa.ts" -f hls
  // "./output/streaming.m3u8"

  // resolve the absolute path
  const absolutePath = path.resolve(process.cwd(), output);
  const dirname = path.dirname(absolutePath);

  // Generate a dir if not available
  if (!fs.existsSync(dirname)) {
    console.log(`Generating a directory: `, dirname);
    fs.mkdirSync(dirname, { recursive: true });
  }
  
  console.log(`Generating application: ffmpeg on ${absolutePath}`)
  const _process = Bun.spawn(
    [
      "ffmpeg",
      "-fflags",
      "+genpts", // Generate timestamps for proper syncing
      "-rtsp_transport",
      "tcp",
      "-timeout",
      "5000000",
      "-i",
      input,

      // 🔹 Fast encoding & low-latency settings
      "-preset",
      "ultrafast",
      "-tune",
      "zerolatency",
      "-g",
      "25", // Smaller GOP size for lower latency

      // 🔹 Reduce buffering & memory growth
      "-vsync",
      "1",
      "-async",
      "1",
      "-rtbufsize",
      "50k", // Reduce buffer size further
      "-reorder_queue_size",
      "256", // Lower queue size
      "-flags",
      "+low_delay",
      "-fflags",
      "nobuffer",
      "-flush_packets",
      "1", // Flush packets to avoid RAM buildup

      // 🔹 Prevent segment accumulation
      "-hls_flags",
      "delete_segments", // Remove old segments to free memory
      "-hls_time",
      "2",
      "-hls_list_size",
      "5", // Keep only last 5 segments in memory
      "-f",
      "hls",
      absolutePath,
    ],

    {
      stdout: "pipe",
      stderr: "pipe",
    },
  );

  // Logging out to output
  logStream(_process.stdout, "stdout", chalk.blue, deviceId);
  logStream(_process.stderr, "stderr", chalk.redBright, deviceId);

  //
  console.log(`Spawning a process with pid: ${_process.pid}`);
  console.log(dirname);

  return _process;
}

async function spawnAdapterRtsp2Mq(
  rtspUri: string,
  rabbitUri: string,
  deviceId?: string,
) {
  const appLocation = path.join(`micro-app`, `rtsp2mq-adapter`, "main.py");
  console.log(appLocation);
  console.log(appLocation, rtspUri, rabbitUri, deviceId);
  /**
  Spawn the adapter application
  */
  const clusterProcess = Bun.spawn(
    ["python", appLocation, rtspUri, rabbitUri, deviceId || "Unknown Device"],
    {
      stderr: "pipe",
      stdout: "pipe",
    },
  );
  logStream(clusterProcess.stdout, "stdout", chalk.blue, deviceId);
  logStream(clusterProcess.stderr, "stderr", chalk.redBright, deviceId);
  console.log(`Adapter is spawning with pid=${clusterProcess.pid}`);

  return clusterProcess;
}

const StreamingProcess = {
  spawnConverterRTSPToHLS,
  spawnAdapterRtsp2Mq,
};
export default StreamingProcess;
