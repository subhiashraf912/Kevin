import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class RemoveRoleFromMembersCommand extends BaseCommand {
  constructor() {
    super({
      name: "remove-role-from-members",
      category: "Moderators",
      permissions: new PermissionsGuard({
        userPermissions: ["ADMINISTRATOR"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const guildId = message.guildId!;
    if (!args[0]) return message.reply("Enter the role id!!");
    const role = message.guild?.roles.cache.get(args[0]);
    if (!role) return message.reply("Role not found");
    const members = await message.guild?.members.fetch({ limit: 1000 });
    members?.forEach(async (member) => {
      if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
      }
    });
    message.reply(
      "Removed {role} from {members-count} members"
        .replace("{role}", role.name)
        .replace("{members-count}", members?.size.toString()!)
    );
  }
}
