## 什么是 Flutter

Flutter 是由 Google 开发和提供支持的开源框架。前端和全栈开发人员使用 Flutter 为具备单一代码库的多个平台构建应用程序的用户界面（UI）。在 2018 年推出时，Flutter 主要支持移动应用程序开发。Flutter 目前支持在六个平台上进行应用程序开发：iOS、Android、Web、Windows、MacOS 和 Linux。

### Flutter 如何帮助应用程序开发？

Flutter 简化了为它支持的六个平台上的应用程序创建一致、具有吸引力的 UI 的过程。因为 Flutter 是一个跨平台的开发框架，所以我们先把它和原生开发做个对比。然后，我们可以突出显示 Flutter 独有的功能。

### 原生应用程序开发与跨平台应用程序开发的比较

一个特定平台（例如 iOS）编写应用程序称为原生应用程序开发。反之，跨平台应用程序开发则是使用单个代码库为多个平台构建应用程序。

#### 原生应用程序开发

由于开发人员在原生应用程序开发中为特定平台编写代码，因此他们可以完全访问本机设备功能。与跨平台应用程序开发相比，这通常会带来更高的性能和速度。另一方面，如果您想在多个平台上启动应用程序，原生应用程序开发需要更多的代码和更多的开发人员。除了这些费用之外，原生应用程序开发还可能使在不同平台上同时启动并获得一致的用户体验变得更加困难。这时就需要像 Flutter 这样的跨平台应用程序开发框架。

#### 跨平台应用程序开发

跨平台应用程序开发允许开发人员使用一种编程语言和一个代码库来构建适用于多个平台的应用程序。如果您要为多个平台发布应用程序，那么相较于原生应用程序开发，跨平台应用程序开发的成本更低、耗时更少。此流程还允许开发人员为跨平台的用户创建更一致的体验。与原生应用程序开发相比，这种方法可能存在一些缺点，包括对原生设备功能的访问受限。但是，Flutter 具有使跨平台应用程序开发更加顺畅和高性能的特性。

## Flutter 的优势

- 接近原生的性能。Flutter 使用编程语言 Dart 并编译成机器码。主机设备能理解此代码，从而确保快速有效的性能。
- 快速、一致且可自定义的渲染。Flutter 不依赖于特定平台的渲染工具，而是使用 Google 的开源 Skia 图形库来渲染 UI。这为用户提供了一致的视觉效果，无论他们使用什么平台来访问应用程序。
- 开发人员友好的工具。 Google 在构建 Flutter 时强调易用性。通过热重载等工具，开发人员可以在不丢失状态的情况下预览代码更改的外观。小部件检查器等其他工具可以轻松可视化和解决 UI 布局问题。

## 开发实践

作为新手小白，第一次接触到`flutter`的开发，难免有一些手足无措，不知道如何下手，接下来，我会列举我们在`flutter`中搭建了一个新项目的具体步骤，以及一些注意事项，帮助后续首次接触`flutter`开发的伙伴们可以快速上手和开发

## 安装

