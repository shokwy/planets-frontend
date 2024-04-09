<template>
  <template v-if="team != null">
    <div style="margin-top: 10px; display: flex; justify-content: center;">
      <van-image
          width="10rem"
          height="10rem"
          round
          :src="teamLogo"
      />
    </div>
    <van-cell title="名称"  :value="team.name"/>
    <van-cell title="描述"  :value="team.description"/>
    <van-cell :value="team.status">
      <template #title>
        <span>状态</span>
      </template>
      <template v-if="team.status === 0">
        公开
      </template>
      <template v-else-if="team.status === 1">
        私有
      </template>
      <template v-else>
        加密
      </template>
    </van-cell>
    <van-cell title="人数"  :value="team.hasJoinNum + '/' + team.maxNum"/>
    <van-cell title="球长" is-link   :value="team.createUser.username"
    @click="toUserDetail(team.createUser.id)"/>
    <van-cell title="成员" is-link  @click="toTeamMembers(team.id)"/>
    <van-cell title="星球频道" is-link @click="toChat" v-if="team.hasJoin"/>
    <van-cell title="创建时间" :value="team.createTime.slice(0,10)"  />
    <van-cell title="过期时间" :value="team.expireTime.slice(0,10)"  />

    <van-space :size="20">
    </van-space>

  </template>
</template>

<script setup>
import {useRoute, useRouter} from "vue-router";
import myAxios from "../plugins/myAxios";
import {onMounted, ref} from 'vue';
import {getCurrentUser} from "../services/user.ts";
import {showFailToast, showSuccessToast} from "vant";
import teamLogo from '../assets/team.png';

const route = useRoute()
const router = useRouter()
const team = ref();

/**
 * 用户详情
 * @param id
 */


onMounted(async ()=>{
  const TeamId = Number(route.query.id);
  if (TeamId == null){
    showFailToast("请求失败，请刷新重试");
  }
  const res = await myAxios.get("/team/list", {
    params: {
      id: TeamId,
      pageNum: 1,
    },
  });
  if (res.code === 0 ) {
    // setCurrentUserState(res.data);
   team.value = res.data[0];
  }else {
    showFailToast("加载失败，请刷新重试");
  }
})

/**
 * 查看用户信息
 * @param id
 */
const toUserDetail = (id) => {
  router.push({
    path:'/user/detail',
    query:{
      id
    },
  })
};

/**
 * 查看星球成员
 * @param id
 */
const toTeamMembers = (id) => {
  router.push({
    path:'/team/members',
    query:{
      id
    },
  })
};

/**
 * 队伍群聊
 */
const toChat = () => {
  router.push({
    path: "/chat",
    query: {
      teamId: team.value.id,
      teamName: team.value.name,
      teamType: 2
    }
  })
}


</script>

<style scoped>

</style>