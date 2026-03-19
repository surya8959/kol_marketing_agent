# 图片 Prompt 生成器 - 专业设计工具

## 功能概述

集成了专业的图片生成 Prompt 规则系统，为播客内容矩阵提供高质量的图片生成 Prompt。

---

## 核心规则（遵循 Senior Graphic Designer 标准）

### ✅ 构图法则
```
必须包含关键词：
- generous negative space (大量留白)
- minimalist composition (极简构图)
```

**布局原则：**
- ❌ 避免元素居中
- ✅ 使用 off-center (偏离中心)
- ✅ 使用 aligned left (左对齐) 增加动感

### 🎨 风格关键词
```
必须引用设计流派：
- Swiss International Style (瑞士国际主义风格)
- Japanese Zen Aesthetic (日式禅意美学)
```

**质量词：**
- editorial design (排版设计)
- high-end gallery poster (高端画廊海报)

### 🎯 细节控制

#### 颜色限制
```
- monochromatic color palette (单色调色板)
- black text on off-white background (灰白背景黑字)
```

#### 装饰元素
```
- thin hand-drawn line (手绘感)
- imperfect sketch style (不完美素描风格)
```

### ❌ 负向约束（必须添加）
```
--no clutter, shapes, gradients, complex patterns, watermark, signature
```

---

## 三种设计风格

### 1. 极简留白（高级感）
```prompt
generous negative space, minimalist composition, off-center text placement,
Swiss International Style, Japanese Zen Aesthetic, editorial design,
high-end gallery poster, monochromatic color palette, black text on off-white background,
thin clean lines, geometric shapes
--no clutter, shapes, gradients, complex patterns, watermark, signature, text
```

**特点：**
- 大量留白，呼吸感强
- 单色调，灰白底黑字
- 瑞士国际主义风格
- 日式禅意美学

**适用场景：**
- 高端知识分享
- 专业观点输出
- 品牌形象展示

### 2. 杂志时尚（时尚感）
```prompt
asymmetrical layout, layered text, overlapping elements,
editorial magazine design, fashion editorial, modern typography,
bold accent colors on neutral base, high contrast,
simple graphic elements, ruled lines, page numbers
--no clutter, messy layout, low contrast
```

**特点：**
- 非对称布局
- 层次分明
- 大胆强调色
- 时尚杂志风格

**适用场景：**
- 年轻化内容
- 时尚/生活方式
- 潮流趋势分享

### 3. 渐变高级（质感）
```prompt
centered minimalist, generous breathing room,
premium gradient design, luxury brand aesthetic, clean modern,
subtle gradient background (2-3 colors max), white text,
minimal geometric accents, thin borders
--no harsh gradients, busy patterns, low contrast
```

**特点：**
- 居中极简
- 微妙渐变（2-3色）
- 奢华品牌美学
- 高级质感

**适用场景：**
- 高端服务/产品
- 专业咨询
- 商业内容

---

## 使用方法

### 1. 在代码中使用

```javascript
import ImagePromptGenerator from './utils/image-prompt-generator.js';

// 生成单个风格的 Prompt
const prompt = ImagePromptGenerator.generateGoldenQuoteCard(
    '人和人的差距，不是努力决定的，是认知',
    'minimalist'
);

// 生成多个风格的完整规格
const specs = ImagePromptGenerator.generateMultipleStyles('金句文案');

// 验证 Prompt 质量
const validation = ImagePromptGenerator.validatePrompt(prompt);

// 优化现有 Prompt
const optimized = ImagePromptGenerator.optimizePrompt(originalPrompt);
```

### 2. 在生成的物料中使用

当用户点击"生成图文种草"后，系统会：

1. **提取金句**：从长文中提取最精华的观点
2. **生成 Prompt**：为每句金句生成 3 种风格的 AI 图片生成 Prompt
3. **提供建议**：包括布局、色彩、情调的设计建议
4. **一键复制**：点击按钮即可复制 Prompt 到剪贴板

### 3. 输出格式

每张金句卡片包含：

```
💎 金句卡片 1 [极简风]

中文文案：
人和人的差距，不是努力决定的，是认知

🎨 AI 图片生成 Prompt（三款风格）

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 极简留白
[复制] 📋
generous negative space, minimalist composition, off-center...
设计建议：布局: 文字偏离中心，大量留白

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2. 杂志时尚
[复制] 📋
asymmetrical layout, layered text, overlapping elements...
设计建议：布局: 非对称布局，层次分明

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3. 渐变高级
[复制] 📋
centered minimalist, generous breathing room...
设计建议：布局: 居中极简，呼吸感强
```

---

## 核心优势

### 🎯 专业级质量
- 遵循国际设计标准
- 参考瑞士国际主义、日式禅意美学
- 高端画廊海报质量

### ⚡ 即用性强
- 直接复制到 Midjourney、Stable Diffusion、DALL-E
- 预设负向约束，避免常见错误
- 包含设计建议，确保效果一致

