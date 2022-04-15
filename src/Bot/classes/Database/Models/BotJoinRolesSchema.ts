import mongoose from "mongoose";
import MemberJoinRolesRestOptions from "../../../utils/types/Data/MemberJoinRolesRestOptions";

const BotJoinRolesSchema = new mongoose.Schema({
  guildId: String,
  roles: Array,
});

export default mongoose.model<MemberJoinRolesRestOptions>("BotJoinRolesSchema", BotJoinRolesSchema, "BotJoinRolesSchema");
