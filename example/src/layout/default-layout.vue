<template>
  <div class="default-layout-page reactive">
    <div class="flex-wrapper wrapper">
      <WqInput :min="1" alias="列数：" v-model:num="columnCount" />
      <WqInput alias="列间距：" v-model:num="columnGap" />
      <WqInput alias="行间距：" v-model:num="rowGap" />
      <WqInput :span="100" alias="宽度：" v-model:num="width" />
      <div>
        <span>是否显示错误图片</span>
        <select v-model="showErrorImage">
          <option :value="true">显示</option>
          <option :value="false">不显示</option>
        </select>
      </div>
      <div>
        <input placeholder="url" v-model="addImageUrl">
        <button @click="addImageHandle">添加图片</button>
      </div>

      <div><span style="color:indianred">ps:</span> 动态改变错误图片会导致瀑布流重新加载，滚动条位置会回到顶部</div>
    </div>

    <div style="right: 20px; top: 20px;" class="flex-wrapper absolute">
      <a class="link" href="https://github.com/WanNing-Zhou/vue3-waterfall/tree/main/example" title="示例代码"
         target="_blank"
         rel="noopener noreferrer">
        示例代码
      </a>
      <a class="link" href="https://github.com/WanNing-Zhou/vue3-waterfall" title="github仓库" target="_blank"
         rel="noopener noreferrer">
        <img class="github" :src="githubSvg" alt="github">
      </a>
    </div>

    <div ref="layoutRef" class="default-layout">
      <Waterfall
        :show-error-image="showErrorImage"
        class="waterfall"
        :error-image="errImageSrc"
        :width="width" ref="waterfallRef"
        :row-gap="rowGap"
        :column-gap="columnGap"
        :column-count="columnCount"
        :images="testData">
        <template #item="{item}">
          <img v-if="item" style="width: 100%; height: 100%" :src="item.url" />
        </template>
      </Waterfall>
    </div>
  </div>

</template>

<script setup lang="ts">

import Waterfall from 'wq-waterfall-vue3';
// import Waterfall from "../../../lib";
import { data } from './testData';
import { ref, watch } from 'vue';
import WqInput from '../components/WqInput.vue';
import githubSvg from '../../public/github.svg';

interface Image {
  src: string;
}

const testData = ref<Image[]>([...data]);
const columnCount = ref(3);
const columnGap = ref(20);
const rowGap = ref(20);
const width = ref(1000);
const defaultUrl = 'https://media.9game.cn/gamebase/ieu-gdc-pre-process/images/20231012/7/23/a46362917681efe17e936cd468be76fc.jpg';
const addImageUrl = ref(defaultUrl);
const waterfallRef = ref<typeof Waterfall>();
const layoutRef = ref<HTMLElement>();
const showErrorImage = ref(false);
const errImageSrc = ref('https://pic.616pic.com/ys_img/00/18/24/HWG7eFNSHO.jpg');

watch(showErrorImage,(val) => {
    waterfallRef.value?.updateWaterfall();
  }
)
const addImageHandle = () => {
  testData.value.push({
    src: addImageUrl.value,
  });
  console.log(waterfallRef.value);
  // layoutRef.value?.scrollTo(0, layoutRef.value.scrollHeight)
};


</script>

<style lang="less" scoped>

.reactive{
  position: relative;
}
.absolute{
  position: absolute;
}

.wrapper {
  height: 120px;
  padding: 0 20%;
  color: #b2b2b2;
  font-size: 14px;
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
  height: calc(100vh - 140px);
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

.link {
  color: #333333;
  padding-left: 10px;
}
</style>