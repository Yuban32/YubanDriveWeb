<template>
    <div class="error-page">
        <h1>404</h1>
        <p>Not Found</p>
        <p class="backward-text">{{ count }} 秒后返回上一页</p>
    </div>
</template>

<script setup lang="ts">
import {  onMounted, ref } from 'vue';
const time: number = 3
const count = ref<number>(time)
onMounted(() => {
    setTimeout(() => {
        // 导航到上一页
        window.location.href = document.referrer
    }, time * 1000)

    setInterval(() => {
        count.value--
    }, 1000)
})
</script>

<style scoped>
.error-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    height: 100vh;
    font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
}

.backward-text {
    font-size: 3vh;
}

h1 {
    font-size: 30vh;
    font-weight: bold;
    position: relative;
    margin: -8vh 0 0;
    padding: 0;
}

h1:after {

    content: '404';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    color: transparent;
    /* webkit only for graceful degradation to IE */
    background: -webkit-repeating-linear-gradient(-45deg, #71b7e6, #69a6ce, #b98acc, #ee8176, #b98acc, #69a6ce, #9b59b6);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 400%;
    text-shadow: 1px 1px 2px transparentize(#fff, .75);
    animation: animateTextBackground 10s ease-in-out infinite;
}

p {
    color: #d6d6d6;
    font-size: 8vh;
    font-weight: bold;
    line-height: 10vh;
    max-width: 600px;
    position: relative;
}

p:after {
    content: 'Not Found';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    color: transparent;
    text-shadow: 1px 1px 2px transparentize(#fff, .5);
    -webkit-background-clip: text;
    -moz-background-clip: text;
    background-clip: text;
}

@keyframes animateTextBackground {
    0% {
        background-position: 0 0;
    }

    25% {

        background-position: 100% 0;
    }

    50% {

        background-position: 100% 100%;
    }

    75% {

        background-position: 0 100%;
    }

    100% {

        background-position: 0 0;
    }

}

@media (max-width: 767px) {
    .error-page h1 {

        font-size: 32vw;
    }

    p {

        font-size: 8vw;
        line-height: 10vw;
        max-width: 70vw;
    }

    .backward-text {
        font-size: 5vw;
        line-height: 10vw;
        max-width: 70vw;
    }

}</style>