import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class JoinCommand extends BaseCommand {
  constructor() {
    super({
      name: "join",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    let player = client.erela.get(message.guild?.id!);

    if (player) return message.reply("I'm in a voice channel already.");
    const voiceChannel = message.member?.voice.channelId;
    const textChannel = message.channelId;
    if (!voiceChannel)
      return message.reply(
        "You need to be in a voice channel to use this command."
      );
    player = client.erela.create({
      guild: message.guild?.id!,
      voiceChannel,
      textChannel,
      selfDeafen: true,
    });

    player.connect();
  }
}
