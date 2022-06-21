import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class TestCommand extends BaseCommand {
  constructor() {
    super({
      name: "delete-counters",
      category: "Moderators",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    try {
      let configurations = client.configurations.guildCounters.get(
        message.guild?.id!
      );
      if (!configurations) {
        configurations = await client.configurations.guildCounters.fetch(
          message.guild?.id!
        );
        if (!configurations)
          return message.reply({
            content: "There are no guild counters set for this server!",
          });
      }
      try {
        await configurations.botsCounter.channel?.delete(
          `Guild Counters removed by: ${message.author.tag}`
        );
      } catch {}

      try {
        await configurations.channelsCounter.channel?.delete(
          `Guild Counters removed by: ${message.author.tag}`
        );
      } catch {}

      try {
        await configurations.membersCounter.channel?.delete(
          `Guild Counters removed by: ${message.author.tag}`
        );
      } catch {}

      try {
        await configurations.rolesCounter.channel?.delete(
          `Guild Counters removed by: ${message.author.tag}`
        );
      } catch {}

      await client.configurations.guildCounters.delete(message.guildId!);
      await message.reply({ content: "Guild counters got removed!" });
    } catch (err) {
      await message.reply(`Error occured: ${err}`);
    }
  }
}
