<template>
  <div id="user-management-wrap">
    <el-card>
      <h1>用户管理</h1>
      <el-table :data="filterTableData" style="width: 100%" fit>
        <el-table-column prop="id" label="ID" width="50" />
        <el-table-column prop="username" label="用户名" width="100" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="role" label="角色" width="100" />
        <el-table-column prop="status" label="0==未冻结;1==冻结" width="100" />
        <el-table-column prop="usedStorage" label="已用空间" width="180" />
        <el-table-column prop="totalStorage" label="总空间" width="180" />
        <el-table-column align="right" min-width="140" fixed="right">
          <template #header>
            <el-input
              v-model="search"
              size="small"
              placeholder="按用户名搜索"
            />
          </template>
          <template #default="scope">
            <el-button
              size="small"
              @click="handleUserEdit(scope.$index, scope.row)"
              >编辑</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <EditPanel
      :userEditFormProps="userEditData"
      v-if="closePanel"
      @close-panel="handlerClosePanel"
      @result-User-Info="handlerResultUserInfo"
    ></EditPanel>
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref, computed } from "vue";
import { getUserList, userDelete } from "../../axios/adminManagement";
import { getUserInfo } from "../../axios/userAPIList";
import EditPanel from "./UserEditPanel.vue";
//用户数据
let userList: any[] = reactive([]);
let ownInfo: any = ref();
const search = ref("");
//过滤后的用户数据
const filterTableData = computed(() =>
  userList.filter(
    (data) =>
      !search.value ||
      data.username.toLowerCase().includes(search.value.toLowerCase())
  )
);
interface User {
  id: number;
  username: string;
  email: string;
  roles: string;
  usedStorage: string;
  totalStorage: string;
}
//用户编辑
const closePanel = ref(false);
const handlerClosePanel = (data: any) => {
  closePanel.value = !data;
};
//子组件返回数据
const handlerResultUserInfo = (data: any) => {};
let userEditData = ref();
const handleUserEdit = (index: number, row: User) => {
  userEditData.value = row;
  closePanel.value = true;
};

const handleDelete = (index: number, row: User) => {
  console.log(row);

  ElMessageBox.confirm("此操作不可逆,确认删除吗?", "永久删除用户", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      if (row.username == ownInfo.value.username) {
        ElMessage({
            type:'warning',
            message:'不允许在此编辑自己的信息'
            
        })
      } else {
        let params: String = JSON.stringify({
          userId: row.id,
        });
        let data = await userDelete(params);
      }
    })
    .catch(() => {
      ElMessage({
        type: "info",
        message: "取消删除",
      });
    });
};
onBeforeMount(async () => {
  let data: any[] = await getUserList();
  if (data != undefined) {
    data = Object.values(data);
    userList.push(...data);
  }
  const localOwnInfoData = localStorage.getItem("userData");
  if (localOwnInfoData == null) {
    ownInfo.value = await getUserInfo();
    console.log("不存在");
  } else {
    ownInfo.value = JSON.parse(localOwnInfoData);
  }
});
</script>

<style scoped>
#user-management-wrap {
  /* 减去header60px和el-main的上下padding=40 */
  min-height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

h1 {
  margin-bottom: 15px;
  text-align: center;
}

.el-card {
  width: 100%;
  min-height: 200px;
}
</style>
