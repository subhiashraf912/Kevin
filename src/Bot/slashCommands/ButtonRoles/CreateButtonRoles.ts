import { CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import BaseSlashCommand from "../../classes/Base/BaseSlashCommand";

export default class MenuRolesPanelCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "create-button-role",
      description:
        "Creates a button role and adds it to a button roles panel using it's custom id!",
      userPermissions: ["MANAGE_ROLES"],
      options: [
        {
          name: "custom-id",
          description:
            "the custom id of the menu, this custom id can have multiple roles. ex: colors",
          type: "STRING",
          required: true,
        },
        {
          name: "maximum-roles",
          description: "The maximum roles a member can get.",
          type: "NUMBER",
          required: false,
        },
        {
          name: "required-role",
          description:
            "If you want a role to be required for members to gain the following roles.",
          type: "ROLE",
          required: false,
        },
      ],
    });
  }

  async run(
    client: DiscordClient,
    interaction: CommandInteraction,
    args: Array<string>
  ) {
    const buttonRolesCustomId = interaction.options.getString(
      "custom-id",
      true
    );
    const maximumRoles = interaction.options.getNumber("maximum-roles");
    const requiredRole = interaction.options.getRole("required-role");
    const previousData = await client.database.models.buttonRoles.findOne({
      guildId: interaction.guildId,
      buttonRolesCustomId,
    });
    if (previousData)
      return interaction.reply({
        content: "There's already a button roles data with this ID",
        ephemeral: true,
      });
    const guildData = await client.database.models.buttonRoles.create({
      guildId: interaction.guildId,
      buttonRolesCustomId,
      maxRoles: maximumRoles,
      requiredRole,
      roles: [],
    });
    interaction.reply({
      content:
        "Created a new Button Roles thingy with the id: {customId}".replace(
          "{customId}",
          buttonRolesCustomId
        ),
      ephemeral: true,
    });
  }
}
