<template>
  <template v-if="user != null">
    <van-cell  is-link :value="user.gender" @click="toEditGender()">
      <template #title>
        <span class="custom-title">性别</span>
      </template>
      <template v-if="user.gender === 0">
        男
      </template>
      <template v-else>
        女
      </template>
    </van-cell>
    <van-cell title="简介" is-link to='/user/edit' :value="user.introduction"
              @click="toEdit('introduction','简介', user.introduction)"/>
    <van-cell title="电话" is-link to='/user/edit' :value="user.phone"
              @click="toEdit('phone','电话', user.phone)"/>
    <van-cell title="邮箱" is-link to='/user/edit' :value="user.email"
              @click="toEdit('email','邮箱', user.email)"/>
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

</script>

<style scoped>

</style>