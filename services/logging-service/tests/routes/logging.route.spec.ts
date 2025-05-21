import { describe, expect, it } from "bun:test";
import app from "../../src/app";

describe(`[-] POST /logging`, () => {
  it(`should create a logging; then return 200`, async () => {
    // Arrange
    const data = {
      similarity: 0.5,
      image: "abcdef",
      predict_result: [
        {
          id: "123",
          distance: 0.1,
        },
      ],
    };
    // Act
    const response = await app.fetch(
      new Request("http://localhost:3432/logging", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "content-type": "application/json",
        },
      })
    );

    // Assert
    expect(response.status).toEqual(200);
  });
});
