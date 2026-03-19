# 修复：社交文案生成按钮不可用

## 问题描述
长文生成完成后，社交文案（短文案）的生成按钮仍然显示为禁用状态，无法点击。

## 根本原因
在 `resetTierCards()` 方法中，按钮选择器使用了错误的选择器：
```javascript
const btn = document.querySelector(`#tier-${tier} .btn`); // ❌ 错误
```

但实际的 HTML 结构中，按钮在 `panel` 容器下：
```html
<div class="tier-panel" id="panel-shortcopy">
    <button class="btn ...">生成</button>
</div>
```

正确的选择器应该是：
```javascript
const btn = document.querySelector(`#panel-${tier} .btn`); // ✅ 正确
```

## 修复位置
文件：`/Users/lpp/kol-marketing-agent/src/js/app.js`
方法：`resetTierCards()`
行号：417

## 修复内容
```diff
- const btn = document.querySelector(`#tier-${tier} .btn`);
+ const btn = document.querySelector(`#panel-${tier} .btn`);
```

## 影响范围
这个修复影响了以下功能的按钮状态初始化：
- 短视频脚本生成按钮
- 社交文案生成按钮
- LinkedIn 生成按钮

## 测试步骤
1. 打开应用：http://localhost:8000
2. 切换到"播客推广"模式
3. 添加素材或文案
4. 点击"深度长文"的"生成"按钮
5. 等待生成完成
6. 检查"短视频脚本"、"社交文案"、"LinkedIn"的生成按钮是否已启用

## 预期结果
- ✅ 长文生成完成后，"短视频脚本"按钮应该变为可点击
- ✅ 短视频脚本生成完成后，"社交文案"按钮应该变为可点击
- ✅ 社交文案生成完成后，"LinkedIn"按钮应该变为可点击
- ✅ 所有按钮在启用时应该从灰色（btn--secondary）变为蓝色（btn--accent）

## 调试信息
添加了以下调试日志来帮助诊断问题：
- `enableNextTier()` 方法中的详细日志
- `finishGenerating()` 方法中的状态跟踪
- 按钮查找和状态变更的确认

打开浏览器控制台可以看到详细的执行过程。
