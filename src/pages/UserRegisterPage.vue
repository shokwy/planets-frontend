<template>

  <div>
    <van-row justify="center" style="padding-top: 20px" >
      <van-image
          round
          width="10rem"
          height="10rem"
          :src="planet" class="userImage"
      />
    </van-row>
  </div>
  <van-row justify="center" style="font-size: 20px; font-weight: bold; padding-top: 30px; padding-bottom: 30px">"星球：遇见你的星际伙伴"</van-row>
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
          v-model="username"
          name="username"
          label="昵称"
          placeholder="请输入昵称"
          :rules="[{ required: true, message: '请填写昵称' }]"
      />
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
      <van-field
          v-model="checkPassword"
          type="password"
          name="checkPassword"
          label="确认密码"
          placeholder="请确认密码"
          :rules="[{ required: true, message: '请确认密码' }]"
      />
    </van-cell-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        注册
      </van-button>
      <van-row >
        <van-col offset="10"  span="14" >
          <van-cell  to="/user/login" value="已有账号，点击登录" />
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
import planet from "../assets/planet.gif";

const router = useRouter();
const route = useRoute();

const userAccount = ref();
const userPassword = ref();
const checkPassword = ref()
const username = ref()

const onSubmit = async () => {
  if (userPassword.value !== checkPassword.value){
    showFailToast("两次密码不一致");
    return;
  }
  const res = await myAxios.post("/user/register", {
    userAccount: userAccount.value,
    userPassword: userPassword.value,
    checkPassword: checkPassword.value,
    username: username.value,
  });
  if (res.code === 0 && res.data != null) {
    showSuccessToast("注册成功");
    router.push('/user/login');
  } else {
    showFailToast("注册失败");
  }
};

</script>

<style scoped>

</style>