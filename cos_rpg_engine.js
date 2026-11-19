// =========================================================================
// 🛡️ CURSE OF STRAHD — UNIFIED RPG EQUIPMENT, BACKPACK, CRAFT & TRADE ENGINE
// =========================================================================
(function () {
    'use strict';

    const BASE_SLOTS = [
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

    function getActiveSlots() {
        const list = [...BASE_SLOTS];
        if (adapter && Array.isArray(adapter.extraSlots) && adapter.extraSlots.length > 0) {
            adapter.extraSlots.forEach(es => {
                if (list.some(s => s.id === es.id)) return;
                if (es.group === 'hand') {
                    const rIdx = list.findIndex(s => s.id === 'ranged');
                    if (rIdx !== -1) list.splice(rIdx, 0, es);
                    else list.push(es);
                } else {
                    list.push(es);
                }
            });
        }
        return list;
    }

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
            slots: ['mainHand', 'offHand', 'legSheath'],
            hands: 1,
            weaponTag: 'kolyan_dagger',
            isLegDagger: true,
            summary: '1H Silvered 1d4+DEX • 3 Red Gems'
        },
        {
            match: ['baal verzi', 'mirror dagger'],
            category: 'weapon',
            slots: ['mainHand', 'offHand', 'legSheath'],
            hands: 1,
            isLegDagger: true,
            summary: '+1 Finesse Light Dagger • 1d4+1'
        },
        {
            match: ['trench knife', 'stiletto'],
            category: 'weapon',
            slots: ['legSheath', 'offHand', 'mainHand'],
            hands: 1,
            weaponTag: 'knife',
            isLegDagger: true,
            summary: '1H Finesse Light 1d4+DEX • Nick'
        },
        {
            match: ['dagger'],
            category: 'weapon',
            slots: ['mainHand', 'offHand', 'legSheath'],
            hands: 1,
            weaponTag: 'dagger',
            isLegDagger: true,
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
            slots: ['ranged'],
            hands: 2,
            weaponTag: 'lament',
            stance: 'lament',
            summary: '2H Heavy Rifle • 1d12+4 • 80/240ft (Ranged)'
        },
        {
            match: ['"mercy"', 'mercy (main', 'mercy revolver'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            hands: 1,
            weaponTag: 'mercy',
            stance: 'revolvers',
            summary: '1H Six-Shooter • 1d6+4 • 6-Cyl'
        },
        {
            match: ['"less"', 'less (off', 'less revolver'],
            category: 'weapon',
            slots: ['offHand', 'mainHand'],
            hands: 1,
            weaponTag: 'less',
            stance: 'revolvers',
            summary: '1H Six-Shooter • 1d6 • 6-Cyl'
        },
        {
            match: ['twin revolvers'],
            category: 'weapon',
            slots: ['mainHand'],
            hands: 2,
            weaponTag: 'revolvers',
            stance: 'revolvers',
            summary: 'Twin Six-Shooters • 1d6+4 / 1d6'
        },
        {
            match: ['longbow', 'shortbow', 'crossbow', 'musket', 'pistol', 'rifle', /\bbow\b/, /\bsling\b/],
            category: 'weapon',
            slots: ['ranged'],
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
            match: ['alchemical catalyst', 'catalyst', 'silver dust', 'wolfbane', 'sulfur', 'brimstone', 'pine pitch', 'pitch oil', 'lamp oil', 'moonpetal', 'charcoal', 'vampire ash', 'wolf fang', 'linen wrap', 'treated pelt', 'dire-pelt', 'waxed canvas'],
            category: 'crafting',
            slots: [],
            summary: 'Foraged / Shop Crafting Reagent'
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
            match: ['holy water', 'blessed by the morninglord', 'morninglord'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'holyWater', label: 'Holy Water (2d6 Rad)' },
            summary: '2d6 Radiant & Halts Vampire Regen'
        },
        {
            match: ['pure spring water', 'mountain spring water'],
            category: 'crafting',
            slots: [],
            summary: 'Foraged Crafting Reagent (Spring Water)'
        },
        {
            match: ['elixir of health', 'elixir of life'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'utilityLog', verb: 'Administered', label: 'Elixir of Health (Legendary)', effect: 'Revives creature dead within 1 minute at 50% Max HP, knits severed limbs, & imposes -2 penalty to attacks, saves & checks until Long Rest!' },
            summary: 'Legendary Revival (50% HP, -2 till Long Rest)'
        },
        {
            match: ['antitoxin'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'utilityLog', verb: 'Drank', label: 'Antitoxin (1 hr)', effect: 'Advantage on Saving Throws against Poison for 1 full hour!' },
            summary: 'Adv vs Poison Saves (1 hr)'
        },
        {
            match: ['liquid silver'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'utilityLog', verb: 'Applied', label: 'Silver Coat (1 hr)', effect: 'Coated 1 weapon or 10 rounds as Silvered for 1 hour (bypasses Vampire/Werewolf/Hag resistance)!' },
            summary: 'Coats Weapon/10 Ammo Silvered (1 hr)'
        },
        {
            match: ['alchemist\'s fire'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'alchemistsFire', label: 'Alchemist\'s Fire (1d4/turn)' },
            summary: '20 ft Throw • 1d4 Fire/turn (DC 10 DEX)'
        },
        {
            match: ['phosphor'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'phosphorBomb', label: 'Phosphor Bomb (2d6+Blind)' },
            summary: '30 ft Throw • 2d6 Fire/Rad + Blind'
        },
        {
            match: ['smoke bomb'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'utilityLog', verb: 'Threw', label: 'Smoke Bomb (15 ft)', effect: '15-ft radius cloud is Heavily Obscured for 1 minute (blocks sightlines & covers Stealth/Disengage)!' },
            summary: '30 ft Throw • 15-ft Heavily Obscured'
        },
        {
            match: ['sun-ash'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'utilityLog', verb: 'Applied', label: 'Sun-Ash (+1d4 Rad)', effect: 'Coated 1 weapon or 6 rounds for +1d4 Radiant damage for 10 minutes!' },
            summary: '+1d4 Radiant Coating (10 min)'
        },
        {
            match: ['mist-ward', 'camp kit', 'traveler\'s camp'],
            category: 'gear',
            slots: [],
            summary: 'Wilderness True Long Rest & Camp Shelter'
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

    // Unified Extensible Crafting Recipes (Unlocked vs Hidden & Locked until discovered!)
    const CRAFTING_RECIPES = [
        {
            id: 'craft_healing_potion',
            unlocked: true,
            name: '🧪 Potion of Healing',
            badge: '2d6 + 1 HP',
            desc: 'Steep 2 bundles of Barovian Medicinal Herbs into a restorative ruby draught (Bonus Action self / Action ally).',
            ingredients: [{ keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 2 }],
            outputRaw: '🧪 1x Potion of Healing (2d6+1 HP)',
            outputMatch: 'potion of healing'
        },
        {
            id: 'craft_field_bandages',
            unlocked: true,
            name: '🩹 Field Bandages',
            badge: '1d6 + 1 HP',
            desc: 'Infuse clean linen strips with crushed medicinal herbs to bind wounds quickly in the field.',
            ingredients: [{ keyword: 'medicinal herb', label: 'Medicinal Herb', qty: 1 }],
            outputRaw: '🩹 1x Field Bandages (Heals 1d6+1 HP)',
            outputMatch: 'bandage'
        },
        {
            id: 'craft_greater_healing',
            unlocked: false,
            unlockCode: 'GREATER-HEAL',
            tierHint: 'Apothecary Formula',
            name: '🧪 Potion of Greater Healing',
            badge: '4d4 + 4 HP',
            desc: 'Distill 4 bundles of Medicinal Herbs with 1 Alchemical Catalyst for potent mid-battle recovery.',
            ingredients: [
                { keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 4 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 1 }
            ],
            outputRaw: '🧪 1x Potion of Greater Healing (4d4+4 HP)',
            outputMatch: 'potion of greater healing'
        },
        {
            id: 'craft_holy_water',
            unlocked: false,
            unlockCode: 'MORNINGLORD',
            tierHint: 'Sacred Rite Formula',
            name: '💧 Flask of Morninglord Holy Water',
            badge: '2d6 Radiant',
            desc: 'Consecrate Pure Mountain Spring Water with Powdered Silver Dust to burn Undead & halt Vampire Regeneration.',
            ingredients: [
                { keyword: 'spring water', label: 'Pure Spring Water', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 }
            ],
            outputRaw: '💧 1x Flask of Morninglord Holy Water (2d6 Radiant)',
            outputMatch: 'holy water'
        },
        {
            id: 'craft_antitoxin',
            unlocked: false,
            unlockCode: 'WOLFBANE',
            tierHint: 'Wilderness Herbalism',
            name: '🧪 Barovian Antitoxin Tonic',
            badge: 'Adv vs Poison (1 hr)',
            desc: 'Boil Medicinal Herbs with bitter Svalich Wolfbane Root for 1 hour of Advantage on saving throws against poison.',
            ingredients: [
                { keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 2 },
                { keyword: 'wolfbane', label: 'Svalich Wolfbane Root', qty: 1 }
            ],
            outputRaw: '🧪 1x Barovian Antitoxin Tonic (Adv vs Poison 1 hr)',
            outputMatch: 'antitoxin'
        },
        {
            id: 'craft_silver_oil',
            unlocked: false,
            unlockCode: 'SILVER-COAT',
            tierHint: 'Monster-Hunter Alchemy',
            name: '✨ Vial of Liquid Silver Coating',
            badge: 'Silvered Weapon (1 hr)',
            desc: 'Suspend Powdered Silver Dust in Pine Pitch Oil; coats 1 blade or 10 bullets/slugs as Silvered for 1 hour.',
            ingredients: [
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 1 }
            ],
            outputRaw: '✨ 1x Vial of Liquid Silver Coating (1 hr)',
            outputMatch: 'liquid silver'
        },
        {
            id: 'craft_fire_flask',
            unlocked: false,
            unlockCode: 'BRIMSTONE',
            tierHint: 'Volatile Concoction',
            name: '🔥 Alchemist\'s Fire Flask',
            badge: '1d4 Fire / Turn',
            desc: 'Volatile flask of Brimstone Sulfur suspended in Pine Pitch Oil; ignites on impact (DC 10 DEX to extinguish).',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 1 }
            ],
            outputRaw: '🔥 1x Alchemist\'s Fire Flask (1d4/turn Fire)',
            outputMatch: 'alchemist\'s fire'
        },
        {
            id: 'craft_smoke_bomb',
            unlocked: false,
            unlockCode: 'ASH-CLOUD',
            tierHint: 'Tactical Gadget',
            name: '💨 Ash-Cloud Smoke Bomb',
            badge: '15-ft Obscured',
            desc: 'Compact sulfur-charcoal sphere that bursts into a 15-ft radius cloud of choking fog for 1 minute.',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: 'medicinal herb', label: 'Dried Herbs / Tinder', qty: 1 }
            ],
            outputRaw: '💨 1x Ash-Cloud Smoke Bomb (15-ft Heavily Obscured)',
            outputMatch: 'smoke bomb'
        },
        {
            id: 'craft_phosphor_bomb',
            unlocked: false,
            unlockCode: 'PHOSPHOR',
            tierHint: 'Monster-Hunter Gadget',
            name: '💣 Alchemical Phosphor & Smoke Flash-Bomb',
            badge: '2d6 Fire/Rad + Blind',
            desc: 'Alchemical flash sphere packed with sulfur, silver filings, and alembic salt (30 ft, 10-ft radius, DC 13 DEX/CON or 2d6 Fire/Radiant + Blind 1 turn).',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 1 }
            ],
            outputRaw: '💣 1x Alchemical Phosphor & Smoke Flash-Bomb',
            outputMatch: 'phosphor'
        },
        {
            id: 'craft_camp_kit',
            unlocked: false,
            unlockCode: 'MIST-CAMP',
            tierHint: 'Challenging Field Craft (DC 14 Survival)',
            name: '⛺ Mist-Ward Traveler\'s Camp Kit',
            badge: 'Wilderness True Long Rest',
            desc: 'Challenging heavy survival build (DC 14 Survival at table): pitch-sealed dire-pelt canvas tent & silver-salt perimeter ward enabling a True Long Rest in the wilderness.',
            ingredients: [
                { keyword: ['dire-pelt', 'treated pelt', 'waxed canvas'], label: 'Treated Dire-Pelt & Waxed Canvas', qty: 2 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 2 },
                { keyword: 'wolfbane', label: 'Svalich Wolfbane Root', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 }
            ],
            outputRaw: '⛺ Mist-Ward Traveler\'s Camp Kit (Wilderness True Long Rest)',
            outputMatch: 'mist-ward'
        },
        {
            id: 'craft_superior_healing',
            unlocked: false,
            unlockCode: 'MOONPETAL',
            tierHint: 'Master Alchemy',
            name: '🧪 Potion of Superior Healing',
            badge: '8d4 + 8 HP',
            desc: 'Rare master-grade Barovian elixir brewed with Svalich Moonpetal and double Alchemical Catalyst.',
            ingredients: [
                { keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 4 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 2 },
                { keyword: 'moonpetal', label: 'Svalich Moonpetal Blossom', qty: 1 }
            ],
            outputRaw: '🧪 1x Potion of Superior Healing (8d4+8 HP)',
            outputMatch: 'potion of superior healing'
        },
        {
            id: 'craft_vampire_ward',
            unlocked: false,
            unlockCode: 'SUN-ASH',
            tierHint: 'Sacred Relic Alchemy',
            name: '☀️ Sun-Ash Repellent Balm',
            badge: '+1d4 Radiant Coat (10m)',
            desc: 'Luminous consecrated unguent of Moonpetal, Silver Dust, and Spring Water; coats 1 weapon or 6 rounds for +1d4 Radiant.',
            ingredients: [
                { keyword: 'moonpetal', label: 'Svalich Moonpetal Blossom', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: 'spring water', label: 'Pure Spring Water', qty: 1 }
            ],
            outputRaw: '☀️ 1x Sun-Ash Repellent Balm (+1d4 Radiant Coat 10m)',
            outputMatch: 'sun-ash'
        }
    ];

    // Shared 5e Item & Crafting Material Lore Dictionary (fallback across all 3 Player Sheets!)
    const SHARED_ITEM_LORE = [
        {
            match: ['mist-ward', 'camp kit', 'traveler\'s camp'],
            name: "⛺ Mist-Ward Traveler's Camp Kit (Wilderness True Long Rest)",
            category: "PERMANENT SURVIVAL GEAR • Wilderness Long Rest Shelter",
            origin: "Selected Barovian Outfitters (25–50 GP) or Challenging Craft (MIST-CAMP)",
            desc: "A rugged expedition shelter woven from pitch-sealed Dire Wolf hides, heavy waxed canvas, cedar perimeter stakes, a smokeless trench brazier, and silver-salt wolfbane cord.",
            effect: "• <strong>True Wilderness Long Rest (10 Min Setup • 4–6 Travelers):</strong> Allows the party to complete a <strong>full uninterrupted True Long Rest</strong> outdoors in the Svalich Woods or on the road (restoring 100% HP, Spell Slots, Sorcery Points, Superiority Dice, Help Tokens, &amp; clearing 1 Exhaustion level).<br>• <strong>Perimeter Ward &amp; Storm Cover:</strong> Grants <strong>+5 Group Stealth / Passive Perception</strong> against road patrols, chimes softly if beasts/undead cross within 30 ft, and grants <strong>Advantage on CON Saves</strong> vs freezing mountain weather.<br>• <em>Reusable permanent gear (must pitch on dry ground outside active dungeon rooms).</em>"
        },
        {
            match: ['elixir of health', 'elixir of life'],
            name: "🍷 Elixir of Health (Legendary Revival)",
            category: "LEGENDARY REVIVAL POTION • Extra Rare (5,000 GP / 15,000 GP Royal Market)",
            origin: "Martikov Secret Heirloom Stash (Blue Water Inn N2q — Non-Craftable)",
            desc: "A glowing golden-crimson draught radiating uncorrupted vitality and divine restoration—an ultra-rare relic smuggled into Barovia before the Mists closed.",
            effect: "• <strong>Action (Within 1 Minute of Death):</strong> Administer to a creature that has died within the last minute. The creature returns to life with <strong>Hit Points equal to half of its maximum HP (50%)</strong>, and any <strong>severed limbs are knit back together</strong>!<br>• <strong>Aftermath Penalty:</strong> The revived creature suffers a <strong>-2 penalty to all attack rolls, saving throws, and ability checks</strong> until finishing a Long Rest.<br>• <strong>Worth:</strong> <code>5,000 GP</code> Base / <code>15,000 GP</code> Royal Market (Non-Craftable)."
        },
        {
            match: ['antitoxin'],
            name: "🧪 Barovian Antitoxin Tonic",
            category: "CRAFTED CONSUMABLE • Unlock Code: WOLFBANE",
            origin: "Crafted (2x Medicinal Herbs + 1x Svalich Wolfbane Root) or Apothecary (5 GP)",
            desc: "A sharp, pine-bitter purple draught brewed to neutralize swamp serpents, spider venom, and hag toxins.",
            effect: "• <strong>Action to Drink (1-Hour Duration):</strong> Grants <strong>Advantage on Saving Throws against Poison</strong> (and against the Poisoned condition) for <strong>1 full hour</strong>."
        },
        {
            match: ['liquid silver'],
            name: "✨ Vial of Liquid Silver Coating",
            category: "CRAFTED TACTICAL COATING • Unlock Code: SILVER-COAT",
            origin: "Crafted (1x Powdered Silver Dust + 1x Pine Pitch & Lamp Oil)",
            desc: "A swirling glass phial of pure silver filings suspended in amber pine resin oil.",
            effect: "• <strong>Bonus Action / Prep (1-Hour Duration):</strong> Coat <strong>1 melee weapon</strong> or up to <strong>10 firearm rounds/arrows</strong>. Coated strikes count as <strong>Silvered for 1 hour</strong>, bypassing the nonmagical B/P/S resistances &amp; immunities of Vampire Spawn, Werewolves, Wights, and Night Hags!"
        },
        {
            match: ['alchemist\'s fire'],
            name: "🔥 Alchemist's Fire Flask",
            category: "CRAFTED TACTICAL WEAPON • Unlock Code: BRIMSTONE",
            origin: "Crafted (1x Brimstone Sulfur + 1x Pine Pitch & Lamp Oil) / Area V1",
            desc: "A wax-sealed clay flask packed with volatile sulfur pitch that bursts into clinging flame on impact.",
            effect: "• <strong>Action (Ranged Attack, 20 ft):</strong> On a hit, the target takes <strong>1d4 Fire damage at the start of each of its turns</strong> until a creature uses an Action to pass a <strong>DC 10 DEX Check</strong> to extinguish the flames."
        },
        {
            match: ['phosphor'],
            name: "💣 Alchemical Phosphor & Smoke Flash-Bomb",
            category: "CRAFTED TACTICAL GADGET • Unlock Code: PHOSPHOR / Area V1",
            origin: "Crafted (1x Brimstone + 1x Silver Dust + 1x Catalyst) / Ezmerelda's Wagon V1",
            desc: "A brass-seamed glass sphere packed with white phosphorus, magnesium flakes, and powdered silver.",
            effect: "• <strong>Action (Throw 30 ft, 10-ft Radius):</strong> Targets make a <strong>DC 13 DEX or CON Save</strong> or take <strong>2d6 Fire/Radiant damage</strong> and are <strong>Blinded until the end of their next turn</strong> (also illuminates magical blood-mist &amp; invisible foes!)."
        },
        {
            match: ['smoke bomb'],
            name: "💨 Ash-Cloud Smoke Bomb",
            category: "CRAFTED TACTICAL GADGET • Unlock Code: ASH-CLOUD",
            origin: "Crafted (1x Brimstone Sulfur + 1x Medicinal Herbs)",
            desc: "A tight gray clay sphere filled with dry herbs and sulfur dust.",
            effect: "• <strong>Action (Throw up to 30 ft):</strong> Bursts into a <strong>15-foot-radius cloud of thick smoke</strong> lasting <strong>1 minute</strong> (or 1 round in strong wind). The area is <strong>Heavily Obscured</strong>, breaking enemy sightlines and covering Stealth or retreats."
        },
        {
            match: ['sun-ash'],
            name: "☀️ Sun-Ash Repellent Balm",
            category: "CRAFTED SACRED UNGUENT • Unlock Code: SUN-ASH",
            origin: "Crafted (1x Moonpetal + 1x Silver Dust + 1x Pure Spring Water)",
            desc: "A luminous pale-gold salve infused with dawn-remembering Moonpetal and consecrated silver.",
            effect: "• <strong>Bonus Action / Prep (10-Minute Duration):</strong> Coat <strong>1 weapon</strong> or <strong>6 firearm rounds</strong>. Hits deal an extra <strong>+1d4 Radiant damage</strong> for 10 minutes!"
        },
        {
            match: ['potion of superior healing'],
            name: "🧪 Potion of Superior Healing",
            category: "RARE HEAL CONSUMABLE • Unlock Code: MOONPETAL",
            origin: "Crafted (4x Herbs + 2x Catalyst + 1x Moonpetal) or Abbey S13 (45 GP)",
            desc: "A glowing scarlet elixir distilled from rare Moonpetal petals and concentrated alembic salts.",
            effect: "• <strong>Bonus Action (Self) / Action (Ally):</strong> Restores <strong>8d4 + 8 Hit Points (Avg 28 HP)</strong>—any overflow above Max HP channels into Temporary HP!"
        },
        {
            match: ['treated pelt', 'dire-pelt', 'waxed canvas'],
            name: "🐺 Treated Dire-Pelt & Waxed Canvas Bundle",
            category: "CRAFTING MATERIAL • Hunt (DC 13 Survival) / Shop (4–6 GP)",
            origin: "Dire Wolf Skinning, Ruined Coach Tarps, Bildrath's E1, Tser Pool G & Arasek N5",
            desc: "Heavy double-stitched waxed sailcloth layered with thick gray Dire Wolf hide.",
            effect: "• <strong>Crafting Ingredient:</strong> Requires <code>2x</code> bundles (plus Pine Pitch, Wolfbane &amp; Silver Dust) to craft a <strong>⛺ Mist-Ward Traveler's Camp Kit</strong> (<code>MIST-CAMP</code>).",
            isCraftableReagent: true
        },
        {
            match: ['alchemical catalyst', 'catalyst'],
            name: "⚗️ Alchemical Catalyst (Distilled Alembic Salt)",
            category: "RARE CRAFTING MATERIAL • 25–40 GP / Arcane Labs",
            origin: "Old Bonegrinder Lab, Wachterhaus Cellar, Vallaki Apothecary & Abbey S13",
            desc: "Crystalline crimson alembic salts that violently concentrate ordinary herbal infusions.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>🧪 Potion of Greater Healing</strong> (<code>GREATER-HEAL</code>), <strong>💣 Phosphor Flash-Bomb</strong> (<code>PHOSPHOR</code>), and <strong>🧪 Potion of Superior Healing</strong> (<code>MOONPETAL</code>).",
            isCraftableReagent: true
        },
        {
            match: ['silver dust'],
            name: "✨ Powdered Silver Dust (Pouch)",
            category: "UNCOMMON CRAFTING MATERIAL • 15–25 GP (or 25 SP Filed)",
            origin: "Tser Pool Vistani (15 GP), Arasek Stockyard (20 GP), Bildrath's (25+ GP)",
            desc: "Fine moon-bright silver filings sealed inside waxed vellum.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>💧 Holy Water</strong> (<code>MORNINGLORD</code>), <strong>✨ Liquid Silver Coating</strong> (<code>SILVER-COAT</code>), <strong>💣 Phosphor Flash-Bomb</strong> (<code>PHOSPHOR</code>), <strong>⛺ Mist-Ward Camp Kit</strong> (<code>MIST-CAMP</code>), and <strong>☀️ Sun-Ash Balm</strong> (<code>SUN-ASH</code>).",
            isCraftableReagent: true
        },
        {
            match: ['wolfbane'],
            name: "🌱 Svalich Wolfbane Root",
            category: "COMMON FORAGE MATERIAL • DC 12 Nature / 2 GP",
            origin: "Svalich Woods Pine Ridges & Werewolf Trails",
            desc: "Pungent purple-hooded wildflower root hung over Barovian barn doors against wolves.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>🧪 Barovian Antitoxin Tonic</strong> (<code>WOLFBANE</code>) and <strong>⛺ Mist-Ward Camp Kit</strong> (<code>MIST-CAMP</code>).",
            isCraftableReagent: true
        },
        {
            match: ['sulfur', 'brimstone'],
            name: "🪨 Brimstone & Pitch Sulfur",
            category: "COMMON SHOP / SALVAGE MATERIAL • 3–5 GP",
            origin: "Vallaki Smithy, Blinsky's Workshop & Old Bonegrinder Kilns",
            desc: "Sharp yellow brimstone chunks smelling of struck flint and alchemical smoke.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>🔥 Alchemist's Fire Flask</strong> (<code>BRIMSTONE</code>), <strong>💨 Ash-Cloud Smoke Bomb</strong> (<code>ASH-CLOUD</code>), and <strong>💣 Phosphor Flash-Bomb</strong> (<code>PHOSPHOR</code>).",
            isCraftableReagent: true
        },
        {
            match: ['pitch oil', 'lamp oil'],
            name: "🛢️ Pine Pitch & Lamp Oil Flask",
            category: "COMMON SHOP / FORAGE MATERIAL • 5 SP–1 GP / DC 11 Survival",
            origin: "General Stores & Scarred Svalich Evergreens",
            desc: "Thick amber pine resin blended with lantern oil.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>🔥 Alchemist's Fire</strong> (<code>BRIMSTONE</code>), <strong>✨ Liquid Silver Coating</strong> (<code>SILVER-COAT</code>), and waterproofing <strong>⛺ Mist-Ward Camp Kit</strong> (<code>MIST-CAMP</code>).",
            isCraftableReagent: true
        },
        {
            match: ['moonpetal'],
            name: "🌸 Svalich Moonpetal Blossom",
            category: "VERY RARE DUSK FORAGE • DC 15 Nature",
            origin: "Drowned Ruins of Berez, Yester Hill & Lake Baratok at Dusk",
            desc: "Ghost-white luminescent petals that open only in misty twilight.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>🧪 Potion of Superior Healing</strong> (<code>MOONPETAL</code>) and <strong>☀️ Sun-Ash Repellent Balm</strong> (<code>SUN-ASH</code>).",
            isCraftableReagent: true
        },
        {
            match: ['spring water', 'mountain spring water'],
            name: "💧 Pure Mountain Spring Water (Unblessed Reagent)",
            category: "COMMON FORAGE MATERIAL • DC 10 Survival / 2 SP",
            origin: "Tser Falls, Luna River & White Sun Spring",
            desc: "Crystal-clear glacier melt free of Barovia's bog rot.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>💧 Morninglord Holy Water</strong> (<code>MORNINGLORD</code>) and <strong>☀️ Sun-Ash Balm</strong> (<code>SUN-ASH</code>).",
            isCraftableReagent: true
        },
        {
            match: ['linen wrap', 'salve jar'],
            name: "🧻 Clean Linen Wraps & Salve Jar",
            category: "CAMP MEDICAL SUPPLY • 2 SP",
            origin: "Village Homes, Blue Water Inn & Krezk Cottages",
            desc: "Freshly boiled white cloth strips sealed in beeswax salve.",
            effect: "• <strong>Camp Medical Utility:</strong> Lets any ally assist with crafting <strong>🩹 Field Bandages</strong> during a Short Rest, or double bandage yield on a <code>DC 14 Medicine</code> check.",
            isCraftableReagent: true
        },
        {
            match: ['monster trophy', 'spawn ash', 'wolf fang'],
            name: "🦇 Harvested Monster Trophy (Spawn Ash / Dire Wolf Fang)",
            category: "HUNTER HARVEST • DC 13 Survival / 10–25 GP Barter",
            origin: "Slain Vampire Spawn, Dire Wolves, Blights & Night Hags",
            desc: "Dark ichor vials, obsidian wolf fangs, and silver-charred vampire cinders.",
            effect: "• <strong>Barter Value:</strong> Trade to Vistani, Van Richten/Ezmerelda, or Vallaki occultists for <strong>10–25 GP</strong>, silvered ammo, or <strong>⚗️ Alchemical Catalysts</strong>.",
            isCraftableReagent: true
        }
    ];

    function lookupSharedItemLore(rawName) {
        if (!rawName) return null;
        const low = String(rawName).toLowerCase();
        for (const entry of SHARED_ITEM_LORE) {
            if (entry.match.some(m => low.includes(m))) {
                return entry;
            }
        }
        return null;
    }

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
    let customTagKind = 'weapon'; // 'weapon' | 'armor' | 'caster' | 'accessory' | 'consumable'
    let showPresetForm = false;
    let lastAppliedPresetName = null;

    // Live Firebase State (Realtime Database primary + Firestore fallback)
    let rtdb = null;
    let firestoreDb = null;
    let firebaseReady = false;
    let incomingTrades = [];
    let outgoingTrades = [];
    let unsubRtdbRef = null;
    let unsubRtdbHandler = null;
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
    function getEquipStorageKey() { return `cos_equip_${adapter.heroId}_${adapter.equipStorageVersion || 'v1'}`; }
    function getCustomGearKey() { return `cos_custom_gear_${adapter.heroId}_v1`; }
    function getClaimedCodesKey() { return `cos_claimed_codes_${adapter.heroId}_v1`; }
    function getCustomPresetsKey() { return `cos_presets_${adapter.heroId}_v1`; }
    function getUnlockedRecipesKey() { return `cos_unlocked_recipes_v1`; }
    function getFbUnlockedRecipesKey() { return `cos_fb_unlocked_recipes_v1`; }

    function getCustomPresets() {
        try {
            const raw = localStorage.getItem(getCustomPresetsKey());
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }

    function saveCustomPresets(list) {
        localStorage.setItem(getCustomPresetsKey(), JSON.stringify(list));
    }

    function getAllPresets() {
        const builtIn = (adapter.presets || []).map(p => ({ ...p, isCustom: false }));
        const custom = getCustomPresets().map((p, i) => ({ ...p, isCustom: true, customIdx: i }));
        return [...builtIn, ...custom];
    }

    function getUnlockedRecipeIds() {
        try {
            const raw = localStorage.getItem(getUnlockedRecipesKey());
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }

    function getFbUnlockedRecipeIds() {
        try {
            const raw = localStorage.getItem(getFbUnlockedRecipesKey());
            const arr = raw ? JSON.parse(raw) : [];
            return Array.isArray(arr) ? arr : [];
        } catch (e) { return []; }
    }

    function isRecipeUnlocked(recipe) {
        if (!recipe) return false;
        if (recipe.unlocked) return true;
        return getUnlockedRecipeIds().includes(recipe.id) || getFbUnlockedRecipeIds().includes(recipe.id);
    }

    function unlockRecipeByCode(rawCode) {
        const inp = document.getElementById('rpg-unlock-recipe-input');
        const code = String(rawCode !== undefined ? rawCode : (inp ? inp.value : '')).trim().toUpperCase();
        if (!code) return;
        const match = CRAFTING_RECIPES.find(r => r.unlockCode && r.unlockCode.toUpperCase() === code);
        if (!match) {
            adapter.log(`⚠️ <strong>Unknown Recipe Code:</strong> "${esc(code)}". Check the formula code given by the DM.`);
            return;
        }
        const unlocked = getUnlockedRecipeIds();
        if (!unlocked.includes(match.id)) {
            unlocked.push(match.id);
            localStorage.setItem(getUnlockedRecipesKey(), JSON.stringify(unlocked));
        }
        if (inp) inp.value = '';
        adapter.log(`🔓 <strong>Recipe Unlocked: ${esc(match.name)} (${esc(match.badge)})!</strong> Added permanently to your Crafting Workbench.`);
        applyEquipmentToSheet(true);
        renderCraftModal();
    }

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
        const activeSlots = getActiveSlots();
        const activeIds = new Set(activeSlots.map(s => s.id));
        Object.keys(eq).forEach(k => {
            if (k !== '_grip' && !activeIds.has(k)) {
                delete eq[k];
                changed = true;
            }
        });
        for (const s of activeSlots) {
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
        const activeSlots = getActiveSlots();
        for (const s of activeSlots) {
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
            if (meta.weaponTag) bonuses.equippedWeaponTags.push({ tag: meta.weaponTag, slot: s.id, grip: s.id === 'mainHand' && bonuses.mainHand2H ? '2h' : '1h', raw, meta });
            if (meta.grantsAbility) bonuses.equippedAbilities.push(meta.grantsAbility);
            if (meta.summary) bonuses.activePerks.push(`<strong>${esc(shortLabel(raw))}:</strong> ${esc(meta.summary)}`);
        }

        return bonuses;
    }

    function resolveWeaponCombatStats(raw, meta) {
        if (meta && meta.weaponStats) return meta.weaponStats;
        const low = String(raw || '').toLowerCase();
        // Auto-detect magic bonus (+1/+2/+3)
        let magic = 0;
        const mMatch = low.match(/\+(\d+)/);
        if (mMatch) magic = parseInt(mMatch[1]) || 0;
        // Default ability mod by hero (Piper DEX +2, Jacomir STR +3, Yvaine DEX +4)
        const heroAbil = adapter.heroId === 'yvaine' ? 4 : (adapter.heroId === 'jacomir' ? 3 : 2);
        const pb = 2;
        let dice = '1d6', dmgType = low.includes('silver') ? 'Silvered Slashing' : 'Slashing';
        let extraDice = '', extraType = '';
        if (low.includes('sunsword')) {
            magic = 2; dice = '1d8'; dmgType = 'Radiant'; extraDice = '1d8'; extraType = 'Radiant vs Undead';
        } else if (low.includes('blood spear')) {
            magic = 2; dice = '1d6'; dmgType = 'Piercing';
        } else if (low.includes('greatsword') || low.includes('vladimir')) {
            dice = '2d6'; dmgType = 'Slashing';
        } else if (low.includes('longsword') || low.includes('battleaxe') || low.includes('treebane')) {
            dice = '1d8'; dmgType = low.includes('silver') ? 'Silvered Slashing' : 'Slashing';
        } else if (low.includes('rapier') || low.includes('longbow') || low.includes('light crossbow')) {
            dice = '1d8'; dmgType = 'Piercing';
        } else if (low.includes('shortsword') || low.includes('scimitar') || low.includes('shortbow') || low.includes('handaxe') || low.includes('mace') || low.includes('spear') || low.includes('staff')) {
            dice = '1d6'; dmgType = (low.includes('mace') || low.includes('staff')) ? 'Bludgeoning' : 'Piercing';
        } else if (low.includes('dagger') || low.includes('knife') || low.includes('fan')) {
            dice = '1d4'; dmgType = low.includes('silver') ? 'Silvered Piercing' : 'Piercing';
        }
        return {
            atkBonus: heroAbil + pb + magic,
            dmgDice: dice,
            dmgBonus: heroAbil + magic,
            dmgType,
            extraDice,
            extraType
        };
    }

    function rollDiceExpr(expr) {
        const m = String(expr || '1d6').trim().match(/^(\d+)d(\d+)$/i);
        if (!m) return { count: 1, sides: 6, rolls: [1], sum: 1, max: 6 };
        const count = Math.max(1, parseInt(m[1]) || 1);
        const sides = Math.max(2, parseInt(m[2]) || 6);
        const rolls = [];
        let sum = 0;
        for (let i = 0; i < count; i++) {
            const r = Math.floor(Math.random() * sides) + 1;
            rolls.push(r);
            sum += r;
        }
        return { count, sides, rolls, sum, max: count * sides };
    }

    function rollDynamicWeaponAttack(invIdx) {
        const raw = adapter.getItems()[invIdx];
        if (!raw) return;
        const meta = getItemMeta(raw);
        const st = resolveWeaponCombatStats(raw, meta);
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + st.atkBonus;
        const name = shortLabel(raw);
        if (d20 === 20) {
            const base = rollDiceExpr(st.dmgDice);
            let critTotal = base.max + base.sum + st.dmgBonus;
            let extraHtml = '';
            if (st.extraDice) {
                const ex = rollDiceExpr(st.extraDice);
                critTotal += ex.max + ex.sum;
                extraHtml = ` + ${ex.max}+[${ex.rolls.join('+')}](${esc(st.extraType || 'Bonus')})`;
            }
            adapter.log(`🔥 <strong style="color:#facc15;">NAT 20 BRUTAL CRIT — ${esc(name)}!</strong> d20[<strong>20</strong>] + ${st.atkBonus} = <strong>${total} to Hit</strong>! Brutal Crit Damage: ${base.max} (Max) + [${base.rolls.join('+')}] + ${st.dmgBonus}${extraHtml} = <span style="color:#f87171; font-size:1.12rem; font-weight:800;">${critTotal} ${esc(st.dmgType)} Damage</span>!`);
            return;
        }
        const tag = d20 === 1 ? ' <strong style="color:#f87171;">(NAT 1 MISS!)</strong>' : '';
        adapter.log(`⚔️ <strong>${esc(name)} Attack:</strong> d20[<strong>${d20}</strong>] + ${st.atkBonus} = <span style="color:#fde68a; font-size:1.1rem; font-weight:800;">${total} to Hit</span>${tag}`);
    }

    function rollDynamicWeaponDamage(invIdx) {
        const raw = adapter.getItems()[invIdx];
        if (!raw) return;
        const meta = getItemMeta(raw);
        const st = resolveWeaponCombatStats(raw, meta);
        const base = rollDiceExpr(st.dmgDice);
        let total = base.sum + st.dmgBonus;
        let breakdown = `${st.dmgDice}[<strong>${base.rolls.join('+')}</strong>]${st.dmgBonus ? (st.dmgBonus > 0 ? ' + ' + st.dmgBonus : ' - ' + Math.abs(st.dmgBonus)) : ''}`;
        if (st.extraDice) {
            const ex = rollDiceExpr(st.extraDice);
            total += ex.sum;
            breakdown += ` + <span style="color:#fb923c;">${st.extraDice}[${ex.rolls.join('+')} ${esc(st.extraType || 'Bonus')}]</span>`;
        }
        adapter.log(`💥 <strong>${esc(shortLabel(raw))} Damage:</strong> ${breakdown} = <span style="color:#f87171; font-size:1.12rem; font-weight:800;">${total} ${esc(st.dmgType)} Damage</span>!`);
    }

    function renderDynamicWeaponCards(bonuses) {
        if (!adapter || !adapter.weaponsGridSelector) return;
        const grid = document.querySelector(adapter.weaponsGridSelector);
        if (!grid) return;
        grid.querySelectorAll('.rpg-dyn-weapon-card').forEach(el => el.remove());

        const nativeTags = new Set(adapter.nativeWeaponTags || []);
        const eq = bonuses.equippedMap || {};
        const activeSlots = getActiveSlots();
        ['mainHand', 'offHand', 'ranged'].forEach(slotId => {
            const key = eq[slotId];
            if (!key) return;
            const idx = findInventoryIndexByKey(key);
            if (idx === -1) return;
            const raw = adapter.getItems()[idx];
            const meta = getItemMeta(raw);
            if (meta.isShield) return;
            if (meta.weaponTag && nativeTags.has(meta.weaponTag)) return;
            if (adapter.heroId === 'yvaine' && slotId === 'offHand' && meta.isLegDagger) return;
            const slotObj = activeSlots.find(s => s.id === slotId);
            if (!slotObj) return;
            const st = resolveWeaponCombatStats(raw, meta);
            const dmgLabel = `${st.dmgDice}${st.dmgBonus ? (st.dmgBonus > 0 ? '+' + st.dmgBonus : st.dmgBonus) : ''}${st.extraDice ? ' +' + st.extraDice : ''}`;
            const card = document.createElement('div');
            card.className = 'action-card rpg-dyn-weapon-card';
            card.style.borderLeft = '3px solid #f59e0b';
            card.innerHTML = `
                <div class="action-header">
                    <div>
                        <div onclick="COS_RPG.openItemDetails(${idx})" style="cursor:pointer; color:#f8fafc;">
                            ${esc(shortLabel(raw))} <span style="font-size:0.68rem; color:var(--text-muted);">ℹ️</span>
                        </div>
                        <div style="font-size:0.66rem; font-weight:700; color:#fde68a;">Equipped in ${slotObj.label}${slotId === 'mainHand' && bonuses.mainHand2H ? ' (2-Handed)' : ''} • +${st.atkBonus} Hit • ${esc(dmgLabel)} ${esc(st.dmgType)}</div>
                    </div>
                    <span class="rpg-card-equipped-pill">WORN</span>
                </div>
                <div class="action-desc">${esc(meta.summary || 'Equipped weapon from Backpack.')}</div>
                <div class="action-btn-row" style="flex-wrap:wrap;">
                    <button type="button" class="btn-roll-action" onclick="COS_RPG.rollDynamicWeaponAttack(${idx})">Attack (+${st.atkBonus})</button>
                    <button type="button" class="btn-roll-action btn-roll-dmg" onclick="COS_RPG.rollDynamicWeaponDamage(${idx})">Damage (${esc(dmgLabel)})</button>
                    <button type="button" class="btn-act btn-act-pre" onclick="COS_RPG.unequipSlot('${slotId}')">Unequip</button>
                </div>
            `;
            grid.appendChild(card);
        });
    }

    function applyEquipmentToSheet(silent = false) {
        const bonuses = getGearBonuses();
        if (adapter && typeof adapter.onEquipmentChange === 'function') {
            adapter.onEquipmentChange(bonuses, bonuses.equippedMap);
        }
        renderDynamicWeaponCards(bonuses);
        renderHubPanel();
        renderHeaderBadges();
        if (document.getElementById('rpg-equip-modal')?.open) renderEquipModal();
        if (document.getElementById('rpg-backpack-modal')?.open) renderBackpackModal();
        syncHeroStateToFirebase();
    }

    function equipItemToSlot(slotId, itemKey, gripMode = null) {
        const eq = reconcileEquippedWithInventory();
        const raw = findInventoryRawByKey(itemKey);
        if (!raw) return;
        const meta = getItemMeta(raw);

        const activeSlots = getActiveSlots();

        // Check Attunement limit (max 3)
        if (meta.attune) {
            const currentBonuses = getGearBonuses();
            const replacingRaw = eq[slotId] ? findInventoryRawByKey(eq[slotId]) : null;
            const replacingAttuned = replacingRaw ? !!getItemMeta(replacingRaw).attune : false;
            const alreadyEquippedSame = activeSlots.some(s => eq[s.id] === itemKey);
            if (!alreadyEquippedSame && !replacingAttuned && currentBonuses.attunedCount >= 3) {
                adapter.log(`⚠️ <strong>Attunement Full (3/3)!</strong> Unequip an attuned magic item before attuning to <strong>${esc(shortLabel(raw))}</strong>.`);
                return;
            }
        }

        // If quantity is 1, remove from any other slot first
        const totalQty = adapter.getItems().reduce((acc, r) => normKey(r) === itemKey ? acc + parseItem(r).qty : acc, 0);
        const alreadyInSlots = activeSlots.filter(s => eq[s.id] === itemKey && s.id !== slotId);
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
        const slotObj = activeSlots.find(s => s.id === slotId) || { icon: '🛡️', label: slotId };
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

    function matchesPresetSlots(preset, eq) {
        if (!preset || !preset.slots) return false;
        const activeSlots = getActiveSlots();
        if (preset.isCustom) {
            for (const s of activeSlots) {
                const want = preset.slots[s.id] || '';
                const have = eq[s.id] || '';
                if (want !== have) return false;
            }
            if (preset.slots._grip && eq.mainHand && (eq._grip || '1h') !== preset.slots._grip) return false;
            return true;
        }
        const items = adapter.getItems();
        for (const [slotId, keyword] of Object.entries(preset.slots)) {
            if (slotId === '_grip') {
                if (eq.mainHand && (eq._grip || '1h') !== keyword) return false;
                continue;
            }
            if (!keyword) {
                if (eq[slotId]) return false;
                continue;
            }
            const curKey = eq[slotId];
            if (!curKey) return false;
            const curRaw = items.find(r => normKey(r) === curKey) || curKey;
            if (!curRaw.toLowerCase().includes(keyword.toLowerCase())) return false;
        }
        return true;
    }

    function getActivePresetInfo(eqOverride) {
        const eq = eqOverride || reconcileEquippedWithInventory();
        const all = getAllPresets();
        if (lastAppliedPresetName) {
            const preferred = all.find(p => p.label === lastAppliedPresetName && matchesPresetSlots(p, eq));
            if (preferred) return { label: preferred.label, isCustom: !!preferred.isCustom, preset: preferred };
        }
        // Prefer exact custom preset matches first, then built-in presets
        const customMatch = all.find(p => p.isCustom && matchesPresetSlots(p, eq));
        if (customMatch) return { label: customMatch.label, isCustom: true, preset: customMatch };
        const builtMatch = all.find(p => !p.isCustom && matchesPresetSlots(p, eq));
        if (builtMatch) return { label: builtMatch.label, isCustom: false, preset: builtMatch };
        return { label: 'Custom Loadout', isCustom: false, preset: null };
    }

    function applyLoadoutPreset(presetIdx) {
        const presets = getAllPresets();
        const p = presets[presetIdx];
        if (!p) return;
        const eq = reconcileEquippedWithInventory();
        const activeSlots = getActiveSlots();
        if (p.isCustom) {
            activeSlots.forEach(s => { delete eq[s.id]; });
            for (const [slotId, val] of Object.entries(p.slots)) {
                if (slotId === '_grip') {
                    eq._grip = val;
                    continue;
                }
                if (val && findInventoryRawByKey(val)) {
                    eq[slotId] = val;
                }
            }
        } else {
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
        }
        if (isMainHandTwoHanded(eq)) delete eq.offHand;
        lastAppliedPresetName = p.label;
        saveEquippedState(eq);
        adapter.log(`⚡ <strong>Loadout Swapped:</strong> ${esc(p.label)}!`);
        applyEquipmentToSheet();
    }

    function saveCurrentAsPreset() {
        const inp = document.getElementById('rpg-new-preset-name');
        const label = (inp ? inp.value : '').trim().slice(0, 36);
        if (!label) {
            adapter.log('⚠️ Enter a short name for your new equipment preset.');
            return;
        }
        const eq = reconcileEquippedWithInventory();
        const activeSlots = getActiveSlots();
        const snapshotSlots = { _grip: eq._grip || '1h' };
        const slotLabels = {};
        for (const s of activeSlots) {
            if (!eq[s.id]) continue;
            const raw = findInventoryRawByKey(eq[s.id]);
            if (raw) {
                snapshotSlots[s.id] = eq[s.id];
                slotLabels[s.label] = shortLabel(raw) + (s.id === 'mainHand' && isMainHandTwoHanded(eq) ? ' (2H)' : '');
            }
        }
        const list = getCustomPresets().filter(p => p.label.toLowerCase() !== label.toLowerCase());
        list.push({ label, slots: snapshotSlots, slotLabels });
        saveCustomPresets(list);
        lastAppliedPresetName = label;
        showPresetForm = false;
        adapter.log(`💾 <strong>Saved Equipment Preset:</strong> "${esc(label)}" (${Object.keys(slotLabels).length} slots) — included in Export Data!`);
        renderEquipModal();
    }

    function deleteCustomPreset(customIdx) {
        const list = getCustomPresets();
        if (customIdx < 0 || customIdx >= list.length) return;
        const removed = list.splice(customIdx, 1);
        saveCustomPresets(list);
        if (lastAppliedPresetName === removed[0]?.label) lastAppliedPresetName = null;
        adapter.log(`🗑️ Removed custom preset "${esc(removed[0]?.label || '')}".`);
        renderEquipModal();
    }

    // Quick equip from Backpack (picks best natural slot automatically)
    function quickToggleEquipByIndex(invIndex) {
        const items = adapter.getItems();
        const raw = items[invIndex];
        if (!raw) return;
        const key = normKey(raw);
        const eq = reconcileEquippedWithInventory();
        const activeSlots = getActiveSlots();
        const activeIds = new Set(activeSlots.map(s => s.id));
        const existingSlot = activeSlots.find(s => eq[s.id] === key);
        if (existingSlot) {
            unequipSlot(existingSlot.id);
            return;
        }
        const meta = getItemMeta(raw);
        const validSlots = (meta.slots || []).filter(sid => activeIds.has(sid));
        if (validSlots.length === 0) {
            openEquipModal('body');
            showCustomTagger = true;
            renderEquipModal();
            return;
        }
        // Pick first open valid slot, or fall back to primary valid slot
        let targetSlot = validSlots.find(sid => !eq[sid]) || validSlots[0];
        if (validSlots.includes('ring1') && eq.ring1 && !eq.ring2) targetSlot = 'ring2';
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
        // Lament lives permanently in the Ranged slot while Mercy & Less occupy Main Hand & Off-Hand;
        // swapping firearm stance should not overwrite equipped hand slots.
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
        else items[invIndex] = `${parsed.emoji}${newQty > 1 ? newQty + 'x ' : ''}${parsed.name}`.trim();
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
        } else if (act.type === 'alchemistsFire') {
            const d4 = Math.floor(Math.random() * 4) + 1;
            adapter.log(`🔥 <strong>Threw ${esc(shortLabel(raw))} (20 ft):</strong> Target takes <span style="color:#fb923c; font-size:1.08rem; font-weight:800;">${d4} Fire Damage</span> at the start of each of its turns until doused (<code>DC 10 DEX Check</code>)!`);
        } else if (act.type === 'phosphorBomb') {
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            adapter.log(`💣 <strong>Threw ${esc(shortLabel(raw))} (30 ft, 10-ft radius):</strong> 2d6[${d1}+${d2}] = <span style="color:#fde68a; font-size:1.08rem; font-weight:800;">${d1 + d2} Fire/Radiant Damage</span> + <strong>Blinded 1 turn</strong> (<code>DC 13 DEX/CON Save</code>; lights up blood-mist &amp; invisible foes!).`);
        } else if (act.type === 'utilityLog') {
            adapter.log(`⚗️ <strong>${esc(act.verb || 'Used')} ${esc(shortLabel(raw))}:</strong> ${esc(act.effect || act.label)}`);
        }
        applyEquipmentToSheet(true);
    }

    // =========================================================================
    // UNIFIED CRAFTING ENGINE
    // =========================================================================
    function matchesIngredient(itemName, keyword) {
        const low = String(itemName || '').toLowerCase();
        if (Array.isArray(keyword)) {
            return keyword.some(k => low.includes(String(k).toLowerCase()));
        }
        return low.includes(String(keyword || '').toLowerCase());
    }

    function countIngredientQty(keyword) {
        return adapter.getItems().reduce((sum, raw) => {
            const p = parseItem(raw);
            return matchesIngredient(p.name, keyword) ? sum + p.qty : sum;
        }, 0);
    }

    function countReadyRecipes() {
        return CRAFTING_RECIPES.filter(r => isRecipeUnlocked(r) && r.ingredients.every(ing => countIngredientQty(ing.keyword) >= ing.qty)).length;
    }

    function craftRecipe(recipeId) {
        const recipe = CRAFTING_RECIPES.find(r => r.id === recipeId);
        if (!recipe || !isRecipeUnlocked(recipe)) return;
        for (const ing of recipe.ingredients) {
            if (countIngredientQty(ing.keyword) < ing.qty) {
                adapter.log(`⚠️ <strong>Not enough ${esc(ing.label)}</strong> to craft ${esc(recipe.name)}!`);
                return;
            }
        }
        let items = adapter.getItems();
        for (const ing of recipe.ingredients) {
            let need = ing.qty;
            for (let i = items.length - 1; i >= 0 && need > 0; i--) {
                const p = parseItem(items[i]);
                if (matchesIngredient(p.name, ing.keyword)) {
                    if (p.qty <= need) {
                        need -= p.qty;
                        items.splice(i, 1);
                    } else {
                        const rem = p.qty - need;
                        items[i] = `${p.emoji}${rem > 1 ? rem + 'x ' : ''}${p.name}`.trim();
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
            items[existingIdx] = `${ex.emoji || incoming.emoji}${total > 1 ? total + 'x ' : ''}${ex.name}`.trim();
        } else if (addQty > 1) {
            items.unshift(`${incoming.emoji}${addQty}x ${incoming.name}`.trim());
        } else {
            items.unshift(`${incoming.emoji}${incoming.name}`.trim());
        }
    }

    // =========================================================================
    // 🔥 FIREBASE REALTIME DATABASE / FIRESTORE LIVE TRANSFERS + OFFLINE CODES
    // =========================================================================
    function getEffectiveFirebaseConfig() {
        const base = window.COS_FIREBASE_CONFIG || null;
        if (base && base.apiKey && base.projectId) return base;
        try {
            const override = localStorage.getItem('cos_firebase_override_v1');
            if (override) {
                const parsed = JSON.parse(override);
                if (parsed && parsed.apiKey && parsed.projectId) return parsed;
            }
        } catch (e) {}
        return base;
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
            if (cfg.databaseURL && typeof window.firebase.database === 'function') {
                rtdb = window.firebase.database();
                firebaseReady = true;
            } else if (typeof window.firebase.firestore === 'function') {
                firestoreDb = window.firebase.firestore();
                firebaseReady = true;
            } else {
                firebaseReady = false;
                return;
            }
            startTransferListeners();
        } catch (err) {
            console.warn('[COS_RPG] Firebase init skipped:', err);
            firebaseReady = false;
        }
    }

    function transfersRtdbRef() {
        const room = window.COS_CAMPAIGN_ROOM || 'curse_of_strahd_main';
        return rtdb.ref(`campaigns/${room}/transfers`);
    }

    function campaignRtdbRef(subPath) {
        const room = window.COS_CAMPAIGN_ROOM || 'curse_of_strahd_main';
        return rtdb.ref(`campaigns/${room}/${subPath}`);
    }

    let heroSyncTimer = null;
    let lastSyncedFingerprint = '';
    let isCapturingExports = false;

    function captureNativeExportStrings() {
        let sheetStr = '', notesStr = '';
        if (isCapturingExports || typeof navigator === 'undefined' || !navigator.clipboard) return { sheetStr, notesStr };
        isCapturingExports = true;
        const origWrite = navigator.clipboard.writeText;
        const origLog = window.logRoll;
        const origPrompt = window.prompt;
        try {
            window.logRoll = () => {};
            window.prompt = () => null;
            navigator.clipboard.writeText = (txt) => {
                const s = String(txt || '');
                if (s.includes('Notes Export')) notesStr = s;
                else if (s) sheetStr = s;
                return { then: () => ({ catch: () => {} }), catch: () => {} };
            };
            if (typeof window.__origExportSheetState === 'function') window.__origExportSheetState();
            else if (typeof window.exportSheetState === 'function') window.exportSheetState();
            if (typeof window.__origExportPlayerNotes === 'function') window.__origExportPlayerNotes();
            else if (typeof window.exportPlayerNotes === 'function') window.exportPlayerNotes();
        } catch (e) {} finally {
            navigator.clipboard.writeText = origWrite;
            if (origLog) window.logRoll = origLog;
            if (origPrompt) window.prompt = origPrompt;
            isCapturingExports = false;
        }
        return { sheetStr, notesStr };
    }

    function extractResourcesSummary(sheetExportStr) {
        if (!sheetExportStr) return '';
        const parts = sheetExportStr.split('|').map(s => s.trim());
        const keep = parts.filter(p =>
            /^(Sorcery Points|Tides of Chaos|Fierna Charm|Slots|Last Surge|Help|Superiority Dice|Second Wind|Action Surge|Heroic Inspiration|Stance|Lament|Revolvers|Spell Slots|Favored Enemy|Hunter's Sense|Whispering Grave|Active):/i.test(p)
        );
        return keep.join(' • ');
    }

    function buildHeroSnapshot() {
        const bonuses = getGearBonuses();
        const eq = bonuses.equippedMap || {};
        const activeSlots = getActiveSlots();
        const equippedLabels = {};
        activeSlots.forEach(s => {
            if (!eq[s.id]) return;
            const raw = findInventoryRawByKey(eq[s.id]);
            if (raw) {
                equippedLabels[s.label] = shortLabel(raw) + (s.id === 'mainHand' && bonuses.mainHand2H ? ' (2H)' : '');
            }
        });
        const wallet = adapter.getGold ? adapter.getGold() : { gp: 0, sp: 0 };
        const hpTxt = (document.getElementById('hp-disp')?.innerText || document.getElementById('cur-hp')?.innerText || '').replace(/\s+/g, ' ').trim();
        const acTxt = (document.getElementById('ac-disp')?.innerText || '').replace(/\s+/g, ' ').trim();
        let curHp = 10, maxHp = 10, tempHp = 0;
        const hpMatch = hpTxt.match(/(\d+)\s*(?:\(\+(\d+)T?\))?\s*\/\s*(\d+)/i);
        if (hpMatch) {
            curHp = parseInt(hpMatch[1]) || 0;
            tempHp = parseInt(hpMatch[2]) || 0;
            maxHp = parseInt(hpMatch[3]) || 10;
        }
        const activePreset = getActivePresetInfo(eq);
        const notesList = typeof window.getStoredNotes === 'function' ? window.getStoredNotes() : [];
        const { sheetStr, notesStr } = captureNativeExportStrings();
        const resSummary = extractResourcesSummary(sheetStr);

        return {
            heroId: adapter.heroId,
            heroName: adapter.heroName,
            heroEmoji: adapter.heroEmoji || '🛡️',
            hpDisplay: hpTxt,
            curHp,
            maxHp,
            tempHp,
            acDisplay: acTxt,
            gp: wallet.gp || 0,
            sp: wallet.sp || 0,
            preset: activePreset.label + (activePreset.isCustom ? ' [Custom]' : ''),
            equippedSlots: equippedLabels,
            customPresets: getCustomPresets().map(cp => ({ label: cp.label, slotLabels: cp.slotLabels || {} })),
            items: adapter.getItems(),
            notes: notesList,
            resourcesSummary: resSummary,
            sheetExportStr: sheetStr,
            notesExportStr: notesStr,
            updatedAt: Date.now()
        };
    }

    function syncHeroStateToFirebase(forceNow = false) {
        if (!firebaseReady || !rtdb || !adapter) return;
        if (heroSyncTimer) clearTimeout(heroSyncTimer);
        heroSyncTimer = setTimeout(() => {
            try {
                const snap = buildHeroSnapshot();
                const fp = JSON.stringify({
                    hp: snap.hpDisplay,
                    ac: snap.acDisplay,
                    gp: snap.gp,
                    sp: snap.sp,
                    pr: snap.preset,
                    eq: snap.equippedSlots,
                    it: snap.items,
                    nt: snap.notes,
                    rs: snap.resourcesSummary
                });
                if (!forceNow && fp === lastSyncedFingerprint) return;
                lastSyncedFingerprint = fp;
                campaignRtdbRef(`heroes/${adapter.heroId}/state`).set(snap).catch(() => {});
            } catch (e) {}
        }, forceNow ? 20 : 140);
    }

    function pushSyncedCheckpoint(silentToast = false) {
        if (!adapter) return;
        const snap = buildHeroSnapshot();
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const checkpointPayload = {
            ...snap,
            syncedAt: Date.now(),
            syncedTimeStr: timeStr
        };

        if (firebaseReady && rtdb) {
            campaignRtdbRef(`heroes/${adapter.heroId}/state`).set(snap).catch(() => {});
            campaignRtdbRef(`heroes/${adapter.heroId}/synced_checkpoint`).set(checkpointPayload).then(() => {
                const btn = document.getElementById('rpg-hdr-sync-btn');
                if (btn) {
                    btn.innerHTML = `✅ Synced (${timeStr})`;
                    btn.style.borderColor = '#22c55e';
                    btn.style.color = '#86efac';
                    setTimeout(() => {
                        if (btn) {
                            btn.innerHTML = `☁️ Sync to DM`;
                            btn.style.borderColor = 'rgba(52, 211, 153, 0.55)';
                            btn.style.color = '#6ee7b7';
                        }
                    }, 4000);
                }
                if (!silentToast) {
                    const combined = [snap.sheetExportStr, snap.notesExportStr].filter(Boolean).join('\n');
                    if (combined && navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(combined).catch(() => {});
                    }
                    adapter.log(`☁️ <strong>Synced Official Checkpoint to DM via Firebase (${esc(timeStr)})!</strong><br><small style="color:#86efac;">Your live Sheet State, Equipped Gear, Saved Presets &amp; Player Notes are now saved directly on the DM Screen (no copy-paste required!).</small>`);
                }
            }).catch(err => {
                if (!silentToast) adapter.log(`⚠️ Cloud Sync failed: ${esc(err.message)}`);
            });
        } else if (!silentToast) {
            const combined = [snap.sheetExportStr, snap.notesExportStr].filter(Boolean).join('\n');
            if (combined && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(combined).then(() => {
                    adapter.log(`📋 <strong>Copied Sheet State &amp; Player Notes to Clipboard!</strong>`);
                });
            }
        }
    }

    function applyRemoteHpDelta(delta) {
        if (!delta) return;
        if (delta > 0) {
            adapter.healHP(delta, false);
            adapter.log(`💚 <strong>DM Healed You:</strong> <span style="color:#4ade80; font-weight:800;">+${delta} HP</span>!`);
        } else {
            const dmg = Math.abs(delta);
            const hpInp = document.getElementById('hp-input');
            if (hpInp && typeof window.applyDamage === 'function') {
                const prev = hpInp.value;
                hpInp.value = String(dmg);
                window.applyDamage();
                hpInp.value = prev;
            }
            adapter.log(`⚔️ <strong>DM Applied Damage:</strong> <span style="color:#f87171; font-weight:800;">-${dmg} HP</span>!`);
        }
        syncHeroStateToFirebase(true);
    }

    function startCloudVaultAndCommandListeners() {
        if (!firebaseReady || !rtdb || !adapter) return;

        // 1. Live sync DM-created custom items (customMeta) into local recognition map
        campaignRtdbRef('custom_loot').on('value', snap => {
            const val = snap.val() || {};
            const map = getCustomGearMap();
            let changed = false;
            Object.values(val).forEach(entry => {
                if (!entry || !entry.name || !entry.customMeta) return;
                const k = normKey(entry.name);
                if (k && JSON.stringify(map[k]) !== JSON.stringify(entry.customMeta)) {
                    map[k] = entry.customMeta;
                    changed = true;
                }
            });
            if (changed) {
                saveCustomGearMap(map);
                applyEquipmentToSheet(true);
            }
        });

        // 2. Live sync DM remote recipe unlocks (supports both Unlock Live & Re-Lock!)
        campaignRtdbRef('unlocked_recipes').on('value', snap => {
            const val = snap.val() || {};
            const prevFb = getFbUnlockedRecipeIds();
            const nextFb = Object.keys(val).filter(k => !!val[k]);
            const curCode = getUnlockedRecipeIds();
            let addedTitle = null;
            nextFb.forEach(recId => {
                if (!prevFb.includes(recId) && !curCode.includes(recId)) {
                    const rObj = CRAFTING_RECIPES.find(r => r.id === recId);
                    if (rObj) addedTitle = `${rObj.name} (${rObj.badge})`;
                }
            });
            const removedIds = prevFb.filter(k => !nextFb.includes(k));
            if (removedIds.length > 0) {
                const prunedCode = curCode.filter(k => !removedIds.includes(k));
                localStorage.setItem(getUnlockedRecipesKey(), JSON.stringify(prunedCode));
            }
            localStorage.setItem(getFbUnlockedRecipesKey(), JSON.stringify(nextFb));
            if (addedTitle) {
                adapter.log(`🔓 <strong>DM Unlocked Crafting Recipe:</strong> <strong>${esc(addedTitle)}</strong> is now available in your Crafting Workbench!`);
            }
            if (addedTitle || removedIds.length > 0) {
                renderHubPanel();
                if (document.getElementById('rpg-craft-modal')?.open) renderCraftModal();
            }
        });

        // 3. Live DM Direct-Inject / Remote HP & Gold & Item Management commands
        const cmdRef = campaignRtdbRef(`heroes/${adapter.heroId}/dm_commands`);
        cmdRef.on('value', snap => {
            const val = snap.val();
            if (!val || typeof val !== 'object') return;
            Object.entries(val).forEach(([cmdId, cmd]) => {
                if (!cmd || cmd.executed) return;
                cmdRef.child(cmdId).remove().then(() => {
                    if (cmd.action === 'inject_item' && cmd.itemRaw) {
                        const items = adapter.getItems();
                        addRawItemToList(items, cmd.itemRaw, cmd.qty || 1);
                        adapter.saveItems(items);
                        if (cmd.customMeta) {
                            const map = getCustomGearMap();
                            map[normKey(cmd.itemRaw)] = cmd.customMeta;
                            saveCustomGearMap(map);
                        }
                        applyEquipmentToSheet(true);
                        adapter.log(`🎁 <strong>DM Added to Your Backpack:</strong> <strong>${cmd.qty > 1 ? cmd.qty + 'x ' : ''}${esc(shortLabel(cmd.itemRaw))}</strong>${cmd.note ? ` <em>("${esc(cmd.note)}")</em>` : ''}!`);
                    } else if (cmd.action === 'inject_gold') {
                        adapter.addGold(cmd.gp || 0, cmd.sp || 0, cmd.note || 'DM Grant');
                        syncHeroStateToFirebase(true);
                        adapter.log(`💰 <strong>DM Granted Gold:</strong> <strong>+${cmd.gp || 0} GP${cmd.sp ? ', +' + cmd.sp + ' SP' : ''}</strong>!`);
                    } else if (cmd.action === 'spend_gold') {
                        adapter.spendGold(cmd.gp || 0, cmd.sp || 0, cmd.note || 'DM Deduct');
                        syncHeroStateToFirebase(true);
                        adapter.log(`💸 <strong>DM Deducted Gold:</strong> <strong>-${cmd.gp || 0} GP${cmd.sp ? ', -' + cmd.sp + ' SP' : ''}</strong>!`);
                    } else if (cmd.action === 'adjust_hp') {
                        applyRemoteHpDelta(parseInt(cmd.delta) || 0);
                    } else if (cmd.action === 'remove_item' && typeof cmd.invIndex === 'number') {
                        const items = adapter.getItems();
                        if (items[cmd.invIndex]) {
                            const removed = items.splice(cmd.invIndex, 1);
                            adapter.saveItems(items);
                            applyEquipmentToSheet(true);
                            adapter.log(`🛡️ <strong>DM Removed Item:</strong> ${esc(shortLabel(removed[0]))}`);
                        }
                    } else if (cmd.action === 'request_checkpoint') {
                        pushSyncedCheckpoint(true);
                    } else if (cmd.action === 'reset_sheet_baseline') {
                        resetSheetToOfficialBaseline(true);
                    }
                }).catch(() => {});
            });
        });
    }

    function resetSheetToOfficialBaseline(skipConfirm = false) {
        if (!skipConfirm && typeof window.confirm === 'function') {
            const ok = window.confirm(`Reset ${adapter.heroName}'s sheet (HP, Slots/Ammo, Gold Purse, Backpack Inventory, Equipped Gear, Custom Presets & Player Notes) back to the official Session 1 baseline?`);
            if (!ok) return;
        }
        try {
            if (typeof window.resetHP === 'function') window.resetHP();
            // Jacomir's Session 1 end baseline is 23/31 HP
            if (adapter.heroId === 'jacomir') {
                const hpInp = document.getElementById('hp-input');
                if (hpInp && typeof window.applyDamage === 'function') {
                    hpInp.value = '8';
                    window.applyDamage();
                    hpInp.value = '';
                }
            }
            if (typeof window.resetGoldPurse === 'function') window.resetGoldPurse();
            if (typeof window.clearGoldHistory === 'function') window.clearGoldHistory();
            if (typeof window.resetPlayerNotes === 'function') window.resetPlayerNotes();
            adapter.resetItems();
            localStorage.removeItem(getEquipStorageKey());
            localStorage.removeItem(getCustomGearKey());
            localStorage.removeItem(getCustomPresetsKey());
            lastAppliedPresetName = null;
            applyEquipmentToSheet(true);
            pushSyncedCheckpoint(true);
            adapter.log(`🔄 <strong>Sheet Reset to Official Session 1 Baseline!</strong> All HP, Resources, Gold Purse, Backpack Inventory, Equipped Gear, Presets &amp; Player Notes restored and synced to Firebase.`);
        } catch (e) {
            console.warn('[COS_RPG] Reset error:', e);
        }
    }

    function transfersCol() {
        const room = window.COS_CAMPAIGN_ROOM || 'curse_of_strahd_main';
        return firestoreDb.collection('campaigns').doc(room).collection('transfers');
    }

    function handleIncomingOutgoingUpdate(nextIncoming, nextOutgoing) {
        const brandNew = nextIncoming.filter(t => !lastKnownIncomingIds.has(t.id));
        incomingTrades = nextIncoming;
        outgoingTrades = nextOutgoing;
        lastKnownIncomingIds = new Set(nextIncoming.map(t => t.id));
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
    }

    function startTransferListeners() {
        if (!firebaseReady || !adapter) return;
        if (unsubRtdbRef && unsubRtdbHandler) {
            unsubRtdbRef.off('value', unsubRtdbHandler);
            unsubRtdbRef = null;
            unsubRtdbHandler = null;
        }
        if (unsubIncoming) unsubIncoming();
        if (unsubOutgoing) unsubOutgoing();
        if (unsubDeclined) unsubDeclined();

        // Primary: Firebase Realtime Database (dnd-curse-of-strahd-467ea-default-rtdb)
        if (rtdb) {
            const ref = transfersRtdbRef();
            const handler = snap => {
                const val = snap.val() || {};
                const nextIncoming = [];
                const nextOutgoing = [];
                const nowMs = Date.now();
                const STALE_MS = 24 * 60 * 60 * 1000; // 24 hours
                Object.entries(val).forEach(([id, d]) => {
                    if (!d || typeof d !== 'object') return;
                    // Auto-prune completed/cancelled/refunded transfers or 24h-expired DM drops
                    if (
                        d.status === 'accepted' ||
                        d.status === 'cancelled' ||
                        (d.status === 'declined' && (d.refunded || d.fromId === 'dm')) ||
                        (d.status === 'pending' && d.fromId === 'dm' && d.createdAt && (nowMs - d.createdAt > STALE_MS))
                    ) {
                        ref.child(id).remove().catch(() => {});
                        return;
                    }
                    const rec = { id, ...d };
                    if (d.toId === adapter.heroId && d.status === 'pending') {
                        nextIncoming.push(rec);
                    }
                    if (d.fromId === adapter.heroId && d.status === 'pending') {
                        nextOutgoing.push(rec);
                    }
                    if (d.fromId === adapter.heroId && d.status === 'declined' && !d.refunded) {
                        ref.child(id).child('refunded').transaction(cur => cur ? undefined : true, (err, committed) => {
                            if (!err && committed) {
                                refundTransferPayload(d, `↩️ ${d.toName} declined your transfer — returned safely!`);
                                ref.child(id).remove().catch(() => {});
                            }
                        });
                    }
                });
                handleIncomingOutgoingUpdate(nextIncoming, nextOutgoing);
            };
            ref.on('value', handler, err => console.warn('[COS_RPG] RTDB listener error:', err));
            unsubRtdbRef = ref;
            unsubRtdbHandler = handler;
            startCloudVaultAndCommandListeners();
            syncHeroStateToFirebase();
            return;
        }

        if (!firestoreDb) return;
        // Fallback: Cloud Firestore
        unsubIncoming = transfersCol()
            .where('toId', '==', adapter.heroId)
            .where('status', '==', 'pending')
            .onSnapshot(snap => {
                const nextList = [];
                snap.forEach(doc => nextList.push({ id: doc.id, ...doc.data() }));
                handleIncomingOutgoingUpdate(nextList, outgoingTrades);
            }, err => console.warn('[COS_RPG] Incoming listener error:', err));

        unsubOutgoing = transfersCol()
            .where('fromId', '==', adapter.heroId)
            .where('status', '==', 'pending')
            .onSnapshot(snap => {
                const list = [];
                snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
                outgoingTrades = list;
                if (document.getElementById('rpg-trade-modal')?.open) renderTradeModal();
            }, err => console.warn('[COS_RPG] Outgoing listener error:', err));

        unsubDeclined = transfersCol()
            .where('fromId', '==', adapter.heroId)
            .where('status', '==', 'declined')
            .onSnapshot(snap => {
                snap.forEach(doc => {
                    const d = doc.data();
                    if (d.refunded) {
                        doc.ref.delete().catch(() => {});
                        return;
                    }
                    doc.ref.update({ refunded: true }).then(() => {
                        refundTransferPayload(d, `↩️ ${d.toName} declined your transfer — returned safely!`);
                        doc.ref.delete().catch(() => {});
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

    function updateTransferDoc(tradeId, fields) {
        if (rtdb) {
            return transfersRtdbRef().child(tradeId).update(fields);
        }
        if (firestoreDb) {
            return transfersCol().doc(tradeId).update(fields);
        }
        return Promise.reject(new Error('No live database connected'));
    }

    function removeTransferDoc(tradeId) {
        if (rtdb) {
            return transfersRtdbRef().child(tradeId).remove();
        }
        if (firestoreDb) {
            return transfersCol().doc(tradeId).delete();
        }
        return Promise.reject(new Error('No live database connected'));
    }

    function acceptLiveTransfer(tradeId) {
        const tr = incomingTrades.find(t => t.id === tradeId);
        if (!tr) return;
        removeTransferDoc(tradeId).then(() => {
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
        if (!tr) return;
        if (tr.fromId === 'dm') {
            removeTransferDoc(tradeId).then(() => {
                adapter.log(`❌ <strong>Declined transfer</strong> from ${esc(tr.fromName)}.`);
            }).catch(() => {});
            return;
        }
        updateTransferDoc(tradeId, {
            status: 'declined',
            refunded: false,
            resolvedAt: Date.now()
        }).then(() => {
            adapter.log(`❌ <strong>Declined transfer</strong> from ${esc(tr.fromName)}.`);
        }).catch(() => {});
    }

    function cancelOutgoingTransfer(tradeId) {
        const tr = outgoingTrades.find(t => t.id === tradeId);
        if (!tr) return;
        removeTransferDoc(tradeId).then(() => {
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

    function pushLiveTransferRecord(record) {
        if (rtdb) {
            return transfersRtdbRef().push(record);
        }
        if (firestoreDb) {
            return transfersCol().add(record);
        }
        return Promise.reject(new Error('No live database'));
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
            const sendQty = Math.min(Math.max(1, qty), parsed.qty);
            const remaining = parsed.qty - sendQty;
            if (remaining <= 0) items.splice(selIdx, 1);
            else items[selIdx] = `${parsed.emoji}${remaining > 1 ? remaining + 'x ' : ''}${parsed.name}`.trim();
            adapter.saveItems(items);

            const customMap = getCustomGearMap();
            const cMeta = customMap[normKey(raw)] || null;
            payload.kind = 'item';
            payload.itemRaw = `${parsed.emoji}${parsed.name}`.trim();
            payload.qty = sendQty;
            payload.customMeta = cMeta;
            applyEquipmentToSheet(true);
        }

        if (firebaseReady && !forceOfflineCode) {
            pushLiveTransferRecord({
                ...payload,
                status: 'pending',
                refunded: false,
                createdAt: Date.now()
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

        // Inject Header Quick Gear, Backpack (slightly bigger), followed by Cloud Sync to DM, Reset, and Portal on the very right
        const badgeGroup = document.querySelector('.pill-badge-group');
        if (badgeGroup && !document.getElementById('rpg-hdr-equip-btn')) {
            const portalLink = badgeGroup.querySelector('a[href*="index.html"]');

            const equipBtn = document.createElement('button');
            equipBtn.type = 'button';
            equipBtn.id = 'rpg-hdr-equip-btn';
            equipBtn.className = 'rpg-header-btn rpg-btn-primary-lg';
            equipBtn.onclick = () => openEquipModal();
            equipBtn.innerHTML = `🛡️ Gear <span class="rpg-badge-count" id="rpg-hdr-equip-cnt">0</span>`;

            const bpBtn = document.createElement('button');
            bpBtn.type = 'button';
            bpBtn.id = 'rpg-hdr-bp-btn';
            bpBtn.className = 'rpg-header-btn rpg-btn-backpack rpg-btn-primary-lg';
            bpBtn.onclick = () => openBackpackModal();
            bpBtn.innerHTML = `🎒 Bag <span class="rpg-badge-count" id="rpg-hdr-bp-cnt">0</span>`;

            const syncBtn = document.createElement('button');
            syncBtn.type = 'button';
            syncBtn.id = 'rpg-hdr-sync-btn';
            syncBtn.className = 'rpg-header-btn';
            syncBtn.style.cssText = 'background:linear-gradient(135deg,#064e3b,#0f172a); border-color:rgba(52,211,153,0.55); color:#6ee7b7;';
            syncBtn.title = 'Save official Session Checkpoint (Vitals, Slots, Gear, Presets & Player Notes) directly to the DM Screen via Firebase';
            syncBtn.onclick = () => pushSyncedCheckpoint(false);
            syncBtn.innerHTML = `☁️ Sync to DM`;

            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.id = 'rpg-hdr-reset-btn';
            resetBtn.className = 'rpg-header-btn';
            resetBtn.style.cssText = 'background:#1e293b; border-color:rgba(248,113,113,0.45); color:#fca5a5;';
            resetBtn.title = 'Undo test changes & reset sheet (HP, Gold, Backpack, Equipped Gear, Presets & Notes) to official Session 1 baseline';
            resetBtn.onclick = () => resetSheetToOfficialBaseline(false);
            resetBtn.innerHTML = `🔄 Reset`;

            // Order left-to-right: [🛡️ Gear (bigger)] [🎒 Bag (bigger)] [☁️ Sync to DM] [🔄 Reset] [🏰 Portal (very right)]
            badgeGroup.insertBefore(resetBtn, badgeGroup.firstChild);
            badgeGroup.insertBefore(syncBtn, badgeGroup.firstChild);
            badgeGroup.insertBefore(bpBtn, badgeGroup.firstChild);
            badgeGroup.insertBefore(equipBtn, badgeGroup.firstChild);
            if (portalLink) {
                portalLink.className = 'rpg-header-btn';
                portalLink.style.cssText = 'background:#0f172a; border-color:#334155; color:#cbd5e1; text-decoration:none;';
                badgeGroup.appendChild(portalLink);
            }
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
                            <div style="display:flex; gap:6px; flex-wrap:wrap;">
                                <button type="button" class="rpg-mini-btn" onclick="COS_RPG.openBackpackModal()">Open Full Backpack</button>
                                <button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.exportEquippedGear()">Export Gear &amp; Presets</button>
                            </div>
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

    function formatTradeItemDisplay(itemRaw, qty) {
        const p = parseItem(itemRaw || '');
        const cleanName = `${p.emoji}${p.name}`.trim() || String(itemRaw || '');
        const n = Math.max(1, parseInt(qty) || p.qty || 1);
        return n > 1 ? `${n}x ${cleanName}` : cleanName;
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
                : `<strong>${esc(formatTradeItemDisplay(tr.itemRaw, tr.qty))}</strong>`;
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
        const activeSlots = getActiveSlots();
        const chips = [];
        for (const s of activeSlots) {
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
                    ${p.emoji}${esc(meta.useAction.label)}${p.qty > 1 ? ` <span style="color:#6ee7b7; font-family:'JetBrains Mono',monospace;">(${p.qty}x)</span>` : ''}
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
                        <span class="rpg-badge-count">${bonuses.equippedCount}/${activeSlots.length}</span>
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
        const activeSlots = getActiveSlots();
        const curSlotObj = activeSlots.find(s => s.id === selectedSlot) || activeSlots[2];

        // Live Stat Pills + Active Preset + Custom Preset Builder
        const acTxt = document.getElementById('ac-disp')?.innerText || '--';
        const allPresets = getAllPresets();
        const activePreset = getActivePresetInfo(eq);
        const presetsHtml = allPresets.map((p, idx) => {
            const isAct = activePreset.preset && activePreset.label === p.label && !!activePreset.isCustom === !!p.isCustom;
            if (p.isCustom) {
                return `<span class="rpg-preset-wrap"><button type="button" class="rpg-preset-btn ${isAct ? 'preset-active' : ''}" onclick="COS_RPG.applyLoadoutPreset(${idx})">${esc(p.label)}</button><button type="button" class="rpg-preset-del" onclick="COS_RPG.deleteCustomPreset(${p.customIdx})" aria-label="Delete preset ${esc(p.label)}" title="Delete custom preset">✕</button></span>`;
            }
            return `<button type="button" class="rpg-preset-btn ${isAct ? 'preset-active' : ''}" onclick="COS_RPG.applyLoadoutPreset(${idx})">${esc(p.label)}</button>`;
        }).join('');

        const presetFormHtml = showPresetForm ? `
            <div class="rpg-preset-form">
                <input type="text" id="rpg-new-preset-name" class="rpg-input" style="flex:1; min-width:170px;" maxlength="36" placeholder="New preset name (e.g. Boss Fight, Stealth)...">
                <button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.saveCurrentAsPreset()">Save Preset</button>
                <button type="button" class="rpg-mini-btn" onclick="COS_RPG.togglePresetForm()">Cancel</button>
            </div>
        ` : '';

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
                    <small style="color:#64748b;">Found custom DM loot? Click <strong>[Tag Custom]</strong> above to assign any item to this slot!</small>
                </div>
            `;
        } else {
            pickerItemsHtml = compatible.map(item => {
                const isEqHere = equippedKeyInSlot === item.key;
                const gripToggleHtml = (selectedSlot === 'mainHand' && item.meta.versatile)
                    ? `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('mainHand', '${esc(item.key).replace(/'/g, "\\'")}', '1h')">Equip 1H</button>
                       <button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('mainHand', '${esc(item.key).replace(/'/g, "\\'")}', '2h')">Equip 2H</button>`
                    : `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('${selectedSlot}', '${esc(item.key).replace(/'/g, "\\'")}')">Equip${item.meta.hands === 2 && selectedSlot === 'mainHand' ? ' (2H)' : ''}</button>`;

                const safeKeyAttr = esc(item.key).replace(/'/g, "\\'");
                return `
                    <div class="rpg-picker-item ${isEqHere ? 'is-equipped' : ''}">
                        <div class="rpg-picker-item-top">
                            <div>
                                <div class="rpg-picker-item-name">${esc(shortLabel(item.raw))}${item.meta.isCustom ? ' <span class="rpg-card-unequipped-pill" style="color:#fde68a; border-color:rgba(245,158,11,0.45);">CUSTOM</span>' : ''}</div>
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
                            ${item.meta.isCustom
                                ? `<button type="button" class="rpg-mini-btn btn-danger" onclick="COS_RPG.removeCustomGearTag('${safeKeyAttr}')" title="Remove custom tag and restore item's original behavior">Reset Tag</button>`
                                : ''}
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.openItemDetails(${item.idx})">Info</button>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Context-Aware Custom Gear Tagger & Builder (+ active custom overrides reset list)
        const untaggedOptions = items.map(r => `<option value="${esc(normKey(r))}">${esc(shortLabel(r))}</option>`).join('');
        const customMap = getCustomGearMap();
        const customEntries = Object.entries(customMap);
        const customListHtml = customEntries.length > 0 ? `
            <div style="border-top:1px solid #1e293b; padding-top:6px; margin-top:2px; display:flex; flex-direction:column; gap:4px;">
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="font-size:0.66rem; font-weight:800; color:#94a3b8; text-transform:uppercase;">Custom Tagged Items (${customEntries.length})</span>
                    <button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:22px; padding:1px 6px; font-size:0.65rem;" onclick="COS_RPG.clearAllCustomGearTags()">Reset All</button>
                </div>
                ${customEntries.map(([ck, cm]) => {
                    const rawFound = findInventoryRawByKey(ck);
                    const disp = rawFound ? shortLabel(rawFound) : ck;
                    const slotLbl = (cm.slots || []).map(sid => activeSlots.find(s => s.id === sid)?.label || sid).join('/') || cm.category || 'Custom';
                    const safeCk = esc(ck).replace(/'/g, "\\'");
                    return `
                        <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; background:#090e1a; border:1px solid #1e293b; border-radius:5px; padding:4px 7px;">
                            <div style="font-size:0.7rem; color:#e2e8f0; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
                                <strong>${esc(disp)}</strong> <span style="color:#94a3b8;">(${esc(slotLbl)}${cm.summary ? ' • ' + esc(cm.summary) : ''})</span>
                            </div>
                            <button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:22px; padding:1px 6px; font-size:0.65rem; flex-shrink:0;" onclick="COS_RPG.removeCustomGearTag('${safeCk}')">Reset</button>
                        </div>
                    `;
                }).join('')}
            </div>
        ` : '';

        let kindFieldsHtml = '';
        if (customTagKind === 'weapon') {
            const handSlotOpts = activeSlots.filter(s => s.group === 'hand').map(s =>
                `<option value="${s.id}" ${s.id === selectedSlot ? 'selected' : ''}>${s.icon} ${s.label}</option>`
            ).join('') + `<option value="both_1h">⚔️ Main or Off-Hand (1H)</option>`;
            const defAbil = adapter.heroId === 'yvaine' ? 4 : (adapter.heroId === 'jacomir' ? 3 : 2);
            kindFieldsHtml = `
                <div class="rpg-form-grid">
                    <label class="rpg-field-lbl">Weapon Slot
                        <select id="rpg-tag-slot" class="rpg-select">${handSlotOpts}</select>
                    </label>
                    <label class="rpg-field-lbl">Hands / Grip
                        <select id="rpg-tag-hands" class="rpg-select">
                            <option value="1">1-Handed</option>
                            <option value="2">2-Handed (Locks Off-Hand)</option>
                            <option value="versatile">Versatile (1H or 2H)</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Base Damage Dice
                        <select id="rpg-tag-wpn-dice" class="rpg-select">
                            <option value="1d4">1d4 (Dagger / Whip)</option>
                            <option value="1d6">1d6 (Shortsword / Staff / Revolver)</option>
                            <option value="1d8" selected>1d8 (Longsword / Rapier / Bow)</option>
                            <option value="1d10">1d10 (Halberd / Pike / 2H)</option>
                            <option value="1d12">1d12 (Greataxe / Heavy Rifle)</option>
                            <option value="2d6">2d6 (Greatsword / Maul)</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Damage Type
                        <select id="rpg-tag-wpn-type" class="rpg-select">
                            <option value="Slashing">Slashing</option>
                            <option value="Piercing">Piercing</option>
                            <option value="Bludgeoning">Bludgeoning</option>
                            <option value="Silvered Slashing">Silvered Slashing</option>
                            <option value="Silvered Piercing">Silvered Piercing</option>
                            <option value="Radiant">Radiant</option>
                            <option value="Fire">Fire</option>
                            <option value="Necrotic">Necrotic</option>
                            <option value="Cold">Cold</option>
                            <option value="Force">Force</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Total Attack Bonus (+Hit)
                        <input type="number" id="rpg-tag-wpn-atk" class="rpg-input" value="${defAbil + 2}" min="-2" max="18">
                    </label>
                    <label class="rpg-field-lbl">Flat Damage Bonus (+Mod)
                        <input type="number" id="rpg-tag-wpn-dmgmod" class="rpg-input" value="${defAbil}" min="-2" max="15">
                    </label>
                    <label class="rpg-field-lbl">Extra Elemental Dice (optional)
                        <select id="rpg-tag-wpn-extradice" class="rpg-select">
                            <option value="">None</option>
                            <option value="1d4|Fire">+1d4 Fire</option>
                            <option value="1d6|Fire">+1d6 Fire</option>
                            <option value="1d4|Radiant">+1d4 Radiant</option>
                            <option value="1d6|Radiant">+1d6 Radiant</option>
                            <option value="2d6|Radiant">+2d6 Radiant</option>
                            <option value="1d6|Necrotic">+1d6 Necrotic</option>
                            <option value="1d6|Cold">+1d6 Cold</option>
                            <option value="1d8|Force">+1d8 Force</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Requires Attunement?
                        <select id="rpg-tag-attune" class="rpg-select">
                            <option value="no">No</option>
                            <option value="yes">Yes (Uses 1/3 Slot)</option>
                        </select>
                    </label>
                </div>
                <label class="rpg-field-lbl">Weapon Mastery / Special Effect Note (optional)
                    <input type="text" id="rpg-tag-note" class="rpg-input" placeholder="e.g. Sap Mastery, Bypasses Undead Resistance, +2d6 Temp HP on Kill...">
                </label>
            `;
        } else if (customTagKind === 'caster') {
            kindFieldsHtml = `
                <div class="rpg-form-grid">
                    <label class="rpg-field-lbl">Equip Slot
                        <select id="rpg-tag-slot" class="rpg-select">
                            <option value="mainHand">⚔️ Main Hand (Staff / Wand / Rod)</option>
                            <option value="offHand">🛡️ Off-Hand (Vial / Focus)</option>
                            <option value="amulet">📿 Amulet (Arcane Talisman)</option>
                            <option value="body">🛡️ Body (Enchanted Caster Robe)</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">+Spell Save DC &amp; Spell Hit
                        <input type="number" id="rpg-tag-spell" class="rpg-input" value="1" min="0" max="5">
                    </label>
                    <label class="rpg-field-lbl">Bonus Fire/Spell Damage
                        <select id="rpg-tag-spellfire" class="rpg-select">
                            <option value="">None</option>
                            <option value="1d4">+1d4 Spell Damage</option>
                            <option value="1d4+1">+1d4+1 Fire (Red Robe)</option>
                            <option value="1d6">+1d6 Spell Damage</option>
                            <option value="1d8">+1d8 Spell Damage</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">+AC / +Saves Bonus
                        <input type="number" id="rpg-tag-ac" class="rpg-input" value="0" min="0" max="5">
                    </label>
                    <label class="rpg-field-lbl">Skill Advantage
                        <select id="rpg-tag-skilladv" class="rpg-select">
                            <option value="">None</option>
                            <option value="Arcana">Arcana</option>
                            <option value="Religion">Religion</option>
                            <option value="History">History</option>
                            <option value="Perception">Perception</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Requires Attunement?
                        <select id="rpg-tag-attune" class="rpg-select">
                            <option value="no">No</option>
                            <option value="yes">Yes (Uses 1/3 Slot)</option>
                        </select>
                    </label>
                </div>
                <label class="rpg-field-lbl">Granted Spells / Charges / Custom Perk
                    <input type="text" id="rpg-tag-note" class="rpg-input" placeholder="e.g. 1/LR Speak with Dead, +5 Sorcery Points on Short Rest...">
                </label>
            `;
        } else if (customTagKind === 'consumable') {
            kindFieldsHtml = `
                <div class="rpg-form-grid">
                    <label class="rpg-field-lbl">Consumable Effect
                        <select id="rpg-tag-cons-type" class="rpg-select">
                            <option value="heal">Restore Hit Points (Heal)</option>
                            <option value="holyWater">Radiant / Fire Splash Damage</option>
                            <option value="dreamPastry">Grant Temporary HP</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Dice Rolled
                        <select id="rpg-tag-cons-dice" class="rpg-select">
                            <option value="1|4">1d4 (Croissant / Snack)</option>
                            <option value="1|6">1d6 (Bandage / Salve)</option>
                            <option value="2|4">2d4</option>
                            <option value="2|6" selected>2d6 (Healing Potion / Holy Water)</option>
                            <option value="4|4">4d4 (Greater Healing)</option>
                            <option value="8|4">8d4 (Superior Healing)</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Flat Bonus (+HP)
                        <input type="number" id="rpg-tag-cons-bonus" class="rpg-input" value="1" min="0" max="20">
                    </label>
                    <label class="rpg-field-lbl">Pin to 1-Tap Quick-Belt?
                        <select id="rpg-tag-cons-qb" class="rpg-select">
                            <option value="yes">Yes (Show on Main Sheet)</option>
                            <option value="no">No (Backpack Only)</option>
                        </select>
                    </label>
                </div>
                <label class="rpg-field-lbl">Consumable Effect Note
                    <input type="text" id="rpg-tag-note" class="rpg-input" placeholder="e.g. Halts Vampire Regen, Advantage vs Poison 1 hr...">
                </label>
            `;
        } else {
            // 'armor' or 'accessory'
            const slotOpts = customTagKind === 'accessory'
                ? `<option value="amulet" ${selectedSlot === 'amulet' ? 'selected' : ''}>📿 Amulet / Neck</option>
                   <option value="ring1" ${selectedSlot === 'ring1' || selectedSlot === 'ring2' ? 'selected' : ''}>💍 Ring (Ring 1 / Ring 2)</option>`
                : activeSlots.filter(s => s.group === 'body' || s.id === 'offHand').map(s =>
                    `<option value="${s.id}" ${s.id === selectedSlot ? 'selected' : ''}>${s.icon} ${s.label}${s.id === 'offHand' ? ' (Shield)' : ''}</option>`
                ).join('');
            kindFieldsHtml = `
                <div class="rpg-form-grid">
                    <label class="rpg-field-lbl">Equip Slot
                        <select id="rpg-tag-slot" class="rpg-select">${slotOpts}</select>
                    </label>
                    <label class="rpg-field-lbl">+AC Bonus
                        <input type="number" id="rpg-tag-ac" class="rpg-input" value="1" min="-5" max="10">
                    </label>
                    <label class="rpg-field-lbl">+All Saving Throws Bonus
                        <input type="number" id="rpg-tag-saves" class="rpg-input" value="0" min="-5" max="10">
                    </label>
                    <label class="rpg-field-lbl">Base Armor AC (Body Armor Only)
                        <select id="rpg-tag-baseac" class="rpg-select">
                            <option value="0">None (Use +AC Bonus Above)</option>
                            <option value="12|full">12 + Full DEX (Studded Leather)</option>
                            <option value="14|2">14 + DEX max 2 (Breastplate)</option>
                            <option value="15|2">15 + DEX max 2 (Half Plate)</option>
                            <option value="16|0">16 Heavy (Chain Mail)</option>
                            <option value="18|0">18 Heavy (Full Plate)</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Skill Advantage
                        <select id="rpg-tag-skilladv" class="rpg-select">
                            <option value="">None</option>
                            <option value="Arcana">Arcana</option>
                            <option value="Stealth">Stealth</option>
                            <option value="Perception">Perception</option>
                            <option value="Athletics">Athletics</option>
                            <option value="Intimidation">Intimidation</option>
                        </select>
                    </label>
                    <label class="rpg-field-lbl">Requires Attunement?
                        <select id="rpg-tag-attune" class="rpg-select">
                            <option value="no">No</option>
                            <option value="yes">Yes (Uses 1/3 Slot)</option>
                        </select>
                    </label>
                </div>
                <label class="rpg-field-lbl">Custom Gear Perk / Resistance Note (optional)
                    <input type="text" id="rpg-tag-note" class="rpg-input" placeholder="e.g. Cold Resistance, 30ft Fly Speed, +2 Initiative...">
                </label>
            `;
        }

        const customTaggerHtml = showCustomTagger ? `
            <div class="rpg-custom-tagger">
                <div style="font-size:0.72rem; font-weight:800; color:#fde68a;">Customize Item Type &amp; Stats</div>
                <label class="rpg-field-lbl">1. Select Item from Backpack
                    <select id="rpg-tag-item" class="rpg-select">${untaggedOptions}</select>
                </label>
                <div>
                    <div style="font-size:0.65rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:4px;">2. Choose What Kind of Item It Is</div>
                    <div class="rpg-filter-pills">
                        <button type="button" class="rpg-filter-pill" aria-pressed="${customTagKind === 'weapon' ? 'true' : 'false'}" onclick="COS_RPG.setCustomTagKind('weapon')">⚔️ Weapon</button>
                        <button type="button" class="rpg-filter-pill" aria-pressed="${customTagKind === 'armor' ? 'true' : 'false'}" onclick="COS_RPG.setCustomTagKind('armor')">🛡️ Armor / Gear</button>
                        <button type="button" class="rpg-filter-pill" aria-pressed="${customTagKind === 'caster' ? 'true' : 'false'}" onclick="COS_RPG.setCustomTagKind('caster')">🔮 Caster Focus</button>
                        <button type="button" class="rpg-filter-pill" aria-pressed="${customTagKind === 'accessory' ? 'true' : 'false'}" onclick="COS_RPG.setCustomTagKind('accessory')">💍 Amulet / Ring</button>
                        <button type="button" class="rpg-filter-pill" aria-pressed="${customTagKind === 'consumable' ? 'true' : 'false'}" onclick="COS_RPG.setCustomTagKind('consumable')">🧪 Consumable</button>
                    </div>
                </div>
                ${kindFieldsHtml}
                <div style="display:flex; gap:6px; justify-content:flex-end;">
                    <button type="button" class="rpg-mini-btn" onclick="COS_RPG.toggleCustomTagger()">Cancel</button>
                    <button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.saveCustomGearTag()">Save${customTagKind === 'consumable' ? ' Consumable' : ' &amp; Equip'}</button>
                </div>
                ${customListHtml}
            </div>
        ` : '';

        const bodySlots = activeSlots.filter(s => s.group === 'body');
        const accSlot = activeSlots.find(s => s.id === 'amulet');
        const ringSlots = activeSlots.filter(s => s.group === 'ring');
        const handSlots = activeSlots.filter(s => s.group === 'hand');

        body.innerHTML = `
            <div class="rpg-equip-topstats">
                <div class="rpg-stat-pills">
                    <span class="rpg-stat-pill gold">Live AC: ${esc(acTxt)}</span>
                    <span class="rpg-stat-pill" style="border-color:#60a5fa; color:#bfdbfe;">Preset: ${esc(activePreset.label)}${activePreset.isCustom ? ' (Custom)' : ''}</span>
                    ${bonuses.saveBonus ? `<span class="rpg-stat-pill blue">Saves: +${bonuses.saveBonus}</span>` : ''}
                    ${bonuses.spellDcBonus ? `<span class="rpg-stat-pill purple">Spell DC/Hit: +${bonuses.spellDcBonus}</span>` : ''}
                    ${bonuses.spellFireBonus ? `<span class="rpg-stat-pill" style="border-color:#ef4444; color:#fca5a5;">Spell Fire: +${esc(bonuses.spellFireBonus)}</span>` : ''}
                    ${bonuses.skillAdv.length ? `<span class="rpg-stat-pill green">Adv: ${esc(bonuses.skillAdv.join(', '))}</span>` : ''}
                    <span class="rpg-stat-pill purple" title="D&D 5e Attunement Limit: You can bond with at most 3 powerful magic items at the same time (e.g. Cloak of Protection, Sunsword, Bloodwell Vial).">Attuned: ${bonuses.attunedCount} / 3</span>
                </div>
                <div class="rpg-presets-bar">
                    <span style="font-size:0.66rem; font-weight:800; color:#94a3b8;">PRESETS:</span>
                    ${presetsHtml}
                    <button type="button" class="rpg-mini-btn btn-use" style="min-block-size:28px;" onclick="COS_RPG.togglePresetForm()">+ Save Preset</button>
                </div>
                ${presetFormHtml}
            </div>

            <div class="rpg-equip-split">
                <!-- LEFT: PAPER-DOLL -->
                <div class="rpg-paperdoll-board">
                    <div class="rpg-doll-upper">
                        <div class="rpg-doll-col">
                            <div class="rpg-doll-col-title">Armor &amp; Attire (Head ➔ Feet)</div>
                            ${bodySlots.map(s => renderSlotBox(s, eq, bonuses)).join('')}
                        </div>
                        <div class="rpg-doll-col">
                            <div class="rpg-doll-col-title">Relics &amp; Jewelry</div>
                            ${accSlot ? renderSlotBox(accSlot, eq, bonuses) : ''}
                            <div class="rpg-rings-row">
                                ${ringSlots.map(s => renderSlotBox(s, eq, bonuses)).join('')}
                            </div>
                            <div class="rpg-active-bonuses-box" style="margin-top:auto;">
                                <div style="font-size:0.66rem; font-weight:800; color:#6ee7b7; text-transform:uppercase; margin-bottom:4px;">Active Equipped Perks</div>
                                ${bonuses.activePerks.length > 0
                                    ? bonuses.activePerks.map(p => `<div>• ${p}</div>`).join('')
                                    : '<div style="color:#64748b; font-style:italic;">Equip gear to activate passive bonuses!</div>'}
                            </div>
                        </div>
                    </div>

                    <div>
                        <div class="rpg-doll-col-title" style="margin-bottom:6px; display:flex; justify-content:space-between; align-items:center;">
                            <span>Combat Hands &amp; ${handSlots.length > 3 ? 'Holsters / Leg Sheath' : 'Ranged Holster'}</span>
                            ${mhVersatile ? `<button type="button" class="rpg-mini-btn" style="padding:1px 7px; min-block-size:22px; font-size:0.65rem;" onclick="COS_RPG.toggleMainHandGrip()">Grip: ${bonuses.mainHand2H ? '2-Handed' : '1-Handed'}</button>` : ''}
                        </div>
                        <div class="rpg-hands-row ${handSlots.length >= 4 ? 'hands-4' : ''}">
                            ${handSlots.map(s => renderSlotBox(s, eq, bonuses)).join('')}
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
        if (showPresetForm) {
            const pInp = document.getElementById('rpg-new-preset-name');
            if (pInp) {
                pInp.focus();
                pInp.addEventListener('keydown', e => {
                    if (e.key === 'Enter' && !e.isComposing) saveCurrentAsPreset();
                });
            }
        }
    }

    function saveCustomGearTag() {
        const key = document.getElementById('rpg-tag-item')?.value;
        if (!key) return;
        const raw = findInventoryRawByKey(key) || key;
        const note = (document.getElementById('rpg-tag-note')?.value || '').trim();
        const attune = document.getElementById('rpg-tag-attune')?.value === 'yes';

        let meta = null;
        let equipTargetSlot = null;

        if (customTagKind === 'weapon') {
            const slotVal = document.getElementById('rpg-tag-slot')?.value || 'mainHand';
            const handsVal = document.getElementById('rpg-tag-hands')?.value || '1';
            const dmgDice = document.getElementById('rpg-tag-wpn-dice')?.value || '1d8';
            const dmgType = document.getElementById('rpg-tag-wpn-type')?.value || 'Slashing';
            const atkBonus = parseInt(document.getElementById('rpg-tag-wpn-atk')?.value) || 5;
            const dmgBonus = parseInt(document.getElementById('rpg-tag-wpn-dmgmod')?.value) || 3;
            const extraRaw = document.getElementById('rpg-tag-wpn-extradice')?.value || '';
            const [extraDice, extraType] = extraRaw ? extraRaw.split('|') : ['', ''];

            const slots = slotVal === 'both_1h' ? ['mainHand', 'offHand'] : [slotVal];
            equipTargetSlot = slots[0];
            const summaryParts = [
                `${handsVal === '2' ? '2H' : (handsVal === 'versatile' ? 'Versatile' : '1H')} • +${atkBonus} Hit`,
                `${dmgDice}${dmgBonus ? (dmgBonus > 0 ? '+' + dmgBonus : dmgBonus) : ''} ${dmgType}`,
                extraDice ? `+${extraDice} ${extraType}` : '',
                note,
                attune ? 'Attune' : ''
            ].filter(Boolean);

            meta = {
                category: 'weapon',
                slots,
                hands: handsVal === '2' ? 2 : 1,
                versatile: handsVal === 'versatile',
                attune,
                isLegDagger: slots.includes('legSheath'),
                weaponStats: { atkBonus, dmgDice, dmgBonus, dmgType, extraDice, extraType },
                summary: summaryParts.join(' • ')
            };
        } else if (customTagKind === 'caster') {
            const slot = document.getElementById('rpg-tag-slot')?.value || 'mainHand';
            const spellBonus = parseInt(document.getElementById('rpg-tag-spell')?.value) || 0;
            const spellFireBonus = document.getElementById('rpg-tag-spellfire')?.value || null;
            const acBonus = parseInt(document.getElementById('rpg-tag-ac')?.value) || 0;
            const skillAdvVal = document.getElementById('rpg-tag-skilladv')?.value || '';
            equipTargetSlot = slot;
            const parts = [
                spellBonus ? `+${spellBonus} Spell DC & Hit` : '',
                spellFireBonus ? `+${spellFireBonus} Spell Dmg` : '',
                acBonus ? `+${acBonus} AC & Saves` : '',
                skillAdvVal ? `Adv ${skillAdvVal}` : '',
                note,
                attune ? 'Attune' : ''
            ].filter(Boolean);
            meta = {
                category: slot === 'body' ? 'armor' : (slot === 'amulet' ? 'accessory' : 'weapon'),
                slots: [slot],
                hands: 1,
                acBonus,
                saveBonus: acBonus,
                spellDcBonus: spellBonus,
                spellAtkBonus: spellBonus,
                spellFireBonus,
                skillAdv: skillAdvVal ? [skillAdvVal] : [],
                attune,
                summary: parts.join(' • ') || 'Arcane Focus'
            };
        } else if (customTagKind === 'consumable') {
            const cType = document.getElementById('rpg-tag-cons-type')?.value || 'heal';
            const [diceCnt, diceSides] = (document.getElementById('rpg-tag-cons-dice')?.value || '2|6').split('|').map(Number);
            const bonus = parseInt(document.getElementById('rpg-tag-cons-bonus')?.value) || 0;
            const qb = document.getElementById('rpg-tag-cons-qb')?.value !== 'no';
            const fStr = `${diceCnt}d${diceSides}${bonus ? '+' + bonus : ''}`;
            const sLbl = shortLabel(raw).replace(/^[^\w"]+/, '').split(' ').slice(0, 2).join(' ') || 'Item';
            meta = {
                category: 'consumable',
                slots: [],
                quickBelt: qb,
                useAction: cType === 'heal'
                    ? { type: 'heal', dice: diceCnt, sides: diceSides, bonus, verb: 'Used', label: `${sLbl} (${fStr})` }
                    : (cType === 'holyWater'
                        ? { type: 'holyWater', label: `${sLbl} (2d6 Rad)` }
                        : { type: 'dreamPastry', label: `${sLbl} (+1d6 Temp)` }),
                summary: `${cType === 'heal' ? `Heal ${fStr} HP` : (cType === 'holyWater' ? '2d6 Radiant Splash' : '+1d6 Temp HP')}${note ? ' • ' + note : ''}`
            };
        } else {
            // 'armor' or 'accessory'
            const slot = document.getElementById('rpg-tag-slot')?.value || 'body';
            const acBonus = parseInt(document.getElementById('rpg-tag-ac')?.value) || 0;
            const saveBonus = parseInt(document.getElementById('rpg-tag-saves')?.value) || 0;
            const baseAcRaw = document.getElementById('rpg-tag-baseac')?.value || '0';
            const skillAdvVal = document.getElementById('rpg-tag-skilladv')?.value || '';
            const slots = (slot === 'ring1' || slot === 'ring2') ? ['ring1', 'ring2'] : [slot];
            equipTargetSlot = slot;

            let baseAC = null, addDex = false, maxDex = null, armorWorn = false, heavyArmor = false;
            if (slot === 'body' && baseAcRaw !== '0') {
                const [bVal, dexMode] = baseAcRaw.split('|');
                baseAC = parseInt(bVal) || 12;
                armorWorn = true;
                if (dexMode === 'full') addDex = true;
                else if (dexMode === '2') { addDex = true; maxDex = 2; }
                else { heavyArmor = true; }
            }

            const parts = [
                baseAC ? `Base AC ${baseAC}` : '',
                acBonus ? `${acBonus > 0 ? '+' : ''}${acBonus} AC` : '',
                saveBonus ? `${saveBonus > 0 ? '+' : ''}${saveBonus} Saves` : '',
                skillAdvVal ? `Adv ${skillAdvVal}` : '',
                note,
                attune ? 'Attune' : ''
            ].filter(Boolean);

            meta = {
                category: customTagKind === 'accessory' ? 'accessory' : 'armor',
                slots,
                hands: 1,
                baseAC,
                addDex,
                maxDex,
                armorWorn,
                heavyArmor,
                acBonus,
                saveBonus,
                skillAdv: skillAdvVal ? [skillAdvVal] : [],
                attune,
                isShield: slot === 'offHand' && acBonus > 0,
                summary: parts.join(' • ') || 'Custom Equippable Gear'
            };
        }

        const map = getCustomGearMap();
        map[key] = meta;
        saveCustomGearMap(map);
        showCustomTagger = false;
        if (equipTargetSlot) {
            selectedSlot = equipTargetSlot;
            equipItemToSlot(equipTargetSlot, key);
        } else {
            adapter.log(`🧪 <strong>Saved Custom Consumable:</strong> <strong>${esc(shortLabel(raw))}</strong> (${esc(meta.summary)})!`);
            applyEquipmentToSheet();
        }
    }

    function removeCustomGearTag(itemKey) {
        const map = getCustomGearMap();
        if (!map[itemKey]) return;
        const raw = findInventoryRawByKey(itemKey);
        delete map[itemKey];
        saveCustomGearMap(map);
        reconcileEquippedWithInventory();
        adapter.log(`🔄 <strong>Custom Tag Removed:</strong> <strong>${esc(raw ? shortLabel(raw) : itemKey)}</strong> restored to its original default properties!`);
        applyEquipmentToSheet();
    }

    function clearAllCustomGearTags() {
        const map = getCustomGearMap();
        const cnt = Object.keys(map).length;
        if (cnt === 0) return;
        saveCustomGearMap({});
        reconcileEquippedWithInventory();
        adapter.log(`🔄 <strong>Cleared ${cnt} Custom Tag${cnt === 1 ? '' : 's'}:</strong> All items restored to their original default properties!`);
        applyEquipmentToSheet();
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
        const activeSlots = getActiveSlots();
        const activeIds = new Set(activeSlots.map(s => s.id));
        items.forEach((raw, idx) => {
            const p = parseItem(raw);
            const meta = getItemMeta(raw);
            const key = normKey(raw);
            const eqSlot = activeSlots.find(s => eq[s.id] === key);
            const isEquipped = !!eqSlot;

            if (q && !raw.toLowerCase().includes(q) && !(meta.summary || '').toLowerCase().includes(q)) return;
            if (bpCategoryFilter === 'equipped' && !isEquipped) return;
            if (bpCategoryFilter !== 'all' && bpCategoryFilter !== 'equipped' && meta.category !== bpCategoryFilter) return;

            const canEquip = meta.slots && meta.slots.some(sid => activeIds.has(sid));
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
                            ${p.qty > 1 ? `<button type="button" class="rpg-mini-btn" style="min-block-size:22px; padding:0 5px; border:none;" onclick="COS_RPG.stepBackpackQty(${idx}, -1)" aria-label="Decrease quantity">−</button><span style="font-family:'JetBrains Mono',monospace; font-size:0.72rem; font-weight:800; color:#fde68a; min-width:22px; text-align:center;">${p.qty}x</span>` : ''}
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
            items[idx] = `${p.emoji}${next > 1 ? next + 'x ' : ''}${p.name}`.trim();
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
    // ⚗️ RENDER CRAFTING MODAL (UNLOCKED FORMULAS + LOCKED MYSTERY RECIPES)
    // =========================================================================
    function renderCraftModal() {
        const body = document.getElementById('rpg-craft-body');
        if (!body) return;
        const items = adapter.getItems();
        const herbs = countIngredientQty('medicinal herb');

        // Only show reagents the player actually carries (+ Medicinal Herbs baseline) — zero spoilers!
        const carriedReagents = [`🌿 Medicinal Herbs: <strong>${herbs}x</strong>`];
        const seenReagentKeys = new Set(['medicinal herb']);
        items.forEach(raw => {
            const meta = getItemMeta(raw);
            if (meta.category !== 'crafting') return;
            const p = parseItem(raw);
            const low = p.name.toLowerCase();
            if (low.includes('medicinal herb')) return;
            const rk = low.trim();
            if (seenReagentKeys.has(rk)) return;
            seenReagentKeys.add(rk);
            carriedReagents.push(`${p.emoji || '🧪 '}${esc(shortLabel(raw).replace(/^[^\w"]+/, '').trim())}: <strong>${p.qty}x</strong>`);
        });

        const unlockedRecipes = CRAFTING_RECIPES.filter(r => isRecipeUnlocked(r));
        const lockedRecipes = CRAFTING_RECIPES.filter(r => !isRecipeUnlocked(r));

        body.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; background:#090e1a; border:1px solid #1e293b; border-radius:6px; padding:7px 10px;">
                <span style="font-size:0.74rem; color:#6ee7b7; font-weight:700;">${carriedReagents.join(' &nbsp;•&nbsp; ')}</span>
                <span style="font-size:0.68rem; color:#94a3b8;">Known: ${unlockedRecipes.length} / ${CRAFTING_RECIPES.length}</span>
            </div>

            ${unlockedRecipes.map(r => {
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

            ${lockedRecipes.length > 0 ? `
                <div style="margin-top:4px; display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <span style="font-size:0.7rem; font-weight:800; color:#94a3b8; text-transform:uppercase; letter-spacing:0.5px;">Locked &amp; Undiscovered Recipes (${lockedRecipes.length})</span>
                        <span style="font-size:0.66rem; color:#64748b;">Discover in Barovia to unlock</span>
                    </div>
                    <div class="rpg-craft-mystery-grid">
                        ${lockedRecipes.map((r, i) => `
                            <div class="rpg-craft-mystery">
                                <div class="rpg-craft-mystery-title">🔒 ??? — Unknown Formula #${i + 1}</div>
                                <div class="rpg-craft-mystery-sub">Locked • Ingredients &amp; recipe unknown</div>
                            </div>
                        `).join('')}
                    </div>
                    <details style="background:#090e1a; border:1px solid #1e293b; border-radius:6px; padding:6px 9px; margin-top:2px;">
                        <summary style="cursor:pointer; font-size:0.7rem; font-weight:700; color:#93c5fd;">Learned a new recipe from the DM? Enter Recipe Code</summary>
                        <div style="display:flex; gap:6px; margin-top:6px;">
                            <input type="text" id="rpg-unlock-recipe-input" class="rpg-input" style="flex:1;" placeholder="Enter DM Recipe Code...">
                            <button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.unlockRecipeByCode()">Unlock</button>
                        </div>
                    </details>
                </div>
            ` : ''}
        `;
    }

    // =========================================================================
    // 🤝 RENDER LIVE TRANSFER & TRADE MODAL
    // =========================================================================
    let preselectedSendIdx = 0;

    function getSelectedTradeItemMaxQty() {
        const items = adapter ? adapter.getItems() : [];
        const selEl = document.getElementById('rpg-trade-item-select');
        const idx = selEl ? parseInt(selEl.value) : preselectedSendIdx;
        if (isNaN(idx) || !items[idx]) return 1;
        return Math.max(1, parseItem(items[idx]).qty || 1);
    }

    function clampTradeItemQty(explicitMax) {
        const inp = document.getElementById('rpg-trade-item-qty');
        if (!inp) return 1;
        const maxQty = explicitMax || getSelectedTradeItemMaxQty();
        inp.max = String(maxQty);
        let val = parseInt(inp.value);
        if (isNaN(val) || val < 1) val = 1;
        if (val > maxQty) val = maxQty;
        inp.value = String(val);
        const minusBtn = document.getElementById('rpg-trade-qty-minus');
        const plusBtn = document.getElementById('rpg-trade-qty-plus');
        if (minusBtn) minusBtn.disabled = val <= 1;
        if (plusBtn) plusBtn.disabled = val >= maxQty;
        return val;
    }

    function stepTradeItemQty(delta) {
        const inp = document.getElementById('rpg-trade-item-qty');
        if (!inp) return;
        const maxQty = getSelectedTradeItemMaxQty();
        const cur = parseInt(inp.value) || 1;
        inp.value = String(Math.min(maxQty, Math.max(1, cur + delta)));
        clampTradeItemQty(maxQty);
    }

    function setTradeItemMaxQty() {
        const inp = document.getElementById('rpg-trade-item-qty');
        if (!inp) return;
        const maxQty = getSelectedTradeItemMaxQty();
        inp.value = String(maxQty);
        clampTradeItemQty(maxQty);
    }

    function onTradeItemChange(newIdxVal) {
        const idx = parseInt(newIdxVal);
        if (!isNaN(idx)) preselectedSendIdx = idx;
        const maxQty = getSelectedTradeItemMaxQty();
        const lbl = document.getElementById('rpg-trade-qty-max-lbl');
        if (lbl) lbl.textContent = `(Max in Bag: ${maxQty})`;
        const maxBtn = document.getElementById('rpg-trade-qty-max-btn');
        if (maxBtn) maxBtn.style.display = maxQty > 1 ? 'inline-flex' : 'none';
        const inp = document.getElementById('rpg-trade-item-qty');
        if (inp) {
            if ((parseInt(inp.value) || 1) > maxQty) inp.value = String(maxQty);
            clampTradeItemQty(maxQty);
        }
    }

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
        if (preselectedSendIdx < 0 || preselectedSendIdx >= items.length) preselectedSendIdx = 0;
        const selectedParsed = items[preselectedSendIdx] ? parseItem(items[preselectedSendIdx]) : { qty: 1 };
        const maxAvailQty = Math.max(1, selectedParsed.qty || 1);
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
                            <select id="rpg-trade-item-select" class="rpg-select" onchange="COS_RPG.onTradeItemChange(this.value)">
                                ${items.map((raw, i) => {
                                    const p = parseItem(raw);
                                    const cleanName = `${p.emoji}${p.name}`.trim();
                                    return `<option value="${i}" ${i === preselectedSendIdx ? 'selected' : ''}>${esc(cleanName)}</option>`;
                                }).join('')}
                            </select>
                        </label>
                        <div class="rpg-field-lbl">
                            <span>Quantity to Send <strong id="rpg-trade-qty-max-lbl" style="color:#fde68a;">(Max in Bag: ${maxAvailQty})</strong></span>
                            <div style="display:flex; align-items:center; gap:5px; margin-top:2px;">
                                <button type="button" id="rpg-trade-qty-minus" class="rpg-mini-btn" style="min-block-size:32px; padding:0 10px; font-weight:800;" onclick="COS_RPG.stepTradeItemQty(-1)" ${maxAvailQty <= 1 ? 'disabled' : ''} aria-label="Decrease send quantity">−</button>
                                <input type="number" id="rpg-trade-item-qty" class="rpg-input" style="text-align:center; font-weight:800; width:64px;" value="1" min="1" max="${maxAvailQty}" oninput="COS_RPG.clampTradeItemQty()" onchange="COS_RPG.clampTradeItemQty()">
                                <button type="button" id="rpg-trade-qty-plus" class="rpg-mini-btn" style="min-block-size:32px; padding:0 10px; font-weight:800;" onclick="COS_RPG.stepTradeItemQty(1)" ${maxAvailQty <= 1 ? 'disabled' : ''} aria-label="Increase send quantity">+</button>
                                <button type="button" id="rpg-trade-qty-max-btn" class="rpg-mini-btn btn-equip" style="min-block-size:32px; padding:0 8px; display:${maxAvailQty > 1 ? 'inline-flex' : 'none'};" onclick="COS_RPG.setTradeItemMaxQty()" title="Send all ${maxAvailQty} in your bag">Max</button>
                            </div>
                        </div>
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
                                <span style="font-size:0.75rem; color:#f8fafc;">To <strong>${esc(t.toName)}</strong>: ${t.kind === 'gold' ? `${t.gp} GP ${t.sp} SP` : esc(formatTradeItemDisplay(t.itemRaw, t.qty))}</span>
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
                                    <strong>${esc(tr.fromName)}</strong> sent: <strong>${tr.kind === 'gold' ? `${tr.gp || 0} GP, ${tr.sp || 0} SP` : esc(formatTradeItemDisplay(tr.itemRaw, tr.qty))}</strong>
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
        const activeSlots = getActiveSlots();
        const activePreset = getActivePresetInfo(eq);
        const parts = [];
        for (const s of activeSlots) {
            if (!eq[s.id]) continue;
            const raw = findInventoryRawByKey(eq[s.id]);
            if (raw) {
                const grip = (s.id === 'mainHand' && bonuses.mainHand2H) ? ' (2H)' : '';
                parts.push(`${s.label}=${shortLabel(raw)}${grip}`);
            }
        }
        const presetStr = `Preset: ${activePreset.label}${activePreset.isCustom ? ' [Custom]' : ''}`;
        const eqStr = parts.length > 0 ? `Equipped: ${parts.join(', ')}` : 'Equipped: None';

        // Include any newly saved Custom Presets with their full equipped gear breakdown!
        const customPresets = getCustomPresets();
        let customStr = '';
        if (customPresets.length > 0) {
            const pSummaries = customPresets.map(cp => {
                let pairs = [];
                if (cp.slotLabels && Object.keys(cp.slotLabels).length > 0) {
                    pairs = Object.entries(cp.slotLabels).map(([k, v]) => `${k}=${v}`);
                } else if (cp.slots) {
                    for (const s of activeSlots) {
                        if (!cp.slots[s.id]) continue;
                        const r = findInventoryRawByKey(cp.slots[s.id]);
                        pairs.push(`${s.label}=${r ? shortLabel(r) : cp.slots[s.id]}`);
                    }
                }
                return `{${cp.label}: ${pairs.length ? pairs.join(', ') : 'Empty'}}`;
            });
            customStr = ` | Saved Presets: ${pSummaries.join(' ; ')}`;
        }
        return `${presetStr} | ${eqStr}${customStr}`;
    }

    function exportEquippedGear() {
        const exportStr = `${adapter.heroEmoji || '🛡️'} ${String(adapter.heroName || 'Hero').toUpperCase()} GEAR EXPORT | ${getExportEquippedSummary()}`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(exportStr).then(() => {
                adapter.log(`📋 <strong>Equipped Gear &amp; Presets Exported!</strong><br><small style="color:#cbd5e1;">${esc(exportStr)}</small>`);
            }).catch(() => {
                prompt('Copy Equipped Gear & Presets export:', exportStr);
            });
        } else {
            prompt('Copy Equipped Gear & Presets export:', exportStr);
        }
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

    function startLiveSheetWatcher() {
        // Wrap updateHPUI so any HP decrease/increase immediately streams to Firebase for the DM's Active Encounter Board!
        if (typeof window.updateHPUI === 'function' && !window.__origUpdateHPUI) {
            window.__origUpdateHPUI = window.updateHPUI;
            window.updateHPUI = function () {
                window.__origUpdateHPUI();
                if (!isCapturingExports) syncHeroStateToFirebase(true);
            };
        }
        // Wrap native exportSheetState / exportPlayerNotes so clicking them ALSO pushes a Firebase checkpoint!
        if (typeof window.exportSheetState === 'function' && !window.__origExportSheetState) {
            window.__origExportSheetState = window.exportSheetState;
            window.exportSheetState = function () {
                window.__origExportSheetState();
                pushSyncedCheckpoint(true);
            };
        }
        if (typeof window.exportPlayerNotes === 'function' && !window.__origExportPlayerNotes) {
            window.__origExportPlayerNotes = window.exportPlayerNotes;
            window.exportPlayerNotes = function () {
                window.__origExportPlayerNotes();
                pushSyncedCheckpoint(true);
            };
        }
        // Stream live changes (HP, slots, ammo, notes, buffs) to Firebase for DM live monitoring
        document.addEventListener('click', () => {
            if (!isCapturingExports) syncHeroStateToFirebase(false);
        });
        document.addEventListener('change', () => {
            if (!isCapturingExports) syncHeroStateToFirebase(false);
        });
        setInterval(() => {
            if (!isCapturingExports) syncHeroStateToFirebase(false);
        }, 2500);
    }

    function init(sheetAdapter) {
        adapter = sheetAdapter;
        injectDialogsAndBanner();
        startLiveSheetWatcher();
        initFirebaseSync();
        applyEquipmentToSheet(true);
        checkUrlClaimParam();
    }

    // Export public API
    window.COS_RPG = {
        init,
        SLOTS: BASE_SLOTS,
        getActiveSlots,
        getGearBonuses,
        getEquippedState,
        findInventoryRawByKey,
        shortLabel,
        applyEquipmentToSheet,
        syncExternalBodySlot,
        syncExternalWeaponStance,
        getExportEquippedSummary,
        exportEquippedGear,
        pushSyncedCheckpoint,
        resetSheetToOfficialBaseline,
        openEquipModal,
        openBackpackModal,
        openCraftModal,
        openTradeModal,
        openSendForItem,
        closeModal,
        selectEquipSlot: (slotId) => {
            selectedSlot = slotId;
            if (['mainHand', 'offHand', 'legSheath', 'ranged'].includes(slotId)) customTagKind = 'weapon';
            else if (['amulet', 'ring1', 'ring2'].includes(slotId)) customTagKind = 'accessory';
            else customTagKind = 'armor';
            showCustomTagger = false;
            renderEquipModal();
        },
        setCustomTagKind: (kind) => { customTagKind = kind; renderEquipModal(); },
        rollDynamicWeaponAttack,
        rollDynamicWeaponDamage,
        syncHeroStateToFirebase,
        equipItemToSlot,
        unequipSlot,
        toggleMainHandGrip,
        applyLoadoutPreset,
        togglePresetForm: () => { showPresetForm = !showPresetForm; renderEquipModal(); },
        saveCurrentAsPreset,
        deleteCustomPreset,
        quickToggleEquipByIndex,
        toggleCustomTagger: () => { showCustomTagger = !showCustomTagger; renderEquipModal(); },
        saveCustomGearTag,
        removeCustomGearTag,
        clearAllCustomGearTags,
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
        unlockRecipeByCode,
        setTradeTab: (tab) => { tradeActiveTab = tab; renderTradeModal(); },
        setTradeRecipient: (id) => { tradeRecipient = id; renderTradeModal(); },
        setTradeMode: (mode) => { tradeMode = mode; renderTradeModal(); },
        onTradeItemChange,
        stepTradeItemQty,
        setTradeItemMaxQty,
        clampTradeItemQty,
        sendTransfer,
        acceptLiveTransfer,
        declineLiveTransfer,
        cancelOutgoingTransfer,
        claimOfflineTradeCode,
        saveBrowserFirebaseConfig,
        encodeTradeCode,
        lookupSharedItemLore
    };
})();
