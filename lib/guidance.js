'use strict';

// Implementation-location labels shared by guidance, usage docs, and the UI.
const IMPL = {
  tag: { key: 'tag', name: '数据标签', short: '标签' },
  attribute: { key: 'attribute', name: 'AttributeSet 属性', short: '属性' },
  ge: { key: 'ge', name: 'GameplayEffect 效果', short: '效果' },
  ga: { key: 'ga', name: 'GameplayAbility 能力', short: '能力' },
  gc: { key: 'gc', name: 'GameplayCue 表现', short: '表现' },
  component: { key: 'component', name: 'ActorComponent 组件', short: '组件' },
};

const GENRES = {
  survival: {
    name: '生存',
    intro: '围绕资源、状态、环境与建造的压力循环。',
    domains: [
      {
        key: 'Vital', name: '生存指标',
        intro: '驱动生存压力的核心数值，通常落到 AttributeSet。',
        tags: [
          { tag: 'Vital.Health', comment: '生命值', impl: 'attribute' },
          { tag: 'Vital.Hunger', comment: '饥饿度', impl: 'attribute' },
          { tag: 'Vital.Thirst', comment: '口渴度', impl: 'attribute' },
          { tag: 'Vital.Stamina', comment: '体力', impl: 'attribute' },
          { tag: 'Vital.Temperature', comment: '体温', impl: 'attribute' },
          { tag: 'Vital.Sanity', comment: '理智值', impl: 'attribute' },
        ],
      },
      {
        key: 'Resource', name: '资源',
        intro: '采集、持有与转换，主要作为数据标签和背包内容。',
        tags: [
          { tag: 'Resource.Wood', comment: '木材', impl: 'tag' },
          { tag: 'Resource.Stone', comment: '石料', impl: 'tag' },
          { tag: 'Resource.Fiber', comment: '纤维', impl: 'tag' },
          { tag: 'Resource.Food', comment: '食物', impl: 'tag' },
          { tag: 'Resource.Water', comment: '净水', impl: 'tag' },
          { tag: 'Resource.Metal', comment: '金属', impl: 'tag' },
        ],
      },
      {
        key: 'Building', name: '建造',
        intro: '放置、升级与拆除，通常由 Ability 或组件驱动。',
        tags: [
          { tag: 'Building.Place', comment: '放置建筑', impl: 'ga' },
          { tag: 'Building.Repair', comment: '修复', impl: 'ga' },
          { tag: 'Building.Dismantle', comment: '拆除', impl: 'ga' },
          { tag: 'Building.Foundation', comment: '地基', impl: 'tag' },
          { tag: 'Building.Wall', comment: '墙体', impl: 'tag' },
          { tag: 'Building.CraftStation', comment: '制作台', impl: 'tag' },
        ],
      },
      {
        key: 'Crafting', name: '制作',
        intro: '配方、材料与产出，配方常做成数据表。',
        tags: [
          { tag: 'Crafting.Recipe', comment: '配方', impl: 'tag' },
          { tag: 'Crafting.Cook', comment: '烹饪', impl: 'ga' },
          { tag: 'Crafting.Forge', comment: '锻造', impl: 'ga' },
          { tag: 'Crafting.BuildTool', comment: '制作工具', impl: 'ga' },
        ],
      },
      {
        key: 'Weather', name: '天气与环境',
        intro: '改变状态与表现的环境条件。',
        tags: [
          { tag: 'Weather.Rain', comment: '下雨', impl: 'ge' },
          { tag: 'Weather.Snow', comment: '下雪', impl: 'ge' },
          { tag: 'Weather.HeatWave', comment: '热浪', impl: 'ge' },
          { tag: 'Weather.ColdFront', comment: '寒潮', impl: 'ge' },
        ],
      },
      {
        key: 'Combat', name: '战斗',
        intro: '攻击、受伤与敌人行为。',
        tags: [
          { tag: 'Combat.Attack', comment: '攻击', impl: 'ga' },
          { tag: 'Combat.Block', comment: '格挡', impl: 'ga' },
          { tag: 'Combat.Hit', comment: '命中', impl: 'gc' },
          { tag: 'Combat.Critical', comment: '暴击', impl: 'ge' },
          { tag: 'Combat.Enemy', comment: '敌对单位', impl: 'tag' },
        ],
      },
    ],
    states: [
      { tag: 'Status.Bleeding', comment: '流血', impl: 'ge' },
      { tag: 'Status.Infected', comment: '感染', impl: 'ge' },
      { tag: 'Status.Hypothermia', comment: '失温', impl: 'ge' },
      { tag: 'Status.Dehydrated', comment: '脱水', impl: 'ge' },
      { tag: 'Status.WellFed', comment: '饱食', impl: 'ge' },
    ],
    events: [
      { tag: 'Event.DayNight', comment: '昼夜切换', impl: 'tag' },
      { tag: 'Event.Downed', comment: '倒地', impl: 'tag' },
      { tag: 'Event.Respawn', comment: '重生', impl: 'tag' },
      { tag: 'Event.CraftComplete', comment: '制作完成', impl: 'tag' },
      { tag: 'Event.BaseAttacked', comment: '基地受袭', impl: 'tag' },
    ],
  },
  wuxia: {
    name: '武侠',
    intro: '以内功、武学、经脉与江湖关系为核心。',
    domains: [
      {
        key: 'Neigong', name: '内功',
        intro: '真气的运转与心法，通常落到 AttributeSet 与效果。',
        tags: [
          { tag: 'Neigong.Qi', comment: '真气', impl: 'attribute' },
          { tag: 'Neigong.QiRegen', comment: '真气回复', impl: 'attribute' },
          { tag: 'Neigong.Cultivation', comment: '修为', impl: 'attribute' },
          { tag: 'Neigong.Meditate', comment: '打坐', impl: 'ga' },
          { tag: 'Neigong.Breakthrough', comment: '突破', impl: 'ge' },
        ],
      },
      {
        key: 'MartialArt', name: '武学',
        intro: '招式与身法，主动能力为主。',
        tags: [
          { tag: 'MartialArt.Stance', comment: '起手式', impl: 'ga' },
          { tag: 'MartialArt.Combo', comment: '连招', impl: 'ga' },
          { tag: 'MartialArt.Dodge', comment: '闪避', impl: 'ga' },
          { tag: 'MartialArt.Parry', comment: '拆招', impl: 'ga' },
          { tag: 'MartialArt.Qinggong', comment: '轻功', impl: 'ga' },
        ],
      },
      {
        key: 'Weapon', name: '兵器',
        intro: '兵刃类型与专精。',
        tags: [
          { tag: 'Weapon.Sword', comment: '剑', impl: 'tag' },
          { tag: 'Weapon.Saber', comment: '刀', impl: 'tag' },
          { tag: 'Weapon.Spear', comment: '枪', impl: 'tag' },
          { tag: 'Weapon.Staff', comment: '棍', impl: 'tag' },
          { tag: 'Weapon.Hidden', comment: '暗器', impl: 'tag' },
        ],
      },
      {
        key: 'Meridian', name: '经脉',
        intro: '穴位与经脉，常作为成长与加成数据。',
        tags: [
          { tag: 'Meridian.Acupoint', comment: '穴位', impl: 'tag' },
          { tag: 'Meridian.Open', comment: '打通经脉', impl: 'ga' },
          { tag: 'Meridian.QiBurst', comment: '真气爆发', impl: 'ge' },
        ],
      },
      {
        key: 'Jianghu', name: '江湖',
        intro: '门派、名望与人际关系。',
        tags: [
          { tag: 'Jianghu.Reputation', comment: '名望', impl: 'attribute' },
          { tag: 'Jianghu.Favor', comment: '好感', impl: 'attribute' },
          { tag: 'Jianghu.Sect', comment: '门派', impl: 'tag' },
          { tag: 'Jianghu.Rival', comment: '宿敌', impl: 'tag' },
        ],
      },
      {
        key: 'Combat', name: '战斗',
        intro: '战斗过程与打击表现。',
        tags: [
          { tag: 'Combat.Hit', comment: '命中', impl: 'gc' },
          { tag: 'Combat.Crit', comment: '会心', impl: 'ge' },
          { tag: 'Combat.Stun', comment: '眩晕', impl: 'ge' },
          { tag: 'Combat.Knockback', comment: '击退', impl: 'ge' },
        ],
      },
    ],
    states: [
      { tag: 'Status.Poisoned', comment: '中毒', impl: 'ge' },
      { tag: 'Status.QiDeviation', comment: '走火入魔', impl: 'ge' },
      { tag: 'Status.InnerInjury', comment: '内伤', impl: 'ge' },
      { tag: 'Status.Exhausted', comment: '力竭', impl: 'ge' },
      { tag: 'Status.Enlightened', comment: '顿悟', impl: 'ge' },
    ],
    events: [
      { tag: 'Event.Duel', comment: '切磋', impl: 'tag' },
      { tag: 'Event.Breakthrough', comment: '突破', impl: 'tag' },
      { tag: 'Event.SectJoin', comment: '入门', impl: 'tag' },
      { tag: 'Event.Revenge', comment: '寻仇', impl: 'tag' },
    ],
  },
  'western-fantasy': {
    name: '西幻',
    intro: '属性、魔法、职业与阵营构成的奇幻世界。',
    domains: [
      {
        key: 'Attribute', name: '属性',
        intro: '经典六维或简化属性，落到 AttributeSet。',
        tags: [
          { tag: 'Attribute.Strength', comment: '力量', impl: 'attribute' },
          { tag: 'Attribute.Agility', comment: '敏捷', impl: 'attribute' },
          { tag: 'Attribute.Intellect', comment: '智力', impl: 'attribute' },
          { tag: 'Attribute.Vitality', comment: '体质', impl: 'attribute' },
          { tag: 'Attribute.Mana', comment: '法力', impl: 'attribute' },
        ],
      },
      {
        key: 'Magic', name: '魔法',
        intro: '法术施放，以 Ability 为主。',
        tags: [
          { tag: 'Magic.Fireball', comment: '火球术', impl: 'ga' },
          { tag: 'Magic.Heal', comment: '治疗术', impl: 'ga' },
          { tag: 'Magic.Shield', comment: '护盾', impl: 'ga' },
          { tag: 'Magic.Teleport', comment: '传送', impl: 'ga' },
          { tag: 'Magic.Summon', comment: '召唤', impl: 'ga' },
        ],
      },
      {
        key: 'Element', name: '元素',
        intro: '元素类型与克制关系，主要作为数据标签。',
        tags: [
          { tag: 'Element.Fire', comment: '火焰', impl: 'tag' },
          { tag: 'Element.Ice', comment: '冰霜', impl: 'tag' },
          { tag: 'Element.Lightning', comment: '雷电', impl: 'tag' },
          { tag: 'Element.Holy', comment: '神圣', impl: 'tag' },
          { tag: 'Element.Shadow', comment: '暗影', impl: 'tag' },
        ],
      },
      {
        key: 'Class', name: '职业',
        intro: '职业定位与成长。',
        tags: [
          { tag: 'Class.Warrior', comment: '战士', impl: 'tag' },
          { tag: 'Class.Mage', comment: '法师', impl: 'tag' },
          { tag: 'Class.Ranger', comment: '游侠', impl: 'tag' },
          { tag: 'Class.Priest', comment: '牧师', impl: 'tag' },
        ],
      },
      {
        key: 'Item', name: '物品与装备',
        intro: '装备槽位、品质与效果。',
        tags: [
          { tag: 'Item.Weapon', comment: '武器', impl: 'tag' },
          { tag: 'Item.Armor', comment: '护甲', impl: 'tag' },
          { tag: 'Item.Ring', comment: '戒指', impl: 'tag' },
          { tag: 'Item.RarityCommon', comment: '普通品质', impl: 'tag' },
          { tag: 'Item.RarityLegendary', comment: '传说品质', impl: 'tag' },
        ],
      },
      {
        key: 'Faction', name: '阵营',
        intro: '阵营归属与声望。',
        tags: [
          { tag: 'Faction.Alliance', comment: '联盟', impl: 'tag' },
          { tag: 'Faction.Horde', comment: '部落', impl: 'tag' },
          { tag: 'Faction.Reputation', comment: '声望', impl: 'attribute' },
        ],
      },
    ],
    states: [
      { tag: 'Status.Burning', comment: '灼烧', impl: 'ge' },
      { tag: 'Status.Frozen', comment: '冰冻', impl: 'ge' },
      { tag: 'Status.Cursed', comment: '诅咒', impl: 'ge' },
      { tag: 'Status.Blessed', comment: '祝福', impl: 'ge' },
      { tag: 'Status.Rooted', comment: '定身', impl: 'ge' },
    ],
    events: [
      { tag: 'Event.QuestAccept', comment: '接取任务', impl: 'tag' },
      { tag: 'Event.LevelUp', comment: '升级', impl: 'tag' },
      { tag: 'Event.DungeonClear', comment: '通关副本', impl: 'tag' },
      { tag: 'Event.Raid', comment: '团队副本', impl: 'tag' },
    ],
  },
  'sci-fi': {
    name: '科幻',
    intro: '属性、科技、能量与模组构成的未来系统。',
    domains: [
      {
        key: 'Attribute', name: '属性',
        intro: '生命、护盾与能量等核心数值。',
        tags: [
          { tag: 'Attribute.Health', comment: '生命', impl: 'attribute' },
          { tag: 'Attribute.Shield', comment: '护盾', impl: 'attribute' },
          { tag: 'Attribute.Energy', comment: '能量', impl: 'attribute' },
          { tag: 'Attribute.Oxygen', comment: '氧气', impl: 'attribute' },
          { tag: 'Attribute.Speed', comment: '速度', impl: 'attribute' },
        ],
      },
      {
        key: 'Tech', name: '科技',
        intro: '科技树与研发。',
        tags: [
          { tag: 'Tech.Research', comment: '研究', impl: 'ga' },
          { tag: 'Tech.Unlock', comment: '解锁', impl: 'tag' },
          { tag: 'Tech.Tier1', comment: '一级科技', impl: 'tag' },
          { tag: 'Tech.Tier2', comment: '二级科技', impl: 'tag' },
        ],
      },
      {
        key: 'Weapon', name: '武器',
        intro: '能量武器与弹道表现。',
        tags: [
          { tag: 'Weapon.Laser', comment: '激光', impl: 'ga' },
          { tag: 'Weapon.Plasma', comment: '等离子', impl: 'ga' },
          { tag: 'Weapon.Railgun', comment: '电磁炮', impl: 'ga' },
          { tag: 'Weapon.Drone', comment: '无人机', impl: 'ga' },
        ],
      },
      {
        key: 'Module', name: '模组',
        intro: '装备模组与插槽。',
        tags: [
          { tag: 'Module.DamageBoost', comment: '伤害增强', impl: 'ge' },
          { tag: 'Module.ShieldBoost', comment: '护盾增强', impl: 'ge' },
          { tag: 'Module.Stealth', comment: '隐身', impl: 'ge' },
          { tag: 'Module.Hover', comment: '悬浮', impl: 'component' },
        ],
      },
      {
        key: 'Vehicle', name: '载具',
        intro: '载具状态与操控。',
        tags: [
          { tag: 'Vehicle.Enter', comment: '进入载具', impl: 'ga' },
          { tag: 'Vehicle.Exit', comment: '离开载具', impl: 'ga' },
          { tag: 'Vehicle.Fuel', comment: '燃料', impl: 'attribute' },
          { tag: 'Vehicle.Boost', comment: '加速', impl: 'ga' },
        ],
      },
      {
        key: 'Faction', name: '阵营',
        intro: '派系归属与敌对关系。',
        tags: [
          { tag: 'Faction.Federation', comment: '联邦', impl: 'tag' },
          { tag: 'Faction.Insurgent', comment: '反抗军', impl: 'tag' },
          { tag: 'Faction.AI', comment: '人工智能', impl: 'tag' },
        ],
      },
    ],
    states: [
      { tag: 'Status.Overheat', comment: '过热', impl: 'ge' },
      { tag: 'Status.EMP', comment: '电磁干扰', impl: 'ge' },
      { tag: 'Status.Hacked', comment: '被入侵', impl: 'ge' },
      { tag: 'Status.ShieldDown', comment: '护盾失效', impl: 'ge' },
      { tag: 'Status.Invisible', comment: '隐形', impl: 'ge' },
    ],
    events: [
      { tag: 'Event.Warp', comment: '跃迁', impl: 'tag' },
      { tag: 'Event.Alert', comment: '警报', impl: 'tag' },
      { tag: 'Event.Extract', comment: '撤离', impl: 'tag' },
      { tag: 'Event.DropPod', comment: '空投舱', impl: 'tag' },
    ],
  },
};

