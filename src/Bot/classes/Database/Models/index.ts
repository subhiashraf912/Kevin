import PrefixesConfiguration from "./PrefixesConfiguration";
import WelcomeChannelsConfiguration from "./WelcomeChannelsConfiguration";
import MenuRolesSchema from "./MenuRolesSchema";
import VoiceLevelChannelsSchema from "./VoiceLevelChannelsSchema";
import VoiceLevelRanksSchema from "./VoiceLevelRanksSchema";
import VoiceLevelRolesSchema from "./VoiceLevelRolesSchema";
class Models {
  prefixes = PrefixesConfiguration;
  welcomes = WelcomeChannelsConfiguration;
  menuRoles = MenuRolesSchema;
  voiceLevelChannels = VoiceLevelChannelsSchema;
  voiceLevelRanks = VoiceLevelRanksSchema;
  voiceLevelRoles = VoiceLevelRolesSchema;
}

export default Models;
