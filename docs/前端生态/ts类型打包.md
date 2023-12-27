开发组件库或者一些功能函数的时候，我们在打包的时候一般需要将组件的`typescript`类型一起输出出来，方便后续使用者的类型提示以及类型引入，下面基于我之前的一些开发组件库的项目实践，来简单说说如何实现

### 为什么需要打包类型
- 静态类型检查：TypeScript 提供了静态类型检查，可以在编译时捕获许多常见的错误，例如类型错误、变量使用错误等。通过打包 ts 类型，可以确保类型检查在整个项目中得以应用，从而提高代码的健壮性和可靠性。

- 代码可读性和可维护性：通过打包 ts 类型，代码中的类型信息得以明确和清晰地表达，提高了代码的可读性。类型信息还可以充当代码文档，使其他开发人员更容易理解和维护代码。

- 提高开发效率：TypeScript 提供了丰富的类型系统和智能提示功能，可以帮助开发人员更快地编写代码、调试和重构。打包 ts 类型可以使这些功能在整个项目中得以应用，进一步提高开发效率。

- 更好的重构和维护：打包 ts 类型可以提供更好的重构支持。当进行代码重构时，类型系统可以帮助开发人员找到需要修改的相关代码，并确保修改后的代码仍然与其他部分兼容。

- 更好的团队协作：通过打包 ts 类型，整个团队可以共享类型定义，提高团队成员之间的沟通和协作效率。类型定义可以帮助开发人员理解代码的意图和接口，并减少因为类型不一致而引起的问题。


### 打包的几种方式
不管使用什么方法，生成类型声明文件，最根本的还是通过 `TypeScript` 本身的特性及配置项去提取` .d.ts` 文件，再使用一些手段将文件写到打包路径下。

常用的几种方式如下：
- 使用 `ts compiler` 编译出来
- 使用 `Rollup` 生成
- 使用 `Gulp.js` 生成 
- 使用 `ts-morph` 生成 .d.ts 文件。

此处我选择的是 `ts-morph` ，因为像 `Rollup` 和 `Gulp` 都集成了很多其他的功能，而我只是想要打包一下类型声明文件，而 `ts-morph` 也只提供了这个能力，简单实用。


<b>注意：打包类型的时候一定要设置  `declaration` , `emitDeclarationOnly` 为 true</b>

