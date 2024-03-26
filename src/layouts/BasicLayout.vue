<template>
  <van-nav-bar
      title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
  <div id="content">
    <router-view/>
  </div>
  <van-tabbar route  >
    <van-tabbar-item to="/" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item to="/team" icon="search" name="team">队伍</van-tabbar-item>
    <van-tabbar-item to="/user" icon="friends-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">


import {useRouter} from "vue-router";


const router = useRouter();
const onClickLeft = () => {
  router.back();
};

const onClickRight = () => {
  router.push('/search')
};


//const onChange = (index:string) => showToast(`标签 ${index}`);
</script>

<style>

</style>