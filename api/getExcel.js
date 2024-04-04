const { https, router, db, app } = require('./config.js')
const XLSX = require('xlsx')

module.exports = () => {
  router.post('/newExcelFile', async (ctx) => {
    const file = ctx.request.files.file // 获取上传的文件，假设前端表单的 name 为 "file"
    if (!file) {
      ctx.throw(400, 'No file uploaded.')
      return
    }
    await db.query(`DELETE FROM excel_data;`)

    const workbook = XLSX.readFile(file.filepath)
    const sheet_name_list = workbook.SheetNames
    sheet_name_list.forEach(async (sheetName) => {
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      let date = jsonData[1][4]
      let value = []
      let id = 0
      jsonData.map(async (item, index) => {
        if (index > 2) {
          value.push(
            `(${id++}, '${item[1]}', '${item[2]}', '${item[3]}', '${
              item[4]
            }', '${date}', '${item[0]}')`
          )
        }
      })
      let sql = `INSERT INTO excel_data (id, name, specification, unit, price, date, row_num)  VALUES ${value.join(
        ','
      )};`
      const res = await db.query(sql)
      console.log(121, res)
    })
    ctx.body = {
      message: '上传成功'
    }
  })

  router.get('/getLineDate', async (ctx) => {
    const keyword = ctx.request.body.keyword
    console.log(1222, ctx.request)
    const res = await db.query(
      `select * from excel_data where name LIKE '%${keyword}%'`
    )
    console.log(12223, res)
    ctx.body = {
      status: 200,
      messgage: 'success',
      result: res.results
    }
  })
}
