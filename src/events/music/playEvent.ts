import BaseEvent from "../../classes/Base/BaseEvent";
import DiscordClient from "../../classes/Client/Client";
import { Queue, Song } from "distube";

export default class MessageEvent extends BaseEvent {
  constructor() {
    super("playSong");
  }

  async run(client: DiscordClient, queue: Queue, song: Song) {
    queue.textChannel?.send(
      `>  **Now playing: 🎵 ${song.name}** \`${song.formattedDuration}\``
    );
  }
}
