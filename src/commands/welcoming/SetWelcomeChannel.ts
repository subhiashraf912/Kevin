import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import UpdateWelcomesConfigurationOptions from "../../utils/types/Data/UpdateWelcomesConfigurationOptions";

export default class SetWelcomeChannelCommand extends BaseCommand {
  constructor() {
    super({
      name: "set-welcome-channel",
      category: "Welcoming",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildId = message.guildId!;
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Mention a channel in your message.");
    const options: UpdateWelcomesConfigurationOptions = {
      channelId: channel.id,
    };
    const updatedConfiguration = await client.configurations.welcomes.update(
      guildId,
      options
    );
    message.reply(
      `> The welcome channel has been set to ${updatedConfiguration.channel}`
    );
  }
}
