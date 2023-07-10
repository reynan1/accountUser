export enum VALIDATION_STATUSES {
  VERIFIED = 1,
  UNVERIFIED = 2,
  IGNORED = 3
}
export const ValidateUserPermissions = (branchSettings: any, roleGroup: any, permissions: number[]) => {
  const validateAccountPermissions = (accountAssignedPermissions: number[], allowedPermissions: number[]) => {
    return allowedPermissions.some(permission => accountAssignedPermissions.includes(permission))
  }
  if (branchSettings && branchSettings.userRoleStatus) {
    if (roleGroup) {
      if (validateAccountPermissions(roleGroup.queueGroupPermissions, permissions) || validateAccountPermissions(roleGroup.queueManagementPermissions, permissions)) {
        return VALIDATION_STATUSES.VERIFIED
      }
    }
    return VALIDATION_STATUSES.UNVERIFIED
  }
  return VALIDATION_STATUSES.IGNORED
}