import mongoose from "mongoose";
import ButtonRolesConfiguration from "../../../utils/types/Data/ButtonRolesConfiguration";

const reqString = {
  type: String,
  required: true,
};

const schema = new mongoose.Schema<ButtonRolesConfiguration>({
  guildId: reqString,
  channelId: reqString,
  messageId: reqString,
});

const name = "button-roles";

export default mongoose.model<ButtonRolesConfiguration>(name, schema, name);
