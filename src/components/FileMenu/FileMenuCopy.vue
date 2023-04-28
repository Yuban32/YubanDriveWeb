<template>
    <div id="file-menu-wrap">
            <div class="menu-item">下载</div>
            <div class="menu-item">重命名</div>
            <div class="menu-item">放入回收站</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"

    const props = defineProps()

    onMounted(()=>{
        console.log(props);
        
    })
</script>

<style scoped>
    #file-menu-wrap{
        width: 150px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center;
        cursor: pointer;
        border-radius: 10px;
        overflow: hidden;
        background-color: var(--el-bg-color-page);
        transition: all .3s;
        opacity: 1;
    }

    .menu-item{
        flex: 1;
        padding: 0 10px;
        line-height: 49px;
        position: relative;
        font-size: 14px;
    }
    .menu-item:hover{
        background-color: var(--el-menu-hover-bg-color);
    }
</style>