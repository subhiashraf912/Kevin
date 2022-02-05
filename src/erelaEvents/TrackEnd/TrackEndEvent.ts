import { Track, TrackEndEvent } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";

export default class TrackEnd extends BaseNonTypedEvent {
  constructor() {
    super("trackEnd");
  }
  async run(
    client: DiscordClient,
    player: Player,
    track: Track,
    payload: TrackEndEvent
  ) {
    player.currentPlayingMessage?.delete();
    player.currentPlayingMessage = null;
  }
}
