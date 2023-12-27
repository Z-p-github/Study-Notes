## vscode扩展工具

`vscode`是大家我们平时写代码比较常用的一个工具，它可以支持多种语言的开发，并且它可以安装很多的扩展程序来增强它的能力，其实`vscode`的扩展程序也可以自己开发维护，下面我们来看看如何实现

### 初始化
安装工具

```js
npm install -g yo generator-code
```

运行命令生成项目:

```js
yo code
```
执行完上面的命令之后，会出现一些选项供大家选择，大家可以根据自己的情况来选择

<img src='@assets/vscode/init.png' alt="center"  height="250" />

### 目录结构

```
project
└───.vscode
│       extensions.json  //用于指定项目依赖的 VSCode 扩展列表
│       launch.json  // 用于配置调试器的启动选项，包括调试配置和启动命令
│       settings.json // 用于配置项目的 VSCode 编辑器设置。
│       tasks.json //用于定义任务（Task），例如构建、运行或测试任务。
|
└─── node_modules   //npm 包
│
└───src
│    extension.ts //这是扩展的主要入口文件，其中包含实现扩展功能的代码
│   
└───.eslintrc.json //eslint 配置文件
└─── .npmrc  //于配置 npm 的相关选项
└─── .vscodeignore //类似于 .gitignore 文件，用于指定应忽略的文件或文件夹，这些文件或文件夹不会包含在 VSCode 项目中。
└─── CHANGELOG.md // 记录项目版本更改和更新的文件
└─── package.json //npm package
└─── README.md
└─── tsconfig.json //ts配置文件
└─── vsc-extension-quickstart.md
```
### 运行

我们可以看到在`src/extension.ts` 文件中注册了一个`hello world`命令

```ts

import * as vscode from 'vscode';


export function activate(context: vscode.ExtensionContext) {
    //注册命令
	let disposable = vscode.commands.registerCommand('css-tip.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from css-tip!');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}

```

项目生成后我们可以直接运行我们的扩展
- 直接通过点击顶部的 `run => Start Debugging`
- 通过快捷键 `F5`运行

我们可以在 调试的窗口中输入 `ctrl+shift+p` 来查找我们的`hello world`命令

执行`hello world`命令 会弹出一段提示

<img src='@assets/vscode/tip.png' alt="center"  height="250" />


### 实现一个css类的提示扩展

相信大家平时在`vscode`中编写代码时都看到过这种效果：
<img src='@assets/vscode/alert.png' alt="center"  height="250" />

这种效果就是我们在输入代码的时候，`vscode`会有一个快捷提示，选择之后可以自动的去代码补全，这能够提高我们的开发效率。下面我们来看具体实现。

### 配置 packages.json

