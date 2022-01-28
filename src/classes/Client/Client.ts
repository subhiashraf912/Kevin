import { Client, ClientOptions, Collection } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import BaseCommand from "../Base/BaseCommand";
import ClientUtils from "../Utility/ClientUtils";
import Database from "../Database/Database";
import ClientConfiguration from "./ClientConfigurationsManager";
import DisTube from "distube";
import InviteTracker from "djs-invite-tracker";
import { DisTubeEvents } from "distube";
import { io } from "socket.io-client";
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
  wss = io(process.env.WEB_SOCKET!);

  constructor(options: ClientOptions) {
    super(options);
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