具体的[安装教程](https://flutter.cn/docs/get-started/install)可以看这儿，这儿针对不同的设备都有详细的安装教程。

## 目录结构

安装好了之后，我们可以在`vscode`中创建一个新的项目，
因为在我们的日常开发中，我们所有的`Dart`代码都在`lib`文件夹下，所以可以根据自己的技术经验在`lib`创建如下的目录结构

```shell
github_client_app
├── android
├── ios
├── lib
     ├── assets
     ├── event
     ├── http
     ├── l10n
     ├── model
     ├── pages
     ├── router
     ├── store
     ├── utils
     ├── widgets
     └── main.dart
└── test
```

| 文件夹    | 作用                                                         |
| --------- | ------------------------------------------------------------ |
| utils     | 一些工具类，如通用方法类、网络接口类、保存全局变量的静态类等 |
| l10n      | 国际化相关的类都在此目录下                                   |
| models    | Json 文件对应的 Dart Model 类会在此目录下                    |
| store     | 保存 APP 中需要跨组件共享的状态类                            |
| route     | 存放所有路由页面类                                           |
| assets    | 保存项目中需要用到的一些静态资源                             |
| http      | 请求封装的地方                                               |
| event     | 保存项目中需要用到的一些 event bus 监听器                    |
| widgets   | APP 内封装的一些 Widget 组件都在该目录下                     |
| pages     | APP 内页面级的一些文件                                       |
| main.dart | 项目的入口文件                                               |

## 一些基本的 dart 语法

Dart 在静态语法方面和 Java 非常相似，如类型定义、函数声明、泛型等，而在动态特性方面又和 JavaScript 很像，如函数式特性、异步支持等。除了融合 Java 和 JavaScript 语言之所长之外，Dart 也具有一些其他很有表现力的语法，如可选命名参数、..（级联运算符）和?.（条件成员访问运算符）以及??（判空赋值运算符）。

### var 变量申明

```dart
var t = "hi world";
// 下面代码在dart中会报错，因为变量t的类型已经确定为String，
// 类型一旦确定后则不能再更改其类型。
t = 1000;
```

上面的代码在 JavaScript 是没有问题的，前端开发者需要注意一下，之所以有此差异是因为 Dart 本身是一个强类型语言，任何变量都是有确定类型的，在 Dart 中，当用 var 声明一个变量后，Dart 在编译时会根据第一次赋值数据的类型来推断其类型，编译结束后其类型就已经被确定，而 JavaScript 是纯粹的弱类型脚本语言，var 只是变量的声明方式而已。

### dynamic 和 Object

`Object` 是 `Dart` 所有对象的根基类，也就是说在 `Dart` 中所有类型都是 Object 的子类(`包括Function和Null`)，所以任何类型的数据都可以赋值给`Object`声明的对象。 `dynamic`与`Object`声明的变量都可以赋值任意对象，且后期可以改变赋值的类型，这和 `var` 是不同的，如：

```dart
dynamic t;
Object x;
t = "hi world";
x = 'Hello Object';
//下面代码没有问题
t = 1000;
x = 1000;
```

`dynamic`与`Object`不同的是`dynamic`声明的对象编译器会提供所有可能的组合，而`Object`声明的对象只能使用 `Object` 的属性与方法, 否则编译器会报错，如:

```dart
 dynamic a;
 Object b = "";
 main() {
   a = "";
   printLengths();
 }

 printLengths() {
   // 正常
print(a.length);
   // 报错 The getter 'length' is not defined for the class 'Object'
   print(b.length);
 }
```

### final 和 const

如果您从未打算更改一个变量，那么使用 `final` 或 `const`，不是`var`，也不是一个类型。 一个 `final` 变量只能被设置一次，两者区别在于：`const` 变量是一个编译时常量（编译时直接替换为常量值，必须初始化），`final` 变量在第一次使用时被初始化。被`final`或者`const`修饰的变量，变量类型可以省略，如：

```dart
//可以省略String这个类型声明
final str = "hi world";
//final String str = "hi world";
const str1 = "hi world";
//const String str1 = "hi world";
```

### 空安全（null-safety）

类比于 `javascript`的 [可选链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Optional_chaining)

```dart
person?.name
```

### 函数

`Dart`是一种真正的面向对象的语言，所以即使是函数也是对象，并且有一个类型 `Function`。这意味着函数可以赋值给变量或作为参数传递给其他函数，这是函数式编程的典型特征。

```dart
//基本申明 最前面的类型用来约束返回值，不指定返回类型，默认为dynamic
bool isNoble(int atomicNumber) {
  return _nobleGases[atomicNumber] != null;
}

//包装一组函数参数，用[]标记为可选的位置参数，并放在参数列表的最后面：
String say(String from, String msg, [String? device]) {
  var result = '$from says $msg';
  if (device != null) {
    result = '$result with a $device';
  }
  return result;
}
```

### mixin

`Dart` 是不支持多继承的，但是它支持 mixin，简单来讲 `mixin` 可以 “组合” 多个类

```dart
class Person {
  say() {
    print('say');
  }
}

mixin Eat {
  eat() {
    print('eat');
  }
}

mixin Walk {
  walk() {
    print('walk');
  }
}

mixin Code {
  code() {
    print('key');
  }
}


class Dog with Eat, Walk{}
class Man extends Person with Eat, Walk, Code{}
```

### Future、async await

`Future`与`JavaScript`中的`Promise`非常相似，表示一个异步操作的最终完成（或失败）及其结果值的表示。简单来说，它就是用于处理异步操作的，异步处理成功了就执行成功的操作，异步处理失败了就捕获错误或者停止后续操作。一个`Future`只会对应一个结果，要么成功，要么失败。`Future `的所有`API`的返回值仍然是一个`Future`对象，所以可以很方便的进行链式调用。

`async`和`await`关键词支持了异步编程，允许您写出和同步代码很像的异步代码。

```dart
Future.delayed(Duration(seconds: 2), () {
	//return "hi world!";
	throw AssertionError("Error");
}).then((data) {
	print("success");
}, onError: (e) {
	print(e);
}).catchError((e){
   //如果没有定义onError方法，那么执行失败会走到这里
   print(e);
}).whenComplete((){
   //无论成功或失败都会走到这里
    print('无论成功或失败都会走到这里');
});

//等待多个异步任务都执行结束后才进行一些操作
Future.wait([
  // 2秒后返回结果
  Future.delayed(Duration(seconds: 2), () {
    return "hello";
  }),
  // 4秒后返回结果
  Future.delayed(Duration(seconds: 4), () {
    return " world";
  })
]).then((results){
  print(results[0]+results[1]);
}).catchError((e){
  print(e);
});
```

使用 `async/await` 消除 `callback hell(回调地狱)`

```dart
task() async {
   try{
    String id = await login("alice","******");
    String userInfo = await getUserInfo(id);
    await saveUserInfo(userInfo);
    //执行接下来的操作
   } catch(e){
    //错误处理
    print(e);
   }
}
```

## 基本布局

### 基本的 flutter 组件

```dart
import 'package:flutter/material.dart';

//继承无状态组件
class Person extends StatelessWidget {
  //定义自己的props，可以类比 react, key是组件或者元素的唯一标识
  Person({Key? key, this.name = ''}) : super(key: key);
  String name = '';
  //方法
  _navigateToApproval(context) {}

  //组件的渲染函数，类似于react 的render函数
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
        //用户手势检测组件
        behavior: HitTestBehavior.translucent, // 点击空白区域也响应手势
        onTap: () {
          _navigateToApproval(context);
        },
        child: Container(
          width: double.infinity, //类似于css中设置宽度为 100%
          margin: EdgeInsets.fromLTRB(0, 8, 0, 0), //设置margin
          padding: EdgeInsets.fromLTRB(0, 16, 16, 13), //设置padding
          //设置边框和圆角和背景颜色
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border.all(color: Colors.blue, width: 2),
            borderRadius: BorderRadius.all(Radius.circular(10)),
          ),
          //定义纵向排列的元素
          child: Column(
            verticalDirection: VerticalDirection.down,
            children: <Widget>[
              Text(
                '姓名:${name}', //类似 js中的模板字符串
                style: const TextStyle(
                  fontWeight: FontWeight.w600,
                  fontSize: 16,
                ),
              )
            ],
          ),
        ));
  }
}

```

### 线性布局组件 Column 和 Row

`Flutter` 中通过 `Row` 和 `Column` 来实现线性布局，Row 和 Column 都继承自 Flex。

`Row` 可以沿水平方向排列其子 `widget`。定义如下：

```dart
Row({
  ...
  TextDirection textDirection, //表示水平方向子组件的布局顺序(是从左往右还是从右往左)
  MainAxisSize mainAxisSize = MainAxisSize.max, //表示Row在主轴(水平)方向占用的空间，MainAxisSize.max 表示沾满一行或者充满容器
  MainAxisAlignment mainAxisAlignment = MainAxisAlignment.start, // 主轴上面的对齐方式 和 css中 justify-content 类似
  VerticalDirection verticalDirection = VerticalDirection.down,  // 表示Row纵轴（垂直）的对齐方向，默认是VerticalDirection.down，表示从上到下。
  CrossAxisAlignment crossAxisAlignment = CrossAxisAlignment.center,//纵轴的对齐方式 ，类似于 css中的 align-items
  List<Widget> children = const <Widget>[], //需要一行展示的子元素
})
```

案例：

```dart
Container(
     child: Row(
          mainAxisAlignment: MainAxisAlignment.center,//主轴居中
          crossAxisAlignment: CrossAxisAlignment.center,//交叉轴居中
          children: <Widget>[
          Text('姓名:'),Text('张三')
          ],
     ),
)
```

<img src='@assets/flutter/center.jpg' alt="center"  height="150" />

`Column`组件同理

### 弹性布局 Flex

`Flex` 组件可以沿着水平或垂直方向排列子组件，如果你知道主轴方向，使用 `Row` 或 `Column` 会方便一些，因为 `Row` 和 `Column` 都继承自 `Flex` ，参数基本相同，所以能使用 `Flex` 的地方基本上都可以使用 `Row` 或 `Column` 。 `Flex` 本身功能是很强大的，它也可以和 `Expanded` 组件配合实现弹性布局

```dart
Container(
      child: Column(children: <Widget>[
        Flex(
          direction: Axis.horizontal,
          children: <Widget>[
            Expanded(
              flex: 1,
              child: Container(
                height: 30.0,
                color: Colors.red,
                ),
              ),
            Expanded(
              flex: 2,
              child: Container(
                height: 30.0,
                color: Colors.green,
                ),
              ),
            ],
          ),
      ]))
```

<img src='@assets/flutter/flex.jpg' alt="flex"  height="150" />

### 流式布局 Wrap

在 `flutter`中 `Row` 默认只有一行，如果超出屏幕不会折行，所以需要使用流式布局来解决这个问题 ，类似于 `CSS 中的 flex-wrap`

```dart
Wrap({
  ...
  this.direction = Axis.horizontal,
  this.alignment = WrapAlignment.start,
  this.spacing = 0.0,//主轴方向子widget的间距
  this.runAlignment = WrapAlignment.start, //纵轴方向的对齐方式
  this.runSpacing = 0.0, //纵轴方向的间距
  this.crossAxisAlignment = WrapCrossAlignment.start,
  this.textDirection,
  this.verticalDirection = VerticalDirection.down,
  List<Widget> children = const <Widget>[],
})
```

案例：

```dart
              Container(
                    child: Wrap(
                  spacing: 8.0, // 主轴(水平)方向间距
                  runSpacing: 4.0, // 纵轴（垂直）方向间距
                  alignment: WrapAlignment.start, //沿主轴方向居中
                  children: <Widget>[
                    Chip(
                      avatar: CircleAvatar(
                          backgroundColor: Colors.blue, child: Text('A')),
                      label: Text('Hamilton'),
                    ),
                    Chip(
                      avatar: CircleAvatar(
                          backgroundColor: Colors.blue, child: Text('M')),
                      label: Text('Lafayette'),
                    ),
                    Chip(
                      avatar: CircleAvatar(
                          backgroundColor: Colors.blue, child: Text('H')),
                      label: Text('Mulligan'),
                    ),
                    Chip(
                      avatar: CircleAvatar(
                          backgroundColor: Colors.blue, child: Text('J')),
                      label: Text('Laurens'),
                    ),
                  ],
                ))
```

<img src='@assets/flutter/wrap.jpg' alt="wrap"  height="150" />

## 路由 Navigator

`Navigator` 是一个路由管理的组件，它提供了打开和退出路由页方法。 `Navigator` 通过一个栈来管理活动路由集合。通常当前屏幕显示的页面就是栈顶的路由。 `Navigator` 提供了一系列方法来管理路由栈

基本使用：

配置路由表

```dart
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Demo',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: Product(),//指定主页
      //配置路由表，其实也可以单独提出去，放在路由文件里面
      routes: {
        "user": (context) =>
            User(id: ModalRoute.of(context)!.settings.arguments as String),//第一个参数是构建上下文，第二个就是路由传参的参数
      },
    );
  }
```

跳转：

```dart
  _navigate(context) {
    Navigator.of(context).pushNamed('user', arguments: "1");//第一个参数是路由名字，第二个是参数
  }
```

配置路由拦截：

`MaterialApp` 有一个 `onGenerateRoute` 属性，它在打开命名路由时可能会被调用，之所以说可能，是因为当调用`Navigator.pushNamed(...)`打开命名路由时，如果指定的路由名在路由表中已注册，则会调用路由表中的 builder 函数来生成路由组件；如果路由表中没有注册，才会调用 `onGenerateRoute` 来生成路由

```dart
MaterialApp(
  ... //省略
  onGenerateRoute:(RouteSettings settings){
	  return MaterialPageRoute(builder: (context){
		   String routeName = settings.name;
       // 如果访问的路由页需要登录，但当前未登录，则直接返回登录页路由，
       // 引导用户登录；其他情况则正常打开路由。
     }
   );
  }
);
```

此处用的是 `flutter` 中路由管理组件`Navigator` ,但是在后续的项目开发中，大家可以自己基于 `Navigator` 封装一下，可以通过传入指定格式的路由表和拦截函数来实现路由

此处介绍一下 一个 `flutter` 中的路由库 `Fluro`

`Fluro` 的使用比官方提供的路由框架要复杂一些，但是却非常适合中大型项目。因为它具有层次分明、条理化、方便扩展和便于整体管理路由等优点。

在 pubspec.yaml 安装依赖

```dart
dependencies:
  fluro: ^2.0.4
```

基本使用：
可以在之前建立的 `router`文件夹下面建立这几个文件

<img src='@assets/flutter/router.png' alt="router"  height="150" />

- application.dart 将 `Router` 进行静态化，方便直接调用
- router_handlers 为了方便对路由进行统一的管理，新建一个路由映射文件，用来对每个路由进行管理
- routers.dart 路由总体配置文件

`application.dart`

```dart
...
//定义一些方法
class Application {
  static FluroRouter router = FluroRouter();

  //定义一个push方法，此处可以做一些路由拦截相关的功能
  static push(BuildContext context, String path) {
    print('登录了');
    Application.router.navigateTo(context, path); //b为配置路由
  }
}

```

`router_handlers.dart`

```dart
...
var productHandler =
    Handler(handlerFunc: (BuildContext? context, Map<String, dynamic> params) {
  return Product();
});

var userHandler =
    Handler(handlerFunc: (BuildContext? context, Map<String, dynamic> params) {
  var id = int.parse(params["id"].first);//拿到路由传递的参数
  return User(
    id: '$id',
  );
});

```

`router.dart`

```dart
...
// 路由配置，导入对应路由的处理函数
class Routers {
  static String root = "/";
  static String user = "/user";
  static String product = "/product";
  final router = FluroRouter();
  static void configureRoutes(FluroRouter router) {
    router.notFoundHandler = Handler(handlerFunc:
        (BuildContext? context, Map<String, List<String>> parameters) {
      print("handler not find");
    });

    router.define(user, handler: userHandler);
    router.define(product, handler: productHandler);
  }
}

```

在`main.dart`中注入路由

```dart
  @override
  Widget build(BuildContext context) {
    FluroRouter router = FluroRouter();
    Routers.configureRoutes(router);
    Application.router = router;
    return MaterialApp(
      ...
      onGenerateRoute: Application.router.generator,

    );
  }
}
```

跳转：

```dart
   _navigate(context) {
    Application.push(context, '/user?id=23');
  }
```

## 状态管理

在`flutter`中，我们可以使用继承`StatefulWidget `组件的方式来管理每一个组件自己的状态，也可以使用 `Provider` 和 `Bloc`来对全局的状态进行管理，下面针对这两种方式做一个简单的说明

`StatefulWidget`使用

```dart
class MyStatefulWidget extends StatefulWidget {
  @override
  State<StatefulWidget> createState() {
    // 将创建的State返回
    return MyState();
  }
}

class MyState extends State<MyStatefulWidget> {

  /// 定义 state [name] 为当前描述字符串
  String name = 'test';

   @override
  void initState() {
    print('init state');
    super.initState();
  }

  void changeName() {
    setState(() {
      print('set state');
      name = 'Flutter';
    });
  }

  @override
  Widget build(BuildContext context) {
    return <构建自己的Widget>;
  }
}

```

一个 `StatefulWidget` 类会对应一个 `State` 类，`State` 表示与其对应的 `StatefulWidget` 要维护的状态，`State` 中的保存的状态信息可以：

- 在 `widget` 构建时可以被同步读取。
- 在 `widget` 生命周期中可以被改变，当 `State` 被改变时，可以手动调用其 `setState()`方法通知 `Flutter framework` 状态发生改变，`Flutter framework `在收到消息后，会重新调用其 `build` 方法重新构建 `widget` 树，从而达到更新 `UI` 的目的。

`Provider`跨组件状态共享,类比于`react-redux` + `redux`

在 `Provider`中需要理解三个概念：

- ChangeNotifier

`ChangeNotifier` 是 `Flutter SDK `中的一个简单的类。它用于向监听器发送通知。换言之，如果被定义为` ChangeNotifier`，你可以订阅它的状态变化。（这和大家所熟悉的观察者模式相类似）

- ChangeNotifierProvider

`ChangeNotifierProvider widget` 可以向其子孙节点暴露一个 `ChangeNotifier` 实例。它属于 `provider package`,他可以向他下面包裹的所有子元素提供对应的状态数据，类似于 `react-redux` 中的`Provider`

- Consumer

一个消费者，用于消费`Provider`中的数据，他包裹的组件中可以监听`Provider`中的数据变化，只要数据一变，视图就会刷新

基本使用：

首先在`pubspec.yaml` 文件中引入依赖

```yaml
dependencies:
  flutter:
    sdk: flutter

  provider: ^6.0.0
```

然后可以在`store`文件夹中定义一些状态文件，例如

`global_provider_dart`

```dart
import 'package:flutter/material.dart';

class GLobalProvider extends ChangeNotifier {
  final Map<String, String> _user = {"name": "张三", "sex": "男"};

  Map<String, String> get user => _user;
  String? get userDesc => _user['desc'];

//给user对象设置一个描述
  void setUserDesc(String desc) {
    _user['desc'] = desc;
    //通知
    notifyListeners();
  }
}

```

然后就可以在组件中使用了

```dart
import 'package:flutter/material.dart';
import 'package:flutter_doc_test/router/application.dart';
import 'package:flutter_doc_test/store/global_provider.dart';
import 'package:provider/provider.dart';

//继承无状态组件
class Product extends StatelessWidget {
  Product({Key? key}) : super(key: key);

  //实例化provider
  GLobalProvider provider = GLobalProvider();

  void onPress() {
    //设置描述
    provider.setUserDesc('我是一个中国人');
  }

  //组件的渲染函数，类似于react 的render函数
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('商品'),
        ),
        body: ChangeNotifierProvider<GLobalProvider>(
          create: (context) => provider,
          child: Row(
            children: [
              ElevatedButton(
                onPressed: () {
                  //按钮点击事件
                  onPress();
                },
                child: Text('增加描述'),
              ),
              //消费状态
              Consumer<GLobalProvider>(builder: (context, provider, child) {
                return Visibility(
                    visible: provider.userDesc != '',
                    child: Text(provider.userDesc ?? ""));
              })
            ],
          ),
        ));
  }
}

```


## 请求 Http请求库-dio

`dio`是一个强大的`Dart Http`请求库，支持Restful API、FormData、拦截器、请求取消、Cookie管理、文件上传/下载、超时等，他是基于 Dart IO库中的 `HttpClient`封装而来

基本使用：

1、在`pubspec.yaml`引入依赖
```yaml
dependencies:
  dio: ^4.0.6
```

基本接口请求
```dart
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';

class RequestDemo extends StatefulWidget {
  RequestDemo({
    Key? key,
  }) : super(key: key);
  @override
  State<StatefulWidget> createState() {
    return _RequestDemoState();
  }
}

class _RequestDemoState extends State<RequestDemo> {
  Dio dio = Dio();//初始化声明
  @override
  void initState() {
    super.initState();
    _getData();
  }

  Future _getData() async {
    Response response;
    response = await dio.get("http://localhost:9000/api");
    print(response.data.toString()); //获取拿到数据
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('请求'),
        ),
        body: Text('data'));
  }
}

```

或者其实我们在使用的时候也可以像`javascript`使用`axios`一样，进行一个简单的封装，比如：
```dart
import 'package:dio/dio.dart';

var dio;
BaseOptions baseRequestOptions = BaseOptions(
    connectTimeout: 15000,
    receiveTimeout: 15000,
    sendTimeout: 10000,
    baseUrl: 'https://www.baidu.com');

class HttpUtil {
  // 工厂模式
  static HttpUtil get instance => _getInstance();

  static HttpUtil? _httpUtil;

  static HttpUtil _getInstance() {
    if (_httpUtil == null) {
      _httpUtil = HttpUtil();
    }
    return _httpUtil!;
  }

  HttpUtil() {
    dio = new Dio(baseRequestOptions);
    dio.interceptors.add(InterceptorsWrapper(onRequest:
        (RequestOptions options, RequestInterceptorHandler handler) async {
      return handler.next(options);
    }, onResponse: (response, ResponseInterceptorHandler handler) async {
      print("========================响应数据===================");
      handler.next(response);
    }, onError: (DioError error, ErrorInterceptorHandler handler) {
      print("========================请求错误===================");
      print("message =${error.message}");
      return handler.next(error); //continue
    }));
  }

  Future get(String url,
      {Map<String, dynamic>? parameters, Options? options}) async {
    Response response;
    if (parameters != null && options != null) {
      response =
          await dio.get(url, queryParameters: parameters, options: options);
    } else if (parameters != null && options == null) {
      response = await dio.get(url, queryParameters: parameters);
    } else if (parameters == null && options != null) {
      response = await dio.get(url, options: options);
    } else {
      response = await dio.get(url);
    }
    return response.data;
  }
}

```

然后可以给每个模块定义自己的请求类
```dart
import 'package:cloudPlatformApp/utils/constant/string.dart';
import 'package:cloudPlatformApp/utils/http_util.dart';

typedef OnFail(String message);

typedef OnSuccess<T>(T data);

class UserInfoService {

  Future getNoReadMessageTotal(OnSuccess<int> OnSuccess,
      {OnFail? onFail}) async {
    try {
      Map respond = await HttpUtil.instance.get(
        '/getUser',
      );
      if (respond['code'] == ResponseCode.SUCCESS) {
        OnSuccess(respond['data']);
      }
    } catch (e) {
      print(e);
      onFail!('获取失败');
    }
  }
}

```
最后就是在每个页面中调用
```dart

class _UserCenterPagePageState extends State<UserCenterPage> {
  int messageTotal = 0;
  UserInfoService userInfoService = UserInfoService();
  _getMessageTotal() {
    userInfoService.getNoReadMessageTotal((data) {
      setState(() {
        messageTotal = data;
      });
    });
  }
```

## 存储 shared_preferences
`shared_preferences`主要的作用是用于将数据异步持久化到磁盘，因为持久化数据只是存储到临时目录，当app删除时该存储的数据就是消失，web开发时清除浏览器存储的数据也将消失

依赖注入
```yaml
dependencies:
  flutter:
    sdk: flutter
  shared_preferences: ^2.0.6
```

使用：
```dart
final instance = await SharedPreferences.getInstance();

//保存
await instance.save(key: 'token', value: 'token');

//读取
await instance.get(key: 'token');

//移除
await instance.remove(key: 'token');


```

## webview

`flutter`层不支持`webview`，加载网页的功能还需要借助原生控件来处理。由于`webview`是一个非常复杂的控件，`flutter`再重新实现一遍成本非常高，而各个平台都有很完善的`webview`控件，故`flutter`团队提供了嵌入原生`webview`的解决方案，`flutter`通过一些插件去调用原生控件实现的`webview`


### webview_flutter 插件
依赖注入
```yaml
dependencies:
  flutter:
    sdk: flutter
   webview_flutter: ^3.0.4
```
基本使用：

可以直接定义一个page文件去使用，可以结合路由一起使用，只要传入`指定的title和跳转的url`就可以打开一个webview窗口，在`webview_flutter`中我们还可以和js进行通信，还可以设置`h5的cookie`等信息

```dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';
class WebViewPage extends StatefulWidget {
  String url;
  final String title;
  WebViewPage({Key? key, required this.url, required this.title})
      : super(key: key);
  @override
  _WebViewState createState() => _WebViewState();
}

class _WebViewState extends State<WebViewPage> {
  final Completer<WebViewController> _controller =
      Completer<WebViewController>();

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      body: Stack(
        children: <Widget>[
          WebView(
            initialUrl: widget.url,
            javascriptMode: JavascriptMode.unrestricted,//可以调用js
            allowsInlineMediaPlayback: true,//用h5的视频播放器在线播放
            onWebViewCreated: (WebViewController webViewController) {
              print('create');
            },
            onProgress: (int progress) {
              debugPrint('WebView is loading (progress : $progress%)');
            },
          )
        ],
      ),
    );
  }
}

```
<!-- webview_flutter的使用，下面几篇文档可以参考 -->
<!-- https://www.jianshu.com/p/5389df2dc49f-->
 <!-- https://juejin.cn/post/6994088899349856263#heading-4 -->
 <!-- https://cloud.tencent.com/developer/article/1765780 -->

<!-- ## webview cookie 设置 -->

<!-- ## 如何刷新 token -->

<!-- json 转 model -->
<!-- https://book.flutterchina.club/chapter11/json_model.html#_11-7-2-%E4%B8%80%E5%8F%A5%E5%91%BD%E4%BB%A4%E5%AE%9E%E7%8E%B0json%E8%BD%ACdart%E7%B1%BB -->

## 启动页和 app 图标配置

`Android`

图标：
<img src='@assets/flutter/icon-config.png' alt="center"  />

启动页：
<img src='@assets/flutter/lancher.png' alt="center"   />

`IOS`

图标：
<img src='@assets/flutter/icon-ios.png' alt="center"  />

启动页：
<img src='@assets/flutter/lancher-ios.png' alt="center"  />



## 打包

可以查看相关[文档](https://flutter.cn/docs/deployment/android) 