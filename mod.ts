/**
 * A module providing a client to consume the EVE:Frontier World API.
 *
 * @example
 * ```ts
 * import { Client } from "@murphyslaw/frontier-world-api-client";
 *
 * const client = new Client({
 *   baseUrl: "https://blockchain-gateway-stillness.live.tech.evefrontier.com",
 * });
 *
 * const health: boolean = await client.health();
 * ```
 *
 * @module
 */

export * from "./lib/Client.ts";
export type * from "./types/types.d.ts";
