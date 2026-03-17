/**
 * VANZO KOL Agent - 播客内容再利用 Agent (金字塔式分级生成)
 * Content Repurpose Agent - Pyramid Strategy
 *
 * 输入：播客文案稿件 / 长文
 * 输出：
 *   Level 1: 深度长文（公众号/博客）
 *   Level 2: 短视频脚本（3-5条）
 *   Level 3: 短文案（10-20条，分类型）
 *   Level 4: LinkedIn专业帖 + 海报文案
 */

// ========== 金字塔内容层级配置 ==========
const CONTENT_TIERS = {
    // Level 1: 深度长文
    longForm: {
        name: '深度长文',
        icon: '📝',
        description: '公众号 / 博客文章',
        platforms: ['公众号', '博客', 'Medium'],
        style: '深度、完整、有结构、阅读友好',
        structure: '引入 → 背景 → 核心观点 × 3 → 案例 → 总结 → 行动号召',
        wordCount: '2000-5000字',
        priority: 1
    },

    // Level 2: 短视频脚本
    shortVideo: {
        name: '短视频脚本',
        icon: '🎬',
        description: '抖音/视频号口播文案',
        platforms: ['抖音', '视频号', 'TikTok', 'YouTube Shorts'],
        count: '3-5条',
        duration: '30-60秒/条',
        style: '口语化、带情绪、有反转',
        structure: 'Hook(3秒) → 核心观点(45秒) → CTA(12秒)',
        priority: 2
    },

    // Level 3: 短文案（分类型）
    shortCopy: {
        name: '短文案',
        icon: '💬',
        description: '朋友圈/微博/X 推文',
        platforms: ['朋友圈', '微博', 'Twitter/X'],
        count: '10-20条',
        categories: [
            { name: '金句型', icon: '💎', count: 3-5, style: '一句话让人记住' },
            { name: '痛点型', icon: '😣', count: 2-3, style: '戳中用户痛点' },
            { name: '反直觉型', icon: '🤔', count: 2-3, style: '颠覆认知' },
            { name: '干货型', icon: '📚', count: 2-3, style: '有实用价值' },
            { name: '故事型', icon: '📖', count: 2-3, style: '引发共鸣' }
        ],
        length: '50-200字',
        priority: 3
    },

    // Level 4: LinkedIn + 海报
    linkedin: {
        name: 'LinkedIn专业帖',
        icon: '💼',
        description: '领英专业文章 + 海报文案',
        platforms: ['LinkedIn', '脉脉'],
        style: '专业深度、行业洞察、职业价值',
        structure: '背景引入 → 核心洞察 → 案例支撑 → 总结行动',
        elements: ['文章', '海报文案'],
        priority: 4
    }
};

