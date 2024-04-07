<template>
  <form action="/">
    <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
        @cancel="onCancel"
    />
  </form>
  <van-divider content-position="left">已选标签</van-divider>
  <div v-if="activeIds.length===0">热门标签</div>
  <van-row gutter="16" style="padding: 0 16px">
    <van-col v-for="tag in activeIds">
      <van-tag closeable size="medium" type="primary" @close="doClose(tag)">
        {{tag}}
      </van-tag>
    </van-col>
  </van-row>
  <van-tree-select
      v-model:active-id="activeIds"
      v-model:main-active-index="activeIndex"
      :items="tagList"
  />
  <div style="padding: 16px">
    <van-button block type="primary" @click="doSearchResult">搜索</van-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter();
const searchText = ref('');
//已选中的标签
const activeIds = ref([]);
const activeIndex = ref(0);
/**
 * 搜索过滤
 * @param val
 */
const onSearch = (val) => {
  // tagList.value = originTagList.map(parentTag => {
  //   const tempChildren = [...parentTag.children];
  //   const tempParentTag = {...parentTag};
  //   tempParentTag.children = tempChildren.filter(item => item.text.includes(searchText.value));
  //   return tempParentTag;
  // });
  router.push({
    path: '/user/list',
    query: {
      tags: [searchText.value]
    }
  })

};
const onCancel = () => {
  searchText.value = '';
  tagList.value = originTagList;
};

//移除标签
const doClose = (tag:string) =>{
  activeIds.value=activeIds.value.filter(item =>{
    return item !== tag;
  })
}

``
const doSearchResult = () => {
  if (activeIds.value.length == 0 ){
    router.push({
      path: '/user/list',
      query: {
        tags: [searchText.value]
      }
    })
  }else {
    router.push({
      path: '/user/list',
      query: {
        tags: activeIds.value
      }
    })
  }
}
const originTagList = [{
  text: '语言',
  children: [
    {text: 'Java', id: 'Java'},
    {text: 'Python', id: 'Python'},
    {text: 'C#', id: 'C#'},
    {text: 'PHP', id: 'PHP'},
    {text: 'C/C++', id: 'C/C++'},
    {text: 'JavaScript', id: 'JavaScript'},
    {text: 'TypeScript', id: 'TypeScript'},
    {text: 'Ruby', id: 'Ruby'},
    {text: 'Go', id: 'Go'},
  ],
},
  {
    text: '年级',
    children: [
      {text: '大一', id: '大一'},
      {text: '大二', id: '大二'},
      {text: '大三', id: '大三'},
      {text: '大四', id: '大四'},
      {text: '研究生', id: '研究生'},
    ],
  },
  {
    text: '目标',
    children: [
      {text: '竞赛', id: '竞赛'},
      {text: '考研', id: '考研'},
      {text: '实习', id: '实习'},
      {text: '春招', id: '春招'},
      {text: '秋招', id: '秋招'},
      {text: '大厂', id: '大厂'},
      {text: '创业', id: '创业'},
    ],
  },
  {
    text: '方向',
    children: [
      {text: '全栈', id: '全栈'},
      {text: '前端', id: '前端'},
      {text: '后端', id: '后端'},
      {text: '算法', id: '算法'},
      {text: '测试', id: '测试'},
      {text: '运维', id: '运维'},
    ],
  },
]

let tagList = ref(originTagList);

</script>

<style scoped>

</style>