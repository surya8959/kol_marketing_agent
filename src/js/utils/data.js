/**
 * VANZO KOL Agent - 模拟数据
 * 用于快速 Demo 开发
 */

// ========== KOL 数据库（模拟 10M+ 数据） ==========
const mockKOLDs = [
    {
        id: 1,
        name: '@jane_fashion',
        displayName: 'Jane Fashion',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
        platform: 'TikTok',
        followers: 2500000,
        engagement: '8.2%',
        niche: '时尚美妆',
        contentStyle: '高端时尚',
        audience: '18-35岁女性',
        priceRange: '$5000-$10000',
        matchScore: 95
    },
    {
        id: 2,
        name: '@mike_tech',
        displayName: 'Mike Tech Reviews',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
        platform: 'YouTube',
        followers: 1800000,
        engagement: '12.5%',
        niche: '科技测评',
        contentStyle: '专业评测',
        audience: '25-45岁男性',
        priceRange: '$3000-$8000',
        matchScore: 88
    },
    {
        id: 3,
        name: '@cooking_with_sarah',
        displayName: 'Sarah Kitchen',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        platform: 'Instagram',
        followers: 1200000,
        engagement: '6.8%',
        niche: '美食烹饪',
        contentStyle: '轻松教程',
        audience: '25-40岁女性',
        priceRange: '$2000-$5000',
        matchScore: 82
    },
    {
        id: 4,
        name: '@fitness_dan',
        displayName: 'Dan Fitness',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dan',
        platform: 'TikTok',
        followers: 3200000,
        engagement: '9.3%',
        niche: '健身运动',
        contentStyle: '高强度训练',
        audience: '18-35岁男性',
        priceRange: '$4000-$12000',
        matchScore: 90
    },
    {
        id: 5,
        name: '@travel_anna',
        displayName: 'Anna Travels',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
        platform: 'Instagram',
        followers: 980000,
        engagement: '7.5%',
        niche: '旅行探险',
        contentStyle: '奢华旅行',
        audience: '25-45岁男女',
        priceRange: '$3000-$7000',
        matchScore: 85
    },
    {
        id: 6,
        name: '@gamer_pro',
        displayName: 'Pro Gamer Max',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
        platform: 'Twitch',
        followers: 4500000,
        engagement: '15.2%',
        niche: '游戏娱乐',
        contentStyle: '直播游戏',
        audience: '16-30岁男性',
        priceRange: '$6000-$15000',
        matchScore: 78
    },
    {
        id: 7,
        name: '@beauty_lisa',
        displayName: 'Lisa Beauty',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
        platform: 'TikTok',
        followers: 5600000,
        engagement: '10.8%',
        niche: '美妆护肤',
        contentStyle: '教程分享',
        audience: '18-35岁女性',
        priceRange: '$8000-$20000',
        matchScore: 92
    },
    {
        id: 8,
        name: '@tech_startup',
        displayName: 'Startup Insider',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Startup',
        platform: 'LinkedIn',
        followers: 850000,
        engagement: '5.2%',
        niche: '商业科技',
        contentStyle: '商业洞察',
        audience: '28-50岁职场人士',
        priceRange: '$2000-$6000',
        matchScore: 75
    },
    {
        id: 9,
        name: '@pet_lover_emily',
        displayName: 'Emily Pets',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        platform: 'Instagram',
        followers: 2100000,
        engagement: '8.9%',
        niche: '宠物萌宠',
        contentStyle: '萌宠日常',
        audience: '18-45岁女性',
        priceRange: '$3500-$9000',
        matchScore: 87
    },
    {
        id: 10,
        name: '@music_dj_kai',
        displayName: 'DJ Kai',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kai',
        platform: 'TikTok',
        followers: 3800000,
        engagement: '11.5%',
        niche: '音乐舞蹈',
        contentStyle: '电音 remix',
        audience: '16-28岁男女',
        priceRange: '$5000-$12000',
        matchScore: 80
    }
];

// ========== 脚本模板 ==========
const scriptTemplates = {
    TikTok: {
        hook: "Wait, you haven't tried [PRODUCT] yet?",
        content: "I've been using [PRODUCT] for [TIME_PERIOD] and honestly... [PERSONAL_EXPERIENCE]. What really surprised me was [KEY_FEATURE]. [DEMONSTRATION]. If you're [TARGET_AUDIENCE], you need to check this out!",
        cta: "Link in bio! Use code [CODE] for [DISCOUNT]% off. Trust me, [REINFORCEMENT]. #ad #[BRAND] #[CATEGORY]"
    },
    YouTube: {
        hook: "What's up everyone! Today I'm sharing something that's been a total game-changer for me.",
        content: "So I've been testing out [PRODUCT] for the past [TIME_PERIOD], and I have to say... [DETAILED_REVIEW]. Let me break down why I think this is worth it: [BENEFIT_1], [BENEFIT_2], and most importantly [BENEFIT_3]. [DEMONSTRATION].",
        cta: "Check the link below to learn more. I've got a special discount code [CODE] that gets you [DISCOUNT]% off. Let me know in the comments if you've tried it!"
    },
    Instagram: {
        hook: "Found something amazing ✨",
        content: "Been using [PRODUCT] lately and I'm obsessed! 💯 [BENEFIT_STATEMENT]. Perfect for [USE_CASE]. [EMOJIS]",
        cta: "Link in bio 👆 Use my code [CODE] for [DISCOUNT]% off! #ad #sponsored #[BRAND]"
    }
};

// ========== 效果指标数据 ==========
const mockMetrics = {
    impressions: {
        min: 500000,
        max: 5000000,
        average: 2500000
    },
    engagement: {
        min: 3.5,
        max: 12.8,
        average: 6.8
    },
    conversion: {
        min: 1.2,
        max: 5.5,
        average: 2.8
    },
    roi: {
        min: 2.1,
        max: 5.2,
        average: 3.2
    },
    cpc: {
        min: 0.15,
        max: 0.85,
        average: 0.42
    }
};

// ========== 风险评估数据 ==========
const riskFactors = [
    {
        category: '舆情风险',
        level: '低',
        description: 'KOL 历史记录良好，无负面新闻',
        score: 15
    },
    {
        category: '合规风险',
        level: '低',
        description: '内容符合平台广告政策',
        score: 10
    },
    {
        category: '品牌安全',
        level: '中',
        description: '建议审核最终发布内容',
        score: 35
    },
    {
        category: '投放时机',
        level: '低',
        description: '当前为黄金投放期',
        score: 20
    }
];

// ========== Agent 执行日志模板 ==========
const agentLogTemplates = {
    analyzer: [
        "正在分析品牌调性...",
        "识别目标受众画像...",
        "评估市场竞争环境...",
        "生成营销策略建议...",
        "需求分析完成"
    ],
    matcher: [
        "从 KOL 数据库筛选中...",
        "计算粉丝量级匹配度...",
        "评估互动率指标...",
        "分析内容风格契合度...",
        "生成 Top 20 推荐列表"
    ],
    creator: [
        "生成脚本框架...",
        "适配平台特色...",
        "优化 CTA 设计...",
        "预测内容表现...",
        "脚本生成完成"
    ],
    optimizer: [
        "计算 ROI 预估...",
        "生成 A/B 测试方案...",
        "评估投放风险...",
        "优化预算分配...",
        "效果优化完成"
    ]
};

// ========== 导出数据 ==========
export {
    mockKOLDs,
    scriptTemplates,
    mockMetrics,
    riskFactors,
    agentLogTemplates
};
