<template>
    <div id="modify-userinfo-wrap">
        <el-card>

            <el-form ref="formRef" :model="rules" status-icon :rules="rules" label-width="120px"
                label-position="top" class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="rules.username" type="text" autocomplete="off" />
                </el-form-item>
                <el-form-item label="邮箱地址" prop="email">
                    <el-input v-model="rules.email" type="email" autocomplete="off" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit(formRef)">提交</el-button>
                </el-form-item>
            </el-form>

        </el-card>
    </div>
</template>

<script setup lang="ts">
import {reactive, ref} from "vue";
import { FormRules,FormInstance } from "element-plus";
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    username: [{ required:true, message:"用户名不能为空", trigger: 'blur' }],
    email: [{ required: true, message: "邮箱不能为空", trigger: "blur" }, { type: 'email', message: "邮箱格式不正确", trigger: "blur" }],
})

const submit = (formEl: FormInstance | undefined)=>{
    console.log(1);
    
}
</script>

<style scoped>
#modify-userinfo-wrap{
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
    background-color: var(--el-bg-color-page);
    text-align: center;
}
.el-button{
    width: 100%;
}
</style>