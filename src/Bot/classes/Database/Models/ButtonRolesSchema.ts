import mongoose from "mongoose";
import ButtonRoles from "../../../utils/types/API/ButtonRoles";
const Schema = new mongoose.Schema<ButtonRoles>({
  guildId: String,
  roles: Array,
  buttonRolesCustomId: String,
  maxRoles: Number,
  requiredRole: String,
});

export default mongoose.model<ButtonRoles>("button-roles", Schema);
