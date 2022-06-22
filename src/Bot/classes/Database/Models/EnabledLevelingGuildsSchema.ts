import mongoose from "mongoose";
import LevelingGuildsSettingsSchemaConfiguration from "../../../utils/types/Data/TextLevelingGuildsSettingsConfiguration";

const LevelingGuildsSettingsSchema =
  new mongoose.Schema<LevelingGuildsSettingsSchemaConfiguration>({
    guildId: String,
    enabled: {
      type: Boolean,
      default: false,
    },
    maxXpPerMessage: {
      type: Number,
      default: 30,
    },
    minXpPerMessage: {
      type: Number,
      default: 15,
    },
  });

export default mongoose.model<LevelingGuildsSettingsSchemaConfiguration>(
  "LevelingGuildsSettingsSchemaConfiguration",
  LevelingGuildsSettingsSchema,
  "LevelingGuildsSettingsSchemaConfiguration"
);
