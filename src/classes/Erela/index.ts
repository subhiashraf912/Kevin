import { Manager } from "erela.js";
import Deezer from "erela.js-deezer";
import Facebook from "erela.js-facebook";
import filter from "erela.js-filters";
import AppleMusic from "erela.js-apple";
import Spotify from "erela.js-spotify";
import DiscordClient from "../Client/Client";
import "../../utils/Extends/Erela";
export default (client: DiscordClient) => {
  const erela = new Manager({
    plugins: [
      new Deezer({}),
      new Facebook(),
      new filter(),
      //@ts-ignore
      new AppleMusic(),
      new Spotify({
        clientID: process.env.SPOTIFY_ID!,
        clientSecret: process.env.SPOTIFY_SECRET!,
      }),
    ],
    nodes: [
      {
        host: "localhost",
        port: 2333,
        password: "youshallnotpass",
      },
    ],
    send(id, payload) {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    },
  });
  return erela;
};
