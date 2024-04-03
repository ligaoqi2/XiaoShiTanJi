const { https, router, db, app } = require('./config.js')
const { koaBody } = require('koa-body')
const XLSX = require('xlsx')

app.use(
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      maxFileSize: 2000 * 1024 * 1024 // 设置上传文件大小限制
    }
  })
)

module.exports = () => {
  router.post('/newExcelFile', async (ctx) => {
    const file = ctx.request.files.file // 获取上传的文件，假设前端表单的 name 为 "file"
    if (!file) {
      ctx.throw(400, 'No file uploaded.')
      return
    }
    await db.query(`DELETE FROM excel_data;`)

    const workbook = XLSX.readFile(file.path)
    const sheet_name_list = workbook.SheetNames
    sheet_name_list.forEach(async (sheetName) => {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      let date = jsonData[1][4]
      let value = []
      jsonData.map((item, index) => {
        if (index > 2) {
          value.push(
            `(${index}, '${item[1]}', '${item[2]}', '${item[3]}', '${item[4]}', '${date}', '${item[0]}')`
          )
        }
      })
      let sql = `INSERT INTO users (id, name, specification, unit, price, date, row_num)  VALUES ${value.join(
        ','
      )};`
      db.query(sql)
    })
    ctx.body = {
      message: '上传成功'
    }
  })

  router.get('/getLineDate', async (ctx) => {
    const keyword = ctx.request.body.keyword
    const res = await db.query(
      `select * from excel_data where name LIKE '%${keyword}%'`
    )
    ctx.body = {
      status: 200,
      messgage: 'success',
      result: res.results
    }
  })
}
