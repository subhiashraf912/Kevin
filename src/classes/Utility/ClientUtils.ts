import { PermissionString } from "discord.js";

class ClientUtils {
  formatString(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  formatPermission(perm: PermissionString) {
    const str = perm.replaceAll("_", " ").toLowerCase();
    return this.formatString(str);
  }
}

export default ClientUtils;
