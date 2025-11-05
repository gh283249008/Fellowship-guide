# Fellowship 配装模拟器

一个用于游戏《Fellowship》的配装Build模拟器，帮助玩家测试不同的装备搭配方案。

## 功能特性

- 🎮 **装备选择系统**：支持武器、护甲、头盔、靴子和三个饰品位
- 📊 **实时属性计算**：自动计算并显示所有装备带来的属性加成
- 💾 **Build保存/加载**：保存多个配装方案，随时切换
- 🎨 **现代化UI**：美观的深色主题界面，响应式设计
- 📱 **移动端支持**：适配手机和平板设备

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件
2. 从下拉菜单中选择装备
3. 实时查看属性变化
4. 点击"保存Build"按钮保存当前配装
5. 点击"加载Build"按钮加载已保存的配装
6. 点击"重置"按钮清空当前配装

## 属性说明

- **攻击力**：影响物理伤害输出
- **防御力**：减少受到的物理伤害
- **生命值**：角色的最大生命值
- **魔法值**：角色的最大魔法值
- **暴击率**：触发暴击的概率（百分比）
- **暴击伤害**：暴击时的伤害加成（百分比）
- **移动速度**：角色移动速度
- **冷却缩减**：技能冷却时间减少（百分比）

## 自定义装备数据

### 方法一：使用数据录入工具（推荐）

1. 打开 `equipment-editor.html` 文件
2. 填写装备信息表单
3. 点击"生成JSON"按钮
4. 复制生成的代码
5. 打开 `equipment-data.js` 文件
6. 找到对应的装备分类数组（如 `weapon`、`relic` 等）
7. 将代码粘贴到数组中，注意格式和逗号
8. 如果技能需要样式化，在 `app.js` 的 `TextStyler.getPresetRules()` 中添加样式规则

### 方法二：直接编辑代码

编辑 `equipment-data.js` 文件可以添加或修改装备数据。每个装备对象包含：

- `id`: 装备唯一标识符（必填）
- `name`: 装备名称（必填）
- `icon`: 图标路径（可选）
- `itemLevel`: 物品等级（可选）
- `heroes`: 适用英雄数组（可选，不填则所有英雄可用）
- 各种属性值：health, defense, physicalDR, magicDR, stamina, intellect, critRate, mastery, haste, spirit, dodge, moveSpeed, attack, critDamage, mana, cooldown
- `abilityName`: 武器技能名称（仅武器）
- `abilityDesc`: 武器技能描述（仅武器）
- `relicAbilityName`: 遗物技能名称（仅遗物）
- `relicAbilityDesc`: 遗物技能描述（仅遗物）

## 技术栈

- 纯 HTML/CSS/JavaScript
- 使用 localStorage 保存数据
- 响应式设计，支持移动端

## 浏览器支持

支持所有现代浏览器（Chrome, Firefox, Safari, Edge）

