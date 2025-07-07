import { Client, type ClientConfig } from "../lib/Client.ts";

const config: ClientConfig = {
  base: "https://blockchain-gateway-stillness.live.tech.evefrontier.com",
};
const client: Client = new Client(config);

const response = await client.health();

console.log(response);
