import { TextChannel } from "discord.js";
import { Player, Track } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";

export default class ReadyEvent extends BaseNonTypedEvent {
  constructor() {
    super("trackStart");
  }
  async run(client: DiscordClient, player: Player, track: Track) {
    (client.channels.cache.get(player.textChannel || "") as TextChannel).send(
      `Now playing: ${track.title}`
    );
  }
}