// ========== Prompt 模板 ==========
const PROMPT_TEMPLATES = {
    // Level 1: 深度长文
    longForm: (input) => `
请根据以下播客内容，生成一篇公众号/博客深度长文。

## 原始播客内容
${input.content.substring(0, 4000)}

## 播客信息
- 标题：${input.title || '未知'}
- 节目：${input.podcastName || '未知'}
- 主题：${input.topic || '未知'}

## 核心要求

### 一、流量爆款分析（先分析，再写作）
在正式写作前，先分析这段内容的爆款潜力：
- 最能触动大众神经的点是哪个？
- 有什么反直觉的观点？
- 有什么引发争议或讨论的潜力？
- 普通人最关心的痛点是什么？

### 二、标题优化
生成 3 个可选标题（用换行分隔）：
- 标题要简洁有力，能引发好奇或共鸣
- 可以用数字、悬念、对比、反差
- 避免太官方、太教科书的感觉
- 参考爆款标题风格："原来 XX 才是最重要的"、"关于 XX，我后悔知道太晚"

### 三、长文内容要求
1. 字数：1500-2500字（精炼为主）
2. 风格：像真人写的，有温度，有观点，有态度
3. 结构要自然，不要太死板的"第一点、第二点、第三点"
4. 多用故事、例子、亲身经历来佐证观点
5. 适当留悬念，引导读者往下读
6. 结尾一定要引导收听完整播客！

### 四、必须包含 Show Notes
在文章末尾，用简洁的格式列出：
- 00:00 - 开场
- XX:XX - 章节标题
- [提到的工具/资源/书籍]
- 完整播客链接

### 五、配图提示词（额外生成）
为文章生成 3 个配图描述（用于 AI 生成配图或找图）：
- 描述要简洁，30 字以内
- 风格统一

### 六、输出格式
【标题】（3选1）

【文章正文】

——

Show Notes：
- 时间戳列表
- 提到的资源
- 收听方式

【配图提示词】
1. xxx
2. xxx
3. xxx

请直接输出完整内容。
`,

    // Level 2: 短视频脚本（3-5条）
    shortVideo: (input, longFormContent) => `
请根据以下长文内容，生成 3-5 条短视频口播脚本：

## 长文内容
${longFormContent.substring(0, 2000)}

## 要求
1. 数量：5条
2. 每条时长：30-60秒
3. 每条要有不同的切入角度/话题点
4. 风格：口语化、带情绪、有反转
5. 结构：Hook(3秒) → 核心观点(45秒) → CTA(12秒)
6. 每条脚本包含：
   - 开场白（抓住注意力）
   - 核心内容（视频主体）
   - CTA（引导互动）
   - 字幕建议
   - 话题标签

请按编号输出每条脚本。
`,

    // Level 3: 短文案（分类型）
    shortCopy: (input, longFormContent) => `
请根据以下内容，生成分类型的短文案（朋友圈/微博/X）：

## 长文内容
${longFormContent.substring(0, 1500)}

## 要求
1. 总数：15条（按以下类型分配）
2. 每条长度：50-200字

### 类型分配：
- 💎 金句型（4条）：一句话让人记住，有传播力
- 😣 痛点型（3条）：戳中用户痛点，引发共鸣
- 🤔 反直觉型（3条）：颠覆认知，引发讨论
- 📚 干货型（3条）：有实用价值，便于收藏
- 📖 故事型（2条）：引发共鸣，有画面感

3. 风格：口语化、带情绪、直接
4. 可适当使用 emoji
5. 结尾可带互动引导

请按类型分组输出。
`,

    // Level 4: LinkedIn + 海报
    linkedin: (input, longFormContent) => `
请根据以下内容，生成 LinkedIn 专业文章和海报文案：

## 长文内容
${longFormContent.substring(0, 1500)}

## 要求

### Part 1: LinkedIn 文章
1. 风格：专业深度、行业洞察、职业价值
2. 字数：800-1500字
3. 结构：背景引入 → 核心洞察 → 案例支撑 → 总结行动
4. 体现职业性，可加入个人经历

### Part 2: 海报文案（3条）
1. 适合朋友圈/LinkedIn 海报配文
2. 每条：10-30字
3. 要有视觉冲击力
4. 可搭配简单图形设计

请分别输出文章和海报文案。
`
};

// ========== 工具函数 ==========
const ContentUtils = {
    // 提取关键信息
    extractKeyInfo(content) {
        const lines = content.split('\n').filter(l => l.trim());
        const words = content.split(/\s+/);
        const sentences = content.split(/[。！？\n]/).filter(s => s.trim());

        return {
            totalLines: lines.length,
            totalWords: words.length,
            totalSentences: sentences.length,
            estimatedReadTime: Math.ceil(words.length / 200),
            possibleTitle: lines[0] || '未命名内容',
            keywords: this.extractKeywords(content),
            goldenQuotes: this.extractGoldenQuotes(content)
        };
    },

    // 提取关键词
    extractKeywords(text) {
        const commonWords = ['的', '了', '是', '在', '和', '有', '我', '你', '他', '她', '它', '这', '那', '都', '也', '就', '说', '要', '会', '可以', '这个', '那个', '什么', '怎么', '为什么', '一个', '我们', '他们', '自己', '没有', '但是', '因为', '所以', '如果', '虽然', '还是', '然后', '这样', '那样', '其实'];

        const words = text.toLowerCase().split(/[\s,，.。!！?？、:：]+/).filter(w => w.length > 2);
        const wordCount = {};

        words.forEach(word => {
            if (!commonWords.includes(word)) {
                wordCount[word] = (wordCount[word] || 0) + 1;
            }
        });

        return Object.entries(wordCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 15)
            .map(([word]) => word);
    },

    // 提取金句
    extractGoldenQuotes(text, count = 5) {
        const sentences = text.split(/[。！？\n]/).filter(s => s.trim());
        const quotes = sentences
            .filter(s => s.length > 8 && s.length < 100)
            .filter(s => /[！!?～~]/.test(s) || /认为|相信|觉得|发现|其实/.test(s));

        if (quotes.length < count) {
            return sentences.filter(s => s.length > 10 && s.length < 80).slice(0, count);
        }

        return quotes.slice(0, count);
    }
};

