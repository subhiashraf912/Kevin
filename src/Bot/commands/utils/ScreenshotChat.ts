import { Message } from "discord.js";
import discordTranscripts from "discord-html-transcripts";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import { ValidTextChannels } from "discord-html-transcripts/dist/types";

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
    const attachment = await discordTranscripts.createTranscript(channel);
    channel.send({
      files: [attachment],
    });
  }
}
