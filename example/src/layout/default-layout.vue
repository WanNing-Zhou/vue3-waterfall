<template>
  <div class="default-layout">
    <Waterfall :images="testData">
      <template #item="{item}">
<!--        {{item}}-->
        <img style="width: 100%; height: 100%" :src="item.data.src"/>
        <div style="color: azure">{{item.index}}</div>
      </template>
    </Waterfall>
  </div>
</template>

<script setup lang="ts">


import {Waterfall} from "../../../lib";
import {data,data2} from "./testData";
import {onMounted, ref} from "vue";
import {useParallelTaskControl} from "../../../lib/hooks/useParallelTaskControl";

const testData = ref([...data])

setTimeout(()=>{
  // 向testData 添加数据
  testData.value.push(...data2)
}, 10000)


</script>

<style lang="less" scoped>
.default-layout{
  //width: 100%;
  height: 96vh;
  background-color: black;
  color: azure;
  overflow-y: scroll;
  position: relative;
  .aside{
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
  .container{
    position: relative;
    margin-left: 400px;
    height: 100%;
    overflow: auto;

  }
  //display: flex;
  //justify-content: center;
  //align-items: center;
}
</style>