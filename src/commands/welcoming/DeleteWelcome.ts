import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class DeleteWelcome extends BaseCommand {
  constructor() {
    super({
      name: "delete-welcome",
      category: "Welcoming",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildId = message.guildId!;
    try {
      await client.configurations.welcomes.delete(guildId);
      message.reply(`> Welcomes system has been deleted successfully.`);
    } catch {
      message.reply(`> There's no welcome system for this server.`);
    }
  }
}
