import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class PreviousCommand extends BaseCommand {
  constructor() {
    super({
      name: "previous",
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
    const { previous } = player.queue;
    if (previous) {
      await player.queue.add(previous);
      await player.stop();
      if (!player.playing) await player.play();
      message.reply(`🎵 Enqueuing \`${previous.title}.\``);
    } else {
      await message.reply("There's no previous songs to back to.");
    }
  }
}
