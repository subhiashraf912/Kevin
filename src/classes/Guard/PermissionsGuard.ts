import { PermissionString } from "discord.js";
import PermissionsGuardOptions from "../../utils/types/guard/PermissionsGuardOptions";

class PermissionsGuard {
  userPermissions;
  botPermissions;
  constructor(options: PermissionsGuardOptions) {
    this.userPermissions = options.userPermissions;
    this.botPermissions = options.botPermissions;
  }

  checkMemberPermissions(memberPermissions: PermissionString[]) {
    return this.userPermissions.every((permission) =>
      memberPermissions.includes(permission)
    );
  }

  getMissingPermissions(memberPermissions: PermissionString[]) {
    return this.userPermissions.filter(
      (perm) => !memberPermissions.includes(perm)
    );
  }
}

export default PermissionsGuard;
