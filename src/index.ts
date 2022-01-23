import { registerCommands, registerEvents } from "./utils/registry";
import config from "../slappey.json";
import DiscordClient from "./classes/Client/Client";
import dotenv from "dotenv";
import intents from "./utils/ClientIntents";
dotenv.config();

const client = new DiscordClient({
  intents: intents,
});

(async () => {
  client.prefix = config.prefix || client.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.database.init();
  await client.login(process.env.BOT_TOKEN);
})();
