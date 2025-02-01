import Assertions from "@shared/common/util/Assertions";

import { describe, expect, test } from "bun:test";
describe("assertNotUndefined", () => {
  test("should return the value if it is defined", () => {
    expect(Assertions.assertNotUndefined(42)).toBe(42);
    expect(Assertions.assertNotUndefined("hello")).toBe("hello");
    expect(Assertions.assertNotUndefined(true)).toBe(true);
    expect(Assertions.assertNotUndefined(false)).toBe(false);
    expect(Assertions.assertNotUndefined(null)).toBe(null);
  });

  test("should throw an error if the value is undefined", () => {
    expect(() => Assertions.assertNotUndefined(undefined)).toThrow(
      "The passing argument cannot be undefined"
    );
  });

  test("should throw an error with the provided message if value is undefined", () => {
    expect(() =>
      Assertions.assertNotUndefined(undefined, "Custom error message")
    ).toThrow("Custom error message");
  });
});
