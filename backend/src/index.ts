import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import http from 'http'
import { ReadConfig } from './config'
import connectToDb from './libs/db'
import apiRoutes from './routers/api'
import bodyParser from 'body-parser'
import { createSocketIO } from './utils/socket'


async function main() {
  const config = await ReadConfig()
  await connectToDb(config.database.db_url!)

  const app = express()
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
  app.use(express.json())
  app.use(cookieParser())
  app.disable('x-powered-by')
  app.use(cors())
  apiRoutes(app)
  console.log(`listen on ${config.server.port}`)
  //tk: admin, mk: Admin123

  let server = http.createServer(app)

  createSocketIO(server)

  server.listen(Number(config.server.port), '0.0.0.0', () => {
    const err = arguments[0]
    if (err) {
      console.error(err)
    }
  })
}
main().catch(err => console.error(`Cannot init server!, log: `, err))
