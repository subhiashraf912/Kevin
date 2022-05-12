import { Message } from "discord.js";
import { createTranscript } from "discord-html-transcripts";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import { ValidTextChannels } from "discord-html-transcripts/dist/types";
import nodeHtmlToImage from "node-html-to-image";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "screenshot-chat",
      category: "Utils",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["ATTACH_FILES"],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const channel = message.channel as ValidTextChannels;
    const attachment = (await createTranscript(channel, {
      returnType: "string",
      minify: true,
    })) as string;
    const img = (await nodeHtmlToImage({
      html: attachment,
      quality: 10,
      type: "png",
    })) as Buffer;
    channel.send({
      files: [img],
    });
  }
}
