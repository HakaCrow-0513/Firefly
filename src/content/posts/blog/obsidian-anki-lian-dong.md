---
title: Obsidian × Anki ：从插件安装到自定义模板设置  
published: 2026-09-10
updated: 2026-09-10
description: 面向大陆用户的 Obsidian与Anki联动教程 ：大陆装插件的优化路径、Flashcards 与 Obsidian_to_Anki 的选型对比、Anki 自定义模板的正确用法。
image: "https://tu.longmaythesunshine.xyz/file/blog/pic/1788982188515_你只是还年轻，在学习如何生活.jpg"
draft: false
tags:
  - 效率工具
  - Obsidian
  - Anki
  - 学习方法
category: 效率工具
author: fqzlr
---
> 摘要：本文介绍了如何通过插件将Obsidian和anki进行联动，从而实现通过obsidian创建内容然后在anki上进行学习的效果。最后补充了关于快捷模板骨架设置的技巧；其他进阶技巧（如自写交互模板、自动化多端互通）有时间的话也许会另开新文再谈。
> 环境基准（2026-09）：Windows 10/11、国内网络（无代理直连）、Obsidian 1.13.x、Anki 桌面版 26.x。版本会过期，请以官方文档为准。

# 一、Obsidian 与 Anki 简介

Anki 的特点是**间隔重复（FSRS）记忆学习**，缺点则是"个人手动制卡十分消耗精力"；Obsidian 恰好相反。
关于二者的同步，最稳妥的做法是**单向同步**：

- **Obsidian 作为内容的来源**：卡片内容、类型、牌组、标签都由 Obsidian 决定；
- **Anki 只负责复习历史与排程**：内容变了就更新，但你的复习进度不会被冲掉。

