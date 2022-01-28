import DiscordClient from "../classes/Client/Client";
import BaseWebSocketEvent from "../classes/Base/BaseWebsocketEvent";
import RestGuildPrefixUpdate from "../utils/types/API/RestGuildPrefixUpdate";

export default class GuildPrefixUpdateEvent extends BaseWebSocketEvent {
  constructor() {
    super("guildPrefixUpdate");
  }

  async run(client: DiscordClient, data: RestGuildPrefixUpdate) {
    await client.configurations.prefixes.update(data.guildId, data.prefix);
  }
}
