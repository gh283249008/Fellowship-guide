// 文本风格化工具
// 用于为技能描述等文本添加颜色和高亮样式
class TextStyler {
    /**
     * 对文本应用样式规则
     * @param {string} text - 原始文本
     * @param {Array} rules - 样式规则数组，按顺序应用
     * @param {Object} options - 选项配置
     * @returns {string} - 格式化后的HTML文本
     * 
     * @example
     * const rules = [
     *   { pattern: /至多 4 个敌人/g, color: '#ff8c00' },
     *   { pattern: /12,579 - 15,374/g, color: '#ff8c00' },
     *   { pattern: /至多 4 名盟友/g, color: '#90ee90' },
     *   { 
     *     pattern: /自然之怒具有 \+30% 额外暴击率/g,
     *     replacement: '<span style="color: #ffd700;">自然之怒</span>具有 <span style="color: #ff8c00;">+30% 额外暴击率</span>'
     *   }
     * ];
     * const styled = TextStyler.style('文本内容', rules, { convertNewlines: true });
     */
    static style(text, rules = [], options = {}) {
        if (!text) return '';
        
        let styledText = text;
        const {
            convertNewlines = true,  // 是否将换行符转换为<br>
            escapeHtml = false       // 是否转义HTML（如果文本可能包含HTML标签）
        } = options;

        // 如果需要转义HTML，先转义
        if (escapeHtml) {
            styledText = styledText
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
        }

        // 按顺序应用样式规则
        rules.forEach(rule => {
            if (rule.replacement) {
                // 如果提供了自定义替换文本，直接使用
                styledText = styledText.replace(rule.pattern, rule.replacement);
            } else if (rule.color) {
                // 使用颜色样式
                styledText = styledText.replace(rule.pattern, (match) => {
                    return `<span style="color: ${rule.color};">${match}</span>`;
                });
            } else if (rule.style) {
                // 使用自定义样式对象
                const styleStr = Object.entries(rule.style)
                    .map(([key, value]) => `${key}: ${value}`)
                    .join('; ');
                styledText = styledText.replace(rule.pattern, (match) => {
                    return `<span style="${styleStr}">${match}</span>`;
                });
            } else if (rule.className) {
                // 使用CSS类名
                styledText = styledText.replace(rule.pattern, (match) => {
                    return `<span class="${rule.className}">${match}</span>`;
                });
            }
        });

        // 转换换行符
        if (convertNewlines) {
            styledText = styledText.replace(/\n/g, '<br>');
        }

        return styledText;
    }

    /**
     * 预定义的样式规则集合
     * 可以根据技能名称快速获取对应的样式规则
     */
    static getPresetRules(skillName) {
        const presets = {
            '自然之怒': [
                // 先处理完整的句子，避免部分匹配
                {
                    pattern: /自然之怒具有 \+30% 额外暴击率/g,
                    replacement: '<span style="color: #ffd700;">自然之怒</span>具有 <span style="color: #ff8c00;">+30% 额外暴击率</span>'
                },
                // 敌人相关 - 橙色
                { pattern: /至多 4 个敌人/g, color: '#ff8c00' },
                { pattern: /12,579 - 15,374/g, color: '#ff8c00' },
                // 盟友相关 - 浅绿色
                { pattern: /至多 4 名盟友/g, color: '#90ee90' },
                { pattern: /16,353 - 19,987/g, color: '#90ee90' }
            ],
            '暮光天矢': [
                // 先处理完整的句子，避免部分匹配
                // "暮光天矢获得相当于你急速的冷却回复。" - 橙色
                {
                    pattern: /暮光天矢获得相当于你急速的冷却回复。/g,
                    replacement: '<span style="color: #ff8c00;">暮光天矢获得相当于你急速的冷却回复。</span>'
                },
                // "每施放3次重置蚀变层数。" - 紫色
                {
                    pattern: /每施放3次重置蚀变层数。/g,
                    replacement: '<span style="color: #9370db;">每施放3次重置蚀变层数。</span>'
                },
                // 伤害数值 - 橙色（注意：先处理伤害，再处理治疗，避免重复匹配）
                {
                    pattern: /造成 7,164 - 8,756 点伤害/g,
                    replacement: '造成 <span style="color: #ff8c00;">7,164 - 8,756</span> 点伤害'
                },
                // 治疗数值 - 绿色
                {
                    pattern: /治疗 7,164 - 8,756 点生命值/g,
                    replacement: '治疗 <span style="color: #90ee90;">7,164 - 8,756</span> 点生命值'
                },
                // "造成的伤害提高100%" - 橙色
                {
                    pattern: /造成的伤害提高100%/g,
                    replacement: '造成的伤害提高<span style="color: #ff8c00;">100%</span>'
                },
                // "使治疗提高100%" - 绿色
                {
                    pattern: /使治疗提高100%/g,
                    replacement: '使治疗提高<span style="color: #90ee90;">100%</span>'
                }
            ],
            '泽拉莱斯之饥': [
                // 先处理完整的句子，避免部分匹配
                // "你从泽拉莱斯之饥获得的任何过量治疗..." - 其中"泽拉莱斯之饥"需要特殊颜色
                {
                    pattern: /你从泽拉莱斯之饥获得的任何过量治疗将被投射给至多3名半径3000范围内的盟友,过量治疗量在他们之间均分。/g,
                    replacement: '你从<span style="color: #ffd700;">泽拉莱斯之饥</span>获得的任何<span style="color: #90ee90;">过量治疗</span>将被投射给至多3名半径3000范围内的盟友,<span style="color: #90ee90;">过量治疗量</span>在他们之间均分。'
                },
                // 先处理"泽拉莱斯之饥"（技能名），避免被其他规则匹配
                {
                    pattern: /泽拉莱斯之饥/g,
                    replacement: '<span style="color: #ffd700;">泽拉莱斯之饥</span>'
                },
                // 伤害数值 - 橙色
                {
                    pattern: /造成 5,463 - 6,677 点魔法伤害/g,
                    replacement: '造成 <span style="color: #ff8c00;">5,463 - 6,677</span> 点魔法伤害'
                },
                // "100%" - 橙色（注意：先处理"造成伤害100%"，避免只匹配"100%"）
                {
                    pattern: /造成伤害100%/g,
                    replacement: '造成伤害<span style="color: #ff8c00;">100%</span>'
                },
                // "过量治疗量" - 绿色（先处理完整词，避免被"过量治疗"匹配）
                {
                    pattern: /过量治疗量/g,
                    replacement: '<span style="color: #90ee90;">过量治疗量</span>'
                },
                // "过量治疗" - 绿色（最后处理）
                {
                    pattern: /过量治疗/g,
                    replacement: '<span style="color: #90ee90;">过量治疗</span>'
                }
            ],
            '凛光贮所': [
                // 先处理完整的句子，避免部分匹配
                // "效果结束时,每层剩余凛光会使凛光贮所的冷却时间缩短 0.3 秒。" - 其中"凛光"和"凛光贮所"都是紫色
                {
                    pattern: /效果结束时,每层剩余凛光会使凛光贮所的冷却时间缩短 0\.3 秒。/g,
                    replacement: '效果结束时,每层剩余<span style="color: #9370db;">凛光</span>会使<span style="color: #9370db;">凛光贮所</span>的冷却时间缩短 0.3 秒。'
                },
                // 先处理"凛光贮所"（技能名），避免被"凛光"规则匹配
                {
                    pattern: /凛光贮所/g,
                    replacement: '<span style="color: #9370db;">凛光贮所</span>'
                },
                // 治疗数值 - 绿色
                {
                    pattern: /治疗 3,771 - 4,609 点生命值/g,
                    replacement: '治疗 <span style="color: #90ee90;">3,771 - 4,609</span> 点生命值'
                },
                // "凛光" - 紫色（在其他地方出现的，最后处理）
                {
                    pattern: /凛光/g,
                    replacement: '<span style="color: #9370db;">凛光</span>'
                }
            ],
            '召唤传送门': [
                // 先处理完整的句子，避免部分匹配
                // "同时只能存在1组传送门。" - 整句青色
                {
                    pattern: /同时只能存在 1 组传送门。/g,
                    replacement: '<span style="color: #40e0d0;">同时只能存在 1 组传送门。</span>'
                },
                // "传送门" - 橙色/金黄色（在其他地方出现的）
                {
                    pattern: /传送门/g,
                    replacement: '<span style="color: #ff8c00;">传送门</span>'
                }
            ],
            '复活': [
                // 先处理完整的句子，避免部分匹配
                // "可在战斗中使用。" - 整句青色
                {
                    pattern: /可在战斗中使用。/g,
                    replacement: '<span style="color: #40e0d0;">可在战斗中使用。</span>'
                },
                // "复活一名阵亡的盟友。" - 橙色/橙棕色
                {
                    pattern: /复活一名阵亡的盟友。/g,
                    replacement: '<span style="color: #cd853f;">复活一名阵亡的盟友。</span>'
                }
            ],
            '强效隐形': [
                // 先处理完整的句子，避免部分匹配
                // "只能在战斗外使用。" - 浅绿色
                {
                    pattern: /只能在战斗外使用。/g,
                    replacement: '<span style="color: #90ee90;">只能在战斗外使用。</span>'
                },
                // "强效隐形效果" - 紫色
                {
                    pattern: /强效隐形效果/g,
                    replacement: '<span style="color: #9370db;">强效隐形效果</span>'
                }
            ],
            '回春': [
                // 先处理完整的句子，避免部分匹配
                // "可在全局冷却期间使用。" - 青色
                {
                    pattern: /可在全局冷却期间使用。/g,
                    replacement: '<span style="color: #40e0d0;">可在全局冷却期间使用。</span>'
                },
                // "立即恢复你最大生命值的40%。" - 青色
                {
                    pattern: /立即恢复你最大生命值的40%。/g,
                    replacement: '<span style="color: #40e0d0;">立即恢复你最大生命值的40%。</span>'
                }
            ],
            '庇护': [
                // 先处理完整的句子，避免部分匹配
                // "可在全局冷却期间使用。" - 青色
                {
                    pattern: /可在全局冷却期间使用。/g,
                    replacement: '<span style="color: #40e0d0;">可在全局冷却期间使用。</span>'
                },
                // "15%" - 可能需要特殊颜色，根据图片可能显示为橙色或青色
                {
                    pattern: /15% 伤害减免/g,
                    replacement: '<span style="color: #ff8c00;">15%</span> 伤害减免'
                }
            ],
            '回复魔力值': [
                // 先处理完整的句子，避免部分匹配
                // "可在全局冷却期间使用。" - 青色
                {
                    pattern: /可在全局冷却期间使用。/g,
                    replacement: '<span style="color: #40e0d0;">可在全局冷却期间使用。</span>'
                },
                // "立即恢复你30%的最大魔力值。" - 浅蓝色
                {
                    pattern: /立即恢复你30%的最大魔力值。/g,
                    replacement: '<span style="color: #87ceeb;">立即恢复你30%的最大魔力值。</span>'
                }
            ],
            '血仪狂热': [
                // 先处理完整的句子，避免部分匹配
                // "可在全局冷却期间使用。" - 青色
                {
                    pattern: /可在全局冷却期间使用。/g,
                    replacement: '<span style="color: #40e0d0;">可在全局冷却期间使用。</span>'
                },
                // "50%移动速度提升" - 橙色
                {
                    pattern: /50%移动速度提升/g,
                    replacement: '<span style="color: #ff8c00;">50%移动速度提升</span>'
                }
            ],
            '变鸡术!': [
                // 先处理完整的句子，避免部分匹配
                // "可在全局冷却期间使用。" - 绿色
                {
                    pattern: /可在全局冷却期间使用。/g,
                    replacement: '<span style="color: #90ee90;">可在全局冷却期间使用。</span>'
                },
                // "被变鸡术影响的敌人不会提供杀敌分数。" - 紫色
                {
                    pattern: /被变鸡术影响的敌人不会提供杀敌分数。/g,
                    replacement: '<span style="color: #9370db;">被变鸡术影响的敌人不会提供杀敌分数。</span>'
                },
                // "每次地下城中仅能使用有限次数。使用次数由全队共享。" - 橙色
                {
                    pattern: /每次地下城中仅能使用有限次数。使用次数由全队共享。/g,
                    replacement: '<span style="color: #ff8c00;">每次地下城中仅能使用有限次数。使用次数由全队共享。</span>'
                }
            ],
            '强效驱散': [
                // 先处理完整的句子，避免部分匹配
                // "可在全局冷却期间使用。" - 青色
                {
                    pattern: /可在全局冷却期间使用。/g,
                    replacement: '<span style="color: #40e0d0;">可在全局冷却期间使用。</span>'
                }
            ],
            '不屈绽放': [
                // "护盾" - 青色
                {
                    pattern: /护盾/g,
                    replacement: '<span style="color: #40e0d0;">护盾</span>'
                },
                // "智力" - 青色
                {
                    pattern: /智力/g,
                    replacement: '<span style="color: #40e0d0;">智力</span>'
                },
                // "不屈绽放" - 橙色
                {
                    pattern: /不屈绽放/g,
                    replacement: '<span style="color: #ff8c00;">不屈绽放</span>'
                }
            ]
            // 可以在这里添加更多预设规则
            // '其他技能名': [...]
        };

        return presets[skillName] || [];
    }
}

