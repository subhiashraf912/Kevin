import BaseEvent from "../../classes/Base/BaseEvent";
import { GuildChannel } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import guildChannelsCountUpdateService from "../../services/GuildChannelsCountUpdateService";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("channelDelete");
  }

  async run(client: DiscordClient, channel: GuildChannel) {
    await guildChannelsCountUpdateService(client, channel);
  }
}
