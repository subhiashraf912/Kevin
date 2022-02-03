import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class SkipCommand extends BaseCommand {
  constructor() {
    super({
      name: "skip",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const player = client.erela.get(message.guild?.id!);
    if (!player) return message.reply("There is no player for this guild.");

    const channel = message.member?.voice.channel;
    if (!channel) return message.reply("You need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.reply("You're not in the same voice channel.");

    if (!player.queue.current)
      return message.reply("There is no music playing.");

    const { title } = player.queue.current;

    player.stop();
    return message.reply(`${title} was skipped.`);
  }
}
