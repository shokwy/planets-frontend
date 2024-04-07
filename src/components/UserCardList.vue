<template>
  <van-skeleton title avatar :row="3" :loading="props.loading"  v-for="user in props.userList">
    <van-card
        :desc="'简介：' + user.introduction"
        :title="user.username"
        :thumb="user.avatarUrl"
        @click="toUserDetail(user.id)"
    >
      <template #tags>
        <van-tag plain type="primary" round v-for="tag in user.tags" style="margin-right: 8px; margin-top: 8px" >
          {{ tag }}
        </van-tag>
      </template>
      <template #footer>
        <van-button size="mini">联系我</van-button>
      </template>
    </van-card>
  </van-skeleton>
</template>

<script setup lang="ts">
import {UserType} from "../models/user";
import {useRouter} from "vue-router";

const router = useRouter()


interface UserCardListProps{
  userList: UserType[];
  loading: boolean;
}

const props= withDefaults(defineProps<UserCardListProps>(),{
  //@ts-ignore
  userList: [] as UserType[],
  loading: true,
});

const toUserDetail = (id:number) => {
  router.push({
    path:'/user/detail',
    query:{
      id
    },
  })
}


</script>

<style scoped>

</style>