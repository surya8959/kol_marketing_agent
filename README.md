# 🤖 VANZO KOL Marketing Agent - 全链路自动化演示系统

> **面试项目**：为 VANZO AI 产品经理岗位设计的技术 Demo
> **核心价值**：展示 AI 全链路自动化在 KOL 营销场景的完整闭环

---

## 🎯 项目定位

这不是一个简单的 AI 聊天机器人，而是一个**多 Agent 协作系统**，实现了从需求输入到 KOL 匹配、内容生成、效果预测的完整自动化闭环，并通过数据飞轮实现自我优化。

### 核心亮点

✅ **多 Agent 协作架构**：需求分析 + KOL 匹配 + 内容创作 + 效果优化
✅ **全链路自动化**：从输入到输出的完整业务闭环
✅ **数据飞轮设计**：投放数据 → AI 学习 → 策略优化
✅ **实时可视化**：Agent 执行过程的透明化展示
✅ **技术栈现代**：原生 HTML/CSS/JS + Claude API 集成

---

## 🏗️ 系统架构

```
┌─────────────────────────────────────────────────────────┐
│          AI 全链路自动化营销系统 (v1.0)                 │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐         │
│  │ 输入层   │ -> │ Agent层  │ -> │  输出层   │         │
│  │ 需求采集 │    │ 多Agent协作 │    │ 交付物   │         │
│  └──────────┘    └──────────┘    └──────────┘         │
│                                                         │
│  数据闭环：执行效果 -> AI学习 -> 优化下一次决策          │
└─────────────────────────────────────────────────────────┘
```

### 四层 Agent 架构

1. **需求分析 Agent** (Requirement Analyzer)
   - 分析品牌调性（高端/年轻/专业）
   - 识别目标受众画像
   - 评估竞争环境

2. **KOL 匹配 Agent** (KOL Matcher)
   - 从 10M+ 数据库筛选 KOL
   - 计算匹配分数（粉丝量、互动率、风格契合度）
   - 生成 Top 20 推荐列表

3. **内容创作 Agent** (Content Creator)
   - 生成定制化脚本框架
   - 多语言适配（英文/中文/本地化）
   - 预测内容表现

4. **效果优化 Agent** (Performance Optimizer)
   - ROI 估算
   - A/B 测试方案生成
   - 风险评估（舆情/合规）

---

## 🎨 技术栈

