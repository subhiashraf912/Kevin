import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class SpeedCommand extends BaseCommand {
  constructor() {
    super({
      name: "speed",
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
    try {
      const speed = parseFloat(args[0]);
      if (!speed)
        return message.reply("You need to enter the speed of the music.");

      player.node.send({
        op: "filters",
        guildId: message.guild?.id,
        timescale: {
          speed,
        },
      });
      await message.reply(
        `Speed of the song has been set to ${speed.toString()}`
      );
    } catch {
      message.reply("Error has happened while setting the speed of the song");
    }
  }
}
