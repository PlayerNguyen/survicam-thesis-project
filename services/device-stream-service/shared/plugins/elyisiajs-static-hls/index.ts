import Elysia from "elysia";
import mime from "mime-types";
import nodePath from "path";

export type StaticHLSOptions = {
  assetDirectory?: string;
  prefix?: string;
};

const staticHls = (options?: StaticHLSOptions) => {
  /**
   * Bootstrapping application
   */
  const assetDirectory = (options && options.assetDirectory) || "public";
  const defaultPrefix = (options && options.prefix) || "public";

  return new Elysia({ name: "static-hls" })
    .decorate("type", "plugin")
    .get(`${defaultPrefix}/`, ({ error }) => {
      /**
       * Main resolver
       */
      return error("Not Found");
    })
    .get(`${defaultPrefix}/*`, async ({ path, error, set }) => {
      const eliminatedPath = path.replace(defaultPrefix, "");
      const absolutePathForLookUp = nodePath.resolve(
        nodePath.join(process.cwd(), assetDirectory, eliminatedPath)
      );

      console.log(`Looking up at: ${absolutePathForLookUp}`);

      const bunFile = Bun.file(absolutePathForLookUp);
      if (!(await bunFile.exists())) {
        console.error(`Not found the file: ${absolutePathForLookUp}`);

        return error("Not Found");
      }

      const extName = nodePath.extname(absolutePathForLookUp);
      console.log(extName);

      // resolve the header
      if (extName === ".m3u8") {
        set.headers["content-type"] = "application/x-mpegURL";
      } else if (extName === ".ts") {
        set.headers["content-type"] = "video/mp2t";
      } else {
        set.headers["content-type"] =
          mime.lookup(extName) || "application/octet-stream";
      }

      return await bunFile.arrayBuffer();
      // return "// + path=" + absolutePathForLookUp;
    });
};

export { staticHls };
