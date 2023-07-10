/**
 * imports
 */
// Modules/Libs/Frameworks
import express from 'express'
import morgan from 'morgan'
import bodyParser from 'body-parser'
const apiMetrics = require('prometheus-api-metrics');

// Types
import { Application, Request, Response, NextFunction } from "express"

// import {
//   redisClient
// } from '@app/configs/redis'
import {
  Database
} from '@app/configs/database'
import {
  MainRoute
} from '@app/configs/routes'
/**
 * Wrapper Class
 */
class Main {
   // type declarations
   private app: Application
   private port: string | number | any

   constructor() {
     this.app = express()
     this.port = process.env.PORT || 3000
     this.appConfig()
   }
   // listen to port
   public listen() {
    const server = this.app.listen(this.port, (): void => {
      console.log(`*** Server is listening on port ${this.port}`)
    })
  }
  // initialize server configurations
  private appConfig() {
    this.app.use(morgan("dev"))
    this.app.use(
      express.json({
        // check if request.body has valid JSON object
        verify: (request: Request, response: Response, buf: any) => {
          try {
            JSON.parse(buf)
          } catch (e) {
            response
              .status(400)
              .json({ error: "request body has invalid JSON object" })
            throw Error("invalid JSON")
          }
        }
      })
    )
    // restrict headers contents and methods
    this.app.use((request: Request, response: Response, next: NextFunction) => {
      response.setHeader("Access-Control-Allow-Origin", "*")
      response.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Authorization, Content-Type, Accept"
      )
      response.setHeader("Access-Control-Allow-Credentials", "true")
      if (request.method === "OPTIONS") {
        response.header(
          "Access-Control-Allow-Methods",
          "GET, POST, PUT, PATCH, DELETE, OPTIONS"
        )
        return response.sendStatus(200)
      }
      next()
    })
    this.app.use(apiMetrics());
    this.app.use(express.urlencoded({ extended: false }))
    new Database().connect()
    // this.loadRedisConfig()
    this.app.use(new MainRoute().expose())
  }
}


// create server instance
const main = new Main()
main.listen()
