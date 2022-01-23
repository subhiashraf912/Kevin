import { Guild, GuildTextBasedChannel } from "discord.js";

interface WelcomesConfiguration {
  guild: Guild;
  channel: GuildTextBasedChannel;
  message: string;
}
export default WelcomesConfiguration;