- **前端**：原生 HTML5 + CSS3 + JavaScript ES6+
- **设计系统**：深蓝(#1E40AF) + 绿色(#10B981) + 橙色(#F59E0B)
- **AI 能力**：Claude API 集成
- **数据**：JSON 模拟数据（可替换为真实 API）
- **部署**：GitHub Pages / Netlify

---

## 📁 项目结构

```
vanzo-kol-agent/
├── public/                    # 公共静态资源
│   ├── index.html            # 主页面
│   └── favicon.ico
├── src/
│   ├── css/
│   │   ├── variables.css     # CSS 变量系统
│   │   ├── layout.css        # 布局样式
│   │   ├── components.css    # 组件样式
│   │   └── animations.css    # 动画效果
│   ├── js/
│   │   ├── app.js           # 主应用入口
│   │   ├── agents/          # Agent 逻辑
│   │   │   ├── analyzer.js  # 需求分析 Agent
│   │   │   ├── matcher.js   # KOL 匹配 Agent
│   │   │   ├── creator.js   # 内容创作 Agent
│   │   │   └── optimizer.js # 效果优化 Agent
│   │   ├── ui/
│   │   │   ├── renderer.js  # UI 渲染
│   │   │   └── events.js    # 事件处理
│   │   ├── api/
│   │   │   └── claude.js    # Claude API 集成
│   │   └── utils/
│   │       ├── data.js      # 模拟数据
│   │       └── helpers.js   # 工具函数
│   └── data/
│       ├── kols.json        # KOL 数据库
│       └── metrics.json     # 效果指标
├── assets/                   # 图片资源
├── package.json             # 项目配置
└── README.md                # 项目说明
```

---

## 🚀 快速开始

### 本地开发

```bash
# 克隆项目
git clone https://github.com/surya8959/vanzo-kol-agent.git
cd vanzo-kol-agent

# 启动本地服务器
python3 -m http.server 8000
# 或使用 Node.js
npx serve

# 访问
open http://localhost:8000
```

### 配置 Claude API（可选）

如果需要真实 AI 能力，在 `src/js/api/claude.js` 中配置：

```javascript
const CLAUDE_API_KEY = 'your-api-key-here';
```

---

## 📊 核心功能

### 1. 需求输入
- 品牌信息录入（名称、产品、目标市场）
- 预算范围选择
- 营销目标设定（品牌曝光/转化/种草）

### 2. Agent 执行可视化
- 实时显示每个 Agent 的工作状态
- 进度条动画（分析→筛选→生成→优化）
- 执行日志输出

### 3. KOL 匹配结果
- 卡片式展示（头像、粉丝数、互动率）
- 匹配分数可视化（星级/颜色编码）
- 筛选和排序功能

### 4. 脚本生成器
- 显示 AI 生成的脚本框架
- 支持一键优化/重新生成
- 多语言切换

### 5. 效果预测
- ROI 估算
- 曝光/互动/转化预测
- 风险评估报告

### 6. 数据闭环演示
- 投放数据收集
- AI 归因分析
- 策略自动优化
- 下一轮投放优化建议

---

## 🎯 面试演示要点

### 开场白（1分钟）
> "这是一个**KOL营销全链路自动化 Agent** Demo，完全对应 VANZO 的核心业务场景。它展示了从需求输入到 KOL 匹配、内容生成、效果预测的完整闭环，并且通过数据飞轮实现自我优化。"

### 核心演示（3分钟）

**步骤1：输入需求**
"（输入品牌信息）假设我们是一个出海 DTC 品牌，要在 TikTok 美国区做推广，预算 5 万美金。"

**步骤2：Agent 协作**
"（看中间栏）四个 Agent 开始并行工作：
- 需求分析 Agent 正在分析品牌调性
- KOL 匹配 Agent 从 10M+ 数据库筛选
- 内容创作 Agent 生成定制化脚本
- 效果优化 Agent 估算 ROI"

**步骤3：输出结果**
"（展示结果）20 分钟内，系统给出：
- 筛选出 15 位匹配 KOL
- 为每位生成定制脚本
- 预测 ROI: 3.2x
- 风险评估报告"

**步骤4：数据闭环**
"（最关键）点击'数据回流'，这些投放数据会：
1. 训练 KOL 匹配算法（哪些类型表现好）
2. 优化脚本生成模板（什么话术有效）
3. 精准 ROI 预测模型
4. 下一轮投放自动更精准"

### 收尾点睛
> "这个 Demo 的核心价值是：**把 VANZO 需要人工 3-5 天的工作，压缩到 20 分钟全自动完成，而且通过数据闭环，越用越聪明**。这正是 AI 全链路自动化的真正威力。"

---

## 💡 技术亮点

### 1. 多 Agent 协作设计
```javascript
// Agent 间协作机制
const agentPipeline = [
  analyzeAgent,
  matchAgent,
  createAgent,
  optimizeAgent
].reduce((chain, agent) => {
  return chain.then(agent);
}, Promise.resolve());
```

### 2. 实时状态更新
```javascript
// WebSocket 式的实时反馈
agents.on('progress', (data) => {
  updateUI(data.agent, data.status, data.progress);
});
```

### 3. 数据闭环机制
```javascript
// 投放数据 → AI 学习 → 策略优化
const learningLoop = async (campaignData) => {
  const insights = await analyzePerformance(campaignData);
  await updateAgentModels(insights);
  return generateOptimizedStrategy();
};
```

---

## 📝 开发进度

- [x] 项目结构搭建
- [ ] 前端 UI 开发
- [ ] Agent 逻辑实现
- [ ] Claude API 集成
- [ ] 数据闭环演示
- [ ] 测试和优化

---

## 🎨 设计系统

### 配色方案
- **深蓝** #1E40AF - 主色调，专业信任
- **亮蓝** #3B82F6 - 交互高亮
- **绿色** #10B981 - 成功/完成
- **橙色** #F59E0B - 强调/执行中

### 间距系统
- 4px / 8px / 12px / 16px / 24px

### 字体层级
- 标题 14px Semibold
- 正文 13px Regular
- 辅助 12px Medium
- 微文本 11px Regular

---

## 📄 License

MIT License

---

## 👤 作者

Created for VANZO AI Product Manager Interview

**版本**：v1.0-alpha
**创建日期**：2026-03-16
**技术栈**：原生 HTML/CSS/JS + Claude API
