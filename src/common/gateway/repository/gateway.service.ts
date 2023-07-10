// import {
//   Document, Model
// } from '../index'
import { Document, Model } from 'mongoose'
import { v4 as uuid } from 'uuid'
import { IQueryOptionParams } from '.'
import {
  IAggregatePagination,
  IPaginationQueryParams,
  IGeneralRepositoryGateway,
  IRespositoryGatewayConditionQuery
} from './gateway.interfaces'

export abstract class GeneralGatewayService<T extends Document, K> implements IGeneralRepositoryGateway<T, K> {
  // db instance
  protected collectionModel: Model<T>
  /**
   *
   * @param DB
   */
  constructor(DB: Model<T>) {
    this.collectionModel = DB
  }
  /**
   * get list
   * @param query 
   * @param queryParams 
   */
  public async list (
    query?: IRespositoryGatewayConditionQuery<K>,
    queryParams: IPaginationQueryParams<K> = {}
  ) {
    const {
      limit = 10,
      offset = 0,
      sort = 'createdAt:asc',
      search = '',
      searchFields = [],
      fields = null
    } = queryParams

    const matches = searchFields.map((field) => ({[field]: {
      $regex: new RegExp(search, 'gi')
    }}))

    const projections = fields ? fields.split(',').reduce((projection: any, fieldName) => ({
      ...projection,
      [fieldName]: 1
    }), {}) : null

    const documentQuery = this.collectionModel.find({
      $and: [
        query,
        {
          $or: matches
        }
      ]
    } as any,
      projections,
      {
        lean: true
      }
    )
    .sort(this.generateSortFields(sort));
    
    if (limit >= 1) {
      documentQuery.limit(+limit)
    }
    if (offset >= 0) {
      documentQuery.skip(+offset)
    }

    return await documentQuery;
  }
  /**
   * by data by id
   * @param id
   */
  public async findById(id: string) {
    try {
      const document = await this.collectionModel
        .findById(id)
      return document
    } catch (error) {
      throw error
    }
  }
  /**
   * by data by id
   * @param id
   */
  public async findOne(
    query: IRespositoryGatewayConditionQuery<K>,
    queryOptionParams?: IQueryOptionParams<K> 
  ) {
    const {
      sort = 'createdAt:asc',
      fields = ''
    } = queryOptionParams || {};

    const document = this.collectionModel.findOne(query as any)
    const sortFields = this.generateSortFields(sort)
    document.sort(sortFields)
    if (fields) {
      const projections = fields.split(",").reduce((project, field) => ({...project, [field.trim()]: 1}), {})
      document.projection(projections)
    }
    const node = await document.lean()
    return node as K|null;
  }

  /**
   * @param search ex: { branchId: value, name: value }
   */
  public async findByProperty(search: Partial<Record<keyof K, any>>) {
    const query = {} as any

    for (const key in search) {
      if (key === 'branchId') {
        query[key] = search[key]
      } else {
        query[key] = { $regex: new RegExp(search[key], 'gi') }
      }
    }

    try {
      const document = await this.collectionModel.findOne(query)
      if (!document) {
        throw new Error('No document found.')
      }
      return document
    } catch (error) {
      throw error
    }
  }
  /**
   * insert data
   * @param data
   */
  public async insertOne(data: K) {
    const newDocument = await this.initialize(data).save()
    return newDocument
  }
  
