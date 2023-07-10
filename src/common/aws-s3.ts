import S3 from 'aws-sdk/clients/s3'
import fs from 'fs'

import { IUploadFiles } from './interface'

export interface uploadFiles {
  fieldName: string
  originalFilename: string
  path: string
  headers: object
  type: string
  fileName?: string
  size: number
}
export class BlobUploader {
  private BucketName: string
  private s3Uploader!: S3
  constructor (bucketName:string = 'general-kyoo-v3-ads') {
    this.BucketName = bucketName
    this.loadConfiguration()
  }
  public loadConfiguration () {
    console.log(" data env access key ::  " + process.env.KYOO_V3_ADS_AWS_ACCESS_KEY_ID + " data ::: " + process.env.KYOO_V3_ADS_AWS_SECRET_KEY_ID )
    this.s3Uploader = new S3({
      accessKeyId: 'AKIAIKZQIJYDBZ3G2DYQ' || '',
      secretAccessKey: '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' || '',
      region: `ap-southeast-1`,
    })
  }
  public setBucketName (bucketName: string) {
    this.BucketName = bucketName
    this.loadConfiguration()
    return this.BucketName
  }
  public upload (filepath: string, avatar: IUploadFiles, ACL: string = 'public-read'): Promise<{imageUrl: string, fileName: string}> {
    console.log()
    const fileLoc = `${filepath}/${avatar.originalFilename}`
    const stream = fs.createReadStream(avatar.path)
    const obj = {
      Bucket: this.BucketName,
      Key: fileLoc,
      Body: stream,
      ContentType: avatar.type,
      ACL
    };

    return this.s3Uploader.upload(obj).promise()
      .then((data) => {
        const { Location: imageUrl = '' } = data;
        return {
          fileName: avatar.originalFilename,
          imageUrl
        };
      })
      .catch((error) =>{
        console.log('err uploading', error);

        fs.unlink(avatar.path, () => {
          return true
        })

        throw error;
      });
  }
  public multiUpload (filepath: string, files: IUploadFiles[], ACL: string = 'public-read') {
    const obj = files.map(image => this.upload(filepath, image, ACL))

    return Promise.all(obj)
  }
  /**
   * fiel location
   * @param file 
   */
  public removeFile(file: string) {
    const params = {Bucket: this.BucketName, Key: file};
    return this.s3Uploader.deleteObject(params).promise()
      .then((data) => {
        console.log('removeFile', data);
        return data;
      })
      .catch((error) =>{
        console.log('err @ removeFile', error);
        throw error;
      });
  }

  public createPreSigned(filename: string, size: number, expiresIn = 60 * 60) {

    const { url, fields } = this.s3Uploader.createPresignedPost({
      Bucket: this.BucketName,
      Expires: expiresIn,
      Fields: {
        key: filename,
        "Content-Type": `image/jpg`
      },
      Conditions: [
        ["content-length-range", 0, size],
      ]
    })

    return {
      url,
      fields: {
        ...fields,
        key: filename,
      }
    }
  }

  public async exists (filename: string) {
    try {
      return !!(await this.s3Uploader.headObject({
        Bucket: this.BucketName,
        Key: filename,
      }).promise())
    } catch (error) {
      return false
    }
  }
  /**
   * 
   * @param filename 
   */
  public async getDownloadUrl (filename: string, ) {
      console.log(filename + " data download filename")
    return (await this.exists(filename)) ? this.s3Uploader.getSignedUrl('getObject', {
      Bucket: this.BucketName,
      Key: filename,
      Expires: 60 * 60 * 40
    }) : null
  }
}
