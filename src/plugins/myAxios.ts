import axios from "axios";
import {showFailToast} from "vant";

const isDev = process.env.NODE_ENV === 'development';

export const URL =  isDev ? 'localhost:8080/api' : '线上';
// Set config defaults when creating the instance
const myAxios = axios.create({
    baseURL: 'http://' + URL,
});

myAxios.defaults.withCredentials = true; // 允许携带 cookie

// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    console.log("发送请求,",config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    console.log("收到响应,",response)
    // // 未登录则到登录页
    if(response?.data?.code === 40100){
        showFailToast("请先登录");
    }

    return response.data;
}, function (error) {

    return Promise.reject(error);
});

export default myAxios;