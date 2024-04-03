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

app.use(async (ctx, next) => {
  // 设置CORS响应头
  ctx.set('Access-Control-Allow-Origin', '*') // 允许任何源访问
  ctx.set('Access-Control-Allow-Methods', 'GET, POST, PUT') // 允许的HTTP方法
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Authorization') // 允许的HTTP头
  ctx.set('Access-Control-Allow-Credentials', true) // 是否允许发送cookie

  // 继续处理请求
  await next()
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
