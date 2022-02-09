import { GuildMember, VoiceState } from "discord.js";
import BaseEvent from "../../classes/Base/BaseEvent";
import DiscordClient from "../../classes/Client/Client";

export default class VoiceRanksEvent extends BaseEvent {
  constructor() {
    super("voiceStateUpdate");
  }
  async run(client: DiscordClient, oldState: VoiceState, newState: VoiceState) {
    const member = oldState.member;
    if (!(member instanceof GuildMember)) return;
    if (member.user.bot) return;
    const guildId = member.guild.id;
    const userId = member.user.id;

    //deaf
    if (!oldState.deaf && newState.deaf) {
      const channel = member.voice.channel!;
      const config = await client.configurations.voiceLevels.channels.get(
        member.guild.id
      );
      const voiceLevelChannels = config.channels;
      if (voiceLevelChannels[0] && !voiceLevelChannels.includes(channel.id))
        return;

      let rank = await client.configurations.voiceLevels.ranks.get({
        guildId,
        userId,
      });
      if (!rank.joinTime) rank.joinTime = Date.now();
      rank.voiceTime = Date.now() - rank.joinTime + rank.voiceTime;
      const voiceLevelRoles = await client.configurations.voiceLevels.roles.get(
        guildId
      );
      for (const [key, value] of Object.entries(voiceLevelRoles.roles)) {
        if (parseInt(key) <= rank.voiceTime) {
          let role = member.guild.roles.cache.get(value);
          if (role && role.editable) await member.roles.add(role);
        }
      }
      rank.joinTime = null;
      await client.configurations.voiceLevels.ranks.update({
        guildId,
        joinTime: rank.joinTime,
        userId,
        voiceTime: rank.voiceTime,
      });
    }
    //mute
    if (!oldState.mute && newState.mute) {
      const channel = member.voice.channel!;
      const { channels } = await client.configurations.voiceLevels.channels.get(
        guildId
      );
      if (channels[0] && !channels.includes(channel.id)) return;
      let rank = await client.configurations.voiceLevels.ranks.get({
        guildId,
        userId,
      });

      if (!rank.joinTime) rank.joinTime = Date.now();
      rank.voiceTime = Date.now() - rank.joinTime + rank.voiceTime;
      const voiceLevelRoles = await client.configurations.voiceLevels.roles.get(
        guildId
      );
      for (const [key, value] of Object.entries(voiceLevelRoles)) {
        if (parseInt(key) <= rank.voiceTime) {
          const role = member.guild.roles.cache.get(value);
          if (role && role.editable) await member.roles.add(role);
        }
      }

      rank.joinTime = null;
      await client.configurations.voiceLevels.ranks.update({
        guildId,
        userId,
        joinTime: rank.joinTime,
        voiceTime: rank.voiceTime,
      });
    }
    //unmute
    if (oldState.mute && !newState.mute) {
      const channel = member.voice.channel!;
      const { channels } = await client.configurations.voiceLevels.channels.get(
        guildId
      );
      if (channels[0] && !channels.includes(channel.id)) return;
      let rank = await client.configurations.voiceLevels.ranks.get({
        guildId,
        userId,
      });
      rank.joinTime = Date.now();
      await client.configurations.voiceLevels.ranks.update({
        guildId,
        joinTime: rank.joinTime,
        userId,
        voiceTime: rank.voiceTime,
      });
    }
  }
}
