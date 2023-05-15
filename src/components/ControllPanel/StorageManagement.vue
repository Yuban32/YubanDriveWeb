<template>
    <div id="user-management-wrap">
        <el-card>
            <h1>存储管理</h1>
            <el-table :data="folderList" style="width: 100%;height: 100%;" show-overflow-tooltip>

                <el-table-column prop="fileUUID" label="FileUUID" width="150" />
                <el-table-column fixed  prop="name" label="文件名" width="150" />
                <el-table-column prop="category" label="类型" width="150" />
                <el-table-column prop="type" label="文件类型" width="150" />
                <el-table-column prop="size" label="文件大小" width="100" />
                <el-table-column prop="uploader" label="上传者" width="150" />
                <el-table-column prop="relativePath" label="路径" width="150" />
                <el-table-column prop="parentFileUUID" label="父文件UUID" width="150" />
                <el-table-column prop="fullSizeImageURL" label="完整图片路径" width="150" />
                <el-table-column prop="thumbnailURL" label="缩略图路径" width="150" />
                <el-table-column prop="createdTime" label="上传时间" width="180" />
                <el-table-column align="right" fixed="right" width="140">
                    <template #header>
                        <el-input v-model="search" size="small" placeholder="Type to search" />
                    </template>
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">Edit</el-button>
                        <el-button size="small" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">Delete</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { onBeforeMount, reactive, ref, computed } from "vue";
import { getUserList,userEdit } from "../../axios/userAPIList";
import { getAllUserFileListAPI } from "../../axios/fileAPIList";
import { getAllUserFolderAPI } from "../../axios/folderAPIList";
let userList: any[] = reactive([]);
const search = ref('')
//过滤
const filterTableData = computed(() =>
    userList.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)

//处理静态资源
const getAssetsFile = (url: String) => {
    return new URL(`../assets/image/${url}`, import.meta.url).href;
}
const zipImg = getAssetsFile("zip.png")
const folderImg = getAssetsFile("folderImage.png")
const otherTypeFile = getAssetsFile("otherType.png")

let folderList: any[] = reactive([]);
let imageList: any[] = reactive([]);
let imgList:any[]=reactive([]);
let taskIsEmpty = ref<boolean>(false);

interface User {
    id: number
    username: string
    email: string
    roles: string
    usedStorage: string
    totalStorage: string
}

const handleEdit = (index: number, row: User) => {
  console.log(index, row)
}
const handleDelete = (index: number, row: User) => {
  console.log(index, row)
}
onBeforeMount(async () => {


       //初始化获取文件夹列表
       let folderData: any[] = await getAllUserFolderAPI();
    if (folderData != undefined) {
        folderData = Object.values(folderData);
        folderData.forEach((item) => {
            item.thumbnailURL = "null"
            item.category = "null"
            item.fullSizeImageURL = "null"
            item.size = "null"
        })
        folderList.push(...folderData)
    }
    //初始化获取文件列表
    let fileData: any[] = await getAllUserFileListAPI();
    if (fileData != undefined) {
        fileData = Object.values(fileData);
        fileData.forEach((item) => {
            if (item.category.includes('zip')) {
                item.thumbnailURL = zipImg;
            } else if(item.category.includes("image")) {
                item.thumbnailURL = `http://${item.thumbnailURL}`;
                item.fullSizeImageURL = `http://${item.fullSizeImageURL}`;
                imageList.push(item.fullSizeImageURL);
            }else{
                item.thumbnailURL = otherTypeFile;
            }

            
        })

        folderList.push(...fileData);
    }

})
</script>

<style scoped>
#user-management-wrap{
    height: 100vh;
}
h1{
    margin-bottom: 15px;
    text-align: center;
}
.el-card {
    width: 100%;
    min-height: 200px;
}
</style>