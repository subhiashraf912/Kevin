import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class PauseCommand extends BaseCommand {
  constructor() {
    super({
      name: "pause",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const player = client.erela.get(message.guild?.id!);
    if (!player) return message.reply("there is no player for this guild.");

    const channel = message.member?.voice.channel;

    if (!channel) return message.reply("you need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.reply("you're not in the same voice channel.");
    if (player.paused) {
      player.pause(false);
      message.reply("Player is no longer paused.");
    } else {
      player.pause(true);
      message.reply("Player is now paused.");
    }
  }
}
