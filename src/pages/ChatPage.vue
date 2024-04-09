<template>
  <div class="chat-container">
    <!--    <p class="heard">{{ stats.chatUser.username }}</p>-->
    <p class="heard" v-if="stats.chatType===stats.chatEnum.PRIVATE_CHAT">{{ stats.chatUser.username }}</p>
    <p class="heard" v-if="stats.chatType===stats.chatEnum.TEAM_CHAT">{{ stats.team.teamName }}</p>
    <div class="content"  ref="chatRoom"  v-html="stats.content"></div>
    <div class="send">

      <textarea placeholder="聊点什么吧...."
                v-model="stats.text"
                @keyup.enter="send"
                class="input-text"></textarea>
      <van-button class="input-send-button" type="success" @click="send">发送</van-button>
    </div>
  </div>
</template>
<script setup lang="ts">
import {nextTick, onMounted, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {showFailToast} from "vant";

import {getCurrentUser} from "../services/user.ts";
import myAxios, {URL} from "../plugins/myAxios.ts";

const route = useRoute()
const router = useRouter()

const stats = ref({
  user: {
    id: 0,
    username: "",
    avatarUrl: ''
  },
  isCollapse: false,
  users: [],
  chatUser: {
    id: 0,
    username: ''
  },
  chatEnum: {
    // 私聊
    PRIVATE_CHAT: 1,
    // 队伍聊天
    TEAM_CHAT: 2,
    // 大厅
    HALL_CHAT: 3
  },
  chatType: null,
  team: {
    teamId: 0,
    teamName: ''
  },
  text: "",
  messages: [],
  content: ''
})

let socket = null;
const heartbeatInterval = 30 * 1000; // 30秒
let heartbeatTimer = null;

const startHeartbeat = () => {
  heartbeatTimer = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send("PING");
    }
  }, heartbeatInterval);
}

const stopHeartbeat = () => {
  clearInterval(heartbeatTimer);
  heartbeatTimer = null;
}

const chatRoom = ref(null)
const DEFAULT_TITLE = "聊天"
const title = ref(DEFAULT_TITLE)
onMounted(async () => {
  let {id, username, userType, teamId, teamName, teamType} = route.query
  stats.value.chatUser.id = Number.parseInt(id)
  stats.value.team.teamId = Number.parseInt(teamId)
  stats.value.chatUser.username = username
  stats.value.team.teamName = teamName
  if (userType && Number.parseInt(userType) === stats.value.chatEnum.PRIVATE_CHAT) {
    stats.value.chatType = stats.value.chatEnum.PRIVATE_CHAT
    title.value = stats.value.chatUser.username
  } else if (teamType && Number.parseInt(teamType) === stats.value.chatEnum.TEAM_CHAT) {
    stats.value.chatType = stats.value.chatEnum.TEAM_CHAT
    title.value = stats.value.team.teamName
  } else {
    stats.value.chatType = stats.value.chatEnum.HALL_CHAT
    title.value = "公共聊天室"
  }
  stats.value.user = await getCurrentUser()


  //私聊·
  if (stats.value.chatType === stats.value.chatEnum.PRIVATE_CHAT) {
    const privateMessage = await myAxios.post("/chat/privateChat",
        {
          toId: stats.value.chatUser.id,
        })

    privateMessage.data.forEach(chat => {
      if (chat.isMy) {
        createContent(null, chat.formUser, chat.text)
      } else {
        createContent(chat.toUser, null, chat.text,null,chat.createTime)
      }
    })

  }

  if (stats.value.chatType === stats.value.chatEnum.HALL_CHAT) { //大厅聊天
    const hallMessage = await myAxios.get("/chat/hallChat" ,{})
    hallMessage.data.forEach(chat => {
      if (chat.isMy === true) {
        createContent(null, chat.formUser, chat.text)
      } else {
        createContent(chat.formUser, null, chat.text, chat.isAdmin,chat.createTime)
      }
    })
  }
  if (stats.value.chatType === stats.value.chatEnum.TEAM_CHAT) { //队伍聊天
    const teamMessage = await myAxios.post("/chat/teamChat",
        {
          teamId: stats.value.team.teamId
        })
    teamMessage.data.forEach(chat => {
      if (chat.isMy === true) {
        createContent(null, chat.formUser, chat.text)
      } else {
        createContent(chat.formUser, null, chat.text, chat.isAdmin,chat.createTime)
      }
    })
  }
  init()
  // 内容始终显示最下方
  await nextTick()

  const lastElement = chatRoom.value.lastElementChild
  lastElement.scrollIntoView()
})

