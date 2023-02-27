import axios from "axios";
const serviceAxios = axios.create({
  baseURL: "", // 基础请求地址
  timeout: 10000, // 请求超时设置
  withCredentials: false, // 跨域请求是否需要携带 cookie
  headers: {
    token: localStorage.getItem("token"), //设置token
  },
});

// 创建请求拦截
serviceAxios.interceptors.request.use(
  (config) => {
    if (!config.headers["content-type"]) {
      // 如果没有设置请求头
      if (config.method === "post") {
        config.data = qs.stringify(config.data); // 序列化表单数据
      } else {
        config.headers["content-type"] = "application/json"; // 默认类型
      }
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
serviceAxios.interceptors.response.use(
  (res) => {
    let data = res.data;
    // 处理自己的业务逻辑，比如判断 token 是否过期等等
    // 代码块
    return data;
  },
  (error) => {
    let message;
    if (error && error.response) {
      switch (error.response.status) {
        case 1:
          message = error;
        case 302:
          message = "接口重定向";
          break;
        case 400:
          message = "请检查参数是否正确";
          break;
        case 401:
          message = "未登录";
          break;
        case 403:
          message = "没有权限";
          break;
        case 404:
          message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          message = "请求超时";
          break;
        case 409:
          message = "数据重复";
          break;
        case 500:
          message = "服务器错误";
          break;
        case 501:
          message = "服务未实现";
          break;
        case 502:
          message = "网关错误";
          break;
        case 503:
          message = "服务不可用";
          break;
        case 504:
          message = "访问服务失败";
          break;
        case 505:
          message = "不支持的HTTP版本";
          break;
        default:
          message = "出现异常，请联系系统管理员";
          break;
      }
    }
    return Promise.reject(message);
  }
);
export default serviceAxios;
