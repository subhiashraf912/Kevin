import { registerCommands, registerEvents } from "./utils/registry";
import config from "../slappey.json";
import DiscordClient from "./classes/Client/Client";
import { Intents } from "discord.js";
import dotenv from "dotenv";
dotenv.config();
const client = new DiscordClient({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

(async () => {
  client.prefix = config.prefix || client.prefix;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await client.database.init();
  await client.login(process.env.BOT_TOKEN);
})();
