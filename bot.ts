import { Client, IntentsString } from "discord.js";
const intents: IntentsString[] = [
  "GUILDS",
  "GUILD_MEMBERS",
  "GUILD_BANS",
  "GUILD_EMOJIS_AND_STICKERS",
  "GUILD_INTEGRATIONS",
  "GUILD_WEBHOOKS",
  "GUILD_INVITES",
  "GUILD_VOICE_STATES",
  "GUILD_PRESENCES",
  "GUILD_MESSAGES",
  "GUILD_MESSAGE_REACTIONS",
  "GUILD_MESSAGE_TYPING",
  "DIRECT_MESSAGES",
  "DIRECT_MESSAGE_REACTIONS",
  "DIRECT_MESSAGE_TYPING",
  "GUILD_SCHEDULED_EVENTS",
];
const client = new Client({ intents });

client.login("ODY0NTU4ODcyMjE0ODk2NjYw.YO3NMQ.9KcZxT3OFgBLbRx_29pwsz4rTTI");

client.on("messageCreate", (message) => {
  if (message.content.length > 100) {
    message.delete();
  }
});
