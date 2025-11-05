// 英雄数据
const heroData = [
    {
        id: 'silvia',
        name: '希尔薇',
        description: '擅长近战的战士型英雄',
        avatar: 'assets/heros/silvia.png',  // 英雄头像路径
        baseStats: {
            attack: 100,
            defense: 60,
            health: 500,
            mana: 200,
            critRate: 10,
            critDamage: 50,
            moveSpeed: 10,
            cooldown: 0
        }
    }
];

// 槽位默认图标（使用内联SVG占位，后续可替换为真实图片URL）
const slotIcons = {
    head: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="28" text-anchor="middle" fill="%23c0caf5">头</text></svg>',
    shoulder: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="28" text-anchor="middle" fill="%23c0caf5">肩</text></svg>',
    cloak: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="28" text-anchor="middle" fill="%23c0caf5">披</text></svg>',
    chest: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="28" text-anchor="middle" fill="%23c0caf5">胸</text></svg>',
    hands: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="28" text-anchor="middle" fill="%23c0caf5">手</text></svg>',
    legs: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="28" text-anchor="middle" fill="%23c0caf5">腿</text></svg>',
    feet: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="28" text-anchor="middle" fill="%23c0caf5">足</text></svg>',
    necklace: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="24" text-anchor="middle" fill="%23c0caf5">项</text></svg>',
    wrist: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="24" text-anchor="middle" fill="%23c0caf5">腕</text></svg>',
    ring1: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="22" text-anchor="middle" fill="%23c0caf5">戒1</text></svg>',
    ring2: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="22" text-anchor="middle" fill="%23c0caf5">戒2</text></svg>',
    relic1: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="22" text-anchor="middle" fill="%23c0caf5">遗1</text></svg>',
    relic2: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="22" text-anchor="middle" fill="%23c0caf5">遗2</text></svg>',
    weapon: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="12" fill="%232b2f45"/><text x="50%" y="55%" font-size="24" text-anchor="middle" fill="%23c0caf5">武</text></svg>'
};

