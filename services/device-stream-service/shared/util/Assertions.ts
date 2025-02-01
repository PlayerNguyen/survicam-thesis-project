/**
 * Ensures that the provided value is not undefined.
 *
 * @template T - The type of the value being checked.
 * @param {T | undefined} v - The value to check.
 * @param {string} [msg] - Optional custom error message.
 * @returns {T} - Returns the provided value if it is not undefined.
 * @throws {Error} - Throws an error if the value is undefined.
 */
function assertNotUndefined<T>(v?: T, msg?: string) {
  if (v === undefined) {
    throw new Error(msg || "The passing argument cannot be undefined");
  }
  return v;
}

const Assertions = {
  assertNotUndefined,
};

export default Assertions;
