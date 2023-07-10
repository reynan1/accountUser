
export enum ACCOUNT_ROLES {
  SUPER_ADMIN = 0,
  ADMIN = 1,
  MANAGER = 4,
  USER = 5
}

export enum QUEUE_MANAGEMENT_PERMISSIONS {
  VIEW = 1,
  MANAGE = 2,
}
export enum QUEUE_HISTORY_PERMISSIONS {
  VIEW = 1,
  DOWNLOAD = 2,
}
export enum QUEUE_GROUP_PERMISSIONS {
  VIEW_GROUP_MANAGEMENT = 1,
  ADD_CATEGORY_AND_QUEUE_GROUPS = 2,
  UPDATE_CATEGORY_AND_QUEUE_GROUPS = 3,
  SUSPEND_CATEGORY_AND_QUEUE_GROUPS = 4,
  VIEW_QUEUE_AVAILABILITY = 5,
  UPDATE_QUEUE_AVAILABILITY = 6,
  ASSIGN_TO_ALL_QUEUE_GROUPS = 7,
}
