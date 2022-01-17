import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import PrefixesConfiguration from "../../utils/types/Data/PrefixesConfiguration";

export default class TestCommand extends BaseCommand {
  constructor() {
    super({
      name: "prefix",
      category: "Moderators",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildId = message.guildId!;
    if (!args[0]) return message.reply("Enter a prefix, dumbass!!");
    const prefix = args[0];
    const config = (await client.database.models.prefixes.findOneAndUpdate({
      guildId,
      prefix,
    })) as PrefixesConfiguration;
    client.configurations.prefixes.set(guildId, config.prefix);
    message.reply("Change prefix thing");
  }
}
