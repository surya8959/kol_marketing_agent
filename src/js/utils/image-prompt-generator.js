/**
 * 图片 Prompt 生成器
 * 遵循专业的图片生成规则，专注于极简、留白、高级感的设计风格
 */

export class ImagePromptGenerator {
    /**
     * 生成金句卡片图片 Prompt
     * @param {string} quote - 金句文案（中文）
     * @param {string} style - 设计风格（minimalist|magazine|gradient）
     * @returns {string} AI 图片生成 Prompt
     */
    static generateGoldenQuoteCard(quote, style = 'minimalist') {
        const styles = {
            minimalist: this._getMinimalistPrompt(),
            magazine: this._getMagazinePrompt(),
            gradient: this._getGradientPrompt()
        };

        return styles[style] || styles.minimalist;
    }

    /**
     * 极简留白风格（高级感）
     */
    static _getMinimalistPrompt() {
        return `generous negative space, minimalist composition, off-center text placement, Swiss International Style, Japanese Zen Aesthetic, editorial design, high-end gallery poster, monochromatic color palette, black text on off-white background, thin clean lines, geometric shapes --no clutter, shapes, gradients, complex patterns, watermark, signature, text`;
    }

    /**
     * 杂志风格（时尚感）
     */
    static _getMagazinePrompt() {
        return `asymmetrical layout, layered text, overlapping elements, editorial magazine design, fashion editorial, modern typography, bold accent colors on neutral base, high contrast, simple graphic elements, ruled lines, page numbers --no clutter, messy layout, low contrast`;
    }

    /**
     * 渐变高级风格（质感）
     */
    static _getGradientPrompt() {
        return `centered minimalist, generous breathing room, premium gradient design, luxury brand aesthetic, clean modern, subtle gradient background (2-3 colors max), white text, minimal geometric accents, thin borders --no harsh gradients, busy patterns, low contrast`;
    }

    /**
     * 生成封面图 Prompt
     * @param {string} theme - 主题描述
     * @param {string} mood - 情绪基调（professional|energetic|calm）
     */
    static generateCoverImage(theme, mood = 'professional') {
        const moodStyles = {
            professional: `clean professional, corporate minimalist, executive summary aesthetic, navy blue and white, structured layout, high-end business presentation`,
            energetic: `bold energetic, vibrant colors, dynamic composition, urban street style, pop art influence, high saturation, youth culture aesthetic`,
            calm: `serene calm, zen minimalist, soft natural tones, japanese aesthetic, peaceful atmosphere, muted color palette, breathing room, meditation inspired`
        };

        return `${moodStyles[mood]}, ${theme}, high quality photography, editorial design --no clutter, watermark, low resolution, text overlay`;
    }

    /**
     * 生成干货清单配图 Prompt
     * @param {number} itemCount - 清单项数量
     * @param {string} topic - 主题
     */
    static generateChecklistImage(itemCount, topic) {
        return `infographic design, numbered list layout, ${itemCount} items, clean vector illustration, flat design, organized information hierarchy, professional chart style, data visualization, ${topic}, modern UI elements --no clutter, messy layout, low contrast`;
    }

    /**
     * 根据中文文案生成完整的图片 Prompt
     * @param {string} chineseText - 中文文案
     * @param {string} style - 风格
     * @returns {object} 包含 Prompt 和建议的文案排版
     */
    static generateCompleteImageSpec(chineseText, style = 'minimalist') {
        return {
            prompt: this.generateGoldenQuoteCard(chineseText, style),
            chineseText: chineseText,
            style: style,
            suggestions: {
                layout: style === 'minimalist' ? '文字偏离中心，大量留白' :
                       style === 'magazine' ? '非对称布局，层次分明' :
                       '居中极简，呼吸感强',
                color: style === 'minimalist' ? '单色调，灰白底黑字' :
                        style === 'magazine' ? '大胆强调色，中性底' :
                        '微妙渐变，白色文字',
                mood: style === 'minimalist' ? '高级、冷静、专业' :
                       style === 'magazine' ? '时尚、活力、现代' :
                       '质感、高级、优雅'
            }
        };
    }

    /**
     * 批量生成多个风格的 Prompt
     * @param {string} quote - 金句文案
     * @returns {Array} 多个风格的完整规格
     */
    static generateMultipleStyles(quote) {
        const styles = ['minimalist', 'magazine', 'gradient'];
        return styles.map(style => this.generateCompleteImageSpec(quote, style));
    }

    /**
     * 生成短视频背景 Prompt
     * @param {string} type - 背景类型（solid|gradient|dynamic）
     */
    static generateVideoBackground(type = 'solid') {
        const backgrounds = {
            solid: `pure solid color background, minimalist, clean flat color, no texture, no pattern --no gradient, clutter, watermark`,
            gradient: `subtle two-color gradient, smooth transition, premium aesthetic, modern tech style, clean backdrop --no harsh gradient, busy pattern`,
            dynamic: `subtle animated gradient background, slow morphing colors, abstract flowing shapes, ambient lighting, calm atmosphere --no busy pattern, harsh colors, flicker`
        };

        return backgrounds[type] || backgrounds.solid;
    }

    /**
     * 验证 Prompt 质量
     * @param {string} prompt - 待验证的 Prompt
     * @returns {object} 验证结果和建议
     */
    static validatePrompt(prompt) {
        const issues = [];
        const suggestions = [];

        // 检查是否包含必要的构图关键词
        const requiredKeywords = ['negative space', 'composition'];
        const hasRequiredKeywords = requiredKeywords.some(kw =>
            prompt.toLowerCase().includes(kw.toLowerCase())
        );

        if (!hasRequiredKeywords) {
            issues.push('缺少必要的构图关键词（如 negative space, composition）');
            suggestions.push('添加 "generous negative space" 或 "minimalist composition"');
        }

        // 检查是否包含负向约束
        const hasNegativeConstraints = prompt.includes('--no');
        if (!hasNegativeConstraints) {
            issues.push('缺少负向约束（--no ...）');
            suggestions.push('添加 "--no clutter, watermark, text" 等负向约束');
        }

        // 检查是否引用设计风格
        const designStyles = ['Swiss', 'Japanese', 'minimalist', 'editorial'];
        const hasDesignStyle = designStyles.some(style =>
            prompt.toLowerCase().includes(style.toLowerCase())
        );

        if (!hasDesignStyle) {
            suggestions.push('考虑添加 "Swiss International Style" 或 "Japanese Zen Aesthetic" 等设计风格');
        }

        return {
            isValid: issues.length === 0,
            issues,
            suggestions,
            quality: issues.length === 0 ? 'high' : issues.length <= 1 ? 'medium' : 'low'
        };
    }

    /**
     * 优化现有 Prompt
     * @param {string} originalPrompt - 原始 Prompt
     * @returns {string} 优化后的 Prompt
     */
    static optimizePrompt(originalPrompt) {
        const validation = this.validatePrompt(originalPrompt);

        let optimized = originalPrompt;

        // 如果缺少负向约束，添加
        if (!originalPrompt.includes('--no')) {
            optimized += ' --no clutter, watermark, signature, low quality';
        }

        // 如果缺少构图关键词，添加
        if (!originalPrompt.toLowerCase().includes('negative space')) {
            optimized = 'generous negative space, minimalist composition, ' + optimized;
        }

        return optimized;
    }
}

export default ImagePromptGenerator;
