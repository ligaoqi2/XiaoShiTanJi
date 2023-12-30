import request from '@/api/request';

export const login = (data) => {
  return request({ method: 'post', url: `api/login`, data });
};

export const parse = (data) => {
  return request({ method: 'post', url: `api/contract-parse`, data });
};

export const getList = (url, data) => {
  return request({
    method: 'get',
    url: url,
    params: data
  });
};

export const postData = (url, data) => {
  return request({
    method: 'post',
    url: url,
    data
  });
};
