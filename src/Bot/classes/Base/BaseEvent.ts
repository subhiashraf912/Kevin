import { ClientEvents } from "discord.js";
import DiscordClient from "../Client/Client";

export default abstract class BaseEvent {
  constructor(private name: keyof ClientEvents) {}

  getName() {
    return this.name;
  }
  abstract run(client: DiscordClient, ...args: any): void;
}
