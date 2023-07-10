// interfaces for
import {Model} from 'mongoose'
export interface IAggregatePagination<T> {
  data: T[]
  pages: number
  total: number
}

export type IAggregatePaginationResponse<T> = IAggregatePagination<T>

export interface IPaginationQueryParams<T> {
  limit?: number
  offset?: number
  sort?: string
  fields?: string|null
  search?: string
  searchFields?: string[]
}
export interface IQueryOptionParams<T> {
  sort?: string // fieldName:sortType(e.g. "_id:asc")
  fields?: string // fieldName/property seperated by commas(e.g. "_id,name,age")
}

type IRepositoryGatewayData<T> = Omit<Partial<T>, '_id' | 'id' | 'createdAt'>

export type IRespositoryGatewayConditionQuery<K> = Parameters<Model<K>['find']>[0]
export interface IGeneralRepositoryGateway<T, K> {
  findByProperty(query: IRespositoryGatewayConditionQuery<K>): Promise<T>
  list(
    query?: IRespositoryGatewayConditionQuery<K>,
    paginationQuery?: IPaginationQueryParams<K>,
  ): Promise<T[]>
  insertOne(data: K): Promise<T>
  insertMany(data: K[]): Promise<T[]>
  findById(id: string): Promise<T|null>
  findOne(
    query: IRespositoryGatewayConditionQuery<K>,
    queryOptions?: IQueryOptionParams<K>,
  ): Promise<K|null>
  updateById(id: string, data: IRepositoryGatewayData<K>): Promise<K|null>
  updateOne(
    query: IRespositoryGatewayConditionQuery<K>,
    data: IRepositoryGatewayData<K>
  ): Promise<K|null>
  // updateMany(
  //   query: IRepositoryGatewayData<T>,
  //   data: IRepositoryGatewayData<T>
  // ): Promise<boolean>
  removeById(id: string): Promise<T|null>
  removeOne(query: IRespositoryGatewayConditionQuery<K>): Promise<K|null>
  remove(query: IRespositoryGatewayConditionQuery<K>): Promise<boolean|null>
  count(query: IRespositoryGatewayConditionQuery<K>): Promise<number>
  aggregate(pipeline: Parameters<Model<K>['aggregate']>[0], paginationOption?: Partial<IPaginationQueryParams<T>>): Promise<any[]>
  listToPaginatedList(nodes: K[], totalNodes: number, paginationQuery?: IPaginationQueryParams<K>): IAggregatePagination<K>
}
export interface IGeneralPaginationListGateway<T> {
  paginationList(
    filterQuery: IPaginationQueryParams<T>
  ): Promise<IAggregatePagination<T>>
}
export interface IGeneralListGateway<T> {
  getList(filterQuery: IPaginationQueryParams<T>): Promise<T[]>
}
