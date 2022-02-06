import mongoose from "mongoose";
import PrefixesConfiguration from "../../../utils/types/Data/PrefixesConfiguration";

const GuildPrefixesSchema = new mongoose.Schema({
  guildId: String,
  prefix: String,
});

export default mongoose.model<PrefixesConfiguration>(
  "Prefixes",
  GuildPrefixesSchema,
  "Prefixes"
);
