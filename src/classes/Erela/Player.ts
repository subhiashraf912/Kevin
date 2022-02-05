import { Collection, Message, Snowflake } from "discord.js";
import { Player } from "erela.js";

export default class extends Player {
  twentyFourSeven = false;
  autoPlay = false;
  currentPlayingMessage: Message | null = null;

  async addRelatedSong() {
    const searchResults = await this.search(
      `https://www.youtube.com/watch?v=${this.queue.current?.identifier}&list=RD${this.queue.current?.identifier}`
    );
    const { tracks } = searchResults;
    const randomTrack = tracks[Math.floor(Math.random() * tracks.length)];
    await this.queue.add(randomTrack);
    return randomTrack;
  }
}
