<template>
    <div id="file-wrap" :class="isEmpty ? 'flex-center' : ''">
        <FileUpload :taskIsEmpty="taskIsEmpty"  />
        <el-empty description="空目录" v-if="isEmpty" class="el-empty" />
        <el-row v-if="!isEmpty">
            <div v-for="( item ) in folderList" :key="item.fileUUID" class="el-card-wrap">
                <el-card :body-style="{ padding: '5px' }" shadow="hover" @click="fileClickHandler(item, $event)">
                    <!-- @click.stop可以阻止dropdown的点击事件向上冒泡 -->
                    <div @click.stop>
                        <el-dropdown trigger="click" :prevent-hide="true">
                            <el-button :icon="Plus" circle size="small" class="dash"/>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item @click="downloadBTN(item)">
                                        下载文件
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="renameFiles(item)">
                                        重命名
                                    </el-dropdown-item>
                                    <el-dropdown-item @click="recycle(item)" style="color:orangered">移入回收站</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                    <div class="img-wrap">
                        <el-image :src="item.thumbnailURL" class="image" ref="elImages" :preview-teleported="true"
                            @click="clickImage(item, $event)" :preview-src-list="imgList" />
                    </div>
                    <div class="item-info">
                        <el-text class="w-115px" truncated>{{ item.name }}</el-text>
                        <time class="time">{{ dateTimeFormat(item.createdTime) }}</time>
                    </div>
                </el-card>
            </div>
        </el-row>
    </div>
</template>

<script setup lang="ts">
/**
 * import
 */
import { CirclePlus, Plus } from "@element-plus/icons-vue"
import { getFolderListAPI,renameFolderAPI } from "../axios/folderRequest";
import { getFileListAPI, renameFileAPI } from "../axios/fileRequest";
import { removeFileToRecycleAPI, removeFolderToRecycleAPI} from "../axios/recycleRequest"
import { useRoute, useRouter } from "vue-router";
import { onBeforeMount, onMounted, reactive, ref,toRaw } from "vue"
import { FileListDTO } from "../interface/Interface";
import { dateTimeFormat } from "../utils/util";
import FileUpload from "./FileUpload.vue";
import emitter from "../utils/eventBus";

/**
 * Data
 */
let isEmpty = ref<boolean>(false);

let folderList: any[] = reactive([]);
let imageList: any[] = reactive([]);
let imgList: any[] = reactive([]);
let taskIsEmpty = ref<boolean>(false);
const elImages = ref()

/**
 * common
 */
//处理静态资源
const getAssetsFile = (url: String) => {
    return new URL(`../assets/image/${url}`, import.meta.url).href;
}
//静态图片
const zipImg = getAssetsFile("zip.png")
const folderImg = getAssetsFile("folderImage.png")
const otherTypeFile = getAssetsFile("otherType.png")
const musicImg = getAssetsFile("music.png")
//事件总线 上传完毕后重新加载文件列表
emitter.on("reloadFileList", () => {
    setTimeout(()=>{
        initData();
    },1000)
});

//vue router
const route = useRoute();
const router = useRouter();
//根据UUID去重
const uniqueList = (list:any,target:FileListDTO) =>{
    for(let i = 0; i < list.length; i++){
        if(list[i].fileUUID == target.fileUUID){       
            list[i].name = target.name;
            break;
        }
    }
}
/**
 * 
 * function
 */

//下载函数块
const downloadBTN = (item:FileListDTO)=>{
    //判断类型
    if(item.type == "folder"){
        ElMessage({
            type:"warning",
            message:"暂不支持文件夹下载"
        })
    }else if(item.type == "file"){
        emitter.emit("fileDownload",item)
        
        // filesProps.value = toRaw(item);

    }
}

//重命名文件
const renameFiles = (item: FileListDTO) => {
    let currentFolderUUID: string = route.query.folderUUID as string
    let type:string = "";
    let fileName:string = "";
    let fileExtension:string = "";
    if(item.type == 'folder'){
        type = "文件夹"
        fileName = item.name as string;
    }else if(item.type == 'file'){
        type = "文件"
        fileName = item.name.split(".")[0];
        fileExtension = item.name.split(".")[1] 
    }

    ElMessageBox.prompt(`请输入新的${type}名`, {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputErrorMessage: `请输入${type}名`,
        inputValue:fileName as string
    })
        .then(async({ value }) => {
            if(item.type == 'file'){
                let data:FileListDTO = await renameFileAPI(`${value}.${fileExtension}`,item.name,currentFolderUUID);
                uniqueList(folderList,data);
                
            }else if(item.type == 'folder'){
                let data:FileListDTO =  await renameFolderAPI(item.fileUUID,value);
                uniqueList(folderList,data);
            }

        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消更改',
            })
        })
}

//移入回收站
const recycle = (item: any) => {
    console.log(item.type);
    ElMessageBox.confirm(
        '可在回收站中找回已删文件。',
        '删除文件',
        {
            confirmButtonText: '确定删除',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async() => {
            if (item.type == "file") {
                let folderUUID: string = route.query.folderUUID as string
                //执行对文件的删除
                let data = await removeFileToRecycleAPI(folderUUID,item.name);
                if(data.code == 200){
                    const index = folderList.findIndex((items)=> items.fileUUID == item.fileUUID);
                    if(index >= 0 ){
                        folderList.splice(index,1);
                    }
                }

            } else if (item.type == "folder") {
                //执行对文件夹的删除
                let data = await removeFolderToRecycleAPI(item.fileUUID);
                if(data.code == 200){
                    const index = folderList.findIndex((items)=> items.fileUUID == item.fileUUID);
                    if(index >= 0 ){
                        folderList.splice(index,1);
                    }
                }
            }
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}

//预览图片
const clickImage = (item: any, e: any) => {

    imgList.shift();
    if (item.category != null && item.category.includes("image")) {
        imgList.push(item.fullSizeImageURL)
    }
}

//卡片点击事件
const fileClickHandler = (item: FileListDTO, event: any) => {
    if (event.target != "svg") {
        let folderUUID: any = item.fileUUID;
        if (item.type == "folder") {
            router.push({
                path: "/folder",
                query: {
                    folderUUID
                }
            })
        }
        if (item.type == "file") {
            if (item.category.includes("image")) {
                // console.log(2);

            }
        }
    }
}

const initData = async () => {
    folderList.splice(0, folderList.length);
    let folderUUID: string = route.query.folderUUID as string
    //初始化获取文件夹列表
    let folderData: any[] = await getFolderListAPI(folderUUID);
    if (folderData != undefined) {
        folderData = Object.values(folderData);
        folderData.forEach((item) => {
            item.thumbnailURL = folderImg

        })
        folderList.push(...folderData)
    }
    //初始化获取文件列表
    let fileData: any[] = await getFileListAPI(folderUUID);
    if (fileData != undefined) {
        fileData = Object.values(fileData);
        fileData.forEach((item) => {
            if (item.category.includes('zip')) {
                item.thumbnailURL = zipImg;
            } else if (item.category.includes("image")) {
                item.thumbnailURL = `http://${item.thumbnailURL}`;
                item.fullSizeImageURL = `http://${item.fullSizeImageURL}`;
                imageList.push(item.fullSizeImageURL);
            } else if(item.category.includes("audio")){
                item.thumbnailURL = musicImg;
            }
             else {
                item.thumbnailURL = otherTypeFile;
            }


        })

        folderList.push(...fileData);
    }
    folderList.length == 0 ? isEmpty.value = true : isEmpty.value = false;
};

onBeforeMount(() => {
    initData();

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