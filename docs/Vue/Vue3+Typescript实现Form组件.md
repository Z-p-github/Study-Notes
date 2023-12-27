`Vue3+Typescript` 目前已经如日中天了，现在我们使用他们去实现一下现在 `elementui plus` 中的 `Form` 组件

## 文件目录

首先我们需要新建如下的目录结构

<img src='@assets/form-list.png' alt="form-list"  height="300" />

- 最外层的 `index.ts` 文件主要用来将我们的组件暴露出去，并且注册在 `vue` 的全局 `component`
- `form.ts` 用来编写 `Form` 组件需要的 `typescript` 类型定义
- `form.vue` 用来编写 `Form` 的 `vue` 文件
- `form-item.ts` 用来编写 `Form-Item` 组件需要的 `typescript` 类型定义
- `form-item.vue` 用来编写 `Form—Item` 的 `vue` 文件

接下来，我们来一一实现这几个文件里面的内容

## index.ts

```ts
import _FormItem from "./src/form-item.vue";
import _Form from "./src/form.vue";

import { Plugin } from "vue";

//install安装方法
type SFCInstall<T> = T & Plugin;
function Install<T>(comp: T) {
  (comp as SFCInstall<T>).install = function (app) {
    const { name } = comp as unknown as { name: string };
    app.component(name, comp); // 将组件注册成全局的组件
  };
  return comp as SFCInstall<T>;
}

//form-item，给组件实例上面加上install方法
const FormItem = Install(_FormItem);
//form，给组件实例上面加上install方法
const Form = Install(_Form);

//暴露出去
export { FormItem, Form };

//暴露出组件的 ts 类型
export type { FormItemProps } from "./src/form-item";
export type { FormProps } from "./src/form";

//暴露组件构造函数类型的实例类型。
export type FormInstance = InstanceType<typeof Form>;

//在 vue module下面 GlobalComponents 接口扩展两个组件类型
declare module "vue" {
  export interface GlobalComponents {
    FormItem: typeof FormItem;
    Form: typeof Form;
  }
}
```

我们在封装的时候就首先要考虑到我们组件需要接受哪些参数，然后将这些参数在`ts`类型文件中定义出来

## form 组件的 prop

- `model` 数据源
- `rules` 用来配置校验数据的规则

## form-item 的 prop

- prop 校验表单控件的属性
- label 属性表单控件的标题
- rules 表单控件的规则
- show-message 是否显示错误，默认为 true

这里我们从里往外实现，先实现 `form-item ` ，再来实现 `form`组件，`form`组件主要是用来管理所有的`form-item`

## form-item 实现

首先我们需要来定义 `form-item` 的 ts 类型申明文件

在 `form-item` 中 需要管理自己对应的 prop 的规则校验，这里需要借助 `async-validator` 这个库来进行校验

```ts
import type { RuleItem } from "async-validator";
import { ExtractPropTypes, InjectionKey, PropType, VNodeChild } from "vue";

export type Arrayable<T> = T | T[];

//定义规则的type
export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>;
}

export const formItemValidateState = ["success", "error", ""] as const;

//验证的状态，as const 将类型变为 readOnly ，不可以修改 =》 "" | "success" | "error"
export type FormItemValidateState = typeof formItemValidateState[number];

//form-item的prop
export const formItemProps = {
  prop: String,
  label: String,
  rules: [Object, Array] as PropType<Arrayable<FormItemRule>>,
  showMessage: {
    type: Boolean,
    default: true,
  },
} as const;

//将form-item的prop转为可选择的 ，例如 readonly showMessage?: boolean | undefined;
//ExtractPropTypes 可将 Constructor 转换为对应值类型
export type FormItemProps = Partial<ExtractPropTypes<typeof formItemProps>>;
```

接着我们去编写 `form-item` 的 `template`

