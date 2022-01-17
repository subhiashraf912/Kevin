import { Client, ClientOptions, Collection } from "discord.js";
import BaseEvent from "../Base/BaseEvent";
import BaseCommand from "../Base/BaseCommand";
import ClientUtils from "../Utility/ClientUtils";
import Database from "../Database/Database";
import ClientConfiguration from "./ClientConfigurationsManager";

export default class DiscordClient extends Client {
  private _commands = new Collection<string, BaseCommand>();
  private _events = new Collection<string, BaseEvent>();
  private _prefix: string = "!";
  utils = new ClientUtils();
  database = new Database(process.env.MONGO_DB!);
  configurations = new ClientConfiguration();
  constructor(options: ClientOptions) {
    super(options);
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
}
