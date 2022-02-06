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
import FiltersString from "../../utils/types/Erela/FiltersString";

export default class FilterCommand extends BaseCommand {
  constructor() {
    super({
      name: "filter",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
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
      const filter: FiltersString = interaction.values[0] as FiltersString;
      const guild = interaction.guild!;
      const player = client.erela.get(guild.id) as Player;
      if (!player)
        return interaction.reply(
          "There's nothing currently playing in the music"
        );
      switch (filter) {
        case "8d":
          //@ts-ignore
          player.eightD = !player.eightD;
          break;
        case "bassboost":
          //@ts-ignore
          player.bassboost = !player.bassboost;
          break;
        case "kakaoke":
          //@ts-ignore
          player.kakaoke = !player.kakaoke;
          break;
        case "nightcore":
          //@ts-ignore
          player.nightcore = !player.nightcore;
          break;
        case "pop":
          //@ts-ignore
          player.pop = !player.pop;
          break;
        case "soft":
          //@ts-ignore
          player.soft = !player.soft;
          break;
        case "treblebass":
          //@ts-ignore
          player.treblebass = !player.treblebass;
          break;
        case "tremolo":
          //@ts-ignore
          player.tremolo = !player.tremolo;
          break;
        case "vaporwave":
          //@ts-ignore
          player.vaporwave = !player.vaporwave;
          break;
        case "vibrato":
          //@ts-ignore
          player.vibrato = !player.vibrato;
          break;
      }
      interaction.reply({
        content: `The ${filter} filter has been toggled`,
      });
    });
  }
}
