import { Client } from "../lib/Client.ts";
import type { Config } from "../types/types.d.ts";

const config: Config = {
  baseUrl: "https://blockchain-gateway-stillness.live.tech.evefrontier.com",
};
const client: Client = new Client(config);

const health: boolean = await client.health();
console.log(health);
