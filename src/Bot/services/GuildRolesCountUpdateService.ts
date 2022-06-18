import { Role } from "discord.js";
import DiscordClient from "../classes/Client/Client";

export default async function guildRolesCountUpdateService(
  client: DiscordClient,
  role: Role
) {
  try {
    let configurations = client.configurations.guildCounters.get(role.guild.id);
    if (!configurations) {
      configurations = await client.configurations.guildCounters.fetch(
        role.guild.id
      );
      if (!configurations) return;
    }

    const { channel, text } = configurations.rolesCounter;
    if (channel && text)
      channel.setName(
        text.replaceAll("{count}", role.guild.roles.cache.size.toString())
      );
  } catch {}
}
