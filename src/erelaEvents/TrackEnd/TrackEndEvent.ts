import { Track, TrackEndEvent } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";

export default class ReadyEvent extends BaseNonTypedEvent {
  constructor() {
    super("queueEnd");
  }
  async run(
    client: DiscordClient,
    player: Player,
    track: Track,
    payload: TrackEndEvent
  ) {
    if (player.queue.size === 0 && player.autoPlay) {
      const searchResults = await player.search(
        `https://www.youtube.com/watch?v=${track.identifier}&list=RD${track.identifier}`,
        client.user
      );
      const { tracks } = searchResults;
      const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
      await player.queue.add(randomTrack);
      await player.play();
    }
  }
}
