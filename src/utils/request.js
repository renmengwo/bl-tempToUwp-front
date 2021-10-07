import axios from 'axios';
import { MessageBox, Message } from 'element-ui';
import store from '@/store';
import { getToken, getStorage } from '@/utils/auth';
import { showFullScreenLoading, tryHideFullScreenLoading } from '@/utils/loading';
const setting = require('@/settings');
const ENV = process.env.NODE_ENV;
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sentheaders: { 'Content-Type': 'multipart/form-data' }
    // config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    // config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    if (getToken()) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken();
      config.headers['Reg_code'] = getStorage('regcode');
    }
    showFullScreenLoading();
    return config;
  },
  error => {
    // do something with request error
    showFullScreenLoading();
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data;
    const headers = response.headers;
    tryHideFullScreenLoading();
    // 直接下载的时候判断请求头处理下载
    if (headers && (headers['content-type'] === 'application/pdf' || headers['content-type'] === 'application/octet-stream' || headers['content-type'] === 'application/x-msdownload' || headers['content-type'] === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || headers['content-type'] === 'application/vnd.ms-excel')) {
      downloadBlob(response);
      return response; // 是为了后面
    }
    // if the custom code is not 20000, it is judged as an error.
    if (res.code && res.code !== 200) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      return Promise.reject(new Error(res.msg || 'Error'));
    } else {
      return response;
    }
  },
  error => {
    console.log('err' + error); // for debug
    console.log(error.response);
    tryHideFullScreenLoading();
    if (error.response) {
      switch (error.response.status) {
        case 401:
          MessageBox.confirm(`${error.response.data.msg}`, '登录超时', {
            confirmButtonText: '登录',
            type: 'warning'
          }).then(() => {
            store.dispatch('user/resetToken').then(() => {
              // location.reload();
              window.location.replace(`${setting.redirect[ENV]}?orignFrom=${location.href}`);
            });
          });
          break;
        case 500:
          Message.error('服务器错误，请联系管理员！');
          break;
        case 404:
          Message.error('资源不存在！');
          break;
        case 503:
          Message.error('服务当前无法处理请求!');
          break;
        default:
          Message.error('其他错误，请联系管理员！');
          break;
      }
    } else {
      Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export function fetch(url, params) {
  return service({
    method: 'get',
    url,
    params
  });
}

export function post(url, data = {}, config) {
  return service({
    ...{
      method: 'post',
      url,
      data
    },
    ...config
  });
}

export function put(url, data = {}) {
  return service({
    method: 'put',
    url,
    data
  });
}

export function delet(url, params) {
  return service({
    method: 'delete',
    url,
    params
  });
}

export const downloadBlob = res => {
  const blob = new Blob([res.data], { type: 'application/vnd.ms-excel' });
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, res.headers.filename);
  } else {
    const link = document.createElement('a');
    const evt = document.createEvent('HTMLEvents');
    evt.initEvent('click', false, false);
    link.href = URL.createObjectURL(blob);
    link.download = decodeURI(res.headers.filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(link.href);
  }
};

export default service;
