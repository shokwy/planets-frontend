<template>
  <template v-if="user != null">
    <van-cell title="头像" center is-link to='/user/edit/avatar'>
      <img style="height: 48px" :src="user.avatarUrl"/>
    </van-cell>
    <van-cell title="昵称" is-link to='/user/edit' :value="user.username"
              @click="toEdit('username','昵称', user.username)"/>
    <van-cell title="账号" is-link to='/user/edit' :value="user.userAccount"
              @click="toEdit('userAccount','账号', user.userAccount)"/>

    <van-cell  is-link  to="/user/tags" :value="user.tags">
      <template #title>
        <span class="custom-title">标签</span>
      </template>
      <van-tag plain type="primary" round v-for="tag in user.tags" style="margin-left: 8px; margin-top: 8px"  >
        {{tag}}
      </van-tag>
    </van-cell>
    <van-cell title="更多" is-link to="/user/more" />

    <van-space :size="20">
    </van-space>

    <van-cell title="我创建的星球" is-link to="/user/team/create" />
    <van-cell title="我加入的星球" is-link to="/user/team/join" />
    <div style="margin: 16px;">
      <van-button  round block type="danger" native-type="submit" @click="logOut" >
        退出登录
      </van-button>
    </div>
  </template>
</template>

<script setup>
import {useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {onMounted, ref} from 'vue';
import {getCurrentUser} from "../services/user.ts";
import {showSuccessToast} from "vant";

const user = ref();

onMounted(async ()=>{

  user.value = await getCurrentUser();
  user.value.tags = JSON.parse(user.value.tags)
})

const router = useRouter();

const toEdit = (editKey, editName, currentValue) => {
  router.push({
    path: '/user/edit',
    params: {
      a: 1
    },
    query: {
      editKey,
      editName,
      currentValue,
    }
  })
}

const toEditGender = () => {
  router.push({
    path: '/user/edit/gender',
  })
}

/**
 * 注销
 */
const logOut = async () => {
  const res = await myAxios.post('/user/logout')
  if(res.data === 1){
    showSuccessToast('退出登录');
    router.push({
      path: '/user/login'
    })
  }
}
</script>

<style scoped>

</style>