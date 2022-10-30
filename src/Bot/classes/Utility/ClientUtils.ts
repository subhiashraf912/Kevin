import { GuildMember, MessageAttachment, PermissionString } from "discord.js";
import DiscordClient from "../Client/Client";
import pagination from "./Pagination";
import WelcomeCardGenerator from "./WelcomeCardGenerator";
import KevinCord from "./AzeCord";
class ClientUtils {
  client;
  pagination = pagination;
  kevincord = KevinCord;
  constructor(client: DiscordClient) {
    this.client = client;
  }
  WelcomeCardGenerator = WelcomeCardGenerator;
  formatString(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  formatPermission(perm: PermissionString) {
    const str = perm.replaceAll("_", " ").toLowerCase();
    return this.formatString(str);
  }
  formatDuration(duration: number) {
    if (isNaN(duration) || typeof duration === "undefined") return "00:00";
    if (duration > 3600000000) return "Live";
    return this.convertTime(duration);
  }
  convertTime(duration: number) {
    let milliseconds = (duration % 1000) / 100,
      seconds: number | string = (duration / 1000) % 60,
      minutes: number | string = (duration / (1000 * 60)) % 60,
      hours: number | string = (duration / (1000 * 60 * 60)) % 24;

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    if (duration < 3600000) {
      return minutes + ":" + seconds;
    } else {
      return hours + ":" + minutes + ":" + seconds;
    }
  }
  millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
    let h, m, s;
    h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
    m = Math.floor((timeInMiliseconds / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(((timeInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60);
    return `${h} Hours - ${m} Minutes - ${s} Secs`;
  };

  async generateRankCard(member: GuildMember) {
    let memberAvatar: string = member.user.displayAvatarURL({
      format: "png",
      size: 4096,
    });
    let memberUserName: string = member.user.username;
    let Discriminator: string = member.user.discriminator;

    const data = await this.client.configurations.textLevels.ranks.get({
      userId: member.id,
      guildId: member.guild.id,
    });
    let rankBackground = null;
    let color, color2, color3;
    switch (member.presence?.status) {
      case "offline":
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
      case "online":
        color = "#55ff34";
        color2 = "#199900";
        color3 = "#87ff70";
      case "dnd":
        color = "#ff4642";
        color2 = "#f50500";
        color3 = "#ffb4b3";
      case "idle":
        color = "#fff528";
        color2 = "#b8af00";
        color3 = "#423f00";
      case "invisible":
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
      default:
        color = "#f2f1ef";
        color2 = "#abb7b7";
        color3 = "#dadfe1";
    }

    const rank = new this.kevincord.Rank()
      .setAvatar(memberAvatar)
      .setCurrentXP(data.xp)
      .setRequiredXP(5 * Math.pow(data.level, 2) + 50 * data.level + 100)
      .setStatus(member.presence?.status)
      .setProgressBar("#FFFFFF", "COLOR")
      .setUsername(memberUserName)
      .setDiscriminator(Discriminator)
      .setLevel(data.level)
      .setCustomStatusColor(color)
      .setProgressBar(
        [color as string, color2 as string, color3 as string],
        "GRADIENT"
      )
      .setLevelColor(undefined, color);

    // if (rankBackground.rankBackground) {
    //   rank.setBackground("IMAGE", rankBackground.rankBackground);
    // }

    const attachmentBuffer = await rank.build();
    const attachment = new MessageAttachment(attachmentBuffer, "RankCard.png");
    return attachment;
  }
}

export default ClientUtils;
