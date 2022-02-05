import {
  Message,
  MessageActionRow,
  MessageEmbed,
  MessageSelectMenu,
  SelectMenuInteraction,
} from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";
import filters from "../../utils/Erela/filters.json";
import bassboost from "../../utils/Erela/bassboost.json";
export default class FilterCommand extends BaseCommand {
  constructor() {
    super({
      name: "filter",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: [],
      }),
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

    const options = filters.map((x) => {
      return {
        label: x.name,
        value: x.name,
        description: x.description,
        emoji: x.emoji,
      };
    });

    const selectMenu = new MessageSelectMenu()
      .setCustomId(`filters_change`)
      .addOptions(options);

    const components = [new MessageActionRow().addComponents(selectMenu)];
    const embed = new MessageEmbed()
      .setDescription(
        `\`\`\`Music Filters\`\`\`\nYou can choose the filter you like from here`
      )
      .setThumbnail(message.guild?.iconURL({ dynamic: true, size: 4096 }) || "")
      .setImage("https://preview.pixlr.com/images/800wm/100/1/1001437742.jpg")
      .setColor(message.guild?.me?.displayHexColor || "AQUA");

    const msg = await message.reply({ embeds: [embed], components });
    const filter = (m: SelectMenuInteraction) =>
      m.user.id === message.author.id;
    const collector = msg.createMessageComponentCollector({
      componentType: "SELECT_MENU",
      filter,
      time: 120000,
    });
    collector.on("collect", (interaction) => {
      const filter = interaction.values[0];
      const guild = interaction.guild!;
      const player = client.erela.get(guild.id);
      if (!player)
        return interaction.reply(
          "There's nothing currently playing in the music"
        );
      switch (filter.toLowerCase()) {
        case "3d":
          player.node.send({
            op: "filters",
            guildId: guild?.id,
            equalizer: player.bands.map((gain, index) => {
              let Obj = {
                band: 0,
                gain: 0,
              };
              Obj.band = Number(index);
              Obj.gain = Number(gain);
              return Obj;
            }),
            rotation: {
              rotationHz: 0.2,
            },
          });
          break;
        case "nightcore":
          player.node.send({
            op: "filters",
            guildId: message.guild?.id,
            equalizer: player.bands.map((gain, index) => {
              var Obj = {
                band: 0,
                gain: 0,
              };
              Obj.band = Number(index);
              Obj.gain = Number(gain);
              return Obj;
            }),
            timescale: {
              speed: 1.165,
              pitch: 1.125,
              rate: 1.05,
            },
          });
          break;
        case "bassboost":
          player.set("filter", "🎚 Medium Bass");
          player.setEQ(...bassboost);
          player.node.send({
            op: "filters",
            guildId: message.guild?.id,
            equalizer: player.bands.map((gain, index) => {
              var Obj = {
                band: 0,
                gain: 0,
              };
              Obj.band = Number(index);
              Obj.gain = Number(gain);
              return Obj;
            }),
            timescale: {
              speed: 1.0,
              pitch: 1.0,
              rate: 1.0,
            },
          });
          break;
      }
      interaction.reply({
        content: `The reply has been set to: ${filter}`,
      });
    });
    // const filter = args[0];
    // if (!filter) return message.reply("Enter the filter");
    // switch (filter.toLowerCase()) {
    //   case "8d":
    //     player.node.send({
    //       op: "filters",
    //       guildId: message.guild?.id,
    //       equalizer: player.bands.map((gain, index) => {
    //         let Obj = {
    //           band: 0,
    //           gain: 0,
    //         };
    //         Obj.band = Number(index);
    //         Obj.gain = Number(gain);
    //         return Obj;
    //       }),
    //       rotation: {
    //         rotationHz: 0.2,
    //       },
    //     });
    //     break;
    //   case "speed":
    //     player.node.send({
    //       op: "filters",
    //       guildId: message.guild?.id,
    //       timescale: {
    //         speed: parseFloat(args[1]),
    //       },
    //     });
    //     break;
    // }
  }
}