// ========== 模拟数据生成 ==========
const MOCK_CONTENT = {
    // 模拟深度长文
    longForm: (input) => {
        const title = `深度长文：${input.topic || input.title || '一篇让你重新思考的文章'}`;
        return `【${title}】

${input.podcastName || '深度对话'} | 作者：${input.author || '原创作者'}

---

💡 开篇引入

大家好，今天想和大家聊聊一个我思考了很久的话题。

最近${input.topic || '这个话题'}特别火，身边很多人都在讨论。但我发现，大多数人的理解其实停留在表面。今天，我想带你深入了解一下。

---

📚 背景分析

在开始之前，我们先来看看背景。

${input.topic || '这个话题'}之所以重要，是因为它直接影响到我们每个人的生活。不管你是创业者、职场人，还是自由职业者，都无法置身事外。

我花了大量时间研究，也和很多行业专家深入交流，今天把我的思考毫无保留地分享给大家。

---

💎 核心观点一：认知差才是最大的差距

很多人以为自己和成功者的差距是资源、人脉、资金。但实际上，最大的差距是认知。

当你还在用旧思维解决问题时，强者已经在用全新的视角重构问题了。这就是为什么同样一件事，不同的人做，效果完全不同。

举个例子...

---

💎 核心观点二：选择比努力更重要

这句话已经被说烂了，但我今天想给它一个新的解读。

选择不是一次性的，而是持续的。不是说你在某个关键时刻做了一个选择，然后就一劳永逸了。而是每个阶段，你都要问自己：现在的选择，还是对的吗？

很多人犯的错误是：用战术上的勤奋，掩盖战略上的懒惰。

---

💎 核心观点三：成长是反人性的

这是最扎心但也最真实的一点。

真正的成长，往往是反直觉的。你感觉舒服的时候，通常是在原地踏步。你感觉痛苦的时候，才是在爬坡。

所以，如果你在做一件正确的事，但感觉很难受——恭喜你，你在成长。

---

📖 案例分享

说到这儿，我想分享一个真实的故事...

（此处应有案例）

这个案例告诉我们...

---

🎯 总结与行动

今天聊了三个核心观点：

1. 认知差才是最大的差距
2. 选择比努力更重要
3. 成长是反人性的

那么，具体怎么做？我给你三个建议：

✅ 每周花2小时，主动学习一个新领域的知识
✅ 每月做一次人生复盘，问自己：现在的选择还对吗？
✅ 给自己找一个成长伙伴，互相监督、互相鼓励

---

📱 行动号召

如果这篇文章对你有启发，欢迎点赞、评论、转发。

也欢迎关注我，我会持续分享更多深度思考。

我们下期再见！

---

#${input.topic || '深度思考'} #成长 #认知 #干货分享`;
    },

    // 模拟短视频脚本
    shortVideo: (input, longFormContent) => {
        return `【脚本 1：反直觉开场】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎬 主题：认知差才是最大的差距

📱 时长：45秒

【开场Hook - 3秒】
"大多数人努力一辈子，都不如别人用对方法干一年。"

【核心内容】
你知道为什么吗？
不是因为你不努力，不是因为你不够聪明。
而是因为——你的认知本身就错了。

当你用旧时代的思维，解决新时代的问题。
你会发现：越努力，越迷茫。

【CTA】
"想知道如何提升认知？点个关注，下期告诉你。"

【字幕】关键句放大显示
【BGM】节奏感背景音乐
#认知 #成长 #干货`;
    },

    // 模拟短文案
    shortCopy: (input) => {
        return `┌─────────────────────────────────┐
│     💎 金句型（4条）            │
├─────────────────────────────────┤

1. "人和人的差距，不是努力决定的，是认知。"
2. "选择对了，努力才有意义。"
3. "舒服的时候，通常是在退步。"
4. "你能赚到的钱，等于你解决问题的价值。"

┌─────────────────────────────────┐
│     😣 痛点型（3条）            │
├─────────────────────────────────┤

1. "你是不是也这样？每天忙得要死，但年底一看好像什么都没完成。"
2. "为什么看了那么多干货，依然过不好这一生？"
3. "别人都已经起飞了，你还在原地踏步。"

┌─────────────────────────────────┐
│     🤔 反直觉型（3条）          │
├─────────────────────────────────┤

1. "其实，你不需要更努力，只需要更聪明。"
2. "成功的人，往往不是最拼的那个。"
3. "最好的投资，是投资自己的大脑。"

┌─────────────────────────────────┐
│     📚 干货型（3条）            │
├─────────────────────────────────┤

1. "分享3个提升认知的方法：①大量输入 ②跨界思考 ③输出倒逼输入"
2. "每周花2小时做这件事，超过90%的人"
3. "一个人进步的最好方式：找到一个学习标杆，然后模仿他"

┌─────────────────────────────────┐
│     📖 故事型（2条）            │
├─────────────────────────────────┤

1. "我有个朋友，之前月薪5万，今年自己创业，现在..."
2. "三个月前，我还是个普通人，直到..."`;
    },

    // 模拟 LinkedIn
    linkedin: (input) => {
        return `┌─────────────────────────────────┐
│     LinkedIn 文章               │
├─────────────────────────────────┤

【标题】
${input.topic || '深度思考'}: 我花了3年才明白的3个道理

【正文】
最近很多人问我：你是怎么快速成长的？

说实话，我花了3年才明白这3件事，希望你不需要花那么久...

[文章内容详见长文]

#${input.topic || '深度思考'} #职业发展 #成长`;

    }
};

