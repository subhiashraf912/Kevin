import { Snowflake } from "discord.js";

type GuildCounter = {
  channelId: Snowflake | null;
  text: string | null;
};

interface GuildCountersConfiguration {
  membersCounter: GuildCounter;
  rolesCounter: GuildCounter;
  channelsCounter: GuildCounter;
  botsCounter: GuildCounter;
  guildId: Snowflake;
}

export default GuildCountersConfiguration;
