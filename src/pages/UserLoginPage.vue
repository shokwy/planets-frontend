<template>
  <div>
    <van-row justify="center" style="padding-top: 60px" >
      <van-image
          round
          width="10rem"
          height="10rem"
          :src="planet" class="userImage"
      />
    </van-row>

    <van-row justify="center" style="font-size: 20px; font-weight: bold; padding-top: 30px; padding-bottom: 30px">"星球：遇见你的星际伙伴"</van-row>
  </div>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="userAccount"
          name="userAccount"
          label="账号"
          placeholder="请输入账号"
          :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
          v-model="userPassword"
          type="password"
          name="userPassword"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ required: true, message: '请填写密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        登录
      </van-button>
      <van-row >
        <van-col offset="10"  span="14" >
          <van-cell  to="/user/register" value="还没有账号，点击注册" />
        </van-col>
      </van-row>
    </div>
  </van-form>
</template>

<script setup>

import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";
import {ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import planet from "../assets/planet.gif"
const router = useRouter();
const route = useRoute();

const userAccount = ref();
const userPassword = ref();

const onSubmit = async () => {
  // console.log("用户登录");
  const res = await myAxios.post("/user/login", {
    userAccount: userAccount.value,
    userPassword: userPassword.value
  });
  if (res.code === 0 && res.data) {
    showSuccessToast("登录成功");
    router.push('/index')
  } else {
    showFailToast("登录失败");
  }
};


</script>

<style scoped>

</style>