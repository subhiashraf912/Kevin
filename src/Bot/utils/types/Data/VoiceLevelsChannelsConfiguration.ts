import { Snowflake } from "discord.js";

interface VoiceLevelsChannelsConfiguration {
  channels: string[];
  guildId: Snowflake;
}

export default VoiceLevelsChannelsConfiguration;
