import { CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import BaseSlashCommand from "../../classes/Base/BaseSlashCommand";

export default class RemoveMenuRoleCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "remove-menu-role",
      description: "Remove a custom menu role!",
      userPermissions: ["MANAGE_ROLES"],
      options: [
        {
          name: "role",
          description: "The role to be removed.",
          type: "ROLE",
          required: true,
        },
        {
          name: "menu-custom-id",
          description:
            "the custom id of the menu, this custom id can have multiple roles. ex: colors",
          type: "STRING",
          required: true,
        },
      ],
    });
  }

  async run(
    client: DiscordClient,
    interaction: CommandInteraction,
    args: Array<string>
  ) {
    const role = interaction.options.getRole("role", true);
    const menuCustomId = interaction.options.getString("menu-custom-id", true);

    const guildData = await client.database.models.menuRoles.findOne({
      guildId: interaction.guildId!,
      menuCustomId,
    });
    if (!guildData) {
      interaction.followUp(
        "There are no roles for this server inside our database!"
      );
      return;
    }
    const guildRoles = guildData.roles;
    const findRole = guildRoles.find((x: any) => x.roleId === role.id);
    if (!findRole) {
      interaction.followUp("That role is not added to the roles menu!");
      return;
    }
    const filteredRoles = guildRoles.filter((x: any) => x.roleId !== role.id);
    guildData.roles = filteredRoles;
    await guildData.save();
    interaction.followUp(`Removed: ${role.name}`);
  }
}
