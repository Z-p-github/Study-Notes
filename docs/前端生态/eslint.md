## 抽象语法树(Abstract Syntax Tree)

- 抽象语法树是源代码语法结构的一种抽象标识
- 它以树状的形式表现编程语言的语法结构，树上的每个节点都表示源代码中的一种结构

<img src='@assets/eslint/ast.jpg' alt="singleDiff"  height="300" />

## 抽象语法树的作用

- 代码语法的检查，代码风格的检查，代码的格式化，代码错误提示等等
- 优化变更代码，改变代码结构使达到想要的结构

## Javascript Parser

- `Javascript Parser` 是把 `javascript`源码转化为抽象语法树的解析器
- [astexplorer](https://astexplorer.net/)

## 代码转换

- esprima 将代码转换为 ast 语法树
- estraverse 深度优先遍历，遍历 ast 抽象语法树
- escodegen 新的代码生成

```js
const esprima = require('esprima')
const estraverse = require('estraverse')
const escodegen = require('escodegen')
let code = `function a(){}`

// 1) 将我们的代码转换成ast语法树
const ast = esprima.parseScript(code)

// 访问模式 就是遍历节点的时候 会有两个过程 一个是进入一个是离开
estraverse.traverse(ast, {
  //深度遍历，先进后出
  enter(node) {
    // Program ->  FunctionDeclaration -> Identifier
    console.log('enter:' + node.type)
    if (node.type === 'FunctionDeclaration') {
      node.id.name = 'ast'
    }
  },
  leave(node) {
    // Identifier ->  FunctionDeclaration -> Program
    console.log('leave:' + node.type)
  },
})
//使用escodegen 生成代码
console.log(escodegen.generate(ast)) // function ast(){}
```

<img src='@assets/eslint/travser.png' alt="travser"   />

## 常见的 ast 节点类型

| 类型原名称                |       中文名称 |                         描述                          |
| :------------------------ | -------------: | :---------------------------------------------------: |
| Program                   |       程序主体 |                    整段代码的主体                     |
| VariableDeclaration       |       变量声明 |           声明一个变量，例如 var let const            |
| FunctionDeclaration       |       函数声明 |              声明一个函数，例如 function              |
| ExpressionStatement       |     表达式语句 |        通常是调用一个函数，例如 console.log()         |
| BlockStatement            |         块语句 | 包裹在 {} 块内的代码，例如 if (condition){var a = 1;} |
| ReturnStatement           |       返回语句 |                     通常指 return                     |
| Identifier                |         标识符 |    标识，例如声明变量时 var identi = 5 中的 identi    |
| CallExpression            |     调用表达式 |        通常指调用一个函数，例如 console.log()         |
| BinaryExpression          |   二进制表达式 |                 通常指运算，例如 1+2                  |
| FunctionExpression        |     函数表达式 |           例如 const func = function () {}            |
| ArrowFunctionExpression   | 箭头函数表达式 |               例如 const func = ()=> {}               |
| ArrowAssignmentExpression |     赋值表达式 |   通常指将函数的返回值赋值给变量 FunctionExpression   |

## babel 插件

### 转换箭头函数

- [@babel/core Babel](https://www.npmjs.com/package/@babel/core) 的编译器，核⼼ API 都在这⾥⾯，⽐如常⻅的 transform、parse,并实现了插件功能
- [@babel/types](https://github.com/babel/babel/tree/master/packages/babel-types) ⽤于 AST 节点的 Lodash 式⼯具库, 它包含了构造、验证以及变换 AST 节点的⽅法，对编写处理 AST 逻辑⾮常有⽤
- [babel-plugin-transform-es2015-arrow-functions](https://www.npmjs.com/package/babel-plugin-transform-es2015-arrow-functions) 转换箭头函数插件

```js
//转换箭头函数例子：

const babel = require('@babel/core')
const types = require('@babel/types')
const arrowFunctions = require('babel-plugin-transform-es2015-arrow-functions')
const code = `const sum = (a,b)=> a+b`
// 转化代码，通过arrowFunctions插件
const result = babel.transform(code, {
  plugins: [arrowFunctions],
})
console.log(result.code) // const sum = function (a, b) {return a + b};
```

<img src='@assets/eslint/babel.png' alt="babel"   />

### 模拟 transformFunction 插件实现 ast 转换

```js
const babel = require('@babel/core')
const types = require('@babel/types')
//定义节点类型的函数，会在babel中注册一个监听器， 在后面遍历ast语法树的时候，如果节点的类型匹配上了，那么就会去执行相应的处理函数
const transformFunction = {
  visitor: {
    ArrowFunctionExpression(path) {
      // path就是访问的路径   path -> node
      let { node } = path
      node.type = 'FunctionExpression'

      hoistFunctionEvn(path)
      let body = node.body // 老节点中的 a+b;

      if (!types.isBlockStatement(body)) {
        node.body = types.blockStatement([types.returnStatement(body)])
      }
    },
  },
}
function getThisPath(path) {
  let arr = []
  path.traverse({
    ThisExpression(path) {
      arr.push(path)
    },
  })
  return arr
}
function hoistFunctionEvn(path) {
  // 查找父作用域
  const thisEnv = path.findParent(
    (parent) =>
      (parent.isFunction() && !parent.isArrowFunctionExpression()) ||
      parent.isProgram()
  )

  const bingingThis = '_this' // var _this = this;
  //获取到当前的作用域路径
  const thisPaths = getThisPath(path)

  // 1) 修改当前路径中的this  变为_this
  thisPaths.forEach((path) => {
    // this -> _this
    path.replaceWith(types.identifier(bingingThis))
  })
  //在父级作用域中插入this表达式
  thisEnv.scope.push({
    id: types.identifier(bingingThis),
    init: types.thisExpression(), // var _this = this 表达式
  })
}
const code = ` const sum = ()=> console.log(this)` // js代码
const result = babel.transform(code, {
  plugins: [transformFunction],
})

console.log(result.code)

/**
 * 结果：
 * var _this = this;
   const sum = function () {
     return console.log(_this);
   };
 */
```

## Eslint

- ESLint 是⼀个开源的⼯具 cli，ESLint 采⽤静态分析找到并修复 JavaScript 代码中的问题
- ESLint 使⽤[Espree](https://github.com/eslint/espree)进⾏ JavaScript 解析。
- ESLint 使⽤ AST 来评估代码中的模式。
- ESLint 是完全可插拔的，每⼀条规则都是⼀个插件，你可以在运⾏时添加更多。

几种解析器的关系：

- esprima - 经典的解析器 最早的 ast 语法解析库
- acorn - 造轮⼦媲美 Esprima,代码更少，更轻巧
- @babel/parser （最早叫做 babylon）基于 acorn 的 ， @babel/core 内部就是基于 @babel/parser
- espree 最初从 Esprima 中 fork 出来的，现在基于 acorn

### 基本使用

```node
pnpm init
pnpm i eslint -D # 安装eslint
pnpm create @eslint/config # 初始化eslint的配置⽂件
```

配置文件

```js
module.exports = {
  env: {
    // 指定环境
    browser: true, // 可以使用浏览器环境的一些语法  例如 document
    es2021: true, // 可以ECMAScript高级语法 例如 Promise
    node: true, // 可以使用node环境的语法  例如 require
  },
  extends: 'eslint:recommended', //继承一些插件和规则 //路径 node_module=>eslint=>conf=>eslint-recommended
  parserOptions: {
    // ⽀持语⾔的选项, ⽀持最新js语法，同时⽀持jsx语法
    ecmaVersion: 'latest', // ⽀持的语法是
    sourceType: 'module', // ⽀持模块化 例如import
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // eslint规则  off warn error
    semi: ['error', 'always'], //需要分号结尾
    quotes: ['error', 'double'], //双引号
  },
  globals: {
    // 配置全局变量，比如这个变量是通过script脚本引入进来的
    custom: 'readonly', // readonly 、 writable
  },
}
```

插件和 extends 的区别

如果使用 plugins，那么我们配置了之后，还需要单独在 rules 中配置该插件的规则，而 extends 可以把插件和规则都包含进来

可以使用 extends 将插件和规则都引入进来

```js
  "extends": [
     "eslint:recommended",
      "plugin:@typescript-eslint/recommended" // 规则引用路径  node_modules\@typescript-eslint\eslint-plugin\dist\index.js
  ], // 集成后 就可以使用别人写好的的规则
```

## 比如我们单独配置插件的规则

```js
  "rules":{
    "@typescript-eslint/no-inferrable-types":"error"
  },
  "plugins": ['@typescript-eslint'],
```

## eslint 流程

三部曲：遍历=》使用规则=》修复

调试 `eslint`源码
首先创建一个 `JavaScript Debug Terminal`模式的 vscode 终端

<img src='@assets/eslint/eslint-debug.png' alt="eslint-debug"   />

然后我们可以使用 `npx eslint xx.js` 来执行 `eslint`命令

通过`node_modules` 的`bin`文件夹下面的命令，我们可以发现 `eslint`命令其实就是执行的是 `node_modules\eslint\bin\eslint.js` 这个文件，然后通过打断点就可以进行调试

```js
//引用cli工具，然后执行
process.exitCode = await require('../lib/cli').execute(
  process.argv, //参数
  //这个选项告诉 ESLint 从 STDIN 而不是从文件中读取和检测源码。你可以使用该选项向 ESLint 来输入代码。
  process.argv.includes('--stdin') ? await readStdin() : null,
  true
)
```

```js
    async execute(args, text, allowFlatConfig) {

        const CLIOptions = createCLIOptions(usingFlatConfig);

        /** @type {ParsedCLIOptions} */
        let options;

        try {
            options = CLIOptions.parse(args);
        } catch (error) {
            debug("Error parsing CLI options:", error.message);
            log.error(error.message);
            return 2;
        }
        //实例化eslint
         const engine =  new ESLint(await translateOptions(options));

         let results;
         //如果是直接校验文本
        if (useStdin) {
            results = await engine.lintText(text, {
                filePath: options.stdinFilename,
                warnIgnored: true
            });
        } else {
          //检验文件
            results = await engine.lintFiles(files);
        }
    }
```

`options`

<img src='@assets/eslint/options.png' alt="options"   />

`new Eslint`

```js
/**
 * Main API.
 */
class ESLint {
  /**
   * Creates a new instance of the main ESLint API.
   * @param {ESLintOptions} options The options for this instance.
   */
  constructor(options = {}) {
    const processedOptions = processOptions(options)
    // 内部会创建一个  CLIEngine 实例
    const cliEngine = new CLIEngine(processedOptions, {
      preloadedPlugins: options.plugins,
    })
    // Initialize private properties. 初始化私有属性
    privateMembersMap.set(this, {
      cliEngine,
      options: processedOptions,
    })
  }
}
```

`Eslint `类核心 api

- lintFiles 检验⽂件
- lintText 校验⽂本
- loadFormatter 加载 formatter
- calculateConfigForFile 通过⽂件获取配置
- isPathIgnored 此路径是否是被忽略的
- static outputFixes 输出修复的⽂件
- static getErrorResults 获得错误结果

`CLIEngine`类核心 Api

- getRules 获取规则
- resolveFileGlobPatterns 解析⽂件成 glob 模式
- executeOnFiles 根据⽂件执⾏逻辑
- executeOnText 根据⽂本执⾏逻辑
- getConfigForFile 获取⽂件的配置
- isPathIgnored 此路径是否是被忽略的
- getFormatter 获取输出的格式
- static getErrorResults 获取错误结果
- static outputFixes 输出修复的结果

执行 eslint.lintFiles

```js
//检验文件
let result = await engine.lintFiles(files);
....
//参数是要校验的文件的相对路径
   async lintFiles(patterns) {
        if (!isNonEmptyString(patterns) && !isArrayOfNonEmptyString(patterns)) {
            throw new Error("'patterns' must be a non-empty string or an array of non-empty strings");
        }
        const { cliEngine } = privateMembersMap.get(this);

        return processCLIEngineLintReport(
            cliEngine,
            cliEngine.executeOnFiles(patterns) //执行 cliEngine.executeOnFiles （在文件上执行校验）
        );
    }
```

executeOnFiles 方法

```js
//executeOnFiles

  /**
     * Executes the current configuration on an array of file and directory names.
     * @param {string[]} patterns An array of file and directory names.
     * @throws {Error} As may be thrown by `fs.unlinkSync`.
     * @returns {LintReport} The results for all files that were linted.
     */
    executeOnFiles(patterns) {
        const {
            cacheFilePath,
            fileEnumerator,
            lastConfigArrays,
            lintResultCache,
            linter,
            options: {
                allowInlineConfig,
                cache,
                cwd,
                fix,
                reportUnusedDisableDirectives
            }
        } = internalSlotsMap.get(this);
        const results = [];

        // Clear the last used config arrays.
        lastConfigArrays.length = 0;

        // Iterate source code files.
        for (const { config, filePath, ignored } of fileEnumerator.iterateFiles(patterns)) {
            if (ignored) {
                results.push(createIgnoreResult(filePath, cwd));
                continue;
            }

            /*
             * Store used configs for:
             * - this method uses to collect used deprecated rules.
             * - `getRules()` method uses to collect all loaded rules.
             * - `--fix-type` option uses to get the loaded rule's meta data.
             */
            if (!lastConfigArrays.includes(config)) {
                lastConfigArrays.push(config);
            }


            // Do lint.
            //会循环对所有的文件执行  verifyText 校验，会使用 fs.readFileSync 把文件的内容读写出来
            const result = verifyText({
                text: fs.readFileSync(filePath, "utf8"),
                filePath,
                config,
                cwd,
                fix,
                allowInlineConfig,
                reportUnusedDisableDirectives,
                fileEnumerator,
                linter
            });

            results.push(result);

        return {
            results,
            ...calculateStatsPerRun(results),
        };
    }
    }
```

config 配置项:
<img src='@assets/eslint/config.png' alt="config"   />

linter.verifyAndFix

```js
//主要是的参数就是 文件的内容，和 所有的配置项
const { fixed, messages, output } = linter.verifyAndFix(text, config, {
  allowInlineConfig,
  filename: filePathToVerify,

  /**
   * Check if the linter should adopt a given code block or not.
   * @param {string} blockFilename The virtual filename of a code block.
   * @returns {boolean} `true` if the linter should adopt the code block.
   */
  filterCodeBlock(blockFilename) {
    return fileEnumerator.isTargetPath(blockFilename)
  },
})
```

verifyAndFix

```js
 verifyAndFix(text, config, options) {
        let messages = [],
            fixedResult,
            fixed = false,
            passNumber = 0,
            currentText = text;
        const debugTextDescription = options && options.filename || `${text.slice(0, 10)}...`;
        const shouldFix = options && typeof options.fix !== "undefined" ? options.fix : true;

        /**
         * This loop continues until one of the following is true:
         *
         * 1. No more fixes have been applied.
         * 2. Ten passes have been made.
         *
         * That means anytime a fix is successfully applied, there will be another pass.
         * Essentially, guaranteeing a minimum of two passes.
         */
        //如果你输入了 --fix 参数，说明你需要支持修复，那么shouldFix就是一个true，每次eslint校验的时候，发现错误就会去给你自动修复，最多修复10次
        do {
            passNumber++;

            debug(`Linting code for ${debugTextDescription} (pass ${passNumber})`);
            //校验文件 ,message就是校验错误的信息，是一个数组，包括了每一个校验失败的规则id和对应规则的错误提示信息
            //如果你的文件中语法有错误，那么在后面解析成ast语法树的时候就会报错，这个时候 message = [{fatal:true,error:'...'}]
            messages = this.verify(currentText, config, options);

            debug(`Generating fixed text for ${debugTextDescription} (pass ${passNumber})`);
            //如果shouldFix 是true的话就会去走修复逻辑
            fixedResult = SourceCodeFixer.applyFixes(currentText, messages, shouldFix);

            /*
             * stop if there are any syntax errors.
             * 'fixedResult.output' is a empty string.
             */
            //如果有语法错误，直接跳出
            if (messages.length === 1 && messages[0].fatal) {
                break;
            }

            // keep track if any fixes were ever applied - important for return value
            fixed = fixed || fixedResult.fixed;

            // update to use the fixed output instead of the original text
            currentText = fixedResult.output;

        } while (
            fixedResult.fixed &&
            passNumber < MAX_AUTOFIX_PASSES //  MAX_AUTOFIX_PASSES = 10
        );

        /*
         * If the last result had fixes, we need to lint again to be sure we have
         * the most up-to-date information.
         */
        if (fixedResult.fixed) {
            fixedResult.messages = this.verify(currentText, config, options);
        }

        // ensure the last result properly reflects if fixes were done
        fixedResult.fixed = fixed;
        fixedResult.output = currentText;

        return fixedResult;
    }
```

verify 方法

```js
   verify(textOrSourceCode, config, filenameOrOptions) {
        debug("Verify");

        const { configType } = internalSlotsMap.get(this);

        const options = typeof filenameOrOptions === "string"
            ? { filename: filenameOrOptions }
            : filenameOrOptions || {};

        if (config) {

            if (typeof config.extractConfig === "function") {
                return this._distinguishSuppressedMessages(this._verifyWithConfigArray(textOrSourceCode, config, options));
            }
        }

    }
```

\_verifyWithConfigArray 方法

```js
  /**
     * Verify a given code with `ConfigArray`.
     * @param {string|SourceCode} textOrSourceCode The source code.
     * @param {ConfigArray} configArray The config array.
     * @param {VerifyOptions&ProcessorOptions} options The options.
     * @returns {(LintMessage|SuppressedLintMessage)[]} The found problems.
     */
    _verifyWithConfigArray(textOrSourceCode, configArray, options) {
        debug("With ConfigArray: %s", options.filename);

        // 存储config 列表，为了后面去拿到plugin和env还有规则
        internalSlotsMap.get(this).lastConfigArray = configArray;

        // 为当前校验文件提取最后的配置文件
        const config = configArray.extractConfig(options.filename);
        const processor =
            config.processor &&
            configArray.pluginProcessors.get(config.processor);

        // Verify.如果有processor，会走这个逻辑，processor就是指的除了.js文件以外的文件的校验
        if (processor) {
            debug("Apply the processor: %o", config.processor);
            const { preprocess, postprocess, supportsAutofix } = processor;
            const disableFixes = options.disableFixes || !supportsAutofix;

            return this._verifyWithProcessor(
                textOrSourceCode,
                config,
                { ...options, disableFixes, postprocess, preprocess },
                configArray
            );
        }
        return this._verifyWithoutProcessors(textOrSourceCode, config, options);
    }
```

\_verifyWithoutProcessors

```js
  _verifyWithoutProcessors(textOrSourceCode, providedConfig, providedOptions) {
        let parser = espree;//espree作为默认的parser
             // search and apply "eslint-env *".
        const envInFile = options.allowInlineConfig && !options.warnInlineConfig
            ? findEslintEnv(text)
            : {};
            //合并所有config中的env
        const resolvedEnvConfig = Object.assign({ builtin: true }, config.env, envInFile);

        //解析所有的 parserOptions，合并在一起
        const parserOptions = resolveParserOptions(parser, config.parserOptions || {}, enabledEnvs);
        //解析 globals,除了自己定义一些globals选项，eslint内部也会把一些js常用的全局对象加进来，例如  addEventListener  Blob  alert 等等
        //布尔值 false 和字符串值 "readable" 等价于 "readonly"。类似地，布尔值 true 和字符串值 "writeable" 等价于 "writable"
        const configuredGlobals = resolveGlobals(config.globals || {}, enabledEnvs);
        //将global，parserOption，sourceType等配置组合起来
        const languageOptions = createLanguageOptions({
            globals: config.globals,
            parser,
            parserOptions
        });
        //解析为ast语法树  parseResult = {success:true,sourceCode:{ast:....}} 其中就包含了ast节点，如果你的语法有错误，此处会解析错误
        const parseResult = parse(text,languageOptions,options.filename);
        if (!parseResult.success) {
            return [parseResult.error];
        }
        //运行规则

         slots.lastSourceCode = parseResult.sourceCode;
         const sourceCode = slots.lastSourceCode;
         //获取到所有的规则
         const configuredRules = Object.assign({}, config.rules);
        //解析规则 runRules
          let  lintingProblems = runRules(
                sourceCode,
                configuredRules,
                ruleId => getRule(slots, ruleId),
                parserName,
                languageOptions,
                settings,
                options.filename,
                options.disableFixes,
                slots.cwd,
                providedOptions.physicalFilename
            );
  }
```

runRules

拍平的 node queue
<img src='@assets/eslint/node-flat.png' alt="node-flat"   />

```js
function runRules(configuredRules) {
  const emitter = createEmitter() //创建一个触发器
  let currentNode = sourceCode.ast
  //遍历ast语法树
  Traverser.traverse(sourceCode.ast, {
    enter(node, parent) {
      node.parent = parent
      //拍平树中的节点
      nodeQueue.push({ isEntering: true, node })
    },
    leave(node) {
      nodeQueue.push({ isEntering: false, node })
    },
    visitorKeys: sourceCode.visitorKeys,
  })

  const lintingProblems = []

  //遍历所有的规则
  Object.keys(configuredRules).forEach((ruleId) => {
    //ruleId 每一个规则的名字
    const severity = ConfigOps.getRuleSeverity(configuredRules[ruleId])

    // 标识这个规则是禁用的
    if (severity === 0) {
      return
    }
    //拿到每一个规则
    const rule = ruleMapper(ruleId)

    if (!rule) {
      lintingProblems.push(createLintingProblem({ ruleId }))
      return
    }

    const ruleContext = Object.freeze() //此处省略一些代码，目的就是创建一个规则上下文，该上下文中会收集report出来的错误，然后放到 lintingProblems 这个数组中

    //创建一个规则的监听器，一个规则里面可能会有多个不同节点类型的监听器
    //可以查看 这个地方的定义 https://eslint.bootcss.com/docs/developer-guide/working-with-rules
    const ruleListeners = createRuleListeners(rule, ruleContext) //createRuleListeners下面有定义

    // add all the selectors from the rule as listeners
    Object.keys(ruleListeners).forEach((selector) => {
      const ruleListener = timing.enabled
        ? timing.time(ruleId, ruleListeners[selector])
        : ruleListeners[selector]

      emitter.on(selector, addRuleErrorHandler(ruleListener))
    })
  })
  //创建一个事件生成器
  const eventGenerator = new NodeEventGenerator(emitter, {
    visitorKeys: sourceCode.visitorKeys,
    fallback: Traverser.getKeys,
  })
  //遍历平铺的ast 节点，根据每一个节点的类型去触发对应的监听函数,如果规则校验失败，eslint会收集每一个规则里面report出来的问题
  nodeQueue.forEach((traversalInfo) => {
    currentNode = traversalInfo.node

    try {
      if (traversalInfo.isEntering) {
        eventGenerator.enterNode(currentNode)
      } else {
        eventGenerator.leaveNode(currentNode)
      }
    } catch (err) {
      err.currentNode = currentNode
      throw err
    }
  })
  //返回所以收集到的问题
  return lintingProblems
}
```

创建规则监听器 `createRuleListeners`

```js
function createRuleListeners(rule, ruleContext) {
  try {
    //调用每一个规则的create方法，并且传入规则上下午
    return rule.create(ruleContext)
  } catch (ex) {
    ex.message = `Error while loading rule '${ruleContext.id}': ${ex.message}`
    throw ex
  }
}
```

规则监听数组 ruleListeners：
<img src='@assets/eslint/rule-listener.png' alt="rule-listener"   />

//规则订阅

规则订阅的主要作用是后续 ast 中的 node 节点和规则匹配上了之后，就会去触发对应的规则校验，本质是一个发布订阅

## 插件编写

Eslint 官⽅提供了可以使⽤ Yeoman 脚⼿架⽣成插件模板

安装

```js
npm install yo generator-eslint -g

```

模板初始化

```js
mkdir eslint-plugin-lint
cd eslint-plugin-lint
yo eslint:plugin // 插件模板初始化
```

<img src='@assets/eslint/generator.png' alt="generator"   />

规则模版初始化

```js
yo eslint:rule // 规则模版初始化

```

<img src='@assets/eslint/rule-config.png' alt="rule-config"   />

[eslint 中文文档](https://eslint.bootcss.com/docs/developer-guide/working-with-rules)

基本语法可以参考文档