// ========== 金字塔内容生成 Agent ==========
class PyramidContentAgent {
    constructor() {
        this.status = 'idle';
        this.progress = 0;
        this.currentTier = null;
    }

    // 主入口：金字塔式分级生成
    async generateAll(input) {
        this.status = 'running';
        this.progress = 0;

        // 提取关键信息
        const contentInfo = {
            ...input,
            ...ContentUtils.extractKeyInfo(input.content || input.longFormContent || '')
        };

        const results = {
            longForm: null,      // Level 1: 深度长文
            shortVideo: null,    // Level 2: 短视频脚本
            shortCopy: null,    // Level 3: 短文案
            linkedin: null      // Level 4: LinkedIn
        };

        // ===== Level 1: 生成深度长文 =====
        this.currentTier = 'longForm';
        this.progress = 10;
        this.emit('progress', { tier: 'longForm', progress: 10, message: '正在生成深度长文...' });

        try {
            results.longForm = await this.generateLongForm(input);
        } catch (e) {
            results.longForm = { error: e.message };
        }

        this.progress = 30;
        this.emit('progress', { tier: 'longForm', progress: 30, message: '长文生成完成' });

        // ===== Level 2: 生成短视频脚本 =====
        this.currentTier = 'shortVideo';
        this.emit('progress', { tier: 'shortVideo', progress: 35, message: '正在拆解短视频脚本...' });

        try {
            results.shortVideo = await this.generateShortVideo(input, results.longForm?.content || '');
        } catch (e) {
            results.shortVideo = { error: e.message };
        }

        this.progress = 55;
        this.emit('progress', { tier: 'shortVideo', progress: 55, message: '短视频脚本生成完成' });

        // ===== Level 3: 生成短文案 =====
        this.currentTier = 'shortCopy';
        this.emit('progress', { tier: 'shortCopy', progress: 60, message: '正在批量生成短文案...' });

        try {
            results.shortCopy = await this.generateShortCopy(input, results.longForm?.content || '');
        } catch (e) {
            results.shortCopy = { error: e.message };
        }

        this.progress = 80;
        this.emit('progress', { tier: 'shortCopy', progress: 80, message: '短文案生成完成' });

        // ===== Level 4: 生成 LinkedIn =====
        this.currentTier = 'linkedin';
        this.emit('progress', { tier: 'linkedin', progress: 85, message: '正在生成 LinkedIn 内容...' });

        try {
            results.linkedin = await this.generateLinkedIn(input, results.longForm?.content || '');
        } catch (e) {
            results.linkedin = { error: e.message };
        }

        this.progress = 100;
        this.emit('progress', { tier: 'linkedin', progress: 100, message: '全部内容生成完成！' });

        this.status = 'completed';

        return {
            contentInfo,
            results,
            summary: this.generateSummary(results)
        };
    }

    // 生成深度长文
    async generateLongForm(input) {
        if (this.hasAPI()) {
            const prompt = PROMPT_TEMPLATES.longForm(input);
            const content = await this.callClaude(prompt);
            return {
                type: 'longForm',
                title: this.extractTitle(content),
                content: content,
                wordCount: content.length,
                platform: '公众号/博客'
            };
        }
        // 模拟数据
        return {
            type: 'longForm',
            title: `深度长文：${input.topic || input.title || '一篇让你重新思考的文章'}`,
            content: MOCK_CONTENT.longForm(input),
            wordCount: MOCK_CONTENT.longForm(input).length,
            platform: '公众号/博客'
        };
    }

