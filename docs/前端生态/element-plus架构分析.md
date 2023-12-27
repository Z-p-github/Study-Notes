`element-plus` 是采用的 `pnpm`的`monorepo`的方式来实现多个包的管理，下面我们主要来看看下面这几个点是如何实现的

### 样式主题设计
`element-plus`中的所有`scss`代码都存放在 `theme-chalk`文件夹中.

#### 暗黑模式

在`theme-chalk`中，`element-plus`定义了两套变量，分别是`暗黑模式`和`正常颜色`

- 暗黑模式的一些颜色变量写在 `theme-chalk/src/dark/var.scss` 下面
- 正常主题颜色的变量主要是写在了 `theme-chalk/src/common/var.scss`

暗黑模式的切换主要通过给`html`标签增加一个 `class="dark"`的类来改变的，具体如何使用的话可以参考一下[官方文档](https://element-plus.org/zh-CN/guide/dark-mode.html)


#### 变量设计

在`element-plus`中，使用的`sass`语法去定义的变量，并且使用了`sass:map` 这个包来定义一些变量的map值，例如：

```scss
// Color
$colors: () !default;
$colors: map.deep-merge(
  (
    'white': #ffffff,
    'black': #000000,
    'primary': (
      'base': #409eff,
    ),
    'success': (
      'base': #67c23a,
    ),
    'warning': (
      'base': #e6a23c,
    ),
    'danger': (
      'base': #f56c6c,
    ),
    'error': (
      'base': #f56c6c,
    ),
    'info': (
      'base': #909399,
    ),
  ),
  $colors
);
```

这个语法的意思是：
**首先，通过 $colors: () !default; 初始化了一个空的 Map 变量。接下来，使用 map.deep-merge() 函数将一组颜色定义合并到 $colors 变量中。map.deep-merge() 函数是 Sass 提供的一种合并 Map 的方法，它允许将多个 Map 合并为一个新的 Map。**

后续使用的时候就可以像下面这样使用：
```scss
$color-white: map.get($colors, 'white') !default;
```

#### bem
在`element-plus`内部，很多组件样式的编写是基于一种`bem`的规范来写的，简而言之就是一种`css`的命名规范，使用这种规范写出来的css可以避免重复，并且`css`类名可以更加精准的去描述一个dom元素，让后续维护也变得更加简单。

`bem`基本概念:

`bem` 将 `CSS` 类名称分为三类：
- 块（block）：是一个独立的组件，可在页面上重复使用。块的类名称应该简洁、描述性和唯一，以便于识别和使用。示 例：.card、.button、.menu。

- 元素（element）：是块的一部分，不能单独使用，必须与块一起使用。元素的类名称应该以块的类名称为前缀，以两个下划线（）和元素名称作为后缀。示例：.cardtitle、.buttonicon、.menuitem。

- 修饰符（modifier）：是块或元素的变化或状态。修饰符的类名称应该以块或元素的类名称为前缀，以一个连字符（--）和修饰符名称作为后缀。示例：.card--featured、.button--disabled、.menu__item--active。

简化的`bem`实现
```scss
@mixin b($block) {
    $B: $namespace+'-'+$block;
    .#{$B} {
        @content;
    }
}

// .t-button.is-xx
@mixin when($state) {
    @at-root {
        &.#{$state-prefix + $state} {
            @content
        }
    }
}

@mixin m($modifier) {
    @at-root {
        #{& + $modifier-separator + $modifier} {
            @content
        }
    }
}

@mixin e($element) {
    @at-root {
        #{& + $element-separator + $element} {
            @content
        }
    }
}

```

上面的实现有几个语法和概念：

**1、`@at-root`**

` @at-root` 规则允许你将 `CSS` 规则从当前嵌套层级提升到顶层。这样，生成的 `CSS `规则将不再继承父级选择器的层级结构，而是直接位于顶层 ，例如：

```scss
.container {
  color: red;

  @at-root {
    .inner {
      color: blue;
    }
  }
}
```
会被编译成：
```css
.container {
  color: red;
}

.inner {
  color: blue;
}
```
在上述示例中，`.inner` 规则被嵌套在 `.container `规则内部。但是，通过使用 `@at-root `规则，`.inner` 规则被提升到顶层，不再继承 `.container` 的层级结构

**2、插值语句 `#{}`**

在`scss`中，可以通过 `#{}` 插值语句可以在选择器或属性名中使用变量，例如：
```scss
$name: foo;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}
```
被编译为：
```css
p.foo {
  border-color: blue; 
}
```

`#{}` 插值语句也可以在属性值中插入 `SassScript`，大多数情况下，这样可能还不如使用变量方便，但是使用 `#{}` 可以避免 `Sass` 运行运算表达式，直接编译 `CSS`，例如：

```scss
p {
  $font-size: 12px;
  $line-height: 30px;
  font: #{$font-size}/#{$line-height};
}
```
编译成：
```css
p {
  font: 12px/30px; 
}
```

**2、`@content`**
`@content` 允许你在使用 `mixin` 或函数时传递额外的代码，并将其插入到 `mixin` 或函数的定义中

```scss
@mixin my-mixin {
  @content;
}

```
使用：
```scss
 .my-element {
  /* 其他样式定义 */
  @include my-mixin {
    /* 插入到 @content 的代码 */
    font-size:10px
  }
}
```

编译成:
```css
 .my-element {
    font-size:10px
}
```

### 打包设计
`element-plus`的打包代码在 `internal/build`这个下面，我们可以看到他是用`gulp`工具来构建的，主要是就是下面这几句代码：
`build/gulpfile.ts`文件
```js
export default series(
  //清理打包文件
  withTaskName('clean', () => run('pnpm run clean')),
  withTaskName('createOutput', () => mkdir(epOutput, { recursive: true })),

  parallel(
    //按模块打包（按需打包）
    runTask('buildModules'),
    // 全量打包
    runTask('buildFullBundle'),
    // 打包ts类型文件
    runTask('generateTypesDefinitions'),
    //打包主题样式
    series(
      withTaskName('buildThemeChalk', () =>
        run('pnpm run -C packages/theme-chalk build')
      ),
      //复制样式文件到打包好的组件目录下面
      copyFullStyle
    )
  ),
)
```
`element-plus`打包主要就是用的`rollup`来做的，比如按模块打包:

```ts
export const buildModules = async () => {
  const input = excludeFiles(
    //打包入口是组件目录下面的所有的文件，匹配成功之后，就可以基于每个文件依次打包
    await glob('**/*.{js,ts,vue}', {
      cwd: pkgRoot,
      absolute: true,
      onlyFiles: true,
    })
  )
  const bundle = await rollup({
    input,
    //配置的一些插件
    plugins: [
      ElementPlusAlias(),
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue({
            isProduction: false,
          }),
          vueJsx: vueJsx(),
        },
      }),
      nodeResolve({
        extensions: ['.mjs', '.js', '.json', '.ts'],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target,
        loaders: {
          '.vue': 'ts',
        },
      }),
    ],
    external: await generateExternal({ full: false }),
    treeshake: false,
  })
  //输出，手动写入文件
  await writeBundles(
    bundle,
    buildConfigEntries.map(([module, config]): OutputOptions => {
      return {
        format: config.format,
        dir: config.output.path,
        exports: module === 'cjs' ? 'named' : undefined,
        preserveModules: true,
        preserveModulesRoot: epRoot,
        sourcemap: true,
        entryFileNames: `[name].${config.ext}`,
      }
    })
  )
}


```

全量打包：

**全量打包和按模块打包最主要的区别就在于这个打包入口，全量打包的入口就是存放组件的根目录下面的 `index.ts`**

此处不多做说明，可自行查看 `internal\build\src\tasks\full-bundle.ts`


