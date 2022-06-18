import { GuildMember } from "discord.js";
import DiscordClient from "../classes/Client/Client";

export default async function guildMembersCountUpdateService(
  client: DiscordClient,
  member: GuildMember
) {
  try {
    let configurations = client.configurations.guildCounters.get(
      member.guild.id
    );
    if (!configurations) {
      configurations = await client.configurations.guildCounters.fetch(
        member.guild.id
      );
      if (!configurations) return;
    }

    const { channel, text } = configurations.membersCounter;
    const { channel: botsChannel, text: botsText } = configurations.botsCounter;
    if (channel && text)
      channel.setName(
        text.replaceAll("{count}", member.guild.memberCount.toString())
      );

    if (botsChannel && botsText) {
      let BotsSize = member.guild.members.cache.filter(
        (member) => member.user.bot
      ).size;
      botsChannel.setName(botsText.replaceAll("{count}", BotsSize.toString()));
    }
  } catch {}
}
