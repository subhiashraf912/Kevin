import { Snowflake } from "discord.js";
import VoiceLevelsRanksConfiguration from "../../../utils/types/Data/VoiceLevelsRanksConfiguration";
import BaseManager from "../../Base/BaseManager";
import DiscordClient from "../../Client/Client";

type searchDataType = {
  guildId: Snowflake;
  userId: Snowflake;
};

export default class VoiceLevelRanksManager extends BaseManager<VoiceLevelsRanksConfiguration> {
  constructor(client: DiscordClient) {
    super(client);
  }
  async create(data: VoiceLevelsRanksConfiguration) {
    const configuration =
      await this.client.database.models.voiceLevelRanks.create(data);
    this.cache.set(`${data.guildId}.${data.userId}`, configuration);
    return configuration;
  }
  async update(
    data: VoiceLevelsRanksConfiguration
  ): Promise<VoiceLevelsRanksConfiguration> {
    let configuration =
      await this.client.database.models.voiceLevelRanks.findOneAndUpdate(
        {
          guildId: data.guildId,
          userId: data.userId,
        },
        data,
        { new: true }
      );
    if (!configuration) configuration = await this.create(data);
    this.cache.set(`${data.guildId}.${data.userId}`, configuration);
    return configuration;
  }
  async get(data: searchDataType): Promise<VoiceLevelsRanksConfiguration> {
    const cachedConfiguration = this.cache.get(data.guildId);
    if (cachedConfiguration) return cachedConfiguration;
    else return await this.fetch(data);
  }
  async fetch(data: searchDataType): Promise<VoiceLevelsRanksConfiguration> {
    const { guildId, userId } = data;
    let configuration =
      await this.client.database.models.voiceLevelRanks.findOne(data);
    if (!configuration)
      configuration = await this.create({
        guildId,
        userId,
        joinTime: null,
        voiceTime: 0,
      });
    this.cache.set(`${data.guildId}.${data.userId}`, configuration);
    return configuration;
  }
}
