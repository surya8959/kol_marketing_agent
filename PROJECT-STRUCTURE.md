# 📁 VANZO KOL Agent - 项目结构说明

## 🎯 项目概览

这是一个**单页应用（SPA）**项目，使用原生 HTML/CSS/JavaScript 构建，无需构建工具即可运行。

---

## 📂 完整目录结构

```
vanzo-kol-agent/
│
├── 📄 README.md                   # 项目说明文档
├── 📄 package.json                # 项目配置文件
├── 📄 .gitignore                  # Git 忽略文件
├── 📄 start.sh                    # 快速启动脚本
│
├── 📁 public/                     # 公共静态资源（Web 根目录）
│   └── index.html                # 主页面入口
│
├── 📁 src/                        # 源代码目录
│   │
│   ├── 📁 css/                    # ��式文件
│   │   ├── variables.css         # CSS 变量系统（颜色、间距、字体）
│   │   ├── layout.css            # 布局样式（头部、容器、四栏布局）
│   │   ├── components.css        # 组件样式（卡片、按钮、表单）
│   │   └── animations.css        # 动画效果（淡入、滑入、脉冲）
│   │
│   ├── 📁 js/                     # JavaScript 文件
│   │   ��── app.js                # 主应用入口（状态管理、事件处理）
│   │   │
│   │   └── 📁 utils/             # 工具模块
│   │       ├── data.js           # 模拟数据（KOL 数据库、脚本模板）
│   │       └── helpers.js        # 工具函数（格式化、筛选、排序）
│   │
│   └── 📁 data/                   # 数据文件（预留）
│       └── (未来放置 JSON 数据)
│
└── 📁 assets/                     # 资源文件（图片、图标等）
    └── (预留)
```

---

## 📄 文件说明

### 核心文件

| 文件 | 说明 | 行数估算 |
|:---|:---|:---|
| **public/index.html** | 主页面，四栏布局，表单输入 | ~200 |
| **src/js/app.js** | 主应用逻辑，状态管理，Agent 协调 | ~300 |
| **src/css/layout.css** | 布局样式，响应式设计 | ~400 |
| **src/css/components.css** | 组件样式，Agent 状态卡片 | ~300 |
| **src/js/utils/data.js** | 模拟数据，KOL 数据库 | ~300 |
| **src/js/utils/helpers.js** | 工具函数库 | ~200 |

### 样式文件架构

```
variables.css (设计系统)
    ↓
layout.css (布局)
    ↓
components.css (组件)
    ↓
animations.css (动画)
```

**依赖关系**：每个 CSS 文件都独立工作，但按顺序加载可获得最佳效果。

### JavaScript 模块架构

```
app.js (主应用)
    ├── AppState (状态管理)
    ├── EventBus (事件总线)
    ├── UIRenderer (UI 渲染)
    └── App (主应用类)

utils/
    ├── data.js (模拟数据)
    └── helpers.js (工具函数)
```

---

## 🎨 设计系统

### 颜色系统
```css
--color-primary: #1E40AF;      /* 深蓝 */
--color-success: #10B981;      /* 绿色 */
--color-accent: #F59E0B;       /* 橙色 */
--color-danger: #EF4444;       /* 红色 */
```

### 间距系统
```css
4px, 8px, 12px, 16px, 24px, 32px
```

### 字体系统
```css
11px, 12px, 13px, 14px, 16px, 18px, 24px
```

---

## 🚀 快速开始

### 方法 1：使用启动脚本（推荐）
```bash
./start.sh
```

### 方法 2：手动启动
```bash
cd public
python3 -m http.server 8000
```

### 方法 3：使用 Node.js
```bash
npx serve public -p 8000
```

然后访问：**http://localhost:8000**

---

## 📊 数据流向

```
用户输入需求
    ↓
需求分析 Agent
    ↓
KOL 匹配 Agent
    ↓
内容创作 Agent
    ↓
效果优化 Agent
    ↓
输出结果（KOL 列表 + 脚本 + 效果预测）
    ↓
数据回流（优化下一轮）
```

---

## 🔧 开发指南

### 添加新 Agent

1. 在 `src/js/utils/data.js` 添加 Agent 配置
2. 在 `src/js/app.js` 添加 Agent 执行逻辑
3. 在 `public/index.html` 添加 Agent UI

### 修改样式

1. 修改 `src/css/variables.css` 更改配色
2. 修改 `src/css/layout.css` 调整布局
3. 修改 `src/css/components.css` 自定义组件

### 添加新功能

1. 在 `src/js/utils/helpers.js` 添加工具函数
2. 在 `src/js/app.js` 集成到主应用
3. 在 `public/index.html` 添加 UI 元素

---

## 📝 下一步开发

### Phase 1: 基础功能（当前）
- [x] 项目结构搭建
- [x] UI 框架
- [x] 模拟数据
- [ ] Agent 逻辑实现
- [ ] 基础交互

### Phase 2: 核心功能
- [ ] 四个 Agent 完整实现
- [ ] Claude API 集成
- [ ] KOL 匹配算法
- [ ] 脚本生成逻辑

### Phase 3: 增强功能
- [ ] 数据闭环演示
- [ ] 效果预测算法
- [ ] 风险评估系统
- [ ] 导出报告功能

### Phase 4: 优化
- [ ] 性能优化
- [ ] 错误处理
- [ ] 浏览器兼容
- [ ] 移动端适配

---

## 🎯 面试准备

### 核心话术

1. **架构设计**
   > "采用四层 Agent 架构，每个 Agent 专注一个领域，通过管道模式串联"

2. **数据闭环**
   > "投放数据会回流训练 Agent，让系统越用越聪明"

3. **技术选型**
   > "使用原生技术栈，降低复杂度，便于快速迭代和部署"

4. **扩展性**
   > "模块化设计，可以轻松添加新 Agent 或替换实现"

---

**文档版本**：v1.0
**最后更新**：2026-03-16
**维护者**：Interview Candidate
