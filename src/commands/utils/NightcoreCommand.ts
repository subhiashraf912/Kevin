import { Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import DisTube from "distube";
import ytdl from "discord-ytdl-core";
import fs from "fs";
export default class NightcoreCommand extends BaseCommand {
  constructor() {
    super({
      name: "nightcore",
      category: "Utils",
    });
  }
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const distube = new DisTube(client);
    if (!args || !args[0]) {
      message.reply({
        content: "You need to add a url or something to search",
      });
      return;
    }
    const fileName = `${Date.now()}-${message.author.id}`;
    await message.reply("Searching for data..");
    const song = await searchSong(args.join(" "), distube);
    if (!song) {
      message.channel.send("Song not found");
      return;
    }
    if (!ytdl.validateURL(song.url)) {
      message.channel.send({
        content: "The url should be a youtube link",
      });
      return;
    }
    const encoderArgstoset = ["-af", "asetrate=48000*1.15,aresample=48000"];
    const stream = ytdl(song?.url, {
      quality: "highestaudio",
      filter: "audioonly",
      fmt: "mp3",
      encoderArgs: encoderArgstoset,
    });
    stream.pipe(fs.createWriteStream(fileName)).on("finish", async () => {
      const attachment = new MessageAttachment(
        `./${fileName}`,
        `${song.name}.mp3`
      );
      await message.channel
        .send({
          content: "Here's your song",
          files: [attachment],
        })
        .catch((err) => message.channel.send(err.message));
      try {
        fs.unlinkSync(`./${fileName}`);
      } catch (err: any) {
        message.channel.send(err.message);
      }
    });
  }
}

const searchSong = async (query: string, distube: DisTube) => {
  const limit = 1;
  const results = await distube
    .search(query, {
      limit,
      safeSearch: true,
    })
    .catch(() => undefined);
  if (!results?.length) {
    return null;
  }
  let result = results[0];
  return result;
};
