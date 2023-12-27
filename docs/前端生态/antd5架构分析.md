## antd5 介绍

Ant Design of React 是阿里推出的一款开箱即用的高质量组件库，可以帮助我们平时的快速开发，它有如下特点：

- 🌈 提炼自企业级中后台产品的交互语言和视觉风格。
- 📦 开箱即用的高质量 React 组件。
- 🛡 使用 TypeScript 开发，提供完整的类型定义文件。
- ⚙️ 全链路开发和设计工具体系。
- 🌍 数十个国际化语言支持。
- 🎨 深入每个细节的主题定制能力。

`antd5` 整个框架文档架构是用[dump](https://d.umijs.org/guide)来做的， 今天我们主要针对其中的几个点来学习和分析一下项目的架构实现

## 目录结构

```shell

antd

├── locale 语言文件
├── doc 一些博客文章文章之类的
├── components
     └── 组件
          ├── test 单元测试文件
          ├── demo 一些demo文件，主要用在组件库文档里面，会通过 antd内置的 code标签插入进来
          ├── .md文档 组件的文档
          ├── style  组件的样式文件 cssinjs
          └── index.tsx 入口文件
          └── main.dart
├── script 一些脚本命令文件
├── typings 一些类型声明文件
└── tests 单元测试文件
```

## 组件编写

我们以 `Button`组件为例来分析一下 `antd`的组件编写方式和规范

1、在 `index.ts` 文件中我们需要导出每一个组件的类型和改组件
例如：

```ts
import Button from './button'

export type { SizeType as ButtonSize } from '../config-provider/SizeContext'
export type { ButtonProps } from './button'
export type { ButtonGroupProps } from './button-group'

export * from './buttonHelpers'

export default Button
```

2、然后我们去看看 `Button.tsx`中的一些功能实现

在每一个组件文件的前面会定义组件中的一些类型，比如：

```ts
//摘自 Button.tsx
export interface BaseButtonProps {
  type?: ButtonType
  icon?: React.ReactNode
  shape?: ButtonShape
  size?: SizeType
  disabled?: boolean
  loading?: boolean | { delay?: number }
  prefixCls?: string
  className?: string
  rootClassName?: string
  ghost?: boolean
  danger?: boolean
  block?: boolean
  children?: React.ReactNode
}

export type NativeButtonProps = {
  htmlType?: ButtonHTMLType
  onClick?: React.MouseEventHandler<HTMLButtonElement>
} & BaseButtonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick'>

//导出button的props类型
export type ButtonProps = Partial<AnchorButtonProps & NativeButtonProps>
```

定义组件的样式类名：
在 antd 组件中，每一个组件会调用一个方法`defaultGetPrefixCls`来定义自己组件类名的前缀

```ts
//context.ts 文件
const defaultGetPrefixCls = (
  suffixCls?: string,
  customizePrefixCls?: string
) => {
  if (customizePrefixCls) return customizePrefixCls

  return suffixCls ? `ant-${suffixCls}` : 'ant'
}

//在button.tsx中 定义类名前缀，此处给的前缀是 btn，所以结合上面的函数 Button组件的样式类名前缀就是 ant-btn
const { getPrefixCls } = React.useContext(ConfigContext)
const prefixCls = getPrefixCls('btn', customizePrefixCls)
```

`antd` 使用 `classnames`库来一次性给组件绑定多个类， `classnames`库相比于我们之前的那种给组件绑定多个 class 的写法会更加的简单和便利，例如：

```jsx
<div className=classnames({
    'class1': true,
    'class2': true
    )>
</div>

classNames('foo', 'bar'); // => 'foo bar'
classNames('foo', { bar: true }); // => 'foo bar'
classNames({ 'foo-bar': true }); // => 'foo-bar'
classNames({ 'foo-bar': false }); // => ''
classNames({ foo: true }, { bar: true }); // => 'foo bar'
classNames({ foo: true, bar: true }); // => 'foo bar'
```

最后组件在渲染的时候会去走一个 `wrapSSr`的方法，这个方法由`useStyle`生成

```ts
  const [wrapSSR, hashId] = useStyle(prefixCls);
  ...
  return wrapSSR(buttonNode);
```

首先在组件内的`useStyle`传入了`warpSSR和hashID`，执行`genComponentStyleHook`，最终返回`useStyleRegister`这个函数并传入`styleFn`，核心执行`useGlobalCache`函数，`styleFn`执行时组件本身的样式和被合并的`token`就被加载到一个`StyleObj`对象上了,最后渲染出来

在 `wrapSSR` 方法中，

<!-- //https://juejin.cn/post/7190160289617150008  wrapSSr -->

## 主题样式设计

首先，当我们想要设置或者修改`antd`的默认主题的时候，按照官方的写法，我们需要在我们想要覆盖默认主题的外层包一个 `ConfigProvider`,例如：

```tsx
import React from 'react'
import { Button } from 'antd'
import { ConfigProvider } from 'antd'

export default () => {
  const theme = {
    token: {
      colorPrimary: 'red',
      colorError: '#ff4d4f',
      colorWarning: '#ffc245',
      colorSuccess: '#00c48c',
      colorText: '#3c4761',
    },
  }
  return (
    <div>
      {/* 传入theme属性，覆盖默认主题 */}
      <ConfigProvider theme={theme}>
        <Button type="primary">点击</Button>
      </ConfigProvider>
    </div>
  )
}
```

那么在 antd 组件内部是怎么实现的，可以通过这个 `ConfigProvider`来修改默认样式，下面我们一起去看看：

我们还是以`Button` 组件为例

1、首先在`button`组件中会去获取上下文中的属性

```jsx
// 使用 getPrefixCls 生成一个前缀class类名 ，比如 ant-btn
const { getPrefixCls } = React.useContext(ConfigContext)
const prefixCls = getPrefixCls('btn', customizePrefixCls)
console.log('prefixCls:', prefixCls) //ant-btn
```

<img src='@assets/antd5/prefix.png' alt="center"   />

2、然后 回从 `useStyle` 中获取 `wrapSSR` 方法 和 一个 `hashId`

```js
const [wrapSSR, hashId] = useStyle(prefixCls)
```

`useStyle` 就等于下面的直接执行函数`genComponentStyleHook`

```ts
export default genComponentStyleHook('Button', (token) => {
  const { controlTmpOutline, paddingContentHorizontal } = token
  //buttonToken 中就包含了一些样式变量，比如 color，fontSize等
  const buttonToken = mergeToken<ButtonToken>(token, {
    colorOutlineDefault: controlTmpOutline,
    buttonPaddingHorizontal: paddingContentHorizontal,
  })

  return [
    // 往token中合并新的css变量
    // Shared  共享的变量 ，比如   outline: 'none', position: 'relative',
    genSharedButtonStyle(buttonToken),

    // Size 尺寸相关的css变量 比如padding
    genSizeSmallButtonStyle(buttonToken),
    genSizeBaseButtonStyle(buttonToken),
    genSizeLargeButtonStyle(buttonToken),

    // Block
    // 设置块元素样式 width:100%
    genBlockButtonStyle(buttonToken),

    // Group (type, ghost, danger, disabled, loading)
    // 设置不同type的button的颜色， [`${componentCls}-default`]: genDefaultButtonStyle(token),
    genTypeButtonStyle(buttonToken),

    // Button Group
    // 按钮组相关样式
    genGroupStyle(buttonToken),

    // Space Compact
    genCompactItemStyle(token, { focus: false }),
    genCompactItemVerticalStyle(token),
  ]
})
```

<img src='@assets/antd5/token.png' alt="center"   />

<img src='@assets/antd5/tokenInfo.png' alt="center"   />

3、在 `genComponentStyleHook` 方法中 调用了 `@ant-design/cssinjs` 中的 `useStyleRegister` 方法，用于生成 `wrapSSR, hashId` 这两个东西

```ts
export default function genComponentStyleHook<
  ComponentName extends OverrideComponent
>(
  component: ComponentName, //组件名字
  styleFn: (
    token: FullToken<ComponentName>,
    info: StyleInfo<ComponentName>
  ) => CSSInterpolation,
  getDefaultToken?:
    | OverrideTokenWithoutDerivative[ComponentName]
    | ((token: GlobalToken) => OverrideTokenWithoutDerivative[ComponentName])
) {
  return (prefixCls: string): UseComponentStyleResult => {
    const [theme, token, hashId] = useToken()
    const { getPrefixCls, iconPrefixCls } = useContext(ConfigContext)
    const rootPrefixCls = getPrefixCls()
    // Generate style for all a tags in antd component.
    useStyleRegister(
      { theme, token, hashId, path: ['Shared', rootPrefixCls] },
      () => [
        {
          // Link
          '&': genLinkStyle(token),
        },
      ]
    )
    // 此处返回了 wrapSSR, hashId
    return [
      useStyleRegister(
        { theme, token, hashId, path: [component, prefixCls, iconPrefixCls] },
        () => {
          // ...省略
        }
      ),
      hashId,
    ]
  }
}
```

我们其实可以看到 `genComponentStyleHook` 这个函数里面主要就是调用了 `@ant-design/cssinjs` 中的 `useStyleRegister` 方法，下面我们来看看这个方法中都做了什么处理

```js
/**
 * Register a style to the global style sheet.
 */
export default function useStyleRegister(info, styleFn) {
  // ...省略
  return function (node) {
    var styleNode
    if (!ssrInline || isMergedClientSide || !defaultCache) {
      styleNode = /*#__PURE__*/ React.createElement(Empty, null)
    } else {
      var _ref4
      styleNode = /*#__PURE__*/ React.createElement(
        'style',
        _extends(
          {},
          ((_ref4 = {}),
          _defineProperty(_ref4, ATTR_TOKEN, cachedTokenKey),
          _defineProperty(_ref4, ATTR_MARK, cachedStyleId),
          _ref4),
          {
            dangerouslySetInnerHTML: {
              __html: cachedStyleStr,
            },
          }
        )
      )
    }
    return /*#__PURE__*/ React.createElement(
      React.Fragment,
      null,
      styleNode,
      node
    )
  }
}
```

我们其实可以看到`useStyleRegister` 的大致逻辑就是

- 注册一个`style`标签插入到`header`中，并将处理好了样式字符串 插入到生成的`style`标签中去
- 最后会使用` React.createElement` 去渲染我们 `wrapSSR` 方法中传入的 `node` 节点，此处指的就是 `button` 按钮

最后 `antd`中会使用 `classnames`组合多个 `class` 类名 ，并传递给 `button` 组件

```ts
const classes = classNames(
  prefixCls,
  hashId,
  {
    [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
    [`${prefixCls}-${type}`]: type,
    [`${prefixCls}-${sizeCls}`]: sizeCls,
    [`${prefixCls}-icon-only`]: !children && children !== 0 && !!iconType,
    [`${prefixCls}-background-ghost`]: ghost && !isUnBorderedButtonType(type),
    [`${prefixCls}-loading`]: innerLoading,
    [`${prefixCls}-two-chinese-chars`]:
      hasTwoCNChar && autoInsertSpace && !innerLoading,
    [`${prefixCls}-block`]: block,
    [`${prefixCls}-dangerous`]: !!danger,
    [`${prefixCls}-rtl`]: direction === 'rtl',
    [`${prefixCls}-disabled`]: hrefAndDisabled,
  },
  compactItemClassnames,
  className,
  rootClassName
)

let buttonNode = (
  <button
    {...(rest as NativeButtonProps)}
    type={htmlType}
    className={classes} // 类名集合
    onClick={handleClick}
    disabled={mergedDisabled}
    ref={buttonRef}
  >
    {iconNode}
    {kids}
  </button>
)

//wrapSSR由 useStyleRegister 方法返回
return wrapSSR(buttonNode)
```

总结：

首先在组件内的 `useStyle` 传入了 `warpSSR` 和 `hashID` ，执行 `genComponentStyleHook` ，最终返回 `useStyleRegister` 这个函数并传入 `styleFn，useStyleRegister` 最后会返回一个函数，该函数会去渲染我们包裹的组件，比如 `button，`而且还会将一些样式通过创建
`style` 标签的方式插入到 `header` 中。在`@ant-design/cssinjs `内部和 ·antd· 中有一套自己的基本主题，定义了一些基本的样式变量，每一个组件通过 `configProvider` 可以拿到具体的属性样式，从而覆盖设置每一个组件的样式

## 组件库文档设计

`antd5` 整个框架文档架构是用[dump](https://d.umijs.org/guide)来做的，项目中如果你想在 `markdown`文档里面引入`react`组件的话，只需要如下所示：

```md
<!-- 标识这个example下面的就是代码 -->

## Examples

<!-- prettier-ignore -->
<code src="./demo/basic.tsx">Basic</code>
<code src="./demo/on-change.tsx">Callback</code>
<code src="./demo/target.tsx">Container to scroll.</code>
<code src="./demo/debug.tsx" debug>debug</code>
```

此处的处理应该是 `dump` 内部实现了一个 `markdown` 的插件 ,该插件会去解析 `markdown`，如果发现有 ` ## Examples` 的标识就回去解析它下面的代码 ，把他集成到一个自己内部实现的 `react` 环境中 去渲染

感兴趣的可以自己了解一下 `dump` 的内部实现

## 组件库打包

在`antd`的`package.json`文件中，有这么一段打包命令

```json
{
  "script": {
    "build": "npm run compile && cross-env  NODE_OPTIONS='--max-old-space-size=4096' npm run dist",
    "clean": "antd-tools run clean && rm -rf es lib coverage dist report.html",
    "compile": "npm run clean && antd-tools run compile",
    "dist": "antd-tools run dist"
  }
}
```

当我们执行 `npm run build`命令的时候，他会先去执行 `npm run compile`命令将组件库编译到` lib和es`目录下面，然后通过 ` cross-env NODE_OPTIONS='--max-old-space-size=4096'`指令可以设置运行后面的 `npm run dist`命令的时候，系统给 node 分配的内存大小，因为默认 node 在一些 64 位计算机中运行的时候，默认分配的内存使用最大不会超过 `2G`

接下来我们来具体看看每一个`npm run compile` 和 `npm run dist`命令都是干了什么

`npm run compile`:
执行这个命令的时候我们可以看到先执行`npm run clean`这个命令删除了一些历史的打包文件之类的，然后主要执行的是 `antd-tools run compile` 这个命令 ，`antd-tools`是 `@ant-design` 库中的一个工具，我们可以在这儿看到
<img src='@assets/antd5/antd-tools.png' alt="center"   />

首先，他会去执行`node_modules\@ant-design\tools\lib\cli\index.js` 目录下面的文件，文件的内容如下：

```js
#!/usr/bin/env node

'use strict'

const chalk = require('chalk')
const gulp = require('gulp')

const argv = require('minimist')(process.argv.slice(2))

const cloneArgs = { ...argv }
delete cloneArgs._

console.log(
  chalk.yellow('Execute:'),
  chalk.green(argv._[1]),
  '-',
  JSON.stringify(cloneArgs)
)
console.log('  - Args:', JSON.stringify(cloneArgs))

require('../gulpfile')

// Start glup task
function runTask(toRun) {
  const metadata = { task: toRun }
  // Gulp >= 4.0.0 (doesn't support events)
  const taskInstance = gulp.task(toRun)
  if (taskInstance === undefined) {
    gulp.emit('task_not_found', metadata)
    return
  }
  const start = process.hrtime()
  gulp.emit('task_start', metadata)
  try {
    //执行task任务
    taskInstance.apply(gulp)
    metadata.hrDuration = process.hrtime(start)
    //触发任务
    gulp.emit('task_stop', metadata)
    gulp.emit('stop')
  } catch (err) {
    err.hrDuration = process.hrtime(start)
    err.task = metadata.task
    gulp.emit('task_err', err)
  }
}

//执行方法,获取到命令参数，比如 npm run compile 的 compile
runTask(argv._[1])
```

当执行到 `compile`命令的时候，主要会去执行 `gulpfile`中的 `compile` 任务,内容如下：

```js
//使用babel转化js
function babelify(js, modules) {
  const babelConfig = getBabelCommonConfig(modules) //获取到babel配置
  delete babelConfig.cacheDirectory
  if (modules === false) {
    //自定义了一个babel插件，用于替代将项目中引用lib下面的路径转化为es的模块路径
    babelConfig.plugins.push(replaceLib)
  }
  const stream = js.pipe(babel(babelConfig))
  //输出到制定目录
  return stream.pipe(gulp.dest(modules === false ? esDir : libDir))
}

function compile(modules) {
  const { compile: { transformTSFile, transformFile } = {} } = getConfig()
  rimraf.sync(modules !== false ? libDir : esDir) //module如果是true的话，就删除lib文件夹，否则删除es文件夹

  //将components目录下面的所有子目录中的 png 和 svg 文件拷贝到lib或者es
  const assets = gulp
    .src(['components/**/*.@(png|svg)'])
    .pipe(gulp.dest(modules === false ? esDir : libDir))
  let error = 0

  // =============================== FILE ===============================
  let transformFileStream

  if (transformFile) {
    transformFileStream = gulp
      .src(['components/**/*.tsx'])
      .pipe(
        through2.obj(function (file, encoding, next) {
          let nextFile = transformFile(file) || file
          nextFile = Array.isArray(nextFile) ? nextFile : [nextFile]
          nextFile.forEach((f) => this.push(f))
          next()
        })
      )
      .pipe(gulp.dest(modules === false ? esDir : libDir))
  }

  // ================================ TS ================================
  //文件匹配规则
  const source = [
    'components/**/*.tsx',
    'components/**/*.ts',
    'typings/**/*.d.ts',
    '!components/**/__tests__/**',
    '!components/**/demo/**',
    '!components/**/design/**',
  ]

  // allow jsx file in components/xxx/
  //是够允许js文件，允许的话就往数组前面加上对jsx文件的匹配规则
  if (tsConfig.allowJs) {
    source.unshift('components/**/*.jsx')
  }

  // Strip content if needed
  // gulp.src() 方法根据文件匹配规则获取源文件的读取流（source stream）
  // 通过获取源文件的读取流，后续的构建任务可以使用这个流来读取和处理源文件，生成最终的构建产物。
  let sourceStream = gulp.src(source)
  if (modules === false) {
    //如果编译es， 使用 stripCode 插件来删除源代码中的特定注释段落。
    //删除 start_comment 和 end_comment 之间的所有代码
    sourceStream = sourceStream.pipe(
      stripCode({
        start_comment: '@remove-on-es-build-begin',
        end_comment: '@remove-on-es-build-end',
      })
    )
  }

  if (transformTSFile) {
    sourceStream = sourceStream.pipe(
      through2.obj(function (file, encoding, next) {
        let nextFile = transformTSFile(file) || file
        nextFile = Array.isArray(nextFile) ? nextFile : [nextFile]
        nextFile.forEach((f) => this.push(f))
        next()
      })
    )
  }
  //使用ts插件编译文件中的ts代码，生成对应的类型申明文件 .d.ts结尾
  const tsResult = sourceStream.pipe(
    ts(tsConfig, {
      error(e) {
        tsDefaultReporter.error(e)
        error = 1
      },
      finish: tsDefaultReporter.finish,
    })
  )

  function check() {
    if (error && !argv['ignore-error']) {
      process.exit(1)
    }
  }

  tsResult.on('finish', check)
  tsResult.on('end', check)
  const tsFilesStream = babelify(tsResult.js, modules)
  //输出到指定目录
  const tsd = tsResult.dts.pipe(gulp.dest(modules === false ? esDir : libDir))
  //合并多个文件操作流
  return merge2(
    [tsFilesStream, tsd, assets, transformFileStream].filter((s) => s)
  )
}

gulp.task('compile-with-es', (done) => {
  console.log('[Parallel] Compile to es...')
  compile(false).on('finish', done)
})

gulp.task('compile-with-lib', (done) => {
  console.log('[Parallel] Compile to js...')
  compile().on('finish', () => {
    generateLocale()
    done()
  })
})

gulp.task('compile-finalize', (done) => {
  // Additional process of compile finalize
  const { compile: { finalize } = {} } = getConfig()
  if (finalize) {
    console.log('[Compile] Finalization...')
    finalize()
  }
  done()
})

gulp.task(
  'compile',
  gulp.series(
    gulp.parallel('compile-with-es', 'compile-with-lib'),
    'compile-finalize'
  )
)
```

注意点：

1、其中有一个 `getBabelCommonConfig` 方法去获取`babel`配置，我们来看看这个文件的配置是什么以及怎么配置的，具体内容如下：

```js
const {
  resolve,
  isThereHaveBrowserslistConfig,
} = require('./utils/projectHelper')

module.exports = function (modules) {
  const plugins = [
    [
      //用于将TypeScript代码转换为JavaScript代码
      resolve('@babel/plugin-transform-typescript'),
      {
        isTSX: true,
      },
    ],
    [
      //提供了一种在编译ES6+代码时使用babel-runtime来避免重复注入帮助程序的方式。
      resolve('@babel/plugin-transform-runtime'),
      {
        /**译器将生成 ES6 模块的代码，这意味着您可以使用 import/export 语法来导入/导出模块。
         * 如果 useESModules 被设置为 false，则编译器将生成 CommonJS 模块的代码，
         * 这意味着您可以使用 require/module.exports
         * 语法来导入/导出模块。默认情况下，Babel 7+ 会将 useESModules 设置为 false， */
        useESModules: modules === false,
        version:
          require(`${process.cwd()}/package.json`).dependencies[
            '@babel/runtime'
          ] || '^7.10.4',
      },
    ],
    //该插件用于将ES6+中的扩展运算符（spread operator）转换为ES5代码，以便它们可以在不支持该语法的旧版浏览器中运行。
    resolve('@babel/plugin-transform-spread'),
    //该插件用于将ES6+中的类属性（class properties）转换为ES5代码，以便它们可以在不支持该语法的旧版浏览器中运行。
    resolve('@babel/plugin-proposal-class-properties'),
    //该插件用于将ES6+中的类（class）转换为ES5代码，以便它们可以在不支持该语法的旧版浏览器中运行。
    resolve('@babel/plugin-transform-classes'),
    //插件用于在开发环境中添加警告信息，以帮助开发人员更好地调试代码。它会在控制台中输出类似于“Warning: Some warning message”的消息
    resolve('babel-plugin-transform-dev-warning'),
  ]
  //包含了 Babel 转换所需的 preset 和 plugins。其中，
  // @babel/preset-react 用于转换 React 代码，
  // @babel/preset-env 用于转换 ES6+ 代码，
  // 根据 modules 参数判断是否启用模块转换，
  // targets 选项指定了 Babel 转换的目标浏览器或者 Node.js 版本，这里如果存在
  //  .browserslistrc 文件则不进行指定。返回的对象中还包含了之前定义的 plugins 数组。
  return {
    presets: [
      resolve('@babel/preset-react'),
      [
        resolve('@babel/preset-env'),
        {
          modules,
          targets: isThereHaveBrowserslistConfig()
            ? undefined
            : {
                browsers: [
                  'last 2 versions',
                  'Firefox ESR',
                  '> 1%',
                  'ie >= 11',
                ],
              },
        },
      ],
    ],
    plugins,
  }
}
```

2、在项目中，还定义实现了一个 `babel`插件 `replaceLib` ,该插件主要的作用就是替换代码中的一些内容，如下：

```js
'use strict'

const { dirname } = require('path')
const fs = require('fs')
const { getProjectPath } = require('./utils/projectHelper')

function replacePath(path) {
  if (path.node.source && /\/lib\//.test(path.node.source.value)) {
    //编译es规则时，如果代码的import语句里面有引入某个包的lib文件夹，那么修改lib为es
    const esModule = path.node.source.value.replace('/lib/', '/es/')
    const esPath = dirname(getProjectPath('node_modules', esModule))
    if (fs.existsSync(esPath)) {
      path.node.source.value = esModule
    }
  }
  //替换icon的引用路径
  // @ant-design/icons/xxx => @ant-design/icons/es/icons/xxx
  const antdIconMatcher = /@ant-design\/icons\/([^/]*)$/
  if (path.node.source && antdIconMatcher.test(path.node.source.value)) {
    const esModule = path.node.source.value.replace(
      antdIconMatcher,
      (_, iconName) => `@ant-design/icons/es/icons/${iconName}`
    )
    const esPath = dirname(getProjectPath('node_modules', esModule))
    if (fs.existsSync(esPath)) {
      path.node.source.value = esModule
    }
  }
}

function replaceLib() {
  return {
    visitor: {
      //匹配导入ast节点
      ImportDeclaration: replacePath,
      //匹配导出ast节点
      ExportNamedDeclaration: replacePath,
    },
  }
}

module.exports = replaceLib
```

`compile`命令最后还有一步 `compile-finalize`任务，该任务只是对项目中的一些特定文件进行了一个复制操作，将`components`下面的一些文件移动到了`es和lib`目录下面，此处就不多做解释了，

接下来我们来看看 `npm run build`命令的后半部分，` npm run dist`的实现：

**疑问**.
此处抛出一个疑问，其实经历过了`compile`阶段，组件已经能够使用并且支持 es6 和 commonjs 规范的引入，为什么还需要一个 dist 打包的 min 文件呢？

**解答**.

- Ant Design 生成的 es 和 lib 目录分别包含了 ES Module 和 CommonJS Module 格式的代码，用于不同的模块加载器和打包工具。es 目录中的代码可以被 Webpack 等打包工具直接引入，而 lib 目录中的代码则适用于 Node.js 和一些其他的打包工具。而 dist 目录则是专门为浏览器端打包准备的，其中的代码已经经过了压缩和优化，可以直接在浏览器中使用。使用 Ant Design 的用户可以直接引入 dist 目录中的文件，而无需关心具体的模块加载方式和打包工具。

` npm run dist`:
`antd`在生成`dist`包的过程主要使用了`webpack`的打包，执行`npm run dist`的时候，最中会去执行 一个 名为 `dist`的 gulp 任务，在 dist 任务中，再去调用 dist 函数

```js
gulp.task(
  'dist',
  gulp.series((done) => {
    dist(done)
  })
)
```

`dist方法`

```js
function dist(done) {
  //首先删除dist文件目录
  rimraf.sync(getProjectPath('dist'))
  process.env.RUN_ENV = 'PRODUCTION' //设置环境变量为生产
  const webpackConfig = require(getProjectPath('webpack.config.js')) //加载webpack配置文件
  //执行打包
  webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.error(err.stack || err)
      if (err.details) {
        console.error(err.details)
      }
      return
    }
    const info = stats.toJson()
    const { dist: { finalize } = {}, bail } = getConfig()
    //如果构建的过程中有错误
    if (stats.hasErrors()) {
      ;(info.errors || []).forEach((error) => {
        console.error(error)
      })
      // https://github.com/ant-design/ant-design/pull/31662
      if (bail) {
        process.exit(1)
      }
    }
    //如果构建的过程中有警告
    if (stats.hasWarnings()) {
      console.warn(info.warnings)
    }
    //打印构建之后的产物信息
    const buildInfo = stats.toString({
      colors: true,
      children: true,
      chunks: false,
      modules: false,
      chunkModules: false,
      hash: false,
      version: false,
    })
    console.log(buildInfo)

    // Additional process of dist finalize，一些文件的移动
    if (finalize) {
      console.log('[Dist] Finalization...')
      finalize()
    }
    //结束
    done(0)
  })
}
```

然后我们来看看 `antd` 的 `webpack`详细配置，这里我粘贴了大致的配置项

```js
//加载一些babel配置
const babelConfig = require('./getBabelCommonConfig')(modules || false)
// babel import for components 按需加载
babelConfig.plugins.push([
  resolve('babel-plugin-import'),
  {
    style: true,
    libraryName: pkg.name,
    libraryDirectory: 'components',
  },
])

// Other package  按需引入css
if (pkg.name !== 'antd') {
  babelConfig.plugins.push([
    resolve('babel-plugin-import'),
    {
      style: 'css',
      libraryDirectory: 'es',
      libraryName: 'antd',
    },
    'other-package-babel-plugin-import',
  ])
}
//加入了自定义的babel插件，用来替换代码中的一些语法
if (modules === false) {
  babelConfig.plugins.push(require.resolve('./replaceLib'))
}

module.exports = {
  devtool: 'source-map',
  output: {
    path: 'D:\\gitee\\antd5-react-doc\\dist\\',
    filename: '[name].js',
    library: 'antd',
    libraryTarget: 'umd', //umd的打包模式
    globalObject: 'this',
  },
  resolve: {
    modules: ['node_modules', path.join(__dirname, '../node_modules')],
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.ts',
      '.tsx',
      '.js',
      '.jsx',
      '.json',
    ],
    alias: {
      antd: '当前项目目录',
    },
  },
  node: {
    child_process: 'empty',
    cluster: 'empty',
    dgram: 'empty',
    dns: 'empty',
    fs: 'empty',
    module: 'empty',
    net: 'empty',
    readline: 'empty',
    repl: 'empty',
    tls: 'empty',
  },
  module: {
    noParse: [/moment.js/], //不需要解析
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: resolve('babel-loader'),
        options: babelConfig,
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: resolve('babel-loader'),
            options: babelConfig,
          },
          {
            loader: resolve('ts-loader'),
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: resolve('css-loader'),
            options: {
              sourceMap: true,
            },
          },
          {
            loader: resolve('postcss-loader'),
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
              sourceMap: true,
            },
          },
        ],
      },

      // Images
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: resolve('url-loader'),
        options: {
          limit: 10000,
          minetype: 'image/svg+xml',
        },
      },
      {
        test: /\.(png|jpg|jpeg|gif)(\?v=\d+\.\d+\.\d+)?$/i,
        loader: resolve('url-loader'),
        options: {
          limit: 10000,
        },
      },
    ],
  },

  plugins: [
    new CaseSensitivePathsPlugin(), //该插件会自动检查模块路径的大小写是否正确,主要用于检测路径的大小写，在 Windows 操作系统中，文件名的大小写是不区分的
    //插入商标
    new webpack.BannerPlugin(`
${pkg.name} v${pkg.version}

Copyright 2015-present, Alipay, Inc.
All rights reserved.
    `),
    // 在终端中显示 Webpack 构建进度条和构建状态
    new WebpackBar({
      name: '🚚  Ant Design Tools',
      color: '#2f54eb',
    }),
    //清理 Webpack 构建过程中生成的 stats 文件
    new CleanUpStatsPlugin(),
    //滤 Webpack 构建过程中产生的警告信息
    new FilterWarningsPlugin({
      // suppress conflicting order warnings from mini-css-extract-plugin.
      // ref: https://github.com/ant-design/ant-design/issues/14895
      // see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/250
      exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
    }),
  ],
  //performance 属性用于控制构建性能的相关设置
  /**
   * 当 hints 属性的值为 false 时，Webpack 将不会输出任何性能提示信息。这意味着，
   * 无论构建过程中的文件大小、构建时间等是否超过了预设的限制，Webpack 都将不会发出任何警告或错误信息，而是简单地继续进行构建。
   */
  performance: {
    hints: false,
  },
  //需要在代码中引用一些外部依赖库，例如全局变量或 CDN 资源，减小打包体积
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    dayjs: {
      root: 'dayjs',
      commonjs2: 'dayjs',
      commonjs: 'dayjs',
      amd: 'dayjs',
    },
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          warnings: false,
        },
      }),
    ],
  },
  //入口
  entry: {
    'antd.min': ['./index'],
    //语言的入口
    'antd-with-locales.min': './index-with-locales.js',
  },
  mode: 'production',
}
```

通过这些我们就可以打包生成 `antd.min.js`

## 组件库单元测试

`antd5`中的单元测试主要用的是 `jest`工具，`Jest` 是 `Facebook` 出品的一个测试框架，相对其他测试框架，其一大特点就是就是内置了常用的测试工具，比如自带断言、`Mock` 功能、测试覆盖率工具，实现了开箱即用，在`package.json`的 `script`字段中，我们可以看到这一个命令：

```json
"script": {
  "test": "jest --config .jest.js --no-cache",
}
```

`jest` 的测试脚本名形如 `*.test.js`，不论 `Jest` 是全局运行还是通过 `npm run test` 运行，它都会执行当前目录下所有的`*.test.js 或 *.spec.js` 文件、完成测试。

下面我们去看看 `.jest.js`这个配置文件的内容：

```js
// 定需要编译的模块列表
const compileModules = [
  'dnd-core',
  'react-sticky-box',
  'tween-one',
  '@babel',
  '@ant-design',
]

const ignoreList = []

// cnpm use `_` as prefix
;['', '_'].forEach((prefix) => {
  compileModules.forEach((module) => {
    ignoreList.push(`${prefix}${module}`)
  })
})
// 忽略转换模块的正则表达式列表
// 匹配 node_modules 目录下的模块，但是排除 ignoreList 中指定的模块
const transformIgnorePatterns = [
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  `/node_modules/(?!${ignoreList.join('|')})[^/]+?/(?!(es)/)`,
]

function getTestRegex(libDir) {
  if (['dist', 'lib', 'es'].includes(libDir)) {
    return 'demo\\.test\\.(j|t)sx?$'
  }
  return '.*\\.test\\.(j|t)sx?$'
}

module.exports = {
  verbose: true, // 指示是否应在运行期间报告每个测试
  testEnvironment: 'jsdom', // 使用 JSDOM 运行测试
  setupFiles: ['./tests/setup.js', 'jest-canvas-mock'], // 指定在执行测试之前需要运行的文件
  setupFilesAfterEnv: ['./tests/setupAfterEnv.ts'], // 指定在执行测试之后需要运行的文件
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'md'], // 允许 Jest 解析的文件扩展名列表
  modulePathIgnorePatterns: ['/_site/'], // 指定 Jest 忽略的模块路径，这里包括 /_site/
  // 指定模块名称的映射关系，用于将指定的模块名称转换为另一个模块名称。
  moduleNameMapper: {
    '/\\.(css|less)$/': 'identity-obj-proxy',
    '^antd$': '<rootDir>/components/index',
    '^antd/es/(.*)$': '<rootDir>/components/$1',
  },
  // 忽略特定测试文件的正则表达式列表
  testPathIgnorePatterns: [
    '/node_modules/',
    'dekko',
    'node',
    'image.test.js',
    'image.test.ts',
  ],
  // 指定转换器（preprocessor）的映射关系，用于将指定类型的文件转换为 JavaScript 代码
  transform: {
    '\\.tsx?$': './node_modules/@ant-design/tools/lib/jest/codePreprocessor',
    '\\.(m?)js$': './node_modules/@ant-design/tools/lib/jest/codePreprocessor',
    '\\.md$': './node_modules/@ant-design/tools/lib/jest/demoPreprocessor',
    '\\.(jpg|png|gif|svg)$':
      './node_modules/@ant-design/tools/lib/jest/imagePreprocessor',
  },
  // 指定 Jest 应该运行哪些测试
  testRegex: getTestRegex(process.env.LIB_DIR),
  // 指定哪些文件需要收集代码覆盖率信息。
  collectCoverageFrom: [
    'components/**/*.{ts,tsx}',
    '!components/*/style/index.tsx',
    '!components/style/index.tsx',
    '!components/*/locale/index.tsx',
    '!components/*/__tests__/type.test.tsx',
    '!components/**/*/interface.{ts,tsx}',
    '!components/*/__tests__/image.test.{ts,tsx}',
    '!components/__tests__/node.test.tsx',
    '!components/*/demo/*.tsx',
    '!components/*/design/**',
  ],
  transformIgnorePatterns, // 忽略转换模块的正则表达式列表,转换器要忽略的路径
  // 试环境中可使用的全局变量
  globals: {
    'ts-jest': {
      tsConfig: './tsconfig.test.json',
    },
  },
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  // bail: true,
  maxWorkers: '50%',
}
```

接下来，我们去看看 `antd` 中组件的测试用例怎么写的，以 `Button` 组件为例，下面我只是截取了一部分的`Button`测试用例

相关函数

```js
// 挂载测试
// eslint-disable-next-line jest/no-export
export default function mountTest(Component: React.ComponentType) {
  describe(`mount and unmount`, () => {
    // https://github.com/ant-design/ant-design/pull/18441
    it(`component could be updated and unmounted without errors`, () => {
      // 此处的render方法由 @testing-library/react 工具提供
      // 返回一个渲染和卸载方法
      const { unmount, rerender } = render(<Component />);
      expect(() => {
        rerender(<Component />);
        unmount();
      }).not.toThrow();// 表示前面的语句不应该抛出异常，如果有异常则测试失败。
    });
  });

  // Right-to-Left，从右向左）方向下是否能够正确地渲染
const rtlTest = (Component: React.ComponentType, mockDate = false) => {
  describe('rtl render', () => {
    it('component should be rendered correctly in RTL direction', () => {
      if (mockDate) {
        MockDate.set(dayjs('2000-09-28').valueOf());
      }
      const { container } = render(
        <ConfigProvider direction="rtl">
          <Component />
        </ConfigProvider>,
      );
      // 然后将渲染结果的第一个子节点与之前保存的快照进行比较
      expect(container.firstChild).toMatchSnapshot();
      if (mockDate) {
        MockDate.reset();
      }
    });
  });
};
```

```js
import { resetWarned } from 'rc-util/lib/warning'
import React from 'react'
import Button from '..'
import mountTest from '../../../tests/shared/mountTest'
import rtlTest from '../../../tests/shared/rtlTest'
import { render } from '../../../tests/utils'

describe('Button', () => {
  // 挂载测试
  mountTest(Button)
  mountTest(() => <Button size="large" />)
  // Right-to-Left，从右向左）方向下是否能够正确地渲染
  rtlTest(Button)
  rtlTest(() => <Button size="large" />)
  rtlTest(() => <Button size="small" />)

  // 将渲染结果的第一个子节点与之前保存的快照进行比较，如果不一致则测试失败
  it('renders correctly', () => {
    const { container } = render(<Button>Follow</Button>)
    expect(container.firstChild).toMatchSnapshot()
  })

  it('mount correctly', () => {
    // 表示前面的语句不应该抛出异常，如果有异常则测试失败。
    expect(() => render(<Button>Follow</Button>)).not.toThrow()
  })

  it('warns if size is wrong', () => {
    resetWarned() // 重置警告信息状态
    // 创建一个模拟的 console.error 函数，以便在测试过程中捕获警告信息
    const mockWarn = jest.spyOn(console, 'error').mockImplementation(() => {})
    const size = 'who am I'
    // @ts-expect-error: Type '"who am I"' is not assignable to type 'SizeType'.ts(2322)
    render(<Button.Group size={size} />)
    // 表示检查是否捕获到了警告信息，并且该信息是否包含特定的内容
    expect(mockWarn).toHaveBeenCalledWith(
      'Warning: [antd: Button.Group] Invalid prop `size`.'
    )
    // 还原模拟的 console.error 函数的实现
    mockWarn.mockRestore()
  })

  it('renders Chinese characters correctly in HOC', () => {
    const Text = ({ children }: { children: React.ReactNode }) => (
      <span>{children}</span>
    )
    const { container, rerender } = render(
      <Button>
        <Text>按钮</Text>
      </Button>
    )
    expect(container.querySelector('.ant-btn')).toHaveClass(
      'ant-btn-two-chinese-chars'
    )

    rerender(
      <Button>
        <Text>大按钮</Text>
      </Button>
    )
    // 验证是否有这个class 类
    expect(container.querySelector('.ant-btn')).not.toHaveClass(
      'ant-btn-two-chinese-chars'
    )
  })
})
```

## ts-node

`ts-node` 是一个`Node.js `的执行环境，它可以让你在`Node.js` 环境中直接运行`TypeScript` 代码。 它通过在运行时将`TypeScript` 转译为`JavaScript `来实现这一点，因此你不需要在编写`TypeScript `代码之前先将其转译为`JavaScript`。

## pre-publish 的一些检查

在`antd`发布新的版本之前，内部会先执行一个 `npm run pre-publish`命令，改命令会对项目中的一些配置或者代码规范做一个检查，下面我们来看看

```json
{
  "scripts": {
    "pre-publish": "npm run test-all -- --skip-build",
    "test-all": "sh -e ./scripts/test-all.sh"
  }
}
```

执行 `pre-publish` 命令最后会去执行一个 `shell`脚本文件，根据这个脚本的命令，我们来依次研究他的命令步骤

首先：执行`check-commit` 命令，检查各种预发布的条件（版本号，分支，git 的状态 status，远程仓库是否可以连接）

下面是相关脚本：

```js
/* eslint-disable import/no-dynamic-require, no-console */
const chalk = require('chalk')
const path = require('path')
const fetch = require('isomorphic-fetch')
const simpleGit = require('simple-git')

const cwd = process.cwd()
const git = simpleGit(cwd)

const { version } = require(path.resolve(cwd, 'package.json'))

function exitProcess(code = 1) {
  console.log('') // Keep an empty line here to make looks good~
  process.exit(code)
}

async function checkVersion() {
  try {
    const { versions } = await fetch('http://registry.npmjs.org/antd').then(
      (res) => res.json()
    )
    if (version in versions) {
      console.log(
        chalk.yellow(
          '😈 Current version already exists. Forget update package.json?'
        )
      )
      console.log(chalk.cyan(' => Current:'), version)
      exitProcess()
    }
  } catch (error) {
    console.log(chalk.red('🚨 Check version failed. Skip...'))
  }
}

async function checkBranch({ current }) {
  if (
    version.includes('-alpha.') ||
    version.includes('-beta.') ||
    version.includes('-rc.') ||
    version.includes('-experimental.')
  ) {
    console.log(chalk.cyan('😃 Alpha version. Skip branch check.'))
  } else if (current !== 'master' && current !== '4.0-prepare') {
    console.log(chalk.yellow('🤔 You are not in the master branch!'))
    exitProcess()
  }
}

async function checkCommit({ files }) {
  if (files.length) {
    console.log(chalk.yellow('🙄 You forgot something to commit.'))
    files.forEach(({ path: filePath, working_dir: mark }) => {
      console.log(' -', chalk.red(mark), filePath)
    })
    exitProcess()
  }
}

async function checkRemote() {
  try {
    const { remote } = await git.fetch('origin', 'master')
    if (remote?.indexOf('ant-design/ant-design') === -1) {
      console.log(
        chalk.yellow(
          '😓 Your remote origin is not ant-design/ant-design, did you fork it?'
        )
      )
      exitProcess()
    }
  } catch (error) {
    console.log(chalk.red('🚨 Check remote failed. Skip...'))
  }
}

async function checkAll() {
  const status = await git.status()

  await checkVersion()

  await checkBranch(status)

  await checkCommit(status)

  await checkRemote()
}

checkAll()
```

然后第二步会去执行：`npm run lint`

`npm run lint` 命令会将新的版本号写入到 `version.ts` 中

```js
const fs = require('fs-extra')
const path = require('path')

const { version } = require('../package.json')

fs.writeFileSync(
  path.join(__dirname, '..', 'components', 'version', 'version.ts'),
  `export default '${version}';`,
  'utf8'
)
```

然后会去执行 `tsc --noEmit` 命令

执行`tsc --noEmit`, `TSC` 会读取配置文件获取参数值，`--noEmit`的作用是只进行检查，不进行编译输出。如果我们的代码无错，会直接退出，否则报错

最后会去执行 `npm run test` 命令

就是会跑一遍项目里面的单元测试，只有所有的单元测试都通过了，才能达到发布的标准

```json
{
  "scripts": {
    "test": "jest --config .jest.js --no-cache",
    "test-node": "npm run version && jest --config .jest.node.js --no-cache" //执行node环境下的单元测试文件
  }
}
```

## 按需加载

<!-- babel-plugin-import的作用和使用场景
babel-plugin-import 是一个用于按需加载组件代码的 Babel 插件，它可以帮助你在打包时减小文件体积，提高应用的性能。

在 JavaScript 应用中，经常会使用第三方库和组件来加速开发和提高代码质量。然而，如果将整个第三方库或组件都打包进应用中，会导致应用文件变得非常大，加载时间也会变长，影响用户体验。

为了解决这个问题，我们可以使用按需加载的技术，只在需要的时候才加载组件代码。而 babel-plugin-import 就是用来帮助我们实现按需加载的。

使用 babel-plugin-import，我们可以将代码中引入的第三方组件，自动转换为按需加载的形式。这样就可以只加载需要的组件，而不是整个第三方库。

使用场景：

当你的项目中引入了许多第三方组件时，可以使用 babel-plugin-import 将组件的按需加载优化。
通常情况下，React 的 UI 组件库都支持按需加载，使用 babel-plugin-import 可以更方便地使用这些组件库，并且可以大大减小应用的文件体积。



mr.zhou.ping.w@gmail.com
babel-plugin-import可以在打包时减小文件体积，但是webpack打包的时候本身就会tree shake来减少代码体积，那么 babel-plugin-import是不是作用不大
虽然 Webpack 在打包时会进行 tree shaking，但它只能消除未被使用的模块和代码。而对于按需加载组件的情况，如果整个组件库都被打包进去，即使其中只有一小部分被使用，也会导致整个组件库被打包进去，从而增加了应用的文件体积，这会影响应用的性能。

babel-plugin-import 的作用是将按需加载组件的代码转换为 webpack 可以正确解析的代码，从而只加载应用需要的组件代码，而不是整个组件库的代码。这样可以减少应用的文件体积和加载时间，提高应用的性能。

因此，babel-plugin-import 在一些场景下仍然有作用。特别是对于那些第三方组件库，如果不使用按需加载方式，那么即使 Webpack 进行了 tree shaking，也会将整个组件库打包进应用中，导致不必要的资源浪费。




mr.zhou.ping.w@gmail.com
为什么按需加载的情况下，webpack会将整个组件库打包进应用中
按需加载是指在应用运行时，只有需要使用的组件才会被加载，而不是在应用打包时将整个组件库打包进去。但是，在一些情况下，webpack 仍然会将整个组件库打包进应用中。

这是因为在应用代码中使用了组件库的导入语法，而该语法无法被 webpack 自动转换为按需加载的形式。比如在 React 项目中，我们通常使用以下形式导入组件：

javascript
Copy code
import { Button } from 'antd';
这种导入语法在 webpack 中会被视为一种模块依赖，因此 webpack 会将整个 antd 库打包进去。如果只需要使用 Button 组件，那么这种做法就会浪费大量不必要的资源。

为了解决这个问题，我们可以使用 babel-plugin-import 来将导入语法转换为按需加载的形式，从而只加载需要使用的组件代码。这样就可以避免将整个组件库打包进应用中，从而减少了应用的文件体积和加载时间，提高了应用的性能。




mr.zhou.ping.w@gmail.com
babel-plugin-import 如何将导入语法转换为按需加载的形式的
babel-plugin-import 可以将 ES6 模块化语法或 CommonJS 规范的导入语法转换为按需加载的形式，具体操作如下：

安装 babel-plugin-import：
bash
Copy code
npm install babel-plugin-import --save-dev
在 babel 配置文件中（如 .babelrc）配置 babel-plugin-import：
json
Copy code
{
  "plugins": [
    ["import", {
      "libraryName": "antd",
      "libraryDirectory": "es",
      "style": true
    }]
  ]
}
其中，libraryName 指定了需要按需加载的组件库名称，libraryDirectory 指定了组件库的代码路径（通常是 lib 或 es），style 指定是否需要按需加载样式文件。这里以 antd 组件库为例，libraryDirectory 设置为 es，表示加载 ES6 模块化的代码。

在应用中按需加载组件：
javascript
Copy code
import { Button } from 'antd';
使用 Webpack 打包应用时，Webpack 会自动将按需加载的组件转换为正确的代码形式，只加载需要使用的组件代码，而不是整个组件库的代码。
以上就是使用 babel-plugin-import 将导入语法转换为按需加载形式的操作步骤。通过这种方式，我们可以减小应用的文件体积，提高应用的性能。




mr.zhou.ping.w@gmail.com
babel-plugin-import 将导入语法转换为按需加载的形式的原理
babel-plugin-import 的原理是在编译时将 ES6 模块化语法或 CommonJS 规范的导入语法转换为按需加载的形式。它通过 babel 的插件机制，对源代码进行 AST 解析和修改，将原来的导入语法转换为按需加载的形式。

具体来说，babel-plugin-import 会将形如：

javascript
Copy code
import { Button } from 'antd';
的导入语句转换为：

javascript
Copy code
import Button from 'antd/es/button';
这里的 es 表示加载 ES6 模块化的代码，从而只加载需要使用的组件代码，而不是整个组件库的代码。

在上述例子中，babel-plugin-import 会解析导入语句中的组件名称，然后根据组件名称和配置中的组件库名称和代码路径，生成对应的按需加载语句。这样，在编译后，原来的导入语句就会被替换为按需加载的形式，从而实现了按需加载的功能。

需要注意的是，babel-plugin-import 只负责将导入语句转换为按需加载的形式，而不负责实际的按需加载操作。在 Webpack 中，需要使用相关的 loader 或插件（如 babel-plugin-dynamic-import-webpack）来实现按需加载功能。

总之，babel-plugin-import 的原理是在编译时将 ES6 模块化语法或 CommonJS 规范的导入语法转换为按需加载的形式，从而减小应用的文件体积，提高应用的性能。 -->
