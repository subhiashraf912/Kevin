import { Collection, GuildTextBasedChannel, Snowflake } from "discord.js";
import WelcomesConfiguration from "../../utils/types/Data/WelcomesConfiguration";
import WelcomeChannelsRestOptions from "../../utils/types/Data/WelcomeChannelsRestOptions";
import DiscordClient from "../Client/Client";
import UpdateWelcomesConfigurationOptions from "../../utils/types/Data/UpdateWelcomesConfigurationOptions";

class WelcomesManager {
  cache = new Collection<Snowflake, WelcomesConfiguration>();
  client;
  constructor(client: DiscordClient) {
    this.client = client;
  }

  formatConfiguration(
    configuration: WelcomeChannelsRestOptions
  ): WelcomesConfiguration {
    const guild = this.client.guilds.cache.get(configuration.guildId)!;
    const channel = guild.channels.cache.get(
      configuration.channelId
    ) as GuildTextBasedChannel;
    const message = configuration.message;
    const config: WelcomesConfiguration = {
      guild,
      channel,
      message,
    };
    return config;
  }

  async create(
    options: WelcomeChannelsRestOptions
  ): Promise<WelcomesConfiguration> {
    const configuration = await this.client.database.models.welcomes.create(
      options
    );
    const createdData = this.formatConfiguration(configuration);
    this.cache.set(configuration.guildId, createdData);
    return createdData;
  }

  async update(
    guildId: Snowflake,
    options: UpdateWelcomesConfigurationOptions
  ): Promise<WelcomesConfiguration> {
    let databaseConfiguration =
      await this.client.database.models.welcomes.findOneAndUpdate(
        {
          guildId,
        },
        options,
        { new: true }
      );
    if (!databaseConfiguration) {
      const newOptions: WelcomeChannelsRestOptions = {
        guildId,
        message: options.message!,
        channelId: options.channelId!,
      };
      const configuration = await this.create(newOptions);
      return configuration;
    } else {
      const configuration = this.formatConfiguration(databaseConfiguration);
      this.cache.set(guildId, configuration);
      return configuration;
    }
  }

  async delete(guildId: Snowflake) {
    let configuration = this.get(guildId);
    if (!configuration) configuration = await this.fetch(guildId);
    if (!configuration)
      throw new Error("There's no welcome system set for this server.");
    await this.client.database.models.welcomes.deleteMany({ guildId });
    this.cache.delete(guildId);
  }

  get(guildId: Snowflake): WelcomesConfiguration | undefined {
    const cachedConfiguration = this.cache.get(guildId);
    return cachedConfiguration;
  }

  async fetch(guildId: Snowflake) {
    let databaseConfiguration =
      await this.client.database.models.welcomes.findOne({
        guildId,
      });
    if (!databaseConfiguration) return undefined;
    const configuration = this.formatConfiguration(databaseConfiguration);
    this.cache.set(guildId, configuration);
    return configuration;
  }
}

export default WelcomesManager;
