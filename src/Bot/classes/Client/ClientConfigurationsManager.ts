import { JoinRolesManager, PrefixesManager, TextLevelsManager, VoiceLevelsManager, WelcomesManager } from "../Managers";
import DiscordClient from "./Client";

class ClientConfiguration {
  private client: DiscordClient;
  prefixes;
  welcomes;
  voiceLevels;
  textLevels;
  joinRoles;
  constructor(client: DiscordClient) {
    this.client = client;
    this.prefixes = new PrefixesManager(this.client);
    this.welcomes = new WelcomesManager(this.client);
    this.voiceLevels = new VoiceLevelsManager(this.client);
    this.textLevels = new TextLevelsManager(this.client);
    this.joinRoles = new JoinRolesManager(this.client);
  }
}

export default ClientConfiguration;
