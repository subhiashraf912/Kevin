import mongoose from "mongoose";
import WelcomeChannelsRestOptions from "../../../utils/types/Data/WelcomeChannelsRestOptions";

const GuildWelcomesSchema = new mongoose.Schema({
  guildId: String,
  channelId: String,
  message: {
    type: String,
    required: false,
    default:
      "Welcome {member-ping} to {server-name}! Make sure to follow the rules",
  },
});

export default mongoose.model<WelcomeChannelsRestOptions>(
  "Welcomes",
  GuildWelcomesSchema,
  "Welcomes"
);
