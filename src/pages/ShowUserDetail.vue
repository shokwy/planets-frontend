<template>
  <template v-if="user != null">
    <div style="margin-top: 10px; display: flex; justify-content: center;">
      <van-image
          round
          width="10rem"
          height="10rem"
          :src="user.avatarUrl"
      />
    </div>
    <van-cell title="昵称"  :value="user.username"/>
    <van-cell title="账号"  :value="user.userAccount"/>
    <van-cell title="简介"  :value="user.introduction"/>
    <van-cell  :value="user.tags">
      <template #title>
        <span class="custom-title">标签</span>
      </template>
      <van-tag plain type="primary" round v-for="tag in user.tags" style="margin-left: 8px; margin-top: 8px"  >
        {{tag}}
      </van-tag>
    </van-cell>
    <van-cell title="邮箱" :value="user.email"  />

    <van-space :size="20">
    </van-space>

    <div style="margin: 16px;">
      <van-button  round block type="primary" native-type="submit"  >
        添加好友
      </van-button>
    </div>
  </template>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {onMounted, ref} from 'vue';
import {getCurrentUser} from "../services/user.ts";
import {showFailToast, showSuccessToast} from "vant";

const route = useRoute()
const router = useRouter()
const user = ref();

onMounted(async ()=>{
  const userId = Number(route.query.id);
  if (userId == null){
    showFailToast("请求失败，请刷新重试");
  }
  const res = await myAxios.get(`/user/${userId}`);
  if (res.code === 0 ) {
    // setCurrentUserState(res.data);
    user.value = res.data
    user.value.tags = JSON.parse(user.value.tags)
  }else {
    showFailToast("加载失败，请刷新重试");
  }
})


</script>

<style scoped>

</style>