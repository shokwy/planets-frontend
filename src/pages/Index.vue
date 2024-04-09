<template>
  <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="like-o">
    即今江海一归客，他日云霄万里人。
  </van-notice-bar>
  <van-swipe class="my-swipe" :autoplay="3000" lazy-render>
    <van-swipe-item v-for="image in images" :key="image">
      <img :src="image" />
    </van-swipe-item>
  </van-swipe>
  <van-cell center title="精准匹配">
    <template #right-icon>
      <van-switch active-color="#ee0a24" v-model="isMatchMode" />
    </template>
  </van-cell>
  <user-card-list :user-list="userList" :loading="loading"/>
  <van-empty v-if="!userList || userList.length < 1" description="搜索结果为空" />
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import myAxios from "../plugins/myAxios";

import UserCardList from "../components/UserCardList.vue";
import {showFailToast} from "vant";
import {UserType} from "../models/user";
import flower from "../assets/flower.png"
import summer from "../assets/summer.png"
import autumn from "../assets/autumn.png"
import spring from "../assets/spring.png"

const userList = ref([]);//存放用户列表

const isMatchMode = ref<boolean>(false);
const loading = ref(true);

const images = [
    flower,
    summer,
    autumn,
    spring,
];
/**
 * 加载数据
 */
const loadData = async () => {
  let userListData;
  loading.value = true;
  // 心动模式，根据标签匹配用户
  if (isMatchMode.value) {
    const num = 10;
    userListData = await myAxios.get('/user/match', {
      params: {
        num,
      },
    })
        .then(function (response) {
          console.log('/user/match succeed', response);
          return response?.data;
        })
        .catch(function (error) {
          console.error('/user/match error', error);
          showFailToast('请求失败');
        })
  } else {
    // 普通模式，直接分页查询用户
    userListData = await myAxios.get('/user/recommend', {
      params: {
        pageSize: 8,
        pageNum: 1,
      },
    })
        .then(function (response) {
          console.log('/user/recommend succeed', response);
          return response?.data?.records;
        })
        .catch(function (error) {
          console.error('/user/recommend error', error);
          showFailToast('请求失败');
        })
  }
  if (userListData) {
    userListData.forEach((user: UserType) => {
      if (user.tags) {
        user.tags = JSON.parse(user.tags);
      }
    })
    userList.value = userListData;
    loading.value = false;
  }
}

watchEffect(() => {
  loadData();
})
</script>

<style scoped>
.my-swipe{
  height: 180px;
}
.my-swipe img{
  max-width: 100%;
}

</style>