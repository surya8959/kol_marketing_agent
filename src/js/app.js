/**
 * VANZO KOL Agent - 主应用入口
 */

// 导入播客内容再利用 Agent (金字塔式)
import { PyramidContentAgentInstance, CONTENT_TIERS } from './agents/content-repurpose.js';

// ========== 应用状态管理 ==========
const AppState = {
    currentMode: 'kol', // kol / podcast
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
    performanceMetrics: null,
    // 播客相关状态
    podcastResults: null
};

// ========== 配置常量 ==========
const CONFIG = {
    AGENT_TIMEOUT: 30000, // 30秒超时
    UPDATE_INTERVAL: 100, // 更新频率
    MOCK_DELAY: 2000 // 模拟延迟
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
        return Date.now().toString(36) + Math.random().toString(36).substring(2);
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

        // 加载配置
        this.loadConfig();

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

        // 播客表单提交
        // 播客表单 - 改为分步生成
        const podcastForm = document.querySelector('#podcast-form');
        console.log('📝 播客表单:', podcastForm);
        if (podcastForm) {
            podcastForm.addEventListener('submit', (e) => {
                e.preventDefault();
            });

            // 分步生成按钮事件
            this.initStepButtons(podcastForm);
        } else {
            console.log('⚠️ 未找到播客表单');
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
        AppState.podcastResults = null;

        UIRenderer.switchView('input');
        UIRenderer.showNotification('已重置，可以开始新的营销活动', 'info');
    }

    // ========== 模式切换 ==========
    switchMode(mode) {
        AppState.currentMode = mode;
        const mainContainer = document.querySelector('.main-container');
        const podcastView = document.getElementById('podcast-view');

        // 更新按钮状态
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.remove('mode-btn--active');
            if (btn.dataset.mode === mode) {
                btn.classList.add('mode-btn--active');
            }
        });

        // 切换视图
        if (mode === 'podcast') {
            mainContainer.style.display = 'none';
            podcastView.style.display = 'block';
        } else {
            mainContainer.style.display = 'grid';
            podcastView.style.display = 'none';
        }

        console.log('🔄 模式切换:', mode);
    }

    // ========== 新建项目 ==========
    newProject() {
        // 清空当前项目数据
        this.podcastInput = null;
        this.podcastResults = {
            longForm: null,
            shortVideo: null,
            shortCopy: null,
            linkedin: null
        };
        this.completedSteps = new Set();

        // 清空对话
        document.getElementById('chat-messages').innerHTML = `
            <div class="chat-message chat-message--ai">
                <div class="chat-avatar">🤖</div>
                <div class="chat-content">
                    <div class="chat-text">
                        新项目已创建！请添加素材或输入文案，然后告诉我你的需求。
                    </div>
                </div>
            </div>
        `;

        // 重置物料区
        this.resetTierCards();

        UIRenderer.showNotification('新项目已创建', 'success');
    }

    // ========== 重置物料卡片 ==========
    resetTierCards() {
        const tiers = ['longform', 'shortvideo', 'shortcopy', 'linkedin'];
        tiers.forEach((tier, index) => {
            const content = document.getElementById(`tier-${tier}-content`);
            const btn = document.querySelector(`#tier-${tier} .btn`);

            if (content) {
                const hints = {
                    longform: '点击"生成"按钮创建长文',
                    shortvideo: '先生成长文后再生成',
                    shortcopy: '先生成长文后再生成',
                    linkedin: '先生成长文后再生成'
                };
                content.innerHTML = `<div class="empty-hint">${hints[tier]}</div>`;
            }

            if (btn) {
                btn.disabled = index > 0;
                btn.classList.toggle('btn--accent', index === 0);
                btn.classList.toggle('btn--secondary', index > 0);
            }
        });
    }

    // ========== 弹窗方法 ==========
    // 显示添加素材弹窗
    showAddSourceModal() {
        const modal = document.getElementById('add-source-modal');
        modal.style.display = 'flex';
    }

    // 关闭添加素材弹窗
    closeAddSourceModal() {
        const modal = document.getElementById('add-source-modal');
        modal.style.display = 'none';
        // 重置状态
        this.selectedFiles = [];
    }

    // 切换素材标签页
    switchSourceTab(tabName) {
        // 更新标签按钮
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.classList.remove('modal-tab--active');
            if (tab.dataset.tab === tabName) {
                tab.classList.add('modal-tab--active');
            }
        });

        // 更新内容显示
        document.querySelectorAll('.modal-tab-content').forEach(content => {
            content.classList.remove('modal-tab-content--active');
        });
        document.getElementById(`tab-${tabName}`).classList.add('modal-tab-content--active');
    }

    // 选上传类型
    selectUploadType(type) {
        const acceptMap = {
            'audio': 'audio/*,.m4a,.mp3,.wav',
            'video': 'video/*,.mp4,.mov,.avi',
            'image': 'image/*,.jpg,.jpeg,.png,.gif',
            'document': '.pdf,.doc,.docx,.txt'
        };

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = acceptMap[type];

        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => {
                this.addSelectedFile(file);
            });
        };

        input.click();
    }

    // 处理文件选择
    handleFileSelect(event) {
        const files = event.target.files;
        Array.from(files).forEach(file => {
            this.addSelectedFile(file);
        });
    }

    // 添加选中的文件
    selectedFiles = [];
    addSelectedFile(file) {
        const typeMap = {
            'audio': '🎵',
            'video': '🎬',
            'image': '🖼️',
            'document': '📄'
        };

        const ext = file.name.split('.').pop().toLowerCase();
        let type = 'document';
        if (['mp3', 'wav', 'm4a', 'aac'].includes(ext)) type = 'audio';
        else if (['mp4', 'mov', 'avi', 'mkv'].includes(ext)) type = 'video';
        else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) type = 'image';

        const fileInfo = {
            name: file.name,
            size: file.size,
            type: type,
            icon: typeMap[type],
            file: file
        };

        this.selectedFiles.push(fileInfo);
        this.renderSelectedFiles();
    }

    // 渲染已选文件
    renderSelectedFiles() {
        const container = document.getElementById('selected-files');
        const list = document.getElementById('selected-files-list');

        if (this.selectedFiles.length > 0) {
            container.style.display = 'block';
            list.innerHTML = this.selectedFiles.map((f, i) => `
                <div class="selected-file-item">
                    <span class="file-icon">${f.icon}</span>
                    <span class="file-name">${f.name}</span>
                    <span class="file-size">${this.formatFileSize(f.size)}</span>
                    <span class="file-remove" onclick="app.removeSelectedFile(${i})">×</span>
                </div>
            `).join('');
        } else {
            container.style.display = 'none';
        }
    }

    // 移除已选文件
    removeSelectedFile(index) {
        this.selectedFiles.splice(index, 1);
        this.renderSelectedFiles();
    }

    // 上传选中的文件
    uploadSelectedFiles() {
        if (this.selectedFiles.length === 0) {
            UIRenderer.showNotification('请先选择文件', 'error');
            return;
        }

        // 添加到素材列表
        this.selectedFiles.forEach(f => {
            this.addSourceToList(f);
        });

        UIRenderer.showNotification(`已添加 ${this.selectedFiles.length} 个文件`, 'success');
        this.closeAddSourceModal();
    }

    // 从链接提取内容
    extractFromLink() {
        const link = document.getElementById('source-link').value.trim();
        const linkType = document.getElementById('link-type').value;

        if (!link) {
            UIRenderer.showNotification('请输入链接地址', 'error');
            return;
        }

        UIRenderer.showNotification(`正在提取 ${link}...`, 'info');

        // TODO: 实际实现链接内容提取
        // 这里模拟添加一个链接素材
        setTimeout(() => {
            this.addSourceToList({
                name: link.substring(0, 50) + '...',
                type: 'link',
                icon: '🔗',
                meta: linkType === 'youtube' ? 'YouTube' : '网页文章'
            });
            UIRenderer.showNotification('链接内容提取成功！', 'success');
            this.closeAddSourceModal();
        }, 1500);
    }

    // 添加文案内容
    addTextContent() {
        const title = document.getElementById('text-title').value.trim();
        const content = document.getElementById('text-content').value.trim();

        if (!content) {
            UIRenderer.showNotification('请输入内容', 'error');
            return;
        }

        this.addSourceToList({
            name: title || content.substring(0, 30) + '...',
            type: 'text',
            icon: '📝',
            meta: `文案 · ${content.length}字符`
        });

        // 同时设置内容到全局
        this.podcastInput = this.podcastInput || {};
        this.podcastInput.content = content;
        if (title) this.podcastInput.title = title;

        UIRenderer.showNotification('文案已添加', 'success');
        this.closeAddSourceModal();
    }

    // 添加素材到列表显示
    addSourceToList(sourceInfo) {
        const list = document.getElementById('source-list');
        const item = document.createElement('div');
        item.className = 'source-item';
        item.dataset.type = sourceInfo.type;
        item.innerHTML = `
            <span class="source-type">${sourceInfo.icon}</span>
            <div class="source-details">
                <span class="source-name">${sourceInfo.name}</span>
                <span class="source-meta">${sourceInfo.meta || (sourceInfo.size ? this.formatFileSize(sourceInfo.size) : '')}</span>
            </div>
            <button class="source-delete" onclick="app.deleteSource(this)">×</button>
        `;
        list.appendChild(item);

        // 更新素材计数
        this.updateSourceCount();
    }

    // 删除素材
    deleteSource(btn) {
        const item = btn.closest('.source-item');
        item.remove();
        this.updateSourceCount();
        UIRenderer.showNotification('素材已移除', 'info');
    }

    // 更新素材计数
    updateSourceCount() {
        const count = document.querySelectorAll('#source-list .source-item').length;
        const title = document.querySelector('.sources-title span');
        if (title) {
            title.textContent = `📂 当前素材 (${count})`;
        }
    }

    // 格式化文件大小
    formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    }

    // ========== 发送对话 ==========
    sendChat() {
        const chatInput = document.getElementById('chat-input');
        const message = chatInput?.value?.trim();

        if (!message) {
            UIRenderer.showNotification('请输入内容', 'error');
            return;
        }

        // 添加用户消息
        const chatMessages = document.getElementById('chat-messages');
        chatMessages.innerHTML += `
            <div class="chat-message chat-message--user">
                <div class="chat-avatar">👤</div>
                <div class="chat-content">
                    <div class="chat-text">${message}</div>
                </div>
            </div>
        `;

        chatInput.value = '';

        // TODO: 调用 AI 对话
        setTimeout(() => {
            chatMessages.innerHTML += `
                <div class="chat-message chat-message--ai">
                    <div class="chat-avatar">🤖</div>
                    <div class="chat-content">
                        <div class="chat-text">
                            收到你的需求了！${message.includes('长文') ? '我可以帮你生成长文。' : message.includes('视频') ? '我来帮你生成视频脚本。' : '请在右侧选择要生成的内容类型。'}
                        </div>
                    </div>
                </div>
            `;
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 500);

        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ========== 清空对话 ==========
    clearChat() {
        document.getElementById('chat-messages').innerHTML = `
            <div class="chat-message chat-message--ai">
                <div class="chat-avatar">🤖</div>
                <div class="chat-content">
                    <div class="chat-text">
                        对话已清空。请告诉我你的需求。
                    </div>
                </div>
            </div>
        `;
    }

    // ========== 快捷指令 ==========
    quickCommand(type) {
        const commands = {
            '长文': '帮我生成一篇深度长文公众号文章',
            '短视频': '帮我拆解成短视频脚本',
            '小红书': '帮我生成小红书文案',
            '朋友圈': '帮我生成朋友圈文案'
        };

        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.value = commands[type] || '';
            this.sendChat();
        }
    }

    // ========== 生成方法（对接 PyramidContentAgent） ==========
    generateLongForm() {
        // 检查素材区是否有素材
        const sourceItems = document.querySelectorAll('#source-list .source-item');
        if (sourceItems.length === 0) {
            UIRenderer.showNotification('请先添加素材或文案', 'error');
            return;
        }

        // 收集素材信息
        const sources = [];
        sourceItems.forEach(item => {
            const type = item.dataset.type;
            const name = item.querySelector('.source-name')?.textContent || '';
            sources.push({ type, name });
        });

        // 从素材区获取文案内容
        const content = this.getSourceContent();

        // 构建输入
        this.podcastInput = {
            title: this.podcastInput?.title || '待生成',
            podcastName: '当前项目',
            topic: '',
            content: content || '请根据上传的素材生成内容',
            sources: sources
        };

        // 如果没有文案内容，提示用户
        if (!content || content.length < 50) {
            const confirm = window.confirm(
                '检测到您上传了素材，但文案内容较少。是否继续生成？\n\n' +
                '建议：\n' +
                '1. 使用"粘贴文案"功能添加播客逐字稿\n' +
                '2. 或使用"链接提取"从文章中提取内容'
            );
            if (!confirm) {
                UIRenderer.showNotification('请添加更多文案内容', 'info');
                return;
            }
        }

        this.showProgress('正在生成长文...');

        // 调用 Agent
        PyramidContentAgentInstance.generateLongForm(this.podcastInput)
            .then(result => {
                this.podcastResults.longForm = result;
                this.displayTierContent('longform', result);
                this.enableNextTier('longform');
                UIRenderer.showNotification('长文生成完成！', 'success');
            })
            .catch(error => {
                console.error('❌ 长文生成失败:', error);
                UIRenderer.showNotification('生成失败: ' + error.message, 'error');
            });
    }

    generateShortVideo() {
        this.showProgress('正在生成短视频脚本...');

        PyramidContentAgentInstance.generateShortVideo(
            this.podcastInput,
            this.podcastResults.longForm?.content || ''
        )
            .then(result => {
                this.podcastResults.shortVideo = result;
                this.displayTierContent('shortvideo', result);
                this.enableNextTier('shortvideo');
                UIRenderer.showNotification('短视频脚本生成完成！', 'success');
            })
            .catch(error => {
                UIRenderer.showNotification('生成失败: ' + error.message, 'error');
            });
    }

    generateShortCopy() {
        this.showProgress('正在生成短文案...');

        PyramidContentAgentInstance.generateShortCopy(
            this.podcastInput,
            this.podcastResults.longForm?.content || ''
        )
            .then(result => {
                this.podcastResults.shortCopy = result;
                this.displayTierContent('shortcopy', result);
                this.enableNextTier('shortcopy');
                UIRenderer.showNotification('短文案生成完成！', 'success');
            })
            .catch(error => {
                UIRenderer.showNotification('生成失败: ' + error.message, 'error');
            });
    }

    generateLinkedIn() {
        this.showProgress('正在生成 LinkedIn 内容...');

        PyramidContentAgentInstance.generateLinkedIn(
            this.podcastInput,
            this.podcastResults.longForm?.content || ''
        )
            .then(result => {
                this.podcastResults.linkedin = result;
                this.displayTierContent('linkedin', result);
                UIRenderer.showNotification('LinkedIn 内容生成完成！', 'success');
            })
            .catch(error => {
                UIRenderer.showNotification('生成失败: ' + error.message, 'error');
            });
    }

    // ========== 工具方法 ==========
    getSourceContent() {
        // 从素材区获取文案内容
        const sourceItems = document.querySelectorAll('#source-list .source-item');
        let textContent = '';

        sourceItems.forEach(item => {
            const type = item.dataset.type;

            // 如果是文案类型，获取其内容
            if (type === 'text') {
                // 从全局存储的文案内容中获取
                if (this.podcastInput?.content) {
                    textContent = this.podcastInput.content;
                }
            }
        });

        // 如果没有从素材获取到，尝试从对话输入获取
        if (!textContent) {
            const chatInput = document.getElementById('chat-input');
            textContent = chatInput?.value || '';
        }

        return textContent;
    }

    showProgress(message) {
        // 显示进度
        console.log('📡 ' + message);
    }

    displayTierContent(tier, result) {
        const contentEl = document.getElementById(`tier-${tier}-content`);
        if (!contentEl) return;

        if (tier === 'longform') {
            contentEl.innerHTML = `<div class="generated-content">${result.content || '生成完成'}</div>`;
        } else if (tier === 'shortvideo') {
            contentEl.innerHTML = `<div class="generated-content">生成 ${result.count} 条短视频脚本</div>`;
        } else if (tier === 'shortcopy') {
            contentEl.innerHTML = `<div class="generated-content">生成多条短文案</div>`;
        } else if (tier === 'linkedin') {
            contentEl.innerHTML = `<div class="generated-content">LinkedIn 内容生成完成</div>`;
        }
    }

    enableNextTier(currentTier) {
        const tierOrder = ['longform', 'shortvideo', 'shortcopy', 'linkedin'];
        const currentIndex = tierOrder.indexOf(currentTier);

        if (currentIndex < tierOrder.length - 1) {
            const nextTier = tierOrder[currentIndex + 1];
            const nextBtn = document.querySelector(`#tier-${nextTier} .btn`);

            if (nextBtn) {
                nextBtn.disabled = false;
                nextBtn.classList.remove('btn--secondary');
                nextBtn.classList.add('btn--accent');
            }
        }
    }

    exportAll() {
        UIRenderer.showNotification('导出功能开发中...', 'info');
    }

    // ========== 加载配置 ==========
    loadConfig() {
        // 动态加载配置文件
        const script = document.createElement('script');
        script.src = '../src/js/config.js';
        script.onload = () => {
            console.log('✅ 配置文件已加载');
            if (window.APP_CONFIG?.claude?.apiKey) {
                window.CLAUDE_API_KEY = window.APP_CONFIG.claude.apiKey;
                console.log('✅ Claude API 已配置');
            }
        };
        script.onerror = () => {
            console.log('⚠️ 配置文件未找到（可选）');
        };
        document.head.appendChild(script);
    }

    // ========== 播客表单处理 - 分步生成 ==========
    // 存储当前输入和已生成的结果
    podcastInput = null;
    podcastResults = {
        longForm: null,
        shortVideo: null,
        shortCopy: null,
        linkedin: null
    };
    completedSteps = new Set();

    // 获取播客输入数据
    getPodcastInput(form) {
        const formData = new FormData(form);
        return {
            title: formData.get('podcast-title'),
            podcastName: formData.get('podcast-name'),
            topic: formData.get('podcast-topic'),
            content: formData.get('podcast-content')
        };
    }

    // 初始化分步生成按钮
    initStepButtons(form) {
        const btnLongForm = document.getElementById('btn-longform');
        const btnShortVideo = document.getElementById('btn-shortvideo');
        const btnShortCopy = document.getElementById('btn-shortcopy');
        const btnLinkedIn = document.getElementById('btn-linkedin');

        // 第一步：生成长文
        btnLongForm?.addEventListener('click', async () => {
            this.podcastInput = this.getPodcastInput(form);
            console.log('📝 播客输入:', this.podcastInput);

            if (!this.podcastInput.content) {
                UIRenderer.showNotification('请输入播客文稿内容', 'error');
                return;
            }

            this.showPodcastProgress('正在生成长文...');
            this.setButtonLoading(btnLongForm, true);

            try {
                const result = await PyramidContentAgentInstance.generateLongForm(this.podcastInput);
                this.podcastResults.longForm = result;
                this.completedSteps.add('longForm');
                this.displayPodcastResults(this.podcastResults);
                this.enableStep('longForm');
                UIRenderer.showNotification('长文生成完成！可继续生成短视频脚本', 'success');
            } catch (error) {
                console.error('❌ 长文生成失败:', error);
                UIRenderer.showNotification('长文生成失败: ' + error.message, 'error');
            } finally {
                this.setButtonLoading(btnLongForm, false);
            }
        });

        // 第二步：生成短视频脚本
        btnShortVideo?.addEventListener('click', async () => {
            this.showPodcastProgress('正在生成短视频脚本...');
            this.setButtonLoading(btnShortVideo, true);

            try {
                const result = await PyramidContentAgentInstance.generateShortVideo(
                    this.podcastInput,
                    this.podcastResults.longForm?.content || ''
                );
                this.podcastResults.shortVideo = result;
                this.completedSteps.add('shortVideo');
                this.displayPodcastResults(this.podcastResults);
                this.enableStep('shortVideo');
                UIRenderer.showNotification('短视频脚本生成完成！可继续生成短文案', 'success');
            } catch (error) {
                console.error('❌ 短视频脚本生成失败:', error);
                UIRenderer.showNotification('短视频脚本生成失败: ' + error.message, 'error');
            } finally {
                this.setButtonLoading(btnShortVideo, false);
            }
        });

        // 第三步：生成短文案
        btnShortCopy?.addEventListener('click', async () => {
            this.showPodcastProgress('正在生成短文案...');
            this.setButtonLoading(btnShortCopy, true);

            try {
                const result = await PyramidContentAgentInstance.generateShortCopy(
                    this.podcastInput,
                    this.podcastResults.longForm?.content || ''
                );
                this.podcastResults.shortCopy = result;
                this.completedSteps.add('shortCopy');
                this.displayPodcastResults(this.podcastResults);
                this.enableStep('shortCopy');
                UIRenderer.showNotification('短文案生成完成！可继续生成 LinkedIn', 'success');
            } catch (error) {
                console.error('❌ 短文案生成失败:', error);
                UIRenderer.showNotification('短文案生成失败: ' + error.message, 'error');
            } finally {
                this.setButtonLoading(btnShortCopy, false);
            }
        });

        // 第四步：生成 LinkedIn
        btnLinkedIn?.addEventListener('click', async () => {
            this.showPodcastProgress('正在生成 LinkedIn 内容...');
            this.setButtonLoading(btnLinkedIn, true);

            try {
                const result = await PyramidContentAgentInstance.generateLinkedIn(
                    this.podcastInput,
                    this.podcastResults.longForm?.content || ''
                );
                this.podcastResults.linkedin = result;
                this.completedSteps.add('linkedin');
                this.displayPodcastResults(this.podcastResults);
                this.enableStep('linkedin');
                UIRenderer.showNotification('LinkedIn 内容生成完成！全部内容已生成完毕', 'success');
            } catch (error) {
                console.error('❌ LinkedIn 生成失败:', error);
                UIRenderer.showNotification('LinkedIn 生成失败: ' + error.message, 'error');
            } finally {
                this.setButtonLoading(btnLinkedIn, false);
            }
        });
    }

    // 启用下一步按钮
    enableStep(step) {
        const stepMap = {
            'longForm': 'btn-shortvideo',
            'shortVideo': 'btn-shortcopy',
            'shortCopy': 'btn-linkedin'
        };

        const nextBtnId = stepMap[step];
        if (nextBtnId) {
            const btn = document.getElementById(nextBtnId);
            if (btn) {
                btn.disabled = false;
                btn.classList.remove('btn--secondary');
                btn.classList.add('btn--accent');

                // 标记当前按钮为完成
                const currentStepMap = {
                    'btn-shortvideo': 'btn-longform',
                    'btn-shortcopy': 'btn-shortvideo',
                    'btn-linkedin': 'btn-shortcopy'
                };
                const currentBtn = document.getElementById(currentStepMap[nextBtnId]);
                if (currentBtn) {
                    currentBtn.classList.add('completed');
                }
            }
        }
    }

    // 设置按钮加载状态
    setButtonLoading(btn, loading) {
        if (!btn) return;
        if (loading) {
            btn.disabled = true;
            btn.dataset.originalText = btn.textContent;
            btn.textContent = '⏳ 生成中...';
        } else {
            btn.textContent = btn.dataset.originalText || btn.textContent;
        }
    }

    // 处理表单提交（保留兼容）
    async handlePodcastSubmit(form) {
        // 分步模式下不直接调用全部生成
    }

    // ========== 运行播客内容再利用（ pyramd模式）==========
    async runPodcastRepurpose(podcastInput) {
        return await PyramidContentAgentInstance.generateAll(podcastInput);
    }

    // ========== 显示播客生成进度 ==========
    showPodcastProgress() {
        const progressSection = document.getElementById('podcast-progress');
        const resultsSection = document.getElementById('podcast-results');

        progressSection.style.display = 'block';
        resultsSection.innerHTML = '<div class="empty-state"><div class="empty-state__icon">🤖</div><div class="empty-state__text">正在生成分级内容...</div></div>';

        // 监听进度
        PyramidContentAgentInstance.onProgress((event, data) => {
            if (event === 'progress') {
                this.updatePodcastProgress(data.tier, data.progress, data.message);
            }
        });
    }

    // ========== 更新播客进度 ==========
    updatePodcastProgress(tier, progress, message) {
        const progressFill = document.getElementById('progress-bar-fill');
        const progressPercent = document.getElementById('progress-percent');
        const progressText = document.getElementById('progress-text');

        if (progressFill) progressFill.style.width = `${progress}%`;
        if (progressPercent) progressPercent.textContent = `${progress}%`;
        if (progressText) {
            const tierNames = {
                longForm: '📝 深度长文',
                shortVideo: '🎬 短视频脚本',
                shortCopy: '💬 短文案',
                linkedin: '💼 LinkedIn'
            };
            progressText.textContent = message || `正在生成 ${tierNames[tier] || tier}...`;
        }
    }

    // ========== 显示播客结果（金字塔模式）==========
    displayPodcastResults(results) {
        const progressSection = document.getElementById('podcast-progress');
        const resultsSection = document.getElementById('podcast-results');

        progressSection.style.display = 'none';

        const { results: r, summary } = results;

        // 创建内容层级标签
        const tiers = [
            { key: 'longForm', name: '📝 深度长文', icon: '📝', count: summary.longForm },
            { key: 'shortVideo', name: '🎬 短视频', icon: '🎬', count: summary.shortVideo },
            { key: 'shortCopy', name: '💬 短文案', icon: '💬', count: summary.shortCopy },
            { key: 'linkedin', name: '💼 LinkedIn', icon: '💼', count: '已生成' }
        ];

        const tabsHTML = tiers.map((tier, index) => {
            const isActive = index === 0 ? 'platform-tab--active' : '';
            return `
                <button class="platform-tab ${isActive}" data-tier="${tier.key}">
                    ${tier.icon} ${tier.name} <span class="tier-count">${tier.count}</span>
                </button>
            `;
        }).join('');

        // 创建结果卡片
        const cardsHTML = tiers.map((tier, index) => {
            const isActive = index === 0 ? '' : 'display: none;';
            const content = this.formatTierContent(tier.key, r);
            return `
                <div class="result-card" data-tier="${tier.key}" style="${isActive}">
                    <div class="result-card__header">
                        <div class="result-card__title">${tier.icon} ${tier.name}</div>
                        <button class="result-card__copy" onclick="window.app.copyTierContent('${tier.key}')">
                            📋 复制全部
                        </button>
                    </div>
                    <div class="result-card__body">${content}</div>
                </div>
            `;
        }).join('');

        // 总计信息
        const totalHTML = `
            <div class="pyramid-summary">
                <span class="pyramid-badge">📊 共生成 ${summary.totalContentPieces} 条内���</span>
            </div>
        `;

        resultsSection.innerHTML = `
            ${totalHTML}
            <div class="platform-tabs">
                ${tabsHTML}
            </div>
            ${cardsHTML}
        `;

        // 绑定标签点击事件
        resultsSection.querySelectorAll('.platform-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                resultsSection.querySelectorAll('.platform-tab').forEach(t =>
                    t.classList.remove('platform-tab--active')
                );
                tab.classList.add('platform-tab--active');

                const tier = tab.dataset.tier;
                resultsSection.querySelectorAll('.result-card').forEach(card => {
                    card.style.display = card.dataset.tier === tier ? 'block' : 'none';
                });
            });
        });

        // 保存结果
        AppState.podcastResults = results;
    }

    // ========== 格式化各层级内容显示 ==========
    formatTierContent(tierKey, results) {
        const data = results[tierKey];
        if (!data || data.error) return '<p class="error">生成失败</p>';

        switch (tierKey) {
            case 'longForm':
                return this.formatLongForm(data);
            case 'shortVideo':
                return this.formatShortVideo(data);
            case 'shortCopy':
                return this.formatShortCopy(data);
            case 'linkedin':
                return this.formatLinkedIn(data);
            default:
                return this.escapeHtml(JSON.stringify(data));
        }
    }

    // 格式化深度长文
    formatLongForm(data) {
        return `
            <div class="long-form-content">
                <h3 class="content-title">${data.title}</h3>
                <div class="content-meta">📖 ${data.wordCount} 字 | 📱 ${data.platform}</div>
                <div class="content-body">${this.escapeHtml(data.content)}</div>
            </div>
        `;
    }

    // 格式化短视频脚本
    formatShortVideo(data) {
        if (!data.scripts || !data.scripts.length) return '<p>无脚本数据</p>';

        return `
            <div class="short-video-content">
                <div class="content-meta">🎬 共 ${data.count} 条脚本 | ⏱️ ${data.duration}</div>
                ${data.scripts.map((script, i) => `
                    <div class="video-script-item">
                        <div class="script-header">
                            <span class="script-number">脚本 ${i + 1}</span>
                            <span class="script-duration">${script.duration || '30-60秒'}</span>
                        </div>
                        <div class="script-title">${script.title || '无标题'}</div>
                        <div class="script-content">
                            <div class="script-section"><strong>🎣 Hook:</strong> ${script.hook || '-'}</div>
                            <div class="script-section"><strong>📝 正文:</strong> ${script.content || '-'}</div>
                            <div class="script-section"><strong>👋 CTA:</strong> ${script.cta || '-'}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 格式化短文案
    formatShortCopy(data) {
        if (!data.categories || !data.categories.length) return '<p>无文案数据</p>';

        return `
            <div class="short-copy-content">
                <div class="content-meta">💬 共 ${data.totalCount} 条文案</div>
                ${data.categories.map(cat => `
                    <div class="copy-category">
                        <div class="category-header">${cat.icon} ${cat.name}</div>
                        <div class="category-items">
                            ${cat.items.map((item, i) => `
                                <div class="copy-item">
                                    <span class="copy-number">${i + 1}</span>
                                    <span class="copy-text">${item}</span>
                                    <button class="copy-btn" onclick="window.app.copyText('${this.escapeHtml(item).replace(/'/g, "\\'")}')">📋</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    // 格式化 LinkedIn
    formatLinkedIn(data) {
        return `
            <div class="linkedin-content">
                <div class="content-meta">💼 ${data.platforms?.join(' / ') || 'LinkedIn'}</div>

                <div class="linkedin-article">
                    <h4>📄 LinkedIn 文章</h4>
                    <div class="content-body">${this.escapeHtml(data.article || '')}</div>
                </div>

                ${data.posters && data.posters.length > 0 ? `
                    <div class="linkedin-posters">
                        <h4>🖼️ 海报文案</h4>
                        ${data.posters.map((poster, i) => `
                            <div class="poster-item">
                                <span class="poster-text">${poster}</span>
                                <button class="copy-btn" onclick="window.app.copyText('${this.escapeHtml(poster).replace(/'/g, "\\'")}')">📋</button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;
    }

    // ========== 复制单条内容 ==========
    copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            UIRenderer.showNotification('已复制到剪贴板', 'success');
        }).catch(() => {
            UIRenderer.showNotification('复制失败', 'error');
        });
    }

    // ========== 复制整个层级 ==========
    copyTierContent(tierKey) {
        if (!AppState.podcastResults) return;

        const results = AppState.podcastResults.results;
        let text = '';

        switch (tierKey) {
            case 'longForm':
                text = results.longForm?.content || '';
                break;
            case 'shortVideo':
                text = results.shortVideo?.scripts?.map(s =>
                    `【脚本 ${s.id}】${s.title}\nHook: ${s.hook}\n内容: ${s.content}\nCTA: ${s.cta}`
                ).join('\n\n') || '';
                break;
            case 'shortCopy':
                text = results.shortCopy?.categories?.map(cat =>
                    `【${cat.name}】\n${cat.items.join('\n')}`
                ).join('\n\n') || '';
                break;
            case 'linkedin':
                text = `【LinkedIn文章】\n${results.linkedin?.article || ''}\n\n【海报文案】\n${results.linkedin?.posters?.join('\n') || ''}`;
                break;
        }

        this.copyText(text);
    }

    // ========== 复制到剪贴板 ==========
    copyToClipboard(platform) {
        if (!AppState.podcastResults) return;

        const content = AppState.podcastResults.results[platform]?.content;
        if (!content) return;

        navigator.clipboard.writeText(content).then(() => {
            UIRenderer.showNotification('已复制到剪贴板', 'success');
        }).catch(() => {
            UIRenderer.showNotification('复制失败', 'error');
        });
    }

    // ========== HTML 转义 ==========
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========== 保存 API Key ==========
    saveApiKey() {
        const apiKeyInput = document.getElementById('claude-api-key');
        const statusEl = document.getElementById('api-key-status');

        const apiKey = apiKeyInput?.value?.trim();

        if (!apiKey) {
            UIRenderer.showNotification('请输入 API Key', 'error');
            return;
        }

        if (!apiKey.startsWith('sk-ant-')) {
            UIRenderer.showNotification('API Key 格式不正确，应以 sk-ant- 开头', 'error');
            return;
        }

        // 保存到全局变量和 localStorage
        window.CLAUDE_API_KEY = apiKey;
        localStorage.setItem('CLAUDE_API_KEY', apiKey);

        // 更新状态显示
        if (statusEl) {
            statusEl.textContent = '✅ 已配置 Claude API';
            statusEl.className = 'api-key-status api-key-status--active';
        }

        UIRenderer.showNotification('API Key 已保存！点击生成将使用真实 AI', 'success');
    }

    // ========== 加载已保存的 API Key ==========
    loadApiKey() {
        const savedKey = localStorage.getItem('CLAUDE_API_KEY');
        if (savedKey) {
            window.CLAUDE_API_KEY = savedKey;
            const statusEl = document.getElementById('api-key-status');
            if (statusEl) {
                statusEl.textContent = '✅ 已配置 Claude API';
                statusEl.className = 'api-key-status api-key-status--active';
            }
        }
    }
}

// ========== 启动应用 ==========
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});

// ========== 导出（供其他模块使用） ==========
export { AppState, EventBus, Utils, UIRenderer, PyramidContentAgentInstance };
