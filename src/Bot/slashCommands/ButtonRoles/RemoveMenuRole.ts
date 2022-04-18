import { CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import BaseSlashCommand from "../../classes/Base/BaseSlashCommand";

export default class RemoveMenuRoleCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "remove-button-role",
      description: "Removes a button role from the custom id!",
      userPermissions: ["MANAGE_ROLES"],
      options: [
        {
          name: "role",
          description: "The role to be removed.",
          type: "ROLE",
          required: true,
        },
        {
          name: "custom-id",
          description:
            "the custom id of the button roles panel, this custom id can have multiple roles. ex: colors",
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
    const menuCustomId = interaction.options.getString("custom-id", true);

    const guildData = await client.database.models.buttonRoles.findOne({
      guildId: interaction.guildId,
      menuCustomId,
    });
    if (!guildData) {
      interaction.followUp({
        content:
          "There's no button roles panel with that custom id you provided!",
        ephemeral: true,
      });
      return;
    }
    const guildRoles = guildData.roles;
    const findRole = guildRoles.find((x: any) => x.roleId === role.id);
    if (!findRole) {
      interaction.followUp({
        content: "That role is not added to the roles list!",
        ephemeral: true,
      });
      return;
    }
    const filteredRoles = guildRoles.filter((x: any) => x.roleId !== role.id);
    guildData.roles = filteredRoles;
    await guildData.save();
    interaction.followUp({
      content: `Role: ${role.toString()} has been removed from the button roles panel with custom id: ${menuCustomId}`,
      ephemeral: true,
    });
  }
}
