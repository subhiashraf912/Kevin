import { Snowflake } from "discord.js";

interface TextLevelingGuildsSettingsConfiguration {
  enabled: boolean;
  guildId: Snowflake;
  minXpPerMessage: number;
  maxXpPerMessage: number;
}

export default TextLevelingGuildsSettingsConfiguration;
