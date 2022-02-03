import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class RepeatCommand extends BaseCommand {
  constructor() {
    super({
      name: "repeat",
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

    if (args.length && /queue/i.test(args[0])) {
      player.setQueueRepeat(!player.queueRepeat);
      const queueRepeat = player.queueRepeat ? "enabled" : "disabled";
      return message.reply(`${queueRepeat} queue repeat.`);
    }

    player.setTrackRepeat(!player.trackRepeat);
    const trackRepeat = player.trackRepeat ? "enabled" : "disabled";
    return message.reply(`${trackRepeat} track repeat.`);
  }
}
