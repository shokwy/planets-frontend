<template>
  <van-nav-bar v-if="nowUrl !== '/user/login' && nowUrl !== '/user/register'"
               fixed="true"
      :title="title"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
  >
    <template #right>
      <van-icon name="search" size="18" />
    </template>
  </van-nav-bar>
  <van-nav-bar v-else  fixed="true" title="星球" />
  <div id="content">
    <router-view/>
  </div>
  <van-tabbar route  v-if="nowUrl !== '/user/login' && nowUrl !== '/user/register'">
    <van-tabbar-item replace to="/index" icon="home-o" name="index">主页</van-tabbar-item>
    <van-tabbar-item replace to="/friend" icon="friends-o" >好友</van-tabbar-item>
    <van-tabbar-item replace to="/team" icon="star-o" name="team">星球</van-tabbar-item>
    <van-tabbar-item replace to="/user" icon="user-o" name="user">个人</van-tabbar-item>
  </van-tabbar>
</template>

<script setup lang="ts">


import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import routes from "../config/router.ts";
import {getCurrentUser} from "../services/user.ts";

const router = useRouter();
const currentUser = ref();

onMounted(async () =>{
  currentUser.value = await getCurrentUser();
})
const onClickLeft = () => {
  router.back();
};

const onClickRight = () => {
  router.push('/search')
};

const DEFAULT_TITLE = '星球';
const title = ref(DEFAULT_TITLE);
const nowUrl = ref();
/**
 * 根据路由切换标题
 */
router.beforeEach((to, from) => {
  const toPath = to.path;
  const route = routes.find((route) => {
    return toPath == route.path;
  })
  title.value = route?.title ?? DEFAULT_TITLE;
  nowUrl.value = route?.path;
})


</script>

<style>
#content{
  padding-top: 50px;
  padding-bottom: 50px;
}
</style>