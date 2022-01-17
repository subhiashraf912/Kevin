import { PermissionString } from "discord.js";

interface PermissionsGuardOptions {
  botPermissions: PermissionString[];
  userPermissions: PermissionString[];
}

export default PermissionsGuardOptions;
