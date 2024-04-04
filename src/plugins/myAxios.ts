import axios from "axios";
import {showFailToast} from "vant";


// Set config defaults when creating the instance
const myAxios = axios.create({
    baseURL: 'http://localhost:8080/api',
});

myAxios.defaults.withCredentials = true; // 允许携带 cookie

// 添加请求拦截器
myAxios.interceptors.request.use(function (config) {
    console.log("我要发送请求了,",config)
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
myAxios.interceptors.response.use(function (response) {
    console.log("我收到你的响应了,",response)
    // // 未登录则到登录页
    if(response?.data?.code === 40100){
        showFailToast("请先登录");
    }

    return response.data;
}, function (error) {

    return Promise.reject(error);
});

export default myAxios;