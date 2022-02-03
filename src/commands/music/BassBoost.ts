import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
const levels: any = {
  none: 0.0,
  low: 0.1,
  medium: 0.15,
  high: 0.25,
};

export default class BassBoostCommand extends BaseCommand {
  constructor() {
    super({
      name: "bassboost",
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

    let level = "none";
    if (args.length && args[0].toLowerCase() in levels)
      level = args[0].toLowerCase();

    const bands = new Array(3)
      .fill(null)
      .map((_, i) => ({ band: i, gain: levels[level] }));

    player.setEQ(...bands);

    return message.reply(`set the bassboost level to ${level}`);
  }
}