### 🔧 可定制化
- 三种经典风格可选
- 支持自定义风格扩展
- Prompt 验证和优化功能

### 📚 知识沉淀
- 每个 Prompt 都附带设计说明
- 帮助用户理解设计原理
- 提升整体设计审美

---

## 工作流程

```
1. 提取金句
   ↓
2. 生成 Prompt（3种风格）
   ↓
3. 复制到 AI 图片生成工具
   ↓
4. 获得高质量图片
   ↓
5. 配合文案发布到小红书
```

---

## 技术实现

### 文件结构
```
src/js/utils/
├── image-prompt-generator.js  # 核心 Prompt 生成器
└── 图片生成规则文档.md         # 设计规范说明

src/js/app.js
├── import ImagePromptGenerator
├── formatShortCopy()           # 集成到物料展示
└── copyPrompt()                 # 一键复制功能

src/css/components.css
└── 金句卡片样式                # UI 样式
```

### API 接口

```javascript
class ImagePromptGenerator {
    // 生成金句卡片 Prompt
    static generateGoldenQuoteCard(quote, style)

    // 生成封面图 Prompt
    static generateCoverImage(theme, mood)

    // 生成清单配图 Prompt
    static generateChecklistImage(itemCount, topic)

    // 生成完整规格（含建议）
    static generateCompleteImageSpec(chineseText, style)

    // 批量生成多风格
    static generateMultipleStyles(quote)

    // 验证 Prompt 质量
    static validatePrompt(prompt)

    // 优化现有 Prompt
    static optimizePrompt(originalPrompt)
}
```

---

## 示例效果

### 示例 1：极简留白风格
**金句：** "认知差才是最大的差距"

**生成的 Prompt：**
```
generous negative space, minimalist composition, off-center text placement,
Swiss International Style, Japanese Zen Aesthetic, editorial design,
high-end gallery poster, monochromatic color palette, black text on off-white background
--no clutter, shapes, gradients, complex patterns, watermark, signature, text
```

**预期效果：**
- 大量留白，文字偏离中心
- 黑字在灰白背景上
- 极简线条装饰
- 高级画廊海报质感

### 示例 2：杂志时尚风格
**金句：** "选择对了，努力才有意义"

**生成的 Prompt：**
```
asymmetrical layout, layered text, overlapping elements,
editorial magazine design, fashion editorial, modern typography,
bold accent colors on neutral base, high contrast
--no clutter, messy layout, low contrast
```

**预期效果：**
- 非对称布局
- 文字层次叠加
- 大胆强调色
- 时尚杂志排版

### 示例 3：渐变高级风格
**金句：** "舒服的时候，通常是在退步"

**生成的 Prompt：**
```
centered minimalist, generous breathing room,
premium gradient design, luxury brand aesthetic, clean modern,
subtle gradient background (2-3 colors max), white text
--no harsh gradients, busy patterns, low contrast
```

**预期效果：**
- 居中极简
- 微妙渐变背景
- 白色文字
- 奢华品牌质感

---

## 设计原则

### ✅ 遵循的原则
1. **留白即高级**：大量留白传达高级感
2. **少即是多**：避免过多装饰元素
3. **对齐很重要**：遵循专业对齐原则
4. **色彩克制**：限制调色板，单色或双色
5. **质感知足**：通过细节体现品质

### ❌ 避免的错误
1. 过度装饰
2. 元素居中（除非是特殊设计）
3. 颜色过多
4. 缺乏负向约束
5. 低质量/分辨率

---

## 扩展功能

### 支持的图片类型
- 金句卡片 ✅
- 封面图 ✅
- 清单配图 ✅
- 视频背景 ✅

### 支持的风格
- 极简留白 ✅
- 杂志时尚 ✅
- 渐变高级 ✅
- 可自定义扩展

### 质量保证
- Prompt 验证 ✅
- Prompt 优化 ✅
- 设计建议 ✅
- 负向约束 ✅

---

## 使用建议

1. **选择合适的风格**
   - 专业内容 → 极简留白
   - 时尚内容 → 杂志时尚
   - 高端服务 → 渐变高级

2. **测试多个风格**
   - 同一金句生成 3 种风格
   - 选择最符合内容调性的
   - 或根据发布平台选择

3. **结合实际使用**
   - 生成后复制到 AI 图片工具
   - 根据生成效果微调 Prompt
   - 积累个人 Prompt 库

4. **持续优化**
   - 记录哪些 Prompt 效果好
   - 根据反馈调整规则
   - 建立自己的风格模板

---

## 总结

这个图片 Prompt 生成器集成了专业级的设计规则，能够：

1. **生成高质量 Prompt**：遵循国际设计标准
2. **提供多样选择**：三种经典风格可选
3. **保证即用性**：直接复制到 AI 工具使用
4. **提升设计审美**：通过规则和建议教育用户

让每个内容创作者都能生成专业级的图片素材！🎨✨