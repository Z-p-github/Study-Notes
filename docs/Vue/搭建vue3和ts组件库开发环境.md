Vue3 的源码是采用的 `Monorepo` 的方式进行管理的，这样就可以把不同功能的代码放到不同的包中去单独进行管理

例如：

- compiler-xxx 存储和编译器相关的代码
- reactivity 响应式相关代码
- runtime-xxx 运行时相关代码

## 什么是 Monorepo

`Monorepo` 是管理项目代码的一个方式，中文：单体仓库 (单个仓库)，就是单个项目仓库 (repository)，其中包含多个开发项目 project (模块 module，或包 package)。虽然这些 project 也许是相关联的，但它们通常在逻辑上相互独立，并被不同的团队负责编写，运行。

优点：

- 一个仓库可维护多个模块，不用到处找仓库
- 方便版本管理和依赖管理，模块之间的引用，调用都非常方便
- 透明度：所有人都能看到所有人写的代码，这一特点能够更好的协作和跨团队贡献 (collaboration and cross-team contributions)，另一个团队中的开发人员可以修复代码中你甚至不知道存在的 bug。
- 简化依赖管理：共享依赖是轻而易举的。几乎不需要用到包管理器，因为所有 module 都保存在在同一个代码仓库中。
- Single 的真正原因：所有依赖仅有一个版本，意味着没有版本冲突和 Dependency hell (相依性地狱、依赖地狱)。
  一致性：当你将所有代码库集中在一个地方时，执行代码质量标准和统一风格会更容易。
- 共享时间线：当 API 或共享的库中有重大变更 (breaking changes) 时就会立刻暴露出来，迫使不同的团队提前沟通并联合起来。每个人都致力于跟上变化。
- Atomic Commits：Atomic Commits 使大规模重构更容易。开发人员可以在一次 commit 中更新多个包或项目。

缺点：

随着 monorepos 越来越庞大，我们在版本控制工具、构建系统和 CI pipelines 方面会面临设计极限

- 糟糕的性能：monorepos 很难扩大规模。诸如 git blame 之类的命令可能会花费非常长的时间，IDE 开始卡顿，生产力受到影响，而且在每次提交后的测试阶段变得苦不堪言。
- 污染主线分支 main/master：一个烂的 master branch 会影响所有在 monorepo 工作的人。这可被视为导致灾难，或者是保持测试 tests clean 和 up to date 的诱因。
- 学习曲线：如果项目仓库中有跨越许多紧密耦合的 project，那么新开发人员的学习曲线将会更加陡峭。
- 大量数据：monorepos 每天会处理大量的数据和 commit。
- 文件权限管理：管理文件权限更具挑战性，因为像 Git 或 Mercurial 这样的系统没有内置的权限管理机制。
  代码审查：通知 (notifications) 会变得非常嘈杂。例如，GitHub 的通知功能，当一连串的 pull requests 和 code reviews 时并不友好。

vue3 中使用 `pnpm workspace` 来实现的 `monorepo` (pnpm 是快速、节省磁盘空间的包管理器，主要采用符号链接的方式管理模块)

## 开始搭建

### 全局安装 `pnpm`

```js
npm install pnpm -g //全局安装
```

### 初始化

```js
pnpm init
```

### 创建 `.npmrc` 文件

默认情况下，`pnpm` 创建一个半严格的 `node_modules`，这意味着依赖项可以访问未声明的依赖项，但 `node_modules` 之外的模块不行。 通过这种布局，生态系统中的大多数的包都可以正常工作。 但是，如果某些工具仅在提升的依赖项位于根目录的 `node_modules` 时才有效，您可以将其设置为 true 来为您提升它们，其实就是提升所有依赖到根 node_modules 目录下

```js
shamefullly-hoist = true
```

### 安装 vue3 和 typescript

```js
npm install vue@next typescript --save
```

### 生成 ts 配置文件

```js
npx tsc --init
```

### 添加 ts 配置

```json
{
  "compilerOptions": {
    "module": "ESNext", // 打包模块类型ESNext
    "declaration": false, // 默认不要声明文件
    "noImplicitAny": true, // 支持类型不标注可以默认any
    "removeComments": true, // 删除注释
    "moduleResolution": "node", // 按照node模块来解析
    "esModuleInterop": true, // 支持es6,commonjs模块
    "jsx": "preserve", // jsx 不转
    "noLib": false, // 不处理类库
    "target": "es6", // 遵循es6版本
    "sourceMap": true,
    "lib": [
      // 编译时用的库
      "ESNext",
      "DOM"
    ],
    "allowSyntheticDefaultImports": true, // 允许没有导出的模块中导入
    "experimentalDecorators": true, // 装饰器语法
    "forceConsistentCasingInFileNames": true, // 强制区分大小写
    "resolveJsonModule": true, // 解析json模块
    "strict": true, // 是否启动严格模式
    "skipLibCheck": true // 跳过类库检测
  },
  "exclude": [
    // 排除掉哪些类库
    "node_modules",
    "**/__tests__",
    "dist/**"
  ]
}
```

### 在根目录下面创建 `pnpm-workspace.yaml ` 文件

