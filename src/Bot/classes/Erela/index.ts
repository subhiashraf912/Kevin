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
        clientID: "e3dd02fbac0f468cb73955409d3070a2"!,
        clientSecret: "bf5d60aa0bcb419c8ff46f10a43d7bf6"!,
      }),
    ],
    nodes: [
      {
        host: "localhost",
        port: 8080,
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
