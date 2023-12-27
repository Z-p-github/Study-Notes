`vite`是一种新型的前端构建工具，能够大幅度提高我们的开发速度，相较于我们熟悉的`webpack`，它有自己独特的优势与特点

它主要由两部分组成：

- 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。
- 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。

[为什么选择 vite](https://cn.vitejs.dev/guide/why.html) 可以去官网查阅

下面我们开始基于 `vite2` 来配置我们项目的基本开发环境吧

## 安装 vite

首先我们 先安装 `vite`

```js
pnpm i vite
```

## 配置 TypeScript

`vite2` 默认是支持`typescript`的，所以我们只需要增加一个对应的`typescript`配置文件即可

首先先在根目录下面新建一个 `tsconfig.json` 配置文件，然后天际添加内容如下所示：

```json
{
  "compilerOptions": {
    "target": "esnext", //遵循es6版本
    "module": "esnext", //打包模块类型es6
    "moduleResolution": "node", //按照node模块来解析
    "strict": true, //严格模式
    "jsx": "preserve", //不转义jsx
    "sourceMap": true,
    "esModuleInterop": true, // 支持es6,commonjs模块
    "lib": ["esnext", "dom", "ES2018.Promise"] // 编译时用的库
  },
  //包含的模块
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.d.tsx"]
}
```

## 配置支持 vue3

首先安装`vue3`的相关包

```js
pnpm i vue -S
pnpm i @vite/plugin-vue -D
```

修改`vite.config.js`

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
export default defineConfig({
  plugins: [vue()],
});
```

声明`vue`的类型，让`typescript`认识

在 src 目录下面新建一个`env.d.ts`文件

```ts
/// <reference types="vite/client" />
//申明vue module
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```
此时我们就可以去写我们的 `vue` 的代码了

可以建立如下的目录结构：

<img src='@assets/vite2-vue.png' alt="vite2-vue"  height="200" />


App.vue
```vue
<template>
<h1>this is app page</h1>
  <HelloWorld msg="vue3 哈哈哈"  />
</template>
<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
</script>
```

HelloWorld.vue
```vue
<template>
    <div>hellow world <span>{{msg}}</span></div>
</template>
<script setup lang="ts">
defineProps<{msg:string}>();

</script>

```

main.ts
```ts
import {createApp} from 'vue'
import App from './App.vue'
const app = createApp(App);
app.mount('#app')
```

## 配置ts校验vue文件
`vite`中天生支持ts，但是`vite`中的ts只管编译，不管校验，报错了项目依然可以运行，所以我们可以加一个配置来限制这种情况

安装 `vue-tsc` ，`vue-tsc` 可以对 `vue3` 进行 `typescript` 类型校验

```js
pnpm install typescript vue-tsc -D
```
配置`package.json`文件
```json
 "scripts": {
    "dev":"vite",
    "build":"vue-tsc --noEmit vite build"
  }
```
这个时候在打包的过程中，就会去进行相关的ts类型校验，如果通过不了，那么打包就会失败


## 配置eslint
`eslint`是一个插件化并且可以配置的`javascript`语法规则和代码风格的检查工具

- 代码质量，使用方式有可能又问题
- 代码风格，风格不符好一定规则

安装相关插件：

- eslint: Eslint是一个用于识别和报告在ECMAScript/JavaScript代码中发现错误的工具
- eslint-plugin-vue: vue官方的eslint插件
- @typescript-eslint/parser: 一个eslint解析器，它利用Typescript-ESTree 允许 ESlint检查Typescript的源代码
- @typescript-eslint/eslint-plugin: 一个eslint插件，为TypeScript代码库提供lint规则
- @vue/eslint-config-typescript: Vue的eslint-config-typescript

```js
pnpm i eslint eslint-plugin-vue @typescript-eslint/parser @typescript-eslint/eslint-plugin @vue/eslint-config-typescript -D
```

在项目的根目录下面新建`eslint`的配置文件 `.eslintrc.js`

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  //继承如下规则
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
    "@vue/typescript/recommended",
  ],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    ecmaVersion: 2021,
  },
  rules: {
    "no-unused-vars": "off",
    "vue/no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
  },
  globals: {
    defineProps: "readonly",
  },
};
```

当然我们并不想所有的文件都会被`eslint`校验，所以我们可以配置一个`eslint`的忽略文件

在项目的根目录下面新建一个 `.eslintignore` 文件，添加如下内容

```
node_modules
dist
*.css
*.jpg
*.jpeg
*.png
*.gif
*.d.ts

```

最后我们去配置一个`eslint`的校验命令和修复的命令

```json
  "scripts": {
    "lint":"eslint --ext .ts,.tsx ./src --quiet",//校验
    "lint:fix":"eslint --ext .ts,.tsx ./src --quiet --fix"  //修复
  }
```

## 配置Prettier

`Eslint` 主要解决的是代码质量问题，例如如下几个规则：

- no-unused-vars  禁止出现未使用过的变量
- no-implicit-globals 禁止在全局范围内使用变量声明和`function`声明
- prefer-promise-reject-errors 要求使用`Error` 对象作为`Promise`拒绝的原因

`Prettier` 主要解决是代码的风格问题，例如如下几个规则：
- max-len  最大长度
- no-mixed-spaces-and-tabs 不允许空格和tab混合
- keyword-spacing 关键字的空
- comma-style 冒号风格

下面安装依赖：

- prettier 代码格式化
- eslint-plugin-prettier 作为`Eslint` 规则运行的 `prettier`
- @vue/eslint-config-prettier `Vue` 的 `eslint-config-prettier`

```js
pnpm install prettier eslint-plugin-prettier @vue/eslint-config-prettier -D 
```

修改`.eslintrc.js` 配置文件，在原有的基础上面新增几个`eslint`的继承规则
```js
  extends: [
    "prettier",
    "@vue/eslint-config-prettier"
  ],
```
也可以自己定义一些代码风格格式，可以在根目录下面新建一个`.prettierrc.js`文件，可以在里面新增如下的内容：
```js
module.exports = {
  singleQuote: true,
  tabWidth: 2,
  indent: 2,
  semi: false,
  trailingComma: "none",
  endOfLine: "auto",
}

```

## 配置 editorconfig

- `editorconfig` 帮助开发人员在不同的编辑器和`IDE`之间定义和维护一致的编码样式
- 不同的开发人员，不同的编辑器，有不同的编码风格，而`editorconfig` 就是用来协同团队开发人员之间的代码的风格及样式规范化的一个工具，而`.editorconfig` 正是它的默认的配置文件
- `vscode`这类编辑器，需要自行安装 `editorconfig` 插件

### .editorconfig 
- `Unix` 系统里，每行结尾只有 `换行` ，即 `\n`  `LF`
- `Window` 系统里面，每行结尾是`换行  回车` ，即 `\r\n` `CR\LF`
- `Mac`系统里面，每行结尾是 `回车`，即 `\r` `CR`

可以在配置文件中添加如下的内容：

```
root = true

[*]
charset = utf-8
indent_style = spaces
indent_size = 2
end_of_line = if
```

## 配置 git hooks

作用：
- 可以在 `git commit` 之前检查代码，保证所有提交到版本库中的代码都是符合规范的
- 可以在 `git push` 之前执行单元测试，保证所有的提交的代码经过的单元测试
- `·husky` 可以让我们向项目中方便添加 `git hooks` 它会自动在仓库中的 `git/目录下 ` 增加相应的钩子比如 `pre-commit` 钩子就会在你执行 `commit` 命令的时候的触发
- `lint-staged` 用于实现每次提交只检查本次提交所修改的文件
- `mrm` 可以根据 `packagejson` 依赖项中的代码质量工具来安装和配置 `husky` 和 `lint-staged`
- `Commitlint` 可以规范 `git commit -m ""` 中的描述信息

安装依赖：

先安装 `mrm` ，再去安装 `lint-staged`

`mrm`安装 `lint-staged`的同时会去安装 `husky`

```js
pnpm i mrm -D

npx mrm lint-staged
```

安装完成之后可能你的 `package.json` 中会多几个配置

```json
 "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.{ts,tsx}": "eslint --cache --fix"
  },
  "devDependencies": {
    "husky": ">=7",
    "lint-staged": ">=10",
    "mrm": "^4.1.6",
  },
```



## 配置 commitlint
接下来我们需要配置 `commitlint` 来约束提交信息的格式 

`commitlint` 推荐我们使用 [config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)去写 `commit`

提交格式： `git commit -m <type>[optional scope]: <description>`
- type 用于表明我们这次提交的改动类型，是新增了功能？还是修改了测试代码？又或者是更新了文档？
- optional scope 一个可选的修改范围，用于标示此次提交主要涉及到的代码中的哪个模块
- description 一句话描述此次提交的主要内容，做到言简意赅

`type` 可选项
- build 编译相关的修改，例如发布版本，对项目构建或者依赖的变动
- chore 其他修改，比如改变构建流程，或者增加依赖库，工具等
- ci 持续集成修改
- docs 文档修改
- feature 新特性、功能
- fix 修改 bug
- perf 优化相关，比如提升性能、体验
- refactor 代码重构
- revert 回滚到上一个版本
- style 代码格式修改
- test 测试用例修改

安装依赖：

```js
pnpm install @commitlint/cli @commitlint/config-conventional -D
```

配置：

在项目的根目录下面执行命令

```cmd
npx husky add .husky/cmmmit-msg "npx --no-install commitlint --edit $1"
```
这个时候在`.husky` 文件夹下面会多出一个 `commit-msg`文件，里面有如下内容

```cmd
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no-install commitlint --edit $1

```

然后我们可以在根目录下面新建一个 `commitlint-config.js` 文件去配置我们提交的`msg`的格式

例如：
```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["build", "feature", "bug", "fix"]],
  },
};
```

这个时候如果我们再去提交代码，那么就需要按照一定的`msg`格式去提交了。

我们也可以使用 `commitlint-plugin-function-rules` 插件去自定义我们的校验方式。

## 配置别名
当我们想要使用别名`@ 、src`的时候，这个时候需要同时配置一下 `vite.config.js` 和 `tsconfig.json` 文件

`vite.config.js`

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  plugins: [vue()],
});
```

`tsconfig.json`

```json
{
    "compilerOptions": {
        "baseUrl": ".",//基本路径，表示当前路径
        "paths": {
            "@/*":["src/*"]
        }
    },
}