const init = () => {
  let uid = stats.value.user.id;
  // let uid = route.query.id
  if (typeof (WebSocket) == "undefined") {
    showFailToast("您的浏览器不支持WebSocket")
  } else {
    // todo 区分线上线下
    let socketUrl = 'ws://' + URL + '/websocket/' + uid + '/' + stats.value.team.teamId;    if (socket != null) {
      console.log("socket关闭了")
      socket.close();
      socket = null;
    }
    // 开启一个websocket服务
    socket = new WebSocket(socketUrl);
    //打开事件
    socket.onopen = function () {
      startHeartbeat();
    };
    //  浏览器端收消息，获得从服务端发送过来的文本消息
    socket.onmessage = function (msg) {
      if (msg.data === "pong") {
        return;
      }
      // 对收到的json数据进行解析，
      let data = JSON.parse(msg.data)
      if (data.error) {
        showFailToast(data.error)
        return
      }
      // 获取在线人员信息
      if (data.users) {
        stats.value.users = data.users.filter(user => {
          return user.id !== uid
        })
        // 获取当前连接的所有用户信息，并且排除自身，自己不会出现在自己的聊天列表里
      } else {
        // 如果服务器端发送过来的json数据 不包含 users 这个key，那么发送过来的就是聊天文本json数据
        let flag;
        if (stats.value.chatType === data.chatType) {
          // 单聊
          flag = (uid === data.toUser?.id && stats.value.chatUser?.id === data.formUser?.id)
        }
        if ((stats.value.chatType === data.chatType)) {
          // 大厅
          flag = (data.formUser?.id !== uid)
        }
        // 队伍
        if (stats.value.chatType === data.chatType && data.teamId && stats.value.team.teamId === data.teamId) {
          flag = (data.formUser?.id !== uid)
        }
        if (flag) {
          stats.value.messages.push(data)
          // 构建消息内容
          createContent(data.formUser, null, data.text, data.isAdmin, data.createTime)
        }
        nextTick(() => {
          const lastElement = chatRoom.value.lastElementChild
          lastElement.scrollIntoView()
        })
        flag = null;
      }
    };
    //关闭事件
    socket.onclose = function () {
      stopHeartbeat();
      setTimeout(init, 5000); // 5秒后重连
    };
    //发生了错误事件
    socket.onerror = function () {
      showFailToast("发生了错误")
    }
  }
}

const send = () => {
  if (stats.value.chatUser.id === 0) {
    return;
  }
  if (stats.value.chatUser.id === stats.value.user.id) {
    showFailToast("不能给自己发信息")
    return;
  }
  if (!stats.value.text.trim()) {
    showFailToast("请输入内容")
  } else {
    if (typeof (WebSocket) == "undefined") {
      showFailToast("您的浏览器不支持WebSocket")
    } else {
      let message = {
        fromId: stats.value.user.id,
        toId: stats.value.chatUser.id,
        text: stats.value.text,
        chatType: stats.value.chatType,
        teamId: stats.value.team.teamId,
      }
      socket.send(JSON.stringify(message));
      stats.value.messages.push({user: stats.value.user.id, text: stats.value.text})
      createContent(null, stats.value.user, stats.value.text)
      stats.value.text = '';
      nextTick(() => {
        const lastElement = chatRoom.value.lastElementChild
        lastElement.scrollIntoView()
      })
    }
  }
}

const showUser = (id) => {
  router.push({
    path: '/user/detail',
    query: {
      id: id
    }
  })
}

/**
 * 这个方法是用来将 json的聊天消息数据转换成 html的。
 */
const createContent = (remoteUser, nowUser, text, isAdmin, createTime) => {
  // 当前用户消息
  let html;
  if (nowUser) {
    // nowUser 表示是否显示当前用户发送的聊天消息，绿色气泡
    html = `
    <div class="message self">
    <div class="myInfo info">
      <img :alt=${nowUser.username} class="avatar" onclick="showUser(${nowUser.id})" src=${nowUser.avatarUrl}>
    </div>
      <p class="text">${text}</p>
    </div>
`
  } else if (remoteUser) {
    // remoteUser表示远程用户聊天消息，灰色的气泡
    html = `
     <div class="message other">
      <img :alt=${remoteUser.username} class="avatar" onclick="showUser(${remoteUser.id})" src=${remoteUser.avatarUrl}>
    <div class="info">
      <span class="username">${remoteUser.username.length < 10 ? remoteUser.username : remoteUser.username}&nbsp;&nbsp;&nbsp;${createTime ? createTime : ""}</span>
      <p class="${isAdmin ? 'admin text' : 'text'}" >${text}</p>
    </div>
    </div>
`
  }
  stats.value.content += html;
}
window.showUser = showUser
</script>
<style>

.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.message {
  display: flex;
  align-items: center;
  margin: 10px;
}

.content {
  padding-top: 5px;
  padding-bottom: 40px;
  display: flex;
  flex-direction: column
}

.heard {
  height: 30px;
  align-self: center;
  font-size: 18px;
  text-align: center;
  line-height: 30px;
}

.other {
  align-self: flex-start;
}

.self {
  align-self: flex-end;
}

.avatar {
  align-self: flex-start;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
  margin-left: 10px;
}

.text {
  padding: 10px;
  border-radius: 10px;
  background-color: #eee;
  word-wrap: break-word;
  word-break: break-all;
}

.other .text {
  order: 2;
}

.self .text {
  background-color: #0084ff;
  color: #fff;
}

.other .avatar {
  margin-right: 10px;
}

.self .avatar {
  order: 2;
  margin-left: 10px;
}

.input-text {
  width: 100%;
  border: none;
  padding: 7px 10px;
  outline: none;
  resize: none;
  max-height: 130px;
  overflow-y: auto;
  font-size: 15px;

}

.input-send-button {
  height: 51px;
  background-color: #ffffff;
  color: #0094fe;
  width: 60px;
  padding-right: 3px;
}

.send {
  height: 60px;
  width: 100%;
  flex: 1;
  position: fixed;
  bottom: 20px;
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}
</style>
