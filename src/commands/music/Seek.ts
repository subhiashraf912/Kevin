import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class SeekCommand extends BaseCommand {
  constructor() {
    super({
      name: "seek",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const player = client.erela.get(message.guildId!) as Player;
    if (!player)
      return message.reply(
        "There's nothing playing in the client at the moment"
      );
    if (!args[0]) return message.reply("Enter the seek position");
    const position = Number(args[0]) * 1000;
    await player.seek(position);
    await message.react("✅");
  }
}
