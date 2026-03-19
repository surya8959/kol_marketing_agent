# 右侧物料区 Tab 切换功能更新

## 更新时间
2026-03-17

## 更新内容
将播客推广视图右侧的物料区从"平铺展示"改为"Tab 切换"方式，解决了内容重叠的问题。

## 修改文件

### 1. `/Users/lpp/kol-marketing-agent/src/css/layout.css`
**修改内容：**
- 将 `.content-tiers` 的布局从纵向平铺改为 Tab 容器
- 添加 `.tier-tabs` 样式：Tab 导航栏样式
- 添加 `.tier-tab` 样式：Tab 按钮样式，包括 active 和 generated 状态
- 添加 `.tier-panel` 样式：Tab 内容面板样式
- 移除原有的 `.tier-card` 平铺布局

**新增样式特性：**
- Tab 支持横向滚动（防止在小屏幕上溢出）
- 生成的内容会在 Tab 上显示绿色圆点标记
- Active Tab 有明显的高亮效果
- 鼠标悬停时的交互反馈

### 2. `/Users/lpp/kol-marketing-agent/public/index.html`
**修改内容：**
- 在右侧物料区添加 Tab 导航栏
- 将原有的 4 个平铺的 `.tier-card` 改为 4 个独立的 `.tier-panel`
- 每个 Tab panel 包含一个完整的 tier-card
- Tab 按钮使用 `data-tier` 属性关联对应的面板

**Tab 结构：**
```html
<div class="tier-tabs">
    <button class="tier-tab tier-tab--active" data-tier="longform">📝 深度长文</button>
    <button class="tier-tab" data-tier="shortvideo">🎬 短视频脚本</button>
    <button class="tier-tab" data-tier="shortcopy">📱 社交文案</button>
    <button class="tier-tab" data-tier="linkedin">💼 LinkedIn</button>
</div>
```

### 3. `/Users/lpp/kol-marketing-agent/src/js/app.js`
**新增方法：**
```javascript
switchTier(tierName) {
    // 更新 tab 状态
    document.querySelectorAll('.tier-tab').forEach(tab => {
        tab.classList.remove('tier-tab--active');
        if (tab.dataset.tier === tierName) {
            tab.classList.add('tier-tab--active');
        }
    });

    // 切换面板
    document.querySelectorAll('.tier-panel').forEach(panel => {
        panel.classList.remove('tier-panel--active');
    });

    const targetPanel = document.getElementById(`panel-${tierName}`);
    if (targetPanel) {
        targetPanel.classList.add('tier-panel--active');
    }
}
```

**修改方法：**
- `enableNextTier()`: 添加了标记当前 tab 为"已生成"状态的功能

## 功能特性

### 1. Tab 切换
- 点击不同 Tab 切换查看不同平台的生成内容
- 同一屏幕只显示一个平台的内容，避免重叠
- 保持清晰的视觉层次

### 2. 状态标记
- **未生成**: Tab 显示默认样式
- **已生成**: Tab 右上角显示绿色圆点
- **当前激活**: Tab 高亮显示

### 3. 响应式设计
- Tab 栏支持横向滚动
- 在小屏幕上自动调整布局
- 保持良好的移动端体验

### 4. 交互反馈
- 鼠标悬停时的视觉反馈
- 点击时的即时切换
- 生成完成后的状态更新

## 使用方式

1. **查看应用**: 访问 http://localhost:8000
2. **切换到播客模式**: 点击顶部导航的 "🎙️ 播客推广" 按钮
3. **查看物料区**: 右侧显示 Tab 切换式的物料生成区域
4. **切换 Tab**: 点击不同的 Tab 查看不同平台的内容
5. **生成内容**: 点击"生成"按钮后，对应的 Tab 会显示"已生成"标记

## 技术亮点

1. **CSS Flexbox**: 使用弹性布局实现 Tab 栏的自适应
2. **数据驱动**: 使用 `data-tier` 属性实现 Tab 与面板的关联
3. **状态管理**: 通过 CSS 类名管理不同的状态（active/generated）
4. **渐进增强**: 保持了原有的生成逻辑，只改进了展示方式

## 测试建议

1. ✅ 点击不同 Tab，确认内容正确切换
2. ✅ 生成内容后，确认 Tab 显示绿色圆点标记
3. ✅ 在小屏幕上测试 Tab 栏的横向滚动
4. ✅ 确认每个 Tab 中的生成按钮功能正常
5. ✅ 测试在不同屏幕尺寸下的响应式布局

## 未来优化方向

1. 添加键盘快捷键支持（如数字键 1-4 快速切换）
2. 支持拖拽排序 Tab
3. 添加 Tab 内容预览（悬停时显示简要信息）
4. 支持批量导出选中的 Tab 内容
5. 添加搜索/过滤功能
