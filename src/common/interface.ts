import { Request } from 'express'
import moment, { Moment, MomentInput } from 'moment'
// import prettyMilliseconds from 'pretty-ms'
export interface uploadFiles {
  fieldName: string
  originalFilename: string
  path: string
  headers: object
  type: string
  fileName?: string
  size: number
}
export type IMoment = (dnp?: MomentInput, strict?: boolean)  => Moment
// export type IPrettyMS = (milliseconds: number, options?: prettyMilliseconds.Options)  => string
export interface UploadedImage {
  avatarUrl?: string
  fileName?: string
  imageUrl?: string
}
export interface IRequest extends Request {
  files?: any
  payload?: any
  fingerprint?: IFingerprint
  user?: any
}
export interface IFingerprint {
  hash: string
  // components: any
}
export interface IGeneralEntityProperties {
  readonly _id?: any
  readonly createdAt: number
  readonly updatedAt: number
}
export interface IGeneralEntityDependencies {
  generateId: () => string
}
export interface IGeneralServiceDependencies<T> {
  repositoryGateway: T
}
export interface RequestToken extends Request {
  accessToken?: string
  authPayload?: any
  payload?: any
  photo?: uploadFiles | uploadFiles[]
  images?: uploadFiles | uploadFiles[]
}

export type IBlobUploader = (fileLocation: string, file: any) => Promise<string>

export interface IUploadFiles {
  fieldName: string
  originalFilename: string
  path: string
  size: number
  name: string
  type: string
}
export interface IBlobS3 {
  upload: (fileLocation: string, file: any) => Promise<string>
  remove: (fileLocation: string) => Promise<any>
}
export interface IPaginationQueryParams {
  limit?: number
  offset?: number
  sort?: string
  fields?: string
  search?: string
}
export interface IEnumExtractor {
  values(enumInput: any): any[]
  keys(enumInput: any): string[]
}

export interface IUrlShortenerOptions {
  metaTags: {
    title: string
    imageURL: string
    desc: string
  }
}
export interface IUrlShortener {
  generate(url: string, options?: IUrlShortenerOptions): Promise<string>
}
export type IDateRangeGenerator = (startDate: number, endDate: number) => {start: number, end: number}
export interface IDateFilterQuery {
  startDate?: number
  endDate?: number
}
export interface HMS {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export type IConvertMillisToDHMS = (milliseconds: number) => HMS 

export type IArrayElementChecker = (value: any, modules: any[])  => boolean

export type IDailyDateRange = (startDate: number, endDate: number)  => { date: string, start: number, end: number, dayInNumber: number }[]

export type IHourlyRange = (startDate: number, endDate: number)  => { start: number, end: number, time: string }[]