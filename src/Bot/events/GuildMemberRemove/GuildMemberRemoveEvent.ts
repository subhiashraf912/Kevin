import BaseEvent from "../../classes/Base/BaseEvent";
import { GuildMember } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import guildMembersCountUpdateService from "../../services/GuildMembersCountUpdateService";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("guildMemberRemove");
  }

  async run(client: DiscordClient, member: GuildMember) {
    await guildMembersCountUpdateService(client, member);
  }
}
