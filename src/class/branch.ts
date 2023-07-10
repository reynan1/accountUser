import axios from 'axios'
export default class Branch {
  // types
  private urlPrefix: string
  private branchId: string
  constructor(branchId: string) {
    this.branchId = branchId
    this.urlPrefix = `http://${process.env.BRANCH_SERVICE_HOST}/${this.branchId}`
  }

  /**
   * get branch Info
   */
  public getBranchInfo(branchId: string) {
    return new Promise((resolve, reject) => {
      axios.get(this.urlPrefix)
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error.response.data)
      })
    })
  }

  /**
   * get branch Info
   */
  public getBranchSettings() {
    return axios.get(`${this.urlPrefix}/settings`)
      .then((response) => {
        const {data} = response
        if (!data) {
          throw new Error('no branch settings found.')
        }
        return data
      })
      .catch((error) => {
        throw error.response.data;
      });
  }
  /**
   * get branch custom email images
   */
  public getBranchCustomEmailImages(): Promise<any[]> {
    return this.getBranchSettings()
      .then((data) => {
        return data.customEmailVariables
      })
  }
  /**
   * get branch custom email images
   */
  public getBranchCustomSMSAPIKey(): Promise<string|null> {
    return this.getBranchSettings()
      .then((data) => {
        return data.customEmailVariables
      })
  }
}