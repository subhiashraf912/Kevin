import { Snowflake } from "discord.js";
import VoiceLevelsChannelsConfiguration from "../../../utils/types/Data/VoiceLevelsChannelsConfiguration";
import BaseManager from "../../Base/BaseManager";
import DiscordClient from "../../Client/Client";

export default class VoiceLevelChannelsManager extends BaseManager<VoiceLevelsChannelsConfiguration> {
  constructor(client: DiscordClient) {
    super(client);
  }
  async create(data: VoiceLevelsChannelsConfiguration) {
    const configuration =
      await this.client.database.models.voiceLevelChannels.create(data);
    this.cache.set(data.guildId, configuration);
    return configuration;
  }
  async update(data: VoiceLevelsChannelsConfiguration) {
    let configuration =
      await this.client.database.models.voiceLevelChannels.findOneAndUpdate(
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
  async get(guildId: Snowflake): Promise<VoiceLevelsChannelsConfiguration> {
    const cachedConfiguration = this.cache.get(guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(guildId);
  }
  async fetch(guildId: Snowflake) {
    let configuration =
      await this.client.database.models.voiceLevelChannels.findOne({
        guildId,
      });
    if (!configuration)
      configuration = await this.create({ guildId, channels: [] });
    this.cache.set(guildId, configuration);
    return configuration;
  }
}
