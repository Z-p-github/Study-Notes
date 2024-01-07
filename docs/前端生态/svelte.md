## svelte

最近由于公司内部需求，需要将一个组件提成公共组件，可以跨项目和跨技术栈使用，我们公司同时存在`vue`和`react`技术栈，考虑到以下几个问题：
- 1、`不同技术栈的存在`，由于前端项目中同时存在 React 和 Vue 框架，以及前端框架的不同版本，需要确保 Copilot 能够跨这些不同的技术栈进行使用
- 2、`维护性和可扩展性`，为了降低维护成本并提高项目的可扩展性，期望将 Copilot 作为一个公共组件库来统一管理和维护
- 3、`多平台应用`，提取的公共组件需要跨平台使用，需要考虑平台接入的兼容性和难易程度
- 4、`学习成本`，需要团队成员能够快速上手开发或接入，减少团队成员的学习成本
 
 我们决定使用 `svelte`框架来实现

 ### 如何封装一个能够支持跨前端框架 的组件

 目前市场上有其他几种方案可以支持

`Vanilla JS`

优点：
- 1、所有框架中都支持

缺点：
- 1、命令式编程方式
- 2、DOM 操作繁琐
- 3、开发效率低
- 4、代码冗余

`Web Components`

优点：
- 1、原生浏览器支持，具备天然的跨框架特性

缺点：
- 1、兼容性问题，浏览器支持不完全
- 2、引入的新概念比较多，学习成本较大
- 3、仍存在很多试验性 API，仍存在变动的可能

### svelte 优点

选择的`svelte`的原因如下：

优点：
- 1、语法简单，语法和 vue 3 很像
- 2、高性能前端框架
- 3、打包的产物很小，它可以把组件打包成 `JS Class ` 的形式，打包产物是无框架的，`Svelte` 的核心思想在于『通过静态编译减少框架运行时的代码量』。举例来说，当前的框架无论是 React Angular 还是 Vue，不管你怎么编译，使用的时候必然需要『引入』框架本身，也就是所谓的`运行时 (runtime)`。但是用 `Svelte` 就不一样，一个 `Svelte` 组件编译了以后，所有需要的运行时代码都包含在里面了，除了引入这个组件本身，你不需要再额外引入一个所谓的框架运行时！

- 4、无虚拟 DOM、无运行时
- 5、基于 `Svelte` 开发的组件，可以直接给使用 `Vue、React、Angular、Svelte ` 技术栈的团队用， 而不需要额外引入 `Svelte ` 去承载解析翻译的工作。
- 6、上手简单，`Svelte` 把框架代码编写风格设计跟 `Vue` 很像。编写一个 `Svelte` 组件的体验，跟开发`原生 Web` 基本相同

<img src='@assets/svelte/priority.png' alt="center"  height="150" />


`Svelte`放弃了流行的`虚拟DOM`方案，虽然`虚拟DOM`足够的快，但是`虚拟DOM`最致命的问题是不管状态是否发生变化，都会被重新计算并且更新，`Svelte` 将需要在运行时做的事情，提前到编译阶段完成，所以它几乎没有运行时。提前分析依赖，运行阶段无需处理依赖收集、`虚拟 DOM `比较等额外计算，减少了运行时的负担。`Svelte` 的编译风格是将模板编译为`命令式 (imperative) `的`原生 DOM` 操作。比如这段代码：

```js
<script>
	let name = 'world123';
</script>

<h1>Hello {name}!</h1>
```

会被编译为:
```js
    let name = 'world123';
    function create_fragment(ctx) {
    	let h1;

    	return {
    		c() {
    			h1 = element("h1");
    			h1.textContent = `Hello ${name}!`;
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    		}
    	};
    }

```

可以看到，跟基于 Virtual DOM 的框架相比，这样的输出不需要 Virtual DOM 的 diff/patch 操作，自然可以省去大量代码。

对于特定功能，`Svelte` 依然有对应的运行时代码，比如组件逻辑，`if/else` 切换逻辑，循环逻辑等等... 但它在编译时，如果一个功能没用到，对应的代码就根本不会被编译到结果里去。这就好像用 `Babel` 的时候没有用到的功能的 `helper` 是不会被引入的，又好像用 `lodash` 或者 `RxJS` 的时候只选择性地引入对应的函数。


