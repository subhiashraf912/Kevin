import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
export default class RemoveTextLevelRole extends BaseCommand {
  constructor() {
    super({
      name: "remove-text-level-role",
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
        "You need to pass in the level that you want to delete."
      );
    const level = parseInt(args[0]);
    if (typeof level !== "number")
      return message.reply(
        "The text level (first argument) should be like this 5, 10, 15 etc."
      );

    const { roles } = await client.configurations.textLevels.roles.get(
      message.guildId!
    );
    if (!roles[level])
      return message.reply("This level doesn't exist in the text roles.");
    delete roles[level];
    await client.configurations.textLevels.roles.update({
      roles,
      guildId: message.guildId!,
    });
    await message.reply({
      content: "Level `{level}` has been deleted from the level roles!".replace(
        "{level}",
        level.toString()
      ),
    });
  }
}
