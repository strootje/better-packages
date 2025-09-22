import type { StandardSchemaV1 as SS } from "@standard-schema/spec";
import type { Result } from "neverthrow";
import { validateSync } from "./mod.schema.ts";

export const unmap = <TIn extends SS, TOut>(
  schema: TIn,
  fn: (input: SS.InferOutput<TIn>) => TOut,
): (input: SS.InferInput<TIn>) => TOut => {
  return (input: SS.InferInput<TIn>) => fn(validateSync(schema, input));
};

export const remap = <TIn extends SS, TOut extends SS>(
  schemas: readonly [TIn, TOut],
  fn: (input: SS.InferOutput<TIn>) => Promise<Result<Response, unknown>>,
): ReturnType<typeof unmap<TIn, Promise<SS.InferOutput<TOut>>>> => {
  return unmap<TIn, Promise<SS.InferOutput<TOut>>>(schemas[0], async (input) => {
    const resp = await fn(input);
    if (resp.isErr()) return resp;
    return validateSync(schemas[1], await resp.value.json());
  });
};
