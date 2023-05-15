<template>
    <div id="login-wrap">

        <div class="login-container">
            <el-tabs stretch>
                <el-tab-pane label="Login">
                    <el-form ref="loginRuleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                        label-position="top" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="ruleForm.password" type="password" autocomplete="off" @keyup.enter.native="loginSubmitForm(loginRuleFormRef)" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="loginSubmitForm(loginRuleFormRef)">提交</el-button>
                            <el-button @click="registerResetForm(loginRuleFormRef)">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="Register">
                    <el-form ref="registerRuleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="120px"
                        label-position="top" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="邮箱地址" prop="email">
                            <el-input v-model="ruleForm.email" type="email" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
                        </el-form-item>
                        <el-form-item label="确认密码" prop="checkPassword">
                            <el-input v-model="ruleForm.checkPassword" type="password" autocomplete="off" />
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="registerSubmitForm(registerRuleFormRef)">提交</el-button>
                            <el-button @click="registerResetForm(registerRuleFormRef)">重置</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>

        </div>


    </div>
</template>

<script setup lang="ts">
import { login, register } from "../axios/userAPIList";
import { FormInstance, FormRules } from "element-plus";
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import { key } from "../vuex/store"
import { useRouter } from "vue-router";
const loginRuleFormRef = ref<FormInstance>();
const registerRuleFormRef = ref<FormInstance>();
//vuex
const store = useStore(key);
//vue-router
const router = useRouter();
//data
const ruleForm = reactive({
    username: '',
    email: '',
    password: '',
    checkPassword: '',

})
//校验方法
const validatePassword2 = (rule: any, value: any, callback: any) => {
    if (value !== ruleForm.password) {
        callback(new Error("输入的密码不匹配"))
    } else {
        callback()
    }
}
//element-plus提供的校验方法
const rules = reactive<FormRules>({
    username: [{ required:true, message:"用户名不能为空", trigger: 'blur' }, { required: true }],
    email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }, { type: 'email', message: "邮箱格式不正确", trigger: "blur" }],
    password: [{ required: true, message: "密码不能为空", trigger: "blur" },  { min: 6, max: 17, message: "密码只能在6~16之间", trigger: 'blur' }],
    checkPassword: [{ required: true, message: "密码不能为空", trigger: "blur" }, { validator: validatePassword2, trigger: 'blur' }],
})

//业务区
/**
 * 登录
 */
const loginSubmitForm = (formEl : FormInstance | undefined) =>{
    if(!formEl) return;
    formEl.validate((valid)=>{
        if(valid){
            
            let param:String = JSON.stringify({
                username:ruleForm.username,
                password:ruleForm.password,
            });
            login(param).then((result:any) => {
                console.log(result);
                
                let data = result.data;
                let code = data.code;
                let userData = data.data;
                if(code == 500){
                    ElMessage({
                        message:data.msg,
                        type:'warning'
                    })
                    return
                }else{
                    let authorization = result.headers['authorization'];
                    store.commit("setJwtToken",authorization);
                    store.commit("setUserData",userData);
                    router.push({
                        path:"/"
                    })
                }
               
                
            }).catch((err:any) => {
                console.log(err);
            });
            
        }
    })
}

/**
 * 注册
 */
const registerSubmitForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.validate((valid) => {
        if (valid) {
            let param:string = JSON.stringify({
                username:ruleForm.username,
                password:ruleForm.password,
                email:ruleForm.email
            });
            register(param).then((result:any) => {
                let data = result.data;
                let code = data.code;
                let msgType:any = '';
                if(code == 500){
                    msgType = 'warning'
                }else{
                    msgType = 'success'
                }
                    ElMessage({
                        message:data.msg,
                        type:msgType
                    })
                    
            }).catch((err:any) => {
                
            });
        }
    })
}

const registerResetForm = (formEl: FormInstance | undefined) => {
    if (!formEl) return
    formEl.resetFields()
}

</script>

<style scoped>
#login-wrap {
    width: 100vw;
    height: 100vh;
    background-color: #ecefff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.login-container {
    padding: 22px;
    width: 50%;
    max-width: 500px;
    border-radius: 12px;
    background-color: #ffffff;
}
::v-deep(.el-form-item__content>button){
    flex: 1;
} 
</style>