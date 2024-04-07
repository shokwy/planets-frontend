<template>
  <user-card-list :user-list="userList" :loading="loading"/>

</template>

<script setup lang="ts">
import UserCardList from "../components/UserCardList.vue";
import {onMounted, ref} from "vue";
import {showFailToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
import {useRoute, useRouter} from "vue-router";
import {UserType} from "../models/user";

const route = useRoute()
const router = useRouter()
const userList = ref([]);//存放用户列表
const loading = ref(true);

onMounted(async ()=>{
  const teamId = Number(route.query.id);
  if (teamId == null){
    showFailToast("请求失败，请刷新重试");
  }
  let userListData;
  const res = await myAxios.get(`/team/members/${teamId}`);
  if (res.code === 0 ) {
    userListData = res.data;
  }else {
    showFailToast("加载失败，请刷新重试");
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
})
</script>

<style scoped>

</style>