### svelte缺点

- 1、生态不够成熟，`Svelte` 生态数量仅有 `Vue 生态的 7.7%，React 的 1.5%`
- 2、多个组件中会有很多重复的代码，虽然在简单的 `demo` 里面代码量确实非常小，但同样的组件模板，这样的 命令式 操作生成的代码量会比 `vdom 渲染函数`要大，多个组件中会有很多重复的代码`（虽然 gzip 时候可以缓解，但 parse 是免不了的）`。项目里的组件越多，代码量的差异就会逐渐缩小。同时，并不是真正的如宣传的那样 没有 runtime““，而是根据你的代码按需 `import` 而已。使用的功能越多，`Svelte` 要包含的运行时代码也越多，最终在实际生产项目中能有多少尺寸优势，其实很难说
- 3、`Svelte` 在大型应用中的性能还有待观察，尤其是在大量动态内容和嵌套组件的情况下
- 4、`Svelte `的编译策略决定了它跟 `Virtual DOM` 绝缘（渲染函数由于其动态性，无法像模板那样可以被可靠地静态分析），也就享受不到` Virtual DOM `带来的诸多好处，比如基于 `render function` 的组件的强大抽象能力，基于 `vdom` 做测试，服务端/原生渲染亲和性等等。


<img src='@assets/svelte/use.png' alt="center"  height="150" />

### svelte核心原理

`Svelte` 没有使用 `API` 来创建响应式，那么它是怎么追踪变量的变化呢？

```js
<script>
	let name = 'world123';
    function handleClick(){
        name = '你好'
    }
</script>

<h1>Hello {name}!</h1>
<button on:click={handleClick}>点击改变</button>
```

会被编译为:
```js
  function create_fragment(ctx) {
    	let h1;
    	let t0;
    	let t1;
    	let t2;
    	let t3;
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			h1 = element("h1");
    			t0 = text("Hello ");
                //变量的值会从ctx中去获取
    			t1 = text(/*name*/ ctx[0]);
                //会将静态节点和变量之间分开
    			t2 = text("!");
    			t3 = space();
    			button = element("button");
    			button.textContent = "点击改变";
    		},
    		m(target, anchor) {
    			insert(target, h1, anchor);
    			append(h1, t0);
    			append(h1, t1);
    			append(h1, t2);
    			insert(target, t3, anchor);
    			insert(target, button, anchor);

    			if (!mounted) {
                    //给button绑定点击事件
    				dispose = listen(button, "click", /*handleClick*/ ctx[1]);
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
                //通过 dirty 按位与 1 的结果判断是否要更新
    			if (dirty & /*name*/ 1) set_data(t1, /*name*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(h1);
    			if (detaching) detach(t3);
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }
```
`Svelte`在编译时，会检测所有变量的赋值行为，并将变化后的值和赋值的行为，作为创建片段的参数。

当变量更新时：
```js
    function make_dirty(component, i) {
        //如果组件的 dirty[0] 为 -1
        if (component.$$.dirty[0] === -1) {
            //需要往脏组件数组中添加，然后更新
            dirty_components.push(component);
            //更新
            schedule_update();
            //更新完了，清空脏组件数组
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }

    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            //调用flush方法
            resolved_promise.then(flush);
        }
    }
    //更新
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
                while (flushidx < dirty_components.length) {
                    const component = dirty_components[flushidx];
                    flushidx++;
                    set_current_component(component);
                    update(component.$$);
                }
                ...
        }
    }

```



`component.$$.dirty`  是什么?

在一个文件中，我们设置一些变量修改，在打印一下` component.$$.dirty`

<img src='@assets/svelte/change.png' alt="center"  height="150" />

转化成二进制就是:

<img src='@assets/svelte/transform.png' alt="center"  />

上面数组中的每一项中的每一个比特位，如果是**1**，则代表着该数据是否是脏数据。如果是脏数据，则意味着更新。


 - 第一行 ["0000000000000000000000000000001", "0000000000000000000000000000000"], 表示第一个数据脏了，需要更新第一个数据对应的dom节点


