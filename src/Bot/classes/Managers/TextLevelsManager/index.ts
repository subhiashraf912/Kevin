import DiscordClient from "../../Client/Client";
import TextLevelsHandler from "./Handler";
import TextLevelChannelsManager from "./LevelChannels";
import TextLevelRanksManager from "./Ranks";
import TextLevelRolesManager from "./Roles";

export default class TextLevelsManager {
  client;
  channels;
  ranks;
  roles;
  handler;
  constructor(client: DiscordClient) {
    this.client = client;
    this.channels = new TextLevelChannelsManager(this.client);
    this.ranks = new TextLevelRanksManager(this.client);
    this.roles = new TextLevelRolesManager(this.client);
    this.handler = new TextLevelsHandler(this.client);
  }
}
