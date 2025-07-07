import type { components } from "./world-api.schema.d.ts";

export type Format = "json" | "pod";

export type Pod = components["schemas"]["pod.Pod"];
export type ERC2771 = components["schemas"]["v1.ERC2771"];

// deno-lint-ignore ban-types no-explicit-any
export type Constructor<T = {}> = new (...args: any[]) => T;
