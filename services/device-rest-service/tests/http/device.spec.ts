import { faker } from "@faker-js/faker";
import app from "@src/app";
import { beforeAll, describe, expect, it } from "bun:test";
import mongoose from "mongoose";

describe(`POST /devices`, () => {
  it(`should creates a new device`, async () => {
    const device = {
      name: faker.internet.username(),
      url: `rtsp://localhost:8554/stream1`,
      resize_factor: null,
    };
    const req = await app.handle(
      new Request("localhost:3000/devices", {
        method: `post`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(device),
      })
    );

    expect(req.status).toEqual(201);
    const deviceResponse = await req.json();
    expect(deviceResponse).toHaveProperty("success", true);
    expect(deviceResponse).toHaveProperty("device");
    console.table(deviceResponse.device);
  });
});

interface Device {
  _id: string;
  name: string;
  url: string;
  resize_factor: number | null;
  last_opened: boolean;
  __v: number;
  createdAt: Date;
  updatedAt: Date;
}

describe(`PUT /devices/:id`, () => {
  const device = {
    name: faker.internet.username(),
    url: `rtsp://localhost:8554/stream1`,
    resize_factor: null,
  };
  let responseDevice: Device | undefined;

  /**
   * Perquisite: Creates before test put
   */
  beforeAll(async () => {
    const req = await app.handle(
      new Request("localhost:3000/devices", {
        method: `post`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(device),
      })
    );

    expect(req.status).toEqual(201);
    responseDevice = (await req.json()).device;
  });

  it(`should deny with no id found`, async () => {
    // Generates a request
    const mockUrl = `localhost:3000/devices/${mongoose.Types.ObjectId.createFromTime(
      1
    )}`;
    console.log(mockUrl);

    const req = await app.handle(
      new Request(mockUrl, {
        method: `put`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      })
    );
    const responseBody = await req.json();
    expect(req.status).toEqual(404);
    expect(responseBody).toHaveProperty(`success`, false);
    expect(responseBody.message).toMatch(
      /The device with id .+ cannot be found./
    );
  });

  it(`should allow to update the device`, async () => {
    // Generates a request
    const req = await app.handle(
      new Request(`localhost:3000/devices/${responseDevice!._id}`, {
        method: `put`,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...device,
          url: "a",
        }),
      })
    );

    //
    const bodyResponse = await req.json();
    expect(req.status).toEqual(200);

    expect(bodyResponse).toHaveProperty(`success`, true);
    expect(bodyResponse).toHaveProperty("device");
    expect(bodyResponse).toHaveProperty(["device", "url"], `a`);
  });

  it(`should deny if the device id is invalid`, async () => {
    const req = await app.handle(
      new Request(`localhost:3000/devices/abcdefgh`, {
        method: `put`,
        body: "{}",
        headers: {
          "Content-Type": "application/json",
        },
      })
    );
    const bodyJson = await req.json();

    expect(req.status).toEqual(500);

    expect(bodyJson).toHaveProperty("success", false);
    expect(bodyJson.message).toMatch(/Invalid object id./);
    expect(bodyJson.hint).toMatch(
      /The input must be a 24 character hex string, 12 byte Uint8Array, or an integer./
    );
  });
});

describe(`GET /devices`, () => {
  it(`should retrieve all devices`, async () => {
    const req = await app.handle(
      new Request("localhost:3000/devices", { method: `get` })
    );
    expect(req.status).toEqual(200);
    const body = await req.json();
    expect(body).toHaveProperty("success", true);
    expect(Array.isArray(body.devices)).toBe(true);
  });
});

describe(`GET /devices/:id`, () => {
  let responseDevice: Device | undefined;

  beforeAll(async () => {
    const req = await app.handle(
      new Request("localhost:3000/devices", {
        method: `post`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Device",
          url: "rtsp://localhost:8554/stream1",
          resize_factor: null,
        }),
      })
    );
    expect(req.status).toEqual(201);
    responseDevice = (await req.json()).device;
  });

  it(`should retrieve a single device by ID`, async () => {
    const req = await app.handle(
      new Request(`localhost:3000/devices/${responseDevice!._id}`, {
        method: `get`,
      })
    );
    expect(req.status).toEqual(200);
    const body = await req.json();
    expect(body).toHaveProperty("success", true);
    expect(body).toHaveProperty("device");
  });

  it(`should return 404 for a non-existent ID`, async () => {
    const req = await app.handle(
      new Request(
        `localhost:3000/devices/${mongoose.Types.ObjectId.createFromTime(1)}`,
        { method: `get` }
      )
    );
    expect(req.status).toEqual(404);
  });

  it(`should return 400 for an invalid object ID`, async () => {
    const req = await app.handle(
      new Request(`localhost:3000/devices/invalid-id`, { method: `get` })
    );
    expect(req.status).toEqual(400);
    const body = await req.json();
    expect(body).toHaveProperty("success", false);
    expect(body.message).toMatch(/Invalid object id./);
  });
});

describe(`DELETE /devices/:id`, () => {
  let responseDevice: Device | undefined;

  beforeAll(async () => {
    const req = await app.handle(
      new Request("localhost:3000/devices", {
        method: `post`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Test Device",
          url: "rtsp://localhost:8554/stream1",
          resize_factor: null,
        }),
      })
    );
    expect(req.status).toEqual(201);
    responseDevice = (await req.json()).device;
  });

  it(`should delete a device by ID`, async () => {
    const req = await app.handle(
      new Request(`localhost:3000/devices/${responseDevice!._id}`, {
        method: `delete`,
      })
    );
    expect(req.status).toEqual(200);
    const body = await req.json();
    expect(body).toHaveProperty("success", true);
  });

  it(`should return 404 when trying to delete a non-existent device`, async () => {
    const req = await app.handle(
      new Request(
        `localhost:3000/devices/${mongoose.Types.ObjectId.createFromTime(1)}`,
        { method: `delete` }
      )
    );
    expect(req.status).toEqual(404);
  });
});
