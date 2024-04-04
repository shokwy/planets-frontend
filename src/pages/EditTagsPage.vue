<template v-if="user">
  <div v-if="user && user.tags && user.tags.length > 0" :loading="loading">
    <van-row gutter="10" style="padding:20px;">
      <van-col v-for=" tag in user.tags" :key="tag" span="5" class="col-item">
        <div class="tags" style="padding-bottom: 20px">
          <van-tag  closeable plain :style="{ color: randomColor() }" size="medium"  type="primary" @close="deleteTag(tag)">{{ tag }}</van-tag>
        </div>
      </van-col>
    </van-row>
    <div style="margin: 16px;">
    <van-button round block type="primary" native-type="submit" @click="addTags">
      添加自定义标签
    </van-button>
    </div>
  </div>

  <div v-else>
    <van-empty  description="描述文字">
      <div style="margin: 16px;">
      <van-button  round block type="primary" native-type="submit" @click="addTags">
        添加自定义标签
      </van-button>
      </div>
    </van-empty>
  </div>


  <van-dialog v-model:show="addTag" title="标题" show-cancel-button @confirm="confirm">
    <van-field maxlength="10" v-model="addTagText" type="text" placeholder="请输入标签"></van-field>
  </van-dialog>

</template>
<script setup lang="ts">
import {onMounted, ref, watchEffect} from "vue";
import {getCurrentUser} from "../services/user.ts";
import { showFailToast, showSuccessToast} from "vant";
import myAxios from "../plugins/myAxios.ts";
const user = ref({})

const deleteTag = async (tag) => {
  const res = await myAxios.post('/user/deleteTag',tag,{
    headers: {
      'Content-Type':'text/plain'
    }
  })
  if (res.code === 0) {
    user.value =  await getCurrentUser();
    user.value.tags = JSON.parse(user.value.tags)
    showSuccessToast("删除成功")
  } else {
    showFailToast(res.description)
  }
};

const randomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
}
const queryTags = async () => {
  user.value =  await getCurrentUser();
  user.value.tags = JSON.parse(user.value.tags)
}

onMounted(async ()=>{
  queryTags();
})

// const onSubmit () =>{
//
// }
//
const addTag = ref(false);
const addTags = () =>{
  addTag.value = true
}
const addTagText = ref("");
const confirm = async () => {

  // if(addTagText.value.length>10){
  //   showFailToast("标签长度最大为10")
  // }
  let tagText = addTagText.value;
  if (typeof tagText !== 'string') {
    tagText = tagText.toString();
  }
  const res = await myAxios.post('/user/addTags',tagText,{
    headers: {
      'Content-Type':'text/plain'
    }
  })
  if (res.code === 0) {
    user.value =  await getCurrentUser();
    user.value.tags = JSON.parse(user.value.tags)
    showSuccessToast("添加成功")
    addTagText.value = ''
  } else {
    showFailToast(res.description)
    addTagText.value = ''
  }

}

watchEffect(() => {
  queryTags();
})

</script>
<style>
.tags span {

  place-items: center; /* 水平和垂直居中 */

}
</style>