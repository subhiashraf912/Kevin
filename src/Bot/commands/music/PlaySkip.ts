import { Message } from "discord.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class PlaySkipCommand extends BaseCommand {
  constructor() {
    super({
      name: "play-skip",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
      }),
      aliases: ["ps"],
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

    if (res.loadType === "LOAD_FAILED") throw res.exception;
    if (res.loadType === "PLAYLIST_LOADED") {
      res.tracks.forEach((track) => {
        player.queue.add(track);
      });
    } else {
      player.queue.add(res.tracks[0]);
    }

    if (!player.playing) player.play();
    player.stop();
    if (res.playlist)
      return message.reply(
        `🎵 Enqueuing the playlist \`${res.playlist.name}.\``
      );
    else return message.reply(`🎵 Enqueuing \`${res.tracks[0].title}.\``);
  }
}
