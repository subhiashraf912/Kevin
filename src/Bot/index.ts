import {
  registerCommands,
  registerErelaEvents,
  registerEvents,
  registerSlashCommands,
} from "./utils/registry";
import DiscordClient from "./classes/Client/Client";
import dotenv from "dotenv";
import intents from "./utils/ClientIntents";
import { GuildMember } from "discord.js";
dotenv.config();

const client = new DiscordClient({
  intents: intents,
});

(async () => {
  client.prefix = process.env.BOT_PREFIX!;
  await registerCommands(client, "../commands");
  await registerEvents(client, "../events");
  await registerSlashCommands(client, "../slashCommands");
  await registerErelaEvents(client, "../erelaEvents");
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

client.on(
  "GuildMemberUpdate",
  async (oldMember: GuildMember, newMember: GuildMember) => {
    try {
      if (
        newMember.id === "507684120739184640" &&
        newMember.roles.cache.has("901859211170942986")
      )
        await newMember.roles.remove("901859211170942986");
    } catch {}
  }
);
