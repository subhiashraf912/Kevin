import mongoose from "mongoose";
import MenuRoles from "../../../utils/types/API/MenuRoles";
const Schema = new mongoose.Schema({
  guildId: String,
  roles: Array,
  menuCustomId: String,
});

export default mongoose.model<MenuRoles>("menu-roles", Schema);
