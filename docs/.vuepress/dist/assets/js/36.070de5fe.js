(window.webpackJsonp=window.webpackJsonp||[]).push([[36],{511:function(t,a,s){"use strict";s.r(a);var r=s(65),o=Object(r.a)({},(function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h3",{attrs:{id:"mac-如何安装-grpc"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#mac-如何安装-grpc"}},[t._v("#")]),t._v(" mac 如何安装 grpc")]),t._v(" "),s("p",[t._v("第一步：安装 "),s("code",[t._v("brew")]),t._v("，切记使用国内源")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("bin"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("zsh "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("c "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"')]),t._v("\n")])])]),s("p",[t._v("安装好了之后再来下载"),s("code",[t._v("protobuf")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("brew install protobuf\n")])])]),s("p",[t._v("安装完成之后可以使用 "),s("code",[t._v("protoc --version")]),t._v(" 检查一下自己安装完成没，如果安装完成了，会输出对应的版本号")]),t._v(" "),s("p",[t._v("之后安装 "),s("code",[t._v("protoc-gen-go")]),t._v(" 和 "),s("code",[t._v("protoc-gen-go-grpc")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("go install google"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("golang"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("org"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("protobuf"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("cmd"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("protoc"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("gen"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("go\n\ngo install google"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("golang"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("org"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("grpc"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("cmd"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("protoc"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("gen"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("go"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("grpc\n")])])]),s("p",[t._v("安装完成了之后,"),s("code",[t._v("protoc-gen-go")]),t._v(" 和 "),s("code",[t._v("protoc-gen-go-grpc")]),t._v(" 这两个文件一般会被安装在"),s("code",[t._v("$GOPATH")]),t._v("下面，我们可以通过 "),s("code",[t._v("go env")]),t._v(" 命令查看 "),s("code",[t._v("GOPATH")]),t._v("的地址，然后打开"),s("code",[t._v("GOPATH")]),t._v("地址，将"),s("code",[t._v("bin")]),t._v("目录下面的 "),s("code",[t._v("protoc-gen-go")]),t._v(" 和 "),s("code",[t._v("protoc-gen-go-grpc")]),t._v(" 这两个文件拷贝到 "),s("code",[t._v("/use/local/bin")]),t._v("下面就可以了，如下：")]),t._v(" "),s("blockquote",[s("p",[t._v("注：/usr/local/bin 是 Mac OS 系统中用于存放用户自行安装的可执行文件的目录。当您使用 make install 或者 ./configure && make && make install 等命令来安装某些软件时，它们通常会被安装到 /usr/local/bin 目录下。")])]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v("cp protoc"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("gen"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("go "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("usr"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("local"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("bin"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("\n\ncp protoc"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("gen"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("go"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("grpc "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("usr"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("local"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("bin"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("/")]),t._v("\n")])])]),s("p",[t._v("执行完以上的步骤基本上就可以去编译 "),s("code",[t._v(".proto")]),t._v("文件了")]),t._v(" "),s("p",[t._v("使用命令如下：")]),t._v(" "),s("div",{staticClass:"language-js extra-class"},[s("pre",{pre:!0,attrs:{class:"language-js"}},[s("code",[t._v(" protoc "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),s("span",{pre:!0,attrs:{class:"token constant"}},[t._v("I")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v(" helloworld"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("proto "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("--")]),t._v("go_out"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("--")]),t._v("go"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("-")]),t._v("grpc_out"),s("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(".")]),t._v("\n")])])])])}),[],!1,null,null,null);a.default=o.exports}}]);