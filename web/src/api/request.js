import axios from 'axios';
import { ElMessage } from 'element-plus';

const appName = import.meta.env.VITE_API_BASE;
export const getToken = () => {
  return localStorage.getItem(`${appName}-token`);
};

const API_BASE = import.meta.env.VITE_API_BASE;

const request = axios.create({
  baseURL: API_BASE,
  timeout: 100000
});

request.interceptors.request.use(
  (config) => {
    const accessToken = getToken();
    config.headers['Authorization'] = `Bearer ${accessToken}`;
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    /**
     * 全局拦截请求发送后返回的数据
     */
    return response.data;
  },
  (error) => {
    let message = error.message;
    if (error.response && error.response.data && error.response.data.error) {
      message = error.response.data.error;
    }
    ElMessage({
      message,
      type: 'error'
    });
    return Promise.reject(error);
  }
);
export default request;