const ROLES = {
  designer: {
    name: '策划',
    lens: '从系统设计出发：重视数值、状态流转、事件与经济闭环。',
    extraDomains: ['Status', 'Event', 'Economy'],
    extraTags: [
      { tag: 'Economy.Currency', comment: '货币', impl: 'attribute' },
      { tag: 'Economy.Shop', comment: '商店', impl: 'component' },
      { tag: 'Economy.Trade', comment: '交易', impl: 'ga' },
    ],
  },
  'combat-3c': {
    name: '3C 策划',
    lens: '从角色/镜头/操控（Character, Camera, Control）出发：重视移动、相机、打击感与连招。',
    extraDomains: ['Movement', 'Camera', 'Control', 'HitFeedback'],
    extraTags: [
      { tag: 'Movement.Sprint', comment: '冲刺', impl: 'ga' },
      { tag: 'Movement.Jump', comment: '跳跃', impl: 'ga' },
      { tag: 'Camera.Shake', comment: '镜头震动', impl: 'gc' },
      { tag: 'Camera.LockOn', comment: '锁定目标', impl: 'component' },
      { tag: 'HitFeedback.HitStop', comment: '顿帧', impl: 'gc' },
      { tag: 'HitFeedback.ScreenFlash', comment: '屏幕反馈', impl: 'gc' },
    ],
  },
  interaction: {
    name: '交互工程师',
    lens: '从输入与交互流程出发：重视输入映射、交互状态、提示与可访问性。',
    extraDomains: ['Input', 'Interaction', 'Accessibility'],
    extraTags: [
      { tag: 'Input.Primary', comment: '主输入', impl: 'tag' },
      { tag: 'Input.Secondary', comment: '副输入', impl: 'tag' },
      { tag: 'Interaction.Interactable', comment: '可交互物', impl: 'tag' },
      { tag: 'Interaction.Prompt', comment: '交互提示', impl: 'gc' },
      { tag: 'Interaction.Focus', comment: '交互聚焦', impl: 'component' },
      { tag: 'Accessibility.HoldToConfirm', comment: '长按确认', impl: 'tag' },
    ],
  },
  ui: {
    name: 'UI 设计',
    lens: '从界面与反馈出发：重视 HUD、菜单、图标状态与反馈表现。',
    extraDomains: ['UI', 'HUD', 'Feedback'],
    extraTags: [
      { tag: 'UI.HUD.HealthBar', comment: '生命条', impl: 'gc' },
      { tag: 'UI.Menu.Inventory', comment: '背包界面', impl: 'component' },
      { tag: 'UI.Prompt.Pickup', comment: '拾取提示', impl: 'gc' },
      { tag: 'UI.State.LowHealth', comment: '低血量状态', impl: 'gc' },
      { tag: 'Feedback.Toast', comment: '通知浮层', impl: 'gc' },
    ],
  },
};