    // 生成短视频脚本
    async generateShortVideo(input, longFormContent) {
        if (this.hasAPI()) {
            const prompt = PROMPT_TEMPLATES.shortVideo(input, longFormContent);
            const content = await this.callClaude(prompt);
            return {
                type: 'shortVideo',
                count: 5,
                scripts: this.parseVideoScripts(content),
                duration: '30-60秒/条'
            };
        }
        // 模拟数据
        return {
            type: 'shortVideo',
            count: 5,
            scripts: this.getMockVideoScripts(),
            duration: '30-60秒/条'
        };
    }

    // 生成短文案
    async generateShortCopy(input, longFormContent) {
        if (this.hasAPI()) {
            const prompt = PROMPT_TEMPLATES.shortCopy(input, longFormContent);
            const content = await this.callClaude(prompt);
            return {
                type: 'shortCopy',
                categories: this.parseShortCopy(content),
                totalCount: 15
            };
        }
        // 模拟数据
        return {
            type: 'shortCopy',
            categories: this.getMockShortCopy(),
            totalCount: 15
        };
    }

    // 生成 LinkedIn
    async generateLinkedIn(input, longFormContent) {
        if (this.hasAPI()) {
            const prompt = PROMPT_TEMPLATES.linkedin(input, longFormContent);
            const content = await this.callClaude(prompt);
            return {
                type: 'linkedin',
                article: this.extractLinkedInArticle(content),
                posters: this.extractPosters(content),
                platforms: ['LinkedIn', '脉脉']
            };
        }
        // 模拟数据
        return {
            type: 'linkedin',
            article: MOCK_CONTENT.linkedin(input),
            posters: this.getMockPosters(),
            platforms: ['LinkedIn', '脉脉']
        };
    }

    // 解析视频脚本
    parseVideoScripts(content) {
        // 简单解析，按编号分割
        const scripts = content.split(/【脚本?\s*\d+[：:]/).filter(s => s.trim());
        return scripts.map((s, i) => ({
            id: i + 1,
            content: s.trim()
        })).slice(0, 5);
    }

    // 解析短文案
    parseShortCopy(content) {
        return [
            { name: '金句型', icon: '💎', items: ['金句1', '金句2', '金句3', '金句4'] },
            { name: '痛点型', icon: '😣', items: ['痛点1', '痛点2', '痛点3'] },
            { name: '反直觉型', icon: '🤔', items: ['反直觉1', '反直觉2', '反直觉3'] },
            { name: '干货型', icon: '📚', items: ['干货1', '干货2', '干货3'] },
            { name: '故事型', icon: '📖', items: ['故事1', '故事2'] }
        ];
    }

    // 获取模拟视频脚本
    getMockVideoScripts() {
        return [
            {
                id: 1,
                title: '认知差才是最大的差距',
                hook: '"大多数人努力一辈子，都不如别人用对方法干一年。"',
                content: '你知道为什么吗？不是因为你不努力，而是因为你的认知本身就错了。',
                cta: '想知道如何提升认知？点个关注！',
                duration: '45秒'
            },
            {
                id: 2,
                title: '选择比努力更重要',
                hook: '"选择不是一次性的，是持续的。"',
                content: '很多人用战术上的勤奋，掩盖战略上的懒惰。',
                cta: '你最近做的选择还对吗？评论区告诉我',
                duration: '40秒'
            },
            {
                id: 3,
                title: '成长是反人性的',
                hook: '"舒服的时候，通常是在退步。"',
                content: '感觉难的时候，说明你在爬坡。',
                cta: '认同的点赞！',
                duration: '30秒'
            },
            {
                id: 4,
                title: '如何快速提升认知',
                hook: '"提升认知最快的方式，不是看书，是找人聊。"',
                content: '三人行必有我师，找对人更重要。',
                cta: '下期讲具体方法',
                duration: '35秒'
            },
            {
                id: 5,
                title: '行动才是答案',
                hook: '"想，都是问题。做，才是答案。"',
                content: '不要等到完美才开始，先完成再完美。',
                cta: '从评论区开始行动',
                duration: '30秒'
            }
        ];
    }

