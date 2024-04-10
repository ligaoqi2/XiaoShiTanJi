const { https, router, db, app } = require('./config.js')
const XLSX = require('xlsx')

const getDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
}

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
              item[0] === undefined ? 0 : item[0]
            }')`
          )
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
    const ip = ctx.request.ip
    const userAgent = ctx.request.get('User-Agent')
    let deviceModel
    if (userAgent.includes('Android')) {
      deviceModel = 'Android'
    } else if (userAgent.includes('Windows')) {
      deviceModel = 'Windows'
    } else if (userAgent.includes('iPhone')) {
      deviceModel = 'iPhone'
    } else {
      deviceModel = userAgent.slice(10, 20)
    }

    db.query(
      `INSERT INTO excel_log (date, deviceModel, ip, keyword)  VALUES ('${getDate()}', '${deviceModel}', '${ip}', '${keyword}');`
    )

    const res = await db.query(
      `select * from excel_data where name LIKE '%${keyword}%';`
    )
    ctx.body = {
      status: 200,
      messgage: 'success',
      result: res.results
    }
  })
}