```

接下来我们就可以这么使用并且不会报错了 
```vue
<script setup lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
</script>

```


## 样式处理
接下来我们就处理项目中样式的配置

### 全局样式

可以在`src` 目录下面新建一个 `style` 文件夹来单独存放我们的样式文件，再在里面新建一个 `global.css` 文件，表示这个是一个全局的样式文件

可以在里面写入一个基本的样式：

```css
.title {
    color: red;
    font-weight: bolder;
}
```

你可能会发现这个是可以生效的，所以`vite` 应该默认添加了对 `css`文件的处理

### 局部样式
当我们每一个组件的 `style` 标签有 `scoped`属性时，它的 `css` 只作用于当前组件的元素，相信使用过 `vue` 的同学都知道这点

它使用 `data-v-hash` 的方式来使 `css` 有了它对应模块的标识

### 使用内联 `css module`
我们可以在组件内部使用`css module` 的方式去添加样式

例如：

```vue
<template>
  <div>
    hellow world <span :class="$style.msg">{{ msg }}</span>
  </div>
</template>
<script setup lang="ts">
import { HelloWorldType } from "./type";
defineProps(HelloWorldType);
</script>
<style module>
.msg {
  color: blue;
}
</style>
```

当然我们也可以将样式外链进来，但是如果你想使用`css module `，那么文件名一定得是 `xxx.module.css` 这种格式

例如：

```vue
<template>
  <div>
    hellow world <span :class="Style.msg">{{ msg }}</span>
  </div>