[ts-morph官网](https://ts-morph.com/)
 
### 开始

#### 配置`tsconfig.json`

首先我们需要配置好我们项目下面的`tsconfig.json`文件

比如我当前需要打包类型的的文件目录结构是这样的：

<img src='@assets/ts/ts-file.png' alt="center"  height="250" />

那么我的`tsconfig.json`文件内容如下：

```json
{
  "compilerOptions": {
    "target": "es2018",//指定编译后的 JavaScript 目标版本为 ES2018
    "module": "esnext",//编译的模块规范，比如esnext,commonjs
    "declaration": true,//生成对应的 .d.ts 类型声明文件。
    "composite": true,//启用项目合成模式，用于构建大型项目
    "emitDeclarationOnly": true,//仅生成类型声明文件，而不生成 JavaScript 文件
    "noEmitOnError": false,//在编译错误时继续生成输出
    "jsx": "preserve",//保留 JSX 语法，不进行转换。
    "lib": ["ES2018", "DOM", "DOM.Iterable"],//指定要包含的内置类型声明文件。
   "skipLibCheck": true,//跳过对引入的库文件的类型检查。
    "noImplicitAny": false,//允许不明确指定类型的变量隐式为 any 类型。
    "sourceMap": false,//不生成源映射文件
    "moduleResolution": "node",//使用 Node.js 的模块解析策略
    "allowJs": false,//不允许编译 JavaScript 文件
    "strict": true,//启用所有严格的类型检查选项
    "noUnusedLocals": true,//报告未使用的局部变量错误
    "resolveJsonModule": true,//允许导入 JSON 文件作为模块。
    "allowSyntheticDefaultImports": true,//允许默认的导入形式。
    "esModuleInterop": true,//允许以 ES 模块化的方式导入 CommonJS 模块
    "removeComments": false,//保留源代码中的注释。
    //指定要包含的第三方类型声明文件
    "types": [
      "element-plus/global",
      "unplugin-vue-define-options/macros-global"
    ],
  },
  // include 的匹配规则component.d.ts 以及src下面所有的以 .vue , .ts结尾的文件
  "include": [
    "component.d.ts",
    "src/**/*.vue",
    "src/**/*.ts",
  ],
  "exclude": ["node_modules", "lib"]
}

```

#### 编译脚本

```js
import path from "path";
import { Project } from "ts-morph";
import { readFile } from "fs/promises";
import glob from "fast-glob";
import consola from "consola";
import { PACKAGES_PATH } from "./common/constant.js";
import * as vueCompiler from "vue/compiler-sfc";
import { excludeFiles } from "./common/utils.js";
const inputDir = path.resolve(PACKAGES_PATH, "components-v3");
const tsFile = path.resolve(PACKAGES_PATH, "components-v3/tsconfig.json");

async function addSourceFiles(project, inputPath) {
    //手动查找需要打包类型的文件 ，这里需要配置 cwd的地址
    const filePaths = excludeFiles(
        await glob(["**/*.{js,ts,vue}"], {
            cwd: inputPath,
            absolute: true,
            onlyFiles: true,
        })
    );
    const sourceFiles = [];
    //遍历匹配到的文件
    await Promise.all([
        ...filePaths.map(async (file) => {
            //如果是vue文件
            if (file.endsWith(".vue")) {
                const content = await readFile(file, "utf-8");
                //判断文件是否需要 ts检测，此处只是代码文件中增加的一个标识
                const hasTsNoCheck = content.includes("@ts-nocheck");
                //编译vue文件内容
                const sfc = vueCompiler.parse(content);
                const { script, scriptSetup } = sfc.descriptor;
                if (script || scriptSetup) {
                    let content =
                        (hasTsNoCheck ? "// @ts-nocheck\n" : "") +
                        (script?.content ?? "");
                    //是否是setup的形式
                    if (scriptSetup) {
                        const compiled = vueCompiler.compileScript(
                            sfc.descriptor,
                            {
                                id: "xxx",
                            }
                        );
                        content += compiled.content;
                    }
                    const lang = scriptSetup?.lang || script?.lang || "js";
                    const sourceFile = project.createSourceFile(
                        `${path.relative(process.cwd(), file)}.${lang}`,
                        content
                    );
                    sourceFiles.push(sourceFile);
                }
            } else {
                //直接添加
                const sourceFile = project.addSourceFileAtPath(file);
                sourceFiles.push(sourceFile);
            }
        }),
    ]);
    return sourceFiles;
}
async function typeCheck(project, alertText) {
    //获取编译过程中的错误日志
    const diagnostics = project.getPreEmitDiagnostics();
    if (diagnostics.length > 0) {
        //有错误信息的话，就提示出来
        consola.error(
            project.formatDiagnosticsWithColorAndContext(diagnostics)
        );
        const err = new Error("Failed to generate dts.");
        consola.error(err);
        throw err;
    } else {
        consola.success(`${alertText}类型打包成功`);
    }
}

// 参数依次为 ts配置文件的路径 , 指定模块解析的基准路径，打包结束的提示信息
const buildTypes = async (tsConfigFile, baseUrl, alertText) => {
    //声明一些编译选项,可以覆盖默认的tsconfig.json中的配置。官方备注： You can override any tsconfig.json options by also providing a compilerOptions object.
    const compilerOptions = {
        emitDeclarationOnly: true,
        baseUrl, //注意：tsconfig.json 中的配置只是起提示作用，当真正在查找文件时，没有配置 alias，还是会报错
        paths: {
            vue: ["./node_modules/vue/dist/vue.d.ts"],
        },
        preserveSymlinks: true,
        skipLibCheck: true,
        noImplicitAny: false,
    };
    // 实例化一个 Project
    const project = new Project({
        compilerOptions,
        tsConfigFilePath: tsConfigFile,
        //是否自动根据tsconfig.json中的include和exclude来添加文件，此处我需要手动添加(addSourceFileAtPath 和createSourceFile)，所以 skipAddingFilesFromTsConfig 设置为true
        skipAddingFilesFromTsConfig: true,
    });
    //添加文件
    await addSourceFiles(project, baseUrl);
    //写文件
    await writeFile(project);
    //检查是否有错误
    await typeCheck(project, alertText);
};

const excludeFileEmit = (filePath) => {
    //需要排除的文件
    const excludeFile = ["components-v3/index.d.ts"];
    for (let i = 0; i < excludeFile.length; i++) {
        if (filePath.includes(excludeFile[i])) {
            return true;
        }
    }
    return false;
};
async function writeFile(project) {
    const generateOutputPath = (filePath) => {
        //因为此处我要打包到单独的一个地方，所以在输出的时候，修改了一下输出的路径
        const replaceStr = {
            "components-v3/src": "components-v3/lib/src",
        };
        for (let key in replaceStr) {
            filePath = filePath.replace(key, replaceStr[key]);
        }
        return filePath;
    };
    // 将解析完的文件写到内存中，便于读取文件路径
    const result = project.emitToMemory();

    //创建一个新的Project
    const newProject = new Project();
    for (const file of result.getFiles()) {
        const filePath = file.filePath;
        //排除一些文件
        if (excludeFileEmit(filePath)) {
            continue;
        }
        //生成一个新的输出路径
        const newPath = generateOutputPath(filePath);
        //创建一个新的 TypeScript 源文件对象
        newProject.createSourceFile(newPath, file.text, { overwrite: true });
    }
    //保存文件到文件系统中
    await newProject.save();

    console.info(
        `\nSuccess emit declaration file!\n
    The project has generate ${result._files.length} typescript declaration files\n`
    );
}

const buildV3ComponentType = async () => {
    await buildTypes(tsFile, inputDir, "组件");
};

buildV3ComponentType()

```

综上所述，我就完成我的类型编译



#### 注意事项

注意：此处我的项目是`monorepo`的形式，打包的代码和目标组件的代码是独立的两个包。

- 编译`vue3`相关的文件的时候，一定要确保目标文件夹的`node_module`下面有 `@vue/compiler-dom ; @vue/runtime-core ; @vue/runtime-dom` 这几个包，因为`vue`中的很多方法都是从几个包中导出的类型，没有的话，类型打包会失败

- 打包的时候建议 `typescript` 大于 `3` 版本


<!-- ts-morph
1、include选项的设置

2、路径的重写

3、index文件没有包含进来
原因报错了：Cannot find module './src/base-space.vue' or its corresponding type declarations.

skipAddingFilesFromTsConfig

##
include 写法

完整的编译列表：
https://www.tslang.cn/docs/handbook/compiler-options.html

问题：我把include的东西全部干掉了，为啥就能拿到类型了，难不成include会限制当前空间下的类型获取 ？
 -->
