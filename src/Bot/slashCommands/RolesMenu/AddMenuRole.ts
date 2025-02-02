import { CommandInteraction } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import BaseSlashCommand from "../../classes/Base/BaseSlashCommand";

export default class AddMenuRoleCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "add-menu-role",
      description: "Add a custom menu role!",
      options: [
        {
          name: "role",
          description: "The role to be assigned.",
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
        {
          name: "description",
          description: "description of the role.",
          type: "STRING",
          required: false,
        },
        {
          name: "emoji",
          description: "emoji for the role.",
          type: "STRING",
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
    const role = interaction.options.getRole("role", true);
    const menuCustomId = interaction.options.getString("menu-custom-id", true);
    const roleDescription =
      interaction.options.getString("description") || null;
    const roleEmoji = interaction.options.getString("emoji") || null;
    if (
      role?.position >= (interaction.guild?.me?.roles.highest.position || 0)
    ) {
      interaction.followUp(
        "I can't edit the role you mentioned, make sure I have permissions to give that role to other members."
      );
      return;
    }

    const newRole = {
      roleId: role.id,
      roleDescription,
      roleEmoji,
    };

    const guildData = await client.database.models.menuRoles.findOne({
      guildId: interaction.guildId!,
      menuCustomId,
    });

    if (guildData) {
      let roleData = guildData.roles.find((x: any) => x.roleId === role.id);

      if (roleData) {
        roleData = newRole;
      } else {
        guildData.roles = [...guildData.roles, newRole];
      }
      await guildData.save();
    } else {
      await client.database.models.menuRoles.create({
        guildId: interaction.guildId,
        roles: newRole,
        menuCustomId,
      });
    }
    interaction.followUp(`Created a new role: ${role.name}`);
  }
}
