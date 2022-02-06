import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class TestCommand extends BaseCommand {
  constructor() {
    super({
      name: "prefix",
      category: "Moderators",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildId = message.guildId!;
    if (!args[0]) return message.reply("Enter a prefix, dumbass!!");
    const prefix = args[0];
    await client.configurations.prefixes.update(guildId, prefix);
    message.reply(`The prefix has been set to ${prefix}`);
  }
}
