import mongoose from "mongoose";
import VoiceLevelsChannelsConfiguration from "../../../utils/types/Data/VoiceLevelsChannelsConfiguration";

const VoiceLevelChannelsSchema =
  new mongoose.Schema<VoiceLevelsChannelsConfiguration>({
    guildId: String,
    channels: {
      type: Array,
      default: [] as string[],
    },
  });

export default mongoose.model<VoiceLevelsChannelsConfiguration>(
  "VoiceLevelChannels",
  VoiceLevelChannelsSchema,
  "VoiceLevelChannels"
);
