import { Client, ClientOptions, Collection, TextChannel } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import BaseCommand from "../Base/BaseCommand";
import ClientUtils from "../Utility/ClientUtils";
import Database from "../Database/Database";
import ClientConfiguration from "./ClientConfigurationsManager";
import DisTube from "distube";
import InviteTracker from "djs-invite-tracker";
import { DisTubeEvents } from "distube";
import { io } from "socket.io-client";
import Erela from "erela.js";

import BaseSlashCommand from "../Base/BaseSlashCommand";

declare module "discord.js" {
  interface ClientEvents extends DisTubeEvents {}
}
export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _slashCommands = new Collection<string, BaseSlashCommand>();
  private _prefix: string = "!";
  utils = new ClientUtils(this);
  database = new Database(process.env.MONGO_DB!);
  configurations = new ClientConfiguration(this);
  distube = new DisTube(this);
  invites = new InviteTracker(this).init();
  erela;
  wss = io(process.env.WEB_SOCKET!);

  constructor(options: ClientOptions) {
    super(options);
    const client = this;
    this.erela = new Erela.Manager({
      nodes: [
        {
          host: "localhost",
          port: 2333,
          password: "youshallnotpass",
        },
      ],
      send(id, payload) {
        const guild = client.guilds.cache.get(id);
        if (guild) guild.shard.send(payload);
      },
    })
      .on("nodeConnect", (node) =>
        console.log(`Node ${node.options.identifier} connected`)
      )
      .on("nodeError", (node, error) =>
        console.log(
          `Node ${node.options.identifier} had an error: ${error.message}`
        )
      )
      .on("trackStart", (player, track) => {
        (
          client.channels.cache.get(player.textChannel || "") as TextChannel
        ).send(`Now playing: ${track.title}`);
      })
      .on("queueEnd", (player) => {
        (
          client.channels.cache.get(player.textChannel || "") as TextChannel
        ).send("Queue has ended.");

        player.destroy();
      });

    this.distube.on("playSong", (q, s) => {
      //@ts-ignore
      this.emit("playSong", q, s);
    });
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  get events(): Collection<string, BaseEvent> {
    return this._events;
  }
  get prefix(): string {
    return this._prefix;
  }

  set prefix(prefix: string) {
    this._prefix = prefix;
  }
  get slashCommands(): Collection<string, BaseSlashCommand> {
    return this._slashCommands;
  }
}
