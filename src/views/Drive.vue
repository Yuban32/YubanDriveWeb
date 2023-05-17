<template>
  <div id="drive-wrap">
    <!-- menu -->
    <el-container>
      <el-aside width="240px">
        <div class="grid-content ep-bg-purple el-menu-wrap">
          <div class="app-title">
            <h1 @click="router.push('/folder?folderUUID=root')" title="返回首页" style="cursor: pointer; user-select: none;">
              Yuban Drive</h1>
          </div>
          <el-menu :default-active="defaultActive" class="el-menu" @select="handleSelect">
            <el-menu-item index="/folder">
              <el-icon>
                <Files />
              </el-icon>
              <p>文件</p>
            </el-menu-item>
            <el-menu-item index="/fileRecycle">
              <el-icon>
                <Delete />
              </el-icon>
              <p>回收站</p>
            </el-menu-item>
          </el-menu>
          <div class="userProfile-wrap">
            <el-switch size="large" inline-prompt v-model="theme" :active-icon="Sunny" :inactive-icon="Moon"
              @click="toggle()" active-color="#2c2c2c">
            </el-switch>
            <div class="user-storage-info">
              <div class="storage-info">
                <p>{{ (userData?.usedStorage / 1024 / 1024 / 1024).toFixed(2) }}GB / {{ (userData?.totalStorage / 1024 /
                  1024 / 1024).toFixed(2) }}GB</p>
                <el-progress :stroke-width="6" :percentage="percentage" :show-text="false" />
              </div>
              <div class="user-info-wrap">
                <div class="user-info">
                  <img :src="userData?.avatar" alt="用户头像">
                  <span>{{ userData?.username }}</span>
                  <el-dropdown trigger="click" style="cursor: pointer;">
                    <el-icon size="20px">
                      <More />
                    </el-icon>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="toUserPage">用户中心</el-dropdown-item>
                        <el-dropdown-item v-if="userData.role == 'admin'"
                          @click="router.push('/ControllPanel/UserManagement')">后台系统</el-dropdown-item>
                        <el-dropdown-item @click="handleLogout">退出登录</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div class="el-header-top">
            <h1>{{ title }}</h1>
          </div>
        </el-header>
        <el-main>
          <router-view :key="$route.fullPath"></router-view>
        </el-main>
      </el-container>
    </el-container>

  </div>
</template>
<script lang="ts" setup>

/*
* import module 
*/
import {
  Files, Sunny, Moon, Delete, More
} from '@element-plus/icons-vue';
import { useToggle } from '@vueuse/core';
import { useDark } from '@vueuse/core';
import { ref, onBeforeMount, computed } from 'vue';
import { useStore } from "vuex";
import { key } from "../vuex/store";
import { useRoute, useRouter } from 'vue-router';
import emitter from '../utils/eventBus';
import { getUserInfo, logout } from '../axios/userAPIList';

//退出登录
const handleLogout = () => {
  ElMessageBox.confirm(
    '确定要退出吗?',
    '退出登录',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    logout()
  }).catch(() => {
    ElMessage({ type: 'info', message: '取消退出' })
  })
}

//router
const router = useRouter();
const route = useRoute();
//设置title
const title = ref();
if (route.name == "FileRecycle") title.value = "回收站";
if (route.name == "Folder") title.value = "文件"

//Menu菜单默认高亮页面
const defaultActive = computed(() => { return route.path })

const toUserPage = () => {
  router.push({
    path: '/users'
  })
  title.value = "用户中心"
}

const handleSelect = (key: string) => {
  if (key == "/folder") {
    router.push({
      path: key,
      query: {
        folderUUID
      }
    })
  } else if (key == "/fileRecycle") {
    router.push({
      path: key
    })

  }
}

// vuex
const store = useStore(key);
//用户数据
const userData = ref();
//文件夹数据
let folderUUID: string
//主题切换
const theme = ref<boolean>(false);
const isDark = useDark({
  storageKey: 'useDarkKEY',
  valueDark: 'dark',
  valueLight: 'light'
});
const toggle = useToggle(isDark);
const percentage = ref(0);
//初始化用户数据
const initUserData = async () => {
  let result = await getUserInfo()
  store.commit("setUserData", result);
  let data = localStorage.getItem("userData");
  userData.value = data != null ? JSON.parse(data) : {};
  percentage.value = Math.round((parseFloat(userData.value.usedStorage) / parseFloat(userData.value.totalStorage)) * 100)
}
//文件上传后需要再更新一次用户数据
//因为需要更新用户存储配额信息
emitter.on("reloadFileList", () => {
  initUserData();
})
//DOM渲染前初始化数据
onBeforeMount(() => {
  if (route.path == "/user") title.value = "用户中心"
  //初始化主题功能
  let switchValue = localStorage.getItem("useDarkKEY")
  if (switchValue == "auto") {
    theme.value = false
  } else if (switchValue == "light") {
    theme.value = true
  }
  //初始化用户数据
  initUserData()
  //还要再执行一次 不然会undefined
  let data = localStorage.getItem("userData");
  userData.value = data != null ? JSON.parse(data) : {};

  //初始化文件浏览数据
  if (sessionStorage.getItem("folderUUID") != null) {
    folderUUID = sessionStorage.getItem("folderUUID")!;
  } else {
    sessionStorage.setItem("folderUUID", "root");
  }
  if (route.path == "/") {
    router.push({
      path: "/folder",
      query: {
        folderUUID
      }
    })
  }
})
</script>
<style scoped>
#drive-wrap {
  height: 100vh;
  display: flex;
  position: relative;
  box-sizing: border-box;
}
.el-main{
  padding: 0 20px 20px 20px;
}

.el-header-top {
  display: flex;
  width: 100%;
  position: relative;
}

.el-header {
  font-size: 18px;
  line-height: 60px;
}

.grid-content {
  border-radius: 4px;
  height: 100%;
  background-color: var(--el-bg-color-page);
  display: flex;
  flex-direction: column;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.grid-content .app-title {
  font-size: 25px;
  line-height: 25px;
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.el-menu-item.is-active {
  background-color: var(--el-menu-hover-bg-color);
}

.el-menu {
  /* height: 100%; */
  /* padding-top: 50px; */
  flex: 10;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: none;
}

.el-menu-item {
  width: 225px;
  margin-top: 5px;
  justify-content: center;
  font-size: 20px;
  border-radius: 15px;
}

.userProfile-wrap {
  box-sizing: border-box;
  padding: 0 10px;
  height: 176px;
  width: 240px;
  background-color: var(--el-bg-color-page);
  /* border: 1px solid gray; */
  display: flex;
  flex-direction: column;
  text-align: center;
  align-items: center;
}

.user-storage-info {
  width: 100%;
  font-size: 12px;
}

.el-progress {
  padding: 20px 0;
  width: 100%;
}

.user-info {
  padding: 20px 0;
  border-top: 2px solid var(--el-menu-border-color);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  user-select: none;
}

.user-info>img {
  width: 32px;
  height: 32px;
  margin-right: 10px;
  border-radius: 50%;
  background-color: #f2f3f5;
}

.el-icon {
  margin-left: 5px;

}

.user-info-wrap {
  transition: background .3s;

}

.user-info-wrap:hover {
  border-radius: 15px;
  background: var(--el-menu-hover-bg-color);
}

</style>
  