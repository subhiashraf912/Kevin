import { Node } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";

export default class ReadyEvent extends BaseNonTypedEvent {
  constructor() {
    super("nodeConnect");
  }
  async run(client: DiscordClient, node: Node) {
    console.log(`Connected to the node: ${node.options.identifier}`);
  }
}
