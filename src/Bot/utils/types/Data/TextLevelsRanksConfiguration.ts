import { Snowflake } from "discord.js";

interface TextLevelsRanksConfiguration {
  guildId: Snowflake;
  userId: Snowflake;
  level: number;
  xp: number;
  lastMessage: number;
  rankBackground: string | null;
}

export default TextLevelsRanksConfiguration;
