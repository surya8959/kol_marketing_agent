/**
 * VANZO KOL Agent - 工具函数库
 */

/**
 * 生成唯一 ID
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 格式化数字（K/M 后缀）
 */
export function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

/**
 * 格式化货币
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

/**
 * 延迟执行
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 随机选择数组元素
 */
export function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 随机范围整数
 */
export function randomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 防抖函数
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 节流函数
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 深拷贝对象
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 计算匹配分数
 */
export function calculateMatchScore(brand, kol) {
    let score = 50; // 基础分

    // 粉丝量匹配（30分）
    if (kol.followers >= 1000000) score += 30;
    else if (kol.followers >= 500000) score += 25;
    else if (kol.followers >= 100000) score += 20;

    // 互动率匹配（25分）
    const engagement = parseFloat(kol.engagement);
    if (engagement >= 10) score += 25;
    else if (engagement >= 7) score += 20;
    else if (engagement >= 5) score += 15;

    // 内容风格匹配（20分）
    if (brand.niche && kol.niche.includes(brand.niche)) {
        score += 20;
    }

    // 受众匹配（15分）
    if (brand.targetAudience && kol.audience.includes(brand.targetAudience)) {
        score += 15;
    }

    return Math.min(score, 100);
}

/**
 * 筛选 KOL
 */
export function filterKOLs(kols, criteria) {
    return kols.filter(kol => {
        // 平台筛选
        if (criteria.platform && kol.platform !== criteria.platform) {
            return false;
        }

        // 粉丝量筛选
        if (criteria.minFollowers && kol.followers < criteria.minFollowers) {
            return false;
        }

        // 互动率筛选
        if (criteria.minEngagement && parseFloat(kol.engagement) < criteria.minEngagement) {
            return false;
        }

        // 预算筛选
        if (criteria.maxBudget) {
            const priceRange = kol.priceRange.replace(/\$/g, '').split('-');
            const minPrice = parseInt(priceRange[0]);
            if (minPrice > criteria.maxBudget) {
                return false;
            }
        }

        return true;
    });
}

/**
 * 排序 KOL
 */
export function sortKOLs(kols, sortBy = 'matchScore') {
    return [...kols].sort((a, b) => {
        switch (sortBy) {
            case 'followers':
                return b.followers - a.followers;
            case 'engagement':
                return parseFloat(b.engagement) - parseFloat(a.engagement);
            case 'price':
                const priceA = parseInt(a.priceRange.split('-')[0].replace(/\$/g, ''));
                const priceB = parseInt(b.priceRange.split('-')[0].replace(/\$/g, ''));
                return priceA - priceB;
            case 'matchScore':
            default:
                return b.matchScore - a.matchScore;
        }
    });
}

/**
 * 生成脚本
 */
export function generateScript(platform, brand, kol) {
    const template = scriptTemplates[platform];
    if (!template) return null;

    return template.hook + '\n\n' +
           template.content
               .replace('[PRODUCT]', brand.product)
               .replace('[TIME_PERIOD]', 'the past 2 weeks')
               .replace('[KEY_FEATURE]', 'the quality is insane')
               .replace('[TARGET_AUDIENCE]', 'looking for quality')
           + '\n\n' +
           template.cta
               .replace('[CODE]', 'VANZO20')
               .replace('[DISCOUNT]', '20')
               .replace('[BRAND]', brand.name)
               .replace('[CATEGORY]', brand.niche || 'product');
}

/**
 * 预测效果
 */
export function predictPerformance(kol, budget) {
    const followers = kol.followers;
    const engagement = parseFloat(kol.engagement) / 100;

    return {
        impressions: Math.floor(followers * randomRange(2, 5)),
        engagement: Math.floor(followers * engagement * randomRange(3, 8)),
        conversion: Math.floor(followers * engagement * 0.02 * randomRange(1, 3)),
        roi: (randomRange(20, 50) / 10).toFixed(1),
        cpc: (randomRange(15, 85) / 100).toFixed(2)
    };
}

/**
 * 计算风险评分
 */
export function calculateRiskScore(kol) {
    let score = 0;
    let factors = [];

    // 基于互动率的风险
    const engagement = parseFloat(kol.engagement);
    if (engagement < 5) {
        score += 20;
        factors.push('互动率偏低');
    }

    // 基于粉丝量的风险
    if (kol.followers < 100000) {
        score += 10;
        factors.push('粉丝量较小');
    }

    // 基于价格的风险
    const priceRange = kol.priceRange.replace(/\$/g, '').split('-');
    const maxPrice = parseInt(priceRange[1]);
    if (maxPrice > 15000) {
        score += 15;
        factors.push('单次合作成本高');
    }

    return {
        score: Math.min(score, 100),
        level: score > 50 ? '高' : score > 25 ? '中' : '低',
        factors
    };
}

/**
 * 格式化日期
 */
export function formatDate(date) {
    return new Intl.DateTimeFormat('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(date);
}

/**
 * 本地存储工具
 */
export const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (e) {
            console.error('存储失败:', e);
        }
    },

    get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (e) {
            console.error('读取失败:', e);
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('删除失败:', e);
        }
    }
};
