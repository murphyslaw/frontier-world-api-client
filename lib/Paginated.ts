import type { Constructor } from "../types/types.d.ts";
import type { Action } from "./Action.ts";

export function Paginated<T, TBase extends Constructor<Action<T>>>(
  Base: TBase,
) {
  return class Paginated extends Base {
    public set limit(value: number) {
      this.searchParams.set("limit", String(value));
    }

    public set offset(value: number) {
      this.searchParams.set("offset", String(value));
    }
  };
}
