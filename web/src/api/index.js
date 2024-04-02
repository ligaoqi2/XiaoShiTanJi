import request from '@/api/request'

export const getExcelLine = (params) => {
  return request({
    method: 'get',
    url: 'api/getLineDate',
    params
  })
}
