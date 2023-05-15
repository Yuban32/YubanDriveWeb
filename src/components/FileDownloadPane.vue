<template>
    <div>
        <div class="task-item" v-for="(item, index ) in downloadFileList" :key="index">
            <div class="image-wrap">
                <img :src="getAssetsFile('otherType.png')" class="image">
            </div>
            <div class="task-info-wrap">
                <div class="task-info">
                    <el-text id="task-title" class="w-220px" truncated size="large">{{ item.name }}</el-text>
                    <el-text id="task-title" class="w-220px" truncated size="small">

                        <span>{{ formatSize(item.size) }} - {{ item.downloadSpeed }}</span>
                    </el-text>

                </div>
                <div class="task-button" v-if="(item.downloadPersentage > 0) && (item.downloadPersentage < 100)">
                    <el-button circle link @click="changeDownloadStop(item)">
                        <el-icon size="25" v-if="item.downloadingStop == false">
                            <VideoPause />
                        </el-icon>
                        <el-icon size="25" v-else>
                            <Refresh />
                        </el-icon>

                    </el-button>
                </div>
            </div>
            <el-progress :percentage="item.downloadPersentage" :show-text="false" :stroke-width="3" class="el-progress-1" />
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * import
 */
import { VideoPause, Refresh } from '@element-plus/icons-vue';
import { ref } from 'vue';
import { fileDownloadAPI } from "../axios/fileAPIList";
import { FileDonwloadType } from "../interface/Interface";
import emitter from "../utils/eventBus";

/**
 * variable
 */
let downloadFileList: any = ref([]);
// 处理静态资源
const getAssetsFile = (url: String) => {
    return new URL(`../assets/image/${url}`, import.meta.url).href;
}

/**
 * emitter
 */
emitter.on("fileDownload", (item: any) => {
    //item是父组件File.vue 传过来的
    downloadFile(item)
})

/**
 * function
 */

//点击暂停下载
const changeDownloadStop = (file: FileDonwloadType) => {
    file.downloadingStop = !file.downloadingStop;
    if (!file.downloadingStop) {
        console.log("暂停下载");
        downloadChunk(1, file);
    }
}
//点击下载文件
const downloadFile = (file: FileDonwloadType) => {
    console.log("开始下载文件");
    file.downloadingStop = false;
    file.downloadSpeed = "0 M/s";
    file.downloadPersentage = 0;
    file.blobList = [];
    file.chunkList = [];
    console.log(file);
    downloadFileList.value.push(file);

    downloadChunk(1, file);
}
//下载主函数
//index == 分片偏移量 file == 文件信息
const downloadChunk = async (index: any, file: any) => {
    //5G
    let chunkSize: any = (1024 * 1024 * 5);
    console.log("chunkSize", chunkSize);
    let chunkTotal: any = Math.ceil(file.size / chunkSize);
    console.log("开始下载");
    if (index <= chunkTotal) {
        let exit = file.chunkList.includes(index);
        console.log("已存在", exit);
        if (!exit) {
            if (!file.downloadingStop) {
                let formData = new FormData();
                formData.append("fileName", file.name);
                formData.append("md5", file.fileUUID);
                formData.append("chunkSize", chunkSize);
                formData.append("index", index);
                formData.append("chunkTotal", chunkTotal);

                if (index * chunkSize >= file.size) {
                    chunkSize = file.size - (index - 1) * chunkSize;
                    formData.set("chunkSize", chunkSize);
                }
                let startTime = new Date().valueOf();
                console.log(formData);
                let data = await fileDownloadAPI(formData);
                let endTime = new Date().valueOf();
                let timeDif = (endTime - startTime) / 1000;
                file.downloadSpeed = (5 / timeDif).toFixed(1) + "M/s";
                file.downloadPersentage = Math.floor((index / chunkTotal) * 100);

                const blob = data;
                file.blobList.push(blob);
                if (index == chunkTotal) {
                    let resBlob = new Blob(file.blobList, {
                        type: "application/octet-stream",
                    });
                    //将获取的文件转化为Blob格式
                    let url = window.URL.createObjectURL(resBlob);
                    //打开一个存储位置
                    let a = document.createElement("a")
                    a.style.display = "none"
                    a.href = url;
                    let fileName = file.name;
                    a.setAttribute("download", fileName);
                    document.body.appendChild(a);
                    //使用a标签的Click()来执行真正的文件下载
                    a.click();
                    //下载完成后移除a标签
                    document.body.removeChild(a);
                    //下载完成后释放blob对象
                    window.URL.revokeObjectURL(url);
                    emitter.emit("downloadFinish")
                }
                //递归
                downloadChunk(index + 1, file);

            }
        } else {
            file.downloadPersentage = Math.floor((index / chunkTotal) * 100);
            downloadChunk(index + 1, file);
        }
    }



}

//单位格式化
const formatSize = (size: any) => {
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
.task-item {
    width: 100%;
    height: 50px;
    margin-bottom: 5px;
    padding: 5px 10px;
    box-sizing: border-box;
    display: flex;
    position: relative;
}

.el-progress-1 {
    width: 100%;
    position: absolute;
    bottom: 0;
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
</style>