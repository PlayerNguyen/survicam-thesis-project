import StreamingProcess from "@shared/streaming/StreamingProcess";
import { describe, it } from "bun:test";

describe(`StreamingProcess`, () => {
  it(`should spawn a process`, async () => {
    const _process = await StreamingProcess.spawnConverterRTSPToHLS(
      "rtsp://localhost:8554/stream1",
      "./dist/stream1/stream1.m8u3"
    );
    _process.kill(0);
  });
});
