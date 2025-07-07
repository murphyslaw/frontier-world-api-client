import type { Constructor } from "../types/types.d.ts";
import type { Action } from "./Action.ts";

export function Formatted<T, TBase extends Constructor<Action<T>>>(
  Base: TBase,
) {
  return class Formatted extends Base {
    public set format(value: "json" | "pod") {
      this.searchParams.set("format", value);
    }
  };
}