但二者之间没有官方通道，必须以社区插件  [AnkiConnect](https://foosoft.net/projects/anki-connect/) 为桥梁，（暴露一个本地 `http://127.0.0.1:8765` 的 JSON-RPC 接口，Obsidian 插件通过它读写 Anki）。所以**想要实现二者 联通 时必须保持 Anki 开着**。

另外一个需要注意的地方（对新人而言）：**Obsidian 插件是按"库（vault）"隔离的**。一个插件只装进一个库的 `.obsidian/plugins/插件id/` 文件夹，配三个文件：

```text
.obsidian/plugins/插件id/
├── main.js        # 插件本体（必须）
├── manifest.json  # 元信息：id、版本、最低 Obsidian 版本
└── styles.css     # 样式（可选）
```

启用清单是库根目录的 `.obsidian/community-plugins.json`（一个 JSON 数组，列出已启用的插件 id）。首次启用社区插件前，Obsidian 默认处于"受限模式"，需要手动退出。

# 二、大陆网络下优化插件安装

## 2.1 三条安装路径

| 路径                                                                         | 适用情况            | 说明                                                  |
| -------------------------------------------------------------------------- | --------------- | --------------------------------------------------- |
| Obsidian 设置 → 社区插件 → 浏览                                                    | 插件已进官方商店        | 最省事，但商店源在国内时好时坏                                     |
| 加速商店插件（如 [china-speedup](https://github.com/notesynchelper/china-speedup)） | 官方商店打不开/太慢      | 装一次，商店浏览与下载全部走国内中转节点，还能更新已装插件                       |
| 手动 sideload                                                                | 插件还没进商店、或想装特定版本 | 下载 Release 的三件套放到 `.obsidian/plugins/<id>/`，再写入启用清单 |

## 2.2 官方商店还没有的插件

与手动安装方法类似：China Speedup 并未收录进官方商店（2026.9.10）我们这里采用手动安装的方式：

1. 到仓库 Releases 页下载 `main.js`、`manifest.json`、`styles.css`；
2. 放进目标库的 `.obsidian/plugins/china-speedup/`；
3. 把 `"china-speedup"` 写进 `.obsidian/community-plugins.json`；
4. 重启 Obsidian，在社区插件里确认启用。


# 三、插件选择：Flashcards 还是 Obsidian-to-Anki？

个人在用的 Obsidian→Anki 插件（如果有其他插件推荐，欢迎在评论区补充分享）：

| 插件             | Flashcards v2（[reuseman/flashcards-obsidian](https://github.com/reuseman/flashcards-obsidian)） | Obsidian_to_Anki（[ObsidianToAnki/Obsidian_to_Anki](https://github.com/ObsidianToAnki/Obsidian_to_Anki)） |
| -------------- | ---------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| 定位             | 严格单向同步器：一套语法 + 4 个受管笔记类型                                                                       | 灵活解析器：多套语法 + 任意自定义笔记类型                                                                                  |
| 自定义模板          | ❌ 只能同步进它自建的 `Obsidian-basic` 等 4 个模型（可改这些模型的模板/CSS，但不能映射到你自己的模板，但是基础模板已经涵盖所需要的全部功能，该设置也方便随时记录） | ✅ 任何你创建/下载的笔记类型都能作为目标，字段自由映射                                                                            |
| 语法             | 一套：`问::答`、`:::反向`、`==挖空==`、`#card` 标题卡、显式块                                                     | `START/END` 块、单行 `STARTI`、Anki 原生挖空 + 便捷花括号、**正则自定义风格**                                                 |
| 防重复/身份         | 块锚点 + frontmatter 哈希 + Anki `Source` 回链，幂等，保排程                                                 | 成功建卡后往文件里插 `<!--ID: ...-->` 注释，凭此更新                                                                     |
| AnkiConnect 配置 | v2.0.1+ 用默认设置即可                                                                                | 需要手动给 AnkiConnect 加 `app://obsidian.md` 到 CORS 白名单（但是很简单）                                               |
| 维护状态           | 活跃（2026 仍在发版）                                                                                  | 基本停更（最后 Release 2024-01，open issues 200+，很多问题可能到时候得自己修bug，但是社区经验很多，不懂技术也考研借助ai修理）                       |
| 上手成本           | 低                                                                                              | 高（多语法并存、正则要写配置，但是如果是希望自动化批量制卡的话，倒是没什么问题）                                                                |

**个人建议**：

- 只需要"问答/挖空/标题卡"这类常规卡 + 省心 → **Flashcards**，同步安全（重复跑不复制卡片、Anki 里手改会被修复回 Obsidian 内容）。
- 需要更多的自定义空间："**用自己创建/下载的 Anki 模板**" → 只能选 **Obsidian_to_Anki**（见第 5 章），但要接受它的配置成本和停更风险。
- 两者可以共存（语法不冲突），但最好别在同一篇笔记里混用两套体系。

# 四、Obsidian-to-Anki（O2A） 实战：扫描目录与块语法

## 4.1 前置：AnkiConnect 与 CORS

O2A 的 README 要求手动修改 AnkiConnect 配置（Anki → 工具 → 插件 → AnkiConnect → 配置），`webCorsOriginList` 里加上 `app://obsidian.md`（新版 AnkiConnect 已默认包含，可先检查再改）：

```json
{ "webCorsOriginList": ["http://localhost", "app://obsidian.md"] }
```

## 4.2 扫描目录：填"相对路径"，别填绝对路径（大坑）

O2A 默认扫描**整个库**。设置项在 Defaults → **Scan Directory**，官方说明是"留空 = 扫整个库"。但它的取值是交给 Obsidian 的 `vault.getAbstractFileByPath()` 解析的——**只认库内相对路径**：

| 填写情况                                       | 实际行为                            |
| ------------------------------------------ | ------------------------------- |
| `obsidian-to-anki`                         | ✅ 只扫该文件夹及其子文件夹                  |
| `C:\Users\babala\Desktop\obsidian-to-anki` | ⚠️ 解析不到 → **静默回退为扫描整个库**（正好相反！） |
| 留空                                         | 扫描整个库                           |

建议：先建一个专门放卡片的文件夹（比如就叫 `obsidian-to-anki`），Scan Directory 填它的**相对路径**。这个习惯还能顺带解决"库很大扫得慢"和"误扫别的内容"的问题。

## 4.3 块语法与字段映射速查

O2A 的通用卡片块（字段规则来自[官方 Wiki：Field formatting](https://github.com/ObsidianToAnki/Obsidian_to_Anki/wiki/Field-formatting)）：

```markdown
START
笔记类型名（必须与 Anki 模型名逐字符一致，含中文/空格）
Front: 第一个字段也可以不写前缀，直接写内容
Back: 其余每个字段必须独占一行，用"字段名: 内容"作前缀
Hint: 字段顺序随意、可少填，下一行不带前缀则属于上一字段的续行
Tags: 卡片标签（写在 Tags: 行）
END
```

- 文件级牌组指令：`TARGET DECK: 牌组名`（每文件取第一个生效，`::` 是子牌组分隔符）。
- 卡片类型名写错最常见，建议查看官方帮助文档。

# 五、自定义模板：Anki的"模板"可以分为两类

## 5.1 第一类：纯笔记类型模板

例如 [Quizify 格致（ankiweb 1929979604）](https://ankiweb.net/shared/info/1929979604)（作者 [e-chehil/anki-quizify](https://github.com/e-chehil/anki-quizify)）。它本质上是一组 **字段 + 卡片模板 HTML/CSS/JS**，导入 Anki 后出现在「工具 → 管理笔记类型」里，你新建卡片时选择它即可。它完全可以被改造成自己的版本：复制一份 → 改字段（如加一个 `Hint`、一个控制反向卡的 `Add Reverse`）→ 粘贴你自己的模板/样式。博主就基于它改造了一版"三段式提示展开"模板：

```markdown
三段式提示：((第一层提示::第二层额外提示::最终答案))    ← 点击逐层展开
折叠区块：  [[标题::折叠内容]]
填空：      {{待填答案}}                                 ← 点击作答、Ctrl 聚焦
选择题：    [A. 选项一<br>B. 选项二<br>C. 选项三]::(B)    ← 单选/多选靠答案字母个数
```

注意：**这类模板的"交互"靠模板里的 JavaScript 在复习渲染时扫描字段的原始文本**（括号、双括号、花括号、`<br>` 分隔的选项行）。

## 5.2 第二类：Anki 插件

例如 [Quizify Markdown（ankiweb 279004701）](https://ankiweb.net/shared/info/279004701)。它不是一个笔记类型，而是一个**要在 Anki 里安装的插件**：Anki → 工具 → 插件 → 获取插件 → 输入代码 `279004701`。装上后插件会自动创建/维护名为 `Quizify Markdown` 的笔记类型（字段就 Front/Back），字段里直接写 **Markdown**（带 `{{80}}` 填空、`;;; A. TCP B. UDP C. HTTP ;;;C` 选择题、`[[标题||内容]]` 点击揭示、`$E=mc^2$` KaTeX）等功能，插件在复习时负责渲染成互动内容。（出错请检查anki版本是否为要求的版本）

# 六、制卡与验证

1. **专用小文件夹 + 牌组测试**：Scan Directory 指向 `obsidian-to-anki`，测试笔记里写 `TARGET DECK: O2A同步测试`，配独立标签，跑完用上面第 5.3 节的脚本核对"几张卡、字段内容对不对、标签到没到"。
2. **Obsidian 侧日志**：插件加载失败看 `%APPDATA%\obsidian\obsidian.log`。
3. **Anki 侧**：装完插件重启 Anki；AnkiConnect 打不开就先开 <http://127.0.0.1:8765> 自检（应显示 `Anki-Connect`）。

# 七、简单尝试

1. **简单试试：用 Flashcards → 任意笔记写 `科学心理学之父是谁？::冯特` → 命令面板跑同步 → Anki 里复习。
2. **进阶自定义**：确认要自定义模板后，再引入 O2A + AnkiConnect CORS 配置 + Scan Directory 相对路径（第 4 章），摸清块语法（4.3）。
3. **自动化前记得验证**：任何"内容会被某一步转换/改写"的工作流程，都要用**含最复杂语法的单卡小样**验证整条链路，确认效果后再放开权限执行自动化操作。

# 八、预设输入设置

每次都手写 `START/类型名/END` 这样的骨架的话，就远比不上anki实用了，因此接下来补充关于预设输入的内容。

## 8.1 三种"预设输入"对比

| 方式                 | 触发方式                     | 卡片落点   | 适合                |
| ------------------ | ------------------------ | ------ | ----------------- |
| 手动复制/敲骨架           | 无                        | 光标处    | 在前面有先例的情况下，偶尔写一两张 |
| templates插件 + 骨架文件 | 快捷键（如 `Ctrl+Alt+G`）→ 选骨架 | 光标处    | 边写笔记边插卡、需要看着语法备忘  |
| QuickAdd 弹窗填卡      | 命令面板 / 快捷键               | 当前笔记末尾 | 批量连续录卡、不想看语法      |


## 8.2 templates插件 + 骨架文件

Obsidian **templates**自带"插入模板"能力，只需三步：

1. 在库根目录建一个专用文件夹（如 `O2A骨架`）；
2. 文件夹里放几个骨架文件，例如问答卡骨架：
   ```
   START
   Quizify-三段式提示展开
   Front: 
   Back: 
   Hint: 
   END
   ```
   富交互卡可以多放一行语法备忘注释在 `END` 之后，插入后照着填；
3. 设置 → 模板 → 模板文件夹位置，选该文件夹。

然后到 设置 → 快捷键，给 **"模板：插入模板"** 绑一个顺手的热键，比如 `Ctrl+Alt+G`。以后按一下热键 → 输入骨架名 → 空白骨架插到光标处，在 `Front:`/`Back:` 后填空即可。

> 注意：一个卡组一个 md 文件，文件第一行写好 `TARGET DECK: 牌组名` 即可，这个文件里所有卡片都会进同一牌组。

## 8.3 QuickAdd 弹窗填卡

QuickAdd 是社区插件（官方商店搜 QuickAdd 安装即可）。它的 Capture 支持 `{{VALUE:标签}}` 占位符——**一个占位符 = 一次弹窗**，所以可以做成"依次问你 问题 / 答案 / 提示"的卡片生成器：

1. 设置 → QuickAdd → 新建 **Capture**，格式粘贴（注意 `{{VALUE:xxx}}` 会按顺序逐次弹窗）：
   ```
   START
   Quizify-三段式提示展开
   Front: {{VALUE:问题}}
   Back: {{VALUE:答案}}
   Hint: {{VALUE:提示(可直接回车留空)}}
   END
   ```
2. 勾选"写入当前文件"，保存后它会出现在命令面板；
3. 打开想加卡的笔记，运行命令，依次弹出三个输入框，确认后完整卡片块自动追加到笔记末尾；
4. 想更省事就照 8.2 的方法给这个命令也绑个快捷键。

需要多个模板就建多个 Capture（问答一张、Markdown 一张……）；想改弹窗顺序/文案，编辑对应 Capture 的格式即可，不用碰插件代码。若 QuickAdd 版本差异导致 Capture 没生效，在设置页里手动重建一次即可

## 8.4 可能的问题：模板文件夹未找到

博主把快捷键设好后第一次插入，Obsidian 报错"插入模板未成功，未找到 templates 文件夹"，排查后发现是**以下问题**：

1. **Windows 文件名不区分大小写**：`templates` 和 `Templates` 在同一个磁盘上是**同一个文件夹**。如果你既用核心模板、又用 Templater（另一款模板插件，默认文件夹叫 `Templates`），两个插件的模板文件会混进同一个目录，互相污染（核心模板的插入列表里会出现 Templater 的模板代码文件）；
2. 手写 `.obsidian/templates.json` 把文件夹填成小写 `templates`，与实际目录的 `Templates` 大小写不一致，核心插件按字面寻找结果报错"未找到"。

**应对措施（推荐）**：

1. 给核心模板骨架单独建一个**无歧义的文件夹**（博主用的是 `O2A骨架`），把骨架文件移进去，Templater 的模板留在它自己的 `Templates/` 里，各管各的；
2. **文件夹位置不要手写配置文件，直接在 设置 → 模板 → 模板文件夹位置 里用选择器选**，让 Obsidian 自己记录正确路径；
3. 重启 Obsidian（`Ctrl+R`）后再试。

> 注意：这些模板文件夹都在库内。O2A 若设置成"扫描整个库"（4.2 的坑），模板骨架也会被当成卡片解析。要么 Scan Directory 固定指向专门放卡片的文件夹（如 `obsidian-to-anki`），要么在 O2A 的忽略清单里把 `O2A骨架/**`、`Templates/**` 加进去。再三提示，这个不设置好，后期容易导致电脑卡顿

## 8.5 方法论小结

- 骨架/弹窗的本质是**把"语法框架"自动化**，我们只需要考虑"内容填充"；
- 别在流程没跑通前批量制作卡片：先拿一张**含最复杂语法的小样**走完整条链路（Obsidian → O2A → Anki 预览），确认渲染正常再放开；
- 如果发现模板交互失效（选择题变纯文本），多半是内容被中间环节改写了（如 Markdown→HTML 转换）。

# 附录：相关参考链接

- [AnkiConnect](https://foosoft.net/projects/anki-connect/)：链接Obsidian与Anki的桥梁 
- [Flashcards](https://github.com/reuseman/flashcards-obsidian)：简介与语法 https://reuseman.github.io/flashcards-obsidian/
- [Obsidian_to_Anki](https://github.com/ObsidianToAnki/Obsidian_to_Anki)：简介与规则 https://github.com/ObsidianToAnki/Obsidian_to_Anki/wiki/Field-formatting
- [China Speedup（notesynchelper）](https://github.com/notesynchelper/china-speedup)：国内加速商店
- [Quizify 格致 1929979604](https://ankiweb.net/shared/info/1929979604) 与 [Quizify Markdown 279004701](https://ankiweb.net/shared/info/279004701)、作者仓库 [e-chehil/anki-quizify](https://github.com/e-chehil/anki-quizify)
- 注意文中的版本信息截至 2026.09.10，工具迭代快，出现问题请优先查看官方最新文档
有更多问题欢迎在评论区进行讨论，这里是HakaCrow的小窝，欢迎您的到来φ(゜▽゜*)♪