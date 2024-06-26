<template>
  <div id="teamCardList">
    <van-card
        v-for="team in props.teamList"
        :thumb="teamLogo"
        :desc="'简介：' + team.description"
        :title="`${team.name}`"
        @click-thumb="toTeamDetail(team.id)"
    >
      <template #tags>
        <van-tag plain type="danger" style="margin-right: 8px; margin-top: 8px">
          {{
            teamStatusEnum[team.status]
          }}
        </van-tag>
      </template>
      <template #bottom>
        <div>
          {{ '人数: '+ team.hasJoinNum + '/' + team.maxNum }}
        </div>
        <div v-if="team.expireTime">
          {{ '过期时间: ' + team.expireTime.toString().slice(0,10) }}
        </div>
        <div>
          {{ '创建时间: ' + team.createTime.toString().slice(0,10)}}
        </div>
      </template>
      <template #footer>
        <van-button v-if="team.userId !== props.currentUser?.id && !team.hasJoin" size="small" type="primary" plain
                    @click="preJoinTeam(team)">
          加入星球
        </van-button>
        <van-button v-if="team.userId === props.currentUser?.id" size="small" type="primary" plain
                    @click="doUpdateTeam(team.id)">更新星球
        </van-button>
        <!-- 仅加入星球可见 -->
        <van-button v-if="team.hasJoin" size="small"  plain type="warning"
                    @click="doQuitTeam(team.id)">退出星球
        </van-button>
        <van-button v-if="team.userId === props.currentUser?.id" size="small" type="danger" plain
                    @click="doDeleteTeam(team.id)">解散星球
        </van-button>
      </template>
    </van-card>
    <van-dialog v-model:show="showPasswordDialog" title="请输入密码" show-cancel-button @confirm="doJoinTeam" @cancel="doJoinCancel">
      <van-field v-model="password" placeholder="请输入密码"/>
    </van-dialog>

  </div>

</template>

<script setup lang="ts">
import {TeamType} from "../models/team";
import {teamStatusEnum} from "../constants/team.ts";
import teamLogo from '../assets/bob.jpeg';
import myAxios from "../plugins/myAxios.ts";
import {showFailToast, showSuccessToast} from "vant";

import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {getCurrentUser} from "../services/user.ts";
import {UserType} from "../models/user";

interface TeamCardListProps {
  teamList: TeamType[];
  currentUser: UserType;
}

const props = withDefaults(defineProps<TeamCardListProps>(), {
  // @ts-ignore
  teamList: [] as TeamType[],
  currentUser: undefined,
});

const router = useRouter();


/**
 * 星球详情
 * @param id
 */
const toTeamDetail = (id:number) => {
  router.push({
    path:'/team/detail',
    query:{
      id
    },
  })
}
/**
 * 加入星球
 */
const doJoinTeam = async () => {
  const res = await myAxios.post('/team/join', {
    teamId: joinTeamId.value,
    password: password.value

  });
  if (res?.code === 0) {
    showSuccessToast('加入成功');
  } else {
   showFailToast((res.description ? `${res.description}` : '加入失败'));
  }
}

const showPasswordDialog = ref(false);
const password = ref('');
const joinTeamId = ref(0);

/**
 * 判断是不是加密房间，是的话显示密码框
 * @param team
 */
const preJoinTeam = (team: TeamType) => {
  joinTeamId.value = team.id;
  if (team.status === 0) {
    doJoinTeam()
  } else {
    showPasswordDialog.value = true;
  }
}

const doJoinCancel = () => {
  joinTeamId.value = 0;
  password.value = '';
}

/**
 * 退出星球
 * @param id
 */
const doQuitTeam = async (id: number) => {
  const res = await myAxios.post('/team/quit', {
    teamId: id
  });
  if (res?.code === 0) {
    showSuccessToast('操作成功');
  } else {
   showFailToast('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

/**
 * 解散星球
 * @param id
 */
const doDeleteTeam = async (id: number) => {
  const res = await myAxios.post('/team/delete', {
    id,
  });
  if (res?.code === 0) {
    showSuccessToast('操作成功');
  } else {
    showFailToast('操作失败' + (res.description ? `，${res.description}` : ''));
  }
}

/**
 * 跳转至星球更新页
 * @param id
 */
const doUpdateTeam = (id: number) => {
  router.push({
    path: '/team/update',
    query: {
      id,
    }
  })
}

// const currentUser = ref();
//
// onMounted(async () =>{
//   currentUser.value = await getCurrentUser();
// })

</script>

<style scoped>
#teamCardList :deep(.van-image__img) {
  height: 128px;
  object-fit: unset;
}
</style>
