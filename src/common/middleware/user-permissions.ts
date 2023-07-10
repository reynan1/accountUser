import {Request, Response, NextFunction} from 'express'
import * as HttpStatus from 'http-status-codes'
import { ACCOUNT_ROLES, QUEUE_GROUP_PERMISSIONS, QUEUE_MANAGEMENT_PERMISSIONS } from '../enums';
import {ValidateUserPermissions, VALIDATION_STATUSES} from '../user-permission-handler'

export const validateUserPermissionsMiddleware = (permissions: QUEUE_GROUP_PERMISSIONS|QUEUE_MANAGEMENT_PERMISSIONS|(QUEUE_MANAGEMENT_PERMISSIONS|QUEUE_GROUP_PERMISSIONS)[], responseError: boolean = true) => {
// export const validateUserPermissionsMiddleware = (permissions: QUEUE_GROUP_PERMISSIONS|QUEUE_GROUP_PERMISSIONS[]|QUEUE_MANAGEMENT_PERMISSIONS|QUEUE_MANAGEMENT_PERMISSIONS[], responseError: boolean = true) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // @ts-expect-error
      if (req.user) {
        const _permissions = Array.isArray(permissions) ? permissions : [permissions]
      // @ts-expect-error
        const {branchSettings, roleGroup, isAdmin = false, isDefault = false, roleLevel = 1} = req.user
        // console.log('branchSettings :>> ', branchSettings);
        // console.log('roleGroup :>> ', roleGroup);
        // console.log('isAdmin :>> ', isAdmin);
        if (roleLevel === ACCOUNT_ROLES.ADMIN || !roleGroup || isDefault) {
          // check if user who requested is admin or from web admin acct
        // @ts-expect-error
          req.user.roleLevel = 1
          next()
          return
        }
        const status = ValidateUserPermissions(branchSettings, roleGroup, _permissions)
        if (status === VALIDATION_STATUSES.VERIFIED) {
        // if (status === VALIDATION_STATUSES.VERIFIED && roleLevel === ACCOUNT_ROLES.ADMIN) {
        // @ts-expect-error
          req.user.roleLevel = 1
        } else if (status === VALIDATION_STATUSES.UNVERIFIED && responseError) {
          res.status(HttpStatus.FORBIDDEN).send({
            error: 'UNPERMMITED_REQUEST',
            status: 100000
          })
          return
        }
      }
      next()
      return
    } catch (err) {
      console.log('@failed to verify user permission :>> ', err);
      throw err
    }
  }
}