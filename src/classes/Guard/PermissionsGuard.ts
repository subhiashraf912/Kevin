import { Permissions, PermissionString } from "discord.js";
import PermissionsGuardOptions from "../../utils/types/guard/PermissionsGuardOptions";

class PermissionsGuard {
  userPermissions;
  botPermissions;
  constructor(options: PermissionsGuardOptions) {
    this.userPermissions = options.userPermissions;
    this.botPermissions = options.botPermissions;
  }

  checkMemberPermissions(memberPermissions: Readonly<Permissions>) {
    const missingPermissions: PermissionString[] = [];
    this.userPermissions.forEach((perm) => {
      if (!memberPermissions.has(perm)) missingPermissions.push(perm);
    });
    return !missingPermissions[0] ? true : false;
  }

  getMissingPermissions(memberPermissions: Readonly<Permissions>) {
    const missingPermissions: PermissionString[] = [];
    this.userPermissions.forEach((perm) => {
      if (!memberPermissions.has(perm)) missingPermissions.push(perm);
    });
    return missingPermissions;
  }

  checkClientPermissions(clientPermissions: Readonly<Permissions>) {
    const missingPermissions: PermissionString[] = [];
    this.botPermissions.forEach((perm) => {
      if (!clientPermissions.has(perm)) missingPermissions.push(perm);
    });
    return !missingPermissions[0] ? true : false;
  }

  getMissingClientPermissions(clientPermissions: Readonly<Permissions>) {
    const missingPermissions: PermissionString[] = [];
    this.botPermissions.forEach((perm) => {
      if (!clientPermissions.has(perm)) missingPermissions.push(perm);
    });
    return missingPermissions;
  }
}

export default PermissionsGuard;
