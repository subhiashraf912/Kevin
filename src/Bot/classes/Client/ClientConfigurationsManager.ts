import PrefixesManager from "../Managers/PrefixesManager";
import TextLevelsManager from "../Managers/TextLevelsManager";
import EnabledLevelingGuildsManager from "../Managers/TextLevelsManager/EnabledLevelingGuilds";
import VoiceLevelsManager from "../Managers/VoiceLevelsManager";
import WelcomesManager from "../WelcomesManager";
import DiscordClient from "./Client";

class ClientConfiguration {
  private client: DiscordClient;
  prefixes;
  welcomes;
  voiceLevels;
  textLevels;
  enabledLevelingGuilds;
  constructor(client: DiscordClient) {
    this.client = client;
    this.prefixes = new PrefixesManager(this.client);
    this.welcomes = new WelcomesManager(this.client);
    this.voiceLevels = new VoiceLevelsManager(this.client);
    this.textLevels = new TextLevelsManager(this.client);
    this.enabledLevelingGuilds = new EnabledLevelingGuildsManager(this.client);
  }
}

export default ClientConfiguration;
