import { Snowflake } from "discord.js";
import TextLevelsChannelsConfiguration from "../../../utils/types/Data/TextLevelsChannelsConfiguration";
import BaseManager from "../../Base/BaseManager";
import DiscordClient from "../../Client/Client";

export default class TextLevelChannelsManager extends BaseManager<TextLevelsChannelsConfiguration> {
  constructor(client: DiscordClient) {
    super(client);
  }
  async create(data: TextLevelsChannelsConfiguration) {
    const configuration =
      await this.client.database.models.textLevelChannels.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async update(data: TextLevelsChannelsConfiguration) {
    let configuration =
      await this.client.database.models.textLevelChannels.findOneAndUpdate(
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
  async get(guildId: Snowflake): Promise<TextLevelsChannelsConfiguration> {
    const cachedConfiguration = this.cache.get(guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(guildId);
  }
  async fetch(guildId: Snowflake) {
    let configuration =
      await this.client.database.models.textLevelChannels.findOne({
        guildId,
      });
    if (!configuration)
      configuration = await this.create({ guildId, channels: [] });
    this.cache.set(guildId, configuration);
    return configuration;
  }
}
