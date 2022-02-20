import {
  Message,
  MessageActionRow,
  MessageButton,
  ButtonInteraction,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";

import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
export default class RankCommand extends BaseCommand {
  constructor() {
    super({
      name: "rank",
      category: "Utils",
      permissions: new PermissionsGuard({
        botPermissions: [],
        userPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const member = message.mentions.members?.first() || message.member;
    let textRankDisabled = false;
    let voiceRankDisabled = false;
    const getRow = () => {
      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId("TextRank")
            .setEmoji("✉")
            .setStyle("PRIMARY")
            .setLabel("Text Rank")
            .setDisabled(textRankDisabled)
        )
        .addComponents(
          new MessageButton()
            .setCustomId("VoiceRank")
            .setEmoji("🗣")
            .setStyle("PRIMARY")
            .setLabel("Voice Rank")
            .setDisabled(voiceRankDisabled)
        );
      return row;
    };
    const msg = await message.reply({
      content: "Choose the rank type you want...",
      components: [getRow()],
    });
    const filter = (interaction: ButtonInteraction) =>
      interaction.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      filter,
    });
    collector.on("collect", async (interaction) => {
      const id = interaction.customId;
      switch (id) {
        case "TextRank":
          textRankDisabled = true;
          voiceRankDisabled = false;
          const attachment = await client.utils.generateRankCard(member!);
          await msg.edit({
            components: [getRow()],
          });
          await interaction.reply({
            files: [attachment],
          });
          break;
        case "VoiceRank":
          textRankDisabled = false;
          voiceRankDisabled = true;

          await msg.edit({
            components: [getRow()],
          });
          const rank = await client.configurations.voiceLevels.ranks.get({
            userId: interaction.user.id,
            guildId: message.guildId!,
          });
          let { voiceTime, joinTime } = rank;
          const voiceTimeJoinDiff =
            Date.now() - (joinTime ? joinTime : Date.now());
          await interaction.reply({
            content: "Your voice rank is {rank}".replace(
              "{rank}",
              client.utils.millisToMinutesAndSeconds(
                voiceTime + voiceTimeJoinDiff
              )
            ),
          });
          break;
      }
    });
  }
}
