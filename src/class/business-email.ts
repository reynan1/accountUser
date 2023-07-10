import Email from '../utils/email'
import Branch from './branch'
import { BUSINESS_EMAIL } from '../utils/constants'
interface IBusinessType {
  emailType: number
  fileName: string
  title: string
}
interface ISuspendContent {
  branchName: string
  partnerName: string
  changedDate: string
}
export default class BusinessEmail extends Email {
  private branchId: string
  private emailType: number
  constructor (branchId: string, businessEmail: IBusinessType) {
    super(businessEmail.fileName)
    this.branchId = branchId
    this.emailType = businessEmail.emailType
  }
  /**
   * get custom email images on branch settings
   */
  public loadBranchCustomVariables () {
    return new Branch(this.branchId)
      .getBranchCustomEmailImages()
      .then((customEmailVariables) => {
        const customVariables = customEmailVariables.reduce((object, customVariable) => {
          object[customVariable.fieldName] = customVariable.value
          return object
        }, {})
        console.log('customVariables :>> ', customVariables);
        return this.setCustomVariables(customVariables)
      })
  }
  /**
   * get the content for suspend/unsuspend levels
   * @param data 
   */
  public setSuspendEmailContent (data: ISuspendContent) {
    const {branchName, partnerName, changedDate} = data
    const getContent = () => {
      switch (this.emailType) {
        case BUSINESS_EMAIL.PARTNER_SUSPEND.type:
          return {
            suspendTitle: 'Business has been suspended',
            suspendBody: `We would like to inform you that ${partnerName} (All Branches) has been suspended as of today, ${changedDate}. Please contact your administrator if you believe there is something wrong.`
          }
        case BUSINESS_EMAIL.PARTNER_UNSUSPEND.type:
          return {
            suspendTitle: 'Business has been unsuspended',
            suspendBody: `We would like to inform you that ${partnerName} (All Branches) has been unsuspended as of today, ${changedDate}. You may now access the business portal by clicking the button below.`
          }
        case BUSINESS_EMAIL.BRANCH_SUSPEND.type:
          return {
            suspendTitle: 'Your Branch has been suspended',
            suspendBody: `We would like to inform you that ${partnerName} ${branchName} has been suspended as of today, ${changedDate}. Please contact your administrator if you believe there is something wrong.`
          }
        case BUSINESS_EMAIL.BRANCH_UNSUSPEND.type:
          return {
            suspendTitle: 'Your Branch has been unsuspended',
            suspendBody: `We would like to inform you that ${partnerName} ${branchName} has been unsuspended as of today, ${changedDate}. You may now access the business portal by clicking the button below.`
          }
        case BUSINESS_EMAIL.ACCOUNT_SUSPEND.type:
          return {
            suspendTitle: 'Your account has been suspended',
            suspendBody: `We would like to inform you that your account has been suspended as of today, ${changedDate}. Please contact your administrator if you believe there is something wrong.`
          }
        case BUSINESS_EMAIL.ACCOUNT_UNSUSPEND.type:
          return {
            suspendTitle: 'Your account has been unsuspended',
            suspendBody: `We would like to inform you that your account has been unsuspended as of today, ${changedDate}. You may now access the business portal by clicking the button below.`
          }
        default:
          return {}
      }
    }
    return this.setCustomVariables(getContent())
  }
}