首先需要先配置`package.json`文件，在`vscode`中叫做[Extension Manifest](https://code.visualstudio.com/api/get-started/extension-anatomy#extension-manifest)，这里面包含了一些`node`的配置字段，也包含了一些`vscode`扩展自己的字段。

我们需要添加:

说明：
在`VS Code`扩展的`package.json`文件中，`contributes`字段用于定义扩展的贡献和行为

```json
  "activationEvents": [
    "onLanguage" //onLanguage 是一个激活事件，它表示当编辑器切换到指定语言时，插件将会被激活
  ],
  "contributes": {  //此字段定义了默认的编辑器配置
    "configurationDefaults": {  
      "editor.quickSuggestions": { //  编辑器配置选项，用于控制是否启用快速建议功能
        "other": "on", // 表示针对除注释和字符串之外的其他内容启用快速建议
        "comments": "off",  // 表示针对注释禁用快速建议。
        "strings": "on"  // 表示针对字符串启用快速建议。
      },
      "[markdown]": { //这是一种语言标识符，表示以下配置适用于Markdown文件
	  //下面的配置同上
        "editor.quickSuggestions": {
          "other": "on",
          "comments": "off",
          "strings": "on"
        }
      }
    },
    "commands": [] //用于定义扩展提供的命令
  },
```
此处修改的其实修改的就是`vscode`设置页面的这些配置，但用户使用我们的扩展的时候，那么就会将这些配置打开。
<img src='@assets/vscode/config.png' alt="center"  height="250" />

### 调用vscode api

要实现上面的效果，我们需要用到如下几个`vscode` 的 api

- vscode.CompletionItem：CompletionItem 是一个类，用于表示代码完成项，即在代码编辑器中显示的建议项。它可以包含有关建议项的信息，例如建议的文本、标签、插入文本和详细说明等。
- vscode.CompletionList：CompletionList 是一个类，用于表示代码完成项的列表。它是一组 CompletionItem 对象的集合
- vscode.languages.registerCompletionItemProvider：registerCompletionItemProvider 是一个函数，用于注册代码完成项提供程序。通过调用此函数并提供适当的参数，您可以将自定义的代码完成项提供程序与特定的语言关联起来。注册后，您的代码完成项提供程序将被触发，以便为编辑器中的代码输入提供自定义的建议项。
- vscode.languages.registerHoverProvider：registerHoverProvider 是一个函数，用于注册悬停提示提供程序。通过调用此函数并提供适当的参数，您可以将自定义的悬停提示提供程序与特定的语言关联起来。注册后，您的悬停提示提供程序将在用户将鼠标悬停在代码上时触发，并显示与代码相关的详细信息、文档或其他有用的提示。

代码实现`extension.ts`：
```ts
import * as vscode from 'vscode';
import getBorderClassProvider from './provider/border'

export function activate(context: vscode.ExtensionContext) {
  //这段代码是将获取到的边框类提供者对象注册到 VS Code 的上下文订阅中。在 VS Code 扩展开发中，context.subscriptions 是一个用于管理扩展生命周期的数组
	context.subscriptions.push(...getBorderClassProvider());
}

export function deactivate() {}

```
`getBorderClassProvider:`

```ts
import * as vscode from 'vscode';

const getProvider = (completionList: vscode.CompletionList, ...triggerCharacters: string[]) => {
  //注册一个自动补全提供器，用于在所有语言中提供自动完成项。当用户触发自动完成时，
  //调用 provideCompletionItems 方法，返回一个预定义的自动完成项数组。同时，可以通过 triggerCharacters 数组定义触发自动完成的字符
    const completionItemProvider = vscode.languages.registerCompletionItemProvider({ pattern:'**' }, {
        provideCompletionItems(document, position) {
            return completionList;
        }
    }, ...triggerCharacters);
    return [
        completionItemProvider,
        // hoverProvider
    ];
};



const getBorderClassProvider = () => {
    const borderCompletionList = new vscode.CompletionList();
    const testData = [
        {
            label: ".bd-r-10",
            detail: 'border-right:10px',
            description: "右边框"
        },
        {
            label: ".bd-l-10",
            detail: 'border-left:10px',
            description: "左边框"
        },
        {
            label: ".bd-t-10",
            detail: 'border-top:10px',
            description: "上边框"
        },
        {
            label: ".bd-b-10",
            detail: 'border-bottom:10px',
            description: "下边框"
        },

    ];
    testData.forEach(item => {
        const borderItem = new vscode.CompletionItem({
            label: item.label,
            detail: item.detail,
            description: item.description,
        });
        borderItem.insertText = `${item.label}`;
        borderCompletionList.items.push(borderItem);
    });

    return getProvider(borderCompletionList,'bd');
};

export default getBorderClassProvider;
```

最后我们启用调试模式查看结果：

<img src='@assets/vscode/result.png' alt="center"  height="250" />

### 发布
下面我们看看如何发布


首先第一步我们需要去创建一个`vscode`官方的账号，可以从[这个地方](https://marketplace.visualstudio.com/VSCode)点击 `Publish extensions`按钮跟着步骤去注册。

注册好了之后，会进入到[用户这个页面](https://marketplace.visualstudio.com/manage/publishers/zpcsstip?auth_redirect=True)：
<img src='@assets/vscode/user.png' alt="center"  height="250" />

接下来我们需要安装一个工具 `vsce`来将扩展程序的代码编译成`.vsix`文件

```js
npm i vsce -g
```

接下来在`package.json`中添加当前发布者的一些信息：

```json
{
  "publisher": "zpcsstip", //发布者
  "icon": "logo.jpg", //扩展的图标
}

```
**注意：还需要更新一下`README.md`文件的内容**


进入到扩展项目目录下面执行：
```js
vsce package
```
执行成功之后会在项目下面生成一个 `.vsix`结尾的文件

将该文件上传上去即可:


<img src='@assets/vscode/upload.png' alt="center"  height="250" />

最后我们可以在扩展市场去安装使用：
<img src='@assets/vscode/extent.png' alt="center"  height="250" />