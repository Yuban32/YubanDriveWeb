<template>
    <div id="user-management-wrap">
        <el-card>
            <h1>存储管理</h1>
            <el-table :data="filterTableData" style="width: 100%;height: 100%;" show-overflow-tooltip>

                <el-table-column prop="fileUUID" label="FileUUID" width="150" />
                <el-table-column fixed prop="name" label="文件名" width="150" />
                <el-table-column prop="category" label="类型" width="150" />
                <el-table-column prop="type" label="文件类型" width="150" />
                <el-table-column prop="size" label="文件大小" width="100" />
                <el-table-column prop="uploader" label="上传者" width="150" />
                <el-table-column prop="relativePath" label="路径" width="150" />
                <el-table-column prop="parentFileUUID" label="父文件UUID" width="150" />
                <el-table-column prop="fullSizeImageURL" label="完整图片路径" width="150" />
                <el-table-column prop="thumbnailURL" label="缩略图路径" width="150" />
                <el-table-column prop="createdTime" label="上传时间" width="180" />
                <el-table-column align="center" fixed="right" width="140">
                    <template #header>
                        <el-input v-model="search" size="small" placeholder="按用户名搜索" />
                    </template>
                    <template #default="scope">
                        <el-button size="small" type="danger"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <StorageEditPanel v-if="false" />
    </div>
</template>

<script setup lang="ts">
//import
import { onBeforeMount, reactive, ref, computed } from "vue";
import { getAllUserFileListAPI } from "../../axios/fileAPIList";
import { getAllUserFolderAPI } from "../../axios/folderAPIList";
import StorageEditPanel from "./StorageEditPanel.vue";
import item from "element-plus/es/components/space/src/item";
import { trashAPI } from "../../axios/recycleAPIList";

//过滤
const search = ref('')
const filterTableData = computed(() =>
    folderList.filter(
        (data) =>
            !search.value ||
            data.uploader.toLowerCase().includes(search.value.toLowerCase())
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
const handleDelete = async (index: number, row: any) => {
    console.log(index, row)
    ElMessageBox.confirm(
        '此操作不可逆,确认要删除吗?',
        '永久删除文件',{
            confirmButtonText:'确认',
            cancelButtonText:'取消',
            type: 'warning'
        }).then( async()=>{
            let data = await trashAPI(item.fileUUID);
            console.log(data);
            

        }).catch(()=>{
            ElMessage({type:'info',message:'取消删除'})
        })
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
            } else if (item.category.includes("image")) {
                item.thumbnailURL = `http://${item.thumbnailURL}`;
                item.fullSizeImageURL = `http://${item.fullSizeImageURL}`;
                imageList.push(item.fullSizeImageURL);
            } else {
                item.thumbnailURL = otherTypeFile;
            }


        })

        folderList.push(...fileData);
    }
})
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