// 应用核心逻辑
class BuildSimulator {
    constructor() {
        this.currentBuild = {
            hero: null,
            head: null,
            shoulder: null,
            cloak: null,
            chest: null,
            hands: null,
            legs: null,
            feet: null,
            necklace: null,
            wrist: null,
            ring1: null,
            ring2: null,
            relic1: null,
            relic2: null,
            weapon: null
        };
        
        // 宝石数据：{ slotId: { gemId: string, essence: number } }
        // 每个槽位只能镶嵌一个宝石，可以设置源质加成
        this.gems = {};
        
        this.baseStats = {
            // 一级
            health: 0,
            defense: 0,          // 护甲
            physicalDR: 0,       // 物伤减免 %
            magicDR: 0,          // 魔伤减免 %
            // 二级
            stamina: 0,
            intellect: 0,
            // 三级
            critRate: 0,         // 暴击 %
            mastery: 0,          // 精通 %
            haste: 0,            // 急速 %
            spirit: 0,
            // 四级
            dodge: 0,            // 闪避 %
            moveSpeed: 0,        // 移速 %
            // 其他保留
            attack: 0,
            critDamage: 0,
            mana: 0,
            cooldown: 0
        };
        
        // 用于跟踪正在进行的图标加载操作
        this.loadingIcons = new Map();
        
        // 数据引用（将在init时设置）
        this.heroData = [];
        this.equipmentData = {};
        this.slotIcons = {};
        this.gemData = [];
        this.gemSkillsData = {};
        this.setsData = [];
    }
    
    async init() {
        try {
            // 从JSON文件加载数据（强制重新加载以确保获取最新数据）
            console.log('开始从JSON文件加载数据...');
            await dataLoader.loadAll(true); // 强制重新加载
            console.log('JSON文件加载成功');
            
            // 获取数据引用
            this.heroData = dataLoader.getHeroData();
            this.equipmentData = dataLoader.getEquipmentData();
            this.slotIcons = dataLoader.getSlotIcons();
            this.gemData = dataLoader.getGemData();
            this.gemSkillsData = dataLoader.getGemSkillsData();
            this.setsData = dataLoader.getSetsData();
            
            console.log('宝石技能数据:', this.gemSkillsData);
            
            // 验证数据是否加载成功
            if (!this.heroData || this.heroData.length === 0) {
                throw new Error('英雄数据加载失败：数据为空');
            }
            if (!this.equipmentData || Object.keys(this.equipmentData).length === 0) {
                throw new Error('装备数据加载失败：数据为空');
            }
            if (!this.slotIcons || Object.keys(this.slotIcons).length === 0) {
                throw new Error('槽位图标加载失败：数据为空');
            }
            
            console.log('英雄数据:', this.heroData.length);
            console.log('装备数据:', Object.keys(this.equipmentData));
            console.log('槽位图标:', Object.keys(this.slotIcons));
            
            this.populateHeroSelect();
            this.populateEquipmentSelects();
            this.attachEventListeners();
            this.loadSavedBuilds();
            this.updateStats();
            this.updateSlotIcons();
            
            console.log('应用初始化完成');
        } catch (error) {
            console.error('应用初始化失败:', error);
            alert('数据加载失败：' + error.message + '\n\n请检查控制台错误信息。\n\n提示：使用file://协议可能无法加载JSON文件，请使用本地服务器运行（如：python -m http.server 8000）。');
            throw error; // 重新抛出错误，防止继续执行
        }
    }
    
    populateHeroSelect() {
        const heroSelect = document.getElementById('hero');
        this.heroData.forEach(hero => {
            const option = document.createElement('option');
            option.value = hero.id;
            option.textContent = hero.name;
            heroSelect.appendChild(option);
        });
    }
    
    populateEquipmentSelects() {
        // 装备槽位与数据分类的映射
        const equipmentMapping = {
            head: 'head',
            shoulder: 'shoulder',
            cloak: 'cloak',
            chest: 'chest',
            hands: 'hands',
            legs: 'legs',
            feet: 'feet',
            necklace: 'necklace',
            wrist: 'wrist',
            ring1: 'ring',
            ring2: 'ring',
            relic1: 'relic',
            relic2: 'relic',
            weapon: 'weapon'
        };
        
        // 填充所有装备选项
        Object.keys(equipmentMapping).forEach(slotId => {
            const select = document.getElementById(slotId);
            if (select) {
                const category = equipmentMapping[slotId];
                if (this.equipmentData[category]) {
                    this.equipmentData[category].forEach(item => {
                        const option = document.createElement('option');
                        option.value = item.id;
                        option.textContent = item.name;
                        select.appendChild(option);
                    });
                }
            }
        });

        // 初始化槽位图标背景（默认图标）
        const allSlots = Object.keys(equipmentMapping);
        allSlots.forEach(slotId => {
            const btn = document.querySelector(`.slot-icon[data-slot="${slotId}"]`);
            if (btn && this.slotIcons && this.slotIcons[slotId]) {
                this.setButtonIcon(btn, this.slotIcons[slotId], slotId);
            }
        });
    }
    
