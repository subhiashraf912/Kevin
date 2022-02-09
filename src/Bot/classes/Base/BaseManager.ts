import { Collection, Snowflake } from "discord.js";
import DiscordClient from "../Client/Client";

export default abstract class BaseManager<T> {
  cache = new Collection<Snowflake, T>();
  client;
  constructor(client: DiscordClient) {
    this.client = client;
  }
}
