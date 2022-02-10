import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import ms from "ms";
export default class AddVoiceLevelRole extends BaseCommand {
  constructor() {
    super({
      name: "add-voice-level-role",
      category: "Voice Levels",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_GUILD"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0])
      return message.reply(
        "You need to enter the time you want the role to be given at in your message."
      );
    const level = ms(args[0]);
    if (typeof level !== "number")
      return message.reply(
        "The voice level time (first argument) should be like this 5m, 1d, 2d etc."
      );
    const role =
      message.guild?.roles.cache.get(args[1]) || message.mentions.roles.first();
    if (!role)
      return message.reply("You need to enter a role in your message.");
    if (!role.editable)
      return message.reply(
        "I can't edit this role, check my permissions and try again."
      );
    const { roles } = await client.configurations.voiceLevels.roles.get(
      message.guildId!
    );
    roles[level] = role.id;
    await client.configurations.voiceLevels.roles.update({
      roles,
      guildId: message.guildId!,
    });
    await message.reply({
      content: "Added `{role}` as a level role for the level `{level}`"
        .replace("{role}", role.name)
        .replace("{level}", this.millisToMinutesAndSeconds(level)),
    });
  }
  millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
    let h;
    h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);
    return `${h} Hours`;
  };
}
