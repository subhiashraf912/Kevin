import DiscordClient from "../Client/Client";

export default abstract class BaseNonTypedEvent {
  constructor(private name: string) {}

  getName() {
    return this.name;
  }
  abstract run(client: DiscordClient, ...args: any): void;
}
