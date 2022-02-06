import { Node } from "erela.js";
import BaseNonTypedEvent from "../../classes/Base/BaseNonTypedEvent";
import DiscordClient from "../../classes/Client/Client";

export default class ReadyEvent extends BaseNonTypedEvent {
  constructor() {
    super("nodeError");
  }
  async run(client: DiscordClient, node: Node, error: Error) {
    console.log(
      `Node ${node.options.identifier} had an error: ${error.message}`
    );
  }
}