function normalizeKey(value) {
  return String(value || '').toLowerCase().replace(/[\s_-]+/g, '');
}

function suggestImpl(tagPath, comment) {
  const s = normalizeKey(tagPath) + ' ' + normalizeKey(comment);
  if (/health|mana|stamina|energy|shield|oxygen|reputation|favor|currency|fuel|strength|agility|intellect|vitality|qi\b|cultivation/.test(s)) return 'attribute';
  if (/buff|debuff|bleed|burn|freeze|poison|curse|stun|knockback|overheat|emp\b|hacked|rooted|crit|critical|effect|modifier|weather|rain|snow|heatwave|coldfront/.test(s)) return 'ge';
  if (/ability|skill|attack|dodge|parry|block|cast|spell|teleport|summon|heal|fireball|sprint|jump|enter|exit|boost|craft|cook|forge|build|place|repair|dismantle|research|trade|interact|meditate|qinggong|stance|combo|use/.test(s)) return 'ga';
  if (/cue|vfx|sfx|sound|hit|impact|shake|flash|hitstop|toast|prompt|hud|healthbar|feedback|screen/.test(s)) return 'gc';
  if (/camera|lockon|focus|hover|stealth|component|shop|movement/.test(s)) return 'component';
  return 'tag';
}

function domainItems(domain) {
  return (domain.tags || []).map((t) => ({
    tag: t.tag,
    comment: t.comment || '',
    impl: t.impl || 'tag',
  }));
}

