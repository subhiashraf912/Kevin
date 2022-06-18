import BaseEvent from "../../classes/Base/BaseEvent";
import { Role } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import guildRolesCountUpdateService from "../../services/GuildRolesCountUpdateService";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("roleCreate");
  }

  async run(client: DiscordClient, role: Role) {
    await guildRolesCountUpdateService(client, role);
  }
}
