import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class PlayCommand extends BaseCommand {
  constructor() {
    super({
      name: "play",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
      }),
      aliases: ["p"],
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
    if (!args.length)
      return message.reply("You need to give me a URL or a search term.");

    const search = args.join(" ");
    let res;

    try {
      res = await client.erela.search(search, message.author);
    } catch (err: any) {
      return message.reply(
        `There was an error while searching: ${err.message}`
      );
    }

    if (res.loadType === "NO_MATCHES")
      return message.reply("There was no tracks found with that query.");
    const player = client.erela.create({
      guild: message.guild?.id!,
      voiceChannel: message.member?.voice.channel.id,
      textChannel: message.channel.id,
      selfDeafen: true,
    });
    if (res.loadType === "LOAD_FAILED") throw res.exception;

    if (player.state !== "CONNECTED") player.connect();
    if (res.loadType === "PLAYLIST_LOADED") {
      res.tracks.forEach((track) => {
        player.queue.add(track);
      });
    } else {
      player.queue.add(res.tracks[0]);
    }

    if (!player.playing) player.play();
    if (res.playlist)
      return message.reply(
        `🎵 Enqueuing the playlist \`${res.playlist.name}.\``
      );
    else return message.reply(`🎵 Enqueuing \`${res.tracks[0].title}.\``);
  }
}
