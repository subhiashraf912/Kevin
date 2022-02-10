import {
  Guild,
  GuildTextBasedChannel,
  Message,
  MessageEmbed,
} from "discord.js";
import { Queue } from "erela.js";
import BaseCommand from "../../classes/Base/BaseCommand";
import DiscordClient from "../../classes/Client/Client";
import Player from "../../classes/Erela/Player";
import PermissionsGuard from "../../classes/Guard/PermissionsGuard";

export default class QueueCommand extends BaseCommand {
  constructor() {
    super({
      name: "queue",
      category: "Music",
      permissions: new PermissionsGuard({
        userPermissions: [],
        botPermissions: ["CONNECT", "SPEAK"],
      }),
      aliases: ["q"],
    });
  }

  async run(client: DiscordClient, message: Message, args: Array<string>) {
    const player = client.erela.get(message.guildId!) as Player;
    if (!player) {
      const m = await message.reply(
        "> <:___:936795711259938827> There's nothing currently playing in the server."
      );
      const msgs = client.messages.get(message.id);
      if (msgs) {
        msgs.push(m);
        client.messages.set(message.id, msgs);
      } else {
        client.messages.set(message.id, [m]);
      }
      return;
    }
    if (!message.member?.voice.channel) {
      const m = await message.reply(
        "> <:___:936795711259938827> You need to be in a voice channel."
      );

      const msgs = client.messages.get(message.id);
      if (msgs) {
        msgs.push(m);
        client.messages.set(message.id, msgs);
      } else {
        client.messages.set(message.id, [m]);
      }
      return;
    }
    if (
      message.member.voice.channel.id !== message.guild?.me?.voice.channel?.id
    ) {
      const m = await message.reply(
        "> <:___:936795711259938827> You need to be in the same voice channel as the bot"
      );
      const msgs = client.messages.get(message.id);
      if (msgs) {
        msgs.push(m);
        client.messages.set(message.id, msgs);
      } else {
        client.messages.set(message.id, [m]);
      }
      return;
    }
    const queue = player.queue;
    const embeds = generateQueueEmbeds(queue, message.guild!);
    client.utils.pagination({
      author: message.author,
      channel: message.channel as GuildTextBasedChannel,
      embeds,
      fastSkip: true,
      pageTravel: true,
    });
  }
}

function generateQueueEmbeds(queue: Queue, guild: Guild) {
  const embeds = [];
  let multiple = 10;
  let currentSongCount = 1;
  for (let i = 0; i < queue.size; i += 10) {
    const tracks = queue.slice(i, multiple);
    multiple += 10;
    const embed = new MessageEmbed().setAuthor({
      name: `Queue for ${guild?.name}`,
      iconURL: guild.iconURL({ dynamic: true, size: 4096 }) || "",
    });
    if (queue.current)
      embed.addField(
        "Current",
        `[${queue.current.title}](${queue.current.uri})`
      );
    if (!tracks.length) embed.setDescription(`No tracks in the queue.`);
    else
      embed.setDescription(
        tracks
          .map(
            (track, i) =>
              `${currentSongCount++} - [${track.title}](${track.uri})`
          )
          .join("\n")
      );
    embeds.push(embed);
  }
  return embeds;
}
