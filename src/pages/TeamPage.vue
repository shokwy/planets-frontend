<template>
  <div id="teamPage">
    <van-search v-model="searchText" placeholder="搜素星球" @search="onSearch"/>
    <van-tabs v-model:active="active" @change="onTabChange">
      <van-tab title="公开" name="public" />
      <van-tab title="加密" name="private" />
      <van-tab v-if="currentUser?.userRole === 1" title="私密" name="secret" />
    </van-tabs>

    <van-floating-bubble class="add-button" v-model:offset="offset" magnetic="x" axis="xy" icon="plus" @click="doJoinTeam" />
    <team-card-list :team-list="teamList" :current-user="currentUser"/>
  </div>

</template>

<script setup lang="ts">
import {useRouter} from "vue-router";
import TeamCardList from "../components/TeamCardList.vue";
import {onMounted, ref} from "vue";
import myAxios from "../plugins/myAxios.ts";
import {showFailToast} from "vant";
import { useWindowSize } from '@vant/use';
import {getCurrentUser} from "../services/user.ts";


const active = ref('public')
const router = useRouter();
const searchText = ref('');
const { height } = useWindowSize()
const offset = ref({ x: -1, y: height.value - 150 });

/**
 * 切换查询状态
 * @param name
 */
const onTabChange = (name) => {
  // 查公开
  if (name === 'public') {
    listTeam(searchText.value, 0);
  } else if (name === 'secret') {
    // 查私有
    listTeam(searchText.value, 1);
  }else {
    // 查加密
    listTeam(searchText.value, 2);
  }
}


const doJoinTeam = () =>{
  router.push({
    path: "/team/add"
  })
}

const teamList = ref();


onMounted(async () =>{
  listTeam();
})

const onSearch = async (val) => {
  listTeam(val);
}

/**
 * 搜索星球
 * @param val
 * @param status
 * @returns {Promise<void>}
 */
const listTeam = async (val = '', status = 0) => {
  const res = await myAxios.get("/team/list", {
    params: {
      searchText: val,
      pageNum: 1,
      status,
    },
  });

  if (res?.code === 0) {
    teamList.value = res.data;
  } else {
    showFailToast("加载失败，请刷新重试");
  }
}

const currentUser = ref();

onMounted(async () =>{
  currentUser.value = await getCurrentUser();
})

</script>


<style scoped>

</style>