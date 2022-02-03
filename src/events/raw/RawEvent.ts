import BaseEvent from "../../classes/Base/BaseEvent";
import DiscordClient from "../../classes/Client/Client";

export default class ReadyEvent extends BaseEvent {
  constructor() {
    //@ts-ignore
    super("raw");
  }
  async run(client: DiscordClient, data: any) {
    client.erela.updateVoiceState(data);
  }
}