// 装备数据
const equipmentData = {
    head: [
        { id: 'head_basic', name: '基础头盔', icon: slotIcons.head, defense: 15, health: 30 },
        { id: 'head_iron', name: '铁制头盔', icon: slotIcons.head, defense: 25, health: 50 },
        { id: 'head_magic', name: '魔法头盔', icon: slotIcons.head, defense: 20, mana: 30, cooldown: 5 },
        { id: 'head_crown', name: '王者之冠', icon: slotIcons.head, defense: 30, health: 60, critRate: 8, critDamage: 10 }
    ],
    shoulder: [
        { id: 'shoulder_basic', name: '基础肩甲', icon: slotIcons.shoulder, defense: 20, health: 40 },
        { id: 'shoulder_iron', name: '铁制肩甲', icon: slotIcons.shoulder, defense: 30, health: 60 },
        { id: 'shoulder_plate', name: '板甲肩甲', icon: slotIcons.shoulder, defense: 40, health: 80 },
        { id: 'shoulder_magic', name: '魔法肩甲', icon: slotIcons.shoulder, defense: 25, mana: 40, cooldown: 5 }
    ],
    cloak: [
        { id: 'cloak_basic', name: '基础披风', icon: slotIcons.cloak, defense: 10, moveSpeed: 5 },
        { id: 'cloak_magic', name: '魔法披风', icon: slotIcons.cloak, defense: 15, mana: 30, moveSpeed: 8 },
        { id: 'cloak_shadow', name: '暗影披风', icon: slotIcons.cloak, defense: 20, critRate: 10, moveSpeed: 10 },
        { id: 'cloak_legend', name: '传说披风', icon: slotIcons.cloak, defense: 25, health: 50, moveSpeed: 12, critDamage: 15 }
    ],
    chest: [
        { id: 'chest_leather', name: '皮甲胸甲', icon: slotIcons.chest, defense: 30, health: 50 },
        { id: 'chest_chain', name: '锁子甲胸甲', icon: slotIcons.chest, defense: 50, health: 80 },
        { id: 'chest_plate', name: '板甲胸甲', icon: slotIcons.chest, defense: 80, health: 120, moveSpeed: -3 },
        { id: 'chest_magic', name: '魔法胸甲', icon: slotIcons.chest, defense: 60, health: 100, mana: 40, cooldown: 5 },
        { id: 'chest_dragon', name: '龙鳞胸甲', icon: slotIcons.chest, defense: 100, health: 150, critRate: 5 }
    ],
    hands: [
        { id: 'hands_basic', name: '基础手套', icon: slotIcons.hands, defense: 12, health: 25 },
        { id: 'hands_iron', name: '铁制手套', icon: slotIcons.hands, defense: 20, health: 40 },
        { id: 'hands_magic', name: '魔法手套', icon: slotIcons.hands, defense: 15, mana: 25, cooldown: 5 },
        { id: 'hands_combat', name: '战斗手套', icon: slotIcons.hands, defense: 18, attack: 15, critRate: 5 }
    ],
    legs: [
        { id: 'legs_leather', name: '皮甲护腿', icon: slotIcons.legs, defense: 25, health: 40 },
        { id: 'legs_chain', name: '锁子甲护腿', icon: slotIcons.legs, defense: 40, health: 60 },
        { id: 'legs_plate', name: '板甲护腿', icon: slotIcons.legs, defense: 60, health: 90, moveSpeed: -2 },
        { id: 'legs_magic', name: '魔法护腿', icon: slotIcons.legs, defense: 45, health: 70, mana: 30, cooldown: 5 }
    ],
    feet: [
        { id: 'feet_basic', name: '基础靴子', icon: slotIcons.feet, moveSpeed: 10, defense: 10 },
        { id: 'feet_swift', name: '迅捷之靴', icon: slotIcons.feet, moveSpeed: 20, defense: 15 },
        { id: 'feet_sturdy', name: '坚固之靴', icon: slotIcons.feet, defense: 30, health: 40, moveSpeed: 5 },
        { id: 'feet_magic', name: '魔法靴子', icon: slotIcons.feet, moveSpeed: 15, mana: 25, cooldown: 5 }
    ],
    necklace: [
        { id: 'necklace_life', name: '生命项链', icon: slotIcons.necklace, health: 100, defense: 20 },
        { id: 'necklace_mana', name: '魔法项链', icon: slotIcons.necklace, mana: 60, cooldown: 8 },
        { id: 'necklace_speed', name: '速度项链', icon: slotIcons.necklace, moveSpeed: 15, critRate: 5 },
        { id: 'necklace_power', name: '力量项链', icon: slotIcons.necklace, attack: 40, critRate: 8 },
        { id: 'necklace_legend', name: '传说项链', icon: slotIcons.necklace, attack: 30, defense: 30, health: 80, mana: 50 }
    ],
    wrist: [
        { id: 'wrist_basic', name: '基础护腕', icon: slotIcons.wrist, defense: 10, health: 20 },
        { id: 'wrist_iron', name: '铁制护腕', icon: slotIcons.wrist, defense: 18, health: 35 },
        { id: 'wrist_magic', name: '魔法护腕', icon: slotIcons.wrist, defense: 15, mana: 30, cooldown: 5 },
        { id: 'wrist_combat', name: '战斗护腕', icon: slotIcons.wrist, defense: 12, attack: 20, critRate: 5 }
    ],
    ring: [
        { id: 'ring_power', name: '力量之戒', icon: slotIcons.ring1, attack: 30, critRate: 5 },
        { id: 'ring_defense', name: '防御之戒', icon: slotIcons.ring1, defense: 25, health: 50 },
        { id: 'ring_magic', name: '魔法之戒', icon: slotIcons.ring1, mana: 40, cooldown: 10 },
        { id: 'ring_crit', name: '暴击之戒', icon: slotIcons.ring1, critRate: 10, critDamage: 20 },
        { id: 'ring_balanced', name: '平衡之戒', icon: slotIcons.ring1, attack: 20, defense: 20, health: 40, mana: 25 }
    ],
    relic: [
        {
            id: '1487',
            name: '缚罪石',
            icon: 'assets/icons/relic/1487.png',
            itemLevel: 330,
            intellect: 178,
            haste: 120,
            mastery: 280,
            heroes: ['silvia', 'vigour', 'rime', 'ardeos'],  // 适用英雄：希尔薇、vigour、rime、ardeos
            relicAbilityName: '庇护',
            relicAbilityDesc: '为自身和附近的盟友提供15% 伤害减免,持续 15 秒。\n\n可在全局冷却期间使用。'
        },
        {
            id: '177',
            name: '远古结界石',
            icon: 'assets/icons/relic/177.png',
            itemLevel: 330,
            intellect: 178,
            haste: 280,
            mastery: 120,
            heroes: ['silvia', 'vigour', 'rime', 'ardeos'],  // 适用英雄：希尔薇、vigour、rime、ardeos
            relicAbilityName: '强效驱散',
            relicAbilityDesc: '立即为自身和较大半径范围内的盟友驱散所有有害魔法效果。\n\n可在全局冷却期间使用。'
        },
        {
            id: '1495',
            name: '远古家禽图腾',
            icon: 'assets/icons/relic/1495.png',
            itemLevel: 330,
            intellect: 178,
            critRate: 120,
            spirit: 280,
            heroes: ['silvia', 'vigour', 'rime', 'ardeos'],  // 适用英雄：希尔薇、vigour、rime、ardeos
            relicAbilityName: '变鸡术!',
            relicAbilityDesc: '立即将你的目标变成一只鸡。\n\n每次地下城中仅能使用有限次数。使用次数由全队共享。\n\n被变鸡术影响的敌人不会提供杀敌分数。\n\n可在全局冷却期间使用。'
        },
        {
            id: '416',
            name: '血仪战鼓',
            icon: 'assets/icons/relic/416.png',
            itemLevel: 330,
            intellect: 178,
            critRate: 280,
            mastery: 120,
            heroes: ['silvia', 'vigour', 'rime', 'ardeos'],  // 适用英雄：希尔薇、vigour、rime、ardeos
            relicAbilityName: '血仪狂热',
            relicAbilityDesc: '你和附近的盟友获得50%移动速度提升,持续12秒。\n\n可在全局冷却期间使用。'
        },
        {
            id: '256',
            name: '海潮灵药',
            icon: 'assets/icons/relic/256.png',
            itemLevel: 330,
            intellect: 178,
            critRate: 120,
            haste: 280,
            heroes: ['silvia', 'vigour'],  // 适用英雄：希尔薇、vigour
            relicAbilityName: '回春',
            relicAbilityDesc: '立即恢复你最大生命值的40%。\n\n可在全局冷却期间使用。'
        },
        {
            id: '310',
            name: '艾萨莱克精魂圣杯',
            icon: 'assets/icons/relic/310.png',
            itemLevel: 330,
            intellect: 178,
            haste: 120,
            mastery: 280,
            heroes: ['silvia', 'vigour'],  // 适用英雄：希尔薇、vigour
            relicAbilityName: '回复魔力值',
            relicAbilityDesc: '立即恢复你30%的最大魔力值。\n\n可在全局冷却期间使用。'
        },
        {
            id: '1491',
            name: '暗影宝珠',
            icon: 'assets/icons/relic/1491.png',
            itemLevel: 330,
            intellect: 178,
            mastery: 180,
            spirit: 220,
            heroes: ['silvia', 'vigour', 'rime', 'ardeos'],  // 适用英雄：希尔薇、vigour、rime、ardeos
            relicAbilityName: '强效隐形',
            relicAbilityDesc: '立即为你和附近的所有盟友施加强效隐形效果,持续15秒。\n\n只能在战斗外使用。'
        },
        {
            id: '111',
            name: '复活魔典',
            icon: 'assets/icons/relic/111.png',
            itemLevel: 330,
            intellect: 178,
            haste: 280,
            spirit: 120,
            heroes: ['silvia', 'vigour', 'rime', 'ardeos'],  // 适用英雄：希尔薇、vigour、rime、ardeos
            relicAbilityName: '复活',
            relicAbilityDesc: '复活一名阵亡的盟友。\n\n可在战斗中使用。'
        },
        {
            id: '1498',
            name: '嗡鸣传送石',
            icon: 'assets/icons/relic/1498.png',
            itemLevel: 330,
            intellect: 178,
            critRate: 60,
            mastery: 340,
            heroes: ['silvia', 'vigour', 'rime', 'ardeos'],  // 适用英雄：希尔薇、vigour、rime、ardeos
            relicAbilityName: '召唤传送门',
            relicAbilityDesc: '召唤两道可交互的传送门，你和盟友可借此在两地之间安全穿行。\n\n同时只能存在 1 组传送门。'
        },
        { id: 'relic_attack', name: '攻击遗物', icon: slotIcons.relic1, attack: 50, critRate: 8 },
        { id: 'relic_defense', name: '防御遗物', icon: slotIcons.relic1, defense: 40, health: 80 },
        { id: 'relic_balanced', name: '平衡遗物', icon: slotIcons.relic1, attack: 25, defense: 25, health: 50, mana: 30 },
        { id: 'relic_crit', name: '暴击遗物', icon: slotIcons.relic1, critRate: 15, critDamage: 30 },
        { id: 'relic_legend', name: '传说遗物', icon: slotIcons.relic1, attack: 40, defense: 40, health: 100, mana: 60, critRate: 10 }
    ],
    weapon: [
        {
            id: '3556',
            name: '泽拉莱斯之镰',
            icon: 'assets/icons/weapon/3556.png',
            itemLevel: 330,
            stamina: 534,        // 耐力
            intellect: 178,      // 智力
            mastery: 200,       // 精通
            spirit: 245,        // 灵魂
            heroes: ['silvia'],  // 适用英雄：希尔薇
            // 技能：泽拉莱斯之饥
            abilityName: '泽拉莱斯之饥',
            abilityDesc: '这是一个引导法术。在3秒内,每0.5秒对目标敌人造成 5,463 - 6,677 点魔法伤害。同时治疗你相当于造成伤害100%的生命值。\n\n你从泽拉莱斯之饥获得的任何过量治疗将被投射给至多3名半径3000范围内的盟友,过量治疗量在他们之间均分。',
        },
        {
            id: '3562',
            name: '塑冰者烙印',
            icon: 'assets/icons/weapon/3562.png',
            itemLevel: 330,
            stamina: 534,        // 耐力
            intellect: 178,      // 智力
            critRate: 200,      // 暴击
            haste: 245,         // 急速
            heroes: ['silvia'],  // 适用英雄：希尔薇
            // 技能：凛光贮所
            abilityName: '凛光贮所',
            abilityDesc: '对 6000 半径范围内的所有玩家施加凛光,至多 60 层,在玩家间均分,持续 21 秒。\n\n受凛光影响的玩家在受到伤害时会消耗 1 层,并为该玩家治疗 3,771 - 4,609 点生命值。\n\n每名玩家至多获得 20 层。\n\n效果结束时,每层剩余凛光会使凛光贮所的冷却时间缩短 0.3 秒。',
        },
        {
            id: '3544',
            name: '埃尔赫林秘宝',
            icon: 'assets/icons/weapon/3544.png',
            itemLevel: 330,
            stamina: 534,        // 耐力
            intellect: 178,      // 智力
            haste: 200,         // 急速
            mastery: 245,       // 精通
            heroes: ['silvia'],  // 适用英雄：希尔薇
            // 技能：暮光天矢
            abilityName: '暮光天矢',
            abilityDesc: '对目标敌人造成 7,164 - 8,756 点伤害,或为目标盟友治疗 7,164 - 8,756 点生命值。每次施放暮光天矢都会使你获得1层蚀变,每层使下次暮光天矢造成的伤害提高100%,或使治疗提高100%。\n\n暮光天矢获得相当于你急速的冷却回复。\n每施放3次重置蚀变层数。',
        },
        {
            id: '3550',
            name: '仙辉花园之镰',
            // 注意：相对路径，适用于直接双击本地 index.html 打开
            icon: 'assets/icons/weapon/3550.png',
            itemLevel: 330,
            stamina: 534,        // 耐力
            intellect: 178,      // 智力
            critRate: 245,       // 暴击（数值）
            spirit: 200,         // 灵魂
            heroes: ['silvia'],  // 适用英雄：希尔薇
            // 技能：自然之怒
            abilityName: '自然之怒',
            abilityDesc: '召唤自然之力，在至多 4 个敌人之间弹跳，对每个敌人造成 12,579 - 15,374 点自然伤害，并在至多 4 名盟友之间弹跳，为每名盟友治疗 16,353 - 19,987 点生命值。\n\n自然之怒具有 +30% 额外暴击率。',
        }
    ]
};