```vue
<template>
  <!-- 给最外层的容器绑定几个class -->
  <div
    :class="[
      'form-item-warpper',
      validateState === 'success' ? 'form-item-success' : '',
      validateState === 'error' ? 'form-item-error' : '',
    ]"
  >
    <!-- 存放label -->
    <label class="form-item-labe">
      <!-- 定义一个插槽，如果不自定义，那么就是用默认的label来展示 -->
      <slot name="label">
        {{ label }}
      </slot></label
    >
    <!-- 定义一个content -->
    <div class="form-item-content">
      <!-- 存放表单控件的默认插槽 -->
      <slot></slot>
      <!-- 存放错误的信息msg -->
      <div class="form-item-error">
        <slot name="error">
          {{ validateMessage }}
        </slot>
      </div>
    </div>
  </div>
</template>
```

<img src='@assets/form.png' alt="form"  height="300" />

在 `form` 中 我们需要通过 `provider` 方法 向下层的 `form-item` 提供自己的上下文属性 ，因为后续的校验逻辑需要 `form` 去 统一去触发 每一个`form-item`的`validate`，并且 在 `form-item`中也需要知道是否外层的 `form`组件也配置了`rules` 属性，这儿就会涉及到一个规则的合并。

`form.vue`

```vue
<template>
  <form class="form">
    <slot></slot>
  </form>
</template>

<script setup lang="ts">
import { Values } from "async-validator";
import { provide } from "vue";
import { formProps, FormContextKey, FormContext } from "./form";
import { FormItemContext } from "./form-item";

//给组件取名字
defineOptions({
  name: "form",
});

//定义组件的prop
const props = defineProps(formProps);

//定义需要传递的上下文
const context = {
  ...props,
};
//向下暴露出去 FormContextKey 是一个symbol变量
provide(FormContextKey, context);

// 将form表单的校验方法 暴露给用户，用户可以通过ref来进行检测
defineExpose({
  validate,
});
</script>
```

`form`组件暴露了上下文之后，`form-item`组件中需要接收这个 上下文，并且需要合并一下 `form` 和 自己组件接收到的规则，并且也需要将自己的上下文暴露给 `form`组件，方便后续`form`统一触发规则校验

`form-item`

```vue
<script lang="ts" setup>
import { computed } from "@vue/reactivity";
import { inject, onMounted, provide } from "vue";
import { FormContextKey } from "./form";
import { Arrayable, FormItemRule } from "./form-item";
import { formItemProps, FormItemContext } from "./form-item";

//注入 form 的上下文
const formContext = inject(FormContextKey);

//定义组件的prop
const props = defineProps(formItemProps);

// 增加组件名字
defineOptions({
  name: "form-item",
});

//转化为数组
const converArray = (
  rules: Arrayable<FormItemRule> | undefined
): FormItemRule[] => {
  return rules ? (Array.isArray(rules) ? rules : [rules]) : [];
};

//组合 form 和自己的 规则
const _rules = computed(() => {
  const myRules = converArray(props.rules); // 自己的规则
  const formRules = formContext?.rules;
  if (formRules && props.prop) {
    const _temp = formRules[props.prop];
    if (_temp) {
      myRules.push(...converArray(_temp));
    }
  }
  return myRules;
});

//验证的方法
const validate: FormItemContext["validate"] = async (trigger, callback?) => {};

const context: FormItemContext = {
  ...props,
  validate,
};

//像下级组件暴露 上下文， 例如 el-input  el-select 等
provide("form-item", context);

onMounted(() => {
  formContext?.addField(context); // 将自己的上下文传递给了父亲
});
</script>
```

在 `form` 组件中需要提供一个 `addField` 方法 去收集 子组件 `form-item` 的上下文

```vue
<script>
const fields: FormItemContext[] = []; // 父亲收集儿子

const addField: FormContext["addField"] = (context) => {
  fields.push(context);
};

const context = {
  ...props,
  addField,
};
</script>
```

## 验证

当我们在使用 `form` 的父组件中 进行验证时，想要 去调用 `form`组件内部的 `validate` 方法 ，由 `form`组件再去 触发每一个 `form-item`自己的验证

