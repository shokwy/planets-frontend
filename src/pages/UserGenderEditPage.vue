<template>
  <van-form @submit="onSubmit">
    <van-radio-group v-model="gender">
      <van-cell-group inset>
        <van-cell title="男"  clickable @click="gender.value = 0">
          <template #right-icon>
            <van-radio name="0" />
          </template>
        </van-cell>
        <van-cell title="女" clickable @click="gender.value = 1">
          <template #right-icon>
            <van-radio name="1" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-radio-group>
    <div style="margin: 16px;">
      <van-button round block type="primary" native-type="submit">
        提交
      </van-button>
    </div>
  </van-form>
</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";
import {getCurrentUser} from "../services/user";


const router =useRouter();
const gender = ref();



// 不可以写在外面，否则页面不显示内容，还没有报错信息，原因未知
// const currentUser = await getCurrentUser();
const onSubmit = async () => {
  if (gender.value != 0 && gender.value != 1){
    showFailToast("请选择性别");
    return;
  }
  // 异步方法必须添加 await 才可以拿到数据, 否则拿到的是 promise 对象
  const currentUser = await getCurrentUser();
  //console.log("-------UserEditPage", currentUser);
  const res = await myAxios.post("/user/update", {
    "id": currentUser.id,
    "gender": gender.value // 动态取值
  })
  //console.log("修改用户信息", res);
  if (res.code == 0 && res.data > 0) {
   showSuccessToast("修改成功");
    router.replace("/user");
  } else {
   showFailToast("修改失败");
  }
};

</script>