import { Collection, Snowflake } from "discord.js";
import PrefixesManager from "../PrefixesManager";
import DiscordClient from "./Client";

class ClientConfiguration {
  client: DiscordClient;
  prefixes;
  constructor(client: DiscordClient) {
    this.client = client;
    this.prefixes = new PrefixesManager(this.client);
  }
  logs = new Collection<Snowflake, any>();
}

export default ClientConfiguration;
