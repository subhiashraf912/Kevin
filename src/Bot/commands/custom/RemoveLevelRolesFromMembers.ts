import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "remove-level-roles-from-members",
      category: "Test",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (message.guild?.id !== "783991881028993045")
      return message.reply({
        content: "This command is only for Sen Nightcore server!",
      });
    const { roles: textRoles } =
      await client.configurations.textLevels.roles.get(message.guildId!);
    for (const [key, value] of Object.entries(textRoles)) {
      const role = message.guild.roles.cache.get(value as string);
      if (!role) continue;
      for (const member of role.members.toJSON()) {
        await member.roles.remove(role);
        console.log(
          `Role: ${role.name} has been removed from ${member.user.tag}`
        );
      }
    }
    const { roles: voiceRoles } =
      await client.configurations.voiceLevels.roles.get(message.guildId!);
    for (const [key, value] of Object.entries(voiceRoles)) {
      const role = message.guild.roles.cache.get(value as string);
      if (!role) continue;
      for (const member of role.members.toJSON()) {
        await member.roles.remove(role);
        console.log(
          `Role: ${role.name} has been removed from ${member.user.tag}`
        );
      }
    }
    message.reply("Done");
  }
}
