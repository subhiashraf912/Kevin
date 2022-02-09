import mongoose from "mongoose";
import VoiceLevelsRolesConfiguration from "../../../utils/types/Data/VoiceLevelRolesConfiguration";

const VoiceLevelRolesSchema =
  new mongoose.Schema<VoiceLevelsRolesConfiguration>({
    guildId: String,
    roles: {
      type: Object,
      default: {},
    },
  });

export default mongoose.model<VoiceLevelsRolesConfiguration>(
  "VoiceLevelRoles",
  VoiceLevelRolesSchema,
  "VoiceLevelRoles"
);