- 第二行 ["0000000000000000000000000000011", "0000000000000000000000000000000"], 表示第一个、第二个数据都脏了，需要更新第一个，第二个数据对应的dom节点。


### 如何跨框架使用

1、如果你查阅 `Svelte` 官网，官方建议我们使用 `SvelteKit` 创建项目

<img src='@assets/svelte/start.png' alt="center"  />

`SvelteKit` 为` Svelte` 提供了开发完整 `APP` 的能力，例如`router、SSR`等特性。但事实上我们如果开发组件库，是用不上 `SvelteKit` 提供的额外功能的。
因此我们使用 `Vite` 提供的脚手架来创建 `Svelte` 项目

<img src='@assets/svelte/create.png' alt="center"  />

2、`Vite Config` 中引入 `Svelte` 插件

<img src='@assets/svelte/vite.png' alt="center" height='150'  />

`svelte-preprocess` 为 `Svelte` 扩展了诸多预处理特性，例如在 `style 中使用 less、sass，global css`等


3、组件打包配置

1. build 配置中设置为库打包的模式

<img src='@assets/svelte/build1.png' alt="center" height='150'  />

2. 使用 tsup 打包出类型定义dts

<img src='@assets/svelte/build2.png' alt="center" height='150'  />

3. 在 package.json 编写打包脚本让 vite和 tsup 同时构建

<img src='@assets/svelte/build3.png' alt="center" height='150'  />


4、如何编译为 `Web Components`

将 `Svelte` 编写的组件编译成 `Web Components` 组件非常简单，只需要 :

- 在 `svelte` 插件编译配置中开启 `Custom Element`
- 在组件上声明`svelte:options`，并配置组件名称即可

<img src='@assets/svelte/webcom1.png' alt="center" height='150'  />


<img src='@assets/svelte/webcom2.png' alt="center" height='150'  />

5、 跨框架组件使用方式

<img src='@assets/svelte/use-com1.png' alt="center" height='150'  />


<img src='@assets/svelte/use-com2.png' alt="center" height='150'  />

6、处理组件传入的 `Props`

- 1. 通过 svelte/store 全局存储业务系统传入的用户信息和平台信息 
- 2. 通过 ConfigProvider 中调用setContext 共享全局配置

<img src='@assets/svelte/props1.png' alt="center"  />

<img src='@assets/svelte/props2.png' alt="center" />

7、如何接收组件事件
<img src='@assets/svelte/event1.png' alt="center"  />

`Svelte` 打包的组件无法直接在 `DOM` 上监听事件，可以调用导入组件实例上的 `$on` 方法监听。
因但因业务需要，我们系统内是将外部事件抛到全局中的

<img src='@assets/svelte/event2.png' alt="center"  />

8、遇到的问题
 
1. 如何使用原子化 CSS 库
因为 Scoped 的存在使用 UnoCSS 需要按需使用不同的插件，TailwindCSS 可以使用 PostCSS 后置处理

2. 使用原子化 CSS 导致的样式污染
使用 PostCSS 插件编译时加前缀的方式解决，但这种方式也导致原子化 CSS类的权重变高，会出现一些问题需要手动处理。

3. 使用原子化 CSS 导致编译为 Web Components 后样式失效
因为 Web Components 无样式侵入的特点，可以使用 UnoCSS 的 Web Components 模式，或者不用原子化CSS库，只用 scoped style。

4. 打包出的类型枚举在业务系统中导入后 undefined
需要在vite打包入口中显式导出TS枚举变量，vite会处理为JS对象

<img src='@assets/svelte/when.png' alt="center"  />

### 建议

**1. 充分利用编译时性能优势**
构建轻量级组件库时，发挥 `Svelte` 的编译时性能优势，创造高性能、轻便的组件。

**2. 状态管理和数据流**
使用`Svelte` 内置的状态管理系统，简化全局状态管理，提高代码可读性和可维护性。

**3. 样式处理**
充分利用 `Svelte`  的内置 `Scoped` 样式功能，避免样式污染问题，提高组件的可重用性和可维护性。

**4. 轻松编译成 Web Components**
利用 `Svelte`  内置的 `Custom Elements` 功能，轻松将组件编译成 `Web Components`，提高组件的可移植性，便于在不同项目中重用。