function seedItems(genreKey, roleKey) {
  const genre = GENRES[genreKey] || GENRES.survival;
  const role = ROLES[roleKey] || ROLES.designer;
  const items = [];
  for (const d of genre.domains) items.push(...domainItems(d));
  for (const t of genre.states) items.push({ tag: t.tag, comment: t.comment, impl: t.impl });
  for (const t of genre.events) items.push({ tag: t.tag, comment: t.comment, impl: t.impl });
  for (const t of (role.extraTags || [])) items.push({ tag: t.tag, comment: t.comment, impl: t.impl });
  return items;
}

function getStep(genreKey, roleKey, step, ctx = {}) {
  const genre = GENRES[genreKey] || GENRES.survival;
  const role = ROLES[roleKey] || ROLES.designer;

  if (step === 1) {
    const items = genre.domains.map((d) => ({
      tag: d.key,
      comment: d.name,
      impl: 'tag',
      kind: 'domain',
      domain: d.key,
    }));
    return {
      title: '第一步：确立顶层分类',
      message:
        `${genre.name}题材的核心通常是这些领域。${role.lens}\n` +
        `先确定顶层分类，再往下展开；你也可以合并或自定义领域。`,
      items,
      hint: '选择要展开的领域，或直接输入你自己的想法。',
    };
  }

  if (step === 2) {
    const key = ctx.domainKey || genre.domains[0].key;
    const domain = genre.domains.find((d) => d.key === key) || genre.domains[0];
    return {
      title: `第二步：展开「${domain.name}」`,
      message: `${domain.intro}\n下面是该领域的候选标签，按需添加，comment 可改。`,
      items: domainItems(domain),
      hint: '点击“添加”采纳标签，或输入自己的标签继续。',
    };
  }

  if (step === 3) {
    const roleExtras = (role.extraTags || []).map((t) => ({
      tag: t.tag,
      comment: t.comment || '',
      impl: t.impl || 'tag',
      kind: 'role',
    }));
    return {
      title: '第三步：补充状态与事件',
      message:
        '状态标签用于“当前处于什么状态”（常落到 GE），事件标签用于“发生了什么”（用于触发规则）。\n' +
        `下面也补上了「${role.name}」视角常用的标签。`,
      items: [
        ...genre.states.map((t) => ({ tag: t.tag, comment: t.comment, impl: t.impl, kind: 'state' })),
        ...genre.events.map((t) => ({ tag: t.tag, comment: t.comment, impl: t.impl, kind: 'event' })),
        ...roleExtras,
      ],
      hint: '添加完状态/事件后，进入实现位置梳理。',
    };
  }

  if (step === 4) {
    return {
      title: '第四步：梳理实现位置',
      message:
        '为每个标签标记实现位置，这决定使用文档的最终内容：\n' +
        'GE = 数值/效果变化，GA = 主动行为/技能，GC = 表现/VFX/SFX，' +
        'AttributeSet = 核心属性，Component = 持续状态/行为，Tag = 仅作数据标签。',
      items: [],
      hint: '到“标签”页逐个确认每个 tag 的实现位置，然后生成文档。',
    };
  }

  return {
    title: '完成',
    message:
      '标签系统已可导出。生成使用文档，确认每个 tag 的实现位置后即可导出 INI/CSV/JSON/C++，或发布到市场。',
    items: [],
    hint: '去“标签”页复核，或直接生成文档与导出。',
  };
}

