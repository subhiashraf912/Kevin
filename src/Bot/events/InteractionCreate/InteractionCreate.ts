import BaseEvent from "../../classes/Base/BaseEvent";
import { GuildMember, Interaction, PermissionString, Role } from "discord.js";
import DiscordClient from "../../classes/Client/Client";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client: DiscordClient, interaction: Interaction) {
    if (interaction.isCommand()) {
      await interaction.deferReply({ ephemeral: true }).catch(() => {});

      const cmd = client.slashCommands.get(interaction.commandName);
      if (!cmd)
        return interaction.followUp({
          content: "An error has occured!",
        });
      const args: string[] = [];

      for (let option of interaction.options.data) {
        if (option.type === "SUB_COMMAND") {
          if (option.name) args.push(option.name);
          option.options?.forEach((x) => {
            if (x.value) args.push(x.value as string);
          });
        } else if (option.value) args.push(option.value as string);
      }
      interaction.member = interaction.guild?.members.cache.get(
        interaction.user.id
      ) as GuildMember;
      const requiredUserPermissions = interaction.memberPermissions;
      const userPermissions: PermissionString[] = [];
      cmd.getPermissions()?.forEach((perm) => {
        if (!requiredUserPermissions?.has(perm)) userPermissions.push(perm);
      });
      if (userPermissions.length !== 0) {
        interaction.followUp({
          content: `You need ${userPermissions.map(
            (perm) => `${perm.toLowerCase()} `
          )} Permissions. `,
        });
        return;
      } else cmd.run(client, interaction, args);
    }

    if (interaction.isContextMenu()) {
      await interaction.deferReply({ ephemeral: false });
      const command = client.slashCommands.get(interaction.commandName);
      if (command) command.run(client, interaction, []);
    }

    if (interaction.isButton()) {
      const { guild, customId } = interaction;
      if (!guild || !customId.startsWith("button-roles-")) return;
      const roleId = customId.replace("button-roles-", "").split("_")[0];
      const requiredRoleId = customId
        .replace("button-roles-", "")
        .split("_")[1];
      const member = interaction.member as GuildMember;

      if (
        requiredRoleId !== "null" &&
        member.guild.roles.cache.get(requiredRoleId) &&
        !member.roles.cache.get(requiredRoleId)
      )
        return interaction.reply({
          content: `You need ${member.guild.roles.cache
            .get(requiredRoleId)
            ?.toString()} Role to gain this role!`,
          ephemeral: true,
        });

      if (member?.roles.cache.has(roleId)) {
        member.roles.remove(roleId);
        interaction.reply({
          ephemeral: true,
          content: `You no longer have <@&${roleId}> role.`,
        });
      } else {
        member.roles.add(roleId);
        interaction.reply({
          ephemeral: true,
          content: `You now have <@&${roleId}> role.`,
        });
      }
    }

    if (
      interaction.isSelectMenu() &&
      interaction.customId.startsWith("menuroles")
    ) {
      const memberId = interaction.member?.user?.id;
      const guildId = interaction.guildId!;
      const guild = interaction.guild!;
      const guildCustomMenuId = interaction.customId.split("_")[1];
      const requiredRoleId = interaction.customId.split("_")[2];
      if (guild) {
        const member = guild.members.cache.get(memberId as string);
        if (member) {
          const rr = guild.roles.cache.get(requiredRoleId);
          if (requiredRoleId && rr) {
            const r = member.roles.cache.get(requiredRoleId);
            if (!r) {
              interaction.reply({
                content: `You need ${rr.toString()} role to access the roles in this menu.`,
                ephemeral: true,
              });
              return;
            }
          }
          const values = interaction.values;
          const removedRoles: string[] = [];
          const addedRoles: Role[] = [];
          const data = await client.database.models.menuRoles.findOne({
            guildId,
            menuCustomId: guildCustomMenuId,
          });
          if (!data) {
            interaction.reply({
              content:
                "No data were found in the database or there's a connection error in the client.",
              ephemeral: true,
            });
            return;
          }
          let roles = data.roles;

          roles.forEach((roleObject) => {
            if (
              !interaction.values.includes(roleObject.roleId) &&
              member.roles.cache.has(roleObject.roleId)
            ) {
              removedRoles.push(roleObject.roleId);
            }
          });
          for (const value of values) {
            const role = guild.roles.cache.get(value);
            if (role) {
              if (member.roles.cache.get(role.id)) {
              } else {
                await member.roles.add(role.id);
                addedRoles.push(role);
              }
            }
          }
          for (const roleToBeRemoved of removedRoles) {
            await member.roles.remove(roleToBeRemoved);
          }

          interaction.reply({
            content: `> Your new roles: ${
              addedRoles[0]
                ? ` ${addedRoles.map((role) => role)}`
                : "No roles were added"
            }\n> Your removed roles: ${
              removedRoles[0]
                ? ` ${removedRoles.map((role) => `<@&${role}>`)}`
                : " No roles were removed"
            }`,
            ephemeral: true,
          });
        }
      }
    }
  }
}
