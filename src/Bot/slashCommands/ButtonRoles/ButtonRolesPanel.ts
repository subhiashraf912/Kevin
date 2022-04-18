import {
  ColorResolvable,
  CommandInteraction,
  EmbedFieldData,
  MessageActionRow,
  MessageActionRowComponentResolvable,
  MessageButton,
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
      name: "button-roles-panel",
      description: "Sends the menu roles panel!",
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
    const menuCustomId = interaction.options.getString("custom-id", true);
    const description = interaction.options.getString("description") || "";
    const color = interaction.options.getString("color") || "DEFAULT";
    let embedImageLink = interaction.options.getString("image-link") || "";
    const guildData = await client.database.models.buttonRoles.findOne({
      guildId: interaction.guildId,
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
        emoji: x.roleEmoji!,
        description: x.roleDescription || "No description",
      };
    });

    const messageActionRowComponents: MessageActionRowComponentResolvable[] =
      [];

    const fields: EmbedFieldData[] = options.map((option) => {
      return {
        name: option.label,
        value: option.description,
      };
    });

    options.forEach((option) => {
      const component = new MessageButton()
        .setCustomId(`buttonroles_${option.value}_${menuCustomId}`)
        .setEmoji(option.emoji)
        .setLabel(option.label)
        .setStyle("PRIMARY");

      messageActionRowComponents.push(component);
    });

    const components = [
      new MessageActionRow().addComponents(messageActionRowComponents),
    ];

    const panelEmbed = new MessageEmbed()
      .setTitle(menuCustomId)
      .setDescription(`\n**${description}**\n\n\n`)
      .setThumbnail(
        interaction.guild?.iconURL({ dynamic: true, size: 4096 }) || ""
      )
      .setImage(embedImageLink)
      .setColor(color as ColorResolvable)
      .addFields(fields);

    interaction.followUp({ content: "Sent", ephemeral: true });
    interaction.channel?.send({ embeds: [panelEmbed], components });
  }
}
