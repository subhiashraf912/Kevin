import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegPath);
const { upload, downloadPipe } = require("wetransfert");
export const download = async (attachment: string, name: string) => {
  let files = await downloadPipe(attachment, null);
  files.pipe(fs.createWriteStream(name));
  return files;
};
export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "rsmb",
      category: "Utils",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["ATTACH_FILES"],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.guild || !message.member) return;
    if (client.rendering === true) {
      message.reply(
        "I can't render now because there's someone else rendering. Please come back later when the queue is free..."
      );
      return;
    }
    client.setRendering();
    const url = args[0];
    const rsmbAmountString = args[1] || "2";
    if (!url) {
      message.reply(
        "You need to send the edit link uploaded on `https://wetransfer.com/`."
      );
      client.setNotRendering();

      return;
    }

    const rsmbAmount = parseInt(rsmbAmountString);
    if (rsmbAmount > 10 || !(rsmbAmount > 1)) {
      message.reply("You can only choose the value from above 1 to 10, ");
      client.setNotRendering();

      return;
    }
    if (!url.includes("http")) {
      client.setNotRendering();
      message.reply("You need to pass url");
      return;
    }
    if (!url.includes("wetransfer") && !url.includes("we.tl")) {
      message.reply("You can only use wetransfer links");
      client.setNotRendering();
      return;
    }

    const downloadedFileName = `${message.author.username}${Date.now()}.mp4`;

    const downloading = await download(url, downloadedFileName);
    const msg = await message.reply("Downloading your video, please wait...");
    downloading.on("close", async () => {
      await msg.edit(
        "Done downloading the video, Adding rsmb to your video..."
      );
      const command = ffmpeg(downloadedFileName);
      const weights = "0.5";
      command.videoFilter(
        `tmix=frames=${rsmbAmountString}:weights="${weights} ${weights} ${weights} ${weights} ${weights} ${weights} ${weights} ${weights}"`
      );
      command.output("output.mp4");
      command.size("100%");
      command.videoCodec("libx264");
      command.videoBitrate(4000);
      let lastMessageEdit = Date.now();
      command.on("progress", async (progress) => {
        if (Date.now() - lastMessageEdit > 3000) {
          await msg.edit(
            `In progress...\n> rendered frames:${progress.frames.toString()}\n> Current time: ${
              progress.timemark
            }`
          );
          lastMessageEdit = Date.now();
        }
      });
      command.on("end", async () => {
        await msg.edit(
          "Added rsmb to your video, uploading your video now...."
        );
        upload("", "", "output.mp4", "Your edit", "en")
          .on("end", async (end: any) => {
            const stats = fs.statSync("output.mp4");
            const fileSizeInBytes = stats.size;
            const fileSizeInMegabytes = fileSizeInBytes / (1024 * 1024);
            try {
              if (fileSizeInMegabytes < 99) {
                await msg.edit({
                  content: `Here's your edit:\n${end.shortened_url}`,
                  files: ["output.mp4"],
                });
              } else {
                await msg.edit({
                  content: `Here's your edit:\n${end.shortened_url}`,
                });
              }
            } catch {
              await msg.edit({
                content: `Here's your edit:\n${end.shortened_url}`,
              });
            }

            try {
              client.setNotRendering();
              fs.unlinkSync(downloadedFileName);
              fs.unlinkSync("output.mp4");
            } catch {
              client.setNotRendering();
            }
          })
          .on("error", (error: any) => {
            client.setNotRendering();

            msg.edit(`Error happened while uploading: ${error.message}`);
          });
      });
      command.on("error", (err) => {
        client.setNotRendering();

        msg.edit(
          `Error happened while adding rsmb to your video: ${err.message}`
        );
      });
      command.run();
    });
  }
}
