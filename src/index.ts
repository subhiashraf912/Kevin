import {
  registerCommands,
  registerEvents,
  registerSlashCommands,
  // registerWebSocketEvents,
} from "./utils/registry";
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
  await registerSlashCommands(client, "../slashCommands");
  // await registerWebSocketEvents(client, "../WebSocketEvents");
  await client.database.init();
  await client.login(process.env.BOT_TOKEN);
})();

client.on("voiceStateUpdate", (oldState, newState) => {
  try {
    if (oldState.guild.id !== "783991881028993045") return;
    if (!oldState.channel && newState.channel) {
      const role = newState.guild.roles.cache.get("933290405116665876");
      if (role) newState.member?.roles.add(role);
    }
    if (oldState.channel && !newState.channel) {
      const role = newState.guild.roles.cache.get("933290405116665876");
      if (role) newState.member?.roles.remove(role);
    }
  } catch {}
});
