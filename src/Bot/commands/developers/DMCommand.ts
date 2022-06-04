import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class EvalCommand extends BaseCommand {
  constructor() {
    super({
      name: "dm",
      category: "Developers",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    try {
      const devs = ["581425505568555019", "507684120739184640"];
      if (!devs.includes(message.author.id)) return;
      const memberId = args[0];
      if (!memberId) message.reply("Enter an ID");
      args.shift();
      const text = args.join(" ");
      const user = await client.users.fetch(memberId);
      await user.send(text);
    } catch (err) {
      message.channel.send(`Error: ${err}`);
    }
  }
}
