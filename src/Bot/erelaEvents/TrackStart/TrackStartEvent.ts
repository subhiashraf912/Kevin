import { TextChannel } from "discord.js";
import { Track } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";

export default class ReadyEvent extends BaseNonTypedEvent {
  constructor() {
    super("trackStart");
  }
  async run(client: DiscordClient, player: Player, track: Track) {
    const message = await (
      client.channels.cache.get(player.textChannel || "") as TextChannel
    ).send(`Now playing: ${track.title}`);
    player.currentPlayingMessage = message;
  }
}
