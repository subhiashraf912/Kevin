import PrefixesManager from "../PrefixesManager";
import WelcomesManager from "../WelcomesManager";
import DiscordClient from "./Client";

class ClientConfiguration {
  private client: DiscordClient;
  prefixes;
  welcomes;
  constructor(client: DiscordClient) {
    this.client = client;
    this.prefixes = new PrefixesManager(this.client);
    this.welcomes = new WelcomesManager(this.client);
  }
}

export default ClientConfiguration;
