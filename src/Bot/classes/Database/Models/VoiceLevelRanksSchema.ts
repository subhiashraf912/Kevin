import mongoose from "mongoose";
import VoiceLevelsRanksConfiguration from "../../../utils/types/Data/VoiceLevelsRanksConfiguration";

const VoiceLevelRanksSchema =
  new mongoose.Schema<VoiceLevelsRanksConfiguration>({
    guildId: String,
    joinTime: Number,
    userId: String,
    voiceTime: Number,
  });

export default mongoose.model<VoiceLevelsRanksConfiguration>(
  "VoiceLevelRanks",
  VoiceLevelRanksSchema,
  "VoiceLevelRanks"
);
