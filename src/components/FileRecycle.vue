<template>
    <div id="file-recycle-wrap" :class="isEmpty ? 'flex-center' : ''">
        <el-empty description="空目录" v-if="isEmpty" class="el-empty" />
        <el-row v-if="!isEmpty">
            <div v-for="( item ) in folderList" :key="item.fileUUID" class="el-card-wrap">
                <el-card :body-style="{ padding: '5px' }" shadow="hover">
                    <div @click.stop>
                        <el-dropdown trigger="click" ref="dropdown" :prevent-hide="true">
                            <el-button :icon="Plus" circle size="small" class="dash" ref="elButtonDropdown" />
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="restore(item)">
                                        恢复
                                    </el-dropdown-item>
                                    <el-dropdown-item style="color:orangered" @click="trash(item)">
                                        彻底删除
                                    </el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="img-wrap">
                        <el-image :src="item.thumbnailURL" class="image" ref="elImages" :preview-teleported="true" />
                    </div>
                    <div>
                        <el-text class="w-115px" truncated>{{ item.name }}</el-text>
                        <time class="time">{{ dateTimeFormat(item.createdTime) }}</time>
                    </div>
                </el-card>
            </div>
        </el-row>
    </div>
</template>

<script setup lang="ts">
import { CirclePlus, Plus } from "@element-plus/icons-vue"
import { getRecycleListAPI,trashAPI ,restoreAPI} from "../axios/recycleAPIList";
import { onBeforeMount, onMounted, reactive, ref } from "vue"
import { FileListDTO } from "../interface/Interface";
import { dateTimeFormat } from "../utils/util";


let isEmpty = ref<boolean>(false);

let folderList: any[] = reactive([]);
let imageList: any[] = reactive([]);

//恢复
const restore = async(item:any) =>{
    let data = await restoreAPI(item.fileUUID,item.type);
    if (data.code == 200) {
        const index = folderList.findIndex((items) => items.fileUUID == item.fileUUID);
        if (index >= 0) {
            folderList.splice(index, 1);
            if(folderList.length == 0)
                isEmpty.value = true;
        }
    }
}

//永久删除
const trash = (item: any) => {

    ElMessageBox.confirm(
        '确定要永久删除文件吗',
        '删除文件',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    ).then(async()=>{
        
    let data = await trashAPI(item.fileUUID);
    if (data.code == 200) {
        const index = folderList.findIndex((items) => items.fileUUID == item.fileUUID);
        if (index >= 0) {
            folderList.splice(index, 1);
            if(folderList.length == 0)
                isEmpty.value = true;
        }
    }
    }).catch(()=>{
        ElMessage({
            type:'info',
            message:'取消删除'
        })
    })

}

const elImages = ref()
//处理静态资源
const getAssetsFile = (url: String) => {
    return new URL(`../assets/image/${url}`, import.meta.url).href;
}
const zipImg = getAssetsFile("zip.png")
const folderImg = getAssetsFile("folderImage.png")
const otherTypeFile = getAssetsFile("otherType.png")
//卡片点击事件


onBeforeMount(async () => {
    console.log(otherTypeFile);
    //初始化获取文件夹列表
    let folderData: any[] = await getRecycleListAPI();
    if (folderData != undefined) {
        folderData = Object.values(folderData);
        folderData.forEach((item) => {
            if (item.type.includes('folder')) {
                item.thumbnailURL = folderImg
            }
            if (item.type.includes('file')) {
                if (item.category.includes('zip')) {
                    item.thumbnailURL = zipImg;
                } else if (item.category.includes("image")) {
                    item.thumbnailURL = `http://${item.thumbnailURL}`;
                    item.fullSizeImageURL = `http://${item.fullSizeImageURL}`;
                    imageList.push(item.fullSizeImageURL);
                } else {
                    item.thumbnailURL = otherTypeFile;
                }
            }

        })
        folderList.push(...folderData)
    }
    folderList.length == 0 ? isEmpty.value = true : isEmpty.value = false;
})
</script>

<style scoped>
#file-wrap {
    height: 100%;
    width: 100%;
    position: relative;
}

.flex-center {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
}

.el-card {
    width: 125px;
    border: none;
    margin-left: 10px;
    margin-bottom: 10px;
    cursor: pointer;
    position: relative;
    text-align: center;
}

.el-card:hover .dash {
    opacity: 1;
    visibility: visible;
}

.el-dropdown {
    position: absolute;
    right: 35px;
    top: 10px;
}

.el-card .dash {
    text-align: center;
    position: absolute;

    background-color: var(--el-bg-color-page);
    opacity: 0;
    visibility: hidden;
    transition: all .3s;
    z-index: 99;
}

.image {
    height: 100%;
    border-radius: 10px;
}

.img-wrap {
    width: 115px;
    height: 90px;
    overflow: hidden;
    border-radius: 10px;
}

.item-info {
    display: flex;
    flex-direction: column;
}

.time {
    font-size: 12px;
    color: gray;
}
</style>