import PrefixesManager from "../Managers/PrefixesManager";
import VoiceLevelsManager from "../Managers/VoiceLevelsManager";
import WelcomesManager from "../WelcomesManager";
import DiscordClient from "./Client";

class ClientConfiguration {
  private client: DiscordClient;
  prefixes;
  welcomes;
  voiceLevels;
  constructor(client: DiscordClient) {
    this.client = client;
    this.prefixes = new PrefixesManager(this.client);
    this.welcomes = new WelcomesManager(this.client);
    this.voiceLevels = new VoiceLevelsManager(this.client);
  }
}

export default ClientConfiguration;
