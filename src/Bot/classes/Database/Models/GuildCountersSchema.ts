import mongoose from "mongoose";
import GuildCountersRestConfiguration from "../../../utils/types/Data/GuildCountersRestConfiguration";

const GuildCountersSchema = new mongoose.Schema<GuildCountersRestConfiguration>(
  {
    guildId: String,
    botsCounter: Object,
    channelsCounter: Object,
    membersCounter: Object,
    rolesCounter: Object,
  }
);

export default mongoose.model<GuildCountersRestConfiguration>(
  "GuildCounters",
  GuildCountersSchema,
  "GuildCounters"
);
