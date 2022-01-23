import PermissionsGuard from "../../../classes/Guard/PermissionsGuard";
import CommandCategory from "./CommandCategories";

interface CommandOptions {
  name: string;
  aliases?: string[];
  category: CommandCategory;
  permissions?: PermissionsGuard;
  description?: string;
  usage?: string;
}

export default CommandOptions;
