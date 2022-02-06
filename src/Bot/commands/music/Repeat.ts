import {
  ButtonInteraction,
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class RepeatCommand extends BaseCommand {
  constructor() {
    super({
      name: "repeat",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
      }),
      aliases: ["loop"],
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const player = client.erela.get(message.guildId!) as Player;
    if (!player)
      return message.reply("There's nothing currently playing in the server.");
    if (!message.member?.voice.channel)
      return message.reply("You need to be in a voice channel.");
    if (
      message.member.voice.channel.id !== message.guild?.me?.voice.channel?.id
    )
      return message.reply(
        "You need to be in the same voice channel as the bot"
      );
    const { queueRepeat, trackRepeat } = player;
    let loopMode = player.trackRepeat
      ? "Track"
      : player.queueRepeat
      ? "Queue"
      : "Off";
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("Track")
          .setEmoji("🎵")
          .setStyle("PRIMARY")
          .setLabel("Track")
          .setDisabled(trackRepeat)
      )
      .addComponents(
        new MessageButton()
          .setCustomId("Queue")
          .setEmoji("🎶")
          .setStyle("PRIMARY")
          .setLabel("Queue")
          .setDisabled(queueRepeat)
      )
      .addComponents(
        new MessageButton()
          .setCustomId("Off")
          .setEmoji("🚫")
          .setStyle("PRIMARY")
          .setLabel("Off")
          .setDisabled(!trackRepeat && !queueRepeat)
      );

    const msg = await message.reply({
      content: `Current loop mode: ${loopMode}`,
      components: [row],
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
        case "Off":
          player.queueRepeat ? player.setQueueRepeat(false) : null;
          player.trackRepeat ? player.setTrackRepeat(false) : null;
          const offEditedRow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("Track")
                .setEmoji("🎵")
                .setStyle("PRIMARY")
                .setLabel("Track")
                .setDisabled(false)
            )
            .addComponents(
              new MessageButton()
                .setCustomId("Queue")
                .setEmoji("🎶")
                .setStyle("PRIMARY")
                .setLabel("Queue")
                .setDisabled(false)
            )
            .addComponents(
              new MessageButton()
                .setCustomId("Off")
                .setEmoji("🚫")
                .setStyle("PRIMARY")
                .setLabel("Off")
                .setDisabled(true)
            );
          await msg.edit({
            content: "Current loop mode: Off",
            components: [offEditedRow],
          });
          break;
        case "Queue":
          !player.queueRepeat ? player.setQueueRepeat(true) : null;
          player.trackRepeat ? player.setTrackRepeat(false) : null;
          const queueEditedRow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("Track")
                .setEmoji("🎵")
                .setStyle("PRIMARY")
                .setLabel("Track")
                .setDisabled(false)
            )
            .addComponents(
              new MessageButton()
                .setCustomId("Queue")
                .setEmoji("🎶")
                .setStyle("PRIMARY")
                .setLabel("Queue")
                .setDisabled(true)
            )
            .addComponents(
              new MessageButton()
                .setCustomId("Off")
                .setEmoji("🚫")
                .setStyle("PRIMARY")
                .setLabel("Off")
                .setDisabled(false)
            );
          await msg.edit({
            content: "Current loop mode: Queue",
            components: [queueEditedRow],
          });
          break;
        case "Track":
          player.queueRepeat ? player.setQueueRepeat(false) : null;
          !player.trackRepeat ? player.setTrackRepeat(true) : null;
          const trackEditedRow = new MessageActionRow()
            .addComponents(
              new MessageButton()
                .setCustomId("Track")
                .setEmoji("🎵")
                .setStyle("PRIMARY")
                .setLabel("Track")
                .setDisabled(true)
            )
            .addComponents(
              new MessageButton()
                .setCustomId("Queue")
                .setEmoji("🎶")
                .setStyle("PRIMARY")
                .setLabel("Queue")
                .setDisabled(false)
            )
            .addComponents(
              new MessageButton()
                .setCustomId("Off")
                .setEmoji("🚫")
                .setStyle("PRIMARY")
                .setLabel("Off")
                .setDisabled(false)
            );
          await msg.edit({
            content: "Current loop mode: Track",
            components: [trackEditedRow],
          });
          break;
      }
      let loopMode = player.trackRepeat
        ? "Track"
        : player.queueRepeat
        ? "Queue"
        : "Off";
      interaction.reply({
        content: `Current loop mode: ${loopMode}`,
        ephemeral: true,
      });
    });
  }
}
