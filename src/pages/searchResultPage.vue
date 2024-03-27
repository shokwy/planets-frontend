<template>
  <user-card-list :user-list="userList" />
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空" />
</template>
<script setup>
import {useRoute} from "vue-router";
import {onMounted, ref} from 'vue';
import myAxios from "../plugins/myAxios";
import qs from 'qs';
import UserCardList from "../layouts/UserCardList.vue";

const route = useRoute();
const {tags} = route.query;

const userList = ref([]);//存放用户列表

onMounted ( async ()=>{     //异步调用
  const userListData = await myAxios.get('/user/search/tags',{
    params: {
      tagNameList: tags
    },
    paramsSerializer: {
      serialize: function(params){
        return qs.stringify(params,{arrayFormat:'repeat'})
        //return qs.stringify(params,{indices: false})
      }
    }
  })
      .then(function (response){
        console.log('/user/search/tags succeed',response);
        //Toast.success('请求成功!');
        return response?.data;  //返回数据  ?.可选链操作符，避免数据为null或undefined时报错
      })
      .catch(function (error){
        console.error('/user/search/tags error',error);
        //Toast.fail('请求失败!');
      })
  // console.log(userListData)
  if(userListData){
    userListData.forEach(user => {
      if(user.tags){
        user.tags = JSON.parse(user.tags)
      }
    })
    userList.value = userListData;
  }
})



const mockUser = ref({
  id: 1,
  userName: '随风',
  userAccount: 'shok',
  profile: 'Java开发11111111',
  gender: '男',
  phone: '234234',
  email: '324242342@qq.com',
  avatar: 'https://img1.baidu.com/it/u=1645832847,2375824523&fm=253&fmt=auto&app=138&f=JPEG?w=480&h=480',
  createTime: new Date().toDateString(),
  tags: ["Java","全栈"]
})
</script>

<style scoped>

</style>