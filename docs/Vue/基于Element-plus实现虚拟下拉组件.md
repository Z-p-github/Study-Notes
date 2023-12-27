最近在项目中，遇到一个渲染的性能问题，就是有一个下拉组件会请求几千条数据回来，然后在`element-ui` 的下拉组件中渲染出来，发现这个渲染的过程中，性能非常的糟糕，页面会出现卡顿，因为 `element-ui` 目前的 `Select` 组件没有做虚拟滚动，所以没办法就只能自己搞一个了，下面我就来说说我的实现方式。

## 虚拟滚动思路

我们可以单独封装一个虚拟列表的组件，然后将我们需要处理成虚拟滚动的`Select`组件包裹一下就可以了，这样子不仅做到了组件之间的解耦，也方便后续的一个维护

那么虚拟列表主要分为三个部分：

<img src='@assets/virtual.png' alt="form-list"  width="300" />

- 最外层的容器`scroll-container`，主要用来做滚动列表的外层的容器，需要进行滚动
- `scroll-bar`，盒子的高度是根据具体的总数据量计算出来的，主要是目的是为了撑开 `scroll-container` ，让`scroll-container`出现对应高度的滚动条，可以进行滚动
- `scroll-list`，存放所有被渲染的出来的下拉选项的盒子，他需要根据 外层`scroll-container`的滚动做向上或者向下的偏移运动

## 使用方式

我们可以先来看看使用方式，下面是一个封装的下拉组件，里面引入的`virtual-list`组件，和原始的`el-select`使用方式不同的是，`el-option`不再是通过`v-for`循环出来的，而是通过我们的`virtual-list `组件的插槽渲染出来的

`filterValue` 是我的组件需要支持输入过滤加的，如果不需要的就不用加

```js
<template>
  <div>
    <el-select :value="props.modelValue"  @change="handleChange" v-bind="props" :popper-class="$style.virtual_select" :filter-method="filterItems">
      <virtual-list :items="filterDatas" :remain="props.remain" :size="props.size">
        <template #default="{ node }">
          <el-option
            :value="node.value"
            :label="node.label"
            :key="node.value"
          ></el-option>
        </template>
      </virtual-list>
    </el-select>
  </div>
</template>
<script lang="ts" setup>
import { VirtualSelectProps,selectEmits } from "./VirtualSelectProps";
import type { OptionType } from "./VirtualSelectProps";
import VirtualList from "@/components/virtual-list";
import { toRef, Ref, computed, reactive } from "vue";
const props = defineProps(VirtualSelectProps);
const emit = defineEmits(selectEmits);
defineOptions({
  name: "VirtualSelect",
  inheritAttrs: false,
});
const state = reactive({
    filterValue:"",
    value:'',
})
const options: Ref<OptionType[] | any> = toRef(props, "options");
const filterDatas = computed(()=>{
    //过滤
    if(!state.filterValue){
        return options.value
    }
    return options.value.filter((item:OptionType) => {
        return item.label.indexOf(state.filterValue) !== -1
    })
})

const filterItems = (value:string)=> {
    state.filterValue  = value
}
const handleChange = (val:string)=> {
    //vue3中触发值的更新
    emit('update:modelValue',val)
}
</script>
<style  lang="scss" module>
.virtual_select{
    :global .el-scrollbar__bar.is-vertical {
        display: none !important;;
    }
    :global .el-scrollbar__wrap {
      overflow: hidden;
    }
}
</style>

</style>

```

## 实现 `virtual-list`

现在我们来定义 `virtual-list`的`html`结构，这里我是使用的`Vue3`的`jsx`的写法做的

```jsx
import { defineComponent } from "vue";

export default defineComponent({
  name: "VirtualList",
  setup(props, { slots }) {
    return () => {
      return (
        <div class="scroll-container">
          <div class="scroll-bar"></div>
          <div class="scroll-list">这里面存放list</div>
        </div>
      );
    };
  },
});
```

接下来我们需要定义`VirtualList`组件需要接受的`props`

- items：所有的需要渲染的数据，是一个数组
- remain：需要在滚动的区域内展示多少个选项，默认为 8 个
- size： 每一个下拉项的高度大小，默认为 34（参考的 element-ui 的 select 组件）

```jsx
import { defineComponent } from "vue";

export default defineComponent({
  name: "VirtualList",
  props: {
    size: {
      type: Number,
      default: 34,
    },
    remain: {
      default: 8,
      type: Number,
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, { slots }) {
    return () => {
      return (
        <div class="scroll-container">
          <div class="scroll-bar"></div>
          <div class="scroll-list">这里面存放list</div>
        </div>
      );
    };
  },
});
```

