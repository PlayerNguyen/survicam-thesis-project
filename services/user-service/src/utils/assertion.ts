function assertNotUndefined<T>(v?: T, message?: string) {
  if (v === undefined) {
    throw new Error(message || "Value is undefined.");
  }

  return v!;
}

const Assertions = {
  assertNotUndefined,
};

export default Assertions;
