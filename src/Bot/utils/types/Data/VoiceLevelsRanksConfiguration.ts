import { Snowflake } from "discord.js";

interface VoiceLevelsRanksConfiguration {
  guildId: Snowflake;
  userId: Snowflake;
  joinTime: number | null;
  voiceTime: number;
}

export default VoiceLevelsRanksConfiguration;
