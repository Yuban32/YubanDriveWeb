<template>
    <div>
        <div id="user-center-wrap">
            <el-card class="user-info-wrap">
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
                    <el-button type="primary" @click="showEditPanel = true">修改信息</el-button>
                    <el-button type="primary" v-if="userInfo.role == 'admin'"
                        @click="router.push('/ControllPanel/UserManagement')">进入后台</el-button>
                </div>
            </el-card>
            <el-card v-if="showEditPanel" class="user-edit-panel">

                <el-form ref="formRef" :model="userForm" status-icon :rules="rules" label-width="120px" label-position="top"
                    class="demo-ruleForm">
                    <el-form-item label="用户名" prop="username">
                        <el-input v-model="userForm.username" type="text" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="是否修改头像">
                        <el-switch v-model="userForm.isChangeAvatar" />
                    </el-form-item>
                    <el-form-item label="修改头像" id="avatar-uploader-wrap" v-if="userForm.isChangeAvatar">
                        <div @click="fileInputEl.click()" class="avatar-uploader">
                            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
                            <el-icon v-else class="avatar-uploader-icon">
                                <Plus />
                            </el-icon>
                        </div>
                        <input ref="fileInputEl" type="file" @change="handleFileUpload($event as InputEvent)"
                            accept=".jpg, .jpeg, .png" style="display: none;">
                    </el-form-item>
                    <el-form-item label="是否修改密码">
                        <el-switch v-model="userForm.isChangePassword" />
                    </el-form-item>
                    <el-form-item label="请输入密码" v-if="userForm.isChangePassword" prop="password">
                        <el-input v-model="userForm.password" type="password" />
                    </el-form-item>
                    <el-form-item label="请确认密码" v-if="userForm.isChangePassword" prop="checkPassword">
                        <el-input v-model="userForm.checkPassword" type="password" />
                    </el-form-item>
                    <el-form-item label="邮箱地址" prop="email">
                        <el-input v-model="userForm.email" type="email" autocomplete="off" />
                    </el-form-item>
                    <el-form-item class="submit-btn">
                        <el-button type="primary" @click="submit(formRef)">提交</el-button>
                        <el-button type="primary" @click="showEditPanel = !showEditPanel">返回</el-button>
                    </el-form-item>
                </el-form>

            </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, reactive, watch } from "vue";
import { getUserInfo, UserEdit, logout } from "../axios/userAPIList";
import { useStore } from "vuex";
import { key } from "../vuex/store"
import { useRouter } from "vue-router";
import { FormRules, FormInstance } from "element-plus";
import { UserEditDTO } from "../interface/Interface";
import { Plus } from '@element-plus/icons-vue'



//用户数据
const router = useRouter();
let userInfo = ref();
userInfo.value = JSON.parse(localStorage.getItem("userData") as string);
const store = useStore(key);
let timer;



//修改个人信息
const showEditPanel = ref(false);
const fileInputEl = ref()
const formRef = ref<FormInstance>()
//数据
const userForm = reactive({
    isChangePassword: false,
    isChangeAvatar: false,
    username: userInfo.value.username,
    email: userInfo.value.email,
    password: '',
    checkPassword: '',
    avatar: userInfo.value.avatar,
})
const validatePassword = (rule: any, value: any, callback: any) => {
    console.log(rule);

    if (value !== userForm.password) {
        callback(new Error("输入的密码不匹配"))
    } else {
        callback()
    }
}
//校验规则
const rules = reactive<FormRules>({
    username: [{ required: true, message: "用户名不能为空", trigger: 'blur' }],
    email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }, { type: 'email', message: "邮箱格式不正确", trigger: "blur" }],
    password: [{ required: true, message: "密码不能为空", trigger: 'blur' }, { min: 6, max: 17, message: "密码只能在6~16之间", trigger: 'blur' }],
    checkPassword: [{ required: true, message: "密码确认失败", trigger: 'blur' }, { validator: validatePassword, trigger: 'blur' }]
})
watch(userForm, (newValue, oldValue) => {
    if (newValue.isChangePassword) {
        ElMessage({ type: 'error', message: '修改密码会导致当前账号退出系统' })
    }

})

const submit = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            ElMessageBox.confirm(
                '确认要提交修改吗?',
                '用户信息修改',
                {
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    type: 'warning'
                }
            ).then(async () => {
                let params: String = JSON.stringify({
                    id: userInfo.value.id,
                    username: userForm.username == userInfo.value.username ? '' : userForm.username,
                    password: userForm.password,
                    avatar: (userForm as unknown as UserEditDTO).avatar,
                    email: (userForm as unknown as UserEditDTO).email
                })
                let result = await UserEdit(params)
                userInfo.value = result.data
                if (userForm.password != "") {
                    logout()
                }
            })
        }
    })

}
//修改头像
const imageUrl = ref('')
const handleFileUpload = (e: InputEvent) => {
    const files = (e.target as HTMLInputElement | null)?.files;
    //判空
    if (files && files.length) {
        const file = files[0]
        //判断是否是图片
        if (file.type.includes("image")) {
            if (file.size / 1024 / 1024 > 2) {
                ElMessage.error('上传的图片不能超过2MB')
            } else {
                const reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = () => {
                    imageUrl.value = reader.result as string
                    console.log(imageUrl.value);

                }
                reader.onerror = () => {
                    console.error(reader.error);

                }
            }

        } else {
            ElMessage.error('只能上传图片格式')
        }
    }
}
//初始化数据
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
    position: relative;
}

.user-info-wrap {
    min-height: 300px;
    min-width: 300px;
    display: flex;
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;
    background-color: var(--el-bg-color-page);
    text-align: center;
}

.el-card {

    background-color: var(--el-bg-color-page);
    text-align: center;
}

p {
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

.el-progress {
    margin-bottom: 10px;
}

.image>img {
    height: 100%;
    border-radius: 50%;
    background-color: #f2f3f5;

}

.user-edit-panel {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 99;
    width: 500px;
}

::v-deep(.el-form-item__content>button) {
    flex: 1;
}

/* 头像上传 */
#avatar-uploader-wrap ::v-deep(.el-form-item__content) {
    justify-content: center;
}

.avatar-uploader {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    text-align: center;
}

.avatar-uploader .avatar {
    width: 150px;
    height: 150px;
    display: block;
}
</style>