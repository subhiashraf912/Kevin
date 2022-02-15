import { BaseGuildTextChannel, Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class AddTextLevelChannel extends BaseCommand {
  constructor() {
    super({
      name: "add-text-level-channel",
      category: "Text Levels",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0])
      return message.reply("You need to mention a channel in your message.");
    const channel =
      message.guild?.channels.cache.get(args[0]) ||
      message.mentions.channels.first();
    if (!channel)
      return message.reply("You need to mention a channel in your message.");
    if (!(channel instanceof BaseGuildTextChannel))
      return message.reply("The channel must be a type of text channel.");
    const { channels } = await client.configurations.textLevels.channels.get(
      message.guildId!
    );
    if (channels.includes(channel.id))
      return message.reply(
        "This channel already exists in the text level channels list."
      );
    channels.push(channel.id);
    await client.configurations.textLevels.channels.update({
      channels,
      guildId: message.guildId!,
    });
    await message.reply({
      content: `${channel.toString()} has been added to the text level channels list.`,
    });
  }
}
