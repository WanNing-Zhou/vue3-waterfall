<template>
  <div class="flex-wrapper">
    <span>{{alias}}</span>
    <button @mousedown="addHandle">+</button>
    <input ref="inputRef" :value="num" @change="changeHandle">
    <button @mousedown="subHandle">-</button>
  </div>
</template>

<script setup lang="ts">

import {ref} from "vue";
import {debounce} from "../../../lib/utils/debounce";

type Props = {
  alias: string
  // 跨度
  span?: number
  min?: number
  max?: number
}

const props = withDefaults(defineProps<Props>(), {
  alias: '数量：',
  span: 1,
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER
})

const num = defineModel("num", { type: Number, default: 0 })
const inputRef = ref<HTMLInputElement>()

const changeHandle = debounce(()=> {
  console.log(inputRef.value.value)
  const _num = Number(inputRef.value.value || props.min)
  if (_num < props.min) {
    num.value = props.min
  } else if (_num > props.max){
    num.value = props.max
  }else{
    num.value = _num
  }
}, 500)

const addHandle = () => {
  num.value += props.span
}
const subHandle = () => {
  num.value -= props.span
}

</script>

<style lang="less" scoped>

.flex-wrapper{
  display: flex;
  align-items: center;
  //flex-wrap: wrap;
  input{
    height: 24px;
    width: 40px;
    // 内部文字居中
    text-align: center;
  }
  button{
    padding: 6px 10px;
  }
}

</style>