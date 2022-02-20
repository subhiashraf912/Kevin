import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import UpdateWelcomesConfigurationOptions from "../../utils/types/Data/UpdateWelcomesConfigurationOptions";

export default class SetWelcomeChannelCommand extends BaseCommand {
  constructor() {
    super({
      name: "set-welcome-message",
      category: "Welcoming",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildId = message.guildId!;
    if (!args[0])
      return message.reply("> Please type the welcome message you want.");
    const msg = args.join(" ");
    const options: UpdateWelcomesConfigurationOptions = {
      message: msg,
    };
    try {
      const updatedConfiguration = await client.configurations.welcomes.update(
        guildId,
        options
      );
      message.reply(
        `> The welcome message has been set to ${updatedConfiguration.message}`
      );
    } catch (err) {
      message.reply((err as Error).message);
    }
  }
}
