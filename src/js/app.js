/**
 * VANZO KOL Agent - 主应用入口
 */

// ========== 应用状态管理 ==========
const AppState = {
    currentStep: 'input', // input, processing, results
    agents: {
        analyzer: { status: 'idle', progress: 0 },
        matcher: { status: 'idle', progress: 0 },
        creator: { status: 'idle', progress: 0 },
        optimizer: { status: 'idle', progress: 0 }
    },
    requirements: null,
    matchedKOLs: [],
    generatedScripts: [],
    performanceMetrics: null
};

// ========== 配置常量 ==========
const CONFIG = {
    AGENT_TIMEOUT: 30000, // 30秒超时
    UPDATE_INTERVAL: 100, // 更新频率
    MOCK_DELAY: 2000, // 模拟延迟
};

// ========== 事件总线 ==========
const EventBus = {
    events: {},

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    },

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => callback(data));
        }
    },

    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
    }
};

// ========== 工具函数 ==========
const Utils = {
    // 生成唯一ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // 格式化数字
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    },

    // 延迟函数
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // 随机选择
    randomChoice(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    // 随机范围
    randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};

// ========== UI 渲染器 ==========
const UIRenderer = {
    // 更新 Agent 状态显示
    updateAgentStatus(agentName, status, progress) {
        const statusElement = document.querySelector(`[data-agent="${agentName}"]`);
        if (!statusElement) return;

        const statusText = statusElement.querySelector('.agent-status__text');
        const progressBar = statusElement.querySelector('.agent-status__progress');
        const statusDot = statusElement.querySelector('.agent-status__dot');

        if (statusText) {
            const statusMap = {
                'idle': '等待中',
                'running': '执行中...',
                'completed': '已完成',
                'error': '错误'
            };
            statusText.textContent = statusMap[status] || status;
        }

        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }

        if (statusDot) {
            statusDot.className = `agent-status__dot agent-status__dot--${status}`;
        }
    },

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <span class="notification__message">${message}</span>
            <button class="notification__close" onclick="this.parentElement.remove()">×</button>
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    // 切换视图
    switchView(viewName) {
        document.querySelectorAll('.view').forEach(view => {
            view.classList.add('view--hidden');
        });

        const targetView = document.querySelector(`[data-view="${viewName}"]`);
        if (targetView) {
            targetView.classList.remove('view--hidden');
        }

        AppState.currentStep = viewName;
    },

    // 渲染 KOL 卡片
    renderKOLCards(kols) {
        const container = document.querySelector('.kol-list');
        if (!container) return;

        container.innerHTML = kols.map(kol => `
            <div class="kol-card" data-kol-id="${kol.id}">
                <div class="kol-card__avatar">
                    <img src="${kol.avatar}" alt="${kol.name}" />
                </div>
                <div class="kol-card__info">
                    <h4 class="kol-card__name">${kol.name}</h4>
                    <p class="kol-card__niche">${kol.niche}</p>
                </div>
                <div class="kol-card__metrics">
                    <div class="metric">
                        <span class="metric__value">${Utils.formatNumber(kol.followers)}</span>
                        <span class="metric__label">粉丝</span>
                    </div>
                    <div class="metric">
                        <span class="metric__value">${kol.engagement}</span>
                        <span class="metric__label">互动率</span>
                    </div>
                </div>
                <div class="kol-card__match">
                    <span class="badge badge--success">匹配度 ${kol.matchScore}%</span>
                </div>
            </div>
        `).join('');
    }
};

// ========== 应用初始化 ==========
class App {
    constructor() {
        this.init();
    }

    init() {
        console.log('🚀 VANZO KOL Agent 初始化中...');

        // 初始化事件监听
        this.initEventListeners();

        // 初始化 Agent 系统
        this.initAgents();

        console.log('✅ 应用初始化完成');
    }

    initEventListeners() {
        // 表单提交
        const form = document.querySelector('#requirements-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        }

        // 启动按钮
        const startBtn = document.querySelector('#start-campaign');
        if (startBtn) {
            startBtn.addEventListener('click', () => {
                this.startCampaign();
            });
        }

        // 重置按钮
        const resetBtn = document.querySelector('#reset-campaign');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetCampaign();
            });
        }
    }

    initAgents() {
        // Agent 初始化逻辑将在后续实现
        console.log('🤖 Agent 系统初始化中...');
    }

    async handleFormSubmit(form) {
        const formData = new FormData(form);

        AppState.requirements = {
            brand: formData.get('brand'),
            product: formData.get('product'),
            targetMarket: formData.get('targetMarket'),
            budget: formData.get('budget'),
            goal: formData.get('goal')
        };

        console.log('📋 需求收集完成:', AppState.requirements);
        UIRenderer.showNotification('需求已提交，Agent 准备就绪！', 'success');

        // 切换到处理视图
        UIRenderer.switchView('processing');
    }

    async startCampaign() {
        if (!AppState.requirements) {
            UIRenderer.showNotification('请先填写需求信息', 'error');
            return;
        }

        console.log('🎯 启动营销活动...');
        UIRenderer.switchView('processing');

        // 依次启动四个 Agent
        try {
            await this.runAgentPipeline();

            UIRenderer.showNotification('所有 Agent 执行完成！', 'success');
            UIRenderer.switchView('results');
        } catch (error) {
            console.error('❌ Agent 执行失败:', error);
            UIRenderer.showNotification('Agent 执行失败，请重试', 'error');
        }
    }

    async runAgentPipeline() {
        // Agent 管道执行逻辑将在后续实现
        console.log('⚡ 执行 Agent 管道...');

        // 模拟 Agent 执行
        await this.simulateAgentExecution();
    }

    async simulateAgentExecution() {
        const agents = ['analyzer', 'matcher', 'creator', 'optimizer'];

        for (const agent of agents) {
            AppState.agents[agent].status = 'running';
            UIRenderer.updateAgentStatus(agent, 'running', 0);

            // 模拟进度
            for (let i = 0; i <= 100; i += 10) {
                await Utils.delay(100);
                UIRenderer.updateAgentStatus(agent, 'running', i);
            }

            AppState.agents[agent].status = 'completed';
            UIRenderer.updateAgentStatus(agent, 'completed', 100);
        }
    }

    resetCampaign() {
        AppState.currentStep = 'input';
        AppState.agents = {
            analyzer: { status: 'idle', progress: 0 },
            matcher: { status: 'idle', progress: 0 },
            creator: { status: 'idle', progress: 0 },
            optimizer: { status: 'idle', progress: 0 }
        };
        AppState.requirements = null;
        AppState.matchedKOLs = [];
        AppState.generatedScripts = [];
        AppState.performanceMetrics = null;

        UIRenderer.switchView('input');
        UIRenderer.showNotification('已重置，可以开始新的营销活动', 'info');
    }
}

// ========== 启动应用 ==========
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// ========== 导出（供其他模块使用） ==========
export { AppState, EventBus, Utils, UIRenderer };
