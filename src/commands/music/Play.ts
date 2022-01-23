import { Message, GuildTextBasedChannel } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class PlayCommand extends BaseCommand {
  constructor() {
    super({
      name: "play",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) return message.reply("Enter a song, dumbass!!");
    const song = args.join(" ");
    const voiceChannel = message.member?.voice.channel;
    const member = message.member || undefined;
    if (!voiceChannel)
      return message.reply("You need to be in a voice channel.");
    const textChannel = message.channel as GuildTextBasedChannel;

    client.distube.play(voiceChannel, song, { textChannel, member, message });
  }
}
