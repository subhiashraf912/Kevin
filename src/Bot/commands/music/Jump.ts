import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class JumpCommand extends BaseCommand {
  constructor() {
    super({
      name: "jump",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
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
    if (!args[0]) {
      message.reply({
        content: "You need to send the number of the songs you want to jump!",
      });
      return;
    }
    const songsNumber = parseInt(args[0], 10);
    if (isNaN(songsNumber)) {
      message.reply({
        content: `${args[0]} is not a number!`,
      });
      return;
    }

    if (player.queue.size < songsNumber) {
      message.reply({
        content: "The songs amount must be less than the queue length!",
      });
      return;
    }
    player.queue.remove(0, songsNumber - 1);
    await player.stop();
    await message.reply(`I jumped ${songsNumber} songs ahead`);
  }
}
