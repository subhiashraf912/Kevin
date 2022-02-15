import { GuildChannel, Message, MessageEmbed, TextChannel } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class AddTextLevelChannel extends BaseCommand {
  constructor() {
    super({
      name: "text-level-channels",
      category: "Text Levels",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const { channels: textLevelsChannels } =
      await client.configurations.textLevels.channels.get(message.guildId!);

    if (!textLevelsChannels[0])
      return message.reply("No level channels were found!");

    const channels: GuildChannel[] = [];
    textLevelsChannels.forEach((c) => {
      const cnl = message.guild?.channels.cache.find((ch) => ch.id === c);
      if (cnl && cnl instanceof GuildChannel) channels.push(cnl);
    });

    const embeds = this.generateRolesEmbed(channels);
    client.utils.pagination({
      author: message.author,
      channel: message.channel as TextChannel,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
  generateRolesEmbed(channels: GuildChannel[]) {
    const embeds = [];
    let k = 10;
    for (let i = 0; i < channels.length; i += 10) {
      const r = channels.slice(i, k);
      let j = i;
      k += 10;
      let info = "";
      r.forEach((channel) => {
        info = `${info}\n> **${++j}-**${channel} \`id: ${channel.id}\`\n`;
      });

      const embed = new MessageEmbed().setDescription(
        `\`\`\`💢 Text Level Channels: ${channels.length}💢\`\`\`\`\`\`⚡The channels that level system can work in!\nOther channels won't give xp!⚡\`\`\`${info}`
      );
      embeds.push(embed);
    }
    return embeds;
  }
}
