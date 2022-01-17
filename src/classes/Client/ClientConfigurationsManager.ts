import { Collection, Snowflake } from "discord.js";

class ClientConfiguration {
  prefixes = new Collection<Snowflake, string>();
  logs = new Collection<Snowflake, any>();
}

export default ClientConfiguration;
