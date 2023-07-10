import Http from 'axios'
const SERVICE_HOST = `http://${process.env.QUEUE_SERVICE_HOST}`
class QueueGroup {
  public getAssigned (branchId: string, userId: string) {
    return Http({
      method: 'GET',
      url: `${SERVICE_HOST}/queue-groups/${branchId}/accounts/assigned?accountId=${userId}`,
      headers: {
        ContentType: 'application/json'
      }
    }).then((response: any) => {
      const {data, status = '', statusText = ''} = response
      return data
    })
  }
  public getAssignedQueueGroupByUser (branchId: string, userId: string): Promise<string[]> {
    return this.getAssigned(branchId, userId)
      .then((queueGroups: any[]) => queueGroups.map((n) => n.queueGroupId))
  }
}
export default QueueGroup