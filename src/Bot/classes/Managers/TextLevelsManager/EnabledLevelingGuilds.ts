import { Snowflake } from "discord.js";
import EnabledLevelingGuildsSchemaConfiguration from "../../../utils/types/Data/TextLevelingGuildsSettingsConfiguration";
import BaseManager from "../../Base/BaseManager";
import DiscordClient from "../../Client/Client";

export default class EnabledLevelingGuildsManager extends BaseManager<EnabledLevelingGuildsSchemaConfiguration> {
  constructor(client: DiscordClient) {
    super(client);
  }
  async create(data: EnabledLevelingGuildsSchemaConfiguration) {
    const configuration =
      await this.client.database.models.enabledLevelingGuilds.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async update(data: EnabledLevelingGuildsSchemaConfiguration) {
    let configuration =
      await this.client.database.models.enabledLevelingGuilds.findOneAndUpdate(
        {
          guildId: data.guildId,
        },
        data,
        { new: true }
      );
    if (!configuration) configuration = await this.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async get(
    guildId: Snowflake
  ): Promise<EnabledLevelingGuildsSchemaConfiguration> {
    const cachedConfiguration = this.cache.get(guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(guildId);
  }
  async fetch(guildId: Snowflake) {
    let configuration =
      await this.client.database.models.enabledLevelingGuilds.findOne({
        guildId,
      });
    if (!configuration)
      configuration = await this.create({
        guildId,
        enabled: true,
        maxXpPerMessage: 30,
        minXpPerMessage: 15,
      });
    this.cache.set(guildId, configuration);
    return configuration;
  }
}
