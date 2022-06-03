import { Message, TextChannel } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "button-message",
      category: "Button Roles",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const argmnts = args;
    const channel: TextChannel =
      (message.mentions.channels.first() as TextChannel) ||
      (message.channel as TextChannel);
    if (message.mentions.channels.first()) {
      argmnts.splice(
        args.indexOf(message.mentions.channels.first()?.toString()!),
        1
      );
    }

    const text = argmnts.join(" ");
    const sentMessage = await channel.send({ content: text });
    const channelId = channel.id;
    const guildId = message.guildId!;
    const messageId = sentMessage.id;
    await client.database.models.buttonRoles.create({
      channelId,
      guildId,
      messageId,
    });

    message.reply({ content: "Message Sent." });
  }
}
