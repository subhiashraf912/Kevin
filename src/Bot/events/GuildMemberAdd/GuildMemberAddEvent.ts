import BaseEvent from "../../classes/Base/BaseEvent";
import { GuildMember, Invite } from "discord.js";
import DiscordClient from "../../classes/Client/Client";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("guildMemberAddWithInvite");
  }

  async run(client: DiscordClient, member: GuildMember, invite: Invite) {
    try {
      const memberType = member.user.bot ? "bot" : "member";
      let configurations = await client.configurations.joinRoles[memberType].get(member.guild.id);
      if (configurations) {
        const { roles } = configurations;
        if (roles[0]) await member.roles.add(roles);
      }
    } catch (err) {
      console.log(err);
    }
    try {
      let configurations = client.configurations.welcomes.get(member.guild.id);
      if (!configurations) {
        configurations = await client.configurations.welcomes.fetch(member.guild.id);
        if (!configurations) return;
      }
      const channel = configurations.channel;
      const message = configurations.message;
      const attachment1 = new client.utils.WelcomeCardGenerator(member);
      const attachment = await attachment1.getAttachment();

      channel.send({
        files: [attachment],
        content: message
          .replace("{server-name}", member.guild.name)
          .replace("{member-ping}", `<@${member.id}>`)
          .replace("{member-username}", member.user.username)
          .replace("{member-tag}", member.user.tag)
          .replace("{member-count}", member.guild.memberCount.toString())
          .replace("{invited-by-ping}", invite.inviter?.toString()!)
          .replace("{invited-by-username}", invite.inviter?.username!)
          .replace("{invited-by-tag}", invite.inviter?.tag!)
          .replace("{invite-code}", invite.code)
          .replace("{invite-uses}", invite.uses?.toString()!),
      });
    } catch (err) {
      console.log(err);
    }
  }
}
