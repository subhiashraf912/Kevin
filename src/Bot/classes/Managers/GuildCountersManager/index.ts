import { Collection, Snowflake, VoiceChannel } from "discord.js";
import GuildCountersConfiguration, {
  GuildCounter,
} from "../../../utils/types/Data/GuildCountersConfiguration";
import GuildCountersRestConfiguration from "../../../utils/types/Data/GuildCountersRestConfiguration";
import DiscordClient from "../../Client/Client";

class GuildCountersManager {
  cache = new Collection<Snowflake, GuildCountersConfiguration>();
  client;
  constructor(client: DiscordClient) {
    this.client = client;
  }

  formatConfiguration(
    configuration: GuildCountersRestConfiguration
  ): GuildCountersConfiguration {
    const guild = this.client.guilds.cache.get(configuration.guildId)!;

    const botsChannel = guild.channels.cache.get(
      configuration.botsCounter.channelId!
    ) as VoiceChannel;
    const channelsChannel = guild.channels.cache.get(
      configuration.channelsCounter.channelId!
    ) as VoiceChannel;
    const membersChannel = guild.channels.cache.get(
      configuration.membersCounter.channelId!
    ) as VoiceChannel;
    const rolesChannel = guild.channels.cache.get(
      configuration.rolesCounter.channelId!
    ) as VoiceChannel;
    const botsCounter: GuildCounter = {
      channel: botsChannel,
      text: configuration.botsCounter.text,
    };
    const channelsCounter: GuildCounter = {
      channel: channelsChannel,
      text: configuration.channelsCounter.text,
    };
    const membersCounter: GuildCounter = {
      channel: membersChannel,
      text: configuration.membersCounter.text,
    };
    const rolesCounter: GuildCounter = {
      channel: rolesChannel,
      text: configuration.rolesCounter.text,
    };
    const config: GuildCountersConfiguration = {
      guild,
      botsCounter,
      channelsCounter,
      membersCounter,
      rolesCounter,
    };
    return config;
  }

  async create(
    options: GuildCountersRestConfiguration
  ): Promise<GuildCountersConfiguration> {
    const configuration =
      await this.client.database.models.guildCounters.create(options);
    const createdData = this.formatConfiguration(configuration);
    this.cache.set(configuration.guildId, createdData);
    return createdData;
  }

  async update(
    guildId: Snowflake,
    options: GuildCountersRestConfiguration
  ): Promise<GuildCountersConfiguration> {
    let databaseConfiguration =
      await this.client.database.models.guildCounters.findOneAndUpdate(
        {
          guildId,
        },
        options,
        { new: true }
      );
    if (!databaseConfiguration) {
      const newOptions: GuildCountersRestConfiguration = {
        guildId,
        botsCounter: { channelId: null, text: null },
        channelsCounter: { channelId: null, text: null },
        membersCounter: { channelId: null, text: null },
        rolesCounter: { channelId: null, text: null },
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
      throw new Error("There's no guild counters system set for this server.");
    await this.client.database.models.guildCounters.deleteMany({ guildId });
    this.cache.delete(guildId);
  }

  get(guildId: Snowflake): GuildCountersConfiguration | undefined {
    const cachedConfiguration = this.cache.get(guildId);
    return cachedConfiguration;
  }

  async fetch(guildId: Snowflake) {
    let databaseConfiguration =
      await this.client.database.models.guildCounters.findOne({
        guildId,
      });
    if (!databaseConfiguration) return undefined;
    const configuration = this.formatConfiguration(databaseConfiguration);
    this.cache.set(guildId, configuration);
    return configuration;
  }
}

export default GuildCountersManager;
