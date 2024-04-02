const { https, router, db, app } = require('./config.js')
const file = require('./file.js')
const excel = require('./getExcel.js')
file()
excel()

router.get('/get', async (ctx) => {
  ctx.body = '返回响应数据'
})
