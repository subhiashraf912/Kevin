import BaseEvent from "../../classes/Base/BaseEvent";
import {
  GuildMember,
  Interaction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  PermissionString,
  Role,
  User,
} from "discord.js";
import DiscordClient from "../../classes/Client/Client";
import moderationApplicationModal from "../../utils/SenCustomData/ModerationApplicationModal";
export default class MessageEvent extends BaseEvent {
  constructor() {
    super("interactionCreate");
  }

  async run(client: DiscordClient, interaction: Interaction) {
    if (
      interaction.isButton() &&
      interaction.customId === "management_team_button"
    ) {
      return interaction.showModal(moderationApplicationModal);
    }

    if (
      interaction.isModalSubmit() &&
      interaction.customId === "MareehaModerationApplicationModal"
    ) {
      const memberAge = interaction.fields.getTextInputValue(
        "MemberAgeMareehaModerationApplication"
      );
      const memberTimezoneAndCountry = interaction.fields.getTextInputValue(
        "MemberTimezoneAndCountryMareehaModerationApplication"
      );
      const memberDailyActivity = interaction.fields.getTextInputValue(
        "MemberActivityDailyMareehaModerationApplication"
      );
      const memberPastModerationStatus = interaction.fields.getTextInputValue(
        "MemberPastModerationStatusMareehaModerationApplication"
      );
      const memberReasonToBeAModerator = interaction.fields.getTextInputValue(
        "MemberReasonToBeAModeratorMareehaModerationApplication"
      );
      const embed = new MessageEmbed()
        .setAuthor({
          name: "Moderators Team Application",
          iconURL:
            "https://static.wikia.nocookie.net/discord/images/e/ea/Discord_Certified_Moderator.png/revision/latest?cb=20210614104513",
        })
        .addField("Member:", interaction.member?.toString()!)
        .addField("How old are you?", `\`\`\`${memberAge}\`\`\``)
        .addField(
          "What is your timezone? also your country?",
          `\`\`\`${memberTimezoneAndCountry}\`\`\``
        )
        .addField(
          "Can you be active at least 2 hours a day?",
          `\`\`\`${memberDailyActivity}\`\`\``
        )
        .addField(
          "Do you have previous moderator exp?",
          `\`\`\`${memberPastModerationStatus}\`\`\``
        )
        .addField(
          "Why do you want to be a moderator?",
          `\`\`\`${memberReasonToBeAModerator}\`\`\``
        )
        .setThumbnail(
          "https://bot.to/wp-content/uploads/2020/09/server-protection_5f74b6f14460b.png"
        )
        .setTimestamp(Date.now());
      const modsApplicationsChannel = await client.channels.fetch(
        "1090147269233348608"
      );
      const acceptButton = new MessageButton()
        .setCustomId(`MareehaModAccept_${interaction.member?.user.id}`)
        .setEmoji("✅")
        .setLabel("Accept Member To Moderation Team")
        .setStyle("SUCCESS");
      const denyButton = new MessageButton()
        .setCustomId(`MareehaModDeny_${interaction.member?.user.id}`)
        .setEmoji("❌")
        .setLabel("Deny Member From Moderation Team")
        .setStyle("DANGER");

      const row = new MessageActionRow().addComponents(
        acceptButton,
        denyButton
      );
      if (modsApplicationsChannel?.isText())
        await modsApplicationsChannel.send({
          embeds: [embed],
          components: [row],
        });
      interaction.reply({
        content:
          "Your application has been sent to the server admins, Wait for their reply and goodluck!",
        ephemeral: true,
      });
    }

    if (
      interaction.isButton() &&
      (interaction.customId.startsWith("MareehaModAccept") ||
        interaction.customId.startsWith("MareehaModDeny"))
    ) {
      const memberId = interaction.customId.split("_")[1];
      const member = await interaction.guild?.members.fetch(memberId);
      if (!member)
        return interaction.reply({
          content:
            "Couldn't fetch the member to give them the trial moderator role",
          ephemeral: true,
        });
      if (interaction.customId.startsWith("MareehaModAccept")) {
        const role = await interaction.guild?.roles.fetch(
          "1036145989020569630"
        );
        if (!role)
          return interaction.reply({
            content: "Couldn't fetch the trial moderator role!",
            ephemeral: true,
          });
        try {
          await member.roles.add(role);
          const acceptButton = new MessageButton()
            .setCustomId(`MareehaModAccept_${interaction.member?.user.id}`)
            .setEmoji("✅")
            .setDisabled(true)
            .setLabel(
              `Member Got Accepted By: ${
                (interaction.member?.user as User).tag
              }`
            )
            .setStyle("SUCCESS");
          const denyButton = new MessageButton()
            .setCustomId(`MareehaModDeny_${interaction.member?.user.id}`)
            .setEmoji("❌")
            .setDisabled(true)
            .setLabel("Deny Member From Moderation Team")
            .setStyle("DANGER");
          const row = new MessageActionRow().addComponents(
            acceptButton,
            denyButton
          );
          (interaction.message as Message).edit({ components: [row] });
          interaction.reply({
            content: `${member.user.username} has became a trial moderator!`,
            ephemeral: true,
          });
          try {
            const embed = new MessageEmbed()
              .setAuthor({
                name: `Mareeha's Garden | Message from ${interaction.member
                  ?.user.username!}`,
                iconURL: interaction.guild?.iconURL({ dynamic: true })!,
              })
              .setDescription(
                "Congratulations, You've been chosen as a trial moderator on our server (Mareeha's Garden), Your actions and permissions usage will be watched by our management team so be carefully in how you use your temp permissions.\nCheck <#887031317877891097> to start talking with the other moderators!"
              )
              .setImage(
                "https://assets-global.website-files.com/5f9072399b2640f14d6a2bf4/615e08a57562b757afbe7032_TransparencyReport_BlogHeader.png"
              )
              .setTimestamp();
            await member.send({ embeds: [embed] });
          } catch {
            interaction.reply({
              content: `Could not message ${member.user.username} because their DMS are closed, Someone has to inform them that they got accepted to the staff team!`,
            });
          }
          try {
            const secretStaffChannel = await client.channels.fetch(
              "887031317877891097"
            );
            if (secretStaffChannel?.isText())
              await secretStaffChannel.send({
                content: `@everyone say hi to our new trial moderator ${member.toString()} and wish them the best luck!!!`,
              });
          } catch {}
        } catch (err) {
          return interaction.reply({
            content: (err as Error).message,
            ephemeral: true,
          });
        }
      } else {
        const acceptButton = new MessageButton()
          .setCustomId(`MareehaModAccept_${interaction.member?.user.id}`)
          .setEmoji("✅")
          .setDisabled(true)
          .setLabel(`Accept Member To Moderation Team`)
          .setStyle("SUCCESS");
        const denyButton = new MessageButton()
          .setCustomId(`MareehaModDeny_${interaction.member?.user.id}`)
          .setEmoji("❌")
          .setDisabled(true)
          .setLabel(
            `Member got rejected by: ${(interaction.member?.user as User).tag}`
          )
          .setStyle("DANGER");
        const row = new MessageActionRow().addComponents(
          acceptButton,
          denyButton
        );
        (interaction.message as Message).edit({ components: [row] });
        interaction.reply({
          content: `${member.user.username} has been denied from mod application!`,
          ephemeral: true,
        });
      }
    }
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
