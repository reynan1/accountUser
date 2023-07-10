import { IGeneralEntityProperties } from "@app/common/interface"

export interface IAccount extends Pick<IGeneralEntityProperties, '_id'> {
  email: {
    value?: string
  }
  businessId: string
  firstName: string|null // firstName of the account
  lastName: string|null // lastname of the account
  avatarUrl?: string|null // avatarURL or ImageUrl of the account, a profile picture
  roleLevel: string|null
  assignedBranches: [{
    branchId: string
    roleLevel: string
  }]
}