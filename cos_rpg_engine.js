// =========================================================================
// 🛡️ CURSE OF STRAHD — UNIFIED RPG EQUIPMENT, BACKPACK, CRAFT & TRADE ENGINE
// =========================================================================
(function () {
    'use strict';

    const SLOTS = [
        { id: 'head',     label: 'Head',       icon: '🪖', group: 'body' },
        { id: 'cape',     label: 'Cape',       icon: '🧥', group: 'body' },
        { id: 'body',     label: 'Body',       icon: '🛡️', group: 'body' },
        { id: 'legs',     label: 'Legs',       icon: '👖', group: 'body' },
        { id: 'feet',     label: 'Feet',       icon: '🥾', group: 'body' },
        { id: 'amulet',   label: 'Amulet',     icon: '📿', group: 'acc'  },
        { id: 'ring1',    label: 'Ring 1',     icon: '💍', group: 'ring' },
        { id: 'ring2',    label: 'Ring 2',     icon: '💍', group: 'ring' },
        { id: 'mainHand', label: 'Main Hand',  icon: '⚔️', group: 'hand' },
        { id: 'offHand',  label: 'Off-Hand',   icon: '🛡️', group: 'hand' },
        { id: 'ranged',   label: 'Ranged',     icon: '🏹', group: 'hand' }
    ];

    const PARTY_MEMBERS = [
        { id: 'piper',   name: 'Piper',   emoji: '🎩', label: '🎩 Piper' },
        { id: 'jacomir', name: 'Jacomir', emoji: '👑', label: '👑 Jacomir' },
        { id: 'yvaine',  name: 'Yvaine',  emoji: '🔫', label: '🔫 Yvaine' },
        { id: 'dm',      name: 'DM Vault', emoji: '🛡️', label: '🛡️ Return to DM' }
    ];

    // Comprehensive Barovian + Starting Gear Auto-Recognition Catalog
    const GEAR_CATALOG = [
        // --- KOLYAN'S 3 ENCHANTED ROBES ---
        {
            match: ['black robe'],
            category: 'armor',
            slots: ['body'],
            acBonus: 1,
            saveBonus: 1,
            robeKey: 'black',
            summary: '+1 AC • +1 All Saves'
        },
        {
            match: ['red robe'],
            category: 'armor',
            slots: ['body'],
            spellFireBonus: '1d4+1',
            robeKey: 'red',
            summary: '+1d4+1 Fire Dmg on Spells'
        },
        {
            match: ['green robe'],
            category: 'armor',
            slots: ['body'],
            skillAdv: ['Arcana'],
            robeKey: 'green',
            summary: 'Adv on Arcana Checks'
        },

        // --- ARMOR & CLOAKS & HEADGEAR ---
        {
            match: ['chain mail'],
            category: 'armor',
            slots: ['body'],
            baseAC: 16,
            armorWorn: true,
            heavyArmor: true,
            stealthDisadv: true,
            summary: 'Base AC 16 (Heavy • Stealth Disadv)'
        },
        {
            match: ['dragonplate', 'plate armor', 'full plate'],
            category: 'armor',
            slots: ['body'],
            baseAC: 18,
            armorWorn: true,
            heavyArmor: true,
            stealthDisadv: true,
            summary: 'Base AC 18 (Heavy Armor)'
        },
        {
            match: ['half plate'],
            category: 'armor',
            slots: ['body'],
            baseAC: 15,
            maxDex: 2,
            armorWorn: true,
            stealthDisadv: true,
            summary: 'Base AC 15 + DEX (max 2)'
        },
        {
            match: ['breastplate'],
            category: 'armor',
            slots: ['body'],
            baseAC: 14,
            maxDex: 2,
            armorWorn: true,
            summary: 'Base AC 14 + DEX (max 2)'
        },
        {
            match: ['studded leather'],
            category: 'armor',
            slots: ['body'],
            baseAC: 12,
            addDex: true,
            armorWorn: true,
            summary: 'AC 12 + Full DEX (Light Armor)'
        },
        {
            match: ['leather armor'],
            category: 'armor',
            slots: ['body'],
            baseAC: 11,
            addDex: true,
            armorWorn: true,
            summary: 'AC 11 + Full DEX (Light Armor)'
        },
        {
            match: ['animated cloak of ravenloft'],
            category: 'armor',
            slots: ['cape'],
            acBonus: 2,
            attune: true,
            summary: '+2 AC • 30ft Fly (Attune)'
        },
        {
            match: ['wereraven', 'cloak of protection'],
            category: 'armor',
            slots: ['cape'],
            acBonus: 1,
            saveBonus: 1,
            attune: true,
            summary: '+1 AC • +1 All Saves (Attune)'
        },
        {
            match: ['bloodhorn', 'mountain pelt'],
            category: 'armor',
            slots: ['cape'],
            acBonus: 1,
            summary: '+1 AC • Cold Resist'
        },
        {
            match: ['traveling cloak', 'royal cloak', 'fur mantle', 'cloak'],
            category: 'armor',
            slots: ['cape'],
            summary: 'Weather-Worn Cloak'
        },
        {
            match: ['hat of disguise'],
            category: 'armor',
            slots: ['head'],
            attune: true,
            summary: 'At-Will Disguise Self (Attune)'
        },
        {
            match: ['helm of brilliance'],
            category: 'armor',
            slots: ['head'],
            attune: true,
            summary: 'Radiant Gems & Fire Resist (Attune)'
        },
        {
            match: ['obsidian barovian crown', 'crown'],
            category: 'armor',
            slots: ['head'],
            summary: 'Royal Crown Regalia'
        },
        {
            match: ['magician\'s hat', 'false-bottom stage'],
            category: 'armor',
            slots: ['head'],
            summary: 'Stage Magician Hat & Props'
        },
        {
            match: ['boots', 'slippers', 'greaves'],
            category: 'armor',
            slots: ['feet'],
            summary: 'Footwear'
        },
        {
            match: ['leggings', 'trousers', 'cuisses'],
            category: 'armor',
            slots: ['legs'],
            summary: 'Leg Armor / Attire'
        },

        // --- AMULETS & RINGS ---
        {
            match: ['whispering grave'],
            category: 'accessory',
            slots: ['amulet'],
            grantsAbility: 'speak_with_dead',
            summary: 'Speak with Dead (1/Long Rest)'
        },
        {
            match: ['holy symbol of ravenkind'],
            category: 'accessory',
            slots: ['amulet'],
            attune: true,
            summary: '10 Chg Sunlight / Hold Vampires (Attune)'
        },
        {
            match: ['donavich', 'sun-rosary', 'rosary'],
            category: 'accessory',
            slots: ['amulet'],
            summary: 'Consecrated Morninglord Rosary'
        },
        {
            match: ['skull-mask charm', 'volenta'],
            category: 'accessory',
            slots: ['amulet'],
            summary: '1/LR False Life Charm'
        },
        {
            match: ['bloodstone', 'pendant', 'amulet', 'necklace', 'medallion'],
            category: 'accessory',
            slots: ['amulet'],
            summary: 'Neck Keepsake / Amulet'
        },
        {
            match: ['ring of protection'],
            category: 'accessory',
            slots: ['ring1', 'ring2'],
            acBonus: 1,
            saveBonus: 1,
            attune: true,
            summary: '+1 AC • +1 All Saves (Attune)'
        },
        {
            match: ['ring of mind shielding'],
            category: 'accessory',
            slots: ['ring1', 'ring2'],
            attune: true,
            summary: 'Blocks Mind Reading & Lies (Attune)'
        },
        {
            match: ['ring of regeneration'],
            category: 'accessory',
            slots: ['ring1', 'ring2'],
            attune: true,
            summary: '1d6 HP / 10 min (Attune)'
        },
        {
            match: ['ring of warmth'],
            category: 'accessory',
            slots: ['ring1', 'ring2'],
            attune: true,
            summary: 'Cold Resist & Freeze Immunity (Attune)'
        },
        {
            match: ['ring of spell storing', 'amber-inlaid spell ring'],
            category: 'accessory',
            slots: ['ring1', 'ring2'],
            attune: true,
            summary: 'Stores Spells (Attune)'
        },
        {
            match: ['signet ring', /\bring\b/],
            category: 'accessory',
            slots: ['ring1', 'ring2'],
            summary: 'Signet / Worn Ring'
        },
        {
            match: ['bloodwell vial'],
            category: 'accessory',
            slots: ['amulet', 'offHand'],
            spellDcBonus: 1,
            spellAtkBonus: 1,
            attune: true,
            summary: '+1 Spell DC & Hit • +5 SP/SR (Attune)'
        },
        {
            match: ['luckstone', 'stone of good luck'],
            category: 'accessory',
            slots: ['amulet'],
            saveBonus: 1,
            attune: true,
            summary: '+1 Ability Checks & Saves (Attune)'
        },

        // --- WEAPONS & SHIELDS ---
        {
            match: ['+2 heraldic shield', 'heraldic shield'],
            category: 'weapon',
            slots: ['offHand'],
            acBonus: 4,
            initBonus: 2,
            isShield: true,
            summary: '+4 AC • +2 Initiative (Shield)'
        },
        {
            match: ['shield'],
            category: 'weapon',
            slots: ['offHand'],
            acBonus: 2,
            isShield: true,
            summary: '+2 AC (Off-Hand Shield)'
        },
        {
            match: ['ancestral greatsword', 'vladimir', 'greatsword'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 2,
            weaponTag: 'greatsword',
            summary: '2H Heavy • 2d6+STR • Graze'
        },
        {
            match: ['silvered longsword'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            versatile: true,
            weaponTag: 'silvered_longsword',
            summary: 'Versatile 1d8/1d10 • Silvered • Sap'
        },
        {
            match: ['sunsword'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 1,
            versatile: true,
            attune: true,
            summary: '+2 Radiant Sun Blade • True Sunlight (Attune)'
        },
        {
            match: ['blood spear of kavan', 'blood spear'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 1,
            versatile: true,
            attune: true,
            summary: '+2 Spear • +2d6 Temp HP on Kill (Attune)'
        },
        {
            match: ['battleaxe', 'treebane'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 1,
            versatile: true,
            summary: 'Versatile 1d8/1d10 • Topple'
        },
        {
            match: ['handaxe'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            weaponTag: 'handaxe',
            summary: '1H Light / Thrown 20/60 • Vex'
        },
        {
            match: ['kolyan\'s silvered heirloom dagger', 'silvered heirloom dagger'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            weaponTag: 'kolyan_dagger',
            summary: '1H Silvered 1d4+DEX • 3 Red Gems'
        },
        {
            match: ['trench knife', 'stiletto'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            weaponTag: 'knife',
            summary: '1H Finesse Light 1d4+DEX'
        },
        {
            match: ['dagger'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            weaponTag: 'dagger',
            summary: '1H Finesse Light / Thrown 20/60'
        },
        {
            match: ['staff of power'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 1,
            versatile: true,
            acBonus: 2,
            saveBonus: 2,
            spellAtkBonus: 2,
            attune: true,
            summary: '+2 AC/Saves/Spell Atk • 20 Chg (Attune)'
        },
        {
            match: ['staff of frost'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 1,
            versatile: true,
            attune: true,
            summary: 'Cold Resist • 10 Chg Ice Spells (Attune)'
        },
        {
            match: ['quarterstaff', 'magician\'s cane', 'gulthias staff'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 1,
            versatile: true,
            weaponTag: 'staff',
            summary: 'Versatile 1d6/1d8 • Arcane Focus'
        },
        {
            match: ['lament'],
            category: 'weapon',
            slots: ['mainHand', 'ranged'],
            hands: 2,
            weaponTag: 'lament',
            stance: 'lament',
            summary: '2H Heavy Rifle • 1d12+4 • 80/240ft'
        },
        {
            match: ['"mercy"', 'mercy (main', 'mercy revolver'],
            category: 'weapon',
            slots: ['mainHand', 'ranged'],
            hands: 1,
            weaponTag: 'mercy',
            stance: 'revolvers',
            summary: '1H Main Revolver • 1d6+4 • 6-Cyl'
        },
        {
            match: ['"less"', 'less (off', 'less revolver'],
            category: 'weapon',
            slots: ['offHand', 'ranged'],
            hands: 1,
            weaponTag: 'less',
            stance: 'revolvers',
            summary: '1H Off-Hand Revolver • 1d6 • 6-Cyl'
        },
        {
            match: ['twin revolvers'],
            category: 'weapon',
            slots: ['mainHand', 'ranged'],
            hands: 2,
            weaponTag: 'revolvers',
            stance: 'revolvers',
            summary: 'Twin Six-Shooters • 1d6+4 / 1d6'
        },
        {
            match: ['longbow', 'shortbow', 'crossbow', 'musket', 'pistol', 'rifle', /\bbow\b/, /\bsling\b/],
            category: 'weapon',
            slots: ['ranged', 'mainHand'],
            hands: 2,
            summary: 'Ranged Weapon'
        },
        {
            match: ['wand of', 'rod of'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            summary: 'Arcane Wand / Focus'
        },
        {
            match: ['rapier', 'longsword', 'shortsword', 'scimitar', 'mace', 'thighbone', 'spear', /\bfan\b/],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            summary: 'Melee Weapon'
        },

        // --- CONSUMABLES & CRAFTING & QUEST ---
        {
            match: ['medicinal herb'],
            category: 'crafting',
            slots: [],
            summary: 'Crafting Reagent (2x = Potion, 1x = Bandage)'
        },
        {
            match: ['alchemical catalyst', 'catalyst', 'silver dust'],
            category: 'crafting',
            slots: [],
            summary: 'Advanced Crafting Reagent'
        },
        {
            match: ['potion of greater healing'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 4, sides: 4, bonus: 4, verb: 'Drank', label: 'Greater Potion (4d4+4)' },
            summary: 'Heal 4d4+4 HP (Bonus Action)'
        },
        {
            match: ['potion of superior healing'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 8, sides: 4, bonus: 8, verb: 'Drank', label: 'Superior Potion (8d4+8)' },
            summary: 'Heal 8d4+8 HP (Bonus Action)'
        },
        {
            match: ['potion of healing', 'health potion'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 2, sides: 6, bonus: 1, verb: 'Drank', label: 'Potion (2d6+1)' },
            summary: 'Heal 2d6+1 HP (Bonus Action)'
        },
        {
            match: ['bandage'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 1, sides: 6, bonus: 1, verb: 'Applied', label: 'Bandage (1d6+1)' },
            summary: 'Heal 1d6+1 HP (Action)'
        },
        {
            match: ['croissant'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 1, sides: 4, bonus: 0, verb: 'Ate', label: 'Croissant (1d4)' },
            summary: 'Heal 1d4 HP (Action)'
        },
        {
            match: ['spring water', 'holy water'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'holyWater', label: 'Holy Water (2d6 Rad)' },
            summary: '2d6 Radiant & Halts Vampire Regen'
        },
        {
            match: ['dream pastry'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'dreamPastry', label: 'Dream Pie (+1d6 Temp)' },
            summary: '+1d6 Temp HP • DC 13 CON Save @ Dawn'
        },
        {
            match: ['tarokka', 'wizard diary', 'pocket watch', 'journal', 'letter', 'tome of strahd', 'bones of'],
            category: 'quest',
            slots: [],
            summary: 'Story Clue / Key Relic'
        },
        {
            match: ['lockpick', 'thieves', 'wine', 'pipe', 'dragonchess', 'bandolier', 'slug', 'cartridge', 'speedloader', 'tinker', 'lantern', 'crowbar', 'pack', 'pouch', 'torch', 'ration', 'rope', 'waterskin'],
            category: 'gear',
            slots: [],
            summary: 'Adventuring / Trade Gear'
        }
    ];

    // Unified Extensible Crafting Recipes (Shared Across All Heroes!)
    const CRAFTING_RECIPES = [
        {
            id: 'craft_healing_potion',
            name: '🧪 Potion of Healing',
            badge: '2d6 + 1 HP',
            desc: 'Steep 2 bundles of Barovian Medicinal Herbs into a restorative ruby draught (Bonus Action self / Action ally).',
            ingredients: [{ keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 2 }],
            outputRaw: '🧪 1x Potion of Healing (2d6+1 HP)',
            outputMatch: 'potion of healing'
        },
        {
            id: 'craft_field_bandages',
            name: '🩹 Field Bandages',
            badge: '1d6 + 1 HP',
            desc: 'Infuse clean linen strips with crushed medicinal herbs to bind wounds quickly in the field.',
            ingredients: [{ keyword: 'medicinal herb', label: 'Medicinal Herb', qty: 1 }],
            outputRaw: '🩹 1x Field Bandages (Heals 1d6+1 HP)',
            outputMatch: 'bandage'
        },
        {
            id: 'craft_greater_healing',
            name: '🧪 Potion of Greater Healing',
            badge: '4d4 + 4 HP',
            desc: 'Distill 4 bundles of Medicinal Herbs with 1 Alchemical Catalyst (found in Vallaki / Bonegrinder / Abbey) for potent recovery.',
            ingredients: [
                { keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 4 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 1 }
            ],
            outputRaw: '🧪 1x Potion of Greater Healing (4d4+4 HP)',
            outputMatch: 'potion of greater healing'
        },
        {
            id: 'craft_holy_water',
            name: '💧 Flask of Morninglord Holy Water',
            badge: '2d6 Radiant',
            desc: 'Consecrate pure spring water with powdered silver (25 GP value) to burn Undead & halt Vampire Regeneration.',
            ingredients: [
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: 'medicinal herb', label: 'Purifying Herb', qty: 1 }
            ],
            outputRaw: '💧 1x Flask of Morninglord Holy Water (2d6 Radiant)',
            outputMatch: 'holy water'
        }
    ];

    // =========================================================================
    // ENGINE INTERNAL STATE
    // =========================================================================
    let adapter = null;
    let selectedSlot = 'body';
    let bpSearchQuery = '';
    let bpCategoryFilter = 'all';
    let tradeActiveTab = 'send';
    let tradeRecipient = null;
    let tradeMode = 'item'; // 'item' | 'gold'
    let showCustomTagger = false;

    // Live Firebase State
    let firestoreDb = null;
    let firebaseReady = false;
    let incomingTrades = [];
    let outgoingTrades = [];
    let unsubIncoming = null;
    let unsubOutgoing = null;
    let unsubDeclined = null;
    let lastKnownIncomingIds = new Set();

    // Helpers
    function esc(str) {
        return String(str || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

    function parseItem(itemStr) {
        if (!itemStr) return { hasQty: false, qty: 1, emoji: '', name: '', raw: '' };
        const emojiMatch = itemStr.match(/^([\p{Extended_Pictographic}\u{FE00}-\u{FE0F}\u{200D}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1FAFF}\s]+)/u);
        const emoji = emojiMatch ? emojiMatch[1].trim() + ' ' : '';
        let rest = (emojiMatch ? itemStr.slice(emojiMatch[0].length) : itemStr).trim();

        let qty = 1, hasQty = false, name = rest;
        const prefixMatch = rest.match(/^(?:(\d+)\s*[xX]|[xX]\s*(\d+))\s+(.+)$/);
        const suffixMatch = rest.match(/^(.+?)\s+(?:[xX]\s*(\d+)|(\d+)\s*[xX])$/);
        const parenMatch = rest.match(/^(.+?)\s*\(\s*(?:[xX]\s*(\d+)|(\d+)\s*[xX]?)\s*\)$/);

        if (prefixMatch) { hasQty = true; qty = parseInt(prefixMatch[1] || prefixMatch[2]) || 1; name = prefixMatch[3].trim(); }
        else if (suffixMatch) { hasQty = true; qty = parseInt(suffixMatch[2] || suffixMatch[3]) || 1; name = suffixMatch[1].trim(); }
        else if (parenMatch) { hasQty = true; qty = parseInt(parenMatch[2] || parenMatch[3]) || 1; name = parenMatch[1].trim(); }

        return { hasQty, qty, emoji, name, raw: itemStr };
    }

    function normKey(itemStr) {
        return parseItem(itemStr).name.toLowerCase().trim();
    }

    function shortLabel(itemStr) {
        const p = parseItem(itemStr);
        const clean = p.name.replace(/\s*\([^)]*\)\s*/g, '').trim();
        return `${p.emoji}${clean || p.name}`.trim();
    }

    // =========================================================================
    // STORAGE: EQUIPPED SLOTS & CUSTOM GEAR TAGS
    // =========================================================================
    function getEquipStorageKey() { return `cos_equip_${adapter.heroId}_v1`; }
    function getCustomGearKey() { return `cos_custom_gear_${adapter.heroId}_v1`; }
    function getClaimedCodesKey() { return `cos_claimed_codes_${adapter.heroId}_v1`; }
    function getCustomPresetsKey() { return `cos_presets_${adapter.heroId}_v1`; }

    function getCustomGearMap() {
        try {
            const raw = localStorage.getItem(getCustomGearKey());
            return raw ? JSON.parse(raw) : {};
        } catch (e) { return {}; }
    }

    function saveCustomGearMap(map) {
        localStorage.setItem(getCustomGearKey(), JSON.stringify(map));
    }

    function getItemMeta(itemStr) {
        const key = normKey(itemStr);
        const customMap = getCustomGearMap();
        if (customMap[key]) {
            return { ...customMap[key], isCustom: true };
        }
        const low = itemStr.toLowerCase();
        for (const rule of GEAR_CATALOG) {
            if (rule.match.some(m => (m instanceof RegExp ? m.test(low) : low.includes(m)))) {
                return { ...rule };
            }
        }
        return { category: 'gear', slots: [], summary: 'Carried Item' };
    }

    function getEquippedState() {
        try {
            const stored = localStorage.getItem(getEquipStorageKey());
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && typeof parsed === 'object') return parsed;
            }
        } catch (e) {}
        const init = JSON.parse(JSON.stringify(adapter.defaultEquipped || {}));
        if (!init._grip) init._grip = '2h';
        localStorage.setItem(getEquipStorageKey(), JSON.stringify(init));
        return init;
    }

    function saveEquippedState(eq) {
        localStorage.setItem(getEquipStorageKey(), JSON.stringify(eq));
    }

    function findInventoryIndexByKey(itemKey) {
        if (!itemKey) return -1;
        const items = adapter.getItems();
        return items.findIndex(raw => normKey(raw) === itemKey);
    }

    function findInventoryRawByKey(itemKey) {
        const idx = findInventoryIndexByKey(itemKey);
        if (idx === -1) return null;
        return adapter.getItems()[idx];
    }

    function reconcileEquippedWithInventory() {
        const eq = getEquippedState();
        const items = adapter.getItems();
        const counts = new Map();
        items.forEach(raw => {
            const k = normKey(raw);
            counts.set(k, (counts.get(k) || 0) + parseItem(raw).qty);
        });

        let changed = false;
        const usedCounts = new Map();
        for (const s of SLOTS) {
            const k = eq[s.id];
            if (!k) continue;
            const raw = findInventoryRawByKey(k);
            const meta = raw ? getItemMeta(raw) : null;
            const slotValid = meta && Array.isArray(meta.slots) && meta.slots.includes(s.id);
            const avail = counts.get(k) || 0;
            const used = usedCounts.get(k) || 0;
            if (!slotValid || avail <= used) {
                delete eq[s.id];
                changed = true;
            } else {
                usedCounts.set(k, used + 1);
            }
        }
        // Enforce 2H off-hand lock
        if (eq.mainHand) {
            const raw = findInventoryRawByKey(eq.mainHand);
            if (raw) {
                const meta = getItemMeta(raw);
                const is2H = meta.hands === 2 || (meta.versatile && eq._grip === '2h');
                if (is2H && eq.offHand) {
                    delete eq.offHand;
                    changed = true;
                }
            }
        }
        if (changed) saveEquippedState(eq);
        return eq;
    }

    function isMainHandTwoHanded(eq) {
        if (!eq || !eq.mainHand) return false;
        const raw = findInventoryRawByKey(eq.mainHand);
        if (!raw) return false;
        const meta = getItemMeta(raw);
        return meta.hands === 2 || (meta.versatile && eq._grip === '2h');
    }

    function getGearBonuses() {
        const eq = reconcileEquippedWithInventory();
        const bonuses = {
            equippedCount: 0,
            attunedCount: 0,
            attunedNames: [],
            acBonus: 0,
            baseAC: null,
            addDex: false,
            maxDex: null,
            armorWorn: false,
            heavyArmor: false,
            stealthDisadv: false,
            shieldBonus: 0,
            saveBonus: 0,
            spellDcBonus: 0,
            spellAtkBonus: 0,
            initBonus: 0,
            spellFireBonus: null,
            skillAdv: [],
            robeKey: 'none',
            equippedWeaponTags: [],
            equippedAbilities: [],
            activePerks: [],
            mainHand2H: isMainHandTwoHanded(eq),
            equippedMap: eq
        };

        const countedKeys = new Set();
        for (const s of SLOTS) {
            const k = eq[s.id];
            if (!k) continue;
            const raw = findInventoryRawByKey(k);
            if (!raw) continue;
            bonuses.equippedCount++;
            const meta = getItemMeta(raw);

            // Avoid double-counting passive stats if same item key were ever duplicated
            if (meta.attune && !countedKeys.has('att:' + k)) {
                bonuses.attunedCount++;
                bonuses.attunedNames.push(shortLabel(raw));
                countedKeys.add('att:' + k);
            }
            if (s.id === 'body' && meta.baseAC) {
                bonuses.baseAC = meta.baseAC;
                bonuses.addDex = !!meta.addDex;
                bonuses.maxDex = meta.maxDex !== undefined ? meta.maxDex : null;
                bonuses.armorWorn = !!meta.armorWorn;
                bonuses.heavyArmor = !!meta.heavyArmor;
            }
            if (meta.stealthDisadv) bonuses.stealthDisadv = true;
            if (meta.isShield && s.id === 'offHand') {
                bonuses.shieldBonus += (meta.acBonus || 2);
            } else if (meta.acBonus && !meta.isShield) {
                bonuses.acBonus += meta.acBonus;
            }
            if (meta.saveBonus) bonuses.saveBonus += meta.saveBonus;
            if (meta.spellDcBonus) bonuses.spellDcBonus += meta.spellDcBonus;
            if (meta.spellAtkBonus) bonuses.spellAtkBonus += meta.spellAtkBonus;
            if (meta.initBonus) bonuses.initBonus += meta.initBonus;
            if (meta.spellFireBonus) bonuses.spellFireBonus = meta.spellFireBonus;
            if (meta.robeKey && s.id === 'body') bonuses.robeKey = meta.robeKey;
            if (Array.isArray(meta.skillAdv)) {
                meta.skillAdv.forEach(sk => { if (!bonuses.skillAdv.includes(sk)) bonuses.skillAdv.push(sk); });
            }
            if (meta.weaponTag) bonuses.equippedWeaponTags.push({ tag: meta.weaponTag, slot: s.id, grip: s.id === 'mainHand' && bonuses.mainHand2H ? '2h' : '1h' });
            if (meta.grantsAbility) bonuses.equippedAbilities.push(meta.grantsAbility);
            if (meta.summary) bonuses.activePerks.push(`<strong>${esc(shortLabel(raw))}:</strong> ${esc(meta.summary)}`);
        }

        return bonuses;
    }

    function applyEquipmentToSheet(silent = false) {
        const bonuses = getGearBonuses();
        if (adapter && typeof adapter.onEquipmentChange === 'function') {
            adapter.onEquipmentChange(bonuses, bonuses.equippedMap);
        }
        renderHubPanel();
        renderHeaderBadges();
        if (document.getElementById('rpg-equip-modal')?.open) renderEquipModal();
        if (document.getElementById('rpg-backpack-modal')?.open) renderBackpackModal();
    }

    function equipItemToSlot(slotId, itemKey, gripMode = null) {
        const eq = reconcileEquippedWithInventory();
        const raw = findInventoryRawByKey(itemKey);
        if (!raw) return;
        const meta = getItemMeta(raw);

        // Check Attunement limit (max 3)
        if (meta.attune) {
            const currentBonuses = getGearBonuses();
            const replacingRaw = eq[slotId] ? findInventoryRawByKey(eq[slotId]) : null;
            const replacingAttuned = replacingRaw ? !!getItemMeta(replacingRaw).attune : false;
            const alreadyEquippedSame = SLOTS.some(s => eq[s.id] === itemKey);
            if (!alreadyEquippedSame && !replacingAttuned && currentBonuses.attunedCount >= 3) {
                adapter.log(`⚠️ <strong>Attunement Full (3/3)!</strong> Unequip an attuned magic item before attuning to <strong>${esc(shortLabel(raw))}</strong>.`);
                return;
            }
        }

        // If quantity is 1, remove from any other slot first
        const totalQty = adapter.getItems().reduce((acc, r) => normKey(r) === itemKey ? acc + parseItem(r).qty : acc, 0);
        const alreadyInSlots = SLOTS.filter(s => eq[s.id] === itemKey && s.id !== slotId);
        if (alreadyInSlots.length >= totalQty) {
            delete eq[alreadyInSlots[0].id];
        }

        // Smart 2H & Off-hand handling
        if (slotId === 'mainHand') {
            eq.mainHand = itemKey;
            if (meta.hands === 2) {
                eq._grip = '2h';
                delete eq.offHand;
            } else if (meta.versatile) {
                eq._grip = gripMode || eq._grip || '2h';
                if (eq._grip === '2h') delete eq.offHand;
            } else {
                eq._grip = '1h';
            }
        } else if (slotId === 'offHand') {
            if (isMainHandTwoHanded(eq)) {
                const mhRaw = findInventoryRawByKey(eq.mainHand);
                const mhMeta = mhRaw ? getItemMeta(mhRaw) : {};
                if (mhMeta.versatile) {
                    eq._grip = '1h';
                } else {
                    delete eq.mainHand;
                }
            }
            eq.offHand = itemKey;
        } else {
            eq[slotId] = itemKey;
        }

        saveEquippedState(eq);
        const slotObj = SLOTS.find(s => s.id === slotId);
        const gripTag = (slotId === 'mainHand' && isMainHandTwoHanded(eq)) ? ' (2-Handed)' : '';
        adapter.log(`🛡️ <strong>Equipped ${esc(shortLabel(raw))}</strong> into <strong>${slotObj.icon} ${slotObj.label}${gripTag}</strong> — sheet stats updated!`);
        applyEquipmentToSheet();
    }

    function unequipSlot(slotId) {
        const eq = reconcileEquippedWithInventory();
        const prevKey = eq[slotId];
        if (!prevKey) return;
        const prevRaw = findInventoryRawByKey(prevKey);
        delete eq[slotId];
        if (slotId === 'mainHand') eq._grip = '1h';
        saveEquippedState(eq);
        adapter.log(`🎒 <strong>Unequipped ${esc(prevRaw ? shortLabel(prevRaw) : prevKey)}</strong> (returned safely to Backpack).`);
        applyEquipmentToSheet();
    }

    function toggleMainHandGrip() {
        const eq = reconcileEquippedWithInventory();
        if (!eq.mainHand) return;
        const raw = findInventoryRawByKey(eq.mainHand);
        if (!raw || !getItemMeta(raw).versatile) return;
        eq._grip = (eq._grip === '2h') ? '1h' : '2h';
        if (eq._grip === '2h') delete eq.offHand;
        saveEquippedState(eq);
        adapter.log(`⚔️ <strong>${esc(shortLabel(raw))}</strong> switched to <strong>${eq._grip === '2h' ? '2-Handed Grip (Off-Hand Locked)' : '1-Handed Grip (Off-Hand Open)'}</strong>!`);
        applyEquipmentToSheet();
    }

    function applyLoadoutPreset(presetIdx) {
        const presets = adapter.presets || [];
        const p = presets[presetIdx];
        if (!p) return;
        const eq = reconcileEquippedWithInventory();
        for (const [slotId, keyword] of Object.entries(p.slots)) {
            if (slotId === '_grip') {
                eq._grip = keyword;
                continue;
            }
            if (!keyword) {
                delete eq[slotId];
                continue;
            }
            const found = adapter.getItems().find(r => r.toLowerCase().includes(keyword.toLowerCase()));
            if (found) {
                eq[slotId] = normKey(found);
            }
        }
        if (isMainHandTwoHanded(eq)) delete eq.offHand;
        saveEquippedState(eq);
        adapter.log(`⚡ <strong>Loadout Swapped:</strong> ${esc(p.label)}!`);
        applyEquipmentToSheet();
    }

    // Quick equip from Backpack (picks best natural slot automatically)
    function quickToggleEquipByIndex(invIndex) {
        const items = adapter.getItems();
        const raw = items[invIndex];
        if (!raw) return;
        const key = normKey(raw);
        const eq = reconcileEquippedWithInventory();
        const existingSlot = SLOTS.find(s => eq[s.id] === key);
        if (existingSlot) {
            unequipSlot(existingSlot.id);
            return;
        }
        const meta = getItemMeta(raw);
        if (!meta.slots || meta.slots.length === 0) {
            openEquipModal('body');
            showCustomTagger = true;
            renderEquipModal();
            return;
        }
        // For rings, pick first open ring slot
        let targetSlot = meta.slots[0];
        if (meta.slots.includes('ring1') && eq.ring1 && !eq.ring2) targetSlot = 'ring2';
        equipItemToSlot(targetSlot, key);
    }

    // Sync body robe/armor toggle from external sheet buttons (2-way sync!)
    function syncExternalBodySlot(keywordOrNull) {
        const eq = reconcileEquippedWithInventory();
        if (!keywordOrNull) {
            delete eq.body;
        } else {
            const found = adapter.getItems().find(r => r.toLowerCase().includes(keywordOrNull.toLowerCase()));
            if (found) eq.body = normKey(found);
            else delete eq.body;
        }
        saveEquippedState(eq);
        applyEquipmentToSheet(true);
    }

    function syncExternalWeaponStance(stance) {
        const eq = reconcileEquippedWithInventory();
        const items = adapter.getItems();
        if (stance === 'lament') {
            const lament = items.find(r => r.toLowerCase().includes('lament'));
            if (lament) {
                eq.mainHand = normKey(lament);
                eq._grip = '2h';
                delete eq.offHand;
            }
        } else if (stance === 'revolvers') {
            const mercy = items.find(r => r.toLowerCase().includes('"mercy"') || r.toLowerCase().includes('mercy (main'));
            const less = items.find(r => r.toLowerCase().includes('"less"') || r.toLowerCase().includes('less (off'));
            const twin = items.find(r => r.toLowerCase().includes('twin revolvers'));
            if (mercy) eq.mainHand = normKey(mercy);
            else if (twin) eq.mainHand = normKey(twin);
            if (less) eq.offHand = normKey(less);
            eq._grip = '1h';
        }
        saveEquippedState(eq);
        applyEquipmentToSheet(true);
    }

    // =========================================================================
    // CONSUMABLE USE ENGINE (QUICK-BELT & BACKPACK)
    // =========================================================================
    function useConsumableByIndex(invIndex) {
        const items = adapter.getItems();
        const raw = items[invIndex];
        if (!raw) return;
        const meta = getItemMeta(raw);
        const parsed = parseItem(raw);
        if (!meta.useAction) return;

        // Deduct 1 from inventory
        const newQty = parsed.qty - 1;
        if (newQty <= 0) items.splice(invIndex, 1);
        else items[invIndex] = `${parsed.emoji}${newQty}x ${parsed.name}`.trim();
        adapter.saveItems(items);

        const act = meta.useAction;
        if (act.type === 'heal') {
            let rolls = [], sum = 0;
            for (let i = 0; i < act.dice; i++) {
                const r = Math.floor(Math.random() * act.sides) + 1;
                rolls.push(r); sum += r;
            }
            const total = sum + (act.bonus || 0);
            adapter.healHP(total, false);
            adapter.log(`💚 <strong>${act.verb} ${esc(shortLabel(raw))}:</strong> [${rolls.join('+')}]${act.bonus ? ' + ' + act.bonus : ''} = <span style="color:#4ade80; font-size:1.08rem; font-weight:800;">+${total} HP</span> restored!`);
        } else if (act.type === 'holyWater') {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            adapter.log(`💧 <strong>Splashed ${esc(shortLabel(raw))}:</strong> 2d6[${d1}+${d2}] = <span style="color:#fde68a; font-size:1.08rem; font-weight:800;">${d1 + d2} Radiant Damage</span> to Undead/Fiends — <strong>VAMPIRE REGEN HALTED FOR 1 ROUND!</strong>`);
        } else if (act.type === 'dreamPastry') {
            const d6 = Math.floor(Math.random() * 6) + 1;
            adapter.healHP(d6, true);
            adapter.log(`🥧 <strong>Ate Morgantha's Dream Pastry:</strong> Gained <span style="color:#38bdf8; font-size:1.08rem; font-weight:800;">+${d6} Temp HP</span> &amp; cured 1 Exhaustion! <small style="color:#f87171;">(⚠️ 8-hr blissful dream trance — DC 13 CON Save at dawn!)</small>`);
        }
        applyEquipmentToSheet(true);
    }

    // =========================================================================
    // UNIFIED CRAFTING ENGINE
    // =========================================================================
    function countIngredientQty(keyword) {
        const kw = keyword.toLowerCase();
        return adapter.getItems().reduce((sum, raw) => {
            const p = parseItem(raw);
            return p.name.toLowerCase().includes(kw) ? sum + p.qty : sum;
        }, 0);
    }

    function countReadyRecipes() {
        return CRAFTING_RECIPES.filter(r => r.ingredients.every(ing => countIngredientQty(ing.keyword) >= ing.qty)).length;
    }

    function craftRecipe(recipeId) {
        const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
        if (!recipe) return;
        for (const ing of recipe.ingredients) {
            if (countIngredientQty(ing.keyword) < ing.qty) {
                adapter.log(`⚠️ <strong>Not enough ${esc(ing.label)}</strong> to craft ${esc(recipe.name)}!`);
                return;
            }
        }
        let items = adapter.getItems();
        for (const ing of recipe.ingredients) {
            let need = ing.qty;
            const kw = ing.keyword.toLowerCase();
            for (let i = items.length - 1; i >= 0 && need > 0; i--) {
                const p = parseItem(items[i]);
                if (p.name.toLowerCase().includes(kw)) {
                    if (p.qty <= need) {
                        need -= p.qty;
                        items.splice(i, 1);
                    } else {
                        const rem = p.qty - need;
                        items[i] = `${p.emoji}${rem}x ${p.name}`.trim();
                        need = 0;
                    }
                }
            }
        }
        addRawItemToList(items, recipe.outputRaw, 1);
        adapter.saveItems(items);
        adapter.log(`⚗️ <strong>Crafted ${esc(recipe.name)} (${recipe.badge})!</strong> Added to your Backpack &amp; Quick-Belt.`);
        applyEquipmentToSheet(true);
        renderCraftModal();
    }

    function addRawItemToList(items, rawStr, addQty = 1) {
        const incoming = parseItem(rawStr);
        const incKey = incoming.name.toLowerCase().trim();
        const existingIdx = items.findIndex(r => parseItem(r).name.toLowerCase().trim() === incKey);
        if (existingIdx !== -1) {
            const ex = parseItem(items[existingIdx]);
            const total = ex.qty + addQty;
            items[existingIdx] = `${ex.emoji || incoming.emoji}${total}x ${ex.name}`.trim();
        } else if (addQty > 1 || incoming.hasQty) {
            items.unshift(`${incoming.emoji}${addQty}x ${incoming.name}`.trim());
        } else {
            items.unshift(rawStr);
        }
    }

    // =========================================================================
    // 🔥 FIREBASE CLOUD FIRESTORE LIVE TRANSFERS + OFFLINE TRADE CODES
    // =========================================================================
    function getEffectiveFirebaseConfig() {
        try {
            const override = localStorage.getItem('cos_firebase_override_v1');
            if (override) {
                const parsed = JSON.parse(override);
                if (parsed && parsed.apiKey && parsed.projectId) return parsed;
            }
        } catch (e) {}
        return window.COS_FIREBASE_CONFIG || null;
    }

    function initFirebaseSync() {
        const cfg = getEffectiveFirebaseConfig();
        if (!cfg || !cfg.apiKey || !cfg.projectId || typeof window.firebase === 'undefined') {
            firebaseReady = false;
            return;
        }
        try {
            if (!window.firebase.apps.length) {
                window.firebase.initializeApp(cfg);
            }
            firestoreDb = window.firebase.firestore();
            firebaseReady = true;
            startTransferListeners();
        } catch (err) {
            console.warn('[COS_RPG] Firebase init skipped:', err);
            firebaseReady = false;
        }
    }

    function transfersCol() {
        const room = window.COS_CAMPAIGN_ROOM || 'curse_of_strahd_main';
        return firestoreDb.collection('campaigns').doc(room).collection('transfers');
    }

    function startTransferListeners() {
        if (!firebaseReady || !firestoreDb || !adapter) return;
        if (unsubIncoming) unsubIncoming();
        if (unsubOutgoing) unsubOutgoing();
        if (unsubDeclined) unsubDeclined();

        // 1. Incoming pending transfers addressed to this hero
        unsubIncoming = transfersCol()
            .where('toId', '==', adapter.heroId)
            .where('status', '==', 'pending')
            .onSnapshot(snap => {
                const nextList = [];
                snap.forEach(doc => nextList.push({ id: doc.id, ...doc.data() }));
                const brandNew = nextList.filter(t => !lastKnownIncomingIds.has(t.id));
                incomingTrades = nextList;
                lastKnownIncomingIds = new Set(nextList.map(t => t.id));
                renderIncomingBanner();
                renderHubPanel();
                renderHeaderBadges();
                if (document.getElementById('rpg-trade-modal')?.open) renderTradeModal();
                if (brandNew.length > 0) {
                    const first = brandNew[0];
                    const desc = first.kind === 'gold'
                        ? `${first.gp || 0} GP ${first.sp || 0} SP`
                        : `${first.qty > 1 ? first.qty + 'x ' : ''}${shortLabel(first.itemRaw)}`;
                    announceStatus(`Incoming transfer from ${first.fromName}: ${desc}. Actions available.`);
                }
            }, err => console.warn('[COS_RPG] Incoming listener error:', err));

        // 2. Outgoing pending transfers sent by this hero
        unsubOutgoing = transfersCol()
            .where('fromId', '==', adapter.heroId)
            .where('status', '==', 'pending')
            .onSnapshot(snap => {
                const list = [];
                snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                outgoingTrades = list;
                if (document.getElementById('rpg-trade-modal')?.open) renderTradeModal();
            }, err => console.warn('[COS_RPG] Outgoing listener error:', err));

        // 3. Auto-refund declined outgoing transfers safely (atomic refunded flag)
        unsubDeclined = transfersCol()
            .where('fromId', '==', adapter.heroId)
            .where('status', '==', 'declined')
            .onSnapshot(snap => {
                snap.forEach(doc => {
                    const d = doc.data();
                    if (d.refunded) return;
                    doc.ref.update({ refunded: true }).then(() => {
                        refundTransferPayload(d, `↩️ ${d.toName} declined your transfer — returned safely!`);
                    }).catch(() => {});
                });
            }, () => {});
    }

    function announceStatus(msg) {
        if (typeof document.ariaNotify === 'function') {
            try { document.ariaNotify(msg); } catch (e) {}
        }
        const live = document.getElementById('rpg-sr-live');
        if (live) live.textContent = msg;
    }

    function refundTransferPayload(data, logPrefix) {
        if (data.kind === 'gold') {
            adapter.addGold(data.gp || 0, data.sp || 0, 'Returned Transfer');
        } else if (data.itemRaw) {
            const items = adapter.getItems();
            addRawItemToList(items, data.itemRaw, data.qty || 1);
            adapter.saveItems(items);
            if (data.customMeta) {
                const map = getCustomGearMap();
                map[normKey(data.itemRaw)] = data.customMeta;
                saveCustomGearMap(map);
            }
            applyEquipmentToSheet(true);
        }
        adapter.log(`${logPrefix}`);
    }

    function acceptLiveTransfer(tradeId) {
        const tr = incomingTrades.find(t => t.id === tradeId);
        if (!tr || !firestoreDb) return;
        transfersCol().doc(tradeId).update({
            status: 'accepted',
            resolvedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            if (tr.kind === 'gold') {
                adapter.addGold(tr.gp || 0, tr.sp || 0, `From ${tr.fromName}`);
                adapter.log(`✅ <strong>Accepted ${tr.gp || 0} GP, ${tr.sp || 0} SP</strong> from <strong>${esc(tr.fromName)}</strong>!`);
            } else {
                const items = adapter.getItems();
                addRawItemToList(items, tr.itemRaw, tr.qty || 1);
                adapter.saveItems(items);
                if (tr.customMeta) {
                    const map = getCustomGearMap();
                    map[normKey(tr.itemRaw)] = tr.customMeta;
                    saveCustomGearMap(map);
                }
                applyEquipmentToSheet(true);
                adapter.log(`✅ <strong>Accepted ${tr.qty > 1 ? tr.qty + 'x ' : ''}${esc(shortLabel(tr.itemRaw))}</strong> from <strong>${esc(tr.fromName)}</strong> into your Backpack!`);
            }
        }).catch(err => {
            adapter.log(`⚠️ Could not accept transfer: ${esc(err.message)}`);
        });
    }

    function declineLiveTransfer(tradeId) {
        const tr = incomingTrades.find(t => t.id === tradeId);
        if (!tr || !firestoreDb) return;
        transfersCol().doc(tradeId).update({
            status: 'declined',
            refunded: tr.fromId === 'dm', // DM drops don't need sender refund
            resolvedAt: window.firebase.firestore.FieldValue.serverTimestamp()
        }).then(() => {
            adapter.log(`❌ <strong>Declined transfer</strong> from ${esc(tr.fromName)}.`);
        }).catch(() => {});
    }

    function cancelOutgoingTransfer(tradeId) {
        const tr = outgoingTrades.find(t => t.id === tradeId);
        if (!tr || !firestoreDb) return;
        transfersCol().doc(tradeId).update({
            status: 'cancelled',
            refunded: true
        }).then(() => {
            refundTransferPayload(tr, `↩️ <strong>Cancelled transfer</strong> to ${esc(tr.toName)} — returned to your Backpack/Purse!`);
        }).catch(() => {});
    }

    function encodeTradeCode(payload) {
        const json = JSON.stringify(payload);
        const b64 = btoa(unescape(encodeURIComponent(json)));
        return 'COSTRADE:' + b64;
    }

    function decodeTradeCode(codeStr) {
        const clean = (codeStr || '').trim().replace(/^COSTRADE:/i, '');
        const json = decodeURIComponent(escape(atob(clean)));
        return JSON.parse(json);
    }

    function sendTransfer(forceOfflineCode = false) {
        const recipObj = PARTY_MEMBERS.find(m => m.id === tradeRecipient);
        if (!recipObj) {
            adapter.log('⚠️ Select a recipient first!');
            return;
        }
        const note = (document.getElementById('rpg-trade-note')?.value || '').trim().slice(0, 120);
        let payload = {
            cid: 'tr_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
            fromId: adapter.heroId,
            fromName: `${adapter.heroEmoji} ${adapter.heroName}`,
            toId: recipObj.id,
            toName: recipObj.label,
            note
        };

        if (tradeMode === 'gold') {
            const gp = Math.max(0, parseInt(document.getElementById('rpg-trade-gp')?.value) || 0);
            const sp = Math.max(0, parseInt(document.getElementById('rpg-trade-sp')?.value) || 0);
            if (gp === 0 && sp === 0) {
                adapter.log('⚠️ Enter an amount of GP or SP to send.');
                return;
            }
            const wallet = adapter.getGold();
            if ((gp * 10 + sp) > (wallet.gp * 10 + wallet.sp)) {
                adapter.log(`⚠️ Insufficient funds! You only have ${wallet.gp} GP, ${wallet.sp} SP.`);
                return;
            }
            adapter.spendGold(gp, sp, `Sent to ${recipObj.name}`);
            payload.kind = 'gold';
            payload.gp = gp;
            payload.sp = sp;
        } else {
            const selIdx = parseInt(document.getElementById('rpg-trade-item-select')?.value);
            const qty = Math.max(1, parseInt(document.getElementById('rpg-trade-item-qty')?.value) || 1);
            const items = adapter.getItems();
            if (isNaN(selIdx) || !items[selIdx]) {
                adapter.log('⚠️ Select an item from your Backpack to send.');
                return;
            }
            const raw = items[selIdx];
            const parsed = parseItem(raw);
            const sendQty = Math.min(qty, parsed.qty);
            if (parsed.qty <= sendQty) items.splice(selIdx, 1);
            else items[selIdx] = `${parsed.emoji}${parsed.qty - sendQty}x ${parsed.name}`.trim();
            adapter.saveItems(items);

            const customMap = getCustomGearMap();
            const cMeta = customMap[normKey(raw)] || null;
            payload.kind = 'item';
            payload.itemRaw = `${parsed.emoji}${sendQty > 1 ? sendQty + 'x ' : ''}${parsed.name}`.trim();
            payload.qty = sendQty;
            payload.customMeta = cMeta;
            applyEquipmentToSheet(true);
        }

        if (firebaseReady && !forceOfflineCode) {
            transfersCol().add({
                ...payload,
                status: 'pending',
                refunded: false,
                createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
            }).then(() => {
                const desc = payload.kind === 'gold'
                    ? `${payload.gp} GP, ${payload.sp} SP`
                    : `${payload.qty > 1 ? payload.qty + 'x ' : ''}${shortLabel(payload.itemRaw)}`;
                adapter.log(`🚀 <strong>Sent Live Transfer to ${esc(recipObj.label)}:</strong> ${esc(desc)}! Waiting for them to click Accept.`);
                renderTradeModal();
            }).catch(err => {
                // Auto-fallback to offline code so item is never lost!
                const code = encodeTradeCode(payload);
                showGeneratedTradeCode(code, `⚠️ Live Firestore write blocked (${err.code || 'rules'}) — Offline Trade Code generated below!`);
            });
        } else {
            const code = encodeTradeCode(payload);
            showGeneratedTradeCode(code, `📲 <strong>Offline Trade Code Ready!</strong> Copy &amp; send this to ${esc(recipObj.label)} to paste into their Trade Inbox:`);
        }
    }

    let lastGeneratedCode = '';
    let lastGeneratedMsg = '';

    function showGeneratedTradeCode(code, msg) {
        lastGeneratedCode = code;
        lastGeneratedMsg = msg;
        renderTradeModal();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(code).catch(() => {});
        }
        adapter.log(`📲 <strong>Trade Code copied to clipboard!</strong> Share it with your party member to claim.`);
    }

    function claimOfflineTradeCode(rawCode) {
        const input = (rawCode || document.getElementById('rpg-claim-code-input')?.value || '').trim();
        if (!input) return;
        try {
            const payload = decodeTradeCode(input);
            const claimed = JSON.parse(localStorage.getItem(getClaimedCodesKey()) || '[]');
            if (payload.cid && claimed.includes(payload.cid)) {
                adapter.log('⚠️ This Trade Code was already claimed on this sheet!');
                return;
            }
            if (payload.kind === 'gold') {
                adapter.addGold(payload.gp || 0, payload.sp || 0, `Claimed from ${payload.fromName || 'Ally'}`);
                adapter.log(`✅ <strong>Claimed ${payload.gp || 0} GP, ${payload.sp || 0} SP</strong> from <strong>${esc(payload.fromName || 'Ally')}</strong>!`);
            } else if (payload.itemRaw) {
                const items = adapter.getItems();
                addRawItemToList(items, payload.itemRaw, payload.qty || 1);
                adapter.saveItems(items);
                if (payload.customMeta) {
                    const map = getCustomGearMap();
                    map[normKey(payload.itemRaw)] = payload.customMeta;
                    saveCustomGearMap(map);
                }
                applyEquipmentToSheet(true);
                adapter.log(`✅ <strong>Claimed ${payload.qty > 1 ? payload.qty + 'x ' : ''}${esc(shortLabel(payload.itemRaw))}</strong> from <strong>${esc(payload.fromName || 'Ally')}</strong>!`);
            }
            if (payload.cid) {
                claimed.push(payload.cid);
                localStorage.setItem(getClaimedCodesKey(), JSON.stringify(claimed.slice(-100)));
            }
            const inp = document.getElementById('rpg-claim-code-input');
            if (inp) inp.value = '';
            renderTradeModal();
        } catch (e) {
            adapter.log('⚠️ Invalid Trade Code. Make sure you pasted the full COSTRADE:... string!');
        }
    }

    function saveBrowserFirebaseConfig() {
        const txt = (document.getElementById('rpg-fb-json-input')?.value || '').trim();
        if (!txt) return;
        try {
            // Allow pasting either strict JSON or JS object literal from Firebase Console!
            const cleaned = txt
                .replace(/const\s+firebaseConfig\s*=\s*/, '')
                .replace(/;\s*$/, '')
                .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
                .replace(/'/g, '"');
            const parsed = JSON.parse(cleaned);
            if (!parsed.apiKey || !parsed.projectId) throw new Error('Missing apiKey or projectId');
            localStorage.setItem('cos_firebase_override_v1', JSON.stringify(parsed));
            initFirebaseSync();
            renderTradeModal();
            renderHubPanel();
            adapter.log(`🔥 <strong>Firebase Connected!</strong> Live Firestore Table Sync is now active for project <strong>${esc(parsed.projectId)}</strong>!`);
        } catch (e) {
            adapter.log(`⚠️ Could not parse Firebase config — paste the <code>{ apiKey: "...", projectId: "...", appId: "..." }</code> object directly from Firebase Console.`);
        }
    }

    // =========================================================================
    // UI INJECTION & RENDERERS
    // =========================================================================
    function injectDialogsAndBanner() {
        // Accessible SR live region
        if (!document.getElementById('rpg-sr-live')) {
            const sr = document.createElement('div');
            sr.id = 'rpg-sr-live';
            sr.setAttribute('role', 'status');
            sr.setAttribute('aria-live', 'polite');
            sr.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;';
            document.body.appendChild(sr);
        }

        // Inline incoming trade banner right under header
        const container = document.querySelector('.sheet-container');
        const header = document.querySelector('.header-banner');
        if (container && header && !document.getElementById('rpg-incoming-banner')) {
            const banner = document.createElement('div');
            banner.id = 'rpg-incoming-banner';
            banner.className = 'rpg-incoming-banner';
            banner.setAttribute('role', 'region');
            banner.setAttribute('aria-label', 'Incoming Item Transfers');
            header.insertAdjacentElement('afterend', banner);
        }

        // Inject Header Quick Gear & Backpack buttons into top-right badge bar
        const badgeGroup = document.querySelector('.pill-badge-group');
        if (badgeGroup && !document.getElementById('rpg-hdr-equip-btn')) {
            const equipBtn = document.createElement('button');
            equipBtn.type = 'button';
            equipBtn.id = 'rpg-hdr-equip-btn';
            equipBtn.className = 'rpg-header-btn';
            equipBtn.onclick = () => openEquipModal();
            equipBtn.innerHTML = `🛡️ Gear <span class="rpg-badge-count" id="rpg-hdr-equip-cnt">0</span>`;

            const bpBtn = document.createElement('button');
            bpBtn.type = 'button';
            bpBtn.id = 'rpg-hdr-bp-btn';
            bpBtn.className = 'rpg-header-btn rpg-btn-backpack';
            bpBtn.onclick = () => openBackpackModal();
            bpBtn.innerHTML = `🎒 Bag <span class="rpg-badge-count" id="rpg-hdr-bp-cnt">0</span>`;

            badgeGroup.insertBefore(bpBtn, badgeGroup.firstChild);
            badgeGroup.insertBefore(equipBtn, badgeGroup.firstChild);
        }

        // Replace bloated inventory panel contents with compact Adventure Gear Hub!
        const invList = document.getElementById('inventory-list');
        if (invList) {
            const invPanel = invList.closest('.panel');
            if (invPanel && !document.getElementById('rpg-hub-mount')) {
                invPanel.innerHTML = `<div id="rpg-hub-mount" class="rpg-hub-panel"></div>`;
            }
        }

        // Create 4 native <dialog closedby="any"> modals
        if (!document.getElementById('rpg-equip-modal')) {
            const wrap = document.createElement('div');
            wrap.innerHTML = `
                <!-- 🛡️ 11-SLOT RPG PAPER-DOLL EQUIPMENT MODAL -->
                <dialog class="rpg-dialog" id="rpg-equip-modal" closedby="any" aria-labelledby="rpg-equip-title">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-equip-title">🛡️ Equipment Paper-Doll &amp; Loadout</h2>
                            <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-equip-modal')" aria-label="Close Equipment">✕</button>
                        </div>
                        <div class="rpg-modal-body" id="rpg-equip-body"></div>
                        <div class="rpg-modal-foot">
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.openBackpackModal()">🎒 Open Full Backpack</button>
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-equip-modal')">Close</button>
                        </div>
                    </div>
                </dialog>

                <!-- 🎒 SEARCHABLE BACKPACK MODAL -->
                <dialog class="rpg-dialog" id="rpg-backpack-modal" closedby="any" aria-labelledby="rpg-bp-title">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-bp-title">🎒 Adventure Backpack</h2>
                            <div style="display:flex; gap:6px; align-items:center;">
                                <button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.closeModal('rpg-backpack-modal'); COS_RPG.openEquipModal();">🛡️ Equipment</button>
                                <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-backpack-modal')" aria-label="Close Backpack">✕</button>
                            </div>
                        </div>
                        <div class="rpg-modal-body" id="rpg-bp-body"></div>
                        <div class="rpg-modal-foot" style="gap:6px;">
                            <div style="display:flex; gap:5px; flex:1; min-width:220px;">
                                <input type="text" id="rpg-bp-add-input" class="rpg-input" style="flex:1;" placeholder="Add loot (e.g. 2x Potion of Healing, Cloak of Protection)...">
                                <button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.addBackpackItem()">+ Add</button>
                            </div>
                            <div style="display:flex; gap:5px;">
                                <button type="button" class="rpg-mini-btn" onclick="COS_RPG.resetBackpack()">🔄 Reset</button>
                                <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-backpack-modal')">Close</button>
                            </div>
                        </div>
                    </div>
                </dialog>

                <!-- ⚗️ UNIFIED CRAFTING WORKBENCH MODAL -->
                <dialog class="rpg-dialog" id="rpg-craft-modal" closedby="any" aria-labelledby="rpg-craft-title" style="max-width:640px;">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-craft-title">⚗️ Herbalism &amp; Crafting Workbench</h2>
                            <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-craft-modal')" aria-label="Close Crafting">✕</button>
                        </div>
                        <div class="rpg-modal-body" id="rpg-craft-body"></div>
                        <div class="rpg-modal-foot">
                            <span style="font-size:0.7rem; color:#94a3b8;">Crafted items stack directly into your Backpack &amp; Quick-Belt.</span>
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-craft-modal')">Close</button>
                        </div>
                    </div>
                </dialog>

                <!-- 🤝 LIVE TRANSFER & TRADE HUB MODAL -->
                <dialog class="rpg-dialog" id="rpg-trade-modal" closedby="any" aria-labelledby="rpg-trade-title" style="max-width:680px;">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-trade-title">🤝 Party Trade &amp; Live Transfers</h2>
                            <div style="display:flex; align-items:center; gap:8px;">
                                <span id="rpg-trade-status-pill" class="rpg-status-dot offline">🟡 Offline Trade Codes</span>
                                <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-trade-modal')" aria-label="Close Trade Hub">✕</button>
                            </div>
                        </div>
                        <div class="rpg-modal-body" id="rpg-trade-body"></div>
                        <div class="rpg-modal-foot">
                            <span style="font-size:0.69rem; color:#94a3b8;">Supports Live Firestore Table Sync + Offline COSTRADE Codes.</span>
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-trade-modal')">Close</button>
                        </div>
                    </div>
                </dialog>
            `;
            document.body.appendChild(wrap);

            // Wire Enter key on Backpack Add input
            const addInp = document.getElementById('rpg-bp-add-input');
            if (addInp) {
                addInp.addEventListener('keydown', e => {
                    if (e.key === 'Enter' && !e.isComposing) addBackpackItem();
                });
            }

            // Modern Web Guidance Safari fallback for <dialog closedby="any">
            if (!('closedBy' in HTMLDialogElement.prototype)) {
                const outside = (e, dialog) => {
                    const r = dialog.getBoundingClientRect();
                    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
                };
                for (const dialog of document.querySelectorAll('dialog.rpg-dialog[closedby="any"]')) {
                    let pressedOutside = false;
                    dialog.addEventListener('pointerdown', (e) => { pressedOutside = outside(e, dialog); });
                    dialog.addEventListener('pointerup', (e) => { if (pressedOutside && outside(e, dialog)) dialog.close(); });
                }
            }
        }
    }

    function renderHeaderBadges() {
        const items = adapter.getItems();
        const bonuses = getGearBonuses();
        const bpCnt = document.getElementById('rpg-hdr-bp-cnt');
        const eqCnt = document.getElementById('rpg-hdr-equip-cnt');
        if (bpCnt) bpCnt.textContent = items.length;
        if (eqCnt) eqCnt.textContent = bonuses.equippedCount;
    }

    function renderIncomingBanner() {
        const banner = document.getElementById('rpg-incoming-banner');
        if (!banner) return;
        if (incomingTrades.length === 0) {
            banner.classList.remove('has-trades');
            banner.innerHTML = '';
            return;
        }
        banner.classList.add('has-trades');
        banner.innerHTML = incomingTrades.map(tr => {
            const isDm = tr.fromId === 'dm';
            const desc = tr.kind === 'gold'
                ? `💰 <strong>${tr.gp || 0} GP${tr.sp ? ', ' + tr.sp + ' SP' : ''}</strong>`
                : `<strong>${tr.qty > 1 ? tr.qty + 'x ' : ''}${esc(tr.itemRaw)}</strong>`;
            return `
                <div class="rpg-trade-alert-card ${isDm ? 'dm-drop' : ''}">
                    <div style="font-size:0.8rem; color:#f8fafc;">
                        ${isDm ? '🎁 <strong>DM LOOT DROP:</strong>' : `🤝 <strong>${esc(tr.fromName)}</strong> sent you:`}
                        ${desc}
                        ${tr.note ? `<span style="color:#cbd5e1; font-style:italic; margin-left:4px;">"${esc(tr.note)}"</span>` : ''}
                    </div>
                    <div style="display:flex; gap:6px;">
                        <button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.acceptLiveTransfer('${tr.id}')">Accept</button>
                        <button type="button" class="rpg-mini-btn btn-danger" onclick="COS_RPG.declineLiveTransfer('${tr.id}')">Decline</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderHubPanel() {
        const mount = document.getElementById('rpg-hub-mount');
        if (!mount) return;
        const items = adapter.getItems();
        const bonuses = getGearBonuses();
        const eq = bonuses.equippedMap;
        const craftReady = countReadyRecipes();
        const pendingCnt = incomingTrades.length;

        // Build compact equipped chips
        const chips = [];
        for (const s of SLOTS) {
            if (!eq[s.id]) continue;
            const raw = findInventoryRawByKey(eq[s.id]);
            if (!raw) continue;
            const gripNote = (s.id === 'mainHand' && bonuses.mainHand2H) ? ' (2H)' : '';
            chips.push(`
                <button type="button" class="rpg-eq-chip" onclick="COS_RPG.openEquipModal('${s.id}')" title="Click to change ${s.label}">
                    <span class="chip-slot">${s.icon} ${s.label}:</span>
                    <span>${esc(shortLabel(raw))}${gripNote}</span>
                </button>
            `);
        }

        // Build Quick-Belt combat consumables
        const quickBtns = [];
        items.forEach((raw, idx) => {
            const meta = getItemMeta(raw);
            if (!meta.quickBelt || !meta.useAction) return;
            const p = parseItem(raw);
            quickBtns.push(`
                <button type="button" class="rpg-qb-btn" onclick="COS_RPG.useConsumableByIndex(${idx})" title="1-Tap Combat Use (${esc(p.name)})">
                    ${p.emoji}${esc(meta.useAction.label)} <span style="color:#6ee7b7; font-family:'JetBrains Mono',monospace;">(${p.qty}x)</span>
                </button>
            `);
        });

        mount.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px;">
                <span style="font-family:'Cinzel',serif; font-size:0.84rem; font-weight:700; color:var(--accent-gold, #f59e0b); letter-spacing:0.4px;">🎒 ADVENTURE GEAR, EQUIPMENT &amp; TRADES</span>
                <span style="font-size:0.68rem; color:var(--text-dim, #94a3b8);">
                    ✨ Attuned: <strong style="color:#d8b4fe;">${bonuses.attunedCount}/3</strong> • ${firebaseReady ? '<span style="color:#4ade80;">🟢 Live Table Sync</span>' : '<span style="color:#fbbf24;">📲 Trade Codes Ready</span>'}
                </span>
            </div>

            <div class="rpg-hub-btn-grid">
                <button type="button" class="rpg-hub-tile tile-backpack" onclick="COS_RPG.openBackpackModal()">
                    <div class="rpg-hub-tile-top">
                        <span>🎒 Backpack</span>
                        <span class="rpg-badge-count">${items.length}</span>
                    </div>
                    <span class="rpg-hub-tile-sub">Search, filter &amp; manage all items</span>
                </button>

                <button type="button" class="rpg-hub-tile tile-equip" onclick="COS_RPG.openEquipModal()">
                    <div class="rpg-hub-tile-top">
                        <span>🛡️ Equipment</span>
                        <span class="rpg-badge-count">${bonuses.equippedCount}/11</span>
                    </div>
                    <span class="rpg-hub-tile-sub">Paper-doll slots &amp; live stats</span>
                </button>

                <button type="button" class="rpg-hub-tile tile-craft" onclick="COS_RPG.openCraftModal()">
                    <div class="rpg-hub-tile-top">
                        <span>⚗️ Craft</span>
                        <span class="rpg-badge-count ${craftReady > 0 ? 'pulse-alert' : ''}">${craftReady} ready</span>
                    </div>
                    <span class="rpg-hub-tile-sub">Brew potions &amp; bandages</span>
                </button>

                <button type="button" class="rpg-hub-tile tile-trade" onclick="COS_RPG.openTradeModal(${pendingCnt > 0 ? "'inbox'" : "'send'"})">
                    <div class="rpg-hub-tile-top">
                        <span>🤝 Trade</span>
                        <span class="rpg-badge-count ${pendingCnt > 0 ? 'pulse-alert' : ''}">${pendingCnt > 0 ? pendingCnt + ' new' : 'Send'}</span>
                    </div>
                    <span class="rpg-hub-tile-sub">Give items/gold to party</span>
                </button>
            </div>

            <div class="rpg-equipped-strip">
                ${chips.length > 0 ? chips.join('') : '<span style="font-size:0.71rem; color:#64748b; font-style:italic;">No gear equipped yet — click 🛡️ Equipment to slot your loadout!</span>'}
            </div>

            ${quickBtns.length > 0 ? `
                <div class="rpg-quickbelt">
                    <span class="rpg-quickbelt-lbl">⚡ Quick-Belt:</span>
                    ${quickBtns.join('')}
                </div>
            ` : ''}
        `;
    }

    // =========================================================================
    // 🛡️ RENDER 11-SLOT PAPER-DOLL EQUIPMENT MODAL
    // =========================================================================
    function renderSlotBox(slot, eq, bonuses) {
        const isLocked2H = (slot.id === 'offHand' && bonuses.mainHand2H);
        const key = eq[slot.id];
        const raw = key ? findInventoryRawByKey(key) : null;
        const meta = raw ? getItemMeta(raw) : null;
        const isSel = selectedSlot === slot.id;

        if (isLocked2H) {
            const mhRaw = findInventoryRawByKey(eq.mainHand);
            return `
                <button type="button" class="rpg-slot-box slot-locked-2h ${isSel ? 'slot-selected' : ''}" onclick="COS_RPG.selectEquipSlot('offHand')">
                    <div class="rpg-slot-hdr"><span>${slot.icon} ${slot.label}</span><span style="color:#c4b5fd;">🔗 2H</span></div>
                    <div class="rpg-slot-item-name" style="color:#d8b4fe; font-size:0.7rem;">Held by ${esc(mhRaw ? shortLabel(mhRaw) : '2H Weapon')}</div>
                    <div class="rpg-slot-bonus-txt" style="color:#a78bfa;">Both hands occupied</div>
                </button>
            `;
        }

        const gripBadge = (slot.id === 'mainHand' && bonuses.mainHand2H) ? '<span style="color:#c4b5fd;">2H</span>'
            : (meta && meta.attune ? '<span style="color:#d8b4fe;">✨</span>' : '');

        return `
            <button type="button" class="rpg-slot-box ${raw ? 'slot-filled' : ''} ${isSel ? 'slot-selected' : ''}" onclick="COS_RPG.selectEquipSlot('${slot.id}')">
                <div class="rpg-slot-hdr"><span>${slot.icon} ${slot.label}</span>${gripBadge}</div>
                ${raw
                    ? `<div class="rpg-slot-item-name">${esc(shortLabel(raw))}</div>
                       ${meta && meta.summary ? `<div class="rpg-slot-bonus-txt">${esc(meta.summary)}</div>` : ''}`
                    : `<div class="rpg-slot-empty-txt">Empty — click to equip</div>`}
            </button>
        `;
    }

    function renderEquipModal() {
        const body = document.getElementById('rpg-equip-body');
        if (!body) return;
        const bonuses = getGearBonuses();
        const eq = bonuses.equippedMap;
        const items = adapter.getItems();
        const curSlotObj = SLOTS.find(s => s.id === selectedSlot) || SLOTS[2];

        // Live Stat Pills
        const acTxt = document.getElementById('ac-disp')?.innerText || '--';
        const presetsHtml = (adapter.presets || []).map((p, idx) =>
            `<button type="button" class="rpg-preset-btn" onclick="COS_RPG.applyLoadoutPreset(${idx})">${esc(p.label)}</button>`
        ).join('');

        // Filter inventory items that fit selectedSlot
        const compatible = [];
        items.forEach((raw, idx) => {
            const meta = getItemMeta(raw);
            if (meta.slots && meta.slots.includes(selectedSlot)) {
                compatible.push({ raw, idx, key: normKey(raw), meta });
            }
        });

        const equippedKeyInSlot = eq[selectedSlot] || null;
        const mhRaw = eq.mainHand ? findInventoryRawByKey(eq.mainHand) : null;
        const mhVersatile = mhRaw && getItemMeta(mhRaw).versatile;

        let pickerItemsHtml = '';
        if (compatible.length === 0) {
            pickerItemsHtml = `
                <div style="font-size:0.75rem; color:#94a3b8; padding:12px 6px; text-align:center;">
                    No items in your Backpack are tagged for <strong>${curSlotObj.icon} ${curSlotObj.label}</strong> yet.<br>
                    <small style="color:#64748b;">Found custom DM loot? Click <strong>[🛠️ Tag Custom Gear]</strong> below to assign any item to this slot!</small>
                </div>
            `;
        } else {
            pickerItemsHtml = compatible.map(item => {
                const isEqHere = equippedKeyInSlot === item.key;
                const gripToggleHtml = (selectedSlot === 'mainHand' && item.meta.versatile)
                    ? `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('mainHand', '${esc(item.key).replace(/'/g, "\\'")}', '1h')">Equip 1H</button>
                       <button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('mainHand', '${esc(item.key).replace(/'/g, "\\'")}', '2h')">Equip 2H</button>`
                    : `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('${selectedSlot}', '${esc(item.key).replace(/'/g, "\\'")}')">Equip${item.meta.hands === 2 && selectedSlot === 'mainHand' ? ' (2H)' : ''}</button>`;

                return `
                    <div class="rpg-picker-item ${isEqHere ? 'is-equipped' : ''}">
                        <div class="rpg-picker-item-top">
                            <div>
                                <div class="rpg-picker-item-name">${esc(shortLabel(item.raw))}</div>
                                <div class="rpg-picker-item-meta">${esc(item.meta.summary || 'Equippable Gear')}${item.meta.attune ? ' • Attune' : ''}</div>
                            </div>
                            ${isEqHere ? '<span class="rpg-card-equipped-pill">WORN</span>' : ''}
                        </div>
                        <div class="rpg-picker-actions">
                            ${isEqHere
                                ? `<button type="button" class="rpg-mini-btn btn-danger" onclick="COS_RPG.unequipSlot('${selectedSlot}')">Unequip</button>`
                                : gripToggleHtml}
                            ${isEqHere && selectedSlot === 'mainHand' && item.meta.versatile
                                ? `<button type="button" class="rpg-mini-btn" onclick="COS_RPG.toggleMainHandGrip()">Switch to ${bonuses.mainHand2H ? '1H' : '2H'}</button>`
                                : ''}
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.openItemDetails(${item.idx})">Info</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Custom Gear Tagger form
        const untaggedOptions = items.map(r => `<option value="${esc(normKey(r))}">${esc(shortLabel(r))}</option>`).join('');
        const customTaggerHtml = showCustomTagger ? `
            <div class="rpg-custom-tagger">
                <div style="font-size:0.72rem; font-weight:800; color:#fde68a;">🛠️ Tag Any Backpack Item as Equippable Gear</div>
                <label class="rpg-field-lbl">Item from Backpack
                    <select id="rpg-tag-item" class="rpg-select">${untaggedOptions}</select>
                </label>
                <div class="rpg-form-grid">
                    <label class="rpg-field-lbl">Slot
                        <select id="rpg-tag-slot" class="rpg-select">
                            ${SLOTS.map(s => `<option value="${s.id}" ${s.id === selectedSlot ? 'selected' : ''}>${s.icon} ${s.label}</option>`).join('')}
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Hands / Grip
                        <select id="rpg-tag-hands" class="rpg-select">
                            <option value="1">Standard / 1-Handed</option>
                            <option value="2">2-Handed (Locks Off-Hand)</option>
                            <option value="versatile">Versatile (1H or 2H)</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">+AC Bonus
                        <input type="number" id="rpg-tag-ac" class="rpg-input" value="0" min="-5" max="10">
                    </label>
                    <label class="rpg-field-lbl">+All Saves Bonus
                        <input type="number" id="rpg-tag-saves" class="rpg-input" value="0" min="-5" max="10">
                    </label>
                    <label class="rpg-field-lbl">+Spell DC &amp; Hit
                        <input type="number" id="rpg-tag-spell" class="rpg-input" value="0" min="0" max="5">
                    </label>
                    <label class="rpg-field-lbl">Requires Attunement?
                        <select id="rpg-tag-attune" class="rpg-select">
                            <option value="no">No</option>
                            <option value="yes">Yes (Uses 1/3 Slot)</option>
                        </select>
                    </label>
                </div>
                <label class="rpg-field-lbl">Custom Perk Note (optional)
                    <input type="text" id="rpg-tag-note" class="rpg-input" placeholder="e.g. Fire Resistance, +1d6 Radiant...">
                </label>
                <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button type="button" class="rpg-mini-btn" onclick="COS_RPG.toggleCustomTagger()">Cancel</button>
                    <button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.saveCustomGearTag()">💾 Save &amp; Equip</button>
                </div>
            </div>
        ` : '';

        body.innerHTML = `
            <div class="rpg-equip-topstats">
                <div class="rpg-stat-pills">
                    <span class="rpg-stat-pill gold">🛡️ Live AC: ${esc(acTxt)}</span>
                    ${bonuses.saveBonus ? `<span class="rpg-stat-pill blue">✨ Saves: +${bonuses.saveBonus}</span>` : ''}
                    ${bonuses.spellDcBonus ? `<span class="rpg-stat-pill purple">🔮 Spell DC/Hit: +${bonuses.spellDcBonus}</span>` : ''}
                    ${bonuses.spellFireBonus ? `<span class="rpg-stat-pill" style="border-color:#ef4444; color:#fca5a5;">🔥 Spell Fire: +${esc(bonuses.spellFireBonus)}</span>` : ''}
                    ${bonuses.skillAdv.length ? `<span class="rpg-stat-pill green">🎯 Adv: ${esc(bonuses.skillAdv.join(', '))}</span>` : ''}
                    <span class="rpg-stat-pill purple">✨ Attuned: ${bonuses.attunedCount} / 3</span>
                </div>
                ${presetsHtml ? `<div class="rpg-presets-bar"><span style="font-size:0.66rem; font-weight:800; color:#94a3b8;">⚡ PRESETS:</span>${presetsHtml}</div>` : ''}
            </div>

            <div class="rpg-equip-split">
                <!-- LEFT: 11-SLOT PAPER-DOLL -->
                <div class="rpg-paperdoll-board">
                    <div class="rpg-doll-upper">
                        <div class="rpg-doll-col">
                            <div class="rpg-doll-col-title">Armor &amp; Attire (Head ➔ Feet)</div>
                            ${renderSlotBox(SLOTS[0], eq, bonuses)}
                            ${renderSlotBox(SLOTS[1], eq, bonuses)}
                            ${renderSlotBox(SLOTS[2], eq, bonuses)}
                            ${renderSlotBox(SLOTS[3], eq, bonuses)}
                            ${renderSlotBox(SLOTS[4], eq, bonuses)}
                        </div>
                        <div class="rpg-doll-col">
                            <div class="rpg-doll-col-title">Relics &amp; Jewelry</div>
                            ${renderSlotBox(SLOTS[5], eq, bonuses)}
                            <div class="rpg-rings-row">
                                ${renderSlotBox(SLOTS[6], eq, bonuses)}
                                ${renderSlotBox(SLOTS[7], eq, bonuses)}
                            </div>
                            <div class="rpg-active-bonuses-box" style="margin-top:auto;">
                                <div style="font-size:0.66rem; font-weight:800; color:#6ee7b7; text-transform:uppercase; margin-bottom:4px;">⚡ Active Equipped Perks</div>
                                ${bonuses.activePerks.length > 0
                                    ? bonuses.activePerks.map(p => `<div>• ${p}</div>`).join('')
                                    : '<div style="color:#64748b; font-style:italic;">Equip gear to activate passive bonuses!</div>'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="rpg-doll-col-title" style="margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                            <span>Combat Hands &amp; Ranged Holster</span>
                            ${mhVersatile ? `<button type="button" class="rpg-mini-btn" style="padding:1px 7px; min-block-size:22px; font-size:0.65rem;" onclick="COS_RPG.toggleMainHandGrip()">🔄 Grip: ${bonuses.mainHand2H ? '2-Handed' : '1-Handed'}</button>` : ''}
                        </div>
                        <div class="rpg-hands-row">
                            ${renderSlotBox(SLOTS[8], eq, bonuses)}
                            ${renderSlotBox(SLOTS[9], eq, bonuses)}
                            ${renderSlotBox(SLOTS[10], eq, bonuses)}
                        </div>
                    </div>
                </div>

                <!-- RIGHT: CONTEXT SLOT PICKER -->
                <div class="rpg-slot-picker">
                    <div class="rpg-picker-head">
                        <span style="font-size:0.82rem; font-weight:800; color:#fde68a;">${curSlotObj.icon} ${curSlotObj.label} Slot</span>
                        <div style="display:flex; gap:4px;">
                            ${equippedKeyInSlot ? `<button type="button" class="rpg-mini-btn btn-danger" onclick="COS_RPG.unequipSlot('${selectedSlot}')">Unequip</button>` : ''}
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.toggleCustomTagger()">Tag Custom</button>
                        </div>
                    </div>
                    ${customTaggerHtml}
                    <div style="display:flex; flex-direction:column; gap:6px; overflow-y:auto; max-height:360px;">
                        ${pickerItemsHtml}
                    </div>
                </div>
            </div>
        `;
    }

    function saveCustomGearTag() {
        const key = document.getElementById('rpg-tag-item')?.value;
        const slot = document.getElementById('rpg-tag-slot')?.value || 'body';
        const handsVal = document.getElementById('rpg-tag-hands')?.value || '1';
        const acBonus = parseInt(document.getElementById('rpg-tag-ac')?.value) || 0;
        const saveBonus = parseInt(document.getElementById('rpg-tag-saves')?.value) || 0;
        const spellBonus = parseInt(document.getElementById('rpg-tag-spell')?.value) || 0;
        const attune = document.getElementById('rpg-tag-attune')?.value === 'yes';
        const note = (document.getElementById('rpg-tag-note')?.value || '').trim();
        if (!key) return;

        const parts = [];
        if (acBonus) parts.push(`${acBonus > 0 ? '+' : ''}${acBonus} AC`);
        if (saveBonus) parts.push(`${saveBonus > 0 ? '+' : ''}${saveBonus} Saves`);
        if (spellBonus) parts.push(`+${spellBonus} Spell DC/Hit`);
        if (note) parts.push(note);
        if (attune) parts.push('Attune');

        const slots = (slot === 'ring1' || slot === 'ring2') ? ['ring1', 'ring2'] : [slot];
        const meta = {
            category: ['mainHand', 'offHand', 'ranged'].includes(slot) ? 'weapon' : (['amulet', 'ring1', 'ring2'].includes(slot) ? 'accessory' : 'armor'),
            slots,
            hands: handsVal === '2' ? 2 : 1,
            versatile: handsVal === 'versatile',
            acBonus,
            saveBonus,
            spellDcBonus: spellBonus,
            spellAtkBonus: spellBonus,
            attune,
            isShield: slot === 'offHand' && acBonus > 0,
            summary: parts.join(' • ') || 'Custom Equippable Gear'
        };
        const map = getCustomGearMap();
        map[key] = meta;
        saveCustomGearMap(map);
        showCustomTagger = false;
        selectedSlot = slot;
        equipItemToSlot(slot, key);
    }

    // =========================================================================
    // 🎒 RENDER SEARCHABLE BACKPACK MODAL
    // =========================================================================
    const BP_CATS = [
        { id: 'all',        label: '📦 All' },
        { id: 'equipped',   label: '✓ Equipped' },
        { id: 'weapon',     label: '⚔️ Weapons' },
        { id: 'armor',      label: '🛡️ Armor & Robes' },
        { id: 'accessory',  label: '💍 Accessories' },
        { id: 'consumable', label: '🧪 Consumables' },
        { id: 'crafting',   label: '🌿 Crafting' },
        { id: 'quest',      label: '📜 Quest & Clues' },
        { id: 'gear',       label: '🎒 Gear' }
    ];

    function renderBackpackModal() {
        const body = document.getElementById('rpg-bp-body');
        if (!body) return;
        const items = adapter.getItems();
        const eq = reconcileEquippedWithInventory();
        const q = bpSearchQuery.trim().toLowerCase();

        // Preserve focus if search input already exists
        let existingSearch = document.getElementById('rpg-bp-search');
        if (!existingSearch) {
            body.innerHTML = `
                <div class="rpg-bp-toolbar">
                    <search class="rpg-search-wrap" aria-label="Search Backpack">
                        <span aria-hidden="true">🔍</span>
                        <input type="search" id="rpg-bp-search" class="rpg-search-input" placeholder="Search weapons, robes, herbs, potions, keys..." autocorrect="off" autocapitalize="none" spellcheck="false">
                        <button type="button" class="rpg-mini-btn" style="min-block-size:24px; padding:1px 6px;" onclick="COS_RPG.clearBackpackSearch()" aria-label="Clear search">✕</button>
                    </search>
                    <div class="rpg-filter-pills" id="rpg-bp-filters" role="group" aria-label="Filter backpack by category"></div>
                </div>
                <div id="rpg-bp-meta" style="font-size:0.7rem; color:#94a3b8;"></div>
                <div class="rpg-bp-list" id="rpg-bp-list"></div>
            `;
            existingSearch = document.getElementById('rpg-bp-search');
            existingSearch.value = bpSearchQuery;
            existingSearch.addEventListener('input', e => {
                bpSearchQuery = e.target.value;
                renderBackpackRows();
            });
        }

        const filtersEl = document.getElementById('rpg-bp-filters');
        if (filtersEl) {
            filtersEl.innerHTML = BP_CATS.map(c => `
                <button type="button" class="rpg-filter-pill" aria-pressed="${bpCategoryFilter === c.id ? 'true' : 'false'}" onclick="COS_RPG.setBackpackCategory('${c.id}')">${c.label}</button>
            `).join('');
        }
        renderBackpackRows();
    }

    function renderBackpackRows() {
        const listEl = document.getElementById('rpg-bp-list');
        const metaEl = document.getElementById('rpg-bp-meta');
        if (!listEl) return;
        const items = adapter.getItems();
        const eq = reconcileEquippedWithInventory();
        const q = bpSearchQuery.trim().toLowerCase();

        const rows = [];
        items.forEach((raw, idx) => {
            const p = parseItem(raw);
            const meta = getItemMeta(raw);
            const key = normKey(raw);
            const eqSlot = SLOTS.find(s => eq[s.id] === key);
            const isEquipped = !!eqSlot;

            if (q && !raw.toLowerCase().includes(q) && !(meta.summary || '').toLowerCase().includes(q)) return;
            if (bpCategoryFilter === 'equipped' && !isEquipped) return;
            if (bpCategoryFilter !== 'all' && bpCategoryFilter !== 'equipped' && meta.category !== bpCategoryFilter) return;

            const canEquip = meta.slots && meta.slots.length > 0;
            const catLbl = BP_CATS.find(c => c.id === meta.category)?.label || '📦 Gear';

            rows.push(`
                <div class="rpg-bp-row ${isEquipped ? 'row-equipped' : ''}">
                    <div class="rpg-bp-main">
                        <div>
                            <button type="button" class="rpg-bp-name-btn" onclick="COS_RPG.openItemDetails(${idx})">
                                ${p.hasQty ? `${p.emoji}${p.name}` : esc(raw)}
                            </button>
                            ${isEquipped ? `<span class="rpg-card-equipped-pill">✓ ${eqSlot.icon} ${eqSlot.label}</span>` : ''}
                        </div>
                        <div class="rpg-bp-tags">
                            <span class="rpg-bp-cat-tag">${catLbl}</span>
                            ${meta.summary ? `<span>${esc(meta.summary)}</span>` : ''}
                        </div>
                    </div>
                    <div class="rpg-bp-actions">
                        ${canEquip ? `<button type="button" class="rpg-mini-btn ${isEquipped ? 'btn-equipped' : 'btn-equip'}" onclick="COS_RPG.quickToggleEquipByIndex(${idx})">${isEquipped ? 'Unequip' : 'Equip'}</button>` : ''}
                        ${meta.useAction ? `<button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.useConsumableByIndex(${idx})">Use</button>` : ''}
                        <button type="button" class="rpg-mini-btn btn-send" onclick="COS_RPG.openSendForItem(${idx})" title="Send to party member">Send</button>
                        <div class="inv-stepper" style="display:inline-flex; align-items:center; gap:3px; background:#090e1a; border:1px solid #334155; border-radius:5px; padding:1px 4px;">
                            ${p.hasQty ? `<button type="button" class="rpg-mini-btn" style="min-block-size:22px; padding:0 5px; border:none;" onclick="COS_RPG.stepBackpackQty(${idx}, -1)" aria-label="Decrease quantity">−</button><span style="font-family:'JetBrains Mono',monospace; font-size:0.72rem; font-weight:800; color:#fde68a; min-width:22px; text-align:center;">${p.qty}x</span>` : ''}
                            <button type="button" class="rpg-mini-btn" style="min-block-size:22px; padding:0 5px; border:none;" onclick="COS_RPG.stepBackpackQty(${idx}, 1)" aria-label="Increase quantity">+</button>
                        </div>
                        <button type="button" class="rpg-mini-btn btn-danger" onclick="COS_RPG.deleteBackpackItem(${idx})" aria-label="Remove item">✕</button>
                    </div>
                </div>
            `);
        });

        if (metaEl) metaEl.innerHTML = `Showing <strong>${rows.length}</strong> of <strong>${items.length}</strong> items in Backpack${q ? ` matching "<em>${esc(bpSearchQuery)}</em>"` : ''}.`;
        listEl.innerHTML = rows.length > 0
            ? rows.join('')
            : `<div style="text-align:center; padding:18px; color:#64748b; font-size:0.78rem;">No items match this filter or search.</div>`;
    }

    function stepBackpackQty(idx, delta) {
        const items = adapter.getItems();
        if (!items[idx]) return;
        const p = parseItem(items[idx]);
        const next = p.qty + delta;
        if (next <= 0) {
            items.splice(idx, 1);
            adapter.log(`🗑️ <strong>Consumed last:</strong> ${esc(p.name)} removed from Backpack.`);
        } else {
            items[idx] = `${p.emoji}${next}x ${p.name}`.trim();
        }
        adapter.saveItems(items);
        applyEquipmentToSheet(true);
    }

    function deleteBackpackItem(idx) {
        const items = adapter.getItems();
        if (!items[idx]) return;
        const removed = items.splice(idx, 1);
        adapter.saveItems(items);
        adapter.log(`🗑️ Removed <strong>"${esc(removed[0])}"</strong> from Backpack.`);
        applyEquipmentToSheet(true);
    }

    function addBackpackItem() {
        const inp = document.getElementById('rpg-bp-add-input');
        const txt = (inp?.value || '').trim();
        if (!txt) return;
        const items = adapter.getItems();
        items.unshift(txt);
        adapter.saveItems(items);
        inp.value = '';
        adapter.log(`🎒 Added <strong>"${esc(txt)}"</strong> to Backpack.`);
        applyEquipmentToSheet(true);
    }

    function resetBackpack() {
        adapter.resetItems();
        localStorage.removeItem(getEquipStorageKey());
        applyEquipmentToSheet(true);
        adapter.log(`🎒 Backpack &amp; Equipment reset to official synced loadout.`);
    }

    // =========================================================================
    // ⚗️ RENDER CRAFTING MODAL
    // =========================================================================
    function renderCraftModal() {
        const body = document.getElementById('rpg-craft-body');
        if (!body) return;
        const herbs = countIngredientQty('medicinal herb');
        const cats = countIngredientQty('alchemical catalyst');
        const silver = countIngredientQty('silver dust');

        body.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; background:#090e1a; border:1px solid #1e293b; border-radius:6px; padding:7px 10px;">
                <span style="font-size:0.74rem; color:#6ee7b7; font-weight:700;">🌿 Medicinal Herbs: <strong>${herbs}x</strong> • ⚗️ Catalysts: <strong>${cats}x</strong> • ✨ Silver Dust: <strong>${silver}x</strong></span>
                <span style="font-size:0.68rem; color:#94a3b8;">Extensible Campaign Recipes</span>
            </div>
            ${CRAFTING_RECIPES.map(r => {
                const canCraft = r.ingredients.every(ing => countIngredientQty(ing.keyword) >= ing.qty);
                const reqs = r.ingredients.map(ing => {
                    const have = countIngredientQty(ing.keyword);
                    const ok = have >= ing.qty;
                    return `<span style="color:${ok ? '#86efac' : '#f87171'}; font-family:'JetBrains Mono',monospace; font-size:0.7rem; font-weight:700;">${ok ? '✓' : '✕'} ${ing.qty}x ${esc(ing.label)} (Have ${have})</span>`;
                }).join(' &nbsp;•&nbsp; ');
                return `
                    <div class="rpg-craft-card ${canCraft ? '' : 'locked'}">
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                            <strong style="font-size:0.84rem; color:#f8fafc;">${esc(r.name)}</strong>
                            <span class="rpg-badge-count">${esc(r.badge)}</span>
                        </div>
                        <div style="font-size:0.73rem; color:#cbd5e1; line-height:1.4;">${esc(r.desc)}</div>
                        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px; margin-top:2px;">
                            <div>${reqs}</div>
                            <button type="button" class="rpg-mini-btn btn-use ${canCraft ? '' : 'rpg-craft-disabled'}" aria-disabled="${canCraft ? 'false' : 'true'}" onclick="COS_RPG.craftRecipe('${r.id}')">Craft 1x</button>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }

    // =========================================================================
    // 🤝 RENDER LIVE TRANSFER & TRADE MODAL
    // =========================================================================
    let preselectedSendIdx = 0;

    function renderTradeModal() {
        const body = document.getElementById('rpg-trade-body');
        const pill = document.getElementById('rpg-trade-status-pill');
        if (!body) return;

        if (pill) {
            pill.className = `rpg-status-dot ${firebaseReady ? 'online' : 'offline'}`;
            pill.innerText = firebaseReady ? '🟢 Live Firestore Sync' : '🟡 Offline Trade Codes';
        }

        const others = PARTY_MEMBERS.filter(m => m.id !== adapter.heroId);
        if (!tradeRecipient || tradeRecipient === adapter.heroId) tradeRecipient = others[0].id;

        const items = adapter.getItems();
        const wallet = adapter.getGold();

        const sendTabHtml = `
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                    <div style="font-size:0.68rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">1. Select Recipient</div>
                    <div class="rpg-recipient-grid">
                        ${others.map(m => `
                            <button type="button" class="rpg-recip-btn" aria-pressed="${tradeRecipient === m.id ? 'true' : 'false'}" onclick="COS_RPG.setTradeRecipient('${m.id}')">${m.label}</button>
                        `).join('')}
                    </div>
                </div>

                <div style="display:flex; gap:6px;">
                    <button type="button" class="rpg-tab-btn" aria-pressed="${tradeMode === 'item' ? 'true' : 'false'}" onclick="COS_RPG.setTradeMode('item')">Send Item</button>
                    <button type="button" class="rpg-tab-btn" aria-pressed="${tradeMode === 'gold' ? 'true' : 'false'}" onclick="COS_RPG.setTradeMode('gold')">Send Gold / Silver</button>
                </div>

                ${tradeMode === 'item' ? `
                    <div class="rpg-form-grid">
                        <label class="rpg-field-lbl" style="grid-column: span 2;">Item from Your Backpack
                            <select id="rpg-trade-item-select" class="rpg-select">
                                ${items.map((raw, i) => `<option value="${i}" ${i === preselectedSendIdx ? 'selected' : ''}>${esc(raw)}</option>`).join('')}
                            </select>
                        </label>
                        <label class="rpg-field-lbl">Quantity to Send
                            <input type="number" id="rpg-trade-item-qty" class="rpg-input" value="1" min="1" max="99">
                        </label>
                        <label class="rpg-field-lbl">Note (optional)
                            <input type="text" id="rpg-trade-note" class="rpg-input" placeholder="e.g. Drink this before Doru!">
                        </label>
                    </div>
                ` : `
                    <div class="rpg-form-grid">
                        <label class="rpg-field-lbl">Gold Pieces (You have ${wallet.gp} GP)
                            <input type="number" id="rpg-trade-gp" class="rpg-input" value="0" min="0" max="${wallet.gp}">
                        </label>
                        <label class="rpg-field-lbl">Silver Pieces (You have ${wallet.sp} SP)
                            <input type="number" id="rpg-trade-sp" class="rpg-input" value="0" min="0" max="999">
                        </label>
                        <label class="rpg-field-lbl" style="grid-column: span 2;">Note (optional)
                            <input type="text" id="rpg-trade-note" class="rpg-input" placeholder="e.g. For silvering weapons at Tser Pool">
                        </label>
                    </div>
                `}

                <div style="display:flex; flex-wrap:wrap; gap:6px; align-items:center;">
                    ${firebaseReady
                        ? `<button type="button" class="rpg-mini-btn btn-use" style="padding:7px 14px; font-size:0.78rem;" onclick="COS_RPG.sendTransfer(false)">Send Live</button>`
                        : ''}
                    <button type="button" class="rpg-mini-btn btn-send" style="padding:7px 14px; font-size:0.78rem;" onclick="COS_RPG.sendTransfer(true)">Generate Trade Code</button>
                </div>

                ${lastGeneratedCode ? `
                    <div style="display:flex; flex-direction:column; gap:5px; background:#0b1120; border:1px solid #38bdf8; border-radius:7px; padding:8px 10px;">
                        <div style="font-size:0.72rem; color:#bae6fd;">${lastGeneratedMsg}</div>
                        <div class="rpg-code-box">${esc(lastGeneratedCode)}</div>
                        <button type="button" class="rpg-mini-btn btn-equip" style="align-self:flex-start;" onclick="navigator.clipboard?.writeText('${esc(lastGeneratedCode)}')">Copy Code</button>
                    </div>
                ` : ''}

                ${outgoingTrades.length > 0 ? `
                    <div style="display:flex; flex-direction:column; gap:5px; margin-top:4px;">
                        <div style="font-size:0.7rem; font-weight:800; color:#fde68a; text-transform:uppercase;">Outgoing Pending Transfers (${outgoingTrades.length})</div>
                        ${outgoingTrades.map(t => `
                            <div class="rpg-bp-row">
                                <span style="font-size:0.75rem; color:#f8fafc;">To <strong>${esc(t.toName)}</strong>: ${t.kind === 'gold' ? `${t.gp} GP ${t.sp} SP` : esc(t.itemRaw)}</span>
                                <button type="button" class="rpg-mini-btn btn-danger" onclick="COS_RPG.cancelOutgoingTransfer('${t.id}')">Cancel &amp; Reclaim</button>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        const inboxTabHtml = `
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                    <div style="font-size:0.7rem; font-weight:800; color:#86efac; text-transform:uppercase; margin-bottom:5px;">Live Incoming Transfers (${incomingTrades.length})</div>
                    ${incomingTrades.length === 0
                        ? `<div style="font-size:0.76rem; color:#64748b; background:#090e1a; border:1px solid #1e293b; border-radius:6px; padding:12px; text-align:center;">No pending live transfers right now.${!firebaseReady ? ' Paste your Firebase config below to enable instant cross-device push!' : ''}</div>`
                        : incomingTrades.map(tr => `
                            <div class="rpg-bp-row row-equipped">
                                <div style="font-size:0.78rem; color:#f8fafc;">
                                    <strong>${esc(tr.fromName)}</strong> sent: <strong>${tr.kind === 'gold' ? `${tr.gp || 0} GP, ${tr.sp || 0} SP` : `${tr.qty > 1 ? tr.qty + 'x ' : ''}${esc(tr.itemRaw)}`}</strong>
                                    ${tr.note ? `<div style="font-size:0.7rem; color:#cbd5e1; font-style:italic;">"${esc(tr.note)}"</div>` : ''}
                                </div>
                                <div style="display:flex; gap:5px;">
                                    <button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.acceptLiveTransfer('${tr.id}')">Accept</button>
                                    <button type="button" class="rpg-mini-btn btn-danger" onclick="COS_RPG.declineLiveTransfer('${tr.id}')">Decline</button>
                                </div>
                            </div>
                        `).join('')}
                </div>

                <div style="background:#090e1a; border:1px solid #334155; border-radius:7px; padding:9px 10px; display:flex; flex-direction:column; gap:6px;">
                    <div style="font-size:0.72rem; font-weight:800; color:#93c5fd;">Claim Offline Trade Code (COSTRADE:...)</div>
                    <div style="display:flex; gap:6px;">
                        <input type="text" id="rpg-claim-code-input" class="rpg-input" style="flex:1;" placeholder="Paste COSTRADE:... code from another player or DM">
                        <button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.claimOfflineTradeCode()">Claim</button>
                    </div>
                </div>

                ${!firebaseReady ? `
                    <details style="background:#0b1120; border:1px solid #334155; border-radius:7px; padding:8px 10px;">
                        <summary style="cursor:pointer; font-size:0.72rem; font-weight:700; color:#fde68a;">Connect Firebase Live Sync (Project: project-9c271700-748f-41b4-bfb)</summary>
                        <div style="margin-top:6px; display:flex; flex-direction:column; gap:6px;">
                            <div style="font-size:0.7rem; color:#94a3b8; line-height:1.4;">Paste your <code>firebaseConfig</code> object from Firebase Console (or put it inside <code>cos_firebase_config.js</code> for the whole table):</div>
                            <textarea id="rpg-fb-json-input" class="rpg-input" rows="4" placeholder='{ "apiKey": "...", "projectId": "project-9c271700-748f-41b4-bfb", "appId": "..." }'></textarea>
                            <button type="button" class="rpg-mini-btn btn-equip" style="align-self:flex-start;" onclick="COS_RPG.saveBrowserFirebaseConfig()">Connect Live Sync</button>
                        </div>
                    </details>
                ` : ''}
            </div>
        `;

        body.innerHTML = `
            <div class="rpg-tab-bar">
                <button type="button" class="rpg-tab-btn" aria-pressed="${tradeActiveTab === 'send' ? 'true' : 'false'}" onclick="COS_RPG.setTradeTab('send')">Send Item / Gold</button>
                <button type="button" class="rpg-tab-btn" aria-pressed="${tradeActiveTab === 'inbox' ? 'true' : 'false'}" onclick="COS_RPG.setTradeTab('inbox')">Inbox &amp; Claim Code ${incomingTrades.length > 0 ? `(${incomingTrades.length})` : ''}</button>
            </div>
            ${tradeActiveTab === 'send' ? sendTabHtml : inboxTabHtml}
        `;
    }

    // =========================================================================
    // MODAL OPEN / CLOSE & PUBLIC API
    // =========================================================================
    function openEquipModal(slotId) {
        if (slotId) selectedSlot = slotId;
        showCustomTagger = false;
        renderEquipModal();
        const m = document.getElementById('rpg-equip-modal');
        if (m && !m.open) m.showModal();
    }

    function openBackpackModal() {
        renderBackpackModal();
        const m = document.getElementById('rpg-backpack-modal');
        if (m && !m.open) m.showModal();
    }

    function openCraftModal() {
        renderCraftModal();
        const m = document.getElementById('rpg-craft-modal');
        if (m && !m.open) m.showModal();
    }

    function openTradeModal(tab = 'send') {
        tradeActiveTab = tab;
        lastGeneratedCode = '';
        renderTradeModal();
        const m = document.getElementById('rpg-trade-modal');
        if (m && !m.open) m.showModal();
    }

    function openSendForItem(invIdx) {
        preselectedSendIdx = invIdx;
        tradeMode = 'item';
        openTradeModal('send');
    }

    function closeModal(id) {
        const m = document.getElementById(id);
        if (m && m.open) m.close();
    }

    function getExportEquippedSummary() {
        const bonuses = getGearBonuses();
        const eq = bonuses.equippedMap;
        const parts = [];
        for (const s of SLOTS) {
            if (!eq[s.id]) continue;
            const raw = findInventoryRawByKey(eq[s.id]);
            if (raw) {
                const grip = (s.id === 'mainHand' && bonuses.mainHand2H) ? ' (2H)' : '';
                parts.push(`${s.label}: ${shortLabel(raw)}${grip}`);
            }
        }
        return parts.length > 0 ? `Equipped: ${parts.join(', ')}` : 'Equipped: None';
    }

    function checkUrlClaimParam() {
        try {
            const params = new URLSearchParams(window.location.search);
            const code = params.get('claim');
            if (code) {
                claimOfflineTradeCode(code);
                if (window.history && window.history.replaceState) {
                    window.history.replaceState({}, '', window.location.pathname);
                }
            }
        } catch (e) {}
    }

    function init(sheetAdapter) {
        adapter = sheetAdapter;
        injectDialogsAndBanner();
        initFirebaseSync();
        applyEquipmentToSheet(true);
        checkUrlClaimParam();
    }

    // Export public API
    window.COS_RPG = {
        init,
        SLOTS,
        getGearBonuses,
        getEquippedState,
        applyEquipmentToSheet,
        syncExternalBodySlot,
        syncExternalWeaponStance,
        getExportEquippedSummary,
        openEquipModal,
        openBackpackModal,
        openCraftModal,
        openTradeModal,
        openSendForItem,
        closeModal,
        selectEquipSlot: (slotId) => { selectedSlot = slotId; showCustomTagger = false; renderEquipModal(); },
        equipItemToSlot,
        unequipSlot,
        toggleMainHandGrip,
        applyLoadoutPreset,
        quickToggleEquipByIndex,
        toggleCustomTagger: () => { showCustomTagger = !showCustomTagger; renderEquipModal(); },
        saveCustomGearTag,
        setBackpackCategory: (cat) => { bpCategoryFilter = cat; renderBackpackModal(); },
        clearBackpackSearch: () => {
            bpSearchQuery = '';
            const inp = document.getElementById('rpg-bp-search');
            if (inp) inp.value = '';
            renderBackpackRows();
        },
        stepBackpackQty,
        deleteBackpackItem,
        addBackpackItem,
        resetBackpack,
        useConsumableByIndex,
        openItemDetails: (idx) => {
            if (adapter && typeof adapter.openItemModal === 'function') {
                // Keep Backpack / Equipment modal open underneath in the Top Layer!
                const itemDlg = document.getElementById('item-modal');
                if (itemDlg) {
                    const onItemClose = () => {
                        itemDlg.removeEventListener('close', onItemClose);
                        applyEquipmentToSheet(true);
                    };
                    itemDlg.addEventListener('close', onItemClose);
                }
                adapter.openItemModal(idx);
            }
        },
        craftRecipe,
        setTradeTab: (tab) => { tradeActiveTab = tab; renderTradeModal(); },
        setTradeRecipient: (id) => { tradeRecipient = id; renderTradeModal(); },
        setTradeMode: (mode) => { tradeMode = mode; renderTradeModal(); },
        sendTransfer,
        acceptLiveTransfer,
        declineLiveTransfer,
        cancelOutgoingTransfer,
        claimOfflineTradeCode,
        saveBrowserFirebaseConfig,
        encodeTradeCode
    };
})();
