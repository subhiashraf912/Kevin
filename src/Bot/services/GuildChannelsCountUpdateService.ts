import { GuildChannel } from "discord.js";
import DiscordClient from "../classes/Client/Client";

export default async function guildChannelsCountUpdateService(
  client: DiscordClient,
  channel: GuildChannel
) {
  try {
    let configurations = client.configurations.guildCounters.get(
      channel.guild?.id
    );
    if (!configurations) {
      configurations = await client.configurations.guildCounters.fetch(
        channel.guild?.id
      );
      if (!configurations) return;
    }
    const { channel: counterChannel, text } = configurations.channelsCounter;
    if (counterChannel && text)
      counterChannel.setName(
        text.replaceAll("{count}", channel.guild.channels.cache.size.toString())
      );
  } catch {}
}
