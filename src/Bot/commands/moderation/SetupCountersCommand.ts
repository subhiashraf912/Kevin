import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class TestCommand extends BaseCommand {
  constructor() {
    super({
      name: "setup-counters",
      category: "Moderators",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    try {
      const parent = await message.guild?.channels.create("Counters", {
        type: "GUILD_CATEGORY",
        permissionOverwrites: [
          {
            id: message.guild.roles.everyone.id,
            deny: ["CONNECT"],
          },
        ],
      });
      const botsCount = message.guild?.members.cache.filter(
        (member) => member.user.bot
      ).size;
      const channelsCount = message.guild?.channels.cache.size;
      const membersCount = message.guild?.memberCount;
      const rolesCount = message.guild?.roles.cache.size;

      const botsCounterChannel = await message.guild?.channels.create(
        `Bots Count: ${botsCount}`,
        { parent }
      );
      const channelsCounterChannel = await message.guild?.channels.create(
        `Channels Count: ${channelsCount}`,
        { parent }
      );
      const membersCountChannel = await message.guild?.channels.create(
        `Members Count: ${membersCount}`,
        { parent }
      );
      const rolesCountChannel = await message.guild?.channels.create(
        `Roles Count: ${rolesCount}`,
        { parent }
      );

      await client.configurations.guildCounters.create({
        botsCounter: {
          channelId: botsCounterChannel?.id!,
          text: "Bots Count: {count}",
        },
        membersCounter: {
          channelId: membersCountChannel?.id!,
          text: "Members Count: {count}",
        },
        channelsCounter: {
          channelId: channelsCounterChannel?.id!,
          text: "Channels Count: {count}",
        },
        rolesCounter: {
          channelId: rolesCountChannel?.id!,
          text: "Roles Count: {count}",
        },
        guildId: message.guildId!,
      });
    } catch (err) {
      await message.reply(`Error occured: ${err}`);
    }
  }
}
