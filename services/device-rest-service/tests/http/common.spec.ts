import app from "@src/app";
import { describe, expect, it } from "bun:test";

describe(`GET /docs`, () => {
  it(`should accessible to the /docs endpoint`, async () => {
    const response = await app.handle(new Request(`localhost:3000/docs`));
    expect(response.status).toEqual(200);
  });
});