function findDomainByMention(genreKey, message) {
  const genre = GENRES[genreKey] || GENRES.survival;
  const m = String(message || '').toLowerCase();
  const aliases = {
    survival: { 生存: 'Vital', 生命: 'Vital', 饥饿: 'Vital', 资源: 'Resource', 建造: 'Building', 制作: 'Crafting', 天气: 'Weather', 战斗: 'Combat' },
    wuxia: { 内功: 'Neigong', 真气: 'Neigong', 武学: 'MartialArt', 招式: 'MartialArt', 兵器: 'Weapon', 经脉: 'Meridian', 江湖: 'Jianghu', 战斗: 'Combat' },
    'western-fantasy': { 属性: 'Attribute', 魔法: 'Magic', 元素: 'Element', 职业: 'Class', 物品: 'Item', 装备: 'Item', 阵营: 'Faction' },
    'sci-fi': { 属性: 'Attribute', 科技: 'Tech', 武器: 'Weapon', 模组: 'Module', 载具: 'Vehicle', 阵营: 'Faction' },
  };
  for (const [word, key] of Object.entries(aliases[genreKey] || {})) {
    if (m.includes(word)) return key;
  }
  for (const d of genre.domains) {
    if (m.includes(d.name.toLowerCase()) || m.includes(d.key.toLowerCase())) return d.key;
  }
  return null;
}

