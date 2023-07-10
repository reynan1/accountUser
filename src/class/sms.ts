import SmsModel from '../models/sms'
import SMS from '../utils/sms'
import { INewSms } from '../interfaces/collections'
import {createId} from '../utils/createId'
import Branch from './branch'
import {
  MULTISYS_TXTBOX_API_AUTH,
  MULTISYS_TXTBOX_GO_MANILA_API_KEY,
  MULTISYS_TXTBOX_PRIMEWATER_API_KEY,
  GO_MANILA_BRANCHES_ID,
  PRIMEWATER_BRANCHES_ID
} from '../utils/constants'
interface ISMSCountFilter {
  branchId?: string
  categoryIds?: string[]
  queueGroupIds?: string[]
}
interface ISMSDateFilterQuery {
  startDate: number
  endDate: number
}
export default class Sms {
  // types
  // private sms: sms

  constructor() {
    // this.sms = new sms()
  }
  /**
   * send SMS
   */
  public sendSms(branchId: string, data: INewSms) {
    return new Promise(async (resolve, reject) => {
      const currentDate = Date.now()
      let newSms = new SmsModel(createId({
        branchId,
        name: data.name,
        categoryId: data.categoryId,
        queueGroupId: data.queueGroupId,
        queueId: data.queueId,
        body: data.body,
        createdAt: currentDate,
        updatedAt: currentDate,

        businessId: data.businessId,
        serviceId: data.serviceId,
        windowId: data.windowId,
      }))

      // * remove phone numbers with more than (n) of zeroes ex: 9000000000
      const getNumberOfZeros = (phoneNumber: string) => (phoneNumber.split("").filter((number) => number === '0')).length;
      data.recipients = data.recipients.filter((recipient) => getNumberOfZeros(recipient) < 3);

      if (!data.recipients.length) resolve(true);
    
      const sms = new SMS(this.getAPIKey(branchId))
      const smsResposnses = await Promise.all(data.recipients.map(async (recipient) => {
        try {
          newSms.recipient = recipient
          await sms.send(recipient, data.body)
          // ** DEV NOTE ** get cost from textbox response when success
          newSms.cost = 1
          newSms.wasSent = true
          await newSms.save()
        }
        catch (error) {
          console.log('error :>> ', error);
        }
        return newSms
      })
      )
      return resolve(smsResposnses)
    })
  }

  /**
   * get sms by filter
   */
  public getSmsByfilter(branchId: string, span: {dFrom: number, dTo: number}) {
    return new Promise((resolve, reject) => {
      let filter = Object.assign(
        {branchId},
        span.dFrom && span.dTo ? {createdAt: {$gte: span.dFrom, $lte: span.dTo}} : {}
      )
      SmsModel.find(filter)
      .sort({createdAt: -1})
      .then((sms) => {
        resolve(sms)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }

  /**
   * get sms Count
   */
  public smsCount(branchId: string, filters: ISMSCountFilter & ISMSDateFilterQuery) {
    return new Promise(async (resolve, reject) => {
      const {startDate, endDate, queueGroupIds, categoryIds} = filters
      let costEquivalent: number = 0
      // if the data will be served for web-admin, skip the try and catch block
      if (branchId) {
        try {
          // @ts-ignore
          const branchSettings = (await new Branch(branchId).getBranchInfo()) as any
          costEquivalent = branchSettings?.billing?.SMSRate || 0
        }
        catch (error) {
          console.log('error :>> ', error);
          // return 0
          // return reject({error: "cannot get branch settings info"})
        }
      }
      let filter = Object.assign(
        {
          createdAt: {
            $gte: startDate,
            $lte: endDate
          }
        },
        branchId ? {branchId}: {},
        categoryIds && categoryIds.length >= 1 ? {categoryId: {$in: categoryIds}} : {},
        queueGroupIds && queueGroupIds.length >= 1 ? {queueGroupId: {$in: queueGroupIds}} : {},
      )
      SmsModel.find(filter)
      .then((sms) => {
        let counts = sms.reduce((acc, elem) => {
          if (elem.wasSent) {
            acc.successSms += 1
          }
          else {
            acc.failedSms += 1
          }
          acc.totalValue += (elem.cost * costEquivalent)
          return acc
        },
        Object.assign(
          { 
            failedSms: 0,
            successSms: 0,
            totalValue: 0
          },
          branchId ? {branchId}: {},
        ))
        counts.totalValue = parseFloat(counts.totalValue.toFixed(1))
        if (categoryIds) {
          // @ts-ignore
          counts['categoryId'] = categoryIds
        }
        // @ts-ignore
        counts['costEquivalent'] = costEquivalent
        return resolve(counts)
      })
      .catch((error) => {
        console.log(error)
        reject(error)
      })
    })
  }
  /**
   * check if there's any custom txt box api sett
   * @param branchId 
   */
  public getAPIKey (branchId: string) {
    let txtboxSMSAPI = MULTISYS_TXTBOX_API_AUTH
    if (GO_MANILA_BRANCHES_ID.includes(branchId)) {
      txtboxSMSAPI = MULTISYS_TXTBOX_GO_MANILA_API_KEY
    } else if (PRIMEWATER_BRANCHES_ID.includes(branchId)) {
      txtboxSMSAPI = MULTISYS_TXTBOX_PRIMEWATER_API_KEY
    }
    return txtboxSMSAPI
  }
}