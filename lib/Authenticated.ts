import type { Constructor } from "../types/types.d.ts";
import type { Action } from "./Action.ts";

export function Authenticated<T, TBase extends Constructor<Action<T>>>(
  Base: TBase,
) {
  return class Authenticated extends Base {
    public set bearer(value: string) {
      this.init = { headers: { "Authorization": `Bearer ${value}` } };
    }
  };
}
