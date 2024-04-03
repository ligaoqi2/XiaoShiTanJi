const fs = require('fs')
const Koa = require('koa')
var Router = require('koa-router')
const db = require('./database')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const path = require('path')

const https = require('https')
const sslify = require('koa-sslify').default

const homeDir = process.env.HOME || process.env.USERPROFILE

const options = {
  key: fs.readFileSync(path.join(homeDir, 'ssl/www.xtr327.com.key')),
  cert: fs.readFileSync(path.join(homeDir, 'ssl/www.xtr327.com.pem'))
}

const app = new Koa()
app.use(
  cors({
    origin: '*',
    credentials: true,
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    allowMethods: ['OPTIONS', 'GET', 'PUT', 'POST', 'DELETE'],
    allowHeaders: [
      'x-requested-with',
      'accept',
      'origin',
      'content-type',
      'Referer',
      'Sec-Ch-Ua',
      'Sec-Ch-Ua-Mobile',
      'Sec-Ch-Ua-Platform',
      'User-Agent'
    ],
    maxAge: 1728000
  })
)

app.use(sslify())

https.createServer(options, app.callback()).listen(3000, (err) => {
  if (err) {
    console.log('服务启动出错', err)
  } else {
    console.log('运行在' + 3000 + '端口')
  }
})

var router = new Router()

router.prefix('/api')
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

module.exports = {
  https,
  router,
  db,
  app
}
