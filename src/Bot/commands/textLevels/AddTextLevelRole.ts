import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
export default class AddTextLevelRole extends BaseCommand {
  constructor() {
    super({
      name: "add-text-level-role",
      category: "Text Levels",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0])
      return message.reply(
        "You need to enter the time you want the role to be given at in your message."
      );
    const level = parseInt(args[0]);
    if (typeof level !== "number")
      return message.reply(
        "The text level (first argument) should be like this 5, 10, 15 etc."
      );
    const role =
      message.guild?.roles.cache.get(args[1]) || message.mentions.roles.first();
    if (!role)
      return message.reply("You need to enter a role in your message.");
    if (!role.editable)
      return message.reply(
        "I can't edit this role, check my permissions and try again."
      );
    const { roles } = await client.configurations.textLevels.roles.get(
      message.guildId!
    );
    roles[level] = role.id;
    await client.configurations.textLevels.roles.update({
      roles,
      guildId: message.guildId!,
    });
    await message.reply({
      content: "Added `{role}` as a level role for the level `{level}`"
        .replace("{role}", role.name)
        .replace("{level}", level.toString()),
    });
  }
}