首先，我们在初始化的时候就需要去设置 `scroll-container` 和 `scroll-bar` 的高度，并且需要给`scroll-container` 绑定一个`onScroll`方法

```jsx
export default defineComponent({
   setup(props, { slots }) {
    const wrapperRef = ref<HTMLElement>();
    const barRef = ref<HTMLElement>();
    function initWrapper() {
      wrapperRef.value!.style.height = props.remain * props.size + "px";//实际显示的高度
      barRef.value!.style.height = props.items.length * props.size + "px";//总高度
    }
    watch(() => props.items, initWrapper);
    return () => {
      return (
        <div class="scroll-container" ref={wrapperRef} onScroll={handleScroll}>
           {/* 就是模拟总长度，感觉好像很多数据 */}
          <div class="scroll-bar" ref={barRef}></div>
          <div class="scroll-list">这里面存放list</div>
        </div>
      );
    };
  },
})

```

接下来，我们就需要去计算页面上面需要渲染的数据，然后再通过作用域插槽传递数据进行渲染

```js
   setup(props, { slots }) {
      const state = reactive({
      // 计算显示的区域
      start: 0,
      end: props.remain,
    });
    const visibleData = computed(() => {
        //其实就是去截取数据
      const result = props.items.slice(state.start, state.end);
      return result;
    });
    return () => {
      return (
        <div class="scroll-container">
          <div class="scroll-bar"></div>
          <div class="scroll-list">
            {visibleData.value.map((node, idx) => slots.default!({ node }))}
          </div>
        </div>
      );
    };
  },
```

这个时候应该就可以渲染出来下拉选项了
<img src='@assets/select.png' alt="select"  width="300" />

滚动的时候，我们需要`scroll-list`组件进行相应的平移，所以需要去增加列表滚动的相关操作

```js
 const handleScroll: any = () => {
      // 根据当前滚动的距离 来算，过去了几个数据
      const scrollTop = wrapperRef.value!.scrollTop;
      const slidePrev = Math.floor(scrollTop / props.size); // 划过去了多少个
      if (props.items.length > slidePrev) {
        state.start = slidePrev;
      } else {
        state.start = 0;
      }
      state.end = state.start + props.remain;//末尾结束的位置
         //设置sroll-list的偏移量
      offset.value = state.start * props.size; // 滚过去了多少个
    };
```

这个时候其实已经可以进行滚动渲染了，但是你会发现，在滚动的时候，顶部或者底部会有一小段间隔，让整个滚动看着不是特别流畅

<img src='@assets/select-space.png' alt="select-space"  width="300" />

原因： 是因为在滚动的过程中，会去计算即将要渲染出来的数据，由于滚动的触发频率比较快，所以可能在渲染的时候就有会一丝延迟

解决办法：

我们可以在前面和后面分别补充一些数据，这样子，我滚动的时候是已经渲染过的数据，整个滚动的过程就会比较流畅

修改代码

```js
   const offset = ref(0);

    //前面的数据
    const prev = computed(() => {
      // 当前开始第四条
      return Math.min(state.start, props.remain);
    });
    //后面的数据
    const next = computed(() => {
      return Math.min(props.remain, props.items.length - state.end);
    });

    // 这里应该多展示 上8条和下8条，保证用户在快速滚动的时候 不会白屏
    const visibleData = computed(() => {
      const result = props.items.slice(
        state.start - prev.value,
        state.end + next.value
      );
      // 上下都补点
      return result;
    });


    const handleScroll: any = () => {
      // 根据当前滚动的距离 来算，过去了几个数据
      const scrollTop = wrapperRef.value!.scrollTop;
      const slidePrev = Math.floor(scrollTop / props.size); // 划过去了多少个
      if (props.items.length > slidePrev) {
        state.start = slidePrev;
      } else {
        state.start = 0;
      }
      state.end = state.start + props.remain;
      //设置sroll-list的偏移量
      offset.value = state.start * props.size - props.size * prev.value; // 滚过去了多少个
    };

    return () => {
      return (
        <div class="scroll-container" ref={wrapperRef} onScroll={handleScroll}>
           {/* 就是模拟总长度，感觉好像很多数据 */}
          <div class="scroll-bar" ref={barRef}></div>
          <div class="scroll-list"  style={{transform: `translate3d(0,${offset.value}px,0)` }}>
            {visibleData.value.map((node, idx) => slots.default!({ node }))}
          </div>
        </div>
      );
    };
```

这个时候我们就可以正常的滚动和渲染了

如果我们的组件有支持过滤的功能，需要监听一下 `filterValue`属性，在这个属性变更的时候重置一下`start`的值

```js
watch(
  () => props.filterValue,
  () => {
    if (props.filterValue) {
      state.start = 0;
    }
  }
);
```

以上我的虚拟下拉组件就完成了 ✌️
