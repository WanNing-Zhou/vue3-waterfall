<template>
  <div class="flex-wrapper wrapper">
    <WqInput alias="列数：" v-model:num="columnCount"/>
    <WqInput alias="列间距：" v-model:num="columnGap"/>
    <WqInput alias="行间距：" v-model:num="rowGap"/>
    <WqInput :span="100" alias="宽度：" v-model:num="width"/>
    <!--    github跳转链接-->
    <div>
      <input placeholder="url" v-model="addImageUrl">
      <button @click="addImageHandle">添加图片</button>
    </div>

    <div class="flex-wrapper">
      <a class="link" href="https://github.com/WanNing-Zhou/vue3-waterfall/tree/main/example" title="示例代码" target="_blank"
         rel="noopener noreferrer">
        示例代码
      </a>
      <a class="link" href="https://github.com/WanNing-Zhou/vue3-waterfall" title="github仓库" target="_blank"
         rel="noopener noreferrer">
        <img class="github" :src="githubSvg" alt="github">
      </a>
    </div>
  </div>
  <div ref="layoutRef" class="default-layout">
    <Waterfall ref="waterfallRef" class="waterfall" :width="width" :row-gap="rowGap" :column-gap="columnGap"
               :column-count="columnCount"
               :images="testData">
      <template #item="{item}">
        <img style="width: 100%; height: 100%" :src="item.data.src"/>
      </template>
    </Waterfall>

  </div>
</template>

<script setup lang="ts">

import Waterfall from "../../../lib";
import {data} from "./testData";
import {ref, watch, watchEffect} from "vue";
import WqInput from "../components/WqInput.vue";
import githubSvg from "../../public/github.svg";

interface Image {
  src: string;
}

const testData = ref<Image[]>([...data])
const columnCount = ref(3)
const columnGap = ref(20)
const rowGap = ref(20)
const width = ref(1000)
const defaultUrl = 'https://media.9game.cn/gamebase/ieu-gdc-pre-process/images/20231012/7/23/a46362917681efe17e936cd468be76fc.jpg'
const addImageUrl = ref(defaultUrl)
const waterfallRef = ref()
const layoutRef = ref<HTMLElement>()
const addImageHandle = () => {
  testData.value.push({
    src: addImageUrl.value || defaultUrl,
  })
  layoutRef.value?.scrollTo(0, layoutRef.value.scrollHeight)
}


</script>

<style lang="less" scoped>
.wrapper {
  height: 60px;
}

.flex-wrapper {
  //width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-around;
}

.default-layout {
  width: 100%;
  height: calc(100vh - 100px);
  border-radius: 8px;
  //background-color: black;
  color: azure;
  overflow-y: scroll;
  position: relative;
  display: flex;
  justify-content: center;

  .waterfall {
    //height: 100%;
    //overflow-y: scroll;
    background: black;
    //border-radius: 8px;
  }


  .aside {
    width: 380px;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 4px;
    background-color: #333;
    //padding: 4px;
    position: absolute;
    left: 0;
    height: 100%;
  }

  .container {
    position: relative;
    margin-left: 400px;
    height: 100%;
    overflow: auto;

  }

  //display: flex;
  //justify-content: center;
  //align-items: center;
}

.github {
  width: 40px;
  height: 40px;
}
.link{
  color: #333333;
  padding-left: 10px;
}
</style>