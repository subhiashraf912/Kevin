import DiscordClient from "../Client/Client";

export default abstract class BaseWebSocketEvent {
  name;
  constructor(private eventName: string) {
    this.name = eventName;
  }

  abstract run(client: DiscordClient, ...args: any): any;
}