function chat(genreKey, roleKey, message) {
  const genre = GENRES[genreKey] || GENRES.survival;
  const role = ROLES[roleKey] || ROLES.designer;
  const m = String(message || '').trim();
  if (!m) return { reply: '可以告诉我你想补充的题材方向或具体标签，我会给出候选。', items: [] };

  const wantsFullSystem =
    /(生成|整套|完整|一键|一套)/.test(m) && /(体系|标签|tag|系统)/i.test(m);
  if (wantsFullSystem) {
    return {
      reply: `这是为「${genre.name}」题材（${role.name}视角）准备的完整候选体系，可先应用，再按需增删。`,
      items: seedItems(genreKey, roleKey),
    };
  }

  const domainKey = findDomainByMention(genreKey, m);
  if (domainKey) {
    const domain = genre.domains.find((d) => d.key === domainKey);
    return {
      reply: `关于「${domain.name}」：${domain.intro} 下面是一些候选标签。`,
      items: domainItems(domain),
    };
  }

  const roleHints = {
    'combat-3c': ['连招', '打击', '镜头', '移动', '闪避', '冲刺', '顿帧', '反馈', '手感'],
    ui: ['菜单', '界面', '图标', 'HUD', '血条', '背包', '提示', '反馈'],
    interaction: ['输入', '交互', '提示', '长按', '聚焦', '可交互', '键位'],
    designer: ['数值', '经济', '状态', '事件', '货币', '商店', '交易'],
  };
  const hints = roleHints[roleKey] || [];
  if (hints.some((w) => m.includes(w))) {
    return {
      reply: `从「${role.name}」的视角看，这些标签通常最值得先搭：`,
      items: (role.extraTags || []).map((t) => ({ tag: t.tag, comment: t.comment || '', impl: t.impl || 'tag' })),
    };
  }

  // Treat a CamelCase or dotted token as a user-supplied tag idea.
  const token = m.match(/[A-Za-z][A-Za-z0-9_.]*/);
  if (token) {
    const proposed = token[0].replace(/[.\s]+$/, '');
    return {
      reply: `收到，我把「${proposed}」作为你的自定义标签加入，并给出一个默认实现位置（可再改）。`,
      items: [{ tag: proposed, comment: '', impl: suggestImpl(proposed, '') }],
    };
  }

  return {
    reply: `我建议先围绕 ${genre.name} 的核心领域展开。${role.lens} 你也可以直接说出想覆盖的功能，例如“天气系统”“连招反馈”。`,
    items: [],
  };
}

module.exports = { GENRES, ROLES, IMPL, suggestImpl, getStep, chat };
