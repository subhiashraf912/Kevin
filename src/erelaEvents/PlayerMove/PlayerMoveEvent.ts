import { Player } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";

export default class PlayerMoveEvent extends BaseNonTypedEvent {
  constructor() {
    super("playerMove");
  }
  async run(
    client: DiscordClient,
    player: Player,
    oldChannel: string,
    newChannel: string | null
  ) {
    if (newChannel) {
      await player.setVoiceChannel(newChannel);
      await player.pause(false);
    } else player.destroy();
  }
}
