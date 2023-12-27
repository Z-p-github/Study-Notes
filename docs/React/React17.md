[React17](https://zh-hans.reactjs.org/blog/2020/08/10/react-v17-rc.html) 版本发布于 2020 年 8 月份，在这个版本中，它并没有添加一些新的特性，没有添加任何面向开发人员的新功能，而是主要侧重于升级简化 React 本身。

所以 `React17` 版本也被称为 `垫脚石 版本`。

那么究竟 `React17` 在简化 React 的基础上，做出了哪些改变呢？ 下面让我们一起来看看吧

## 事件委托的修改

我们知道 `React` 一直自动进行事件委托到`document`上面。当 `document` 上触发 DOM 事件时，`React` 会找出调用的组件，然后 `React` 事件会在组件中向上 “冒泡”，然后冒泡到 `document`上面去执行对应的事件处理函数。

在 `React 17` 中，React 将不再向 document 附加事件处理器。而会将事件处理器附加到渲染 ` React 树的根 DOM 容器中`

<img src='@assets/react_17_delegation.png'   alt="update" />

在 `React 16` 或更早版本中，React 会对大多数事件执行

```js
document.addEventListener();
```

`React 17 `将会在底层调用

```js
rootNode.addEventListener();
```

那么这两种代理机制出来委托事件的节点不一样之外还有什么区别呢，我们再接着看看

```js
import React from "react";
import type { RefObject } from "react";
class ProxyEvent extends React.Component {
  parentRef: RefObject<any>;
  childRef: RefObject<any>;
  constructor(props: {} | Readonly<{}>) {
    super(props);
    this.parentRef = React.createRef();
    this.childRef = React.createRef();
  }
  componentDidMount() {
    this.parentRef.current.addEventListener(
      "click",
      () => {
        console.log("父元素原生冒泡");
      },
      false
    );
    this.parentRef.current.addEventListener(
      "click",
      () => {
        console.log("父元素原生捕获");
      },
      true
    );
    this.childRef.current.addEventListener("click", () => {
      console.log("子元素原生冒泡");
    });
    this.childRef.current.addEventListener(
      "click",
      () => {
        console.log("子元素原生捕获");
      },
      true
    );
    document.addEventListener(
      "click",
      () => {
        console.log("document原生事件冒泡");
      },
      false
    );
    document.addEventListener(
      "click",
      () => {
        console.log("document原生事件捕获");
      },
      true
    );
  }
  parentBubble = () => {
    console.log("父元素React事件冒泡");
  };
  parentCapture = () => {
    console.log("父元素React事件捕获");
  };
  childBubble = () => {
    console.log("子元素React事件冒泡");
  };
  childCapture = () => {
    console.log("子元素React事件捕获");
  };
  render() {
    return (
      <div
        ref={this.parentRef}
        onClick={this.parentBubble}
        onClickCapture={this.parentCapture}
      >
        <button
          ref={this.childRef}
          onClick={this.childBubble}
          onClickCapture={this.childCapture}
        >
          onClick
        </button>
      </div>
    );
  }
}

export default ProxyEvent;
```

同样的上面的代码，那么在 `React17` 和 `React16` 中打印出来的信息有什么不一样呢

`React17` 的事件机制：

```js
// document原生事件捕获
// 父元素React事件捕获
// 子元素React事件捕获
// 父元素原生捕获
// 子元素原生捕获
// 子元素原生冒泡
// 父元素原生冒泡
// 子元素React事件冒泡
// 父元素React事件冒泡
// document原生事件冒泡
```

React16 的事件机制

```js
// document原生事件捕获
// 父元素原生捕获
// 子元素原生捕获
// 子元素原生冒泡
// 父元素原生冒泡
// 父元素React事件捕获
// 子元素React事件捕获
// 子元素React事件冒泡
// 父元素React事件冒泡
// document原生事件冒泡
```

根据上看的结果我们可以看得出， `React17` 更加遵循事件的 先捕获后冒泡的机制

## 冒泡阻止

在 `React 16 ` 或更早版本中，即使你在 `React` 事件处理器中调用 `e.stopPropagation()`，你创建的 DOM 监听仍会触发，这是因为原生事件已经处于 `document` 级别。使用 `React 17` 冒泡将被阻止（按需），因此你的 `document` 级别的事件监听不会触发：

```js
childCapture = (e) => {
  e.stopPropagation();
  console.log("子元素React事件捕获");
};
// React16 打印如下结果  组件的父子元素 react事件的冒泡
// document原生事件捕获
// 父元素原生捕获
// 子元素原生捕获
// 子元素原生冒泡
// 父元素原生冒泡
// 父元素React事件捕获
// 子元素React事件捕获
// document原生事件冒泡

// React17 打印：
// document原生事件捕获
// index.tsx:55 父元素React事件捕获
// index.tsx:62 子元素React事件捕获
```

```js
childBubble = (e: any) => {
  //e.persist()方法，会将当前的合成事件对象，从对象池中移除，就不会回收该对象了。对象可以被异步程序访问到。
  e.persist();
  e.nativeEvent.stopImmediatePropagation();
  console.log("子元素React事件冒泡");
};
//阻止了本级的继续冒泡 ，不会再去执行document的冒泡

//  document原生事件捕获
//  父元素原生捕获
//  子元素原生捕获
//  子元素原生冒泡
//  父元素原生冒泡
//  父元素React事件捕获
//  子元素React事件捕获
//  子元素React事件冒泡
//  父元素React事件冒泡
```

如果在 React16 中想要阻止本地的继续冒泡，可以使用 `event.nativeEvent.stopImmediatePropagation` 方法，该方法可以阻止合成事件不会冒泡到 `document` 上。

`e.stopPropagation` 只能阻止合成事件间冒泡，即下层的合成事件，不会冒泡到上层的合成事件。事件本身还都是在 document 上执行

## 一些事件系统修改

- onScroll 事件不再冒泡，以防止出现常见的混淆。
- React 的 onFocus 和 onBlur 事件已在底层切换为原生的 focusin 和 focusout 事件。它们更接近 React 现有行为，有时还会提供额外的信息。
- 捕获事件（例如，onClickCapture）现在使用的是实际浏览器中的捕获监听器。

这些更改会使 React 与浏览器行为更接近，并提高了互操作性。

## 去除事件池

`React 17 `中移除了 `event pooling（事件池）`。

这是因为 `React` 在旧浏览器中重用了不同事件的事件对象，以提高性能，并将所有事件字段在它们之前设置为 null。在`React 16`及更早版本中，使用者必须调用 `e.persist() ` 才能正确的使用该事件，或者正确读取需要的属性。

<strong>在 `React 17` 中，此代码可以按照预期效果执行。旧的事件池优化操作已被完成删除，因此，使用者可以在需要时读取事件字段。请注意，`e.persist() `在 `React` 事件对象中仍然可用，只是无效果罢了。</strong>

## 副作用清理

大多数副作用`（effect）`不需要延迟屏幕更新，因此 `React` 在屏幕上反映出更新后立即异步执行它们。（在极少数情况下，你需要一种副作用来阻止绘制，例如，如果需要获取尺寸和位置，请使用 `useLayoutEffect`。）

然而，当组件被卸载时，副作用清理函数（类似于在 `class` 组件中同步调用 `componentWillUnmount`）同步运行。我们发现，对于大型应用程序来说，这不是理想选择，因为同步会减缓屏幕的过渡（例如，切换标签）。

<strong>在` React 17` 中，副作用清理函数总会异步执行 —— 如果要卸载组件，则清理会在屏幕更新后运行。</strong>

这反映了副作用本身如何更紧密地运行。在极少数情况下，你可能希望依靠同步执行，可以改用 `useLayoutEffect`

## 返回一致的 undefined 错误

在 React 16 及更早版本中，返回 undefined 始终是一个错误：

```js
function Button() {
  return; // Error: Nothing was returned from render
}
```

以前，`React` 只对 `class` 和函数组件执行此操作，但并不会检查 `forwardRef` 和 `memo` 组件的返回值。这是由于编码错误导致。

<strong>
在` React 17 `中，`forwardRef` 和 `memo` 组件的行为会与常规函数组件和 `class` 组件保持一致。在返回 `undefined` 时会报错</strong>

```js
let Button = forwardRef(() => {
  // We forgot to write return, so this component returns undefined.
  // React 17 surfaces this as an error instead of ignoring it.
  <button />;
});

let Button = memo(() => {
  // We forgot to write return, so this component returns undefined.
  // React 17 surfaces this as an error instead of ignoring it.
  <button />;
});
```
