import { Message, GuildTextBasedChannel } from "discord.js";
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
        botPermissions: [],
      }),
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    if (!args[0]) return message.reply("Enter a song, dumbass!!");
    const song = args.join(" ");
    const voiceChannel = message.member?.voice.channel;
    const member = message.member || undefined;
    if (!voiceChannel)
      return message.reply("You need to be in a voice channel.");
    const textChannel = message.channel as GuildTextBasedChannel;

    // Note: This example only works for retrieving tracks using a query, such as "Rick Astley - Never Gonna Give You Up".

    // Retrieves tracks with your query and the requester of the tracks.
    // Note: This retrieves tracks from youtube by default, to get from other sources you must enable them in application.yml and provide a link for the source.
    // Note: If you want to "search" for tracks you must provide an object with a "query" property being the query to use, and "source" being one of "youtube", "soundcloud".
    const res = await client.erela.search(
      message.content.slice(6),
      message.author
    );

    // Create a new player. This will return the player if it already exists.
    const player = client.erela.create({
      guild: message.guild?.id!,
      voiceChannel: voiceChannel.id,
      textChannel: textChannel.id,
    });

    // Connect to the voice channel.
    player.connect();

    // Adds the first track to the queue.
    player.queue.add(res.tracks[0]);
    message.channel.send(`Enqueuing track ${res.tracks[0].title}.`);

    // Plays the player (plays the first track in the queue).
    // The if statement is needed else it will play the current track again
    if (!player.playing && !player.paused && !player.queue.size) player.play();

    // For playlists you'll have to use slightly different if statement
    if (
      !player.playing &&
      !player.paused &&
      player.queue.totalSize === res.tracks.length
    )
      player.play();
  }
}