```vue
<script>
const formRef = ref<FormInstance>()

const validateForm = () => {
    //获取到form实例
  const form = formRef.value
  form?.validate((valid, errors) => {
    console.log(valid, errors)
  })
}
</script>
```

`form` 的验证方法

```vue
<script>
// form的校验,在父级中调用所有儿子的校验方法
const validate = async (
  callback?: (valid: boolean, fields?: Values) => void
) => {
  let errors: Values = {};
  //循环所有的 form-item
  for (const field of fields) {
    try {
      await field.validate('')
    } catch (error) {
      errors = {
        ...errors,
        ...(error as Values).fields
      }
    }
  }
  // 没有错误就成功
  if (Object.keys(errors).length === 0) {
    return callback?.(true)
  } else {
    // 有错误就失败
    if (callback) {
      callback?.(false, errors)
    } else {
      return Promise.reject(errors)
    }
  }
}
</script>
```

每一个`form-item`中的验证方法

```vue
<script>
// 过滤出对应 触发方式 的规则
const getRuleFiltered = (trigger: string) => {
  const rules = _rules.value;
  return rules.filter((rule) => {
    if (!rule.trigger || !trigger) return true; // 这种情况意味着无论如何都要校验
    if (Array.isArray(rule.trigger)) {
      return rule.trigger.includes(trigger);
    } else {
      return rule.trigger === trigger;
    }
  });
};

//验证成功的函数
const onValidationSuccesseded = () => {
  validateState.value = "success";
  validateMessage.value = "";
};
//验证失败的函数 ，改变对应的状态
const onValidationFailed = (err: Values) => {
  validateState.value = "error";
  const { errors } = err;
  validateMessage.value = errors ? errors[0].message : "";
};

//验证
const validate: FormItemContext["validate"] = async (trigger, callback?) => {
  // 拿到触发的时机，校验是否通过可以调用callback 或者调用promise.then方法
  const rules = getRuleFiltered(trigger);
  // rules 就是触发的规则 , trigger就是触发的方式
  // 需要找到对应的数据源头 上面找到对应的prop

  // 触发事件了 ，找到对应的规则，和数据源在哪里，校验那个属性
  const modelName = props.prop!;
  // 拿到校验器
  const validator = new AsyncValdaitor({
    [modelName]: rules,
  });
  const model = formContext?.model!;//取到form上面的模型

  return validator
    .validate({
      [modelName]: model[modelName],//取到模型上面的值
    })
    .then(() => {
      //处理成功
      onValidationSuccesseded();
    })
    .catch((err: Values) => {
      //处理validate个实例返回回来的错误
      onValidationFailed(err);
      return Promise.reject(err);
    });
};
</script>
```

到这里为止，我们的 form 组件大致的实现逻辑就已经完成了，后续需要支持新的功能，也可以通过定义新的 prop 来完善

## 使用方式

```vue
<template>
  <my-form
    ref="formRef"
    :model="state"
    :rules="{
      username: {
        min: 6,
        max: 10,
        message: '用户名6-10位',
        trigger: ['change', 'blur'],
      },
    }"
  >
    <my-form-item
      prop="username"
      label="用户名"
      :rules="[{ required: true, message: '请输入用户名', trigger: 'blur' }]"
    >
      <el-input placeholder="请输入用户名" v-model="state.username" />
    </my-form-item>

    <my-form-item
      prop="password"
      label="密码"
      :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]"
    >
      <el-input
        placeholder="请输入密码"
        v-model="state.password"
        type="password"
      />
    </my-form-item>
    <el-button size="medium" type="primary" :round="true" @click="validateForm">
      按钮
    </el-button>
  </my-form>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { FormInstance } from "@/components/form";

const state = reactive({ username: "", password: "" });

const formRef = ref<FormInstance>();

const validateForm = () => {
  const form = formRef.value;
  form?.validate((valid, errors) => {
    console.log(valid, errors);
  });
};
</script>
```
