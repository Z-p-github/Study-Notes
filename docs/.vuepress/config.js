const path = require("path");
module.exports = (options, cotext) => {
  return {
    title: "学习笔记",
    description:
      "前端技术相关的文章，包含不限于vue，react，webpack，nodejs，算法等等",
    base: '/Study-Notes/',
    logo: "/assets/img/logo.png",
    themeConfig: {
      nav: [
        { text: "Home", link: "/" },
        // { text: 'Guide', link: '/guide/' },
        { text: "github", link: "https://github.com/Z-p-github/Study-Notes" },
      ],
      sidebar: [
        ["/", "主页"],
        // {
        //   title: "算法",
        //   collapsable: false,
        //   children: [["/Algorithm/算法复杂度分析", "算法复杂度分析"]],
        // },
        {
          title: "JavaScript",
          collapsable: false,
          children: [
            // ["/JavaScript/你真的懂闭包吗", "你真的懂闭包吗"],
            ["/JavaScript/小顶堆", "小顶堆"],
            ["/JavaScript/位运算", "位运算"],
          ],
        },
        {
          title: "React",
          collapsable: false,
          children: [
            {
              title: "React Fiber",
              collapsable: false,
              children: [
                ["/React/React-Fiber/React理念", "React理念"],
                ["/React/React-Fiber/ReactFiber架构", "Fiber架构"],
                {
                  title: "React Fiber Render",
                  collapsable: false,
                  children: [
                    [
                      "/React/React-Fiber/Fiber-dom-diff/beginWork",
                      "beginWork阶段",
                    ],
                    [
                      "/React/React-Fiber/Fiber-dom-diff/completeWork",
                      "completeWork阶段",
                    ],
                    ["/React/React-Fiber/Fiber-dom-diff/commit", "commit阶段"],
                    [
                      "/React/React-Fiber/Fiber-dom-diff/domdiff",
                      "completeWork-diff阶段",
                    ],
                  ],
                },
                {
                  title: "Concurrent Mode",
                  collapsable: false,
                  children: [
                    [
                      "/React/Concurrent-Mode/React中的事件优先级调度",
                      "React事件优先级调度",
                    ],
                    ["/React/Concurrent-Mode/scheduler", "scheduler具体实现"],
                    ["/React/Concurrent-Mode/lane", "lane模型"],
                  ],
                },
                ["/React/React17", "React17"],
                ["/React/React18", "React18"],
              ],
            },
          ],
        },
        {
          title: "Vue",
          collapsable: false,
          children: [
            ["/Vue/Vue3+Typescript实现Form组件", "Vue3+Typescript实现Form组件"],
            ["/Vue/搭建vue3和ts组件库开发环境", "搭建vue3和ts组件库开发环境"],
            ["/Vue/Vite2配置项目开发环境", "Vite2配置项目开发环境"],
            [
              "/Vue/基于Element-plus实现虚拟下拉组件",
              "基于Element-plus实现虚拟下拉组件",
            ],
          ],
        },
        {
          title: "前端生态",
          collapsable: false,
          children: [
            ['/前端生态/eslint.md', 'eslint'],
            ['/前端生态/flutter实践.md', 'flutter实践'],
            ['/前端生态/flutter消息推送.md', 'flutter消息推送'],
            ['/前端生态/antd5架构分析.md', 'antd5研究'],
            ['/前端生态/element-plus架构分析.md', 'element-plus样式+打包分析'],
            ['/前端生态/ts类型打包.md', 'ts类型打包'],
            ['/前端生态/vscode扩展工具.md', 'vscode扩展工具实现'],
            ['/前端生态/svelte.md', 'svelte框架'],
          ],
        },
        {
          title: "go",
          collapsable: false,
          children: [["/go/mac如何安装grpc.md", "mac安装grpc"]],
        },
      ],
    },
    alias: {
      "@assets": path.resolve(__dirname, "./../../assets"),
    },
  };
};
