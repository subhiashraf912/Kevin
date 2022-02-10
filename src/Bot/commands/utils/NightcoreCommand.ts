import { Message, MessageAttachment } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import ytdl from "discord-ytdl-core";
import fs from "fs";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
export default class NightcoreCommand extends BaseCommand {
  constructor() {
    super({
      name: "nightcore",
      category: "Utils",
      permissions: new PermissionsGuard({
        botPermissions: [],
        userPermissions: [],
      }),
    });
  }
  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args || !args[0]) {
      message.reply({
        content: "You need to add a url or something to search",
      });
      return;
    }
    const fileName = `${Date.now()}-${message.author.id}`;
    const msg = await message.reply("Searching for data..");
    const search = await client.erela.search(args.join());
    if (search.loadType === "NO_MATCHES" || search.loadType === "LOAD_FAILED")
      return message.reply("No matches were found.");
    await msg.edit("Validating the song data...");
    if (!ytdl.validateURL(search.tracks[0].uri)) {
      message.channel.send({
        content: "The url should be a youtube link",
      });
      return;
    }
    await msg.edit("Editing the audio and converting to mp3...");
    const encoderArgstoset = ["-af", "asetrate=48000*1.15,aresample=48000"];
    const stream = ytdl(search.tracks[0].uri, {
      quality: "highestaudio",
      filter: "audioonly",
      fmt: "mp3",
      encoderArgs: encoderArgstoset,
    });
    stream.pipe(fs.createWriteStream(fileName)).on("finish", async () => {
      await msg.edit("Uploading final mp3 file...");
      const attachment = new MessageAttachment(
        `./${fileName}`,
        `${search.tracks[0].title}.mp3`
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
