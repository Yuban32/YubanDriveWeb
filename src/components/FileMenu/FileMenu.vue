<template>
    <el-dropdown trigger="contextmenu" ref="dropdown">
        <span class="el-dropdown-link"> Dropdown List2 </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item>Action 1</el-dropdown-item>
                <el-dropdown-item>Action 2</el-dropdown-item>
                <el-dropdown-item>Action 3</el-dropdown-item>
                <el-dropdown-item disabled>Action 4</el-dropdown-item>
                <el-dropdown-item divided>Action 5</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const dropdown = ref()
function handleVisible2(visible: any) {
    if (visible) {
        dropdown.value.handleClose()
    } else {
        dropdown.value.handleOpen()
    }
}
function showClick() {
    dropdown.value.handleOpen()
}
</script>

<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);
    display: flex;
    align-items: center;
}
</style>