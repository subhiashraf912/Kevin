import {
  CommandInteraction,
  Guild,
  GuildTextBasedChannel,
  Message,
  MessageEmbed,
} from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import BaseSlashCommand from "../../classes/Base/BaseSlashCommand";
import MenuRoles from "../../utils/types/API/MenuRoles";

export default class ViewMenuRolesCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "view-menu-roles",
      userPermissions: ["MANAGE_ROLES"],
      description: "Views the menu roles in the server!",
      options: [
        {
          name: "menu-custom-id",
          description:
            "the custom id of the menu, if you enter this you'll be able to see the roles for this menu",
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
    const menuCustomId = interaction.options.getString("menu-custom-id", false);
    if (!menuCustomId) {
      const guildData = await client.database.models.menuRoles.find({
        guildId: interaction.guildId!,
      });
      if (!guildData || !guildData[0]) {
        interaction.followUp(
          "There are no roles for this server in the database."
        );
        return;
      }
      const embeds = this.generateMainRolesMenuEmbeds(guildData);
      await interaction.followUp({ content: "Here's the roles menu list" });
      client.utils.pagination({
        embeds,
        channel: interaction.channel as GuildTextBasedChannel,
        pageTravel: true,
        fastSkip: true,
        author: interaction.user,
      });
    } else {
      const guildData = await client.database.models.menuRoles.findOne({
        guildId: interaction.guildId!,
        menuCustomId,
      });
      if (!guildData) {
        interaction.followUp(
          "There are no roles for this server in the database."
        );
        return;
      }
      const embeds = this.generateSubRolesMenuEmbeds(
        guildData,
        interaction.guild!
      );
      await interaction.followUp({ content: "Here's the roles menu list" });
      client.utils.pagination({
        embeds,
        channel: interaction.channel as GuildTextBasedChannel,
        pageTravel: true,
        fastSkip: true,
        author: interaction.user,
      });
    }
  }
  generateMainRolesMenuEmbeds(menuRoles: MenuRoles[]) {
    const embeds = [];
    let k = 5;
    for (let i = 0; i < menuRoles.length; i += 5) {
      const current = menuRoles.slice(i, k);
      let j = i;
      k += 5;
      let info = "";
      current.forEach((menuRole) => {
        info = `${info}\n\`\`\`css\n${++j}) ${
          menuRole.menuCustomId
        } || Roles Count: ${menuRoles.length}\`\`\``;
      });

      const embed = new MessageEmbed().setDescription(
        `\`\`\`Server's Menu Roles\`\`\`\n${info}`
      );
      embeds.push(embed);
    }
    return embeds;
  }
  generateSubRolesMenuEmbeds(menuRoles: MenuRoles, guild: Guild) {
    const embeds = [];
    let k = 5;
    for (let i = 0; i < menuRoles.roles.length; i += 5) {
      const current = menuRoles.roles.slice(i, k);
      let j = i;
      k += 5;
      let info = "";
      current.forEach((role) => {
        const r = guild.roles.cache.get(role.roleId);
        if (r)
          info = `${info}\n\`\`\`css\n${++j}) ${r.name}\nRole Description: ${
            role.roleDescription
          }\nRole Emoji: ${role.roleEmoji}\`\`\``;
      });

      const embed = new MessageEmbed().setDescription(
        `\`\`\`Server's Menu Roles -> ${menuRoles.menuCustomId}\`\`\`\n${info}`
      );
      embeds.push(embed);
    }
    return embeds;
  }
}
