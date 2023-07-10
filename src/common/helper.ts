
import { validationResult } from 'express-validator';
import {Request, Response, NextFunction} from 'express'
import * as HttpStatus from 'http-status'

export const formValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result: any = validationResult(req)
    if (result.errors.length !== 0) {
      return res.status(HttpStatus.BAD_REQUEST)
      .json(result)
    }
    next()
  }

  /**
 * custom error checker
 * @param res
 * @param AppErrorMessage
 * @param httpStatusCode
 *  - optional,
 */
export const ErrorResponse = (res: Response, AppErrorMessage?: any, httpStatusCode: number = HttpStatus.BAD_REQUEST) => {
  return (err: any) => {
    console.log('err @ ErrorResponse', err);
    // check if the error is have a statusCode.
    // ##DEVNOTE: it means the err is AppError
    if (err.statusCode) {
      res.status(httpStatusCode).send({
        success: false,
        errors: [err]
      })
    } else {
      if (Array.isArray(err)) {
        res.status(httpStatusCode).send({
          success: false,
          errors: err
        })
      } else {
        res.status(httpStatusCode).send({
          success: false,
          errors: err.message
        })
      }
    }
  }
}