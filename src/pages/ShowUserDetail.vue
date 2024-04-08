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

    <div v-if="loginUser.id === nowId" style="margin: 16px;">
    </div>
    <div v-else-if="!Friend" style="margin: 16px;">
      <van-button  round type="primary" @click="addUser" block>
        添加好友
      </van-button>
    </div>
    <div v-else style="margin: 16px;">
      <van-button round type="success" @click="chatUser()" block>联系好友</van-button>
      <div style="padding-top: 10px;"></div>
      <van-button round type="danger" @click="deleteFriend()" block>删除好友</van-button>
    </div>

    <van-dialog v-model:show="addUserApply"
                :title="'添加好友：'+user.username"
                show-cancel-button
                @confirm="toAddUserApply(user.id)">
      <div style="padding-top:8px"></div>
      <van-field v-model="addUserApplyText"
                 type="text"
                 placeholder="我是...."
                 style="text-align: center;width: 150px;margin-left: 75px;"
      />
      <div style="padding-top:8px "></div>
    </van-dialog>
  </template>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {onMounted, ref} from 'vue';
import {getCurrentUser} from "../services/user.ts";
import {showConfirmDialog, showFailToast, showSuccessToast} from "vant";

const route = useRoute()
const router = useRouter()
const user = ref();
const Friend = ref(false);
const loginUser = ref()
const nowId = ref()

onMounted(async ()=>{
  const userId = Number(route.query.id);
  nowId.value = userId;
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

  const currentUser = await getCurrentUser()
  loginUser.value = currentUser

  const res_ = await myAxios.get(`/user/isFriend/${userId}`)
  if(res_.code === 0){
    Friend.value = res_.data
  }
})



const chatUser = () => {
  if (!loginUser.value.userIds.includes(user.value.id)) {
    showFailToast("该用户暂时不是您的好友")
    return
  }
  router.push({
    path: "/chat",
    query: {
      id: user.value.id,
      username: user.value.username,
      userType: 1
    }
  })
}
const addUser = async () => {
  addUserApply.value = true
}

const addUserApply = ref(false);
const addUserApplyText = ref();
const toAddUserApply = async (id) => {
  const status = await myAxios.post("/friends/add", {
    "receiveId": id,
    "remark": addUserApplyText.value
  })
  if (status) {
    showSuccessToast("申请成功")
  }
}
const deleteFriend = async () => {
  showConfirmDialog({
    message: '请确认是否删除好友?',
  }).then(async () => {
    const deleteFriend = await myAxios.post(`/user/deleteFriend/${user.value.id}`, {})
    if (deleteFriend) {
      showSuccessToast("删除成功")
    }
  }).catch(() => {
    showSuccessToast("修改成功")
  });

}

</script>

<style scoped>

</style>