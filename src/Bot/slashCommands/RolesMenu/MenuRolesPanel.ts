import {
  ColorResolvable,
  CommandInteraction,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
} from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import BaseSlashCommand from "../../classes/Base/BaseSlashCommand";

const colors = [
  "WHITE",
  "AQUA",
  "GREEN",
  "BLUE",
  "YELLOW",
  "PURPLE",
  "LUMINOUS_VIVID_PINK",
  "FUCHSIA",
  "GOLD",
  "ORANGE",
  "RED",
  "GREY",
  "DARKER_GREY",
  "NAVY",
  "DARK_AQUA",
  "DARK_GREEN",
  "DARK_BLUE",
  "DARK_PURPLE",
  "DARK_VIVID_PINK",
  "DARK_GOLD",
  "DARK_ORANGE",
  "DARK_RED",
  "DARK_GREY",
  "LIGHT_GREY",
];

const colorChoises = colors.map((color) => {
  return {
    name: color.toLowerCase().replace("_", " "),
    value: color,
  };
});

export default class MenuRolesPanelCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "menu-roles-panel",
      description: "Sends the menu roles panel!",
      userPermissions: ["MANAGE_ROLES"],
      options: [
        {
          name: "menu-custom-id",
          description:
            "the custom id of the menu, this custom id can have multiple roles. ex: colors",
          type: "STRING",
          required: true,
        },
        {
          name: "description",
          description:
            "The description of the embed that will be sent in the menu.",
          type: "STRING",
          required: false,
        },
        {
          name: "color",
          description: "The color of the embed that will be sent in the menu.",
          type: "STRING",
          required: false,
          choices: colorChoises,
        },
        {
          name: "minimum-roles",
          description: "The minimum roles a member can get.",
          type: "NUMBER",
          required: false,
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
        {
          name: "image-link",
          description: "The embed image link, you can pass it here.",
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
    const menuCustomId = interaction.options.getString("menu-custom-id", true);
    const description = interaction.options.getString("description") || "";
    const color = interaction.options.getString("color") || "DEFAULT";
    let minimumRoles = interaction.options.getNumber("minimum-roles");
    let maximumRoles = interaction.options.getNumber("maximum-roles");
    let requiredRole = interaction.options.getRole("required-role");
    let embedImageLink = interaction.options.getString("image-link") || "";
    const guildData = await client.database.models.menuRoles.findOne({
      guildId: interaction.guildId!,
      menuCustomId,
    });

    if (!guildData?.roles) {
      interaction.followUp(
        "There are no roles inside of our database for this server."
      );
      return;
    }
    const options = guildData.roles.map((x: any) => {
      const role = interaction.guild?.roles.cache.get(x.roleId);
      return {
        label: role?.name!,
        value: role?.id!,
        description: x.roleDescription || "No description",
        emoji: x.roleEmoji!,
      };
    });

    const selectMenu = new MessageSelectMenu()
      .setCustomId(`menuroles_${menuCustomId}_${requiredRole?.id || ""}`)
      .addOptions(options);
    if (minimumRoles && minimumRoles <= 0) minimumRoles = 1;
    if (maximumRoles && maximumRoles <= 0) maximumRoles = 1;
    if (maximumRoles) selectMenu.setMaxValues(maximumRoles);
    if (minimumRoles) selectMenu.setMinValues(minimumRoles);
    const components = [new MessageActionRow().addComponents(selectMenu)];

    const panelEmbed = new MessageEmbed()
      .setDescription(`\`\`\`${menuCustomId}\`\`\`\n${description}`)
      .setThumbnail(
        interaction.guild?.iconURL({ dynamic: true, size: 4096 }) || ""
      )
      .setImage(embedImageLink)
      .setColor(color as ColorResolvable);

    interaction.followUp({ content: "Sent", ephemeral: true });
    interaction.channel?.send({ embeds: [panelEmbed], components });
  }
}
