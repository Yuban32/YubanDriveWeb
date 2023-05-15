<template>
    <div>
        <div id="user-center-wrap">
            <el-card>
                <div class="image">
                    <img :src="userInfo.avatar" alt="">
                </div>
                <div class="userinfo">
                    <p>
                        {{ userInfo.username }}
                    </p>
                    <p>{{ userInfo.email }}</p>
                    <p>{{ (userInfo.usedStorage / 1024 / 1024 / 1024).toFixed(2) }}GB / {{ (userInfo.totalStorage / 1024 /
                        1024 / 1024).toFixed(2) }}GB</p>
                    <el-progress :stroke-width="6" :percentage="(userInfo.usedStorage / userInfo.totalStorage) * 100"
                        :show-text="false" />
                </div>
                <div class="bottom">
                    <el-button type="primary" @click="router.push('/users/modify')">修改信息</el-button>
                    <el-button type="primary" v-if="userInfo.roles == 'admin'" @click="router.push('/ControllPanel/UserManagement')">进入后台</el-button>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { getUserInfo } from "../axios/userAPIList";
import { useStore } from "vuex";
import { key } from "../vuex/store"
import { useRouter } from "vue-router";
const router = useRouter();
let userInfo = ref();
userInfo.value = JSON.parse(localStorage.getItem("userData") as string);
const store = useStore(key);
let timer;
onBeforeMount(() => {
    timer = setTimeout(async () => {
        let userData = await getUserInfo();
        store.commit("setUserData", userData);
        userInfo.value = userData;
        console.log("每隔30秒轮训查询用户信息");
    }, 30000);
})

</script>


<style scoped>
#user-center-wrap {
    height: 75vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.el-card {
    height: 300px;
    width: 300px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    background-color: var(--el-bg-color-page);
    text-align: center;
}
p{
    padding: 10px 0;
}

.image {
    width: 100%;
    height: 100px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;

}
.el-progress{
    margin-bottom: 10px;
}
img {
    height: 100%;
    border-radius: 50%;
    background-color: #f2f3f5;

}</style>