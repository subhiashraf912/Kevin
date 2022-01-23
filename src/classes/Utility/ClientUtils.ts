import { PermissionString } from "discord.js";
import DiscordClient from "../Client/Client";
import WelcomeCardGenerator from "./WelcomeCardGenerator";

class ClientUtils {
  client;
  constructor(client: DiscordClient) {
    this.client = client;
  }
  WelcomeCardGenerator = WelcomeCardGenerator;
  formatString(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  formatPermission(perm: PermissionString) {
    const str = perm.replaceAll("_", " ").toLowerCase();
    return this.formatString(str);
  }
}

export default ClientUtils;
