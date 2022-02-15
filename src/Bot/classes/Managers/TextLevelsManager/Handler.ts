import { Message, Role } from "discord.js";
import DiscordClient from "../../Client/Client";

export default class TextLevelsHandler {
  client;
  constructor(client: DiscordClient) {
    this.client = client;
  }
  HandleTextMessage = async (message: Message) => {
    if (!message.guild) return;
    const guildId = message.guild.id;
    const userId = message.author.id;
    const guildLevelingSystemSettings =
      await this.client.configurations.enabledLevelingGuilds.get(
        message.guild.id
      );
    if (!guildLevelingSystemSettings.enabled) return;
    const { channels: levelsChannels } =
      await this.client.configurations.textLevels.channels.get(
        message.guild.id
      );
    if (levelsChannels[0]) {
      if (!levelsChannels.includes(message.channel.id)) return;
    }
    const rank = await this.client.configurations.textLevels.ranks.get({
      guildId,
      userId,
    });
    if (Date.now() - rank.lastMessage > 60000) {
      let level = rank.level;
      let xp = rank.xp;
      let xpToBeAdded;
      if (message.channel.id === "800314338534883348") {
        xpToBeAdded = this.getRandomInt(
          guildLevelingSystemSettings.minXpPerMessage * 2,
          guildLevelingSystemSettings.maxXpPerMessage * 2
        );
      } else {
        xpToBeAdded = this.getRandomInt(
          guildLevelingSystemSettings.minXpPerMessage,
          guildLevelingSystemSettings.maxXpPerMessage
        );
      }
      xp += xpToBeAdded;

      const xpToNextLevel = 5 * Math.pow(level, 2) + 50 * level + 100;
      if (xp >= xpToNextLevel) {
        level++;
        xp = xp - xpToNextLevel;
        const channel = message.channel;
        channel.send({
          content: `GG ${message.author.toString()}! You have reached level ${level.toString()}`,
        });
      }
      await this.client.configurations.textLevels.ranks.update({
        guildId,
        userId,
        xp,
        level,
        lastMessage: Date.now(),
        rankBackground: rank.rankBackground,
      });
    }
    const { roles: levelRoles } =
      await this.client.configurations.textLevels.roles.get(guildId);
    if (levelRoles) await this.assignRoles(message, levelRoles);
  };

  async assignRoles(message: Message, roles: any) {
    if (!message.guild || !message.member) return;
    const rolesToBeAdded: Role[] = [];
    const memberRank = await this.client.configurations.textLevels.ranks.get({
      guildId: message.guildId!,
      userId: message.author.id!,
    });
    for (const [key, value] of Object.entries(roles)) {
      if (parseInt(key) < memberRank.level) {
        const role = message.guild.roles.cache.get(value as string);
        if (role && !message.member.roles.cache.has(role.id))
          rolesToBeAdded.push(role);
      }
    }
    if (rolesToBeAdded[0])
      try {
        await message.member.roles.add(rolesToBeAdded);
        await message.member?.send({
          content: `Congrats! You have got ${rolesToBeAdded.map(
            (role) => `${role?.name} `
          )} role in ${message.guild?.name}!`,
        });
      } catch {}
  }

  getRandomInt(min: number, max: number) {
    const randomfloat: any = (Math.random() * (max - min) + min).toString();
    return parseInt(randomfloat.split("."), 10);
  }
}
