React18 Alpha 版本 于 2022 年 3 月份已经发布了，在 18 中又集成了一些新的特性，如自动批处理、startTransition 等新 API，以及支持 Suspense 的流式服务器端渲染。

下面，让我一起来看看 [React18 的新特性](https://zh-hans.reactjs.org/blog/2022/03/29/react-v18.html)已经和 React17 的主要区别是啥

## 批量更新

- automatic batching
- 在 React18 中多次的 setState 会合并到一次进行渲染
- 在 React18 中更新是以优先级为依据进行合并的

React17 中的批量更新的表现

```js
import React from "react";
class OldBatchUpdatePage extends React.Component {
  state = {
    number: 0,
  };
  handleClick = () => {
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); //0
    this.setState({ number: this.state.number + 1 });
    console.log(this.state.number); //0
    setTimeout(() => {
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number); //2
      this.setState({ number: this.state.number + 1 });
      console.log(this.state.number); //3
    });
  };
  render() {
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    );
  }
}

export default OldBatchUpdatePage;
```

<strong>最后打印的结果是 0 0 2 3 </strong>，在第一个和第二个打印中，由于`console`语句还处在合成事件之中，在合成事件中，`setState` 的表现形式是异步的，而且 React 在更新的过程中，如果是批量更新的一个操作会被合并，所以前两个`setState`只会执行一次，所以此时`state`只会加 1，但是 `console` 中不能马上获取到更新的值，所以都打印出 0 ,但是在`setTimeout`中`setState`表现为同步，并且不会走`React`的批量更新那一套机制，所以分别打印出 2 和 3

`React18`中的批量更新的表现

在 `React18` 中，也是同样的上面的代码，<strong>最后的结果是 0 0 1 1 </strong>，因为在 `React18` 中，react 的事件更新是有一个优先级的，相同的优先级批量更新的时候会被合并，所以上面的情况下：

合成事件中的 `setState` 进行批量更新的时候，他们的优先级是一样的，所以会进行一个合并，并且表现为异步，所以打印出 0，在 `setTimeout` 中的 `setState` 优先级也是一样的，所以也会进行一个合并，并且也会表现为异步，所以会打印出 1

这就是 `React17` 和 `React18` 事件更新这一块的区别

## Suspense

- 让你的组件在渲染之前进行等待，并且在等待的时候现实 `fallback`的内容
- `Suspense` 内的组件子树比组建树其他的部分拥有更低的优先级

执行流程

- 在 `render`函数中我们可以使用异步请求数据
- `react`会从我们的缓存中读取这个缓存
- 如果没有缓存，那么会抛出一个 `promise` 异常
- 当这个`promise` 执行完成的时候（比如请求数据完成），react 会继续回到原来的 render 中去，把数据 render 出来

React17 之前：

`Suspense` 使得组件可以“等待”某些操作结束后，再进行渲染。目前，`Suspense` 仅支持的使用场景是：通过 React.lazy 动态加载组件，他还并不支持数据获取等场景

React18:

`Suspense` 已经可以支持数据获取等场景

For example：

```js
import React, { Suspense } from "react";
import { wrapPromise } from "./../../utils/common";
function SuspensePage() {
  return (
    <>
      <Suspense fallback={<div>loading...</div>}>
        <User />
      </Suspense>
    </>
  );
}

const getUser = () => {
  return new Promise((res) => {
    setTimeout(() => {
      const user = {
        name: "章三",
        id: 5000,
      };
      res(user);
    }, 2000);
  });
};
const userPromise = wrapPromise(getUser());
function User() {
  //因为不能直接使用await，所以使用了一个wrapPromise方法，当pending的时候，抛出一个promise
  let data = userPromise.read();
  return (
    <div>
      <p>id:{data.id}</p>
      <p>name:{data.name}</p>
    </div>
  );
}
```

这个例子会模拟一个接口请求，在两秒之后会返回一些数据，在此之前页面上会一直显示 loading...，也就是`Suspense` 的 `fallback`中的内容

以前你异步获取数据渲染的时候，需要定一个`useState`和`useEffect`，但是现在你可以借助`Suspense`来实现这两个步骤

### Suspense 原理

- 第一次渲染会去渲染它的 children
- 在渲染 children 的时候，children 会抛出一个 promise
- 这个 promise 会传递给 Suspense 组件的 componentDidCatch 函数
- 然后可以去做相应的 loading 处理

```js
import React from "react";

class Suspense extends React.Component {
  state = {
    loading: false,
  };

  //组件捕获到异常
  componentDidCatch(error) {
    //如果捕获到的是一个promise的情况
    if (typeof error.then === "function") {
      //先把loading设置为true
      this.setState({ loading: true });
      //等promise执行完成
      error.then(() => {
        this.setState({ loading: false });
      });
    }
  }
  render() {
    const { fallback, children } = this.props;
    const { loading } = this.state;
    return loading ? fallback : children;
  }
}
```

## startTransition

- 主要是为了能在大量的任务下也能保持 ui 的一个响应
- 可以通过将特定的更新标记为 `过渡` 来改善用户的交互
- 其实就是降低 startTransition 包裹的任务的一个优先级，优先去渲染当前的页面 ui，然后再去执行里面包裹的更新方法

场景：

当用户在输入框中快速的输入大量的信息，而且页面上需要根据这些信息去批量渲染的时候，可以使用这个方法以至于不阻塞 ui 渲染

```js
//降低更新优先级，保证ui正常渲染
startTransition(() => {
  setWorks(value);
});
```

## useDeferredValue

- 如果说某些渲染比较消耗性能，比如存在实时的计算和反馈，我们可以使用`useDeferredValue` 降低其计算的优先级，可以避免整个应用卡顿

```js
function Page(){
    ....
    const deferredText = useDeferredValue(keyword)

    return (<div>{deferredText}</div>)
}

```

## useTranstion

- 允许组件在切换到下一个界面之前等待内容加载，从而避免不必要的加载状态
- useTranstion 返回两个值的数组
  - isPending 是一个布尔值，这是 react 通知我们是否正在等待过渡的完成方式
  - startTransition 是一个接受回调的函数，我们用它来告诉 React 需要推迟的 state

```js
function Page(){
    ...
    const [isPending,startTransition] = useTranstion()
    const hanleClick = ()=> {
        startTransition(()=>{
            setState(number+1)
        })
    }
    return <div> {isPending ? 'loading...' ,number} </div>
}
```

## useSyncExternalStore

[useSyncExternalStore](https://zh-hans.reactjs.org/docs/hooks-reference.html#usesyncexternalstore) 是一个推荐用于读取和订阅外部数据源的 hook，其方式与选择性的 hydration 和时间切片等并发渲染功能兼容

```js
const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
```

此方法返回存储的值并接受三个参数：

- subscribe：用于注册一个回调函数，当存储值发生更改时被调用。
- getSnapshot： 返回当前存储值的函数。
- getServerSnapshot：返回服务端渲染期间使用的存储值的函数

在 `react-redux`最新版本中，使用了`useSyncExternalStore`来实现仓库和组件的关联
例子：

```js
const store = new Store();//外部的store
function Page(){
    ...
    const state = useSyncExternalStore(store.subscribe,store.getValue);

    const add = ()=> {
        store.setValue(state + 1)
    }

    return <div>{state}</div>
}
```

## useInsertionEffect

- useInsertionEffect 中会发生 dom 变更，它可以优化计算样式的时间

该签名与 `useEffect` 相同，但它在所有 DOM 突变 之前 同步触发。使用它在读取 `useLayoutEffect` 中的布局之前将样式注入 DOM。由于这个 hook 的作用域有限，所以这个 hook 不能访问 refs，也不能安排更新

注意：

useInsertionEffect 应仅限于 css-in-js 库作者使用。优先考虑使用 useEffect 或 useLayoutEffect 来替代。

几个 effect 的执行顺序：

useInsertionEffect --> useLayoutEffect --> useEffect

## 并发更新

`React18`开启了并发更新，即 `concurrent mode`
