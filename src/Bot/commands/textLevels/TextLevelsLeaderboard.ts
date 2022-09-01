import {
  Guild,
  GuildTextBasedChannel,
  Message,
  MessageAttachment,
  MessageEmbed,
  TextChannel,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import TextLevelsRanksConfiguration from "../../utils/types/Data/TextLevelsRanksConfiguration";
export default class AddTextLevelRole extends BaseCommand {
  constructor() {
    super({
      name: "text-levels-leaderboard",
      category: "Text Levels",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guildId) return;
    const data = await client.configurations.textLevels.ranks.fetch({
      guildId: message.guildId!,
    });

    function compare(
      a: TextLevelsRanksConfiguration,
      b: TextLevelsRanksConfiguration
    ) {
      let comparison = 0;
      if (a.xp > b.xp) comparison = -1;
      if (a.xp < b.xp) comparison = 1;
      if (a.level > b.level) comparison = -1;
      if (a.level < b.level) comparison = +1;
      return comparison;
    }
    const sortedLeaderboard = (data as TextLevelsRanksConfiguration[]).sort(
      compare
    );
    const embeds = await GenerateLeaderboardsEmbed(sortedLeaderboard, message);
    client.utils.pagination({
      author: message.author,
      channel: message.channel as GuildTextBasedChannel,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

async function GenerateLeaderboardsEmbed(
  leaderboards: TextLevelsRanksConfiguration[],
  message: Message
) {
  const guild = message.guild as Guild;
  const embeds = [];
  let k = 5;
  let x = 0;
  const members = await guild.members.fetch();
  let bannerUrl: string | null = null;
  if (guild.banner) {
    const msg = await (
      message.client.channels.cache.get("949262513382494258") as TextChannel
    ).send({
      files: [new MessageAttachment(guild.bannerURL({ size: 4096 })!)],
    });
    bannerUrl = msg.attachments.first()?.url!;
  }

  for (let i = 0; i < leaderboards.length; i += 5) {
    const current = leaderboards.slice(i, k);
    let j = i;
    k += 5;
    const icon: string = guild.iconURL({ dynamic: true, size: 4096 }) || "";

    const embed = new MessageEmbed()
      .setTitle(`${guild.name} Leaderboard list!`)
      .setThumbnail(icon);
    for (const element of current) {
      let member = members.get(element.userId);
      console.log(member?.user.tag);
      if (member) {
        embed.addField(
          `${x + 1}) ${member.user.username}`,
          `XP: ${element.xp.toString()} | Level: ${element.level}`
        );
      } else {
        embed.addField(
          `${x + 1}) ${"Member Left"}`,
          `XP: ${element.xp.toString()} | Level: ${element.level}`
        );
      }
      x = x + 1;
    }
    if (bannerUrl) embed.setImage(bannerUrl);
    embeds.push(embed);
  }
  return embeds;
}
