import { IGeneralEntityProperties } from '@app/common/interface'
import http from 'axios'

export interface IBranch extends IGeneralEntityProperties {
  businessId: string
  name: string
  business: IBusiness
}

export interface IBusiness extends IGeneralEntityProperties {
  name: string
  industry: {
    _id: string
    type: INDUSTRY_TYPES
  }
}
export enum INDUSTRY_TYPES {
  UTILITIES = 'utilities',
  RETAIL = 'retail',
  HEALTHCARE = 'healthcare',
  BANKING_AND_FINANCE = 'banking-and-finance',
  FOOD_AND_BEVERAGE = 'food-and-beverage',
  OTHERS = 'others',
}
export class BusinessServiceAPI {
  private readonly serviceBaseUrl = `http://${process.env.BUSINESS_SERVICE_HOST}`;

  /**
   * 
   * @param branchId 
   * @returns 
   */
  public async branchDetailsById (branchId:string) : Promise<IBranch> {
    try {
      const { data } = await http.get<{ success: boolean, data: any }>(`${this.serviceBaseUrl}/branches/${branchId}`);
      return data.success ? data.data : null;
    } catch (error: any) {
      console.log('error @ branchDetailsById', error.response.data.errors);
      throw new Error(error.response.data.errors[0]?.message);
    }
  }
}