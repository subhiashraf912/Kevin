import { Snowflake } from "discord.js";
import BaseManager from "../../Base/BaseManager";
import DiscordClient from "../../Client/Client";

class PrefixesManager extends BaseManager<string> {
  constructor(client: DiscordClient) {
    super(client);
  }
  async create(guildId: Snowflake, prefix: string) {
    const configuration = await this.client.database.models.prefixes.create({
      guildId,
      prefix,
    });
    this.cache.set(guildId, configuration.prefix);
    return configuration;
  }
  async update(guildId: Snowflake, prefix: string) {
    let configuration =
      await this.client.database.models.prefixes.findOneAndUpdate(
        {
          guildId,
        },
        { prefix },
        { new: true }
      );
    if (!configuration) configuration = await this.create(guildId, prefix);
    this.cache.set(guildId, configuration.prefix);
    return configuration.prefix;
  }
  async get(guildId: Snowflake): Promise<string> {
    const cachedConfiguration = this.cache.get(guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(guildId);
  }
  async fetch(guildId: Snowflake) {
    let configuration = await this.client.database.models.prefixes.findOne({
      guildId,
    });
    if (!configuration)
      configuration = await this.create(guildId, this.client.prefix);
    this.cache.set(guildId, configuration.prefix);
    return configuration.prefix;
  }
}

export default PrefixesManager;
