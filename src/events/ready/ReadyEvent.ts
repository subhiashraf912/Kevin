import BaseEvent from "../../classes/Base/BaseEvent";
import DiscordClient from "../../classes/Client/Client";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    super("ready");
  }
  async run(client: DiscordClient) {
    console.log("Bot has logged in.");
  }
}
