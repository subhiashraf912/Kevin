import {
  Client,
  ClientOptions,
  Collection,
  Message,
  Snowflake,
} from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import BaseCommand from "../Base/BaseCommand";
import ClientUtils from "../Utility/ClientUtils";
import Database from "../Database/Database";
import ClientConfiguration from "./ClientConfigurationsManager";
import InviteTracker from "djs-invite-tracker";
import { io } from "socket.io-client";
import BaseSlashCommand from "../Base/BaseSlashCommand";
import Erela from "../Erela";
const YoutubePoster = require("discord-yt-poster");

export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _slashCommands = new Collection<string, BaseSlashCommand>();
  private _aliases = new Collection<string, string>();
  private _prefix: string = "!";
  private _rendering = false;
  YoutubePoster: any;
  utils = new ClientUtils(this);
  database = new Database(process.env.MONGO_DB!);
  configurations = new ClientConfiguration(this);
  invites = new InviteTracker(this).init();
  messages = new Collection<Snowflake, Message[]>();

  erela;
  wss = io(process.env.WEB_SOCKET!);

  constructor(options: ClientOptions) {
    super(options);
    this.erela = Erela(this);
    this.on(
      "ready",
      (client) =>
        (this.YoutubePoster = YoutubePoster(this, {
          loop_delays_in_min: 1,
        }))
    );
  }

  get commands(): Collection<string, BaseCommand> {
    return this._commands;
  }
  get aliases(): Collection<string, string> {
    return this._aliases;
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

  setRendering() {
    this._rendering = true;
  }
  setNotRendering() {
    this._rendering = false;
  }
  get rendering() {
    return this._rendering;
  }
}