    attachEventListeners() {
        // 英雄选择变化事件
        const heroSelect = document.getElementById('hero');
        heroSelect.addEventListener('change', (e) => {
            this.handleHeroChange(e.target.value);
        });
        
        // 装备选择变化事件
        const equipmentSelects = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        equipmentSelects.forEach(slotId => {
            const select = document.getElementById(slotId);
            if (select) {
                select.addEventListener('change', (e) => {
                    this.handleEquipmentChange(slotId, e.target.value);
                });
            }
        });

        // 图标按钮 -> 打开装备选择器
        const iconButtons = document.querySelectorAll('.slot-icon');
        iconButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const slotId = btn.getAttribute('data-slot');
                this.openEquipmentPicker(slotId);
            });
        });
        
        // 宝石插槽按钮 -> 打开宝石选择器（使用事件委托，支持动态显示的按钮）
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('gem-socket')) {
                const slotId = e.target.getAttribute('data-slot');
                if (slotId) {
                    this.openGemPicker(slotId);
                }
            }
        });
        
        // 宝石选择弹窗关闭按钮
        const gemPickerClose = document.getElementById('gemPickerClose');
        if (gemPickerClose) {
            gemPickerClose.addEventListener('click', () => {
                this.closeGemPicker();
            });
        }
        
        // 按钮事件
        document.getElementById('saveBtn').addEventListener('click', () => this.saveBuild());
        document.getElementById('loadBtn').addEventListener('click', () => this.showLoadDialog());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetBuild());
    }
    
    handleHeroChange(heroId) {
        if (heroId === '') {
            this.currentBuild.hero = null;
            this.baseStats = {
                // 一级
                health: 0,
                defense: 0,
                physicalDR: 0,
                magicDR: 0,
                // 二级
                stamina: 0,
                intellect: 0,
                // 三级
                critRate: 0,
                mastery: 0,
                haste: 0,
                spirit: 0,
                // 四级
                dodge: 0,
                moveSpeed: 0,
                // 其他保留
                attack: 0,
                critDamage: 0,
                mana: 0,
                cooldown: 0
            };
            const heroInfo = document.getElementById('heroInfo');
            const heroAvatar = document.getElementById('heroAvatar');
            const existingContent = heroInfo.querySelector('.hero-info-content');
            if (existingContent) {
                existingContent.remove();
            }
            if (heroAvatar) {
                heroAvatar.style.display = 'none';
            }
            
            // 清空所有装备
            this.clearAllEquipment();
            // 清空后不需要再调用updateSlotIcons，因为clearAllEquipment已经处理了
        } else {
            this.currentBuild.hero = heroId;
            const hero = this.heroData.find(h => h.id === heroId);
            if (hero) {
                this.baseStats = { ...hero.baseStats };
                this.updateHeroInfo(hero);
            }
            
            // 清空所有装备（切换英雄时清空所有装备栏）
            this.clearAllEquipment();
            // 清空后不需要再调用updateSlotIcons，因为clearAllEquipment已经处理了
        }
        this.updateStats();
        // 只在有装备时才更新图标，避免覆盖clearAllEquipment的设置
        if (this.currentBuild.hero) {
            this.updateSlotIcons();
        }
    }
    
    updateHeroInfo(hero) {
        const heroInfo = document.getElementById('heroInfo');
        const heroAvatar = document.getElementById('heroAvatar');
        
        // 更新头像
        if (heroAvatar) {
            if (hero.avatar) {
                // 先显示头像框
                heroAvatar.style.display = 'block';
                // 使用图片预加载，确保图片加载成功后再显示
                const img = new Image();
                img.onload = () => {
                    heroAvatar.style.backgroundImage = `url(${hero.avatar})`;
                };
                img.onerror = () => {
                    // 图片加载失败，显示占位符背景
                    console.warn(`头像加载失败: ${hero.avatar}`);
                    heroAvatar.style.backgroundImage = 'none';
                    heroAvatar.style.backgroundColor = 'var(--bg-hover)';
                };
                img.src = hero.avatar;
            } else {
                heroAvatar.style.display = 'none';
            }
        }
        
        // 更新信息内容
        const contentDiv = document.createElement('div');
        contentDiv.className = 'hero-info-content';
        contentDiv.innerHTML = `
            <div class="hero-name">${hero.name}</div>
            <div class="hero-description">${hero.description}</div>
            <div class="hero-base-stats">
                <div class="base-stat-item">基础攻击: ${hero.baseStats.attack}</div>
                <div class="base-stat-item">基础防御: ${hero.baseStats.defense}</div>
                <div class="base-stat-item">基础生命: ${hero.baseStats.health}</div>
                <div class="base-stat-item">基础魔法: ${hero.baseStats.mana}</div>
            </div>
        `;
        
        // 清空并重新填充（保留头像元素）
        const existingContent = heroInfo.querySelector('.hero-info-content');
        if (existingContent) {
            existingContent.remove();
        }
        heroInfo.appendChild(contentDiv);
    }
    
    getHeroStats() {
        if (!this.currentBuild.hero) return null;
        return this.heroData.find(hero => hero.id === this.currentBuild.hero);
    }
    
    handleEquipmentChange(slotId, equipmentId) {
        if (equipmentId === '') {
            this.currentBuild[slotId] = null;
        } else {
            // 获取要装备的物品
            let category = slotId;
            if (slotId === 'ring1' || slotId === 'ring2') category = 'ring';
            if (slotId === 'relic1' || slotId === 'relic2') category = 'relic';
            
            const item = this.equipmentData[category]?.find(i => i.id === equipmentId);
            
            // 如果是遗物槽位，检查是否已装备相同ID的遗物
            if ((slotId === 'relic1' || slotId === 'relic2')) {
                const otherRelicSlot = slotId === 'relic1' ? 'relic2' : 'relic1';
                if (this.currentBuild[otherRelicSlot] === equipmentId) {
                    alert('该遗物已在另一个遗物槽位装备，遗物具有唯一性，不能重复装备！');
                    // 恢复原选择
                    const select = document.getElementById(slotId);
                    if (select) {
                        select.value = this.currentBuild[slotId] || '';
                    }
                    return;
                }
            }
            
            // 如果是传奇装备，检查是否已装备其他传奇装备
            if (item && item.rarity === 'legendary') {
                const allSlots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
                for (const otherSlot of allSlots) {
                    if (otherSlot === slotId) continue; // 跳过当前槽位
                    const otherItem = this.getEquipmentStats(otherSlot);
                    if (otherItem && otherItem.rarity === 'legendary') {
                        alert('英雄只能装备一件传奇装备，请先卸下其他传奇装备！');
                        // 恢复原选择
                        const select = document.getElementById(slotId);
                        if (select) {
                            select.value = this.currentBuild[slotId] || '';
                        }
                        return;
                    }
                }
            }
            
            this.currentBuild[slotId] = equipmentId;
        }
        this.updateStats();
        this.updateSlotIcons();
    }
    
    getEquipmentStats(slotId) {
        if (!this.currentBuild[slotId]) return null;
        
        const equipmentId = this.currentBuild[slotId];
        let category = slotId;
        
        // 处理戒指和遗物的分类映射
        if (slotId === 'ring1' || slotId === 'ring2') {
            category = 'ring';
        } else if (slotId === 'relic1' || slotId === 'relic2') {
            category = 'relic';
        }
        
        return this.equipmentData[category] ? this.equipmentData[category].find(item => item.id === equipmentId) : null;
    }
    
    /**
     * 获取激活的宝石技能（考虑替代逻辑）
     * @returns {Array} 激活的技能列表
     */
    getActiveGemSkills() {
        // 统计每种宝石类型的总能量（考虑源质加成）
        const gemEnergies = {};
        const slots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        
        slots.forEach(slotId => {
            const gemInfo = this.gems[slotId];
            if (gemInfo && gemInfo.gemId) {
                const gem = this.gemData.find(g => g.id === gemInfo.gemId);
                if (gem) {
                    let essence = 0;
                    if (gemInfo.essence !== undefined && gemInfo.essence !== null) {
                        essence = parseInt(gemInfo.essence) || 0;
                    }
                    const essenceMultiplier = 1 + (essence / 100);
                    const effectiveEnergy = gem.energy * essenceMultiplier;
                    
                    if (!gemEnergies[gem.type]) {
                        gemEnergies[gem.type] = {
                            type: gem.type,
                            typeName: gem.typeName,
                            color: gem.color,
                            totalEnergy: 0
                        };
                    }
                    gemEnergies[gem.type].totalEnergy += effectiveEnergy;
                }
            }
        });
        
        // 检查每种宝石类型的能量是否达到技能要求
        const activeSkills = [];
        const replacedSkills = new Set();
        
        Object.keys(gemEnergies).forEach(type => {
            const energy = gemEnergies[type].totalEnergy;
            const skills = this.gemSkillsData[type] || [];
            
            const potentialSkills = [];
            skills.forEach(skill => {
                if (energy >= skill.energyRequirement) {
                    potentialSkills.push({
                        ...skill,
                        type: type,
                        typeName: gemEnergies[type].typeName,
                        color: gemEnergies[type].color,
                        currentEnergy: energy
                    });
                }
            });
            
            // 处理技能替换逻辑
            potentialSkills.forEach(skill => {
                if (skill.tier === 2 && skill.replaces) {
                    replacedSkills.add(skill.replaces);
                }
            });
            
            // 添加所有未被替代的技能
            potentialSkills.forEach(skill => {
                if (!replacedSkills.has(skill.id)) {
                    activeSkills.push(skill);
                }
            });
        });
        
        return activeSkills;
    }
    
    /**
     * 解析技能描述，提取属性加成
     * @param {string} description - 技能描述
     * @returns {Object} - 包含属性加成的对象
     */
    parseSkillStats(description) {
        const stats = {
            // 直接属性加成
            stamina: 0,
            intellect: 0,
            critRate: 0,
            mastery: 0,
            haste: 0,
            spirit: 0,
            // 百分比属性加成（需要用 属性 * (1 + 百分比) 公式）
            staminaPercentMultiplier: 0,
            intellectPercentMultiplier: 0,
            critRatePercentMultiplier: 0,
            masteryPercentMultiplier: 0,
            hastePercentMultiplier: 0,
            spiritPercentMultiplier: 0,
            // 百分比率加成（在计算完派生属性后额外增加）
            critRatePercentBonus: 0,
            masteryRatePercentBonus: 0,
            hasteRatePercentBonus: 0,
            spiritRatePercentBonus: 0
        };
        
        if (!description) return stats;
        
        // 解析直接属性加成（如 "+100 耐力", "+100 暴击", "+100 灵魂值", "+8 力量/智力/敏捷"）
        // 这些是直接加到属性值上的数值（注意：不是百分比格式）
        const directStatPatterns = [
            { pattern: /\+(\d+(?:\.\d+)?)\s+耐力(?!%)/g, stat: 'stamina' }, // "+100 耐力" 而不是 "+100% 耐力"
            { pattern: /\+(\d+(?:\.\d+)?)\s+智力(?!%)/g, stat: 'intellect' },
            { pattern: /\+(\d+(?:\.\d+)?)\s+暴击(?!%|率)/g, stat: 'critRate' }, // "+100 暴击" 而不是 "+100% 暴击" 或 "+100% 暴击率"
            { pattern: /\+(\d+(?:\.\d+)?)\s+精通(?!%|率)/g, stat: 'mastery' },
            { pattern: /\+(\d+(?:\.\d+)?)\s+急速(?!%|率)/g, stat: 'haste' },
            { pattern: /\+(\d+(?:\.\d+)?)\s+灵魂(?!值|%|率)/g, stat: 'spirit' },
            { pattern: /\+(\d+(?:\.\d+)?)\s+灵魂值(?!%)/g, stat: 'spirit' },
            // 力量/智力/敏捷（主要属性，假设使用智力）
            { pattern: /\+(\d+)\s+力量\/智力\/敏捷(?!%)/g, stat: 'intellect' }
        ];
        
        directStatPatterns.forEach(({ pattern, stat }) => {
            let match;
            while ((match = pattern.exec(description)) !== null) {
                const value = parseFloat(match[1]);
                if (!isNaN(value)) {
                    stats[stat] += value;
                }
            }
        });
        
        // 解析百分比属性加成（如 "+3% 耐力", "+2% 智力", "+3% 精通", "+0.5% 暴击"）
        // 这些需要用 属性 * (1 + 百分比) 公式计算
        const percentStatMultiplierPatterns = [
            { pattern: /\+(\d+(?:\.\d+)?)%\s*耐力/g, stat: 'staminaPercentMultiplier' },
            { pattern: /\+(\d+(?:\.\d+)?)%\s*智力/g, stat: 'intellectPercentMultiplier' },
            { pattern: /\+(\d+(?:\.\d+)?)%\s*暴击(?!率)/g, stat: 'critRatePercentMultiplier' }, // "+0.5% 暴击"
            { pattern: /\+(\d+(?:\.\d+)?)%\s*精通(?!率)/g, stat: 'masteryPercentMultiplier' }, // "+3% 精通"
            { pattern: /\+(\d+(?:\.\d+)?)%\s*急速(?!率)/g, stat: 'hastePercentMultiplier' }, // "+3% 急速"
            { pattern: /\+(\d+(?:\.\d+)?)%\s*灵魂(?!率)/g, stat: 'spiritPercentMultiplier' },
            { pattern: /\+(\d+(?:\.\d+)?)%\s*灵魂值/g, stat: 'spiritPercentMultiplier' },
            // 力量/智力/敏捷百分比加成
            { pattern: /\+(\d+(?:\.\d+)?)%\s*力量\/智力\/敏捷/g, stat: 'intellectPercentMultiplier' }
        ];
        
        percentStatMultiplierPatterns.forEach(({ pattern, stat }) => {
            let match;
            while ((match = pattern.exec(description)) !== null) {
                const value = parseFloat(match[1]);
                if (!isNaN(value)) {
                    stats[stat] += value;
                }
            }
        });
        
        // 解析百分比率加成（如 "+3% 暴击率", "+9% 精通率"）
        // 这些是在计算完派生属性后额外增加的百分比
        const percentRatePatterns = [
            { pattern: /\+(\d+(?:\.\d+)?)%\s*暴击率/g, stat: 'critRatePercentBonus' },
            { pattern: /\+(\d+(?:\.\d+)?)%\s*精通率/g, stat: 'masteryRatePercentBonus' },
            { pattern: /\+(\d+(?:\.\d+)?)%\s*急速率/g, stat: 'hasteRatePercentBonus' },
            { pattern: /\+(\d+(?:\.\d+)?)%\s*灵魂率/g, stat: 'spiritRatePercentBonus' }
        ];
        
        percentRatePatterns.forEach(({ pattern, stat }) => {
            let match;
            while ((match = pattern.exec(description)) !== null) {
                const value = parseFloat(match[1]);
                if (!isNaN(value)) {
                    stats[stat] += value;
                }
            }
        });
        
        return stats;
    }
    
    calculateStats() {
        // 从英雄基础属性开始
        const stats = { ...this.baseStats };
        
        // 计算所有装备的属性
        const slots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        slots.forEach(slotId => {
            const equipment = this.getEquipmentStats(slotId);
            if (equipment) {
                // 遍历装备的所有属性，确保所有属性都被累加
                Object.keys(equipment).forEach(stat => {
                    // 跳过非数字属性（如 id, name, icon, heroes, abilityName, abilityDesc 等）
                    if (stat === 'id' || stat === 'name' || stat === 'icon' || stat === 'heroes' || 
                        stat === 'abilityName' || stat === 'abilityDesc' || stat === 'abilityCritBonus' ||
                        stat === 'relicAbilityName' || stat === 'relicAbilityDesc' ||
                        stat === 'rarity' || stat === 'legendaryEffectName' || stat === 'legendaryEffectDesc') {
                        return;
                    }
                    // 如果属性值是数字，则累加
                    if (typeof equipment[stat] === 'number') {
                        // 如果 stats 中还没有这个属性，初始化为0
                        if (stats[stat] === undefined) {
                            stats[stat] = 0;
                        }
                        stats[stat] += equipment[stat];
                    }
                });
            }
            
            // 宝石能量不纳入统计（仅用于显示）
        });
        
        // 应用宝石技能的直接属性加成
        const activeSkills = this.getActiveGemSkills();
        activeSkills.forEach(skill => {
            const skillStats = this.parseSkillStats(skill.description);
            // 累加直接属性加成
            Object.keys(skillStats).forEach(stat => {
                if (stat.endsWith('PercentBonus') || stat.endsWith('PercentMultiplier')) {
                    // 百分比加成稍后处理
                    return;
                }
                if (stats[stat] === undefined) {
                    stats[stat] = 0;
                }
                stats[stat] += skillStats[stat];
            });
        });
        
        // 应用百分比属性加成（使用乘法公式：属性 * (1 + 总百分比)）
        // 注意：这些需要在计算派生属性之前应用
        // 先累加所有百分比加成，然后一次性应用
        let totalStaminaPercent = 0;
        let totalIntellectPercent = 0;
        let totalCritRatePercent = 0;
        let totalMasteryPercent = 0;
        let totalHastePercent = 0;
        let totalSpiritPercent = 0;
        
        activeSkills.forEach(skill => {
            const skillStats = this.parseSkillStats(skill.description);
            totalStaminaPercent += skillStats.staminaPercentMultiplier || 0;
            totalIntellectPercent += skillStats.intellectPercentMultiplier || 0;
            totalCritRatePercent += skillStats.critRatePercentMultiplier || 0;
            totalMasteryPercent += skillStats.masteryPercentMultiplier || 0;
            totalHastePercent += skillStats.hastePercentMultiplier || 0;
            totalSpiritPercent += skillStats.spiritPercentMultiplier || 0;
        });
        
        // 应用累加后的百分比加成
        if (totalStaminaPercent > 0) {
            stats.stamina = (stats.stamina || 0) * (1 + totalStaminaPercent / 100);
        }
        if (totalIntellectPercent > 0) {
            stats.intellect = (stats.intellect || 0) * (1 + totalIntellectPercent / 100);
        }
        if (totalCritRatePercent > 0) {
            stats.critRate = (stats.critRate || 0) * (1 + totalCritRatePercent / 100);
        }
        if (totalMasteryPercent > 0) {
            stats.mastery = (stats.mastery || 0) * (1 + totalMasteryPercent / 100);
        }
        if (totalHastePercent > 0) {
            stats.haste = (stats.haste || 0) * (1 + totalHastePercent / 100);
        }
        if (totalSpiritPercent > 0) {
            stats.spirit = (stats.spirit || 0) * (1 + totalSpiritPercent / 100);
        }
        
        // 计算派生属性（暴击率、精通率、急速率、灵魂率）
        this.calculateDerivedStats(stats);
        
        // 应用宝石技能的百分比率加成（在计算完派生属性后）
        activeSkills.forEach(skill => {
            const skillStats = this.parseSkillStats(skill.description);
            // 应用百分比率加成到派生属性
            if (skillStats.critRatePercentBonus > 0) {
                stats.critRatePercent += skillStats.critRatePercentBonus;
            }
            if (skillStats.masteryRatePercentBonus > 0) {
                stats.masteryRatePercent += skillStats.masteryRatePercentBonus;
            }
            if (skillStats.hasteRatePercentBonus > 0) {
                stats.hasteRatePercent += skillStats.hasteRatePercentBonus;
            }
            if (skillStats.spiritRatePercentBonus > 0) {
                stats.spiritRatePercent += skillStats.spiritRatePercentBonus;
            }
        });
        
        return stats;
    }
    
    /**
     * 计算派生属性（由基础属性计算得出的百分比属性）
     * 这些属性不在前端显示，但用于内部计算
     * @param {Object} stats - 包含基础属性的统计对象
     * @returns {Object} - 添加了派生属性的统计对象
     */
    calculateDerivedStats(stats) {
        // 暴击率计算公式：暴击属性值转换为百分比
        // 可在此处调整计算公式
        stats.critRatePercent = this.calculateCritRatePercent(stats.critRate || 0);
        
        // 精通率计算公式：精通属性值转换为百分比
        stats.masteryRatePercent = this.calculateMasteryRatePercent(stats.mastery || 0);
        
        // 急速率计算公式：急速属性值转换为百分比
        stats.hasteRatePercent = this.calculateHasteRatePercent(stats.haste || 0);
        
        // 灵魂率计算公式：灵魂属性值转换为百分比
        stats.spiritRatePercent = this.calculateSpiritRatePercent(stats.spirit || 0);
        
        return stats;
    }
    
    /**
     * 计算暴击率百分比
     * @param {number} critRate - 暴击属性值
     * @returns {number} - 暴击率百分比（0-100）
     */
    calculateCritRatePercent(critRate) {
        // 计算公式：可在此处调整
        // 示例：假设每100点暴击属性 = 1%暴击率
        return critRate / 100;
    }
    
    /**
     * 计算精通率百分比
     * @param {number} mastery - 精通属性值
     * @returns {number} - 精通率百分比（0-100）
     */
    calculateMasteryRatePercent(mastery) {
        // 计算公式：可在此处调整
        // 示例：假设每100点精通属性 = 1%精通率
        return mastery / 100;
    }
    
    /**
     * 计算急速率百分比
     * @param {number} haste - 急速属性值
     * @returns {number} - 急速率百分比（0-100）
     */
    calculateHasteRatePercent(haste) {
        // 计算公式：可在此处调整
        // 示例：假设每100点急速属性 = 1%急速率
        return haste / 100;
    }
    
    /**
     * 计算灵魂率百分比
     * @param {number} spirit - 灵魂属性值
     * @returns {number} - 灵魂率百分比（0-100）
     */
    calculateSpiritRatePercent(spirit) {
        // 计算公式：可在此处调整
        // 示例：假设每100点灵魂属性 = 1%灵魂率
        return spirit / 100;
    }
    
    updateStats() {
        const stats = this.calculateStats();
        
        // 更新显示
        // 一级
        document.getElementById('health').textContent = stats.health;
        document.getElementById('armor').textContent = stats.defense;
        document.getElementById('physicalDR').textContent = (stats.physicalDR || 0).toFixed(1) + '%';
        document.getElementById('magicDR').textContent = (stats.magicDR || 0).toFixed(1) + '%';
        // 二级
        document.getElementById('stamina').textContent = stats.stamina || 0;
        document.getElementById('intellect').textContent = stats.intellect || 0;
        // 三级（按数字展示，不加百分号）
        document.getElementById('crit').textContent = (stats.critRate || 0).toFixed(0);
        document.getElementById('mastery').textContent = (stats.mastery || 0).toFixed(0);
        document.getElementById('haste').textContent = (stats.haste || 0).toFixed(0);
        document.getElementById('spirit').textContent = stats.spirit || 0;
        // 四级
        document.getElementById('dodge').textContent = (stats.dodge || 0).toFixed(1) + '%';
        document.getElementById('moveSpeed').textContent = (stats.moveSpeed || 0).toFixed(1) + '%';
        
        // 更新武器技能词条
        this.updateWeaponSkill();
        // 更新遗物技能词条
        this.updateRelicSkill();
        // 更新传奇特效
        this.updateLegendaryEffect();
        // 更新套装效果
        this.updateSetBonus();
        // 更新宝石技能
        this.updateGemSkills();
    }
    
    updateGemSkills() {
        const container = document.getElementById('gemSkillsList');
        if (!container) return;
        
        container.innerHTML = '';
        
        // 使用统一的获取激活技能方法
        const activeSkills = this.getActiveGemSkills();
        
        // 显示激活的技能（使用图标网格布局）
        if (activeSkills.length === 0) {
            container.innerHTML = '<div class="empty-state">当前无激活的宝石技能</div>';
            return;
        }
        
        activeSkills.forEach(skill => {
            const skillIcon = document.createElement('div');
            skillIcon.className = 'gem-skill-icon';
            skillIcon.dataset.skillId = skill.id;
            
            // 如果是上位技能（tier 2），添加高亮边框类
            if (skill.tier === 2) {
                skillIcon.classList.add('gem-skill-tier-2');
            }
            
            // 设置图标背景
            if (skill.icon) {
                skillIcon.style.backgroundImage = `url(${skill.icon})`;
            } else {
                // 如果没有图标，使用颜色作为背景
                skillIcon.style.backgroundColor = skill.color;
                skillIcon.style.opacity = '0.3';
            }
            
            // 创建悬停提示框
            const tooltip = document.createElement('div');
            tooltip.className = 'gem-skill-tooltip';
            
            // 动态计算tooltip位置，避免超出边界
            const updateTooltipPosition = () => {
                const rect = skillIcon.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                const tooltipWidth = 280;
                const tooltipHalfWidth = tooltipWidth / 2;
                
                // 计算图标中心相对于容器的位置
                const iconCenterX = rect.left - containerRect.left + rect.width / 2;
                
                // 计算tooltip相对于图标的位置（图标中心到tooltip左边的距离）
                const tooltipLeftFromIcon = iconCenterX - tooltipHalfWidth;
                const tooltipRightFromIcon = iconCenterX + tooltipHalfWidth;
                
                // 如果tooltip会超出左边界
                if (tooltipLeftFromIcon < 0) {
                    tooltip.style.left = '0';
                    tooltip.style.transform = 'translateX(0) translateY(8px)';
                    // 箭头指向图标中心，从tooltip左边缘向右偏移图标中心X的距离
                    tooltip.style.setProperty('--arrow-offset', `${iconCenterX}px`);
                }
                // 如果tooltip会超出右边界
                else if (tooltipRightFromIcon > containerRect.width) {
                    tooltip.style.left = 'auto';
                    tooltip.style.right = '0';
                    tooltip.style.transform = 'translateX(0) translateY(8px)';
                    // 箭头指向图标中心，从tooltip右边缘向左计算
                    // 图标中心到容器右边缘的距离
                    const distanceFromRight = containerRect.width - iconCenterX;
                    tooltip.style.setProperty('--arrow-offset', `calc(100% - ${distanceFromRight}px)`);
                }
                // 正常居中显示
                else {
                    // 使用图标中心作为tooltip的中心点
                    const tooltipLeft = iconCenterX - tooltipHalfWidth;
                    tooltip.style.left = `${tooltipLeft}px`;
                    tooltip.style.transform = 'translateY(8px)';
                    // 箭头在tooltip的正中央，指向图标中心
                    tooltip.style.setProperty('--arrow-offset', '50%');
                }
            };
            
            // 在图标显示后计算位置
            skillIcon.addEventListener('mouseenter', () => {
                // 使用setTimeout确保DOM已更新
                setTimeout(() => {
                    updateTooltipPosition();
                }, 0);
            });
            
            const tooltipHeader = document.createElement('div');
            tooltipHeader.className = 'gem-skill-tooltip-header';
            
            const tooltipName = document.createElement('div');
            tooltipName.className = 'gem-skill-tooltip-name';
            tooltipName.textContent = skill.name;
            
            const tooltipType = document.createElement('div');
            tooltipType.className = 'gem-skill-tooltip-type';
            tooltipType.textContent = skill.typeName;
            tooltipType.style.color = skill.color;
            
            tooltipHeader.appendChild(tooltipName);
            tooltipHeader.appendChild(tooltipType);
            
            const tooltipDesc = document.createElement('div');
            tooltipDesc.className = 'gem-skill-tooltip-desc';
            tooltipDesc.textContent = skill.description;
            tooltipDesc.style.whiteSpace = 'pre-line';
            
            const tooltipEnergy = document.createElement('div');
            tooltipEnergy.className = 'gem-skill-tooltip-energy';
            tooltipEnergy.textContent = `能量要求: ${skill.energyRequirement} | 当前: ${Math.floor(skill.currentEnergy)}`;
            
            tooltip.appendChild(tooltipHeader);
            tooltip.appendChild(tooltipDesc);
            tooltip.appendChild(tooltipEnergy);
            
            skillIcon.appendChild(tooltip);
            container.appendChild(skillIcon);
        });
    }
    
    clearAllEquipment() {
        // 取消所有正在进行的图标加载操作
        this.loadingIcons.forEach((img, slotId) => {
            img.onload = null;
            img.onerror = null;
            img.src = '';
        });
        this.loadingIcons.clear();
        
        // 清空所有宝石数据（重置为空对象）
        Object.keys(this.gems).forEach(slotId => {
            this.gems[slotId] = {};
        });
        
        // 强制清空所有装备和图标
        const slots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        slots.forEach(slotId => {
            // 清空装备数据
            this.currentBuild[slotId] = null;
            
            // 清空选择框
            const select = document.getElementById(slotId);
            if (select) {
                select.value = '';
            }
            
            // 强制清空图标和名称（同步执行，确保立即生效）
            const btn = document.querySelector(`.slot-icon[data-slot="${slotId}"]`);
            const nameSpan = document.getElementById(`${slotId}-name`);
            
            if (btn) {
                // 移除选中状态
                btn.classList.remove('selected');
                
                // 立即清除所有可能存在的异步操作标记
                btn.removeAttribute('data-equipment-id');
                btn.dataset.equipmentId = '';
                
                // 先完全清除背景图片（包括装备图片）
                btn.style.removeProperty('background-image');
                
                // 立即恢复默认图标（直接覆盖，使用!important确保覆盖任何现有样式）
                if (this.slotIcons && this.slotIcons[slotId]) {
                    btn.style.setProperty('background-image', `url(${this.slotIcons[slotId]})`, 'important');
                    btn.style.setProperty('background-color', '', 'important');
                } else {
                    btn.style.setProperty('background-image', 'none', 'important');
                }
                
                // 恢复标题
                const label = btn.getAttribute('data-label') || '';
                btn.title = label;
                
                // 强制清除可能残留的样式
                btn.style.setProperty('background-size', '', 'important');
                btn.style.setProperty('background-position', '', 'important');
            }
            
            // 清空名称显示
            if (nameSpan) {
                nameSpan.textContent = '';
            }
            
            // 隐藏并清空宝石插槽
            const gemSocket = document.querySelector(`.gem-socket[data-slot="${slotId}"]`);
            if (gemSocket) {
                gemSocket.style.display = 'none';
                gemSocket.classList.remove('has-gem');
            }
        });
        
        // 特别处理武器图标，确保被清空（多重保险）
        const weaponBtn = document.querySelector('.slot-icon[data-slot="weapon"]');
        if (weaponBtn) {
            // 强制清除所有样式和状态
            weaponBtn.classList.remove('selected');
            weaponBtn.removeAttribute('data-equipment-id');
            weaponBtn.dataset.equipmentId = '';
            
            // 先完全清除背景图片（包括装备图片）
            weaponBtn.style.removeProperty('background-image');
            
            // 立即设置默认图标（直接覆盖，使用!important确保覆盖任何现有样式）
            if (this.slotIcons && this.slotIcons.weapon) {
                weaponBtn.style.setProperty('background-image', `url(${this.slotIcons.weapon})`, 'important');
            } else {
                weaponBtn.style.setProperty('background-image', 'none', 'important');
            }
            
            weaponBtn.style.setProperty('background-color', '', 'important');
            weaponBtn.style.setProperty('background-size', '', 'important');
            weaponBtn.style.setProperty('background-position', '', 'important');
            weaponBtn.title = '武器';
            
            // 清空武器名称
            const weaponName = document.getElementById('weapon-name');
            if (weaponName) {
                weaponName.textContent = '';
            }
        } else {
            console.error('未找到武器按钮元素！');
        }
        
        // 延迟再次检查，确保异步操作不会覆盖（使用 setTimeout 0 确保在下一个事件循环执行）
        setTimeout(() => {
            const allSlots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
            allSlots.forEach(slotId => {
                if (this.currentBuild[slotId] === null) {
                    const btn = document.querySelector(`.slot-icon[data-slot="${slotId}"]`);
                    if (btn && btn.dataset.equipmentId === '') {
                        // 如果装备已被清空，确保图标是默认的
                        if (this.slotIcons && this.slotIcons[slotId]) {
                            btn.style.backgroundImage = `url(${this.slotIcons[slotId]})`;
                        }
                    }
                }
            });
        }, 0);
    }
    
    updateSlotIcons() {
        const slots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        slots.forEach(slotId => {
            const btn = document.querySelector(`.slot-icon[data-slot="${slotId}"]`);
            const nameSpan = document.getElementById(`${slotId}-name`);
            const gemSocket = document.querySelector(`.gem-socket[data-slot="${slotId}"]`);
            if (!btn) return;
            if (this.currentBuild[slotId]) {
                btn.classList.add('selected');
                const equip = this.getEquipmentStats(slotId);
                // 标记当前装备ID，用于防止异步操作干扰
                btn.dataset.equipmentId = this.currentBuild[slotId];
                // 设置为已选装备的图标
                if (equip && equip.icon) {
                    this.setButtonIcon(btn, equip.icon, slotId);
                }
                btn.title = equip ? `${equip.name}` : `${btn.getAttribute('data-label')}`;
                // 更新名称显示
                if (nameSpan && equip) {
                    // 清空之前的内容
                    nameSpan.innerHTML = '';
                    
                    // 装备名称
                    const nameText = document.createElement('div');
                    nameText.textContent = equip.name;
                    nameText.className = 'equipment-name-text';
                    nameSpan.appendChild(nameText);
                    
                    // 如果有镶嵌宝石，显示宝石信息
                    if (this.gems[slotId] && this.gems[slotId].gemId) {
                        const gem = this.gemData.find(g => g.id === this.gems[slotId].gemId);
                        if (gem) {
                            const essence = this.gems[slotId].essence !== undefined ? this.gems[slotId].essence : 0;
                            const essenceMultiplier = 1 + (essence / 100);
                            const effectiveEnergy = Math.floor(gem.energy * essenceMultiplier); // 计算有效能量
                            const gemInfo = document.createElement('div');
                            gemInfo.className = 'equipment-gem-info';
                            gemInfo.textContent = `${gem.typeName} • 源质 ${effectiveEnergy}`;
                            gemInfo.style.color = gem.color; // 使用宝石颜色
                            nameSpan.appendChild(gemInfo);
                        }
                    }
                }
                // 显示宝石插槽（武器和遗物不显示，其他标记为无法镶嵌的也不显示）
                if (gemSocket) {
                    // 检查是否为武器或遗物
                    const isWeaponOrRelic = slotId === 'weapon' || slotId === 'relic1' || slotId === 'relic2';
                    // 检查装备是否标记为无法镶嵌
                    const cannotSocket = equip && (equip.noSocket === true || equip.canSocket === false);
                    
                    if (isWeaponOrRelic || cannotSocket) {
                        gemSocket.style.display = 'none';
                    } else {
                        gemSocket.style.display = 'block';
                        
                        // 检查装备是否为传奇装备，如果是则自动设置源质为100%
                        const isLegendary = equip && (equip.rarity === 'legendary' || equip.legendaryEffectName);
                        if (this.gems[slotId] && this.gems[slotId].gemId) {
                            if (isLegendary) {
                                // 传奇装备强制设置为100%
                                this.gems[slotId].essence = 100;
                            } else if (this.gems[slotId].essence === 100) {
                                // 如果从传奇装备切换到普通装备，且有100%源质，改为35%
                                this.gems[slotId].essence = 35;
                            }
                        }
                        
                        // 更新宝石插槽状态
                        if (this.gems[slotId] && this.gems[slotId].gemId) {
                            gemSocket.classList.add('has-gem');
                            const gem = this.gemData.find(g => g.id === this.gems[slotId].gemId);
                            if (gem) {
                                const essence = this.gems[slotId].essence || 0;
                                gemSocket.title = `${gem.name} (能量: ${gem.energy}, 源质: +${essence}%)`;
                            
                            // 设置边框颜色为宝石颜色
                            gemSocket.style.borderColor = gem.color;
                            
                            // 根据宝石尺寸设置点的大小
                            const sizeMap = {
                                small: '8px',      // 小型 - 小点
                                large: '12px',     // 大型 - 中点
                                gorgeous: '16px',  // 华美 - 大点
                                flawless: '20px'   // 无暇 - 最大点
                            };
                            const dotSize = sizeMap[gem.size] || '12px';
                            
                            // 将颜色转换为RGB用于背景渐变
                            const hexToRgb = (hex) => {
                                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
                                return result ? {
                                    r: parseInt(result[1], 16),
                                    g: parseInt(result[2], 16),
                                    b: parseInt(result[3], 16)
                                } : { r: 255, g: 215, b: 0 };
                            };
                            const rgb = hexToRgb(gem.color);
                            
                            // 设置背景渐变色（使用宝石颜色）
                            gemSocket.style.background = `linear-gradient(135deg, 
                                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2), 
                                rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1))`;
                            
                            // 使用CSS变量设置点的颜色和大小
                            gemSocket.style.setProperty('--gem-color', gem.color);
                            gemSocket.style.setProperty('--gem-dot-size', dotSize);
                        }
                    } else {
                        gemSocket.classList.remove('has-gem');
                        gemSocket.title = '镶嵌宝石';
                        gemSocket.style.borderColor = '';
                        gemSocket.style.background = '';
                        gemSocket.style.removeProperty('--gem-color');
                        gemSocket.style.removeProperty('--gem-dot-size');
                    }
                    }
                }
            } else {
                btn.classList.remove('selected');
                // 标记装备已清空，防止异步操作干扰
                btn.dataset.equipmentId = '';
                // 恢复基础标题
                // 按 data-label 推断标题
                const label = btn.getAttribute('data-label') || '';
                btn.title = label;
                // 立即恢复默认图标（不等待异步加载）
                if (this.slotIcons && this.slotIcons[slotId]) {
                    btn.style.backgroundImage = `url(${this.slotIcons[slotId]})`;
                } else {
                    btn.style.backgroundImage = '';
                }
                // 清空名称显示
                if (nameSpan) {
                    nameSpan.innerHTML = '';
                }
                // 隐藏宝石插槽
                if (gemSocket) {
                    gemSocket.style.display = 'none';
                    gemSocket.classList.remove('has-gem');
                }
                // 清空该槽位的宝石数据
                if (this.gems[slotId]) {
                    delete this.gems[slotId];
                }
            }
        });
    }

    updateWeaponSkill() {
        const container = document.getElementById('weaponSkill');
        if (!container) return;
        const weapon = this.getEquipmentStats('weapon');
        if (weapon && (weapon.abilityName || weapon.abilityDesc)) {
            let html = '';
            if (weapon.abilityName) {
                html += `<div class="skill-name">【${weapon.abilityName}】</div>`;
            }
            if (weapon.abilityDesc) {
                // 使用TextStyler进行样式化处理
                let rules = [];
                
                // 尝试获取预设规则
                if (weapon.abilityName) {
                    rules = TextStyler.getPresetRules(weapon.abilityName);
                }
                
                // 如果装备有自定义样式规则，可以在这里添加
                // rules.push(...weapon.styleRules);
                
                const styledDesc = TextStyler.style(weapon.abilityDesc, rules, {
                    convertNewlines: true
                });
                html += `<div class="skill-desc">${styledDesc}</div>`;
            }
            if (weapon.abilityCritBonus) {
                html += `<div class="skill-crit-bonus">额外暴击率：+${weapon.abilityCritBonus}%</div>`;
            }
            container.innerHTML = html;
        } else {
            container.textContent = '当前武器无技能词条';
        }
    }

    updateRelicSkill() {
        const container = document.getElementById('relicSkill');
        if (!container) return;
        
        // 收集所有已装备遗物的技能
        const relics = [];
        const relic1 = this.getEquipmentStats('relic1');
        const relic2 = this.getEquipmentStats('relic2');
        
        if (relic1 && (relic1.relicAbilityName || relic1.relicAbilityDesc)) {
            relics.push(relic1);
        }
        if (relic2 && (relic2.relicAbilityName || relic2.relicAbilityDesc)) {
            relics.push(relic2);
        }
        
        if (relics.length === 0) {
            container.textContent = '当前遗物无技能词条';
            return;
        }
        
        // 显示所有遗物技能
        let html = '';
        relics.forEach((relic, index) => {
            // 如果不是第一个遗物，添加分隔
            if (index > 0) {
                html += '<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);"></div>';
            }
            
            if (relic.relicAbilityName) {
                html += `<div class="skill-name">【${relic.relicAbilityName}】</div>`;
            }
            if (relic.relicAbilityDesc) {
                // 使用TextStyler进行样式化处理
                let rules = [];
                
                // 尝试获取预设规则
                if (relic.relicAbilityName) {
                    rules = TextStyler.getPresetRules(relic.relicAbilityName);
                }
                
                // 如果遗物有自定义样式规则，可以在这里添加
                // rules.push(...relic.styleRules);
                
                const styledDesc = TextStyler.style(relic.relicAbilityDesc, rules, {
                    convertNewlines: true
                });
                html += `<div class="skill-desc">${styledDesc}</div>`;
            }
        });
        
        container.innerHTML = html;
    }

    updateSetBonus() {
        const container = document.getElementById('setBonus');
        if (!container) return;
        
        // 统计所有装备的套装
        const setCounts = {}; // { setId: count }
        const setInfoMap = {}; // { setId: { name: string, pieces: number } }
        
        const slots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        
        slots.forEach(slotId => {
            const equipment = this.getEquipmentStats(slotId);
            if (equipment && equipment.setId) {
                const setId = equipment.setId;
                if (!setCounts[setId]) {
                    setCounts[setId] = 0;
                    // 从setsData中查找套装信息
                    const setData = this.setsData.find(s => s.id === setId);
                    if (setData) {
                        setInfoMap[setId] = {
                            id: setId,
                            name: setData.name,
                            pieces: 0,
                            bonuses: setData.bonuses || []
                        };
                    }
                }
                setCounts[setId]++;
                if (setInfoMap[setId]) {
                    setInfoMap[setId].pieces = setCounts[setId];
                }
            }
        });
        
        // 检查是否有任何套装
        if (Object.keys(setInfoMap).length === 0) {
            container.textContent = '当前无激活的套装效果';
            return;
        }
        
        // 按套装ID分组显示，并显示所有套装效果（包括未激活的）
        const setGroups = {};
        Object.keys(setInfoMap).forEach(setId => {
            const setInfo = setInfoMap[setId];
            if (!setGroups[setId]) {
                setGroups[setId] = {
                    name: setInfo.name,
                    pieces: setInfo.pieces,
                    bonuses: setInfo.bonuses || []
                };
            }
        });
        
        let html = '';
        Object.keys(setGroups).forEach(setId => {
            const setGroup = setGroups[setId];
            html += `<div class="set-bonus-item">`;
            
            // 显示套装名称和所有套装效果
            setGroup.bonuses.forEach((bonus, index) => {
                const isActive = setGroup.pieces === bonus.requiredPieces;
                const piecesColor = isActive ? '#10b981' : '#ef4444'; // 等于时为绿色，其他情况为红色
                
                html += `<div class="set-bonus-name">`;
                html += `${setGroup.name} (`;
                html += `<span style="color: ${piecesColor};">${setGroup.pieces}</span>`;
                html += `/${bonus.requiredPieces})`;
                html += `</div>`;
                
                if (bonus.description) {
                    html += `<div class="set-bonus-desc">${bonus.description}</div>`;
                }
                
                // 如果还有下一个套装效果，添加分隔
                if (index < setGroup.bonuses.length - 1) {
                    html += '<div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color);"></div>';
                }
            });
            
            html += `</div>`;
            
            // 如果有多套套装，添加分隔
            if (Object.keys(setGroups).indexOf(setId) < Object.keys(setGroups).length - 1) {
                html += '<div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border-color);"></div>';
            }
        });
        
        container.innerHTML = html;
    }

    updateLegendaryEffect() {
        const container = document.getElementById('legendaryEffect');
        if (!container) return;
        
        // 收集所有已装备的传奇装备
        const legendaryItems = [];
        const allSlots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        
        allSlots.forEach(slotId => {
            const item = this.getEquipmentStats(slotId);
            if (item && item.rarity === 'legendary' && (item.legendaryEffectName || item.legendaryEffectDesc)) {
                legendaryItems.push(item);
            }
        });
        
        if (legendaryItems.length === 0) {
            container.textContent = '当前无传奇特效';
            return;
        }
        
        // 显示所有传奇特效
        let html = '';
        legendaryItems.forEach((item, index) => {
            // 如果不是第一个传奇装备，添加分隔
            if (index > 0) {
                html += '<div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--border-color);"></div>';
            }
            
            if (item.legendaryEffectName) {
                html += `<div class="skill-name">【${item.legendaryEffectName}】</div>`;
            }
            if (item.legendaryEffectDesc) {
                // 使用TextStyler进行样式化处理
                let rules = [];
                
                // 尝试获取预设规则
                if (item.legendaryEffectName) {
                    rules = TextStyler.getPresetRules(item.legendaryEffectName);
                }
                
                const styledDesc = TextStyler.style(item.legendaryEffectDesc, rules, {
                    convertNewlines: true
                });
                html += `<div class="skill-desc">${styledDesc}</div>`;
            }
        });
        
        container.innerHTML = html;
    }

    // 预加载按钮图标，失败时回退到默认槽位图标
    setButtonIcon(btn, url, slotId) {
        // 检查装备是否已被清空（通过检查data属性）
        if (!btn.dataset.equipmentId || btn.dataset.equipmentId === '') {
            return; // 如果装备已被清空，不执行异步操作
        }
        
        // 取消该槽位之前的加载操作
        if (this.loadingIcons.has(slotId)) {
            const oldImg = this.loadingIcons.get(slotId);
            oldImg.onload = null;
            oldImg.onerror = null;
            oldImg.src = '';
        }
        
        const img = new Image();
        const currentEquipmentId = btn.dataset.equipmentId;
        
        img.onload = () => {
            // 再次检查是否已被清空或装备已改变
            if (btn.dataset.equipmentId === currentEquipmentId && currentEquipmentId !== '') {
                btn.style.backgroundImage = `url(${url})`;
            }
            this.loadingIcons.delete(slotId);
        };
        img.onerror = () => {
            // 再次检查是否已被清空或装备已改变
            if (btn.dataset.equipmentId === currentEquipmentId && currentEquipmentId !== '') {
                if (this.slotIcons && this.slotIcons[slotId]) {
                    btn.style.backgroundImage = `url(${this.slotIcons[slotId]})`;
                } else {
                    btn.style.backgroundImage = '';
                }
            }
            this.loadingIcons.delete(slotId);
        };
        
        this.loadingIcons.set(slotId, img);
        img.src = url;
    }

    // 打开装备选择器
    openEquipmentPicker(slotId) {
        const modal = document.getElementById('pickerModal');
        const title = document.getElementById('pickerTitle');
        const list = document.getElementById('pickerList');
        if (!modal || !title || !list) return;

        const labelMap = {
            head: '头部', shoulder: '肩部', cloak: '披风', chest: '胸部',
            hands: '手部', legs: '腿部', feet: '足部', necklace: '项链',
            wrist: '护腕', ring1: '戒指1', ring2: '戒指2', relic1: '遗物1',
            relic2: '遗物2', weapon: '武器'
        };

        title.textContent = `选择 ${labelMap[slotId] || slotId}`;
        list.innerHTML = '';

        // 分类名称
        let category = slotId;
        if (slotId === 'ring1' || slotId === 'ring2') category = 'ring';
        if (slotId === 'relic1' || slotId === 'relic2') category = 'relic';

        // 获取当前选择的英雄ID
        const currentHeroId = this.currentBuild.hero;

        // 过滤装备：只显示匹配当前英雄的装备（如果装备有heroes字段且不为空）
        let items = (this.equipmentData[category] || []).filter(item => {
            // 如果装备没有指定heroes字段，或heroes为空数组，则所有英雄可用
            if (!item.heroes || item.heroes.length === 0) {
                return true;
            }
            // 如果装备指定了heroes，只有当前英雄在列表中才显示
            return currentHeroId && item.heroes.includes(currentHeroId);
        });

        // 如果是遗物槽位，过滤掉已经在另一个遗物槽位装备的遗物
        if (slotId === 'relic1' || slotId === 'relic2') {
            const otherRelicSlot = slotId === 'relic1' ? 'relic2' : 'relic1';
            const otherRelicId = this.currentBuild[otherRelicSlot];
            items = items.filter(item => {
                // 如果该遗物已在另一个槽位装备，则过滤掉（除非是当前槽位已装备的遗物）
                if (item.id === otherRelicId && this.currentBuild[slotId] !== item.id) {
                    return false;
                }
                return true;
            });
        }
        
        // 如果已装备传奇装备，过滤掉其他传奇装备（除非是当前槽位已装备的传奇装备）
        const allSlots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        let hasLegendary = false;
        for (const otherSlot of allSlots) {
            if (otherSlot === slotId) continue; // 跳过当前槽位
            const otherItem = this.getEquipmentStats(otherSlot);
            if (otherItem && otherItem.rarity === 'legendary') {
                hasLegendary = true;
                break;
            }
        }
        
        if (hasLegendary) {
            items = items.filter(item => {
                // 如果已装备传奇装备，则过滤掉其他传奇装备（除非是当前槽位已装备的传奇装备）
                if (item.rarity === 'legendary' && this.currentBuild[slotId] !== item.id) {
                    return false;
                }
                return true;
            });
        }

        items.forEach(item => {
            const row = document.createElement('div');
            row.className = 'picker-item';
            row.addEventListener('click', () => {
                // 如果是遗物槽位，再次检查是否已装备相同ID的遗物（双重验证）
                if ((slotId === 'relic1' || slotId === 'relic2')) {
                    const otherRelicSlot = slotId === 'relic1' ? 'relic2' : 'relic1';
                    if (this.currentBuild[otherRelicSlot] === item.id) {
                        alert('该遗物已在另一个遗物槽位装备，遗物具有唯一性，不能重复装备！');
                        return;
                    }
                }
                
                // 如果是传奇装备，检查是否已装备其他传奇装备
                if (item.rarity === 'legendary') {
                    for (const otherSlot of allSlots) {
                        if (otherSlot === slotId) continue;
                        const otherItem = this.getEquipmentStats(otherSlot);
                        if (otherItem && otherItem.rarity === 'legendary') {
                            alert('英雄只能装备一件传奇装备，请先卸下其他传奇装备！');
                            return;
                        }
                    }
                }
                // 选择该装备
                this.currentBuild[slotId] = item.id;
                const select = document.getElementById(slotId);
                if (select) select.value = item.id;
                this.updateStats();
                this.updateSlotIcons();
                this.closeEquipmentPicker();
            });

            const icon = document.createElement('div');
            icon.className = 'picker-item-icon';
            if (item.icon) icon.style.backgroundImage = `url(${item.icon})`;

            const meta = document.createElement('div');
            const name = document.createElement('div');
            name.className = 'picker-item-name';
            name.textContent = item.name;
            const stats = document.createElement('div');
            stats.className = 'picker-item-stats';
            const keys = ['itemLevel','stamina','intellect','spirit','critRating','attack','defense','health','mana','critRate','critDamage','moveSpeed','cooldown','haste','mastery'];
            const parts = [];
            keys.forEach(k => { if (item[k] !== undefined) parts.push(`${this.getStatLabel(k)}${k==='critDamage'||k==='cooldown' ? ':'+item[k]+'%' : ':'+item[k]}`); });
            stats.textContent = parts.join(' | ');

            meta.appendChild(name);
            meta.appendChild(stats);
            row.appendChild(icon);
            row.appendChild(meta);
            list.appendChild(row);
        });

        modal.classList.remove('hidden');

        // 关闭事件
        const closeBtn = document.getElementById('pickerClose');
        closeBtn.onclick = () => this.closeEquipmentPicker();
        modal.onclick = (e) => { if (e.target === modal) this.closeEquipmentPicker(); };
    }

    closeEquipmentPicker() {
        const modal = document.getElementById('pickerModal');
        if (modal) modal.classList.add('hidden');
    }

    openGemPicker(slotId) {
        const modal = document.getElementById('gemPickerModal');
        const title = document.getElementById('gemPickerTitle');
        if (!modal || !title) return;

        // 检查该槽位是否已装备
        if (!this.currentBuild[slotId]) {
            alert('请先装备物品后才能镶嵌宝石');
            return;
        }

        const labelMap = {
            head: '头部', shoulder: '肩部', cloak: '披风', chest: '胸部',
            hands: '手部', legs: '腿部', feet: '足部', necklace: '项链',
            wrist: '护腕', ring1: '戒指1', ring2: '戒指2', relic1: '遗物1',
            relic2: '遗物2', weapon: '武器'
        };

        title.textContent = `选择宝石与源质 - ${labelMap[slotId] || slotId}`;
        
        // 保存当前槽位ID
        modal.dataset.currentSlot = slotId;
        
        // 显示当前已选择的宝石和源质
        const currentGem = this.gems[slotId];
        const currentGemId = currentGem ? currentGem.gemId : null;
        
        // 重置界面到第一步：选择类型
        this.showGemTypeSelection(slotId, currentGemId);
        
        // 检查当前装备是否为传奇装备
        const currentEquipment = this.getEquipmentStats(slotId);
        const isLegendary = currentEquipment && (currentEquipment.rarity === 'legendary' || currentEquipment.legendaryEffectName);
        
        // 设置源质按钮状态
        const essenceBtns = document.querySelectorAll('.essence-btn');
        essenceBtns.forEach(btn => {
            const essence = parseInt(btn.dataset.essence);
            
            // 如果是传奇装备，只显示100%选项，隐藏其他选项
            if (isLegendary) {
                if (essence === 100) {
                    btn.style.display = 'block';
                    btn.classList.remove('active');
                    // 传奇装备固定100%源质
                    if (!currentGem || currentGem.essence === 100 || currentGem.essence === undefined) {
                        btn.classList.add('active');
                        // 自动设置为100%
                        if (!this.gems[slotId]) {
                            this.gems[slotId] = {};
                        }
                        this.gems[slotId].essence = 100;
                    }
                } else {
                    btn.style.display = 'none'; // 隐藏非100%选项
                }
            } else {
                // 非传奇装备，只显示0%和35%，隐藏100%
                if (essence === 100) {
                    btn.style.display = 'none'; // 隐藏100%选项
                } else {
                    btn.style.display = 'block';
                    btn.classList.remove('active');
                    if (currentGem && currentGem.essence === essence) {
                        btn.classList.add('active');
                    } else if (!currentGem && essence === 35) {
                        btn.classList.add('active'); // 默认+35%
                    }
                }
            }
        });
        
        // 源质按钮点击事件（使用事件委托避免重复绑定）
        const essenceContainer = document.querySelector('.essence-options');
        if (essenceContainer) {
            // 移除旧的事件监听器（通过克隆替换）
            const newContainer = essenceContainer.cloneNode(true);
            essenceContainer.parentNode.replaceChild(newContainer, essenceContainer);
            
            newContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('essence-btn')) {
                    // 如果是传奇装备，不允许点击（固定100%）
                    if (isLegendary) {
                        return;
                    }
                    
                    // 移除所有active类
                    newContainer.querySelectorAll('.essence-btn').forEach(b => b.classList.remove('active'));
                    // 添加active类到当前按钮
                    e.target.classList.add('active');
                    
                    // 保存源质加成
                    if (!this.gems[slotId]) {
                        this.gems[slotId] = {};
                    }
                    this.gems[slotId].essence = parseInt(e.target.dataset.essence);
                    
                    // 更新显示
                    this.updateSlotIcons();
                    this.updateStats(); // 更新统计，包括宝石技能
                }
            });
        }
        
        modal.classList.remove('hidden');
    }
    
    showGemTypeSelection(slotId, currentGemId) {
        const typeSelection = document.getElementById('gemTypeSelection');
        const sizeSelection = document.getElementById('gemSizeSelection');
        const typeList = document.getElementById('gemTypeList');
        
        // 显示类型选择，隐藏尺寸选择
        typeSelection.classList.remove('hidden');
        sizeSelection.classList.add('hidden');
        
        typeList.innerHTML = '';
        
        // 获取所有唯一的宝石类型
        const gemTypes = {};
        this.gemData.forEach(gem => {
            if (!gemTypes[gem.type]) {
                gemTypes[gem.type] = {
                    type: gem.type,
                    typeName: gem.typeName,
                    color: gem.color
                };
            }
        });
        
        // 显示所有宝石类型
        Object.keys(gemTypes).sort().forEach(type => {
            const typeInfo = gemTypes[type];
            const row = document.createElement('div');
            row.className = 'gem-type-item';
            row.style.borderLeftColor = typeInfo.color;
            
            // 检查当前选择的宝石是否属于这个类型
            if (currentGemId) {
                const currentGem = this.gemData.find(g => g.id === currentGemId);
                if (currentGem && currentGem.type === type) {
                    row.classList.add('selected');
                }
            }
            
            row.addEventListener('click', () => {
                // 移除其他选中状态
                typeList.querySelectorAll('.gem-type-item').forEach(item => {
                    item.classList.remove('selected');
                });
                row.classList.add('selected');
                
                // 显示该类型的尺寸选择
                this.showGemSizeSelection(slotId, type, currentGemId);
            });
            
            const name = document.createElement('div');
            name.className = 'gem-type-item-name';
            name.textContent = typeInfo.typeName;
            
            row.appendChild(name);
            typeList.appendChild(row);
        });
    }
    
    showGemSizeSelection(slotId, gemType, currentGemId) {
        const typeSelection = document.getElementById('gemTypeSelection');
        const sizeSelection = document.getElementById('gemSizeSelection');
        const sizeList = document.getElementById('gemSizeList');
        
        // 隐藏类型选择，显示尺寸选择
        typeSelection.classList.add('hidden');
        sizeSelection.classList.remove('hidden');
        
        sizeList.innerHTML = '';
        
        // 获取该类型下的所有宝石，按尺寸排序
        const gemsOfType = this.gemData
            .filter(gem => gem.type === gemType)
            .sort((a, b) => {
                const sizeOrder = { small: 0, large: 1, gorgeous: 2, flawless: 3 };
                return sizeOrder[a.size] - sizeOrder[b.size];
            });
        
        gemsOfType.forEach(gem => {
            const row = document.createElement('div');
            row.className = 'picker-item';
            
            if (currentGemId === gem.id) {
                row.classList.add('selected');
            }
            
            row.addEventListener('click', () => {
                // 移除其他选中状态
                sizeList.querySelectorAll('.picker-item').forEach(item => {
                    item.classList.remove('selected');
                });
                row.classList.add('selected');
                
                // 保存选择的宝石
                if (!this.gems[slotId]) {
                    this.gems[slotId] = {};
                }
                this.gems[slotId].gemId = gem.id;
                
                // 检查装备是否为传奇装备
                const equipment = this.getEquipmentStats(slotId);
                const isLegendary = equipment && (equipment.rarity === 'legendary' || equipment.legendaryEffectName);
                
                // 如果没有设置源质，根据装备类型设置默认值
                if (this.gems[slotId].essence === undefined) {
                    if (isLegendary) {
                        this.gems[slotId].essence = 100; // 传奇装备固定100%
                    } else {
                        this.gems[slotId].essence = 35; // 普通装备默认35%
                    }
                } else if (isLegendary) {
                    // 如果是传奇装备，强制设置为100%
                    this.gems[slotId].essence = 100;
                }
                
                // 更新显示
                this.updateSlotIcons();
                this.updateStats(); // 更新统计，包括宝石技能
                
                // 关闭宝石选择窗口
                const modal = document.getElementById('gemPickerModal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });

            const icon = document.createElement('div');
            icon.className = 'picker-item-icon';
            icon.style.backgroundColor = gem.color;
            icon.style.opacity = '0.3';
            if (gem.icon) {
                icon.style.backgroundImage = `url(${gem.icon})`;
            }

            const meta = document.createElement('div');
            meta.className = 'picker-item-meta';
            
            const name = document.createElement('div');
            name.className = 'picker-item-name';
            name.textContent = gem.name;
            
            const stats = document.createElement('div');
            stats.className = 'picker-item-stats';
            stats.textContent = `能量: ${gem.energy}`;
            
            meta.appendChild(name);
            meta.appendChild(stats);
            
            row.appendChild(icon);
            row.appendChild(meta);
            sizeList.appendChild(row);
        });
    }

    closeGemPicker() {
        const modal = document.getElementById('gemPickerModal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    getStatLabel(key) {
        const labels = {
            attack: '攻击',
            defense: '防御',
            health: '生命',
            mana: '魔法',
            critRate: '暴击',
            critDamage: '暴击伤害',
            haste: '急速',
            mastery: '精通',
            spirit: '灵魂',
            stamina: '耐力',
            intellect: '智力',
            moveSpeed: '移动速度',
            dodge: '闪避',
            cooldown: '冷却',
            physicalDR: '物伤减免',
            magicDR: '魔伤减免'
        };
        return labels[key] || key;
    }
    
    updateEquipmentDetails() {
        const detailsContainer = document.getElementById('equipmentDetails');
        detailsContainer.innerHTML = '';
        
        // 显示英雄信息
        const hero = this.getHeroStats();
        if (hero) {
            const heroDiv = document.createElement('div');
            heroDiv.className = 'equipment-item hero-item';
            const heroNameDiv = document.createElement('div');
            heroNameDiv.className = 'equipment-item-name';
            heroNameDiv.textContent = `英雄: ${hero.name}`;
            heroDiv.appendChild(heroNameDiv);
            detailsContainer.appendChild(heroDiv);
        }
        
        const slots = [
            { id: 'head', label: '头部' },
            { id: 'shoulder', label: '肩部' },
            { id: 'cloak', label: '披风' },
            { id: 'chest', label: '胸部' },
            { id: 'hands', label: '手部' },
            { id: 'legs', label: '腿部' },
            { id: 'feet', label: '足部' },
            { id: 'necklace', label: '项链' },
            { id: 'wrist', label: '护腕' },
            { id: 'ring1', label: '戒指1' },
            { id: 'ring2', label: '戒指2' },
            { id: 'relic1', label: '遗物1' },
            { id: 'relic2', label: '遗物2' },
            { id: 'weapon', label: '武器' }
        ];
        
        slots.forEach(slot => {
            const equipment = this.getEquipmentStats(slot.id);
            if (equipment) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'equipment-item';
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'equipment-item-name';
                nameDiv.textContent = `${slot.label}: ${equipment.name}`;
                
                const statsDiv = document.createElement('div');
                statsDiv.className = 'equipment-item-stats';
                const statTexts = [];
                Object.keys(equipment).forEach(key => {
                    if (key !== 'id' && key !== 'name' && equipment[key] !== undefined) {
                        const value = equipment[key];
                        let displayValue = value;
                        if (key === 'critRate' || key === 'critDamage' || key === 'cooldown') {
                            displayValue = value + '%';
                        }
                        if (typeof value === 'number') {
                            statTexts.push(`${this.getStatLabel(key)}: ${displayValue > 0 ? '+' : ''}${displayValue}`);
                        }
                    }
                });
                statsDiv.textContent = statTexts.join(' | ');
                
                itemDiv.appendChild(nameDiv);
                itemDiv.appendChild(statsDiv);
                if (equipment.abilityName || equipment.abilityDesc) {
                    const abilityDiv = document.createElement('div');
                    abilityDiv.className = 'equipment-item-stats';
                    const parts = [];
                    if (equipment.abilityName) parts.push(`技能: ${equipment.abilityName}`);
                    if (equipment.abilityDesc) parts.push(equipment.abilityDesc);
                    if (equipment.abilityCritBonus) parts.push(`额外暴击率: +${equipment.abilityCritBonus}%`);
                    abilityDiv.textContent = parts.join(' | ');
                    itemDiv.appendChild(abilityDiv);
                }
                detailsContainer.appendChild(itemDiv);
            }
        });
        
        if (detailsContainer.children.length === 0) {
            detailsContainer.innerHTML = '<div class="empty-state">暂无装备</div>';
        }
    }
    
    getStatLabel(key) {
        const labels = {
            attack: '攻击',
            defense: '护甲',
            health: '生命',
            mana: '魔法',
            critRate: '暴击',
            critDamage: '暴击伤害',
            moveSpeed: '移动速度',
            cooldown: '冷却',
            physicalDR: '物伤减免',
            magicDR: '魔伤减免',
            stamina: '耐力',
            intellect: '智力',
            mastery: '精通',
            haste: '急速',
            spirit: '灵魂',
            dodge: '闪避',
            // 展示扩展
            itemLevel: '物品等级',
            stamina: '耐力',
            intellect: '智力',
            spirit: '灵魂',
            critRating: '暴击评分',
            abilityCritBonus: '技能暴击率加成'
        };
        return labels[key] || key;
    }
    
    saveBuild() {
        const name = prompt('请输入Build名称:');
        if (!name || name.trim() === '') {
            alert('Build名称不能为空！');
            return;
        }
        
        const build = {
            name: name.trim(),
            equipment: { ...this.currentBuild },
            gems: { ...this.gems }, // 保存宝石和源质数据
            stats: this.calculateStats(),
            timestamp: new Date().toISOString()
        };
        
        const savedBuilds = this.getSavedBuilds();
        savedBuilds.push(build);
        localStorage.setItem('fellowship_builds', JSON.stringify(savedBuilds));
        
        alert('Build保存成功！');
        this.loadSavedBuilds();
    }
    
    getSavedBuilds() {
        const saved = localStorage.getItem('fellowship_builds');
        return saved ? JSON.parse(saved) : [];
    }
    
    loadSavedBuilds() {
        const savedBuilds = this.getSavedBuilds();
        const buildList = document.getElementById('buildList');
        buildList.innerHTML = '';
        
        if (savedBuilds.length === 0) {
            buildList.innerHTML = '<div class="empty-state">暂无保存的Build</div>';
            return;
        }
        
        savedBuilds.forEach((build, index) => {
            const card = document.createElement('div');
            card.className = 'build-card';
            
            const header = document.createElement('div');
            header.className = 'build-card-header';
            
            const name = document.createElement('div');
            name.className = 'build-card-name';
            name.textContent = build.name;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'build-card-delete';
            deleteBtn.textContent = '删除';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`确定要删除 "${build.name}" 吗？`)) {
                    this.deleteBuild(index);
                }
            });
            
            header.appendChild(name);
            header.appendChild(deleteBtn);
            
            const stats = document.createElement('div');
            stats.className = 'build-card-stats';
            const statTexts = [];
            if (build.equipment && build.equipment.hero) {
                const hero = this.heroData.find(h => h.id === build.equipment.hero);
                if (hero) {
                    statTexts.push(`英雄: ${hero.name}`);
                }
            }
            if (build.stats) {
                statTexts.push(`攻击: ${build.stats.attack}`);
                statTexts.push(`防御: ${build.stats.defense}`);
                statTexts.push(`生命: ${build.stats.health}`);
            }
            stats.textContent = statTexts.join(' | ');
            
            card.appendChild(header);
            card.appendChild(stats);
            
            card.addEventListener('click', () => {
                this.loadBuild(build);
            });
            
            buildList.appendChild(card);
        });
    }
    
    loadBuild(build) {
        this.currentBuild = { ...build.equipment };
        
        // 加载宝石和源质数据
        if (build.gems) {
            this.gems = { ...build.gems };
        } else {
            this.gems = {};
        }
        
        // 更新英雄选择
        if (this.currentBuild.hero) {
            const heroSelect = document.getElementById('hero');
            if (heroSelect) {
                heroSelect.value = this.currentBuild.hero;
                this.handleHeroChange(this.currentBuild.hero);
            }
        }
        
        // 更新装备选择框
        const equipmentSlots = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
        equipmentSlots.forEach(slotId => {
            const select = document.getElementById(slotId);
            if (select) {
                select.value = this.currentBuild[slotId] || '';
            }
        });
        
        this.updateStats();
        this.updateSlotIcons();
        alert(`已加载Build: ${build.name}`);
    }
    
    deleteBuild(index) {
        const savedBuilds = this.getSavedBuilds();
        savedBuilds.splice(index, 1);
        localStorage.setItem('fellowship_builds', JSON.stringify(savedBuilds));
        this.loadSavedBuilds();
    }
    
    showLoadDialog() {
        const savedBuilds = this.getSavedBuilds();
        if (savedBuilds.length === 0) {
            alert('没有保存的Build！');
            return;
        }
        
        const buildList = savedBuilds.map((build, index) => 
            `${index + 1}. ${build.name}`
        ).join('\n');
        
        const choice = prompt(`请选择要加载的Build (输入序号):\n\n${buildList}`);
        const index = parseInt(choice) - 1;
        
        if (index >= 0 && index < savedBuilds.length) {
            this.loadBuild(savedBuilds[index]);
        } else if (choice !== null) {
            alert('无效的选择！');
        }
    }
    
    resetBuild() {
        if (confirm('确定要重置当前Build吗？')) {
            this.currentBuild = {
                hero: null,
                head: null,
                shoulder: null,
                cloak: null,
                chest: null,
                hands: null,
                legs: null,
                feet: null,
                necklace: null,
                wrist: null,
                ring1: null,
                ring2: null,
                relic1: null,
                relic2: null,
                weapon: null
            };
            // 清空所有宝石
            this.gems = {};
            
            // 重置英雄选择
            const heroSelect = document.getElementById('hero');
            if (heroSelect) {
                heroSelect.value = '';
                this.handleHeroChange('');
            }
            
            // 重置装备选择
            const selects = ['head', 'shoulder', 'cloak', 'chest', 'hands', 'legs', 'feet', 'necklace', 'wrist', 'ring1', 'ring2', 'relic1', 'relic2', 'weapon'];
            selects.forEach(slotId => {
                const select = document.getElementById(slotId);
                if (select) {
                    select.value = '';
                }
            });
            
            this.updateStats();
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', async () => {
    const simulator = new BuildSimulator();
    await simulator.init();
});

