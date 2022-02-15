import mongoose from "mongoose";
import TextLevelsRanksConfiguration from "../../../utils/types/Data/TextLevelsRanksConfiguration";

const TextLevelRanksSchema = new mongoose.Schema<TextLevelsRanksConfiguration>({
  guildId: String,
  userId: String,
  level: Number,
  xp: Number,
  lastMessage: Number,
  rankBackground: String,
});

export default mongoose.model<TextLevelsRanksConfiguration>(
  "TextLevelRanks",
  TextLevelRanksSchema,
  "TextLevelRanks"
);
