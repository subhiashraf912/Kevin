import { Snowflake } from "discord.js";
import { isArray } from "util";
import TextLevelsRanksConfiguration from "../../../utils/types/Data/TextLevelsRanksConfiguration";
import BaseManager from "../../Base/BaseManager";
import DiscordClient from "../../Client/Client";

type searchDataType = {
  guildId: Snowflake;
  userId?: Snowflake;
};

export default class TextLevelRanksManager extends BaseManager<TextLevelsRanksConfiguration> {
  constructor(client: DiscordClient) {
    super(client);
  }
  async create(data: TextLevelsRanksConfiguration) {
    const configuration =
      await this.client.database.models.textLevelRanks.create(data);
    this.cache.set(`${data.guildId}.${data.userId}`, configuration);
    return configuration;
  }
  async update(
    data: TextLevelsRanksConfiguration
  ): Promise<TextLevelsRanksConfiguration> {
    let configuration =
      await this.client.database.models.textLevelRanks.findOneAndUpdate(
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
  async get(data: searchDataType): Promise<TextLevelsRanksConfiguration> {
    const cachedConfiguration = this.cache.get(
      `${data.guildId}.${data.userId}`
    );
    if (cachedConfiguration) return cachedConfiguration;
    else return (await this.fetch(data)) as TextLevelsRanksConfiguration;
  }
  async fetch(
    data: searchDataType
  ): Promise<TextLevelsRanksConfiguration | TextLevelsRanksConfiguration[]> {
    const { guildId, userId } = data;
    let configuration:
      | TextLevelsRanksConfiguration
      | TextLevelsRanksConfiguration[]
      | null;
    if (userId)
      configuration = await this.client.database.models.textLevelRanks.findOne(
        data
      );
    else
      configuration = await this.client.database.models.textLevelRanks.find(
        data
      );
    if (!configuration)
      configuration = await this.create({
        guildId,
        userId: userId!,
        lastMessage: Date.now(),
        level: 0,
        xp: 0,
        rankBackground: null,
      });
    if (isArray(configuration))
      configuration.forEach((el) => {
        this.cache.set(`${el.guildId}.${el.userId}`, el);
      });
    else this.cache.set(`${data.guildId}.${data.userId}`, configuration);
    return configuration;
  }
}
