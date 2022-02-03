import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class VolumeCommand extends BaseCommand {
  constructor() {
    super({
      name: "volume",
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
    if (!args.length)
      return message.reply(`The player volume is \`${player.volume}\`.`);

    const channel = message.member?.voice.channel;

    if (!channel) return message.reply("You need to join a voice channel.");
    if (channel.id !== player.voiceChannel)
      return message.reply("You're not in the same voice channel.");

    const volume = Number(args[0]);

    if (!volume || volume < 1 || volume > 100)
      return message.reply("You need to give me a volume between 1 and 100.");

    player.setVolume(volume);
    return message.reply(`Set the player volume to \`${volume}\`.`);
  }
}
