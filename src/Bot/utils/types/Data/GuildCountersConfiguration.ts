import { Guild, VoiceChannel } from "discord.js";

export type GuildCounter = {
  channel: VoiceChannel | null;
  text: string | null;
};

interface GuildCountersConfiguration {
  membersCounter: GuildCounter;
  rolesCounter: GuildCounter;
  channelsCounter: GuildCounter;
  botsCounter: GuildCounter;
  guild: Guild;
}

export default GuildCountersConfiguration;
