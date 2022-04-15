import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class Command extends BaseCommand {
  constructor() {
    super({
      name: "remove-member-join-role",
      category: "Join Roles",
      permissions: new PermissionsGuard({
        userPermissions: ["MANAGE_ROLES"],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const role =
      message.guild?.roles.cache.get(args[0]) || message.mentions.roles.first();
    if (!role)
      return await message.reply(
        "You should mention a role with your message using the id or @role."
      );
    let configuration = await client.configurations.joinRoles.member.get(
      message.guildId!
    );
    if (!configuration)
      configuration = await client.configurations.joinRoles.member.create({
        guildId: message.guildId!,
        roles: [],
      });
    const roles = configuration.roles.map((r) => r.id);
    const roleId = role.id;
    if (!roles.includes(roleId))
      return await message.reply(
        "This role doesn't exist already in the database."
      );
    const index = roles.indexOf(roleId);
    roles.splice(index, 1);
    await client.configurations.joinRoles.member.update(message.guildId!, {
      roles,
    });
    await message.reply({ content: "The join roles have been updated!" });
  }
}
