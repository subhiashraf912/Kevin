import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";

export default class ReadyEvent extends BaseNonTypedEvent {
  constructor() {
    super("queueEnd");
  }
  async run(client: DiscordClient, player: Player) {
    if (player.autoPlay) {
      // await player.addRelatedSong();
    } else {
      player.destroy();
    }
  }
}
