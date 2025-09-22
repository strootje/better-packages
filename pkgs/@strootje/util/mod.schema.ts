import type { StandardSchemaV1 as SS } from "@standard-schema/spec";

export const validateSync = <T extends SS>(schema: T, input: SS.InferInput<T>): SS.InferOutput<T> => {
  const result = schema["~standard"].validate(input);
  if (result instanceof Promise) throw "async not supported";

  // if the `issues` field exists, the validation failed
  if (result.issues) {
    throw new Error(JSON.stringify(result.issues, null, 2));
  }

  return result.value;
};
