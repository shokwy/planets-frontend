<template>
  <div id="teamAddPage">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
            v-model="addTeamData.name"
            name="name"
            label="星球名"
            placeholder="请输入星球名称"
            :rules="[{ required: true, message: '请输入星球名' }]"
        />
        <van-field
            v-model="addTeamData.description"
            rows="4"
            autosize
            label="星球描述"
            type="textarea"
            placeholder="请输入星球描述"
        />
        <van-field
            is-link
            readonly
            name="datetimePicker"
            label="过期时间"
            :placeholder="addTeamData.expireTime ?? '点击选择过期时间'"
            @click="showPicker = true"
        />
        <van-popup v-model:show="showPicker" position="bottom">
          <van-picker-group
              title="设定过期日期"
              :tabs="['选择日期', '选择时间']"
              @confirm="onConfirm"
              @cancel="showPicker = false"
          >
            <van-date-picker
                v-model="currentDate"
                :min-date="minDate"
            />
            <van-time-picker
                v-model="currentTime"
                :columns-type="columnsType"
            />
          </van-picker-group>
        </van-popup>
        <van-field name="stepper" label="最大人数">
          <template #input>
            <van-stepper v-model="addTeamData.maxNum" max="10" min="3"/>
          </template>
        </van-field>
        <van-field name="radio" label="星球状态">
          <template #input>
            <van-radio-group v-model="addTeamData.status" direction="horizontal">
              <van-radio name="0">公开</van-radio>
              <van-radio name="1">私有</van-radio>
              <van-radio name="2">加密</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <van-field
            v-if="Number(addTeamData.status) === 2"
            v-model="addTeamData.password"
            type="password"
            name="password"
            label="密码"
            placeholder="请输入星球密码"
            :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px;">
        <van-button round block type="primary" native-type="submit">
          创建
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";
import {ref} from "vue";
import myAxios from "../plugins/myAxios";
import {showFailToast, showSuccessToast} from "vant";


const router = useRouter();
// 展示日期选择器
const showPicker = ref(false);

const minDate = new Date();

const initFormData = {
  "name": "",
  "description": "",
  "expireTime": "",
  "maxNum": 3,
  "password": "",
  "status": '0',
}

const currentDate = ref(['2024', '01', '01']);		//定义一个初始时间(年月日)
const currentTime = ref(['12', '00', '00']);		//定义一个初始时间(时分秒)
const columnsType = ['hour', 'minute', 'second'];

const onConfirm = () => {
  //组合过期时间，'T'是满足后端序列化配的
  addTeamData.value.expireTime = currentDate.value.join('-') + 'T' + currentTime.value.join(':');
  showPicker.value = false;		//有了这行才会使picker点击“确认”后自动关闭

  //测试picker返回的值
  // showToast(
  //     addTeamData.value.expireTime
  // );
  // console.log("addTeamData.value.expireTime: " + addTeamData.value.expireTime);

};

// 需要用户填写的表单数据
const addTeamData = ref({...initFormData})

// 提交
const onSubmit = async () => {
  const postData = {
    ...addTeamData.value,
    status: Number(addTeamData.value.status)
  }
  // todo 前端参数校验
  const res = await myAxios.post("/team/add", postData);
  if (res?.code === 0 && res.data){
    showSuccessToast('添加成功');
    router.push({
      path: '/team',
      replace: true,
    });
  } else {
    showFailToast('添加失败');
  }
}
</script>

<style scoped>
#teamPage {

}
</style>
