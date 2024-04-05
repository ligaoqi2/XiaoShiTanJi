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
        if (index > 2 && item.length) {
          value.push(
            `(${id++}, '${item[1]}', '${
              item[2] === undefined ? '' : item[2]
            }', '${item[3]}', '${item[item.length - 1]}', '${date}', '${
              item[0] ? item[0] : 0
            }')`
          )
          if (item[0] === undefined) {
            console.log(sheetName, item, index, jsonData)
          }
        }
      })
      let sql = `INSERT INTO excel_data (id, name, specification, unit, price, date, row_num)  VALUES ${value.join(
        ','
      )};`
      const res = await db.query(sql)
    })
    ctx.body = {
      message: '上传成功'
    }
  })

  router.get('/getLineDate', async (ctx) => {
    const keyword = ctx.query.keyword
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
