import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "add-yt-logger",
      category: "Youtube Logger",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const youtubeChannel = args[0];
    const channel = message.mentions.channels.first() || message.channel;
    const user = message.mentions.users.first() || message.author;
    if (!youtubeChannel)
      return message.reply({
        content: "You should send the youtube channel with your message.",
      });
    const data = await client.YoutubePoster.setChannel(
      youtubeChannel,
      channel,
      user
    );
    message.reply({
      content: `Successfully added the new Youtube-Poster channel\nPosts in <#${data.DiscordChannel}> for <@${data.DiscordUser}> (${data.YTchannel})`,
    });
  }
}
