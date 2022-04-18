import {
  CommandInteraction,
  Guild,
  GuildTextBasedChannel,
  MessageEmbed,
} from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import BaseSlashCommand from "../../classes/Base/BaseSlashCommand";
import ButtonRoles from "../../utils/types/API/ButtonRoles";

export default class ViewMenuRolesCommand extends BaseSlashCommand {
  constructor() {
    super({
      name: "preview-button-roles",
      userPermissions: ["MANAGE_ROLES"],
      description: "Views the button roles in the server!",
      options: [
        {
          name: "custom-id",
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
    const menuCustomId = interaction.options.getString("custom-id", false);
    if (!menuCustomId) {
      const guildData = await client.database.models.buttonRoles.find({
        guildId: interaction.guildId,
      });
      if (!guildData || !guildData[0]) {
        interaction.followUp({
          content: "There are no roles for this server in the database.",
          ephemeral: true,
        });
        return;
      }
      const embeds = this.generateMainRolesMenuEmbeds(guildData);
      await interaction.followUp({ content: "Here's the roles list" });
      client.utils.pagination({
        embeds,
        channel: interaction.channel as GuildTextBasedChannel,
        pageTravel: true,
        fastSkip: true,
        author: interaction.user,
      });
    } else {
      const guildData = await client.database.models.buttonRoles.findOne({
        guildId: interaction.guildId,
        menuCustomId,
      });
      if (!guildData) {
        interaction.followUp({
          content: "There are no roles for this server in the database.",
          ephemeral: true,
        });
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
  generateMainRolesMenuEmbeds(menuRoles: ButtonRoles[]) {
    const embeds = [];
    let k = 5;
    for (let i = 0; i < menuRoles.length; i += 5) {
      const current = menuRoles.slice(i, k);
      let j = i;
      k += 5;
      let info = "";
      current.forEach((menuRole) => {
        info = `${info}\n\`\`\`css\n${++j}) ${
          menuRole.buttonRolesCustomId
        } || Roles Count: ${menuRoles.length}\`\`\``;
      });

      const embed = new MessageEmbed().setDescription(
        `\`\`\`Server's Menu Roles\`\`\`\n${info}`
      );
      embeds.push(embed);
    }
    return embeds;
  }
  generateSubRolesMenuEmbeds(menuRoles: ButtonRoles, guild: Guild) {
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
        `\`\`\`Server's Button Roles -> ${menuRoles.buttonRolesCustomId}\`\`\`\n${info}`
      );
      embeds.push(embed);
    }
    return embeds;
  }
}
