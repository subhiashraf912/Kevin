import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import ms from "ms";
export default class RemoveVoiceLevelRole extends BaseCommand {
  constructor() {
    super({
      name: "remove-voice-level-role",
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
        "You need to pass in the level that you want to delete."
      );
    const level = ms(args[0]);
    if (typeof level !== "number")
      return message.reply(
        "The voice level should be like this 5m, 1d, 2d etc."
      );

    const { roles } = await client.configurations.voiceLevels.roles.get(
      message.guildId!
    );
    if (!roles[level])
      return message.reply("This level doesn't exist in the voice roles.");
    delete roles[level];
    await client.configurations.voiceLevels.roles.update({
      roles,
      guildId: message.guildId!,
    });
    await message.reply({
      content: "Level `{level}` has been deleted from the level roles!".replace(
        "{level}",
        this.millisToMinutesAndSeconds(level)
      ),
    });
  }
  millisToMinutesAndSeconds = (timeInMiliseconds: number) => {
    let h;
    h = Math.floor(timeInMiliseconds / 1000 / 60 / 60);

    return `${h} Hours`;
  };
}
