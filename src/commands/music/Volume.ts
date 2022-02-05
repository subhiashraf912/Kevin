import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class VolumeCommand extends BaseCommand {
  constructor() {
    super({
      name: "volume",
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
      return message.reply("There's nothing currently playing in the server.");
    if (!message.member?.voice.channel)
      return message.reply("You need to be in a voice channel.");
    if (
      message.member.voice.channel.id !== message.guild?.me?.voice.channel?.id
    )
      return message.reply(
        "You need to be in the same voice channel as the bot"
      );
    if (!args.length)
      return message.reply(`The player volume is \`${player.volume}\`.`);

    const volume = Number(args[0]);

    if (!volume || volume < 1 || volume > 100)
      return message.reply("You need to give me a volume between 1 and 100.");

    player.setVolume(volume);
    return message.reply(`Set the player volume to \`${volume}\`.`);
  }
}
