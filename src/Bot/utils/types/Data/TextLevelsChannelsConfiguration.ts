import { Snowflake } from "discord.js";

interface TextLevelsChannelsConfiguration {
  channels: string[];
  guildId: Snowflake;
}

export default TextLevelsChannelsConfiguration;