`pnpm-workspace.yaml` 定义了 [工作空间](https://pnpm.io/zh/workspaces) 的根目录，并能够使您从工作空间中包含 / 排除目录 。 默认情况下，包含所有子目录。

```yaml
packages:
  - play # 存放我们组件测试的时候的代码
  - docs # 存放我们组件文档的
  - "packages/**"
```

### 创建子 `package.json`

在`play`文件夹下面 初始化一个 `package.json` 文件，添加 `private` 属性，那 npm 将拒绝发布这个包， 这是防止私人存储库意外发布的一种方法。

```json
{
  "name": "@vue3/play",
  "version": "1.0.0",
  "description": "",
  "private": "true",
  "main": "index.js",
  "scripts": {
    "dev": "vite",
    "build": "vue-tsc --noEmit && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@vicons/ionicons5": "^0.12.0",
    "vue": "^3.2.25"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "@vitejs/plugin-vue": "^3.0.3",
    "@vitejs/plugin-vue-jsx": "^2.0.0",
    "typescript": "^4.7.4",
    "vite": "^3.0.9",
    "vue-tsc": "^0.40.1"
  }
}
```

安装依赖：

```js
pnpm i @vitejs/plugin-vue @vitejs/plugin-vue-jsx typescript vite vue-tsc -D
```

因为 `play` 目录是我们用来测试写的组件的功能的，所以配置一个 `vite` 打包，会提升我们的效率

创建 `vite.config.js` 文件

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; //vite的vue插件
import DefineOptions from "unplugin-vue-define-options/vite"; //可以在vue3中定义组件的name属性
import vueJsx from "@vitejs/plugin-vue-jsx"; //支持vue的tsx写法
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vueJsx(), vue(), DefineOptions()],
});
```

接着在 `play` 文件夹中创建一个 `index.html` 文件用来存放打包后的 js 代码

修改内容如下

```html
<body>
  <div id="app"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
```

### play 文件夹初始化 ts 配置文件

在 `play` 文件夹中初始化一个 ts 配置文件

```js
npm tsx --init
```

写入配置：

```json
{
  "compilerOptions": {
    "target": "esnext",
    "useDefineForClassFields": true,
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom"],
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts", "src/**/*.tsx", "src/**/*.vue"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

这里的配置文件为什么会有一个`references` 属性呢

这是 `TypeScript 3.0` 新增的 [项目引用（Project References）](https://www.typescriptlang.org/docs/handbook/project-references.html) 功能，它允许用户为项目的不同部分使用不同的 TypeScript 配置

我们需要创建一个 `tsconfig.node.json` 文件，`tsconfig.node.json` 是专门用于 `vite.config.ts` 的 `TypeScript` 配置文件。

```json
{
  "compilerOptions": {
    "composite": true, // 对于引用项目必须设置该属性
    "module": "esnext",
    "moduleResolution": "node"
  },
  "include": ["vite.config.ts"]
}
```

`tsconfig.node.json` 文件说明

- `tsconfig.node.json` 是专门用于 `vite.config.ts` 的 `TypeScript` 配置文件。
- `tsconfig.json `文件通过 `references` 字段引入 `tsconfig.node.json` 中的配置。
- 使用 `references` 字段引入的配置文件需要设置 `composite: true` 字段，并用 `include` 或 `files` 等等属性指明配置覆盖的文件范围。

### 在根目录创建 shims-vue.d.ts 文件

该文件的作用是主要为项目内所有的 vue 文件做模块声明，毕竟 ts 默认只识别 .d.ts、.ts、.tsx 后缀的文件

```js
declare module '*.vue' {
    import type { DefineComponent } from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
  }

```

### 配置开发启动命令

在根目录下面的 `package.json` 文件中 添加一个 `dev` 命令

```json
  "scripts": {
    "dev": "pnpm -C play dev",
  },
```

`pnpm -C` 的意思是指定一个 工作目录，这里是指定 `play`目录，然后去执行该目录下面的 `npm run dev` 命令

### 安装依赖

1、在根目录中去安装其他子包

当我们要在其中一个包中使用另外一个包中的东西的时候，可以使用 `pnpm install xxx -w` 的方式去安装

例如：

```js
pnpm install @vue3/components -w
```

这个时候就会在包的依赖中产生一个指向工作目录的一个依赖项

```json
  "dependencies": {
    "@vue3/components": "workspace:^1.0.0",
  }
```

`workspace` 表明这是一个工作目录中的包，后面紧跟的是这个包的版本号

2、在子包中去安装另外一个子包

```js
pnpm install 依赖子包名字@workspace --filter 目标子包名字
```

例如：

```js
pnpm install @vue3/shared@workspace --filter @vue3/components
```

这个命令就会在 `@vue3/components` 这个模块中 去安装 `@vue3/shared` 这个依赖

## 搭建组件库文档

我们也可以在项目的根目录下创建一个 `doc` 的文件夹，里面写上每个组件的具体用法，可以借助 `vitepress` 这个工具库去实现文档的编写

然后可以在根目录的`package.json`文件中配置一个命令去启动 `doc`文件中的 `vitepress dev .` 命令

```json
 "doc:dev": "pnpm -C docs dev"
```
