import BaseEvent from "../../classes/Base/BaseEvent";
import {
  GuildMember,
  GuildMemberRoleManager,
  Interaction,
  PermissionString,
  Role,
} from "discord.js";
import DiscordClient from "../../classes/Client/Client";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client: DiscordClient, interaction: Interaction) {
    if (interaction.isCommand()) {
      await interaction.deferReply().catch(() => {});

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

    if (
      interaction.isButton() &&
      interaction.customId.startsWith("buttonroles")
    ) {
      const memberId = interaction.member?.user?.id;
      const member = interaction.member!;
      const guildId = interaction.guildId!;
      const guild = interaction.guild!;
      const roleId = interaction.customId.split("_")[1];
      const role = guild.roles.cache.get(roleId)!;
      const guildCustomMenuId = interaction.customId.split("_")[2];
      const data = await client.database.models.buttonRoles.findOne({
        guildId,
        buttonRolesCustomId: guildCustomMenuId,
      });
      if (!data) {
        interaction.reply({
          content:
            "No data were found in the database or there's a connection error in the client.",
          ephemeral: true,
        });
        return;
      }
      const requiredRoleId = data.requiredRole;
      const maxRoles = data.maxRoles || 99;
      const roles = data.roles;
      const requiredRole = guild.roles.cache.get(requiredRoleId);
      if (
        requiredRole &&
        Array.isArray(member.roles) &&
        !member.roles.includes(requiredRoleId)
      )
        return interaction.reply({
          content: `You need ${requiredRole.toString()} role to get this role.`,
          ephemeral: true,
        });
      else if (
        requiredRole &&
        member.roles instanceof GuildMemberRoleManager &&
        !member.roles.cache.get(requiredRoleId)
      )
        return interaction.reply({
          content: `You need ${requiredRole.toString()} role to get this role.`,
          ephemeral: true,
        });
      const memberRoles = [];
      if (Array.isArray(member.roles)) {
        roles.forEach((buttonRole) => {
          if ((member.roles as string[]).includes(buttonRole.roleId))
            memberRoles.push(buttonRole.roleId);
        });
      } else if (member.roles instanceof GuildMemberRoleManager) {
        roles.forEach((buttonRole) => {
          if (
            (member.roles as GuildMemberRoleManager).cache.has(
              buttonRole.roleId
            )
          )
            memberRoles.push(buttonRole.roleId);
        });
      }
      if (maxRoles > memberRoles.length)
        return interaction.reply({
          content: `The maximum roles allowed in this section is ${maxRoles.toString()} and you have ${
            memberRoles.length
          }`,
          ephemeral: true,
        });

      await guild.members.cache.get(memberId!)?.roles.add(roleId);
      interaction.reply({
        content: `The role ${role.toString()} has been given to you.`,
        ephemeral: true,
      });
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
