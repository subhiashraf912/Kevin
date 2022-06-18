import PrefixesConfiguration from "./PrefixesConfiguration";
import WelcomeChannelsConfiguration from "./WelcomeChannelsConfiguration";
import MenuRolesSchema from "./MenuRolesSchema";
import VoiceLevelChannelsSchema from "./VoiceLevelChannelsSchema";
import VoiceLevelRanksSchema from "./VoiceLevelRanksSchema";
import VoiceLevelRolesSchema from "./VoiceLevelRolesSchema";
import TextLevelRolesSchema from "./TextLevelRolesSchema";
import TextLevelRanksSchema from "./TextLevelRanksSchema";
import TextLevelChannelsSchema from "./TextLevelChannelsSchema";
import EnabledLevelingGuildsSchema from "./EnabledLevelingGuildsSchema";
import MemberJoinRolesSchema from "./MemberJoinRolesSchema";
import BotJoinRolesSchema from "./BotJoinRolesSchema";
import ButtonRolesSchema from "./ButtonRolesSchema";
import GuildCountersSchema from "./GuildCountersSchema";
class Models {
  prefixes = PrefixesConfiguration;
  welcomes = WelcomeChannelsConfiguration;
  menuRoles = MenuRolesSchema;
  buttonRoles = ButtonRolesSchema;
  voiceLevelChannels = VoiceLevelChannelsSchema;
  voiceLevelRanks = VoiceLevelRanksSchema;
  voiceLevelRoles = VoiceLevelRolesSchema;
  textLevelChannels = TextLevelChannelsSchema;
  textLevelRanks = TextLevelRanksSchema;
  textLevelRoles = TextLevelRolesSchema;
  enabledLevelingGuilds = EnabledLevelingGuildsSchema;
  memberJoinRoles = MemberJoinRolesSchema;
  botJoinRoles = BotJoinRolesSchema;
  guildCounters = GuildCountersSchema;
}

export default Models;
