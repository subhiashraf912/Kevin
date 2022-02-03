import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class TwennyFourSevenCommand extends BaseCommand {
  constructor() {
    super({
      name: "24/7",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const player = client.erela.get(message.guild?.id!) as Player;
    if (!player)
      return message.reply("No song/s currently playing within this guild.");
    const channel = message.member?.voice.channel;
    if (
      !channel ||
      message.member.voice.channel !== message.guild?.me?.voice.channel
    )
      return message.reply("You need to be in a same/voice channel.");

    if (player.twentyFourSeven) {
      player.twentyFourSeven = false;
      const off = new MessageEmbed()
        .setDescription("`🌙` | **Mode 24/7 has been:** `Disabled`")
        .setColor("#000001");

      message.reply({ content: " ", embeds: [off] });
      console.log(
        `[COMMAND] 24/7 used by ${message.author.tag} from ${message.guild.name}`
      );
    } else {
      player.twentyFourSeven = true;
      const on = new MessageEmbed()
        .setDescription("`🌕` | **Mode 24/7 has been:** `Enabled`")
        .setColor("#000001");

      message.reply({ content: " ", embeds: [on] });
      console.log(
        `[COMMAND] 24/7 used by ${message.author.tag} from ${message.guild.name}`
      );
    }
  }
}
