import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class RepeatCommand extends BaseCommand {
  constructor() {
    super({
      name: "repeat",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
      }),
      aliases: ["loop"],
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