    // 获取模拟短文案
    getMockShortCopy() {
        return [
            { name: '金句型', icon: '💎', items: [
                '人和人的差距，不是努力决定的，是认知。',
                '选择对了，努力才有意义。',
                '舒服的时候，通常是在退步。',
                '你能赚到的钱，等于你解决问题的价值。'
            ]},
            { name: '痛点型', icon: '😣', items: [
                '你是不是也这样？每天忙得要死，但年底一看好像什么都没完成。',
                '为什么看了那么多干货，依然过不好这一生？',
                '别人都已经起飞了，你还在原地踏步。'
            ]},
            { name: '反直觉型', icon: '🤔', items: [
                '其实，你不需要更努力，只需要更聪明。',
                '成功的人，往往不是最拼的那个。',
                '最好的投资，是投资自己的大脑。'
            ]},
            { name: '干货型', icon: '📚', items: [
                '分享3个提升认知的方法：①大量输入 ②跨界思考 ③输出倒逼输入',
                '每周花2小时做这件事，超过90%的人',
                '一个人进步的最好方式：找到一个学习标杆，然后模仿他'
            ]},
            { name: '故事型', icon: '📖', items: [
                '我有个朋友，之前月薪5万，今年自己创业，现在...',
                '三个月前，我还是个普通人，直到...'
            ]}
        ];
    }

    // 获取模拟海报文案
    getMockPosters() {
        return [
            '认知差 = 财富差',
            '选择 > 努力',
            '成长 = 痛苦 + 坚持'
        ];
    }

    // 提取标题
    extractTitle(content) {
        const match = content.match(/【?([^】\n]+)】?/);
        return match ? match[1] : '深度长文';
    }

    // 提取 LinkedIn 文章
    extractLinkedInArticle(content) {
        return content;
    }

    // 提取海报文案
    extractPosters(content) {
        return ['海报文案1', '海报文案2', '海报文案3'];
    }

    // 生成总结
    generateSummary(results) {
        return {
            longForm: results.longForm?.content ? `${results.longForm.content.length} 字` : '未生成',
            shortVideo: results.shortVideo?.count ? `${results.shortVideo.count} 条` : '未生成',
            shortCopy: results.shortCopy?.totalCount ? `${results.shortCopy.totalCount} 条` : '未生成',
            linkedin: results.linkedin?.article ? '已生成' : '未生成',
            totalContentPieces: (results.longForm ? 1 : 0) + (results.shortVideo?.count || 0) + (results.shortCopy?.totalCount || 0) + (results.linkedin?.article ? 2 : 0)
        };
    }

    // 检查是否有 API
    hasAPI() {
        const apiKey = window.CLAUDE_API_KEY || window.APP_CONFIG?.claude?.apiKey;
        return apiKey && apiKey.length > 0;
    }

    // 调用 Claude API
    async callClaude(prompt) {
        const apiKey = window.CLAUDE_API_KEY || window.APP_CONFIG?.claude?.apiKey;
        const baseUrl = window.APP_CONFIG?.claude?.baseUrl || '';
        const model = window.APP_CONFIG?.claude?.model || 'claude-sonnet-4-20250514';

        console.log('🤖 调用 Claude API...');
        console.log('📡 Base URL:', baseUrl);

        // 使用自定义 Base URL 或默认官方 API
        let apiUrl;
        let useProxy = false;
        if (baseUrl) {
            apiUrl = `${baseUrl}/v1/messages`;
        } else {
            apiUrl = 'https://api.anthropic.com/v1/messages';
            useProxy = true;
        }

        // 如果使用代理（官方 API 或需要代理时）
        const fetchUrl = useProxy ? 'https://corsproxy.io/?' + encodeURIComponent(apiUrl) : apiUrl;
        console.log('🌐 请求 URL:', fetchUrl);

        try {
            const response = await fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': apiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: model,
                    max_tokens: 4000,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API 错误:', response.status, errorText);
                throw new Error(`API Error ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ API 调用成功');
            return data.content[0].text;
        } catch (error) {
            console.error('❌ 调用失败:', error);
            throw error;
        }
    }

    // 事件处理
    onProgress(callback) {
        this.progressCallback = callback;
    }

    emit(event, data) {
        if (this.progressCallback) {
            this.progressCallback(event, data);
        }
    }
}

// ========== 导出 ==========
const PyramidContentAgentInstance = new PyramidContentAgent();

export {
    PyramidContentAgent,
    PyramidContentAgentInstance,
    CONTENT_TIERS,
    ContentUtils,
    PROMPT_TEMPLATES
};
