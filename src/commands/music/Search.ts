import { Message, MessageEmbed } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class SearchCommand extends BaseCommand {
  constructor() {
    super({
      name: "search",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!message.member?.voice.channel)
      return message.reply("You need to join a voice channel.");
    if (message.guild?.me?.voice.channel) {
      if (message.guild.me.voice.channel.id !== message.member.voice.channel.id)
        return message.reply(
          "You need to be in the same voice channel as the bot to play music."
        );
    }
    if (!args[0])
      return message.reply("You need to provide the song name or link.");
    const player = client.erela.create({
      guild: message.guild?.id!,
      voiceChannel: message.member?.voice.channel?.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });
    if (player.state !== "CONNECTED") player.connect();
    const res = await client.erela.search(args.join(" "), message.author);
    if (res.loadType === "SEARCH_RESULT") {
      let index = 1;
      const tracks = res.tracks.slice(0, 5);
      const embed = new MessageEmbed()
        .setAuthor({
          name: "Song Selection",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          tracks.map((track) => `**${index++} -** ${track.title}`).join("\n")
        )
        .setFooter({
          text: "Your response time closes within the next 30  secs, Type 'cancel' to cancel the selection",
        });
      await message.reply({ embeds: [embed] });
      const filter = (m: Message) =>
        m.author.id === message.author.id &&
        new RegExp("^([1-5|cancel])$", "i").test(m.content);
      const collector = message.channel.createMessageCollector({
        filter,
        time: 30000,
        max: 1,
      });
      collector.on("collect", async (m) => {
        if (/cancel/i.test(m.content)) return collector.stop("Canceled");
        const track = tracks[Number(m.content) - 1];
        player.queue.add(track);
        message.channel.send(`🎵 Enqueuing \`${track.title}.\``);
        if (!player.playing) player.play();
      });
    }
  }
}
