<template>
    <transition>
        <div id="upload-task-wrap">
            <div class="dropdown-wrap">
                <el-dropdown trigger="click" ref="dropdown">
                    <el-button :icon="CirclePlus" circle size="large" />
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-upload action="#" :http-request="upload" :before-upload="beforeUpload"
                                :show-file-list="false">
                                <el-dropdown-item>
                                    上传文件
                                </el-dropdown-item>
                            </el-upload>
                            <el-dropdown-item @click="createFolder()">新建文件夹</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="upload-task-wrap" v-if="taskIsEmpty" :style="{height: taskListIsClosed==true?'500px':'80px',bottom:0}" >
                <div class="header">
                    <el-icon size="30">
                        <UploadFilled />
                    </el-icon>
                    <el-text class="w-365px">
                        {{ taskTitle }}
                    </el-text>
                </div>
                <el-scrollbar class="container">
                    <el-empty :description="'空队列'" v-if="!taskIsEmpty" class="el-empty" />
                    <div class="task-item" v-for="(item, index ) in uploadFileList" :key="index">
                        <el-progress :percentage="item.parsePercentage" :show-text="false" :stroke-width="3" class="el-progress-2" />
                        <div class="image-wrap">
                            <img :src="getAssetsFile('otherType.png')"
                                class="image">
                        </div>
                        <div class="task-info-wrap">
                            <div class="task-info">
                                <el-text id="task-title" class="w-220px" truncated size="large" >{{ item.name }}</el-text>
                                <el-text id="task-title" class="w-220px" truncated size="small">
                                    
                                    <span>{{ formatSize(item.size) }} - {{ item.uploadSpeed }}</span>
                                </el-text>

                            </div>
                            <div class="task-button" v-if="(item.uploadPercentage > 0) && (item.uploadPercentage < 100)">
                                <el-button circle link @click="changeUploadingStop(item)">
                                    <el-icon size="25" v-if="item.uploadingStop == false">
                                        <VideoPause />
                                    </el-icon>
                                    <el-icon size="25" v-else>
                                        <Refresh />
                                    </el-icon>
                                    
                                </el-button>
                            </div>
                        </div>
                        <el-progress :percentage="item.uploadPercentage" :show-text="false" :stroke-width="3" class="el-progress-1" />
                    </div>
                </el-scrollbar>
                <div class="bottom" @click="taskListIsClosed=!taskListIsClosed">
                    <el-text size="large">收起</el-text>
                </div>
            </div>

        </div>
    </transition>
</template>

<script setup lang="ts">
//import
import { UploadFilled, Loading, Close, VideoPause, Refresh, CirclePlus } from '@element-plus/icons-vue';
import SparkMD5 from "spark-md5";
import { FileUploadType } from "../interface/Interface"
import { uploadFileCheckAPI, uploadFileAPI } from "../axios/fileRequest"
import { createFolderAPI } from "../axios/folderRequest"
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import emitter from "../utils/eventBus"
//router
const route = useRoute();
//文件夹的UUID 用于上传
const folderUUID = ref(route.query['folderUUID']);
let taskTitle = ref<string>("空队列")
let taskIsEmpty = ref<boolean>(false);
// 处理静态资源
const getAssetsFile = (url: String) => {
    return new URL(`../assets/image/${url}`, import.meta.url).href;
}

//element component
const elUploadBtn = ref();
//菜单相关
const dropdown = ref();
const openMenu = () => {
    dropdown.value.handleOpen();
    console.log(2);
}

//关闭任务列表
const taskListIsClosed = ref<boolean>(true);

//创建文件夹
const createFolder = ()=>{
    ElMessageBox.prompt('请输入文件夹名', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        inputErrorMessage: '请输入文件夹名',
    })
        .then(async({ value }) => {
            let folderName = value;
            await createFolderAPI(folderUUID.value,folderName);
            emitter.emit("reloadFileList");
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消创建',
            })
        })
    
}


