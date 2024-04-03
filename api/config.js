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
    origin: '*', // 在生产环境中替换为具体的源地址
    allowMethods: ['GET', 'POST', 'OPTIONS'], // 允许的方法，包括文件上传的 POST 方法
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'Origin',
      'Accept',
      'X-Requested-With'
    ], // 允许的头部，包括 Content-Type
    credentials: true, // 如果需要发送 cookie，设置为 true
    maxAge: 86400 // 预检请求的缓存时间（单位：秒）
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
