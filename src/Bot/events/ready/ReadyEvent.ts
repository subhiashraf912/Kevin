import BaseEvent from "../../classes/Base/BaseEvent";
import DiscordClient from "../../classes/Client/Client";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client: DiscordClient) {
    console.log(`${client.user?.username} has logged in.`);
    client.erela.init(client.user?.id);
    client.user?.setActivity({ name: "!help", type: "WATCHING" });
  }
}