//文件上传
var uploadFileList:any = ref([]);
//计算文件MD5值
function computeMd5(file:any, uploadFile:any) {
    //如果此函数使用箭头函数的话,那么将无法访问到uploadFile.parsePercentage.value 这个值
    return new Promise((resolve, reject) => {
      //分片读取并计算md5
      taskTitle.value = "正在校验文件中..."
      const chunkTotal = 100; //分片数
      const chunkSize = Math.ceil(file.size / chunkTotal);
      const fileReader = new FileReader();
      const md5 = new SparkMD5();
      let index = 0;
      const loadFile = (uploadFile:any) => {
        uploadFile.parsePercentage.value = Math.floor((index / file.size) * 100);
        const slice = file.slice(index, index + chunkSize);
        
        fileReader.readAsBinaryString(slice);
      };
      loadFile(uploadFile);
      fileReader.onload = (e) => {
        md5.appendBinary(e.target?.result);
        if (index < file.size) {
          index += chunkSize;
          loadFile(uploadFile);
        } else {
          // md5.end() 就是文件md5码
          resolve(md5.end());
        }
      };
    });
  }

//文件上传前 el-upload
const beforeUpload = async (file: any) => {
    
    
    console.log("2.文件上传前");
    taskIsEmpty.value = true
    var uploadFile:any = {};
    uploadFile.name = file.name;
    uploadFile.size = file.size;
    uploadFile.parsePercentage = ref(0);
    uploadFile.uploadPercentage = ref(0);
    uploadFile.uploadSpeed = "0 M/s";
    uploadFile.chunkList = null;
    uploadFile.file = file;
    uploadFile.uploadingStop = false;
    uploadFileList.value.push(uploadFile);

    var md5 = await computeMd5(file, uploadFile);

    uploadFile.md5 = md5;
    // 文件夹的UUID
    uploadFile.folderUUID = folderUUID.value;
    uploadFile.fileName = file.name;
    var res = await uploadFileCheckAPI(uploadFile);
    if(res.data == undefined){
        taskTitle.value = res.msg;
    }else{
        res = res.data;
        if (!res.isUploaded) {
            uploadFile.chunkList = res.chunkList;
            uploadFile.needUpload = true;
        } else {
            uploadFile.needUpload = false;
            uploadFile.uploadPercentage.value = 100;
            console.log("文件已秒传");
            taskTitle.value = "上传完成"
            ElMessage({
                showClose: true,
                message: "文件已秒传",
                type: "warning"
            });
        }
    }
    
}
//上传分片
const uploadChunk = (file: any, index: any, uploadFile: any) => {
    let chunkSize: any = 1024 * 1024 * 10; //10mb大小
    let chunkTotal: any = Math.ceil(file.size / chunkSize);
    if (index <= chunkTotal) {
        let startTime = new Date().valueOf();
        //判断是否存在
        let exit = uploadFile.chunkList.includes(index);     
        if (!exit) {
            if (!uploadFile.uploadingStop) {
                //分片上传的同时计算进度条和上传速度
                //已上传的不再上传
                //上传完成后提示成功
                let form = new FormData();
                let start = (index - 1) * chunkSize;
                let end = index * chunkSize >= file.size ? file.size : index * chunkSize;
                let chunk = file.slice(start, end);
                // console.log("上传chunk", chunk);
                taskTitle.value = "正在上传文件中..."
                form.append("chunk", chunk);
                form.append("index", index);
                form.append("chunkTotal", chunkTotal);
                form.append("chunkSize", chunkSize);
                form.append("md5", uploadFile.md5);
                form.append("fileSize", file.size);
                form.append("fileName", file.name);
                // 用户根目录
                form.append("fileParentID", folderUUID.value as string);
                form.append("folderUUID", folderUUID.value as string);

                uploadFileAPI(form).then((res: any) => {
                    let endTime = new Date().valueOf();
                    let timeDif = (endTime - startTime) / 100;
                    uploadFile.uploadSpeed = (10 / timeDif).toFixed(1) + " MB/s";
                    uploadFile.chunkList.push(index);

                    uploadFile.uploadPercentage = Math.floor((uploadFile.chunkList.length / chunkTotal) * 100);
                    uploadChunk(file, index + 1, uploadFile);
                    //事件总线 上传完毕后重新获取文件列表
                    if(index == chunkTotal){
                        taskTitle.value = "文件上传完成"
                        emitter.emit("reloadFileList");
                    }
                }).catch((err: any) => {
                    console.log(err);
                    
                });
            } 
        }else{
            uploadFile.uploadPercentage = Math.floor((uploadFile.chunkList.length / chunkTotal) * 100);
            uploadChunk(file, index + 1, uploadFile);
        }
    }
}