</template>
<script setup lang="ts">
import Style from "./index.module.css";
import { HelloWorldType } from "./type";
defineProps(HelloWorldType);
</script>
```

### 样式预处理器

`Vite` 也同时提供了对 `.scss .sass .less .stvl 和 .stylus` 文件的内置支持。没有必要为它们安装特定的 `Vite` 插件，但必须安装相应的预处理器依赖

`Vite` 为 `Sass和Less` 改进了 `@import` 解析，以保证 `vite` 别名也能被使用

安装依赖：

```js
pnpm install sass less -D
```

安装了之后重新启动就可以使用了

### 配置 postcss 兼容不同的浏览器
为了浏览器的兼容性，有时候我们必须加入 `-webkit, -ms ,-o , -moz` 这些前缀
- `Trident内核` 主要代表为 `IE` 浏览器，前缀为`-ms `
- `Gecko内核` 主要代表为`Firefox`，前缀为`-moz `
- `Presto内核` 主要代表为 `Opera` 前缀为 `-o`
- `Webkit内核` 产要代表为 `Chrome和Safari` 前缀为 `-webkit`

如果项目包含有效的 `PostCSS` 配置，它将会自动应用于所有已导入的 `CSS`

安装依赖：

```js
pnpm install autoprefixer  -D
```

在项目根目录下面新建一个`postcss.config.js` 文件

使用 `autoprefixer`
```js
module.exports = {
  plugins: [require("autoprefixer")],
};

```

在项目根目录下面新建一个`..browserslistrc` 文件来约束浏览器的版本，

写入配置：
```
>0.2%
not dead
not op_mini all

```

之后我们重启，发现如果样式中有一些`css3`的新特性，那么在不同的浏览器中就会被添加上不同的样式前缀来兼容

## 静态资源处理

在`vite` 配置的项目中你可以直接去引用静态资源，`vite` 会进行处理，返回一个静态资源解析后的路径

第一种方式：

```vue
<template>
  <div>
    <div>
      <img src="@/assets/test.png" width="300" />
    </div>
  </div>
</template>
```

第二种方式：

```vue
<template>
  <div>
      <img :src="TestImg" width="300" />
  </div>
</template>
<script setup lang="ts">
import TestImg from "@/assets/test.png";
</script>

```

## 其他配置
接下来大家可以接着根据自己的实际情况去配置一下东西，比如 `Mock、单元测试` 等等。。。