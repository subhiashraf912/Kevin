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
class Models {
  prefixes = PrefixesConfiguration;
  welcomes = WelcomeChannelsConfiguration;
  menuRoles = MenuRolesSchema;
  voiceLevelChannels = VoiceLevelChannelsSchema;
  voiceLevelRanks = VoiceLevelRanksSchema;
  voiceLevelRoles = VoiceLevelRolesSchema;
  textLevelChannels = TextLevelChannelsSchema;
  textLevelRanks = TextLevelRanksSchema;
  textLevelRoles = TextLevelRolesSchema;
  enabledLevelingGuilds = EnabledLevelingGuildsSchema;
}

export default Models;
