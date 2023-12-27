(window.webpackJsonp=window.webpackJsonp||[]).push([[14],{426:function(t,s,a){t.exports=a.p+"assets/img/lane.6ad1c196.png"},465:function(t,s,a){"use strict";a.r(s);var e=a(65),r=Object(e.a)({},(function(){var t=this,s=t.$createElement,e=t._self._c||s;return e("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[e("p",[e("code",[t._v("Scheduler")]),t._v("与"),e("code",[t._v("React")]),t._v("是两套"),e("code",[t._v("优先级")]),t._v("机制。在"),e("code",[t._v("React")]),t._v("中，存在多种使用不同"),e("code",[t._v("优先级")]),t._v("的情况，比如：")]),t._v(" "),e("p",[t._v("注：以下例子皆为"),e("code",[t._v("Concurrent Mode")]),t._v("开启情况")]),t._v(" "),e("ul",[e("li",[e("p",[t._v("过期任务或者同步任务使用"),e("code",[t._v("同步")]),t._v("优先级")])]),t._v(" "),e("li",[e("p",[t._v("用户交互产生的更新（比如点击事件）使用高优先级")])]),t._v(" "),e("li",[e("p",[t._v("网络请求产生的更新使用一般优先级")])]),t._v(" "),e("li",[e("p",[e("code",[t._v("Suspense")]),t._v("使用低优先级")])])]),t._v(" "),e("p",[e("code",[t._v("React")]),t._v("需要设计一套满足如下需要的"),e("code",[t._v("优先级")]),t._v("机制：")]),t._v(" "),e("ul",[e("li",[e("p",[t._v("可以表示"),e("code",[t._v("优先级")]),t._v("的不同")])]),t._v(" "),e("li",[e("p",[t._v("可能同时存在几个同"),e("code",[t._v("优先级")]),t._v("的"),e("code",[t._v("更新")]),t._v("，所以还得能表示"),e("code",[t._v("批")]),t._v("的概念")])]),t._v(" "),e("li",[e("p",[t._v("方便进行"),e("code",[t._v("优先级")]),t._v("相关计算")])])]),t._v(" "),e("p",[t._v("为了满足如上需求，"),e("code",[t._v("React")]),t._v("设计了"),e("code",[t._v("lane")]),t._v("模型。接下来我们来看"),e("code",[t._v("lane")]),t._v("模型如何满足以上 3 个条件。")]),t._v(" "),e("h2",{attrs:{id:"表示优先级的不同"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#表示优先级的不同"}},[t._v("#")]),t._v(" 表示优先级的不同")]),t._v(" "),e("p",[t._v("想象你身处赛场。")]),t._v(" "),e("p",[e("img",{attrs:{src:a(426),alt:"赛道",title:"赛道"}})]),t._v(" "),e("p",[t._v("不同的赛道。内圈的赛道总长度更短，外圈更长。某几个临近的赛道的长度可以看作差不多长。")]),t._v(" "),e("p",[e("code",[t._v("lane")]),t._v("模型借鉴了同样的概念，使用 31 位的二进制表示 31 条赛道，位数越小的赛道"),e("code",[t._v("优先级")]),t._v("越高，某些相邻的赛道拥有相同"),e("code",[t._v("优先级")]),t._v("。")]),t._v(" "),e("p",[t._v("如下：")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("NoLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                        */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("NoLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                          */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("SyncLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                        */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000000001")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("SyncBatchedLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                 */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000000010")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("InputDiscreteHydrationLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*      */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000000100")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("InputDiscreteLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                    */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000011000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("InputContinuousHydrationLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*           */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000100000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("InputContinuousLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                  */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000011000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("DefaultHydrationLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*            */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000100000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("DefaultLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                   */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000111000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("TransitionHydrationLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000001000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("TransitionLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                       */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000001111111110000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("RetryLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                            */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000011110000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("SomeRetryLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                  */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000010000000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("SelectiveHydrationLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*          */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000100000000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" NonIdleLanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                                 */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000111111111111111111111111111")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("IdleHydrationLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*               */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0001000000000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("IdleLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                             */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0110000000000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("OffscreenLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                   */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b1000000000000000000000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("blockquote",[e("p",[t._v("你可以在"),e("a",{attrs:{href:"https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiberLane.js#L77-L107",target:"_blank",rel:"noopener noreferrer"}},[t._v("这里"),e("OutboundLink")],1),t._v("看到"),e("code",[t._v("lane")]),t._v("的定义")])]),t._v(" "),e("p",[t._v("其中，同步优先级占用的赛道为第一位：")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("SyncLane")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lane "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                        */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000000001")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("从"),e("code",[t._v("SyncLane")]),t._v("往下一直到"),e("code",[t._v("SelectiveHydrationLane")]),t._v("，赛道的"),e("code",[t._v("优先级")]),t._v("逐步降低。")]),t._v(" "),e("h2",{attrs:{id:"表示-批-的概念"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#表示-批-的概念"}},[t._v("#")]),t._v(" 表示“批”的概念")]),t._v(" "),e("p",[t._v("可以看到其中有几个变量占用了几条赛道，比如：")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("InputDiscreteLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                    */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000000000011000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("DefaultLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                   */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000000000000000111000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("const")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("TransitionLanes")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("=")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token comment"}},[t._v("/*                       */")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[t._v("0b0000000001111111110000000000000")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])]),e("p",[t._v("这就是"),e("code",[t._v("批")]),t._v("的概念，被称作"),e("code",[t._v("lanes")]),t._v("（区别于"),e("code",[t._v("优先级")]),t._v("的"),e("code",[t._v("lane")]),t._v("）。")]),t._v(" "),e("p",[t._v("其中"),e("code",[t._v("InputDiscreteLanes")]),t._v("是“用户交互”触发更新会拥有的"),e("code",[t._v("优先级")]),t._v("范围。")]),t._v(" "),e("p",[e("code",[t._v("DefaultLanes")]),t._v("是“请求数据返回后触发更新”拥有的"),e("code",[t._v("优先级")]),t._v("范围。")]),t._v(" "),e("p",[e("code",[t._v("TransitionLanes")]),t._v("是"),e("code",[t._v("Suspense")]),t._v("、"),e("code",[t._v("useTransition")]),t._v("、"),e("code",[t._v("useDeferredValue")]),t._v("拥有的"),e("code",[t._v("优先级")]),t._v("范围。")]),t._v(" "),e("p",[t._v("这其中有个细节，越低"),e("code",[t._v("优先级")]),t._v("的"),e("code",[t._v("lanes")]),t._v("占用的位越多。比如"),e("code",[t._v("InputDiscreteLanes")]),t._v("占了 2 个位，"),e("code",[t._v("TransitionLanes")]),t._v("占了 9 个位。")]),t._v(" "),e("p",[t._v("原因在于：越低"),e("code",[t._v("优先级")]),t._v("的"),e("code",[t._v("更新")]),t._v("越容易被打断，导致积压下来，所以需要更多的位。相反，最高优的同步更新的"),e("code",[t._v("SyncLane")]),t._v("不需要多余的"),e("code",[t._v("lanes")]),t._v("。")]),t._v(" "),e("h2",{attrs:{id:"方便进行优先级相关计算"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#方便进行优先级相关计算"}},[t._v("#")]),t._v(" 方便进行优先级相关计算")]),t._v(" "),e("p",[t._v("既然"),e("code",[t._v("lane")]),t._v("对应了二进制的位，那么"),e("code",[t._v("优先级")]),t._v("相关计算其实就是位运算。")]),t._v(" "),e("p",[t._v("比如：")]),t._v(" "),e("p",[t._v("计算"),e("code",[t._v("a")]),t._v("、"),e("code",[t._v("b")]),t._v("两个"),e("code",[t._v("lane")]),t._v("是否存在交集，只需要判断"),e("code",[t._v("a")]),t._v("与"),e("code",[t._v("b")]),t._v("按位与的结果是否为"),e("code",[t._v("0")]),t._v("：")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("includesSomeLane")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("a")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" Lane"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("b")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" Lane")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("a "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v(" b"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("!==")]),t._v(" NoLanes"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("计算"),e("code",[t._v("b")]),t._v("这个"),e("code",[t._v("lanes")]),t._v("是否是"),e("code",[t._v("a")]),t._v("对应的"),e("code",[t._v("lanes")]),t._v("的子集，只需要判断"),e("code",[t._v("a")]),t._v("与"),e("code",[t._v("b")]),t._v("按位与的结果是否为"),e("code",[t._v("b")]),t._v("：")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("isSubsetOfLanes")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("set")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("subset")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" Lane")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),t._v("set "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v(" subset"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("===")]),t._v(" subset"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("将两个"),e("code",[t._v("lane")]),t._v("或"),e("code",[t._v("lanes")]),t._v("的位合并只需要执行按位或操作：")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("mergeLanes")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("a")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" Lane"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("b")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" Lane")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" a "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" b"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("p",[t._v("从"),e("code",[t._v("set")]),t._v("对应"),e("code",[t._v("lanes")]),t._v("中移除"),e("code",[t._v("subset")]),t._v("对应"),e("code",[t._v("lane")]),t._v("（或"),e("code",[t._v("lanes")]),t._v("），只需要对"),e("code",[t._v("subset")]),t._v("的"),e("code",[t._v("lane")]),t._v("（或"),e("code",[t._v("lanes")]),t._v("）执行按位非，结果再对"),e("code",[t._v("set")]),t._v("执行按位与。")]),t._v(" "),e("div",{staticClass:"language-js extra-class"},[e("pre",{pre:!0,attrs:{class:"language-js"}},[e("code",[e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("export")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("function")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token function"}},[t._v("removeLanes")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("(")]),e("span",{pre:!0,attrs:{class:"token parameter"}},[e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("set")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token literal-property property"}},[t._v("subset")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("|")]),t._v(" Lane")]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(")")]),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v(":")]),t._v(" Lanes "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),e("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" set "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("&")]),t._v(" "),e("span",{pre:!0,attrs:{class:"token operator"}},[t._v("~")]),t._v("subset"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),e("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),e("blockquote",[e("p",[t._v("更多位运算参考"),e("a",{attrs:{href:"https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators",target:"_blank",rel:"noopener noreferrer"}},[t._v("MDN"),e("OutboundLink")],1)])])])}),[],!1,null,null,null);s.default=r.exports}}]);