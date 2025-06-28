import { Client, type Config } from "../lib/Client.ts";

const config: Config = {
  baseUrl: "https://blockchain-gateway-stillness.live.tech.evefrontier.com",
};
const client: Client = new Client(config);

const response = await client.health();

console.log(response);
