import chalk from "chalk";
import fs from "fs";
import path from "path";

async function logStream(
  stream: ReadableStream<Uint8Array>,
  prefix: string,
  color: (text: string) => string,
  deviceId?: string
) {
  const reader = stream.getReader();

  (async () => {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const timestamp = chalk.gray(`[${new Date().toLocaleTimeString()}]`);
      console.log(
        `${timestamp} ${color(`[${prefix}]`)} ${color(
          `[${deviceId || "Unknown Id"}]`
        )} ${chalk.white(new TextDecoder().decode(value))}`
      );
    }
  })();
}

async function spawnConverterRTSPToHLS(
  input: string,
  output: string,
  deviceId?: string
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

  const _process = Bun.spawn(
    [
      "ffmpeg",
      //
      "-fflags", "+genpts", // Generate timestamps for proper syncing
      "-rtsp_transport", "tcp",
      "-timeout", "5000000",
      "-i", input,
      "-vsync", "1",        // Sync video frames
      "-async", "1",        // Sync audio to video
      "-af", "aresample=async=1", // Resample audio dynamically
      "-reorder_queue_size", "1024", // Improve buffer handling
      "-hls_time", "2",
      "-hls_list_size", "0",
      "-f", "hls",
      absolutePath,
    ],

    {
      stdout: "pipe",
      stderr: "pipe",
    }
  );

  // Logging out to output
  logStream(_process.stdout, "stdout", chalk.blue, deviceId);
  logStream(_process.stderr, "stderr", chalk.redBright, deviceId);

  //
  console.log(`Spawning a process with pid: ${_process.pid}`);
  console.log(dirname);

  return _process;
}

const StreamingProcess = {
  spawnConverterRTSPToHLS,
};
export default StreamingProcess;