//点击暂停或者开始上传
const changeUploadingStop = (uploadFile: any) => {
    uploadFile.uploadingStop = !uploadFile.uploadingStop;
    if (!uploadFile.uploadingStop) {
        taskTitle.value = "正在上传文件中..."
        console.log(uploadFile.file);
        
        uploadChunk(uploadFile.file, 1, uploadFile);
    }else{
        taskTitle.value = "上传暂停中..."
    }
}
const upload = (xhrData: any) => {
    let uploadFile: any = null;
    for (var i = 0; i < uploadFileList.value.length; i++) {
        if ((xhrData.file.name == uploadFileList.value[i].name) && (xhrData.file.size == uploadFileList.value[i].size)) {
            uploadFile = uploadFileList.value[i];
            break;
        }
    }
    if (uploadFile.needUpload) {
        console.log("3.上传文件");
        uploadChunk(xhrData.file, 1, uploadFile);
    }
}
const formatSize = (size:any)=> {
  //size的单位大小k
  const units = ['B', 'KB', 'MB', 'GB']; // 单位列表
  let unitIndex = 0; // 单位索引
  var pointLength = 2;
  // 循环计算数据大小和单位
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return size.toFixed(2) + ' ' + units[unitIndex];
}

</script>

<style scoped>
#upload-task-wrap {
    overflow: hidden;
    width: 100%;
    height: 500px;
    position: absolute;
    bottom: 0px;
    right: 0px;
}

.dropdown-wrap {
    position: absolute;
    right: 0px;
    bottom: 0px;
    z-index: 9999;
}
:deep(.el-upload){
    width: 100%;
}
.el-icon {
    padding-right: 5px;
}

.upload-task-wrap {
    height: 500px;
    width: 375px;
    display: flex;
    flex-direction: column;
    background: var(--el-color-info-light-7);
    border-radius: var(--el-border-radius-round);
    box-shadow: var(--el-dropdown-menu-box-shadow);
    overflow: hidden;
    position: absolute;
    left: 0;
    z-index: 200;
    transition: all .3s ease;
}

.header {
    padding: 5px;
    display: flex;
    height: 40px;
    box-sizing: border-box;
    background: var(--el-bg-color-page);
    line-height: 30px;

}



.task-item {
    width: 100%;
    height: 50px;
    padding: 5px 10px;
    box-sizing: border-box;
    display: flex;
    position: relative;
}
.bottom {
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    text-align: center;
    cursor: pointer;
    user-select: none;
}
.el-progress-1 {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
}

.el-progress-2 {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.task-info-wrap {
    width: 100%;
    display: flex;
    align-items: center;
}

.task-info {
    width: 200px;
    height: 100%;
    display: flex;
    padding-left: 10px;
    flex: 3;
    flex-direction: column;
}

#task-title {
    align-self: self-start;
}

.task-button {
    flex: 1;
    text-align: right;

}

.image-wrap {
    height: 100%;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: var(--el-border-radius-base);
}

.image {
    width: 40px;
    overflow: hidden;
    border-radius: var(--el-border-radius-base);
}



.el-text {
    transition: all .3s;
}

.bottom:hover .el-text {

    color: var(--el-color-primary);
}
</style>