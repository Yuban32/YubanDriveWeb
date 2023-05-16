<template>
  <el-card id="edit-panel-wrap">
    <el-form ref="userEditFormRef" label-position="left" :model="ruleForm" status-icon :rules="rules" label-width="120px"
      class="demo-ruleForm">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="ruleForm.username" type="username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="ruleForm.email" type="email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="是否修改密码">
        <el-switch v-model="ruleForm.isResetPassword" />
      </el-form-item>
      <el-form-item label="请输入密码" v-if="ruleForm.isResetPassword" prop="pwd">
        <el-input v-model="ruleForm.pwd" type="password" />
      </el-form-item>
      <el-form-item label="请确认密码" v-if="ruleForm.isResetPassword" prop="checkPwd">
        <el-input v-model="ruleForm.checkPwd" type="password" />
      </el-form-item>
      <el-form-item label="存储配额" prop="totalStorage">
        <el-text>单位: Byte</el-text>
        <el-input v-model.number="ruleForm.totalStorage" />
      </el-form-item>
      <el-form-item label="选择用户角色">
        <el-select v-model="ruleForm.role" placeholder="选择用户角色">
          <el-option label="用户" value="user" />
          <el-option label="管理员" value="admin" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户状态">
        <el-select v-model="ruleForm.status" placeholder="选择用户状态">
          <el-option label="未冻结" value="0" />
          <el-option label="冻结" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm(userEditFormRef)">修改</el-button>
        <el-button @click="close">返回</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { AdminUserEdit } from '../../axios/userAPIList';
import { AdminUserEditDTO } from '../../interface/Interface';
//接口
interface RuleFormPropsInterface {
  id?: number
  username?: string;
  email?: string;
  pwd?: string;
  checkPwd?: string;
  totalStorage?: string;
  status?: number;
  isResetPassword?: boolean;
  role?: string;
}
//Data
const isClose = ref();
const userEditFormRef = ref<FormInstance>()
const ruleFormProps = defineProps({
  userEditFormProps: {
    type: Object,
    defualt: {
      username: {
        type: String,
        defualt: ""
      },
      email: {
        type: String,
        defualt: ""
      },
      pwd: {
        type: String,
        defualt: ""
      },
      checkPwd: {
        type: String,
        defualt: ""
      }, totalStorage: {
        type: String,
        defualt: ""
      }, status: {
        type: Number,
        defualt: ""
      }, isResetPassword: {
        type: Boolean,
        defualt: false
      }, role: {
        type: String,
        defualt: ""
      }
    }
  }
})
const emit = defineEmits(['closePanel', 'resultUserInfo'])
//将Props数据转成reactive 避免readonly错误
const ruleForm: RuleFormPropsInterface = reactive(ruleFormProps.userEditFormProps as object)
const validatePassword2 = (rule: any, value: any, callback: any) => {
  if (value !== ruleForm.pwd) {
    callback(new Error("输入的密码不匹配"))
  } else {
    callback()
  }
}
//校验规则
const rules = reactive<FormRules>({
  username: [{ required: true, message: "用户名不能为空", trigger: 'blur' }],
  email: [{ required: true, message: "邮箱不能为空", trigger: 'blur' }, { type: 'email', message: "邮箱格式不正确", trigger: "blur" }],
  pwd: [{ required: true, message: "密码不能为空", trigger: 'blur' }, { min: 6, max: 17, message: "密码只能在6~16之间", trigger: 'blur' }],
  role:[{required:true,message:'用户角色不能为空', trigger: 'blur'}],
  status:[{required:true,message:'用户状态不能为空', trigger: 'blur'}],
  checkPwd: [{ required: true, message: "密码确认失败", trigger: 'blur' }, { validator: validatePassword2, trigger: 'blur' }],
  totalStorage: [{ required: true, message: "总配额不能为空", trigger: 'blur' }],
})
//提交
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      ElMessageBox.confirm(
        '确认提交修改吗?',
        '修改用户',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(async () => {
        let params: String = JSON.stringify({
          id: ruleForm.id,
          username: ruleForm.username,
          password: ruleForm.pwd,
          avatar: (ruleForm as unknown as AdminUserEditDTO).avatar,
          email: (ruleForm as unknown as AdminUserEditDTO).email,
          role: ruleForm.role,
          status: (ruleForm as unknown as AdminUserEditDTO).status,
          totalStorage: (ruleForm as unknown as AdminUserEditDTO).totalStorage
        })
        let result = await AdminUserEdit(params)
        //修改成功后把回显数据返回到父组件
        emit("resultUserInfo", result.data)
        emit("closePanel", true)

      }).catch(() => {
        ElMessage({
          type: 'info',
          message: '取消提交'
        })
      })
    } else {
      console.log('error submit!')
      return false
    }
  })
}
//关闭
const close = () => {
  isClose.value = true
  emit("closePanel", true)

}
</script>

<style scoped>
#edit-panel-wrap {
  width: 80%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
}
</style>