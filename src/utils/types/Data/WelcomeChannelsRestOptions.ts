import { Snowflake } from "discord.js";

interface WelcomeChannelsRestOptions {
  guildId: Snowflake;
  channelId: string;
  message: string;
}

export default WelcomeChannelsRestOptions;
