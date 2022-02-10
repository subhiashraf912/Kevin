import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class AddVoiceLevelChannel extends BaseCommand {
  constructor() {
    super({
      name: "add-voice-level-channel",
      category: "Voice Levels",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0])
      return message.reply("You need to mention a channel in your message.");
    const channel =
      message.guild?.channels.cache.get(args[0]) ||
      message.mentions.channels.first();
    if (!channel)
      return message.reply("You need to mention a channel in your message.");
    if (channel.type !== "GUILD_VOICE")
      return message.reply("The channel must be a type of voice channel.");
    const { channels } = await client.configurations.voiceLevels.channels.get(
      message.guildId!
    );
    if (channels.includes(channel.id))
      return message.reply(
        "This channel already exists in the voice level channels list."
      );
    channels.push(channel.id);
    await client.configurations.voiceLevels.channels.update({
      channels,
      guildId: message.guildId!,
    });
    await message.reply({
      content: `${channel.toString()} has been added to the voice level channels list.`,
    });
  }
}
