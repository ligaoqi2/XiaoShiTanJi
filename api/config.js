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
    // 设置允许跨域的源，可以是具体的域名或 '*'
    origin: '*',
    // 允许跨域的 HTTP 方法
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // 设置是否允许发送凭据（例如，跨域的 cookies）
    credentials: true,
    // 设置是否允许在响应头中暴露请求头信息（例如，'X-Requested-With'）
    exposeHeaders: ['X-Requested-With']
  })
)

// 添加处理 OPTIONS 请求的中间件
app.use(async (ctx, next) => {
  if (ctx.method === 'OPTIONS') {
    ctx.status = 200
    ctx.set('Access-Control-Allow-Origin', '*')
    ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
    ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  } else {
    await next()
  }
})

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
