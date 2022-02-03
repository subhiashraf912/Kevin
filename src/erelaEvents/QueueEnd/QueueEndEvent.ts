import { TextChannel } from "discord.js";
import { Player } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";

export default class ReadyEvent extends BaseNonTypedEvent {
  constructor() {
    super("queueEnd");
  }
  async run(client: DiscordClient, player: Player) {
    (client.channels.cache.get(player.textChannel || "") as TextChannel).send(
      "Queue has ended."
    );
    player.destroy();
  }
}
