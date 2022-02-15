import mongoose from "mongoose";
import TextLevelsRolesConfiguration from "../../../utils/types/Data/TextLevelRolesConfiguration";

const TextLevelRolesSchema = new mongoose.Schema<TextLevelsRolesConfiguration>({
  guildId: String,
  roles: Array,
});

export default mongoose.model<TextLevelsRolesConfiguration>(
  "TextLevelRoles",
  TextLevelRolesSchema,
  "TextLevelRoles"
);
