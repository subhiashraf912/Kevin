import {
  CacheType,
  CollectorFilter,
  GuildMember,
  Message,
  MessageActionRow,
  MessageButton,
  MessageComponentInteraction,
  MessageEmbed,
} from "discord.js";
import ytsr from "youtube-sr";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class NowPlayingCommand extends BaseCommand {
  constructor() {
    super({
      name: "now-playing",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const player = client.erela.get(message.guild?.id!);
    if (!player)
      return message.reply("There's no song currently playing in this server.");
    const realtime = process.env.NP_REALTIME || true;

    const song = player.queue.current;
    if (!song)
      return message.reply("There's no song currently playing in this server.");
    const CurrentDuration = player.position;
    const TotalDuration = song.duration!;
    const Thumbnail = `https://img.youtube.com/vi/${song.identifier}/maxresdefault.jpg`;
    const songInfo = await ytsr.searchOne(song.uri!);
    const views = songInfo.views;
    const uploadat = songInfo.uploadedAt;
    const Part = Math.floor((player.position / song.duration!) * 30);
    const Emoji = player.playing ? "▶ |" : "⏸ |";

    const embeded = new MessageEmbed()
      .setAuthor({
        name: player.playing ? "Now Playing..." : "Song Pause..",
        iconURL:
          "https://www.freepnglogos.com/uploads/apple-music-logo-circle-png-28.png",
      })
      .setColor("#000001")
      .setDescription(`**[${song.title}](${song.uri})**`)
      .setThumbnail(Thumbnail)
      .addField("Author:", `${song.author}`, true)
      .addField("Requester:", `${song.requester}`, true)
      .addField("Volume:", `${player.volume}%`, true)
      .addField("Views:", `${views}`, true)
      .addField("Upload At:", `${uploadat}`, true)
      .addField(
        `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``,
        `\`\`\`${Emoji} ${
          "─".repeat(Part) + "🔘" + "─".repeat(30 - Part)
        }\`\`\``
      )
      .setTimestamp();

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("pause")
          .setEmoji("⏯")
          .setStyle("PRIMARY")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("replay")
          .setEmoji("⬅")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton().setCustomId("stop").setEmoji("✖").setStyle("DANGER")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("skip")
          .setEmoji("➡")
          .setStyle("SUCCESS")
      )
      .addComponents(
        new MessageButton()
          .setCustomId("loop")
          .setEmoji("🔄")
          .setStyle("PRIMARY")
      );

    const disabledRow = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId("pause")
          .setEmoji("⏯")
          .setStyle("PRIMARY")
          .setDisabled(true)
      )
      .addComponents(
        new MessageButton()
          .setCustomId("replay")
          .setEmoji("⬅")
          .setStyle("SUCCESS")
          .setDisabled(true)
      )
      .addComponents(
        new MessageButton()
          .setCustomId("stop")
          .setEmoji("✖")
          .setStyle("DANGER")
          .setDisabled(true)
      )
      .addComponents(
        new MessageButton()
          .setCustomId("skip")
          .setEmoji("➡")
          .setStyle("SUCCESS")
          .setDisabled(true)
      )
      .addComponents(
        new MessageButton()
          .setCustomId("loop")
          .setEmoji("🔄")
          .setStyle("PRIMARY")
          .setDisabled(true)
      );

    const NEmbed = await message.reply({
      content: " ",
      embeds: [embeded],
      components: [row],
    });
    let interval: NodeJS.Timeout | null = null;

    if (realtime === "true") {
      interval = setInterval(async () => {
        if (!player.playing) return;
        const CurrentDuration = player.position;
        const Part = Math.floor((player.position / song.duration!) * 30);
        const Emoji = player.playing ? "▶ |" : "⏸ |";

        embeded.fields[5] = {
          name: `Current Duration: \`[${CurrentDuration} / ${TotalDuration}]\``,
          value: `\`\`\`${Emoji} ${
            "─".repeat(Part) + "🔘" + "─".repeat(30 - Part)
          }\`\`\``,
          inline: false,
        };

        if (NEmbed)
          NEmbed.edit({
            content: " ",
            embeds: [embeded],
            components: [row],
          });
      }, 5000);
    } else if (realtime === "false") {
      if (!player.playing) return;
      if (NEmbed)
        NEmbed.edit({
          content: " ",
          embeds: [embeded],
          components: [row],
        });
    }

    const filter: CollectorFilter<[MessageComponentInteraction<CacheType>]> = (
      m
    ) => {
      if (
        m.guild?.me?.voice.channel &&
        m.guild.me.voice.channelId ===
          (m.member as GuildMember)?.voice?.channelId
      )
        return true;
      else {
        m.reply({
          content: "You need to be in a same/voice channel.",
          ephemeral: true,
        });
        return false;
      }
    };
    const collector = NEmbed.createMessageComponentCollector({
      filter,
      time: song.duration,
    });

    collector.on("collect", async (interaction) => {
      const id = interaction.customId;

      if (id === "pause") {
        if (!player) {
          collector.stop();
        }
        player.pause(!player.paused);
        const uni = player.paused ? "Paused" : "Resumed";

        embeded.setAuthor({
          name: player.playing ? "Now Playing..." : "Song Pause..",
          iconURL:
            "https://www.freepnglogos.com/uploads/apple-music-logo-circle-png-28.png",
        });
        embeded.fields[5] = {
          name: `Current Duration: \`[${
            player.position
          } / ${song.duration!}]\``,
          value: `\`\`\`${player.playing ? "▶ |" : "⏸ |"} ${
            "─".repeat(Math.floor((player.position / song.duration!) * 30)) +
            "🔘" +
            "─".repeat(30 - Math.floor((player.position / song.duration!) * 30))
          }\`\`\``,
          inline: false,
        };

        if (NEmbed) await NEmbed.edit({ embeds: [embeded] });
        interaction.reply({ content: `Song is now ${uni}`, ephemeral: true });
      } else if (id === "replay") {
        if (!player) {
          collector.stop();
        }

        player.seek(0);

        interaction.reply({
          content: "Song has been replayed",
          ephemeral: true,
        });
      } else if (id === "stop") {
        if (!player) {
          collector.stop();
        }

        player.stop();
        player.destroy();

        clearInterval(interval!);

        if (NEmbed) await NEmbed.edit({ components: [disabledRow] });
        interaction.reply({
          content: "Music has been stopped",
          ephemeral: true,
        });
      } else if (id === "skip") {
        if (!player) {
          collector.stop();
        }
        player.stop();

        clearInterval(interval!);
        if (NEmbed) await NEmbed.edit({ components: [disabledRow] });
        interaction.reply({
          content: "Song has been skipped",
          ephemeral: true,
        });
      } else if (id === "loop") {
        if (!player) {
          collector.stop();
        }
        player.setTrackRepeat(!player.trackRepeat);
        const uni = player.trackRepeat ? "Enabled" : "Disabled";

        interaction.reply({
          content: `Repeat song is now: ${uni}`,
          ephemeral: true,
        });
      }
    });

    collector.on("end", async (collected: any, reason: string) => {
      if (reason === "time") {
        if (NEmbed) await NEmbed.edit({ components: [disabledRow] });
        clearInterval(interval!);
      }
    });
  }
}
