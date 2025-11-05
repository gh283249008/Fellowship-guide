// 数据加载器 - 异步加载所有JSON数据文件
class DataLoader {
    constructor() {
        this.heroData = [];
        this.slotIcons = {};
        this.equipmentData = {};
        this.gemData = [];
        this.gemSkillsData = {};
        this.setsData = [];
        this.loaded = false;
    }

    /**
     * 加载所有数据文件
     * @returns {Promise<void>}
     */
    async loadAll(forceReload = false) {
        try {
            // 如果强制重新加载，清除已加载状态
            if (forceReload) {
                this.loaded = false;
                this.heroData = [];
                this.equipmentData = {};
                this.slotIcons = {};
                this.gemData = [];
                this.gemSkillsData = {};
                this.setsData = [];
            }
            
            // 并行加载所有数据文件
            const [
                heroes,
                slotIcons,
                head,
                shoulder,
                cloak,
                chest,
                hands,
                legs,
                feet,
                necklace,
                wrist,
                ring,
                relic,
                weapon,
                gems,
                sets,
                amethystSkills,
                diamondSkills,
                emeraldSkills,
                rubySkills,
                sapphireSkills,
                topazSkills
            ] = await Promise.all([
                this.loadJSON('data/heroes.json'),
                this.loadJSON('data/slot-icons.json'),
                this.loadJSON('data/head.json'),
                this.loadJSON('data/shoulder.json'),
                this.loadJSON('data/cloak.json'),
                this.loadJSON('data/chest.json'),
                this.loadJSON('data/hands.json'),
                this.loadJSON('data/legs.json'),
                this.loadJSON('data/feet.json'),
                this.loadJSON('data/necklace.json'),
                this.loadJSON('data/wrist.json'),
                this.loadJSON('data/ring.json'),
                this.loadJSON('data/relic.json'),
                this.loadJSON('data/weapon.json'),
                this.loadJSON('data/gems.json'),
                this.loadJSON('data/sets.json'),
                this.loadJSON('data/gemsskill/amethyst.json'),
                this.loadJSON('data/gemsskill/diamond.json'),
                this.loadJSON('data/gemsskill/emerald.json'),
                this.loadJSON('data/gemsskill/ruby.json'),
                this.loadJSON('data/gemsskill/sapphire.json'),
                this.loadJSON('data/gemsskill/topaz.json')
            ]);

            this.heroData = heroes;
            this.slotIcons = slotIcons;
            this.gemData = gems;
            this.setsData = sets;
            
            // 组织宝石技能数据
            this.gemSkillsData = {
                amethyst: amethystSkills,
                diamond: diamondSkills,
                emerald: emeraldSkills,
                ruby: rubySkills,
                sapphire: sapphireSkills,
                topaz: topazSkills
            };
            
            // 处理装备数据，将DEFAULT图标替换为对应的slotIcons值
            this.equipmentData = {
                head: this.processIcons(head, 'head'),
                shoulder: this.processIcons(shoulder, 'shoulder'),
                cloak: this.processIcons(cloak, 'cloak'),
                chest: this.processIcons(chest, 'chest'),
                hands: this.processIcons(hands, 'hands'),
                legs: this.processIcons(legs, 'legs'),
                feet: this.processIcons(feet, 'feet'),
                necklace: this.processIcons(necklace, 'necklace'),
                wrist: this.processIcons(wrist, 'wrist'),
                ring: this.processIcons(ring, 'ring1'),
                relic: this.processIcons(relic, 'relic1'),
                weapon: this.processIcons(weapon, 'weapon')
            };

            this.loaded = true;
            console.log('所有数据加载完成');
        } catch (error) {
            console.error('数据加载失败:', error);
            throw error;
        }
    }

    /**
     * 加载单个JSON文件
     * @param {string} url - JSON文件路径
     * @returns {Promise<any>}
     */
    async loadJSON(url) {
        try {
            // 添加时间戳参数防止浏览器缓存
            const timestamp = new Date().getTime();
            const urlWithCache = `${url}?t=${timestamp}`;
            const response = await fetch(urlWithCache, {
                cache: 'no-cache',
                headers: {
                    'Cache-Control': 'no-cache'
                }
            });
            if (!response.ok) {
                throw new Error(`无法加载 ${url}: ${response.statusText} (状态码: ${response.status})`);
            }
            const data = await response.json();
            console.log(`成功加载: ${url}`);
            return data;
        } catch (error) {
            console.error(`加载 ${url} 失败:`, error);
            throw error;
        }
    }

    /**
     * 处理装备图标，将DEFAULT替换为对应的slotIcons值
     * @param {Array} items - 装备数组
     * @param {string} slotType - 槽位类型
     * @returns {Array}
     */
    processIcons(items, slotType) {
        return items.map(item => {
            if (item.icon === 'DEFAULT') {
                // 根据槽位类型选择对应的默认图标
                const iconKey = slotType === 'ring1' ? 'ring1' : 
                               slotType === 'relic1' ? 'relic1' : 
                               slotType;
                item.icon = this.slotIcons[iconKey] || '';
            }
            return item;
        });
    }

    /**
     * 获取英雄数据
     * @returns {Array}
     */
    getHeroData() {
        return this.heroData;
    }

    /**
     * 获取槽位图标
     * @returns {Object}
     */
    getSlotIcons() {
        return this.slotIcons;
    }

    /**
     * 获取装备数据
     * @returns {Object}
     */
    getEquipmentData() {
        return this.equipmentData;
    }

    /**
     * 获取宝石数据
     * @returns {Array}
     */
    getGemData() {
        return this.gemData;
    }

    /**
     * 获取宝石技能数据
     * @returns {Object}
     */
    getGemSkillsData() {
        return this.gemSkillsData;
    }

    getSetsData() {
        return this.setsData;
    }
}

// 创建全局数据加载器实例
const dataLoader = new DataLoader();