  /**
   * insert bulk/mutiple data
   * @param data
   */
  public insertMany(data: K[]) {
    return Promise.all(data.map(elem => this.insertOne(elem)))
  }
  /**
   * initialize object
   * @param data
   */
  public initialize(data: K) {
    return new this.collectionModel({
      _id: uuid(),
      createdAt: Date.now(),
      updatedat: 0,
      ...data,
    })
  }
  /**
   *
   * @param id
   * @param data
   */
  public async updateById(id: string, data: Partial<K>) {
    try {
      // @ts-expect-error
      delete data._id
      // @ts-expect-error
      delete data.id
      // @ts-expect-error
      delete data.createdAt
      const document = await this.findById(id)
      if (document) {
        document.set(data)
        document.save()
        return JSON.parse(JSON.stringify(document))
      }
      return null
    } catch (err) {
      throw err
    }
  }
  /**
   * update multiple/many documents
   * @param query
   * @param data
   */
  //  public updateMany(query: Record<keyof K, any>, data: K) {
  //   return this.collectionModel.updateMany(
  //     query as any,
  //     {
  //       $set: data,
  //     } as any
  //   )
  //   .then((response) => {
  //     return true
  //   })
  // }
  /**
   * update single document
   * @param query
   * @param data
   */
  public async updateOne(
    query: IRespositoryGatewayConditionQuery<K>,
    data: Partial<K>
  ): Promise<K|null>{
    try {
      const document = await this.collectionModel.findOne(query as any)
      if (document) {
        document.set(data)
        await document.save()
        return JSON.parse(JSON.stringify(document))
      }
      return document
    } catch (error) {
      throw error
    }
  }
  /**
   * 
   * @param id 
   * @returns 
   */
  public async removeById(id: string) {
    // @ts-ignore
    return this.removeOne({
      _id: id
    })
  }
  /**
   * remove one
   * @param query 
   * @returns 
   */
  public removeOne(query: IRespositoryGatewayConditionQuery<K>) {
    return this.collectionModel.findOne(query as any).then(document => {
      if (document) {
        document.remove()
      }
      return document ? JSON.parse(JSON.stringify(document)) : null
    })
  }
  /**
   * 
   * @param query 
   * @returns 
   */
  public async remove(query: IRespositoryGatewayConditionQuery<K>) {
    await this.collectionModel.remove(query as any)
    return true
  }
  /**
   * get document counts
   * @param query 
   * @returns 
   */
  public async count(query: IRespositoryGatewayConditionQuery<K>) {
    const count = await this.collectionModel
      .find(query as any)
      .countDocuments()
    return count
  }
  /**
   *
   * @param pipeline a pipeline query for aggregation on mongodb
   * @param queryParams for filtering, like limitTo, startAt, sortby etc..
   * @param searchFields2 array of fields that needed to be search or to filter,
   * a function that return a pagination data.
   */
  public aggregateWithPagination (
    pipeline: any[],
    queryParams: IPaginationQueryParams<K>
  ): Promise<IAggregatePagination<K>> {
    let {
      fields = {},
      limit = 0,
      offset = 0,
      search = '',
      searchFields = [],
      sort = ''
    } = queryParams || {}
    limit = +limit
    offset = +offset

    const sortFields = this.generateSortFields(sort);
    
    const firstPipeline = [
      {
        $sort: sortFields,
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ] as any[]
    // if limitTO is equal to = 0, will remove the $limit on the pipeline
    if (limit === 0) {
      const ind = firstPipeline.findIndex(
        stage => Object.keys(stage)[0] === '$limit'
      )
      if (ind >= 0) {
        // remove ethe $limit on the pipeline.
        firstPipeline.splice(ind, 1)
      }
    }

    const searchFilters = searchFields.map((field: string) => ({
        [field]: {
          $regex: new RegExp(search, 'gi'),
        },
      })
    )
    const paginationQuery = pipeline.concat([
      {
        $match: searchFilters.length >= 1 ? {
            $or: searchFilters,
          } : {},
      },
      {
        $facet: {
          data: firstPipeline,
          totalPages: [
            {
              $group: {
                _id: null,
                counts: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
      {
        $unwind: {
          preserveNullAndEmptyArrays: false,
          path: '$totalPages',
        },
      },
      {
        $project: {
          _id: 0,
          data: 1,
          counts: '$totalPages.counts',
        },
      },
    ])
    return this.collectionModel.aggregate(paginationQuery)
      .then((response: any) => {
        return response.length >= 1 ? this.listToPaginatedList(response[0].data, response[0].counts, queryParams) : {
          data: [],
          total: 0,
          pages: 0,
        }
      })
  }
  /**
   * 
   * @param pipeline 
   * @param paginationQuery 
   */
  public aggregate (
    pipeline: any[],
    paginationQuery?: Partial<IPaginationQueryParams<K>>
  ): Promise<any[]> {
    const {
      limit = 10,
      offset = 0,
      searchFields = [],
      search = '',
      sort = 'createdAt:asc',
    } = paginationQuery || {}
    const cursor = this.collectionModel.aggregate(pipeline as any)
    if (searchFields.length >= 1) {
      cursor.match({$or: this.generateSearchFields(search, searchFields)})
    }
    const sortOption = sort.split(',').reduce((sortObject, s) => {
      const sortValue = s.split(':')
      return {
        ...sortObject,
        [sortValue[0]]: sortValue[1] === 'asc' ? 1 : -1
      }
    },{})
    if (Object.keys(sortOption).length >= 1) {
      cursor.sort(sortOption)
    }
    cursor.skip(+offset)
    cursor.limit(+limit)
    return cursor.exec()
  }
  /**
   * transform list to paginated list
   * @param nodes 
   * @param totalNodes 
   * @param paginationQuery 
   * @returns 
   */
  public listToPaginatedList (nodes: K[], totalNodes: number, paginationQuery?: Partial<IPaginationQueryParams<K>>) {
    const {
      limit = 10
    } = paginationQuery || {}

    return {
      data: nodes,
      total: totalNodes,
      pages: limit >= 1 ? Math.ceil(totalNodes / limit) : 1,
    }
  }
  /**
   * generate search fields condition
   * @param searchText
   * @param searchFields 
   * @returns 
   */
  private generateSearchFields (searchText: string, searchFields: string[]) {
    return searchFields.map((field: string) => ({
        [field]: {
          $regex: new RegExp(searchText, 'gi'),
        },
      })
    )
  }
  /**
   * generate search fields condition
   * @param searchText
   * @param searchFields 
   * @returns 
   */
  private generateSortFields (sort: string) {
    return sort.split(',').reduce((sortFields: any, field) => {
      const sortValue = field.split(':')
      return {
        ...sortFields,
        [sortValue[0]]: sortValue[1] === 'asc' ? 1 : -1
      }
    }, {});
  }
}
