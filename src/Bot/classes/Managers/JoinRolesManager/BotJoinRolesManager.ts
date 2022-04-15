import { Collection, Role, Snowflake } from "discord.js";
import MemberJoinRolesConfiguration from "../../../utils/types/Data/MemberJoinRolesConfiguration";
import DiscordClient from "../../Client/Client";
import MemberJoinRolesRestOptions from "../../../utils/types/Data/MemberJoinRolesRestOptions";
import UpdateMemberJoinRolesConfigurationOptions from "../../../utils/types/Data/UpdateMemberJoinRolesConfigurationOptions";

class BotJoinRolesManager {
  cache = new Collection<Snowflake, MemberJoinRolesConfiguration>();
  client;
  constructor(client: DiscordClient) {
    this.client = client;
  }

  formatConfiguration(configuration: MemberJoinRolesRestOptions): MemberJoinRolesConfiguration {
    const guild = this.client.guilds.cache.get(configuration.guildId)!;
    const roles: Role[] = [];
    configuration.roles.forEach((r) => {
      if (guild.roles.cache.get(r)) roles.push(guild.roles.cache.get(r)!);
    });
    const config: MemberJoinRolesConfiguration = {
      guild,
      roles,
    };
    return config;
  }

  async create(options: MemberJoinRolesRestOptions): Promise<MemberJoinRolesConfiguration> {
    const configuration = await this.client.database.models.botJoinRoles.create(options);
    const createdData = this.formatConfiguration(configuration);
    this.cache.set(configuration.guildId, createdData);
    return createdData;
  }

  async update(guildId: Snowflake, options: UpdateMemberJoinRolesConfigurationOptions): Promise<MemberJoinRolesConfiguration> {
    let databaseConfiguration = await this.client.database.models.botJoinRoles.findOneAndUpdate(
      {
        guildId,
      },
      options,
      { new: true }
    );
    if (!databaseConfiguration) {
      const newOptions: MemberJoinRolesRestOptions = {
        guildId,
        roles: options.roles,
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
    let configuration = await this.get(guildId);
    if (!configuration) throw new Error("There's no member join roles system set for this server.");
    await this.client.database.models.welcomes.deleteMany({ guildId });
    this.cache.delete(guildId);
  }

  async get(guildId: Snowflake): Promise<MemberJoinRolesConfiguration | undefined> {
    let cachedConfiguration = this.cache.get(guildId);
    if (!cachedConfiguration) {
      const configuration = await this.fetch(guildId);
      cachedConfiguration = configuration;
    }
    return cachedConfiguration;
  }

  async fetch(guildId: Snowflake) {
    let databaseConfiguration = await this.client.database.models.botJoinRoles.findOne({
      guildId,
    });
    if (!databaseConfiguration) return undefined;
    const configuration = this.formatConfiguration(databaseConfiguration);
    this.cache.set(guildId, configuration);
    return configuration;
  }
}

export default BotJoinRolesManager;
