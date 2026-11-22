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
            reqArmor: 'robe',
            acBonus: 1,
            saveBonus: 1,
            robeKey: 'black',
            summary: '+1 AC • +1 All Saves'
        },
        {
            match: ['red robe'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'robe',
            spellFireBonus: '1d4+1',
            robeKey: 'red',
            summary: '+1d4+1 Fire Dmg on Spells'
        },
        {
            match: ['green robe'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'robe',
            skillAdv: ['Arcana'],
            robeKey: 'green',
            summary: 'Adv on Arcana Checks'
        },
        {
            match: ['robe of useful items'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'robe',
            summary: 'Detachable Magic Patches'
        },

        // --- ARMOR & CLOAKS & HEADGEAR ---
        {
            match: ['chain mail'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'heavy',
            baseAC: 16,
            armorWorn: true,
            heavyArmor: true,
            stealthDisadv: true,
            summary: 'Base AC 16 (Heavy • Stealth Disadv)'
        },
        {
            match: ['reforged silvered dragonplate', 'dragonplate +2'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'heavy',
            baseAC: 20,
            armorWorn: true,
            heavyArmor: true,
            stealthDisadv: true,
            summary: 'Base AC 20 (+2 Heavy Armor • Cold Resist)'
        },
        {
            match: ['silvered dragonplate'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'heavy',
            baseAC: 19,
            armorWorn: true,
            heavyArmor: true,
            stealthDisadv: true,
            summary: 'Base AC 19 (+1 Heavy Armor • Cold Resist)'
        },
        {
            match: ['dragonplate', 'plate armor', 'full plate'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'heavy',
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
            reqArmor: 'medium',
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
            reqArmor: 'medium',
            baseAC: 14,
            maxDex: 2,
            armorWorn: true,
            summary: 'Base AC 14 + DEX (max 2)'
        },
        {
            match: ['studded leather'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'light',
            baseAC: 12,
            addDex: true,
            armorWorn: true,
            summary: 'AC 12 + Full DEX (Light Armor)'
        },
        {
            match: ['leather armor'],
            category: 'armor',
            slots: ['body'],
            reqArmor: 'light',
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
            match: ['obsidian barovian crown', 'barovian crown', 'royal crown'],
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
            match: ['gold statuette of saint markovia', 'gold statuette'],
            category: 'accessory',
            slots: ['amulet', 'offHand'],
            saveBonus: 1,
            summary: '+1 All Saving Throws (Good PCs)'
        },
        {
            match: ['karelova ruby', 'ruby engagement'],
            category: 'accessory',
            slots: ['ring1', 'ring2'],
            summary: 'Royal Engagement Ruby Band (25 GP)'
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
            match: ['awakened vistani bloodwell', 'awakened bloodwell', 'bloodwell vial +2'],
            category: 'accessory',
            slots: ['amulet', 'offHand'],
            spellDcBonus: 2,
            spellAtkBonus: 2,
            attune: true,
            summary: '+2 Spell DC & Hit • +5 SP/SR (Attune)'
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

        // --- AMMUNITION PACKS (Match BEFORE weapons/vials so bolts/arrows/coated rounds parse accurately!) ---
        {
            match: ['sunburst rounds', 'sunburst cartridges', 'sunburst bullets', 'dawn-powder'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sunburst', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1/+1 & +1d6 Radiant Firearm Rounds (Silvered, Halts Regen)'
        },
        {
            match: ['sunburst arrows', 'morninglord sunburst arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sunburst', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1/+1 & +1d6 Radiant Arrows (Silvered, Halts Regen)'
        },
        {
            match: ['sunburst bolts', 'sunburst crossbow bolts', 'morninglord sunburst bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sunburst', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: '+1/+1 & +1d6 Radiant Bolts (Silvered, Halts Regen)'
        },
        {
            match: ['hex-iron bullets', 'witch-iron bullets', 'baba lysaga', '+1 magical sling', '+1 firearm bullets', '+1 bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'plus1', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1 Hit & +1 Magical Firearm/Sling Rounds'
        },
        {
            match: ['hex-iron arrows', 'witch-iron arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'plus1', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1 Hit & +1 Magical Bow Arrows'
        },
        {
            match: ['hex-iron bolts', 'witch-iron bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'plus1', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: '+1 Hit & +1 Magical Crossbow Bolts'
        },
        {
            match: ['incendiary rounds', 'incendiary bullets', 'brimstone bullets', 'fire bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'incendiary', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1d4 Fire Firearm/Sling Rounds'
        },
        {
            match: ['fire arrows', 'pitch-tipped fire arrows', 'incendiary arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'incendiary', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1d4 Fire Bow Arrows'
        },
        {
            match: ['fire bolts', 'fire crossbow bolts', 'brimstone fire crossbow bolts', 'incendiary bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'incendiary', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: '+1d4 Fire Crossbow Bolts'
        },
        {
            match: ['poisoned bullets', 'pale tincture poisoned bullets', 'poison bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'poison', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1d6 Poison + DC 12 CON Save Bullets'
        },
        {
            match: ['poisoned arrows', 'venom arrows', 'poison arrows', 'nightshade venom arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'poison', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1d6 Poison + DC 12 CON Save Arrows'
        },
        {
            match: ['poisoned bolts', 'venom-dipped', 'venom bolts', 'poison bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'poison', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: '+1d6 Poison + DC 12 CON Save Bolts'
        },
        {
            match: ['necrotic bullets', 'grave-salt necrotic bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'necrotic', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1d6 Necrotic Bullets (Blocks Healing Until Next Turn)'
        },
        {
            match: ['necrotic arrows', 'shadow-bone necrotic arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'necrotic', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1d6 Necrotic Arrows (Blocks Healing)'
        },
        {
            match: ['necrotic bolts', 'necrotic crossbow bolts', 'grave-salt necrotic bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'necrotic', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: '+1d6 Necrotic Bolts (Blocks Healing)'
        },
        {
            match: ['silvered bullets', 'silvered firearm', 'silver bullets', 'silver slugs'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'silvered', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: 'Silvered Firearm/Sling Rounds (Bypasses Resist)'
        },
        {
            match: ['silvered arrows', 'silver arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'silvered', ammoKind: 'bow', packSizeDefault: 10 },
            summary: 'Silvered Bow Arrows (Bypasses Resist)'
        },
        {
            match: ['silvered bolts', 'silvered crossbow bolts', 'silver bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'silvered', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: 'Silvered Crossbow Bolts (Bypasses Resist)'
        },
        {
            match: ['sun-ash bullets', 'sun-ash coated bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'firearm', packSizeDefault: 1 },
            summary: '+1d4 Radiant Coated Bullets'
        },
        {
            match: ['sun-ash arrows', 'sun-ash coated arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'bow', packSizeDefault: 1 },
            summary: '+1d4 Radiant Coated Arrows'
        },
        {
            match: ['sun-ash bolts', 'sun-ash coated crossbow bolts', 'sun-ash coated bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'crossbow', packSizeDefault: 1 },
            summary: '+1d4 Radiant Coated Bolts'
        },
        {
            match: ['sharpened bullets', 'oil of sharpness (+3) bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'firearm', packSizeDefault: 1 },
            summary: '+3 Hit / +3 Dmg Sharpened Bullets'
        },
        {
            match: ['sharpened arrows', 'oil of sharpness (+3) arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'bow', packSizeDefault: 1 },
            summary: '+3 Hit / +3 Dmg Sharpened Arrows'
        },
        {
            match: ['sharpened bolts', 'oil of sharpness (+3) crossbow bolts', 'oil of sharpness (+3) bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'crossbow', packSizeDefault: 1 },
            summary: '+3 Hit / +3 Dmg Sharpened Bolts'
        },
        {
            match: ['wyvern-venom bullets', 'wyvern-venom tipped bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'wyvern_venom', ammoKind: 'firearm', packSizeDefault: 1 },
            summary: '+7d6 Poison (DC 15 CON) Bullets'
        },
        {
            match: ['wyvern-venom arrows', 'wyvern-venom tipped arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'wyvern_venom', ammoKind: 'bow', packSizeDefault: 1 },
            summary: '+7d6 Poison (DC 15 CON) Arrows'
        },
        {
            match: ['wyvern-venom bolts', 'wyvern-venom tipped crossbow bolts', 'wyvern-venom tipped bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'wyvern_venom', ammoKind: 'crossbow', packSizeDefault: 1 },
            summary: '+7d6 Poison (DC 15 CON) Bolts'
        },
        {
            match: ['poisoned darts', 'crossbow bolts', 'arrows', 'bullets'],
            category: 'gear',
            slots: [],
            summary: 'Standard Ammunition Bundle'
        },
        {
            match: ['specialty bullet sling', 'bullet sling', 'specialty cartridge rig', 'cartridge rig', 'munitions sling', 'specialty bullet', 'ammo rig', 'cartridge case', 'munitions belt'],
            category: 'gear',
            slots: [],
            isBulletContainer: true,
            summary: 'Stores Multiple Specialty Bullet Types (Unlocks Firearm Load)'
        },

        // --- WEAPON ATTACHMENTS (2 Non-Overlapping Dedicated Slots per Weapon • Legendary Artifacts = 0 Slots!) ---
        // DM-Upgraded Enhanced Attachments (Must appear BEFORE base matchers!)
        {
            match: ['enhanced van richten\'s silver-runed scope', 'enhanced silver-runed scope'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'van_richten_scope_plus2',
                slotType: 'optic',
                targetClasses: ['firearm', 'crossbow', 'bow'],
                atkBonus: 2,
                dmgBonus: 0,
                initBonus: -1,
                mistSight: true,
                debuffNote: '-1 Initiative (heavy masterwork sighting tube)',
                badgeLabel: 'Enhanced Scope (+2 Hit • Mist/Ethereal Sight / -1 Init)'
            },
            summary: 'Optic Slot (Ranged): +2 Attack, Mist & 30-ft Ethereal Sight; Debuff: -1 Init'
        },
        {
            match: ['enhanced clockwork rifled barrel', 'enhanced van richten\'s clockwork'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'van_richten_barrel_plus2',
                slotType: 'barrel',
                targetClasses: ['firearm'],
                atkBonus: 0,
                dmgBonus: 2,
                magCapDelta: -1,
                isSilvered: true,
                isMagical: true,
                debuffNote: '-1 Max Magazine Capacity (thick silver-rifled sleeve)',
                badgeLabel: 'Enhanced Barrel (+2 Dmg • Silvered / -1 Mag)'
            },
            summary: 'Barrel Slot (Firearm): +2 Damage, Silvered & Magical; Debuff: -1 Max Mag'
        },
        {
            match: ['enhanced amber-inlaid focusing collar', 'enhanced focusing collar'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'amber_focus_collar_plus2',
                slotType: 'crown',
                slotTypes: ['crown', 'hilt'],
                targetClasses: ['caster_weapon'],
                atkBonus: 2,
                dmgBonus: 0,
                spellAtkBonus: 2,
                badgeLabel: 'Enhanced Amber Collar (+2 Spell Atk / +2 Wpn Hit)'
            },
            summary: 'Arcane Core/Crown Slot (Staff/Dagger): +2 Spell Attack & +2 Weapon Hit'
        },
        {
            match: ['masterwork silver-runed hilt', 'masterwork hilt counterweight'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'silver_runed_pommel_plus2',
                slotType: 'hilt',
                targetClasses: ['melee'],
                atkBonus: 1,
                dmgBonus: 0,
                initBonus: 1,
                isSilvered: true,
                badgeLabel: 'Masterwork Silver Hilt (+1 Hit/+1 Init • Silvered)'
            },
            summary: 'Hilt Slot (Melee): +1 Attack, +1 Initiative & Silvered Handling'
        },
        {
            match: ['reforged counterbalance edge-guard', 'reforged edge-guard'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'serrated_bloodgroove_edge_plus2',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 2,
                acBonus: 1,
                isMagical: true,
                badgeLabel: 'Reforged Edge-Guard (+2 Dmg/+1 AC • Magical)'
            },
            summary: 'Edge/Guard Slot (Blade): +2 Damage, +1 AC & Magical'
        },

        // --- SLOT 1 RANGED: OPTIC / SIGHT (6 Choices — Accuracy, Initiative & Vision ONLY) ---
        {
            match: ['solmere hair-line iron sights', 'hair-line iron sights', 'iron sights'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'duelist_iron_sights',
                slotType: 'optic',
                targetClasses: ['firearm', 'crossbow'],
                atkBonus: 1,
                dmgBonus: -1,
                debuffNote: '-1 Damage (light precision sight calibration)',
                badgeLabel: 'Iron Sights (+1 Hit / -1 Dmg)'
            },
            summary: 'Optic Slot (Firearm/Crossbow): +1 Attack; Debuff: -1 Damage'
        },
        {
            match: ['vistani quick-snap bead sight', 'quick-snap bead', 'snap bead sight'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'vistani_snap_sight',
                slotType: 'optic',
                targetClasses: ['firearm', 'crossbow', 'bow'],
                atkBonus: 0,
                dmgBonus: -1,
                initBonus: 2,
                debuffNote: '-1 Damage (close-range snap aiming)',
                badgeLabel: 'Snap Bead (+2 Init / -1 Dmg)'
            },
            summary: 'Optic Slot (Ranged): +2 Initiative (Fast Draw); Debuff: -1 Damage'
        },
        {
            match: ['dusk-quartz night scope', 'dusk-quartz'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'dusk_prism_lens',
                slotType: 'optic',
                targetClasses: ['firearm', 'crossbow', 'bow'],
                atkBonus: 0,
                dmgBonus: 0,
                mistSight: true,
                debuffNote: '-1 Attack if firing in Bright Sunlight',
                badgeLabel: 'Dusk Scope (Mist/60-ft Dark Sight / -1 in Sun)'
            },
            summary: 'Optic Slot (Ranged): Mist & 60-ft Dark Sight; Debuff: -1 Hit in Bright Sun'
        },
        {
            match: ['balinok frost-lens hunter\'s sight', 'frost-lens hunter', 'frost-lens'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'balinok_frost_sight',
                slotType: 'optic',
                targetClasses: ['firearm', 'crossbow', 'bow'],
                atkBonus: 1,
                dmgBonus: 0,
                initBonus: -1,
                mistSight: true,
                debuffNote: '-1 Initiative (slow frost-thermal lock)',
                badgeLabel: 'Frost-Lens Sight (+1 Hit • Thermal/Dark Sight / -1 Init)'
            },
            summary: 'Optic Slot (Ranged): +1 Attack & 60-ft Thermal/Dark Sight; Debuff: -1 Init'
        },
        {
            match: ['van richten\'s silver-runed scope', 'silver-runed scope'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'van_richten_scope',
                slotType: 'optic',
                targetClasses: ['firearm', 'crossbow', 'bow'],
                atkBonus: 1,
                dmgBonus: 0,
                initBonus: -1,
                mistSight: true,
                debuffNote: '-1 Initiative (heavy telescopic sighting tube)',
                badgeLabel: 'Silver Scope (+1 Hit • Mist Sight / -1 Init)'
            },
            summary: 'Optic Slot (Ranged): +1 Attack & Mist-Piercing Sight; Debuff: -1 Init'
        },
        {
            match: ['amber temple astral-prism scope', 'astral-prism scope', 'astral-prism'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'amber_astral_scope',
                slotType: 'optic',
                targetClasses: ['firearm', 'crossbow', 'bow'],
                atkBonus: 1,
                dmgBonus: 0,
                initBonus: 2,
                acBonus: -1,
                mistSight: true,
                debuffNote: '-1 AC (narrow arcane tunnel-vision)',
                badgeLabel: 'Astral Scope (+1 Hit/+2 Init • Mist Sight / -1 AC)'
            },
            summary: 'Optic Slot (Endgame Ranged): +1 Attack, +2 Init & Mist Sight; Debuff: -1 AC'
        },

        // --- SLOT 2 RANGED: BARREL / MAGAZINE / MECHANISM (7 Choices — Damage, Elemental Dice, Mag & Silencer) ---
        {
            match: ['extended brass speed-cylinder', 'speed-cylinder', 'extended magazine'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'extended_speed_clip',
                slotType: 'barrel',
                targetClasses: ['firearm'],
                atkBonus: -1,
                dmgBonus: 0,
                magCapDelta: 2,
                debuffNote: '-1 Attack (heavy front balance)',
                badgeLabel: 'Speed-Cylinder (+2 Mag / -1 Hit)'
            },
            summary: 'Barrel/Mag Slot (Firearm): +2 Max Mag Capacity; Debuff: -1 Attack'
        },
        {
            match: ['clockwork draw-cam', 'draw-cam', 'hair trigger'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'quick_release_crossbow_cam',
                slotType: 'barrel',
                targetClasses: ['bow', 'crossbow', 'firearm'],
                atkBonus: -1,
                dmgBonus: 2,
                debuffNote: '-1 Attack (heavy trigger/draw tension)',
                badgeLabel: 'Draw-Cam (+2 Dmg / -1 Hit)'
            },
            summary: 'Barrel/Mechanism Slot (Ranged): +2 Damage; Debuff: -1 Attack'
        },
        {
            match: ['overbore siege barrel', 'siege barrel'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'heavy_bore_barrel',
                slotType: 'barrel',
                targetClasses: ['firearm'],
                atkBonus: 0,
                dmgBonus: 2,
                magCapDelta: -2,
                debuffNote: '-2 Max Magazine Capacity',
                badgeLabel: 'Siege Barrel (+2 Dmg / -2 Mag)'
            },
            summary: 'Barrel Slot (Firearm): +2 Damage; Debuff: -2 Max Magazine Capacity'
        },
        {
            match: ['ash-steel silencer shroud', 'silencer shroud'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'whisper_muzzle_shroud',
                slotType: 'barrel',
                targetClasses: ['firearm'],
                atkBonus: 0,
                dmgBonus: -1,
                isSilvered: true,
                silenced: true,
                debuffNote: '-1 Damage (baffled muzzle velocity)',
                badgeLabel: 'Silencer Shroud (Silent • Silvered / -1 Dmg)'
            },
            summary: 'Barrel Slot (Firearm): Silenced Gunfire & Silvered; Debuff: -1 Damage'
        },
        {
            match: ['clockwork rifled barrel', 'van richten\'s clockwork barrel', 'clockwork barrel'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'van_richten_barrel',
                slotType: 'barrel',
                targetClasses: ['firearm'],
                atkBonus: 0,
                dmgBonus: 1,
                magCapDelta: -1,
                isSilvered: true,
                isMagical: true,
                debuffNote: '-1 Max Magazine Capacity (heavy silver-rifled sleeve)',
                badgeLabel: 'Clockwork Barrel (+1 Dmg • Silvered / -1 Mag)'
            },
            summary: 'Barrel Slot (Firearm): +1 Dmg, Silvered & Magical; Debuff: -1 Max Mag'
        },
        {
            match: ['storm-coil arc barrel', 'storm-coil', 'arc barrel'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'storm_coil_barrel',
                slotType: 'barrel',
                targetClasses: ['firearm'],
                atkBonus: 0,
                dmgBonus: 0,
                extraDice: '1d4',
                extraType: 'Lightning',
                isMagical: true,
                stealthDisadv: true,
                debuffNote: 'Static Crack (Stealth Disadvantage)',
                badgeLabel: 'Storm-Coil Barrel (+1d4 Lightning • Magical / Loud)'
            },
            summary: 'Barrel Slot (Firearm): +1d4 Lightning & Magical; Debuff: Loud Static (Stealth Disadv)'
        },
        {
            match: ['consecrated dawn-forged rifled barrel', 'dawn-forged rifled barrel', 'dawn-forged barrel'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'dawnforged_rifled_barrel',
                slotType: 'barrel',
                targetClasses: ['firearm'],
                atkBonus: 0,
                dmgBonus: 0,
                magCapDelta: -1,
                extraDice: '1d6',
                extraType: 'Radiant',
                isSilvered: true,
                isMagical: true,
                stealthDisadv: true,
                debuffNote: '-1 Max Mag & Muzzle Flash (Stealth Disadvantage)',
                badgeLabel: 'Dawn-Forged Barrel (+1d6 Rad • Silvered / -1 Mag)'
            },
            summary: 'Barrel Slot (Endgame Firearm): +1d6 Radiant, Silvered & Magical; Debuff: -1 Mag & Flash'
        },

        // --- SLOT 1 MELEE: HILT / POMMEL (6 Choices — Handling, Speed, Initiative & Attack Accuracy ONLY!) ---
        {
            match: ['vistani suede counter-grip', 'suede counter-grip'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'duelist_feather_wrap',
                slotType: 'hilt',
                targetClasses: ['melee'],
                atkBonus: 1,
                dmgBonus: -1,
                debuffNote: '-1 Damage (light agile balance)',
                badgeLabel: 'Suede Grip (+1 Hit / -1 Dmg)'
            },
            summary: 'Hilt Slot (Melee): +1 Attack (Handling); Debuff: -1 Damage'
        },
        {
            match: ['quicksilver quick-draw pommel', 'quicksilver pommel', 'quick-draw pommel'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'quicksilver_quickdraw_pommel',
                slotType: 'hilt',
                targetClasses: ['melee'],
                atkBonus: 0,
                dmgBonus: -1,
                initBonus: 2,
                debuffNote: '-1 Damage (feather-light draw balance)',
                badgeLabel: 'Quicksilver Pommel (+2 Init / -1 Dmg)'
            },
            summary: 'Hilt Slot (Melee): +2 Initiative (Fast Draw); Debuff: -1 Damage'
        },
        {
            match: ['silver-runed hilt', 'hilt counterweight'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'silver_runed_pommel',
                slotType: 'hilt',
                targetClasses: ['melee'],
                atkBonus: 1,
                dmgBonus: 0,
                isSilvered: true,
                badgeLabel: 'Silvered Hilt (+1 Hit • Silvered)'
            },
            summary: 'Hilt Slot (Melee): +1 Attack & Silvered Handling'
        },
        {
            match: ['sunstone pommel', 'pommel gem'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'sun_ruby_pommel_stone',
                slotType: 'hilt',
                targetClasses: ['melee'],
                atkBonus: 1,
                dmgBonus: 0,
                initBonus: 1,
                stealthDisadv: true,
                debuffNote: '10-ft Golden Glow (Stealth Disadvantage)',
                badgeLabel: 'Sunstone Pommel (+1 Hit/+1 Init • 10-ft Light)'
            },
            summary: 'Hilt Slot (Melee): +1 Attack, +1 Initiative & 10-ft Light; Debuff: Stealth Disadv'
        },
        {
            match: ['blood-thorn barbed hilt', 'barbed hilt'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'vampiric_thorn_grip',
                slotType: 'hilt',
                targetClasses: ['melee'],
                atkBonus: 2,
                dmgBonus: 0,
                debuffNote: 'Self-Bite: lose 1 HP if attack rolls natural 1-3',
                badgeLabel: 'Blood-Thorn Hilt (+2 Hit / Bite on Nat 1-3)'
            },
            summary: 'Hilt Slot (Melee): +2 Attack (Blood Precision); Debuff: 1 HP bite on Nat 1-3'
        },
        {
            match: ['argynvost vanguard sovereign pommel', 'vanguard sovereign pommel', 'vanguard pommel'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'argynvost_vanguard_pommel',
                slotType: 'hilt',
                targetClasses: ['melee'],
                atkBonus: 2,
                dmgBonus: 0,
                initBonus: 2,
                acBonus: -1,
                isSilvered: true,
                debuffNote: '-1 AC (aggressive vanguard stance)',
                badgeLabel: 'Vanguard Pommel (+2 Hit/+2 Init • Silvered / -1 AC)'
            },
            summary: 'Hilt Slot (Endgame Melee): +2 Attack, +2 Init & Silvered; Debuff: -1 AC'
        },

        // --- SLOT 2 MELEE: EDGE / GUARD (10 Choices — Damage, Elemental Dice, AC & Penetration ONLY!) ---
        {
            match: ['heavy cleaver spine-weight', 'cleaver spine-weight', 'lead-core breaker pommel', 'breaker pommel'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'lead_breaker_pommel',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: -1,
                dmgBonus: 2,
                debuffNote: '-1 Attack (heavy forward momentum)',
                badgeLabel: 'Cleaver Spine (+2 Dmg / -1 Hit)'
            },
            summary: 'Edge/Guard Slot (Blade): +2 Damage; Debuff: -1 Attack'
        },
        {
            match: ['counterbalance edge-guard', 'honed counterbalance', 'edge-guard'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'serrated_bloodgroove_edge',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 1,
                isMagical: true,
                badgeLabel: 'Honed Edge-Guard (+1 Dmg • Magical)'
            },
            summary: 'Edge/Guard Slot (Blade): +1 Damage & Magical'
        },
        {
            match: ['argynvost bastion crossguard', 'bastion crossguard'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'iron_bastion_crossguard',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: -1,
                dmgBonus: 0,
                acBonus: 1,
                debuffNote: '-1 Attack (heavy steel basket-guard)',
                badgeLabel: 'Bastion Guard (+1 AC / -1 Hit)'
            },
            summary: 'Edge/Guard Slot (Blade): +1 AC while equipped; Debuff: -1 Attack'
        },
        {
            match: ['barbed wolf-tooth edge spine', 'wolf-tooth edge spine', 'edge spine'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'jagged_hook_spine',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: -1,
                dmgBonus: 0,
                extraDice: '1d4',
                extraType: 'Piercing',
                debuffNote: '-1 Attack (snagging hooks)',
                badgeLabel: 'Wolf-Tooth Spine (+1d4 Prc / -1 Hit)'
            },
            summary: 'Edge/Guard Slot (Blade): +1d4 Piercing Damage; Debuff: -1 Attack'
        },
        {
            match: ['rime-etched balinok edge-fuller', 'balinok edge-fuller', 'edge-fuller'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'frostbite_silver_fuller',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 0,
                extraDice: '1d4',
                extraType: 'Cold',
                isMagical: true,
                debuffNote: 'Brittle Chill: Nat 1 attack locks wrist (-1 AC until next turn)',
                badgeLabel: 'Rime Fuller (+1d4 Cold • Magical)'
            },
            summary: 'Edge/Guard Slot (Blade): +1d4 Cold & Magical; Debuff: Frost-lock on Nat 1'
        },
        {
            match: ['cinder-forged hearthguard', 'hearthguard'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'ashen_cinder_guard',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 0,
                extraDice: '1d4',
                extraType: 'Fire',
                isMagical: true,
                stealthDisadv: true,
                debuffNote: 'Ember Glow (10-ft light • Stealth Disadvantage)',
                badgeLabel: 'Cinder Guard (+1d4 Fire • Magical / Glows)'
            },
            summary: 'Edge/Guard Slot (Blade): +1d4 Fire & Magical; Debuff: Glowing Stealth Disadv'
        },
        {
            match: ['argynvost frostfire dragon-wing guard', 'frostfire dragon-wing', 'dragon-wing guard'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'silver_dragon_crossguard',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 0,
                acBonus: 1,
                extraDice: '1d4',
                extraType: 'Radiant',
                isSilvered: true,
                isMagical: true,
                initBonus: -1,
                debuffNote: '-1 Initiative (ornate silver dragon-wing weight)',
                badgeLabel: 'Dragon-Wing Guard (+1 AC +1d4 Rad • Silvered / -1 Init)'
            },
            summary: 'Edge/Guard Slot (Blade): +1 AC, +1d4 Radiant & Silvered; Debuff: -1 Init'
        },
        {
            match: ['mourning-iron soul-serrated edge', 'soul-serrated edge', 'mourning-iron'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'grave_marrow_edge',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 0,
                extraDice: '1d6',
                extraType: 'Necrotic',
                isMagical: true,
                saveBonus: -1,
                debuffNote: '-1 to All Saving Throws (grave chill curse)',
                badgeLabel: 'Soul-Serrated Edge (+1d6 Nec / -1 Saves)'
            },
            summary: 'Edge/Guard Slot (Blade): +1d6 Necrotic & Magical; Debuff: -1 All Saves'
        },
        {
            match: ['amber temple eclipse-rune crossguard', 'eclipse-rune crossguard', 'eclipse-rune'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'amber_eclipse_guard',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 2,
                extraDice: '1d6',
                extraType: 'Force',
                isMagical: true,
                acBonus: -1,
                debuffNote: '-1 AC while wielding (dark amber drains wards)',
                badgeLabel: 'Eclipse Guard (+2 Dmg +1d6 Force / -1 AC)'
            },
            summary: 'Edge/Guard Slot (Endgame Blade): +2 Dmg & +1d6 Force; Debuff: -1 AC'
        },
        {
            match: ['consecrated dawn-glass edge rail', 'dawn-glass edge rail', 'dawn-glass'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'dawnshard_blade_rail',
                slotType: 'guard',
                targetClasses: ['slashing_piercing'],
                atkBonus: 0,
                dmgBonus: 1,
                extraDice: '1d6',
                extraType: 'Radiant',
                isSilvered: true,
                isMagical: true,
                stealthDisadv: true,
                debuffNote: 'Blazing Beacon (20-ft Bright Light • Stealth Disadvantage)',
                badgeLabel: 'Dawn-Glass Rail (+1 Dmg +1d6 Rad • Silvered / Bright)'
            },
            summary: 'Edge/Guard Slot (Endgame Blade): +1 Dmg, +1d6 Rad & Silvered; Debuff: Bright Light'
        },

        // --- SLOT 1 CASTER: ARCANE CORE / CROWN (7 Choices — Act II-IV Spell DC/Atk & Elemental Cores!) ---
        {
            match: ['amber-inlaid focusing collar', 'focusing collar'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'amber_focus_collar',
                slotType: 'crown',
                slotTypes: ['crown', 'hilt'],
                targetClasses: ['caster_weapon'],
                atkBonus: 1,
                dmgBonus: 0,
                spellAtkBonus: 1,
                badgeLabel: 'Amber Collar (+1 Spell Atk / +1 Wpn Hit)'
            },
            summary: 'Arcane Core/Crown Slot (Staff/Dagger): +1 Spell Attack & +1 Weapon Hit'
        },
        {
            match: ['cracked chaos-quartz core', 'cracked chaos-quartz staff crown', 'chaos-quartz'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'volatile_wild_prism',
                slotType: 'crown',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                spellAtkBonus: 1,
                extraDice: '1d4',
                extraType: 'Force',
                acBonus: -1,
                debuffNote: '-1 AC while equipped (unstable wild arcana)',
                badgeLabel: 'Chaos Core (+1 Spell Atk +1d4 Force / -1 AC)'
            },
            summary: 'Arcane Core Slot (Staff): +1 Spell Atk & +1d4 Force; Debuff: -1 AC'
        },
        {
            match: ['storm-glass fulgurite core', 'storm-glass fulgurite staff core', 'fulgurite'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'lightning_fulgurite_core',
                slotType: 'crown',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                spellAtkBonus: 1,
                extraDice: '1d4',
                extraType: 'Lightning',
                stealthDisadv: true,
                debuffNote: 'Static Hum (Stealth Disadvantage)',
                badgeLabel: 'Fulgurite Core (+1 Spell Atk +1d4 Lightn / Loud)'
            },
            summary: 'Arcane Core Slot (Staff): +1 Spell Atk & +1d4 Lightning; Debuff: Stealth Disadv'
        },
        {
            match: ['balinok frostveil resonator crown', 'frostveil resonator', 'frostveil'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'frostveil_crystal_crown',
                slotType: 'crown',
                targetClasses: ['caster_weapon'],
                atkBonus: -1,
                dmgBonus: 0,
                spellDcBonus: 1,
                extraDice: '1d4',
                extraType: 'Cold',
                debuffNote: '-1 Weapon Attack (numbing frost aura)',
                badgeLabel: 'Frostveil Crown (+1 Spell DC +1d4 Cold / -1 Wpn Hit)'
            },
            summary: 'Arcane Core/Crown Slot (Staff): +1 Spell Save DC & +1d4 Cold; Debuff: -1 Wpn Hit'
        },
        {
            match: ['cinder-heart phoenix core', 'cinder-heart', 'phoenix core'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'cinder_phoenix_core',
                slotType: 'crown',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                spellAtkBonus: 1,
                extraDice: '1d6',
                extraType: 'Fire',
                stealthDisadv: true,
                debuffNote: '10-ft Ember Glow (Stealth Disadvantage)',
                badgeLabel: 'Phoenix Core (+1 Spell Atk +1d6 Fire / Glows)'
            },
            summary: 'Arcane Core Slot (Staff): +1 Spell Atk & +1d6 Fire; Debuff: Glowing Stealth Disadv'
        },
        {
            match: ['crimson bloodmoon conduit crown', 'bloodmoon conduit', 'bloodmoon'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'bloodmoon_ruby_crown',
                slotType: 'crown',
                slotTypes: ['crown', 'hilt'],
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                spellDcBonus: 1,
                spellAtkBonus: 1,
                extraDice: '1d4',
                extraType: 'Necrotic',
                acBonus: -1,
                debuffNote: '-1 AC while equipped (blood tithe siphons wards)',
                badgeLabel: 'Bloodmoon Crown (+1 DC/+1 Spell +1d4 Nec / -1 AC)'
            },
            summary: 'Arcane Core/Crown Slot (Staff/Dagger): +1 Spell DC/Atk & +1d4 Nec; Debuff: -1 AC'
        },
        {
            match: ['amber temple sovereign halo core', 'amber temple sovereign halo crown', 'sovereign halo'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'amber_sovereign_crown',
                slotType: 'crown',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                spellDcBonus: 2,
                spellAtkBonus: 1,
                extraDice: '1d6',
                extraType: 'Force',
                acBonus: -2,
                debuffNote: '-2 AC while equipped (glass-cannon arcane overcharge)',
                badgeLabel: 'Sovereign Halo (+2 DC/+1 Spell +1d6 Force / -2 AC)'
            },
            summary: 'Arcane Core Slot (Endgame Staff): +2 Spell DC, +1 Spell Atk & +1d6 Force; Debuff: -2 AC'
        },

        // --- SLOT 2 CASTER: SHAFT GRIP / WARDING WRAP (6 Choices — Concentration, Saves, AC, Init & Sight ONLY!) ---
        {
            match: ['weighted brass stage-cane ferrule', 'weighted brass stage-cane core', 'brass stage-cane', 'cane ferrule', 'cane core'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'ironwood_brass_core',
                slotType: 'grip',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 2,
                isSilvered: true,
                stealthDisadv: true,
                debuffNote: 'Stealth Disadvantage (audible brass rattle)',
                badgeLabel: 'Brass Ferrule (+2 Melee Dmg • Silvered / Loud)'
            },
            summary: 'Shaft Grip Slot (Staff): +2 Melee Self-Defense Dmg & Silvered; Debuff: Stealth Disadv'
        },
        {
            match: ['warding silk grip wrap', 'warding silk grip', 'silk grip wrap'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'warding_silk_grip',
                slotType: 'grip',
                slotTypes: ['grip', 'hilt'],
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                saveBonus: 1,
                badgeLabel: 'Warding Grip (+1 All Saves / Conc)'
            },
            summary: 'Shaft Grip Slot (Staff/Dagger): +1 to Saving Throws (incl. Concentration)'
        },
        {
            match: ['vistani tarokka star-prism grip-charm', 'vistani tarokka star-prism finial', 'star-prism'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'starlight_tarokka_finial',
                slotType: 'grip',
                slotTypes: ['grip', 'hilt'],
                targetClasses: ['caster_weapon'],
                atkBonus: -1,
                dmgBonus: 0,
                initBonus: 2,
                debuffNote: '-1 Melee Attack (delicate orbiting brass rings)',
                badgeLabel: 'Star-Prism Charm (+2 Init / -1 Melee)'
            },
            summary: 'Shaft Grip Slot (Staff/Dagger): +2 Initiative; Debuff: -1 Melee Attack'
        },
        {
            match: ['sanctified raven-feather concentration wrap', 'raven-feather concentration', 'concentration wrap'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'raven_conc_wrap',
                slotType: 'grip',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                saveBonus: 2,
                initBonus: -1,
                debuffNote: '-1 Initiative (calming trance grip)',
                badgeLabel: 'Raven-Feather Wrap (+2 Saves & Conc / -1 Init)'
            },
            summary: 'Shaft Grip Slot (Staff): +2 Saving Throws & Concentration; Debuff: -1 Init'
        },
        {
            match: ['argynvost silver-soul resonance wrap', 'argynvost silver-soul resonance core', 'silver-soul'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'silver_dragon_heartcore',
                slotType: 'grip',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: 0,
                acBonus: 1,
                saveBonus: 1,
                isSilvered: true,
                initBonus: -1,
                debuffNote: '-1 Initiative (heavy silver-dragon resonance wrap)',
                badgeLabel: 'Silver-Soul Wrap (+1 AC/+1 Saves • Silvered / -1 Init)'
            },
            summary: 'Shaft Grip Slot (Staff): +1 AC, +1 All Saves & Silvered; Debuff: -1 Init'
        },
        {
            match: ['svalich mist-heart warding grip', 'svalich mist-heart hollow core', 'mist-heart'],
            category: 'gear',
            slots: [],
            attachMeta: {
                modKey: 'fey_mistweave_core',
                slotType: 'grip',
                targetClasses: ['caster_weapon'],
                atkBonus: 0,
                dmgBonus: -2,
                acBonus: 1,
                saveBonus: 2,
                mistSight: true,
                debuffNote: '-2 Melee Damage (delicate mist-woven glass wrap)',
                badgeLabel: 'Mist-Heart Grip (+1 AC/+2 Saves • Mist Sight / -2 Dmg)'
            },
            summary: 'Shaft Grip Slot (Endgame Staff): +1 AC, +2 Saves/Conc & Mist Sight; Debuff: -2 Melee Dmg'
        },

        // --- WEAPONS & SHIELDS ---
        {
            match: ['+2 heraldic shield', 'heraldic shield'],
            category: 'weapon',
            slots: ['offHand'],
            reqArmor: 'shield',
            acBonus: 4,
            initBonus: 2,
            isShield: true,
            summary: '+4 AC • +2 Initiative (Shield)'
        },
        {
            match: ['shield'],
            category: 'weapon',
            slots: ['offHand'],
            reqArmor: 'shield',
            acBonus: 2,
            isShield: true,
            summary: '+2 AC (Off-Hand Shield)'
        },
        {
            match: ['silvered greatsword'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'martial',
            hands: 2,
            summary: '2H Heavy • 2d6 Silvered • Graze'
        },
        {
            match: ['ancestral greatsword', 'vladimir', 'greatsword'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'martial',
            hands: 2,
            weaponTag: 'greatsword',
            summary: '2H Heavy • 2d6+STR • Graze'
        },
        {
            match: ['ismark\'s silvered longsword', 'silvered longsword'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            reqWeapon: 'martial',
            hands: 1,
            versatile: true,
            weaponTag: 'silvered_longsword',
            summary: 'Versatile 1d8/1d10 • Silvered • Sap'
        },
        {
            match: ['sunsword'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'martial',
            hands: 1,
            versatile: true,
            attune: true,
            summary: '+2 Radiant Sun Blade • True Sunlight (Attune)'
        },
        {
            match: ['blood spear of kavan', 'blood spear'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'simple',
            hands: 1,
            versatile: true,
            attune: true,
            summary: '+2 Spear • +2d6 Temp HP on Kill (Attune)'
        },
        {
            match: ['battleaxe', 'treebane'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'martial',
            hands: 1,
            versatile: true,
            summary: 'Versatile 1d8/1d10 • Topple'
        },
        {
            match: ['silvered handaxe', '+1 throwing handaxe', 'throwing handaxe'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            reqWeapon: 'simple',
            hands: 1,
            summary: '1H Light • Thrown 20/60 • Vex'
        },
        {
            match: ['handaxe'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            reqWeapon: 'simple',
            hands: 1,
            weaponTag: 'handaxe',
            summary: '1H Light / Thrown 20/60 • Vex'
        },
        {
            match: ['kolyan\'s silvered heirloom dagger', 'silvered heirloom dagger'],
            category: 'weapon',
            slots: ['mainHand', 'offHand', 'legSheath'],
            reqWeapon: 'simple',
            hands: 1,
            weaponTag: 'kolyan_dagger',
            isLegDagger: true,
            summary: '1H Silvered 1d4+DEX • 3 Red Gems'
        },
        {
            match: ['baal verzi', 'mirror dagger'],
            category: 'weapon',
            slots: ['mainHand', 'offHand', 'legSheath'],
            reqWeapon: 'simple',
            hands: 1,
            isLegDagger: true,
            summary: '+1 Finesse Light Dagger • 1d4+1'
        },
        {
            match: ['trench knife', 'stiletto'],
            category: 'weapon',
            slots: ['legSheath', 'offHand', 'mainHand'],
            reqWeapon: 'simple',
            hands: 1,
            weaponTag: 'knife',
            isLegDagger: true,
            summary: '1H Finesse Light 1d4+DEX • Nick'
        },
        {
            match: ['dagger'],
            category: 'weapon',
            slots: ['mainHand', 'offHand', 'legSheath'],
            reqWeapon: 'simple',
            hands: 1,
            weaponTag: 'dagger',
            isLegDagger: true,
            summary: '1H Finesse Light / Thrown 20/60'
        },
        {
            match: ['staff of power'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'simple',
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
            reqWeapon: 'simple',
            hands: 1,
            versatile: true,
            attune: true,
            summary: 'Cold Resist • 10 Chg Ice Spells (Attune)'
        },
        {
            match: ['silver-capped quarterstaff', 'silvered quarterstaff'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'simple',
            hands: 1,
            versatile: true,
            summary: 'Versatile 1d6/1d8 Silvered • Topple'
        },
        {
            match: ['quarterstaff', 'magician\'s cane', 'gulthias staff'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'simple',
            hands: 1,
            versatile: true,
            weaponTag: 'staff',
            summary: 'Versatile 1d6/1d8 • Arcane Focus'
        },
        {
            match: ['lament'],
            category: 'weapon',
            slots: ['ranged'],
            reqWeapon: 'firearm',
            ammoKind: 'firearm',
            hands: 2,
            weaponTag: 'lament',
            stance: 'lament',
            summary: '2H Heavy Rifle • 1d12+4 • 80/240ft (Ranged)'
        },
        {
            match: ['"mercy"', 'mercy (main', 'mercy revolver'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            reqWeapon: 'firearm',
            ammoKind: 'firearm',
            hands: 1,
            weaponTag: 'mercy',
            stance: 'revolvers',
            summary: '1H Six-Shooter • 1d6+4 • 6-Cyl'
        },
        {
            match: ['"less"', 'less (off', 'less revolver'],
            category: 'weapon',
            slots: ['offHand', 'mainHand'],
            reqWeapon: 'firearm',
            ammoKind: 'firearm',
            hands: 1,
            weaponTag: 'less',
            stance: 'revolvers',
            summary: '1H Six-Shooter • 1d6 • 6-Cyl'
        },
        {
            match: ['twin revolvers'],
            category: 'weapon',
            slots: ['mainHand'],
            reqWeapon: 'firearm',
            ammoKind: 'firearm',
            hands: 2,
            weaponTag: 'revolvers',
            stance: 'revolvers',
            summary: 'Twin Six-Shooters • 1d6+4 / 1d6'
        },
        {
            match: ['hand crossbow'],
            category: 'weapon',
            slots: ['mainHand', 'offHand', 'ranged'],
            reqWeapon: 'martial',
            ammoKind: 'crossbow',
            hands: 1,
            summary: '1H Light Ranged 30/120ft • 1d6 • Vex'
        },
        {
            match: ['heavy crossbow'],
            category: 'weapon',
            slots: ['ranged'],
            reqWeapon: 'martial',
            ammoKind: 'crossbow',
            hands: 2,
            summary: '2H Heavy Crossbow 100/400ft • 1d10 • Push'
        },
        {
            match: ['light crossbow', 'crossbow'],
            category: 'weapon',
            slots: ['ranged'],
            reqWeapon: 'simple',
            ammoKind: 'crossbow',
            hands: 2,
            summary: '2H Light Crossbow 80/320ft • 1d8 • Slow'
        },
        {
            match: ['longbow'],
            category: 'weapon',
            slots: ['ranged'],
            reqWeapon: 'martial',
            ammoKind: 'bow',
            hands: 2,
            summary: '2H Heavy Longbow 150/600ft • 1d8 • Slow'
        },
        {
            match: ['shortbow', /\bbow\b/],
            category: 'weapon',
            slots: ['ranged'],
            reqWeapon: 'simple',
            ammoKind: 'bow',
            hands: 2,
            summary: '2H Shortbow 80/320ft • 1d6 • Vex'
        },
        {
            match: ['musket', 'pistol', 'rifle', 'revolver', 'pepperbox', 'blunderbuss', 'flintlock'],
            category: 'weapon',
            slots: ['ranged', 'mainHand', 'offHand'],
            reqWeapon: 'firearm',
            ammoKind: 'firearm',
            hands: 1,
            summary: 'Firearm Ranged Weapon'
        },
        {
            match: [/\bsling\b/],
            category: 'weapon',
            slots: ['mainHand', 'ranged'],
            reqWeapon: 'simple',
            ammoKind: 'firearm',
            hands: 1,
            summary: '1H Sling 30/120ft • 1d4 Bludgeoning'
        },
        {
            match: ['wand of', 'rod of'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            reqWeapon: 'simple',
            hands: 1,
            summary: 'Arcane Wand / Focus'
        },
        {
            match: ['rapier', 'longsword', 'shortsword', 'scimitar'],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            reqWeapon: 'martial',
            hands: 1,
            summary: 'Martial Melee Weapon'
        },
        {
            match: ['mace', 'thighbone', 'spear', /\bfan\b/],
            category: 'weapon',
            slots: ['mainHand', 'offHand'],
            reqWeapon: 'simple',
            hands: 1,
            summary: 'Simple Melee Weapon'
        },

        // --- PHYSICAL CRAFTING RECIPE WRITINGS (Checked before reagents/consumables so titles never collide!) ---
        {
            match: ['apothecary\'s stained distillation folio', 'distillation folio'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_greater_healing', label: 'Study Recipe' },
            summary: 'Crafting Formula: Potion of Greater Healing (GREATER-HEAL)'
        },
        {
            match: ['morninglord sacristan prayer rubric', 'prayer rubric'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_holy_water', label: 'Study Recipe' },
            summary: 'Crafting Formula: Morninglord Holy Water (MORNINGLORD)'
        },
        {
            match: ['wolfbane & marsh-herb herbalist treatise', 'herbalist treatise'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_antitoxin', label: 'Study Recipe' },
            summary: 'Crafting Formula: Barovian Antitoxin Tonic (WOLFBANE)'
        },
        {
            match: ['silver-suspend foundry ledger', 'foundry ledger'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_silver_oil', label: 'Study Recipe' },
            summary: 'Crafting Formula: Liquid Silver Vial (SILVER-COAT)'
        },
        {
            match: ['charred brimstone ignition slate', 'ignition slate'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_incendiary_vial', label: 'Study Recipe' },
            summary: 'Crafting Formula: Incendiary Oil Vial (INCENDIARY-VIAL)'
        },
        {
            match: ['volatile oil & sulfur mixing chart', 'mixing chart'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_fire_flask', label: 'Study Recipe' },
            summary: 'Crafting Formula: Alchemist\'s Fire Flask (BRIMSTONE)'
        },
        {
            match: ['scout shadow-pellet scrap', 'shadow-pellet scrap'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_smoke_bomb', label: 'Study Recipe' },
            summary: 'Crafting Formula: Ash-Cloud Smoke Bomb (ASH-CLOUD)'
        },
        {
            match: ['silver-flash powder diagram', 'powder diagram'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_phosphor_bomb', label: 'Study Recipe' },
            summary: 'Crafting Formula: Phosphor Flash-Bomb (PHOSPHOR)'
        },
        {
            match: ['pitch-ward stitch pattern', 'stitch pattern'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_camp_kit', label: 'Study Recipe' },
            summary: 'Crafting Formula: Mist-Ward Camp Kit (MIST-CAMP)'
        },
        {
            match: ['carved bog-witch runestone', 'bog-witch runestone'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_witch_iron_vial', label: 'Study Recipe' },
            summary: 'Rare Formula: Witch-Iron Oil Vial (WITCH-IRON)'
        },
        {
            match: ['moonpetal infusion vellum', 'infusion vellum'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_superior_healing', label: 'Study Recipe' },
            summary: 'Rare Formula: Potion of Superior Healing (MOONPETAL)'
        },
        {
            match: ['silver dragon consecration scroll', 'consecration scroll'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_vampire_ward', label: 'Study Recipe' },
            summary: 'Rare Formula: Sun-Ash Vial (SUN-ASH)'
        },
        {
            match: ['amber temple heartstone wall-rubbing', 'heartstone wall-rubbing'],
            category: 'quest',
            slots: [],
            useAction: { type: 'learnRecipe', recipeId: 'craft_elixir_of_health', label: 'Study Recipe' },
            summary: 'Legendary Formula: Elixir of Health (HEART-ELIXIR)'
        },

        // --- CONSUMABLES & CRAFTING & QUEST ---
        {
            match: ['medicinal herb'],
            category: 'crafting',
            slots: [],
            summary: 'Crafting Reagent (2x = Potion, 1x = Bandage)'
        },
        {
            match: ['shard of the heart of sorrow', 'sorrow-crystal core', 'sorrow shard', 'heart of sorrow', 'alchemical catalyst', 'catalyst', 'silver dust', 'wolfbane', 'sulfur', 'brimstone', 'pine pitch', 'pitch oil', 'lamp oil', 'moonpetal', 'charcoal', 'vampire ash', 'wolf fang', 'linen wrap', 'treated pelt', 'dire-pelt', 'waxed canvas'],
            category: 'crafting',
            slots: [],
            summary: 'Barovian Crafting Material / Relic Reagent'
        },
        {
            match: ['potion of greater healing'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 4, sides: 4, bonus: 4, verb: 'Drank', label: 'Greater Potion (4d4+4)' },
            summary: 'Heal 4d4+4 HP (Bonus Action • Caps at Max HP)'
        },
        {
            match: ['potion of superior healing'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 8, sides: 4, bonus: 8, verb: 'Drank', label: 'Superior Potion (8d4+8)' },
            summary: 'Heal 8d4+8 HP (Bonus Action • Caps at Max HP)'
        },
        {
            match: ['potion of false vitality', 'false vitality'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'tempHp', dice: 1, sides: 6, bonus: 4, verb: 'Drank', duration: '1 hour', label: 'False Vitality (+1d6+4 Temp)' },
            summary: 'Grant 1d6+4 Temp HP for 1 hr (Bonus Action • Non-Stacking)'
        },
        {
            match: ['vistani stag-blood tonic', 'stag-blood tonic', 'stag blood tonic'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'tempHp', dice: 2, sides: 6, bonus: 4, verb: 'Drank', duration: '1 hour', extraNote: 'Advantage on your next STR or CON Saving Throw within 1 hour!', label: 'Stag-Blood (+2d6+4 Temp)' },
            summary: 'Grant 2d6+4 Temp HP (1 hr) + Adv next STR/CON Save (Bonus Action)'
        },
        {
            match: ["morninglord's overflow elixir", 'morninglord overflow elixir', 'overflow elixir'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'overheal', dice: 2, sides: 6, bonus: 2, verb: 'Drank', duration: '1 hour', label: 'Overflow Elixir (2d6+2➔Temp)' },
            summary: 'Heal 2d6+2 HP; excess over Max HP converts to Temp HP for 1 hr (Bonus Action)'
        },
        {
            match: ['sun-spun aegis draught', 'sun spun aegis draught', 'aegis draught'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'overheal', dice: 4, sides: 4, bonus: 4, verb: 'Drank', duration: '1 hour', label: 'Aegis Draught (4d4+4➔Temp)' },
            summary: 'Heal 4d4+4 HP; excess over Max HP converts to Temp HP for 1 hr (Bonus Action)'
        },
        {
            match: ['potion of healing', 'health potion'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 2, sides: 6, bonus: 1, verb: 'Drank', label: 'Potion (2d6+1)' },
            summary: 'Heal 2d6+1 HP (Bonus Action • Caps at Max HP)'
        },
        {
            match: ['bandage'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 1, sides: 6, bonus: 1, verb: 'Applied', actionCost: 'action', label: 'Bandage (1d6+1)' },
            summary: 'Heal 1d6+1 HP (Action • Caps at Max HP)'
        },
        {
            match: ['croissant'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            useAction: { type: 'heal', dice: 1, sides: 4, bonus: 0, verb: 'Ate', actionCost: 'action', label: 'Croissant (1d4)' },
            summary: 'Heal 1d4 HP (Action • Caps at Max HP)'
        },
        {
            match: ['holy water', 'blessed by the morninglord', 'morninglord spring water'],
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
            match: ['witch-iron oil', 'witch-iron vial', 'bog-witch hex', 'witch power vial'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'plus1', ammoKind: 'coating', isCoating: true, coatingFullMag: true, coatingRounds: 10 },
            coatMelee: {
                id: 'plus1',
                label: 'Witch-Iron (+1 Hit/Dmg)',
                atkBonus: 1,
                dmgBonus: 1,
                isSilvered: false,
                isMagical: true,
                targetClasses: ['melee'],
                duration: '1 Hour',
                singleHit: false
            },
            summary: 'Bonus Action: Coat Melee Blade (+1/+1) or Full Magazine'
        },
        {
            match: ['incendiary oil vial', 'brimstone spark-oil', 'incendiary vial'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'incendiary', ammoKind: 'coating', isCoating: true, coatingFullMag: true, coatingRounds: 10 },
            coatMelee: {
                id: 'incendiary',
                label: 'Incendiary (+1d4 Fire)',
                extraDice: '1d4',
                extraType: 'Fire',
                targetClasses: ['melee'],
                duration: '10 Min',
                singleHit: false
            },
            summary: 'Bonus Action: Coat Melee Weapon or Full Magazine (+1d4 Fire)'
        },
        {
            match: ['liquid silver'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'silvered', ammoKind: 'coating', isCoating: true, coatingFullMag: true, coatingRounds: 10 },
            coatMelee: {
                id: 'silvered',
                label: 'Liquid Silver (Silvered)',
                isSilvered: true,
                targetClasses: ['melee'],
                duration: '1 Hour',
                singleHit: false
            },
            summary: 'Bonus Action: Coat Melee Weapon or Full Magazine (Silvered)'
        },
        {
            match: ['sun-ash'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'coating', isCoating: true, coatingRounds: 6 },
            coatMelee: {
                id: 'sun_ash',
                label: 'Sun-Ash (+1d4 Radiant)',
                extraDice: '1d4',
                extraType: 'Radiant',
                targetClasses: ['melee'],
                duration: '10 Min',
                singleHit: false
            },
            summary: 'Bonus Action: Coat Melee Weapon or 6 Rounds (+1d4 Radiant)'
        },
        {
            match: ['oil of sharpness'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'coating', isCoating: true, coatingRounds: 5 },
            coatMelee: {
                id: 'sharpness',
                label: 'Oil of Sharpness (+3/+3)',
                atkBonus: 3,
                dmgBonus: 3,
                isMagical: true,
                targetClasses: ['slashing_piercing'],
                duration: '1 Hour',
                singleHit: false
            },
            summary: '1 Action: Coat Slashing/Piercing Blade or 5 Rounds (+3/+3)'
        },
        {
            match: ['wyvern venom'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'wyvern_venom', ammoKind: 'coating', isCoating: true, coatingRounds: 1 },
            coatMelee: {
                id: 'wyvern_venom',
                label: 'Wyvern Venom (+7d6 Poison)',
                extraDice: '7d6',
                extraType: 'Poison',
                saveNote: 'DC 15 CON Save for half Poison damage',
                targetClasses: ['slashing_piercing'],
                duration: 'Next Hit (1 Min)',
                singleHit: true
            },
            summary: 'Bonus Action: Coat Blade (+7d6 Poison) or 1 Round/Dose'
        },
        {
            match: ['pale tincture'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'poison', ammoKind: 'coating', isCoating: true, coatingRounds: 3 },
            coatMelee: {
                id: 'poison',
                label: 'Pale Tincture (+1d6 Poison)',
                extraDice: '1d6',
                extraType: 'Poison',
                saveNote: 'DC 16 CON Save or Poisoned',
                targetClasses: ['slashing_piercing'],
                duration: '1 Min',
                singleHit: false
            },
            summary: 'Bonus Action: Coat Blade or 3 Rounds (+1d6 Poison + Save)'
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

    // Unified Extensible Crafting Recipes (Vials, Potions, Gadgets — NEVER craft bullets directly!)
    const CRAFTING_RECIPES = [
        {
            id: 'craft_healing_potion',
            unlocked: true,
            name: 'Potion of Healing',
            badge: '2d6 + 1 HP',
            desc: 'Steep 2 bundles of Barovian Medicinal Herbs into a restorative ruby draught (Bonus Action self / Action ally).',
            ingredients: [{ keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 2 }],
            outputRaw: 'Potion of Healing',
            outputMatch: 'potion of healing'
        },
        {
            id: 'craft_field_bandages',
            unlocked: true,
            name: 'Field Healing Bandages',
            badge: '1d6 + 1 HP',
            desc: 'Infuse clean linen strips with crushed medicinal herbs to bind wounds quickly in the field.',
            ingredients: [{ keyword: 'medicinal herb', label: 'Medicinal Herb', qty: 1 }],
            outputRaw: 'Field Healing Bandages',
            outputMatch: 'bandage'
        },
        {
            id: 'craft_greater_healing',
            unlocked: false,
            unlockCode: 'GREATER-HEAL',
            tierHint: 'Apothecary Formula',
            name: 'Potion of Greater Healing',
            badge: '4d4 + 4 HP',
            desc: 'Distill 4 bundles of Medicinal Herbs with 1 Alchemical Catalyst for potent mid-battle recovery.',
            ingredients: [
                { keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 4 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 1 }
            ],
            outputRaw: 'Potion of Greater Healing',
            outputMatch: 'potion of greater healing'
        },
        {
            id: 'craft_holy_water',
            unlocked: false,
            unlockCode: 'MORNINGLORD',
            tierHint: 'Sacred Rite Formula',
            name: 'Morninglord Holy Water Flask',
            badge: '2d6 Radiant',
            desc: 'Consecrate Pure Mountain Spring Water with Powdered Silver Dust to burn Undead & halt Vampire Regeneration.',
            ingredients: [
                { keyword: 'spring water', label: 'Pure Spring Water', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 }
            ],
            outputRaw: 'Morninglord Holy Water Flask',
            outputMatch: 'holy water'
        },
        {
            id: 'craft_antitoxin',
            unlocked: false,
            unlockCode: 'WOLFBANE',
            tierHint: 'Wilderness Herbalism',
            name: 'Barovian Antitoxin Tonic',
            badge: 'Adv vs Poison (1 hr)',
            desc: 'Boil Medicinal Herbs with bitter Svalich Wolfbane Root for 1 hour of Advantage on saving throws against poison.',
            ingredients: [
                { keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 2 },
                { keyword: 'wolfbane', label: 'Svalich Wolfbane Root', qty: 1 }
            ],
            outputRaw: 'Barovian Antitoxin Tonic',
            outputMatch: 'antitoxin'
        },
        {
            id: 'craft_silver_oil',
            unlocked: false,
            unlockCode: 'SILVER-COAT',
            tierHint: 'Investment Foundry Vial',
            name: 'Liquid Silver Vial',
            badge: 'Full Mag / 1h Blade (Silvered)',
            desc: 'Suspend Powdered Silver Dust in Pine Pitch Oil. Press Coat in Backpack to coat a melee weapon (1 hr) or a full weapon magazine (up to 10 rounds) as Silvered.',
            ingredients: [
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 1 }
            ],
            outputRaw: 'Liquid Silver Vial',
            outputMatch: 'liquid silver'
        },
        {
            id: 'craft_incendiary_vial',
            unlocked: false,
            unlockCode: 'INCENDIARY-VIAL',
            legacyIds: ['craft_incendiary_bullets'],
            unlockAliases: ['INCENDIARY-ROUNDS'],
            tierHint: 'Investment Gunsmith Vial',
            name: 'Incendiary Oil Vial',
            badge: '+1d4 Fire (Full Mag / Blade)',
            desc: 'Distill brimstone sulfur & pine pitch into an oil coating vial (cannot craft bullets directly). Press Coat to apply +1d4 Fire to a melee blade (10 min) or coat a full magazine/quiver (up to 10 rounds).',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 1 }
            ],
            outputRaw: 'Incendiary Oil Vial',
            outputMatch: 'incendiary oil vial'
        },
        {
            id: 'craft_witch_iron_vial',
            unlocked: false,
            unlockCode: 'WITCH-IRON',
            tierHint: 'Rare Bog-Witch Formula (Found Only)',
            name: 'Witch-Iron Oil Vial',
            badge: '+1 Hit / +1 Dmg (Full Mag / Blade)',
            desc: 'Boil Powdered Silver Dust, Alchemical Catalyst, and Wolfbane Root over witch-peat fire. Coats an entire firearm magazine/cylinder or a melee blade (+1 Hit & +1 Magical Damage; bypasses nonmagical immunity). Learned only from the Carved Bog-Witch Runestone in Berez.',
            ingredients: [
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 1 },
                { keyword: 'wolfbane', label: 'Svalich Wolfbane Root', qty: 1 }
            ],
            outputRaw: 'Witch-Iron Oil Vial',
            outputMatch: 'witch-iron oil vial'
        },
        {
            id: 'craft_fire_flask',
            unlocked: false,
            unlockCode: 'BRIMSTONE',
            tierHint: 'Volatile Concoction',
            name: 'Alchemist\'s Fire Flask',
            badge: '1d4 Fire / Turn',
            desc: 'Volatile flask of Brimstone Sulfur suspended in Pine Pitch Oil; ignites on impact (DC 10 DEX Check to extinguish).',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 1 }
            ],
            outputRaw: 'Alchemist\'s Fire Flask',
            outputMatch: 'alchemist\'s fire'
        },
        {
            id: 'craft_smoke_bomb',
            unlocked: false,
            unlockCode: 'ASH-CLOUD',
            tierHint: 'Tactical Gadget',
            name: 'Ash-Cloud Smoke Bomb',
            badge: '15-ft Obscured',
            desc: 'Compact sulfur-herb sphere that bursts into a 15-ft radius cloud of choking fog for 1 minute.',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: 'medicinal herb', label: 'Dried Herbs / Tinder', qty: 1 }
            ],
            outputRaw: 'Ash-Cloud Smoke Bomb',
            outputMatch: 'smoke bomb'
        },
        {
            id: 'craft_phosphor_bomb',
            unlocked: false,
            unlockCode: 'PHOSPHOR',
            tierHint: 'Monster-Hunter Gadget',
            name: 'Alchemical Phosphor Flash-Bomb',
            badge: '2d6 Fire/Rad + Blind',
            desc: 'Alchemical flash sphere packed with sulfur, silver filings, and alembic salt (30 ft, 10-ft radius, DC 13 DEX/CON Save or 2d6 Fire/Radiant + Blind 1 turn).',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 1 }
            ],
            outputRaw: 'Alchemical Phosphor Flash-Bomb',
            outputMatch: 'phosphor'
        },
        {
            id: 'craft_camp_kit',
            unlocked: false,
            unlockCode: 'MIST-CAMP',
            tierHint: 'Field Survival Craft (DC 14 Survival)',
            name: 'Mist-Ward Traveler\'s Camp Kit',
            badge: 'Wilderness True Long Rest',
            desc: 'Heavy survival shelter build (DC 14 Survival at table): pitch-sealed dire-pelt canvas tent & silver-salt perimeter ward enabling a True Long Rest outdoors.',
            ingredients: [
                { keyword: ['dire-pelt', 'treated pelt', 'waxed canvas'], label: 'Treated Dire-Pelt & Waxed Canvas', qty: 2 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 2 },
                { keyword: 'wolfbane', label: 'Svalich Wolfbane Root', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 }
            ],
            outputRaw: 'Mist-Ward Traveler\'s Camp Kit',
            outputMatch: 'mist-ward'
        },
        {
            id: 'craft_superior_healing',
            unlocked: false,
            unlockCode: 'MOONPETAL',
            tierHint: 'Rare Alchemy (Found Only)',
            name: 'Potion of Superior Healing',
            badge: '8d4 + 8 HP',
            desc: 'Rare master-grade Barovian elixir brewed with Svalich Moonpetal and double Alchemical Catalyst.',
            ingredients: [
                { keyword: 'medicinal herb', label: 'Medicinal Herbs', qty: 4 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 2 },
                { keyword: 'moonpetal', label: 'Svalich Moonpetal Blossom', qty: 1 }
            ],
            outputRaw: 'Potion of Superior Healing',
            outputMatch: 'potion of superior healing'
        },
        {
            id: 'craft_vampire_ward',
            unlocked: false,
            unlockCode: 'SUN-ASH',
            tierHint: 'Rare Sacred Vial (Found Only)',
            name: 'Sun-Ash Vial',
            badge: '+1d4 Radiant (6 Rounds / Blade)',
            desc: 'Luminous consecrated unguent of Moonpetal, Silver Dust, and Spring Water; press Coat to apply +1d4 Radiant to 1 melee weapon (10 min) or 6 rounds.',
            ingredients: [
                { keyword: 'moonpetal', label: 'Svalich Moonpetal Blossom', qty: 1 },
                { keyword: 'silver dust', label: 'Powdered Silver Dust', qty: 1 },
                { keyword: 'spring water', label: 'Pure Spring Water', qty: 1 }
            ],
            outputRaw: 'Sun-Ash Vial',
            outputMatch: 'sun-ash'
        },
        {
            id: 'craft_elixir_of_health',
            unlocked: false,
            unlockCode: 'HEART-ELIXIR',
            tierHint: 'Legendary Revival (Found Only)',
            name: 'Elixir of Health',
            badge: '50% HP Revive • Heartstone Ritual',
            desc: 'Distill EITHER Strahd\'s Shard of the Heart of Sorrow (K20) OR Morgantha\'s Night Hag Heartstone into a legendary draught that revives within 1 minute of death (50% Max HP, severed limbs knit, -2 penalty until Long Rest). Sacrifices the Heartstone permanently.',
            ingredients: [
                { keyword: ['shard of the heart of sorrow', 'sorrow-crystal core', 'sorrow shard', 'heart of sorrow', 'hag heartstone', 'night hag heartstone'], label: 'Heart of Sorrow Shard OR Night Hag Heartstone', qty: 1 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 2 },
                { keyword: 'moonpetal', label: 'Svalich Moonpetal Blossom', qty: 1 },
                { keyword: 'spring water', label: 'Pure Spring Water', qty: 1 }
            ],
            outputRaw: 'Elixir of Health',
            outputMatch: 'elixir of health'
        }
    ];

    // Shared 5e Item & Crafting Material Lore Dictionary (fallback across all 3 Player Sheets!)
    const SHARED_ITEM_LORE = [
        {
            match: ['mist-ward', 'camp kit', 'traveler\'s camp'],
            name: "Mist-Ward Traveler's Camp Kit",
            category: "PERMANENT SURVIVAL GEAR • Wilderness Long Rest Shelter",
            origin: "Selected Barovian Outfitters (25–50 GP) or Craftable (MIST-CAMP)",
            desc: "A rugged expedition shelter woven from pitch-sealed Dire Wolf hides, heavy waxed canvas, cedar perimeter stakes, a smokeless trench brazier, and silver-salt wolfbane cord.",
            effect: "• <strong>True Wilderness Long Rest (10 Min Setup • 4–6 Travelers):</strong> Allows the party to complete a <strong>full uninterrupted True Long Rest</strong> outdoors in the Svalich Woods or on the road (restoring 100% HP, Spell Slots, Sorcery Points, Superiority Dice, Help Tokens, &amp; clearing 1 Exhaustion level).<br>• <strong>Perimeter Ward &amp; Storm Cover:</strong> Grants <strong>+5 Group Stealth / Passive Perception</strong> against road patrols, chimes softly if beasts/undead cross within 30 ft, and grants <strong>Advantage on CON Saves</strong> vs freezing mountain weather.<br>• <em>Reusable permanent gear (must pitch on dry ground outside active dungeon rooms).</em>"
        },
        {
            match: ['silvered greatsword'],
            name: "Silvered Greatsword",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Heavy • Two-Handed",
            origin: "Vistani Silver Forge (Tser Pool G — 150 GP / +100 GP Plating) / Barovian Vaults",
            desc: "A massive two-handed steel greatsword whose beveled edges have been alchemically bonded with pure Barovian silver.",
            effect: "• <strong>Damage:</strong> <code>2d6 + STR</code> <strong>Silvered Slashing</strong> (Two-Handed, Heavy).<br>• <strong>Silvered Bane:</strong> Bypasses the nonmagical B/P/S damage resistances and immunities of <strong>Werewolves, Vampire Spawn, Wights, and Night Hags</strong>.<br>• <strong>5.5e Graze Mastery:</strong> If your attack roll misses a creature, you still deal damage equal to your <strong>STR modifier</strong>!"
        },
        {
            match: ['silvered rapier'],
            name: "Silvered Rapier",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Finesse • Vex",
            origin: "Amber Temple Treasury (X40), Vistani Forge (125 GP) or Ezmerelda (+1 Variant)",
            desc: "A balanced duelist's thrusting blade laminated in bright mirror-silver down the fuller.",
            effect: "• <strong>Damage:</strong> <code>1d8 + DEX/STR</code> <strong>Silvered Piercing</strong> (Finesse).<br>• <strong>Silvered Bane:</strong> Bypasses the nonmagical B/P/S damage resistances and immunities of Werewolves, Vampire Spawn, and Night Hags.<br>• <strong>5.5e Vex Mastery:</strong> Hitting grants you <strong>Advantage on your next attack roll</strong> against that creature before the end of your next turn!"
        },
        {
            match: ['silvered shortsword'],
            name: "Silvered Shortsword",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Finesse • Light • Vex",
            origin: "Ismark's Cellar Armory (E4), Rictavio's Wagon (N5) or Vistani Forge (110 GP)",
            desc: "A quick, close-quarters silver-plated short blade ideal for off-hand pairing or agile strikes.",
            effect: "• <strong>Damage:</strong> <code>1d6 + DEX/STR</code> <strong>Silvered Piercing</strong> (Finesse, Light).<br>• <strong>Silvered Bane:</strong> Bypasses Werewolf, Vampire Spawn &amp; Night Hag nonmagical resistances.<br>• <strong>5.5e Vex Mastery:</strong> Hitting grants <strong>Advantage on your next attack</strong> against that target before the end of your next turn!"
        },
        {
            match: ['silvered handaxe'],
            name: "Silvered Handaxe",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Light • Thrown • Vex",
            origin: "Tser Pool Vistani Forge (G — 105 GP) or Arasek Stockyard (N5)",
            desc: "A keen, silver-edged boarding hatchet balanced cleanly for dual-wielding or hurled strikes at fleeing wolves.",
            effect: "• <strong>Damage:</strong> <code>1d6 + STR</code> <strong>Silvered Slashing</strong> (Light, Thrown <code>20/60 ft</code>).<br>• <strong>Silvered Bane &amp; Vex Mastery:</strong> Bypasses Werewolf/Vampire/Hag nonmagical resistances and grants <strong>Advantage on your next attack</strong> after hitting!"
        },
        {
            match: ['silvered mace'],
            name: "Silvered Mace of the Morninglord",
            category: "UNCOMMON SILVERED SIMPLE WEAPON • Sap Mastery",
            origin: "Barovia Church (E5) or Vistani Silver Forge (105 GP)",
            desc: "A flanged war-mace crowned with sun-stamped silver flanges for crushing undead ribs.",
            effect: "• <strong>Damage:</strong> <code>1d6 + STR</code> <strong>Silvered Bludgeoning</strong> (Simple, 1H).<br>• <strong>Silvered Bane &amp; Sap Mastery:</strong> Bypasses Werewolf/Undead nonmagical resistances and imposes <strong>Disadvantage on the target's next attack roll</strong>!"
        },
        {
            match: ['silver-capped quarterstaff', 'silvered quarterstaff'],
            name: "Silver-Capped Quarterstaff",
            category: "UNCOMMON SILVERED SIMPLE WEAPON • Versatile • Topple",
            origin: "Vistani Forge (102 GP) or Barovian Scholar Stash",
            desc: "An ironwood mage's staff bound at both ferrules with heavy bands of stamped silver.",
            effect: "• <strong>Damage:</strong> <code>1d6</code> (1H) / <code>1d8</code> (2H) <strong>Silvered Bludgeoning</strong>.<br>• <strong>Silvered Bane &amp; Topple Mastery:</strong> Bypasses nonmagical resistances and forces targets hit to pass a <strong>CON Save or fall Prone</strong>!"
        },
        {
            match: ['silvered firearm', 'silvered bullets'],
            name: "Silvered Bullets",
            category: "UNCOMMON SILVERED AMMUNITION • Vistani Forge / Ismark (E4)",
            origin: "Ismark's Cellar Armory (E4), Tser Pool Vistani (G) & Arasek Stockyard (N5)",
            desc: "Heavy spherical rounds cast from melted silver Barovian coins.",
            effect: "• <strong>Load Into Firearm / Sling (Bonus Action in Combat):</strong> Shots fired bypass Werewolf immunity and Vampire Spawn/Night Hag nonmagical resistance."
        },
        {
            match: ['silvered arrows'],
            name: "Silvered Arrows",
            category: "UNCOMMON SILVERED AMMUNITION • Vistani Forge (G) / Dusk Elves (N9a)",
            origin: "Tser Pool Vistani Caravan (G) & Vallaki Dusk Elf Camp (N9a)",
            desc: "Goose-fletched hunting arrows fitted with razor-edged broadheads of beaten silver.",
            effect: "• <strong>Load Into Bow Quiver (Bonus Action):</strong> Hits bypass Werewolf, Vampire Spawn &amp; Hag nonmagical damage resistance."
        },
        {
            match: ['silvered bolts', 'silvered crossbow bolts', 'rictavio\'s silvered'],
            name: "Silvered Bolts",
            category: "UNCOMMON SILVERED AMMUNITION • Vistani Forge (G) / Rictavio (N5)",
            origin: "Tser Pool Vistani Forge (G), Arasek Stockyard (N5) & Rictavio's Wagon (N5)",
            desc: "Crisp-fletched crossbow bolts plated cleanly in hammered sterling silver.",
            effect: "• <strong>Load Into Crossbow (Bonus Action):</strong> Shots bypass Werewolf, Vampire Spawn &amp; Night Hag nonmagical damage resistances."
        },
        {
            match: ['hand crossbow'],
            name: "Rictavio's Jeweled Hand Crossbow",
            category: "UNIQUE RANGED WEAPON • 1-Handed • Light • Vex",
            origin: "Rictavio's Carnival Wagon Secret Box (Vallaki Area N5)",
            desc: "A compact, silver-inlaid repeating wrist crossbow worth 250 GP to Barovian collectors.",
            effect: "• <strong>Damage:</strong> <code>1d6 + DEX</code> Piercing (<code>30/120 ft</code>, <strong>1-Handed Light</strong> — can be fired off-hand alongside a 1H sword or gun).<br>• <strong>5.5e Vex Mastery:</strong> Hitting gives Advantage on your next attack."
        },
        {
            match: ['sunburst rounds', 'ezmerelda', 'sunburst cartridges', 'sunburst bullets', 'dawn-powder'],
            name: "Sunburst Rounds",
            category: "RARE RADIANT AMMUNITION • Firearms",
            origin: "Ezmerelda's Wagon (V1) or Abbey Barracks (S19)",
            desc: "Brass paper cartridges packed with silver filings and consecrated sunburst quartz.",
            effect: "• <strong>Load Into Specific Firearm (Bonus Action in Combat / Free Pre-Combat):</strong> Grants <strong>+1 Attack &amp; +1 Damage</strong>, deals an extra <strong>+1d6 Radiant</strong> on hit, counts as <strong>Silvered</strong>, and <strong>halts Vampire Regeneration for 1 round</strong>."
        },
        {
            match: ['sunburst arrows', 'morninglord sunburst arrows'],
            name: "Sunburst Arrows",
            category: "RARE RADIANT AMMUNITION • Bows",
            origin: "Shrine of the White Sun (S4) / Ezmerelda (V1)",
            desc: "Ashwood arrows tipped with sun-forged bronze and silvered broadheads.",
            effect: "• <strong>Load Into Bow Quiver (Bonus Action):</strong> Grants <strong>+1 Attack &amp; +1 Damage</strong>, deals an extra <strong>+1d6 Radiant</strong> on hit, counts as <strong>Silvered</strong>, and <strong>halts Vampire Regeneration for 1 round</strong>."
        },
        {
            match: ['sunburst bolts', 'sunburst crossbow bolts', 'morninglord sunburst bolts'],
            name: "Sunburst Bolts",
            category: "RARE RADIANT AMMUNITION • Crossbows",
            origin: "St. Andral Sanctuary (N1) / Van Richten Stockpile (N5)",
            desc: "Heavy oak bolts winged in white swan vanes and blessed sunburst iron.",
            effect: "• <strong>Load Into Crossbow (Bonus Action):</strong> Grants <strong>+1 Attack &amp; +1 Damage</strong>, deals an extra <strong>+1d6 Radiant</strong> on hit, counts as <strong>Silvered</strong>, and <strong>halts Vampire Regeneration for 1 round</strong>."
        },
        {
            match: ['witch-iron oil', 'witch-iron vial', 'bog-witch'],
            name: "Witch-Iron Oil Vial",
            category: "RARE ENHANCEMENT VIAL • Full Magazine / Blade • Craftable (WITCH-IRON)",
            origin: "Found rarely in Berez Swamp Ruins / Iron Trunk (U3) or crafted once Carved Bog-Witch Runestone (WITCH-IRON) is learned",
            desc: "Viscous swamp-alchemical oil etched with cold hedge-magic shimmer that binds instantly to lead, steel, or brass.",
            effect: "• <strong>Coat Weapon or Full Magazine (Bonus Action / Free Pre-Combat):</strong> Press <strong>Coat</strong> in Backpack to coat either a <strong>full loaded firearm/crossbow/bow magazine</strong> (turning every round inside into +1 Hex-Iron rounds!) OR <strong>1 melee weapon</strong> for 1 hour (<strong>+1 Attack &amp; +1 Magical Damage</strong>, bypassing nonmagical resistance)."
        },
        {
            match: ['hex-iron bullets', 'witch-iron bullets', 'baba lysaga', '+1 magical sling', '+1 firearm bullets', '+1 bullets'],
            name: "Hex-Iron Bullets",
            category: "ENCHANTED AMMUNITION • +1 Hit / +1 Magical Damage",
            origin: "Coated with a Witch-Iron Oil Vial (or returned on Reload/Unload)",
            desc: "Lead-and-silver rounds shimmering with dark hedge-enchanted witch-iron.",
            effect: "• <strong>Load Into Firearm (Bonus Action):</strong> Grants a <strong>+1 bonus to Attack and Damage rolls</strong> and overcomes nonmagical resistances."
        },
        {
            match: ['incendiary oil vial', 'brimstone spark-oil', 'incendiary vial'],
            name: "Incendiary Oil Vial",
            category: "ALCHEMICAL COATING VIAL • Full Magazine / Blade • Craftable (INCENDIARY-VIAL)",
            origin: "Crafted (1x Brimstone Sulfur + 1x Pine Pitch & Lamp Oil) or bought at Arasek Stockyard / Petru Forge",
            desc: "Amber bottle of stabilized liquid brimstone formulated to glaze bullets or steel blades without fouling barrels.",
            effect: "• <strong>Coat Weapon or Magazine (Bonus Action / Free Pre-Combat):</strong> Press <strong>Coat</strong> in Backpack to coat up to <strong>10 loaded rounds</strong> (turning them into Incendiary Rounds/Arrows/Bolts) OR coat <strong>1 melee weapon</strong> for 10 minutes (<strong>+1d4 Fire damage</strong> on hit!)."
        },
        {
            match: ['incendiary rounds', 'incendiary bullets', 'brimstone bullets', 'fire bullets'],
            name: "Incendiary Rounds",
            category: "ALCHEMICAL FIRE AMMUNITION • Bought or Coated via Vial",
            origin: "Arasek Stockyard (N5), Petru Forge (G), or Coated with Incendiary Oil Vial",
            desc: "Hollow-point firearm slugs sealed with yellow brimstone paste that sparks on impact.",
            effect: "• <strong>Load Into Individual Firearm (Bonus Action):</strong> Adds <strong>+1d4 Fire damage</strong> on hit, ignites flammable objects, and disrupts regeneration stopped by flame."
        },
        {
            match: ['fire arrows', 'pitch-tipped fire arrows', 'incendiary arrows'],
            name: "Fire Arrows",
            category: "ALCHEMICAL FIRE AMMUNITION • Bows",
            origin: "Arasek Stockyard (N5), Tser Pool Caravan (G), or Coated via Incendiary Oil Vial",
            desc: "Barbed broadheads wrapped in oil-soaked pitchcloth.",
            effect: "• <strong>Load Into Bow Quiver (Bonus Action):</strong> Adds <strong>+1d4 Fire damage</strong> on hit and ignites flammable webs, thatch, or blight tendrils."
        },
        {
            match: ['fire bolts', 'fire crossbow bolts', 'brimstone fire crossbow bolts', 'incendiary bolts'],
            name: "Fire Bolts",
            category: "ALCHEMICAL FIRE AMMUNITION • Crossbows",
            origin: "Arasek Stockyard (N5), Vallaki Armory, or Coated via Incendiary Oil Vial",
            desc: "Short steel quarrels collared with striker flint and pine-pitch rings.",
            effect: "• <strong>Load Into Crossbow (Bonus Action):</strong> Adds <strong>+1d4 Fire damage</strong> on hit."
        },
        {
            match: ['poisoned bullets', 'pale tincture poisoned bullets', 'poison bullets'],
            name: "Poisoned Bullets",
            category: "TOXIC AMMUNITION • Firearms",
            origin: "Old Bonegrinder (O3), Wachterhaus Cellar, or Arrigal (N9)",
            desc: "Wax-capped bullets housing a bitter toxic serum inside a hollow tip.",
            effect: "• <strong>Load Into Firearm (Bonus Action):</strong> Deals an extra <strong>+1d6 Poison damage</strong> on hit; struck creatures must pass a <strong>DC 12 CON Save or become Poisoned</strong> until the end of their next turn."
        },
        {
            match: ['poisoned arrows', 'venom arrows', 'poison arrows', 'nightshade venom arrows'],
            name: "Poisoned Arrows",
            category: "TOXIC AMMUNITION • Bows",
            origin: "Svalich Woods Scouts / Old Bonegrinder (O3) / Vistani Camp (N9)",
            desc: "Dark green-fletched arrows grooved along the tip to hold belladonna serum.",
            effect: "• <strong>Load Into Bow Quiver (Bonus Action):</strong> Deals an extra <strong>+1d6 Poison damage</strong> on hit; target must pass a <strong>DC 12 CON Save or become Poisoned</strong> until the end of its next turn."
        },
        {
            match: ['poisoned bolts', 'venom-dipped', 'venom bolts', 'poison bolts'],
            name: "Poisoned Bolts",
            category: "TOXIC AMMUNITION • Crossbows",
            origin: "Vallaki Vistani Camp (Arrigal — Area N9)",
            desc: "Blackened iron bolts steeped in serpentine gall by Vistani assassins.",
            effect: "• <strong>Load Into Crossbow (Bonus Action):</strong> Deals an extra <strong>+1d6 Poison damage</strong> on hit; target must pass a <strong>DC 12 CON Save or become Poisoned</strong> until the end of its next turn."
        },
        {
            match: ['necrotic bullets', 'grave-salt necrotic bullets'],
            name: "Necrotic Bullets",
            category: "SHADOW AMMUNITION • Firearms",
            origin: "Ruins of Berez (U3) / Amber Temple Vaults (X40)",
            desc: "Charcoal-gray rounds packed with chilled grave salt and ground crypt bone.",
            effect: "• <strong>Load Into Firearm (Bonus Action):</strong> Deals an extra <strong>+1d6 Necrotic damage</strong> on hit, and the target <strong>cannot regain Hit Points</strong> until the start of your next turn."
        },
        {
            match: ['necrotic arrows', 'shadow-bone necrotic arrows'],
            name: "Necrotic Arrows",
            category: "SHADOW AMMUNITION • Bows",
            origin: "Dusk Elf Sanctuary / Amber Temple Vaults (X40)",
            desc: "Blackened bone-tipped arrows humming with icy Shadowfell stillness.",
            effect: "• <strong>Load Into Bow Quiver (Bonus Action):</strong> Deals an extra <strong>+1d6 Necrotic damage</strong> on hit, and the target <strong>cannot regain Hit Points</strong> until the start of your next turn."
        },
        {
            match: ['necrotic bolts', 'necrotic crossbow bolts', 'grave-salt necrotic bolts'],
            name: "Necrotic Bolts",
            category: "SHADOW AMMUNITION • Crossbows",
            origin: "Amber Temple Treasury (X40) / Ravenloft Crypts",
            desc: "Cold iron quarrels dusted in grave-salt and preserved lich-ash.",
            effect: "• <strong>Load Into Crossbow (Bonus Action):</strong> Deals an extra <strong>+1d6 Necrotic damage</strong> on hit, and the target <strong>cannot regain Hit Points</strong> until the start of your next turn."
        },
        {
            match: ['oil of sharpness'],
            name: "Oil of Sharpness",
            category: "VERY RARE COATING VIAL • Area U3",
            origin: "Baba Lysaga's Creeping Hut Chest (Berez Area U3)",
            desc: "Clear, gelatinous alchemical oil shimmering with suspended silver diamond-shards.",
            effect: "• <strong>Coat Blade or Magazine (1 Action in Combat / Free Pre-Combat):</strong> Press <strong>Coat</strong> in Backpack to buff a slashing/piercing melee blade (1 hr) OR coat the front <strong>5 rounds</strong> of a ranged weapon for <strong>+3 Attack and +3 Damage</strong>!"
        },
        {
            match: ['wyvern venom', 'wyvern-venom'],
            name: "Arrigal's Wyvern Venom Vial",
            category: "RARE LETHAL VENOM VIAL • Area N9",
            origin: "Arrigal's Assassin Belt (Vallaki Vistani Camp Area N9)",
            desc: "Concentrated amber mountain-wyvern venom bottled in slender black glass ampoules.",
            effect: "• <strong>Coat Blade or Round (Bonus Action):</strong> Press <strong>Coat</strong> in Backpack to coat a slashing/piercing melee blade (next hit) OR 1 round per dose of a loaded ranged weapon. Forces a <strong>DC 15 CON Save or takes 7d6 Poison damage</strong> (half on success)."
        },
        {
            match: ['pale tincture'],
            name: "Pale Tincture Vial",
            category: "RARE POISON COATING VIAL • Area O3",
            origin: "Old Bonegrinder Cabinet (Area O3) or Wachterhaus Cellar",
            desc: "Oily translucent hag poison that clings cleanly to cold steel and lead tips.",
            effect: "• <strong>Coat Blade or Rounds (Bonus Action):</strong> Press <strong>Coat</strong> to coat 1 slashing/piercing melee blade (1 min) OR up to 3 loaded rounds. Target makes a <strong>DC 16 CON Save or takes +1d6 Poison damage and becomes Poisoned</strong>."
        },
        {
            match: ['hag heartstone', 'night hag heartstone'],
            name: "Morgantha's Cracked Night Hag Heartstone",
            category: "RARE WONDROUS GEM • Old Bonegrinder Boss Drop",
            origin: "Old Bonegrinder Windmill (Morgantha — Session 3)",
            desc: "A lustrous jet-black stone veined with deep internal fractures, braided onto blacksinew cord.",
            effect: "• <strong>Purifying Touch (1/Day Action):</strong> Cure any 1 disease, poison, or hag nightmare curse.<br>• <strong>Soul-Tether Ward:</strong> Grants <strong>Advantage on Death Saving Throws</strong> while carried."
        },
        {
            match: ['specialty bullet sling', 'bullet sling', 'specialty cartridge rig', 'cartridge rig', 'munitions sling', 'ammo rig', 'cartridge case', 'munitions belt'],
            name: "Partitioned Bullet Sling & Pouch",
            category: "FIREARM STORAGE GEAR • 15 GP (Any Shop)",
            origin: "Bildrath's (E1), Tser Pool Outfitters (G), Arasek Stockyard (N5), or Krezk Supply (S3)",
            desc: "A rugged oiled-leather cross-body bullet sling fitted with five numbered waterproof brass compartments for storing multiple specialty bullet types safely separated.",
            effect: "• <strong>Unlocks Firearm Specialty Load:</strong> Carrying this sling in your Backpack lets you safely carry multiple specialty bullet types (<em>Silvered, Incendiary, Poisoned, Sunburst, Necrotic</em>) and unlocks the <strong>Load</strong> button on your firearms.<br>• <em>(Standard brass clips &amp; speedloaders still use your starting Gunslinger Bandolier).</em>"
        },
        {
            match: ['rictavio\'s silvered bolts', 'rictavio\'s silvered crossbow bolts'],
            name: "Rictavio's Silvered Bolts",
            category: "UNCOMMON SILVERED AMMUNITION • Area N5",
            origin: "Rictavio's Carnival Wagon Secret Chest (Vallaki Area N5)",
            desc: "Needle-pointed crossbow bolts sheathed cleanly in pure sterling silver.",
            effect: "• <strong>Load Into Crossbow (Bonus Action):</strong> Shots fired bypass Werewolf, Vampire Spawn &amp; Night Hag nonmagical damage resistances."
        },
        {
            match: ['silvered bolts', 'silvered crossbow bolts', 'silver bolts'],
            name: "Silvered Bolts",
            category: "UNCOMMON SILVERED AMMUNITION • Vistani Forge (G) / Arasek (N5)",
            origin: "Tser Pool Vistani Silver Forge (G) & Arasek Stockyard (Vallaki N5)",
            desc: "Crisp-fletched crossbow bolts plated cleanly in hammered Barovian silver.",
            effect: "• <strong>Load Into Crossbow (Bonus Action):</strong> Shots bypass Werewolf, Vampire Spawn &amp; Night Hag nonmagical damage resistances."
        },
        {
            match: ['cloak of protection'],
            name: "Cloak of Protection",
            category: "UNCOMMON WONDROUS CLOAK • Attunement Required",
            origin: "Barovian Vaults / Death House Reliquary (M34)",
            desc: "A heavy, silver-hemmed charcoal wool mantle stitched with abjuration threads.",
            effect: "• <strong>Protective Ward:</strong> Grants <strong>+1 bonus to Armor Class</strong> and <strong>+1 bonus to ALL Saving Throws</strong> while attuned."
        },
        {
            match: ['gold statuette of saint markovia', 'gold statuette'],
            name: "Gold Statuette of Saint Markovia",
            category: "UNCOMMON HOLY RELIC • Abbey of St. Markovia (S13)",
            origin: "Abbey of Saint Markovia Altar Reliquary (Krezk Area S13)",
            desc: "A fist-sized solid gold effigy of the sainted priestess Markovia (250 GP • No Attunement).",
            effect: "• <strong>Saint's Blessing:</strong> Any Good-aligned creature carrying this statuette gains a <strong>+1 bonus to ALL Saving Throws</strong>!"
        },
        {
            match: ['shard of the heart of sorrow', 'sorrow-crystal core', 'sorrow shard', 'heart of sorrow'],
            name: "Shard of the Heart of Sorrow",
            category: "LEGENDARY UNIQUE CRAFTING RELIC • Strict 1-Per-Campaign Opportunity",
            origin: "Castle Ravenloft North Tower (Recovered ONLY Upon Shattering K20 Heart of Sorrow)",
            desc: "A cold, fist-sized prism of Khazan's blood-forged ruby crystal recovered intact from the shattered ruins of Strahd's 50-HP Heart of Sorrow (Area K20) — entirely distinct from Morgantha's Night Hag Heartstone and the Winery Life-Gems.",
            effect: "• <strong>Single Campaign Opportunity (1 Only):</strong> Only ONE intact Sorrow-Crystal core can ever be salvaged before the rest dissolves into crimson mist.<br>• <strong>Legendary Recipe Reagent (<code>HEART-ELIXIR</code>):</strong> Combine <code>1x Shard of the Heart of Sorrow</code> with <code>2x Alchemical Catalyst + 1x Svalich Moonpetal Blossom + 1x Pure Spring Water</code> to distill Barovia's sole crafted <strong>Elixir of Health</strong>. Crafting consumes this crystal permanently.",
            isCraftableReagent: true
        },
        {
            match: ['elixir of health', 'elixir of life'],
            name: "Elixir of Health",
            category: "LEGENDARY REVIVAL POTION • Extra Rare (5,000 GP / 15,000 GP Royal Market)",
            origin: "Martikov Secret Loft (Area N2q) OR Heartstone Transmutation Ritual (HEART-ELIXIR)",
            desc: "A glowing golden-crimson draught radiating uncorrupted vitality and divine restoration—an ultra-rare heirloom either hidden in the Martikov loft (N2q) or distilled once via ancient Barovian alchemy.",
            effect: "• <strong>Action (Within 1 Minute of Death):</strong> Administer to a creature that has died within the last minute. The creature returns to life with <strong>Hit Points equal to half of its maximum HP (50%)</strong>, and any <strong>severed limbs are knit back together</strong>!<br>• <strong>Aftermath Penalty:</strong> The revived creature suffers a <strong>-2 penalty to all attack rolls, saving throws, and ability checks</strong> until finishing a Long Rest.<br>• <strong>Extra Rare &amp; Expensive (<code>5,000 GP</code> Base / <code>15,000 GP</code> Royal Market):</strong> Cannot be brewed from ordinary herbs—requires ancient secrets and a sacrificed Heartstone artifact."
        },
        {
            match: ['antitoxin'],
            name: "Barovian Antitoxin Tonic",
            category: "CRAFTED CONSUMABLE • Unlock Code: WOLFBANE",
            origin: "Crafted (2x Medicinal Herbs + 1x Svalich Wolfbane Root) or Apothecary (5 GP)",
            desc: "A sharp, pine-bitter purple draught brewed to neutralize swamp serpents, spider venom, and hag toxins.",
            effect: "• <strong>Action to Drink (1-Hour Duration):</strong> Grants <strong>Advantage on Saving Throws against Poison</strong> (and against the Poisoned condition) for <strong>1 full hour</strong>."
        },
        {
            match: ['liquid silver'],
            name: "Liquid Silver Vial",
            category: "CRAFTED COATING VIAL • Unlock Code: SILVER-COAT",
            origin: "Crafted (1x Powdered Silver Dust + 1x Pine Pitch & Lamp Oil) or Bought (25 GP)",
            desc: "A swirling glass phial of pure silver filings suspended in amber pine resin oil.",
            effect: "• <strong>Coat Melee Blade or Full Magazine (Bonus Action / Free Pre-Combat):</strong> Press <strong>Coat</strong> in Backpack to coat either <strong>1 melee weapon</strong> (1 hour) OR a <strong>full loaded magazine (up to 10 rounds)</strong>. Coated weapons &amp; rounds count as <strong>Silvered</strong> (remaining coated rounds return as Silvered Bullets/Arrows/Bolts on Reload/Unload)."
        },
        {
            match: ['alchemist\'s fire'],
            name: "Alchemist's Fire Flask",
            category: "CRAFTED TACTICAL WEAPON • Unlock Code: BRIMSTONE",
            origin: "Crafted (1x Brimstone Sulfur + 1x Pine Pitch & Lamp Oil) / Area V1",
            desc: "A wax-sealed clay flask packed with volatile sulfur pitch that bursts into clinging flame on impact.",
            effect: "• <strong>Action (Ranged Attack, 20 ft):</strong> On a hit, the target takes <strong>1d4 Fire damage at the start of each of its turns</strong> until a creature uses an Action to pass a <strong>DC 10 DEX Check</strong> to extinguish the flames."
        },
        {
            match: ['phosphor'],
            name: "Alchemical Phosphor Flash-Bomb",
            category: "CRAFTED TACTICAL GADGET • Unlock Code: PHOSPHOR / Area V1",
            origin: "Crafted (1x Brimstone + 1x Silver Dust + 1x Catalyst) / Ezmerelda's Wagon V1",
            desc: "A brass-seamed glass sphere packed with white phosphorus, magnesium flakes, and powdered silver.",
            effect: "• <strong>Action (Throw 30 ft, 10-ft Radius):</strong> Targets make a <strong>DC 13 DEX or CON Save</strong> or take <strong>2d6 Fire/Radiant damage</strong> and are <strong>Blinded until the end of their next turn</strong> (also illuminates magical blood-mist &amp; invisible foes!)."
        },
        {
            match: ['smoke bomb'],
            name: "Ash-Cloud Smoke Bomb",
            category: "CRAFTED TACTICAL GADGET • Unlock Code: ASH-CLOUD",
            origin: "Crafted (1x Brimstone Sulfur + 1x Medicinal Herbs)",
            desc: "A tight gray clay sphere filled with dry herbs and sulfur dust.",
            effect: "• <strong>Action (Throw up to 30 ft):</strong> Bursts into a <strong>15-foot-radius cloud of thick smoke</strong> lasting <strong>1 minute</strong> (or 1 round in strong wind). The area is <strong>Heavily Obscured</strong>, breaking enemy sightlines and covering Stealth or retreats."
        },
        {
            match: ['sun-ash'],
            name: "Sun-Ash Vial",
            category: "CRAFTED SACRED COATING VIAL • Unlock Code: SUN-ASH",
            origin: "Crafted (1x Moonpetal + 1x Silver Dust + 1x Pure Spring Water)",
            desc: "A luminous pale-gold salve infused with dawn-remembering Moonpetal and consecrated silver.",
            effect: "• <strong>Coat Weapon or Front Rounds (Bonus Action / Pre-Combat):</strong> Press <strong>Coat</strong> to coat <strong>1 melee weapon</strong> (10 min) OR front <strong>6 rounds</strong>. Hits deal an extra <strong>+1d4 Radiant damage</strong> (and halt regeneration on Crit)."
        },
        {
            match: ['potion of superior healing'],
            name: "Potion of Superior Healing",
            category: "RARE HEAL CONSUMABLE • Unlock Code: MOONPETAL",
            origin: "Crafted (4x Herbs + 2x Catalyst + 1x Moonpetal) or Abbey S13 (45 GP)",
            desc: "A glowing scarlet elixir distilled from rare Moonpetal petals and concentrated alembic salts.",
            effect: "• <strong>Bonus Action (Self) / Action (Ally):</strong> Restores <strong>8d4 + 8 Hit Points (Avg 28 HP)</strong> — caps strictly at Max HP (does not grant Temporary HP)."
        },
        {
            match: ['potion of false vitality', 'false vitality'],
            name: "Potion of False Vitality",
            category: "TEMP HP CONSUMABLE • Common/Uncommon (6 GP)",
            origin: "Tser Pool Vistani Apothecary (G) / Vallaki Arasek Stockyard (N5)",
            desc: "A chill cobalt-silver vial swirling with ghostly frost-motes reminiscent of the False Life spell.",
            effect: "• <strong>Bonus Action (Self) / Action (Ally):</strong> Grants <strong>1d6 + 4 Temporary Hit Points (Avg 7.5)</strong> lasting <strong>1 hour</strong>.<br>• <strong>Standard 5e Rule:</strong> Does not restore actual HP and <strong>does not stack</strong> with existing Temporary HP (keeps whichever pool is higher).",
            useViaRpg: true,
            useBtnClass: "btn-act-temp",
            useBtnLabel: "🛡️ Drink 1 (+1d6+4 Temp HP)"
        },
        {
            match: ['vistani stag-blood tonic', 'stag-blood tonic', 'stag blood tonic'],
            name: "Vistani Stag-Blood Tonic",
            category: "TEMP HP CONSUMABLE • Uncommon (18 GP)",
            origin: "Vistani Encampments (G / N9) / Ezmerelda's Wagon (V1)",
            desc: "A hot, spiced crimson-amber cordial brewed from mountain pine resin, wild heart-root, and winter stag vigor.",
            effect: "• <strong>Bonus Action (Self) / Action (Ally):</strong> Grants <strong>2d6 + 4 Temporary Hit Points (Avg 11)</strong> for <strong>1 hour</strong> (5e non-stacking — keeps the higher pool) AND <strong>Advantage on your next Strength or Constitution Saving Throw</strong> within the hour.<br>• Does not restore missing HP.",
            useViaRpg: true,
            useBtnClass: "btn-act-temp",
            useBtnLabel: "🩸 Drink 1 (+2d6+4 Temp HP)"
        },
        {
            match: ["morninglord's overflow elixir", 'morninglord overflow elixir', 'overflow elixir'],
            name: "Morninglord's Overflow Elixir",
            category: "OVERHEAL CONSUMABLE • Uncommon (12 GP)",
            origin: "Church of the Morninglord (E5) / St. Andral's (N1) / Blue Water Inn (N2q)",
            desc: "A warm rose-gold draught flecked with liquid dawn-amber that seals wounds and wraps surplus vitality into a shimmering ward.",
            effect: "• <strong>Bonus Action (Self) / Action (Ally):</strong> Restores <strong>2d6 + 2 Hit Points (Avg 9 HP)</strong>.<br>• <strong>Overheal Ward (1 Hour):</strong> Any healing beyond your Max HP converts into <strong>Temporary Hit Points</strong> lasting <strong>1 hour</strong> (5e non-stacking — replaces lower Temp HP, never stacks).",
            useViaRpg: true,
            useBtnClass: "btn-act-heal",
            useBtnLabel: "✨ Drink 1 (2d6+2 HP ➔ Temp)"
        },
        {
            match: ['sun-spun aegis draught', 'sun spun aegis draught', 'aegis draught'],
            name: "Sun-Spun Aegis Draught",
            category: "OVERHEAL CONSUMABLE • Rare (38 GP)",
            origin: "Abbey of St. Markovia (S13) / Argynvostholt (Q28) / Amber Temple (X)",
            desc: "An iridescent golden-crimson phial infused with consecrated dawn-salts, bottled for sieges against Barovia's apex predators.",
            effect: "• <strong>Bonus Action (Self) / Action (Ally):</strong> Restores <strong>4d4 + 4 Hit Points (Avg 14 HP)</strong>.<br>• <strong>Overheal Aegis (1 Hour):</strong> Any healing beyond your Max HP converts into <strong>Temporary Hit Points</strong> lasting <strong>1 hour</strong> (5e non-stacking — keeps whichever Temp HP pool is higher).",
            useViaRpg: true,
            useBtnClass: "btn-act-heal",
            useBtnLabel: "🌟 Drink 1 (4d4+4 HP ➔ Temp)"
        },
        {
            match: ['carved bog-witch runestone', 'bog-witch runestone'],
            name: "Carved Bog-Witch Runestone",
            category: "RARE RECIPE SLAB • Code: WITCH-IRON",
            origin: "Ruins of Berez Marsh Altar (U) or Hut Strongbox (U3)",
            desc: "A thumb-sized river slate scratched with spiral witch-knots describing how alembic salt, silver dust, and wolfbane bind magic into oil.",
            effect: "• <strong>Study in Backpack:</strong> Unlocks the <strong>Witch-Iron Oil Vial</strong> recipe permanently on your Crafting Workbench (<code>1x Powdered Silver Dust + 1x Alchemical Catalyst + 1x Wolfbane Root</code>)."
        },
        {
            match: ['charred brimstone ignition slate', 'ignition slate'],
            name: "Charred Brimstone Ignition Slate",
            category: "RECIPE FORMULA • Code: INCENDIARY-VIAL",
            origin: "Arasek Stockyard / Petru Forge / Blinsky Bench (180 GP Investment)",
            desc: "Soot-smudged tin-and-slate workshop plate etched with ratios for suspended liquid-fire oil.",
            effect: "• <strong>Study in Backpack:</strong> Unlocks the <strong>Incendiary Oil Vial</strong> recipe permanently on your Crafting Workbench (<code>1x Brimstone Sulfur + 1x Pine Pitch &amp; Lamp Oil</code>)."
        },
        {
            match: ['silver-suspend foundry ledger', 'foundry ledger'],
            name: "Petru's Silver-Suspend Foundry Ledger",
            category: "RECIPE FORMULA • Code: SILVER-COAT",
            origin: "Tser Pool Vistani Forge (G) / Rictavio's Ledger (N5) (200 GP Investment)",
            desc: "Copper-clasp smithing notebook detailing silver filing suspension in clear pine oil.",
            effect: "• <strong>Study in Backpack:</strong> Unlocks the <strong>Liquid Silver Vial</strong> recipe permanently on your Crafting Workbench (<code>1x Powdered Silver Dust + 1x Pine Pitch &amp; Lamp Oil</code>)."
        },
        {
            match: ['amber temple heartstone wall-rubbing', 'heartstone wall-rubbing'],
            name: "Amber Temple Heartstone Wall-Rubbing",
            category: "LEGENDARY RECIPE TRANSCRIPT • Code: HEART-ELIXIR",
            origin: "Amber Temple Library Soot Mural (X30) / Exethanter (X27) / Abbot (S13)",
            desc: "Charcoal-on-parchment rubbing capturing Khazan-era transmutation sigils for shattering a living crystal Heartstone.",
            effect: "• <strong>Study in Backpack:</strong> Unlocks the <strong>Elixir of Health</strong> recipe permanently on your Crafting Workbench."
        },
        {
            match: ['treated pelt', 'dire-pelt', 'waxed canvas'],
            name: "Treated Dire-Pelt & Waxed Canvas Bundle",
            category: "CRAFTING MATERIAL • Hunt (DC 13 Survival) / Shop (4–6 GP)",
            origin: "Dire Wolf Skinning, Ruined Coach Tarps, Bildrath's E1, Tser Pool G & Arasek N5",
            desc: "Heavy double-stitched waxed sailcloth layered with thick gray Dire Wolf hide.",
            effect: "• <strong>Crafting Ingredient:</strong> Requires <code>2x</code> bundles (plus Pine Pitch, Wolfbane &amp; Silver Dust) to craft a <strong>Mist-Ward Traveler's Camp Kit</strong> (<code>MIST-CAMP</code>).",
            isCraftableReagent: true
        },
        {
            match: ['alchemical catalyst', 'catalyst'],
            name: "Alchemical Catalyst",
            category: "RARE CRAFTING MATERIAL • 25–40 GP / Arcane Labs",
            origin: "Old Bonegrinder Lab, Wachterhaus Cellar, Vallaki Apothecary & Abbey S13",
            desc: "Crystalline crimson alembic salts that violently concentrate ordinary herbal infusions.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Potion of Greater Healing</strong> (<code>GREATER-HEAL</code>), <strong>Witch-Iron Oil Vial</strong> (<code>WITCH-IRON</code>), <strong>Phosphor Flash-Bomb</strong> (<code>PHOSPHOR</code>), <strong>Potion of Superior Healing</strong> (<code>MOONPETAL</code>), and <strong>Elixir of Health</strong> (<code>HEART-ELIXIR</code>).",
            isCraftableReagent: true
        },
        {
            match: ['silver dust'],
            name: "Powdered Silver Dust",
            category: "UNCOMMON CRAFTING MATERIAL • 15–25 GP (or 25 SP Filed)",
            origin: "Tser Pool Vistani (15 GP), Arasek Stockyard (20 GP), Bildrath's (25+ GP)",
            desc: "Fine moon-bright silver filings sealed inside waxed vellum.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Holy Water</strong> (<code>MORNINGLORD</code>), <strong>Liquid Silver Vial</strong> (<code>SILVER-COAT</code>), <strong>Witch-Iron Oil Vial</strong> (<code>WITCH-IRON</code>), <strong>Phosphor Flash-Bomb</strong> (<code>PHOSPHOR</code>), <strong>Mist-Ward Camp Kit</strong> (<code>MIST-CAMP</code>), and <strong>Sun-Ash Vial</strong> (<code>SUN-ASH</code>).",
            isCraftableReagent: true
        },
        {
            match: ['wolfbane'],
            name: "Svalich Wolfbane Root",
            category: "COMMON FORAGE MATERIAL • DC 12 Nature / 2 GP",
            origin: "Svalich Woods Pine Ridges & Werewolf Trails",
            desc: "Pungent purple-hooded wildflower root hung over Barovian barn doors against wolves.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Barovian Antitoxin Tonic</strong> (<code>WOLFBANE</code>), <strong>Witch-Iron Oil Vial</strong> (<code>WITCH-IRON</code>), and <strong>Mist-Ward Camp Kit</strong> (<code>MIST-CAMP</code>).",
            isCraftableReagent: true
        },
        {
            match: ['sulfur', 'brimstone'],
            name: "Brimstone & Pitch Sulfur",
            category: "COMMON SHOP / SALVAGE MATERIAL • 3–5 GP",
            origin: "Vallaki Smithy, Blinsky's Workshop & Old Bonegrinder Kilns",
            desc: "Sharp yellow brimstone chunks smelling of struck flint and alchemical smoke.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Incendiary Oil Vial</strong> (<code>INCENDIARY-VIAL</code>), <strong>Alchemist's Fire Flask</strong> (<code>BRIMSTONE</code>), <strong>Ash-Cloud Smoke Bomb</strong> (<code>ASH-CLOUD</code>), and <strong>Phosphor Flash-Bomb</strong> (<code>PHOSPHOR</code>).",
            isCraftableReagent: true
        },
        {
            match: ['pitch oil', 'lamp oil'],
            name: "Pine Pitch & Lamp Oil Flask",
            category: "COMMON SHOP / FORAGE MATERIAL • 5 SP–1 GP / DC 11 Survival",
            origin: "General Stores & Scarred Svalich Evergreens",
            desc: "Thick amber pine resin blended with lantern oil.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Incendiary Oil Vial</strong> (<code>INCENDIARY-VIAL</code>), <strong>Alchemist's Fire Flask</strong> (<code>BRIMSTONE</code>), <strong>Liquid Silver Vial</strong> (<code>SILVER-COAT</code>), and waterproofing <strong>Mist-Ward Camp Kit</strong> (<code>MIST-CAMP</code>).",
            isCraftableReagent: true
        },
        {
            match: ['moonpetal'],
            name: "Svalich Moonpetal Blossom",
            category: "VERY RARE DUSK FORAGE • DC 15 Nature",
            origin: "Drowned Ruins of Berez, Yester Hill & Lake Baratok at Dusk",
            desc: "Ghost-white luminescent petals that open only in misty twilight.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Potion of Superior Healing</strong> (<code>MOONPETAL</code>), <strong>Sun-Ash Vial</strong> (<code>SUN-ASH</code>), and <strong>Elixir of Health</strong> (<code>HEART-ELIXIR</code>).",
            isCraftableReagent: true
        },
        {
            match: ['spring water', 'mountain spring water'],
            name: "Pure Mountain Spring Water",
            category: "COMMON FORAGE MATERIAL • DC 10 Survival / 2 SP",
            origin: "Tser Falls, Luna River & White Sun Spring",
            desc: "Crystal-clear glacier melt free of Barovia's bog rot.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Morninglord Holy Water</strong> (<code>MORNINGLORD</code>), <strong>Sun-Ash Vial</strong> (<code>SUN-ASH</code>), and <strong>Elixir of Health</strong> (<code>HEART-ELIXIR</code>).",
            isCraftableReagent: true
        },
        {
            match: ['linen wrap', 'salve jar'],
            name: "Clean Linen Wraps & Salve Jar",
            category: "CAMP MEDICAL SUPPLY • 2 SP",
            origin: "Village Homes, Blue Water Inn & Krezk Cottages",
            desc: "Freshly boiled white cloth strips sealed in beeswax salve.",
            effect: "• <strong>Camp Medical Utility:</strong> Lets any ally assist with crafting <strong>Field Healing Bandages</strong> during a Short Rest, or double bandage yield on a <code>DC 14 Medicine</code> check.",
            isCraftableReagent: true
        },
        {
            match: ['monster trophy', 'spawn ash', 'wolf fang'],
            name: "Harvested Monster Trophy",
            category: "HUNTER HARVEST • Barter Material",
            desc: "Dark ichor vials, obsidian wolf fangs, and silver-charred vampire cinders.",
            effect: "• <strong>Barter Value:</strong> Trade to apothecaries, hunters, or occultists for gold, silvered ammo, or alchemical reagents.",
            isCraftableReagent: true
        },
        // --- NEW, REBALANCED & SPLIT WEAPON ATTACHMENTS (ZERO LOCATION SPOILERS!) ---
        // DM-Upgraded Enhanced Attachments FIRST so they never match base entries!
        {
            match: ['enhanced van richten\'s silver-runed scope', 'enhanced silver-runed scope'],
            name: "Enhanced Van Richten's Silver-Runed Scope",
            category: "VERY RARE WEAPON ATTACHMENT • Optic / Sight Slot",
            desc: "A masterwork etched brass telescopic sight recalibrated with silver-crystal lenses that pierce mist and reveal hidden ethereal foes.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Attack rolls</strong>, <strong>Mist-Piercing Sight</strong>, and highlights invisible or ethereal creatures within <strong>30 feet</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Initiative</strong> while equipped (heavy masterwork sighting tube)."
        },
        {
            match: ['enhanced clockwork rifled barrel', 'enhanced van richten\'s clockwork'],
            name: "Enhanced Clockwork Rifled Barrel",
            category: "VERY RARE WEAPON ATTACHMENT • Barrel / Magazine Slot",
            desc: "A precision-lapped silver-lined rifled barrel tuned to peak chamber velocity with reinforced silver-steel walls.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Damage rolls</strong> and treats all shots fired as <strong>Magical &amp; Silvered</strong>.<br>• <strong>Trade-Off:</strong> Reduces weapon <strong>Max Magazine Capacity by -1</strong> (thick silver-rifled sleeve)."
        },
        {
            match: ['enhanced amber-inlaid focusing collar', 'enhanced focusing collar'],
            name: "Enhanced Amber-Inlaid Focusing Collar",
            category: "VERY RARE WEAPON ATTACHMENT • Arcane Core / Crown Slot",
            desc: "A masterwork amber-and-brass focusing collar harmonized to channel intense spellcraft.",
            effect: "• <strong>Arcane Core/Crown Slot (Staff / Dagger):</strong> Grants <strong>+2 to Spell Attack rolls</strong> and <strong>+2 to Weapon Attack rolls</strong> while equipped."
        },
        {
            match: ['masterwork silver-runed hilt', 'masterwork hilt counterweight'],
            name: "Masterwork Silver-Runed Hilt Counterweight",
            category: "RARE WEAPON ATTACHMENT • Hilt / Pommel Slot",
            desc: "A perfected sterling counterweight pommel inlaid with wolf-ward silver sigils for razor-fast draw and control.",
            effect: "• <strong>Hilt Slot (Melee):</strong> Grants <strong>+1 to Attack rolls</strong>, <strong>+1 to Initiative</strong>, and treats strikes as <strong>Silvered</strong>."
        },
        {
            match: ['reforged counterbalance edge-guard', 'reforged edge-guard'],
            name: "Reforged Counterbalance Edge-Guard",
            category: "VERY RARE WEAPON ATTACHMENT • Edge / Guard Slot",
            desc: "A master-forged edge guard tempered for devastating follow-through and clean blade parries.",
            effect: "• <strong>Edge/Guard Slot (Blade):</strong> Grants <strong>+2 to Damage rolls</strong>, <strong>+1 to Armor Class</strong> while wielded, and treats strikes as <strong>Magical</strong>."
        },
        {
            match: ['awakened vistani bloodwell', 'awakened bloodwell'],
            name: "Awakened Vistani Bloodwell Vial",
            category: "VERY RARE SORCERER FOCUS • Attunement",
            desc: "An awakened crimson glass vial resonating deeply with innate sorcerous blood.",
            effect: "• <strong>Spellcasting Focus (Attunement):</strong> Grants <strong>+2 to Spell Save DC and Spell Attack rolls</strong>, and restores <strong>5 Sorcery Points</strong> when spending Hit Dice on a Short Rest (1/dawn)."
        },
        // SLOT 1 RANGED: OPTIC / SIGHT (Accuracy, Initiative & Vision)
        {
            match: ['solmere hair-line iron sights', 'hair-line iron sights', 'iron sights'],
            name: "Solmere Hair-Line Iron Sights",
            category: "COMMON WEAPON ATTACHMENT • Optic / Sight Slot",
            desc: "Ultra-fine notched steel iron sights built for deliberate precision marksmanship.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Attack rolls</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Damage rolls</strong> (requires lighter powder loads to hold tight sight alignment)."
        },
        {
            match: ['vistani quick-snap bead sight', 'quick-snap bead', 'snap bead sight'],
            name: "Vistani Quick-Snap Bead Sight",
            category: "COMMON WEAPON ATTACHMENT • Optic / Sight Slot",
            desc: "A bright brass-and-enamel front bead tuned for instantaneous hip-draw target acquisition.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Initiative</strong> while equipped.<br>• <strong>Trade-Off:</strong> <strong>-1 to Damage rolls</strong> (built for quick snap shots rather than braced aim)."
        },
        {
            match: ['dusk-quartz night scope', 'dusk-quartz'],
            name: "Dusk-Quartz Night Scope",
            category: "UNCOMMON WEAPON ATTACHMENT • Optic / Sight Slot",
            desc: "A smoky twilight-quartz lens that amplifies faint starlight through fog and gloom.",
            effect: "• <strong>Bonus:</strong> Grants <strong>Mist-Piercing Sight</strong> and negates Dim Light / Darkness penalties out to <strong>60 feet</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Attack rolls</strong> if firing in Bright Sunlight (lens glare)."
        },
        {
            match: ['balinok frost-lens hunter\'s sight', 'frost-lens hunter', 'frost-lens'],
            name: "Balinok Frost-Lens Hunter's Sight",
            category: "UNCOMMON WEAPON ATTACHMENT • Optic / Sight Slot",
            desc: "A glacial crystal lens etched with alpine tracking marks that outline warm blood and dark silhouettes through blizzard haze.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Attack rolls</strong> and <strong>60-ft Thermal / Mist Sight</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Initiative</strong> while equipped (slow precision reticle calibration)."
        },
        {
            match: ['van richten\'s silver-runed scope', 'silver-runed scope'],
            name: "Van Richten's Silver-Runed Scope",
            category: "RARE WEAPON ATTACHMENT • Optic / Sight Slot",
            desc: "An etched brass telescopic sight ground with silver-dusted lenses designed to pierce thick Barovian fog.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Attack rolls</strong> and <strong>Mist-Piercing Sight</strong> (ignores mist and fog obscurity).<br>• <strong>Trade-Off:</strong> <strong>-1 to Initiative</strong> while equipped (heavy telescopic sighting tube)."
        },
        {
            match: ['amber temple astral-prism scope', 'astral-prism scope', 'astral-prism'],
            name: "Amber Temple Astral-Prism Scope",
            category: "VERY RARE ENDGAME ATTACHMENT • Optic / Sight Slot",
            desc: "A faceted amber-quartz scope floating inside dark brass gimbals that slows perceived motion a heartbeat before you pull the trigger.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Attack rolls</strong>, <strong>+2 to Initiative</strong>, and <strong>Mist / Dark Sight</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Armor Class</strong> while equipped (narrow arcane tunnel-vision)."
        },
        // SLOT 2 RANGED: BARREL / MAGAZINE / MECHANISM (Damage, Elemental Dice, Mag & Silencer)
        {
            match: ['extended brass speed-cylinder', 'speed-cylinder', 'extended magazine'],
            name: "Extended Brass Speed-Cylinder",
            category: "UNCOMMON WEAPON ATTACHMENT • Barrel / Magazine Slot",
            desc: "An oversized machined brass drum/clip assembly that holds extra rounds ready.",
            effect: "• <strong>Bonus:</strong> Increases weapon <strong>Max Magazine Capacity by +2</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Attack rolls</strong> from front-heavy balance."
        },
        {
            match: ['clockwork draw-cam', 'draw-cam', 'hair trigger'],
            name: "Clockwork Draw-Cam & Hair Trigger",
            category: "UNCOMMON WEAPON ATTACHMENT • Barrel / Mechanism Slot",
            desc: "A taut torsion cam and heavy sear assembly engineered for snapping high-impact ranged shots.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Damage rolls</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Attack rolls</strong> (heavy trigger/draw tension)."
        },
        {
            match: ['overbore siege barrel', 'siege barrel'],
            name: "Overbore Siege Barrel",
            category: "UNCOMMON WEAPON ATTACHMENT • Barrel / Magazine Slot",
            desc: "A thick-walled heavy-gauge cannon barrel bored for brutal stopping power.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Damage rolls</strong>.<br>• <strong>Trade-Off:</strong> Reduces weapon <strong>Max Magazine Capacity by -2</strong>."
        },
        {
            match: ['ash-steel silencer shroud', 'silencer shroud'],
            name: "Vistani Ash-Steel Silencer Shroud",
            category: "RARE WEAPON ATTACHMENT • Barrel / Magazine Slot",
            desc: "A baffled dark-steel suppressor tube packed with silver mesh to deaden gunfire.",
            effect: "• <strong>Bonus:</strong> <strong>Silences gunfire</strong> (no 300-ft audible boom) and treats shots as <strong>Silvered</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Damage rolls</strong> from reduced muzzle velocity."
        },
        {
            match: ['clockwork rifled barrel', 'van richten\'s clockwork barrel', 'clockwork barrel'],
            name: "Van Richten's Clockwork Rifled Barrel",
            category: "RARE WEAPON ATTACHMENT • Barrel / Magazine Slot",
            desc: "A fluted cold-steel rifled barrel lined with silver threading to spin heavy slugs cleanly.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Damage rolls</strong> and treats all shots fired as <strong>Magical &amp; Silvered</strong>.<br>• <strong>Trade-Off:</strong> Reduces weapon <strong>Max Magazine Capacity by -1</strong> (heavy silver-rifled sleeve)."
        },
        {
            match: ['storm-coil arc barrel', 'storm-coil', 'arc barrel'],
            name: "Storm-Coil Arc Barrel",
            category: "RARE MAGICAL ATTACHMENT • Barrel / Magazine Slot",
            desc: "Copper lightning coils braided tightly along a blackened rifle shroud that charge every slug with cracking stormfire.",
            effect: "• <strong>Bonus:</strong> Adds <strong>+1d4 Lightning damage</strong> on every hit and treats shots as <strong>Magical</strong>.<br>• <strong>Trade-Off (Static Crack):</strong> Imposes <strong>Disadvantage on Stealth checks</strong> while equipped."
        },
        {
            match: ['consecrated dawn-forged rifled barrel', 'dawn-forged rifled barrel', 'dawn-forged barrel'],
            name: "Consecrated Dawn-Forged Rifled Barrel",
            category: "VERY RARE ENDGAME ATTACHMENT • Barrel / Magazine Slot",
            desc: "A gleaming sun-silver rifled barrel engraved with sacred prayers that ignites rounds into streaks of pale gold dawnlight.",
            effect: "• <strong>Bonus:</strong> Adds <strong>+1d6 Radiant damage</strong> on every hit and treats shots as <strong>Silvered &amp; Magical</strong>.<br>• <strong>Trade-Off:</strong> Reduces weapon <strong>Max Magazine Capacity by -1</strong> and imposes <strong>Disadvantage on Stealth checks</strong> (brilliant muzzle flash)."
        },
        // SLOT 1 MELEE: HILT / POMMEL (Handling, Speed, Initiative & Attack Accuracy)
        {
            match: ['vistani suede counter-grip', 'suede counter-grip'],
            name: "Vistani Suede Counter-Grip",
            category: "COMMON WEAPON ATTACHMENT • Hilt / Pommel Slot",
            desc: "Supple cross-stitched leather grip wrap balanced for lightning-quick blade control.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Attack rolls</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Damage rolls</strong> (lightened finesse leverage)."
        },
        {
            match: ['quicksilver quick-draw pommel', 'quicksilver pommel', 'quick-draw pommel'],
            name: "Quicksilver Quick-Draw Pommel",
            category: "COMMON WEAPON ATTACHMENT • Hilt / Pommel Slot",
            desc: "A sealed hollow silver pommel filled with shifting mercury that snaps the blade instantly out of its scabbard.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Initiative</strong> while equipped.<br>• <strong>Trade-Off:</strong> <strong>-1 to Damage rolls</strong> (feather-light counter-balance)."
        },
        {
            match: ['silver-runed hilt', 'hilt counterweight'],
            name: "Silver-Runed Hilt Counterweight",
            category: "UNCOMMON WEAPON ATTACHMENT • Hilt / Pommel Slot",
            desc: "Stamped sterling-silver pommel collar balanced cleanly for swords, axes, maces, and spears.",
            effect: "• <strong>Hilt Slot (Melee):</strong> Grants <strong>+1 to Attack rolls</strong> and makes the weapon count as <strong>Silvered</strong> (bypassing Werewolf, Vampire Spawn &amp; Hag nonmagical resistances)."
        },
        {
            match: ['sunstone pommel', 'pommel gem'],
            name: "Morninglord Sunstone Pommel Gem",
            category: "RARE SACRED ATTACHMENT • Hilt / Pommel Slot",
            desc: "A warm, facet-cut sunburst ruby set inside a brass pommel socket consecrated with dawn prayers to steady the wielder's hand.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Attack rolls</strong>, <strong>+1 to Initiative</strong>, and sheds 10-ft golden light on command.<br>• <strong>Trade-Off:</strong> Imposes <strong>Disadvantage on Stealth checks</strong> while lit."
        },
        {
            match: ['blood-thorn barbed hilt', 'barbed hilt'],
            name: "Blood-Thorn Barbed Hilt",
            category: "RARE WEAPON ATTACHMENT • Hilt / Pommel Slot",
            desc: "Dark iron brambles coiled around the grip that drink drops of blood to guide every thrust cleanly to vital openings.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Attack rolls</strong>.<br>• <strong>Trade-Off (Self-Bite):</strong> Whenever you roll a natural <strong>1–3</strong> on an attack roll with this weapon, the thorns bite your palm for <strong>1 HP</strong>."
        },
        {
            match: ['argynvost vanguard sovereign pommel', 'vanguard sovereign pommel', 'vanguard pommel'],
            name: "Argynvost Vanguard Sovereign Pommel",
            category: "VERY RARE ENDGAME ATTACHMENT • Hilt / Pommel Slot",
            desc: "A sculpted silver dragon-claw pommel forged for frontline duelists who strike first before monsters can breathe.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Attack rolls</strong>, <strong>+2 to Initiative</strong>, and treats strikes as <strong>Silvered</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Armor Class</strong> while equipped (aggressive forward duelist stance)."
        },
        // SLOT 2 MELEE: EDGE / GUARD (Damage, Elemental Dice, AC & Penetration)
        {
            match: ['heavy cleaver spine-weight', 'cleaver spine-weight', 'lead-core breaker pommel', 'breaker pommel'],
            name: "Heavy Cleaver Spine-Weight",
            category: "COMMON WEAPON ATTACHMENT • Edge / Guard Slot",
            desc: "A dense lead-weighted steel collar clamped along the blade back to turn every swing into a bone-crushing cleave.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Damage rolls</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Attack rolls</strong> (heavier forward swing inertia)."
        },
        {
            match: ['counterbalance edge-guard', 'honed counterbalance', 'edge-guard'],
            name: "Honed Counterbalance Edge-Guard",
            category: "UNCOMMON WEAPON ATTACHMENT • Edge / Guard Slot",
            desc: "Micro-serrated tungsten spine guard and weight-tuned tang clamp engineered for clean cutting bite.",
            effect: "• <strong>Edge/Guard Slot (Blade):</strong> Grants <strong>+1 to Damage rolls</strong> and treats strikes as <strong>Magical</strong>."
        },
        {
            match: ['argynvost bastion crossguard', 'bastion crossguard'],
            name: "Argynvost Bastion Crossguard",
            category: "UNCOMMON WEAPON ATTACHMENT • Edge / Guard Slot",
            desc: "A wide fluted steel basket-guard forged to turn aside vampire claws and warhammers.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Armor Class</strong> while wielding this weapon.<br>• <strong>Trade-Off:</strong> <strong>-1 to Attack rolls</strong> from the bulky guard."
        },
        {
            match: ['barbed wolf-tooth edge spine', 'wolf-tooth edge spine', 'edge spine'],
            name: "Barbed Wolf-Tooth Edge Spine",
            category: "UNCOMMON WEAPON ATTACHMENT • Edge / Guard Slot",
            desc: "A serrated steel spine bolted along the back of a blade with wicked jagged hooks.",
            effect: "• <strong>Bonus:</strong> Adds <strong>+1d4 Piercing damage</strong> on every hit.<br>• <strong>Trade-Off:</strong> <strong>-1 to Attack rolls</strong> (barbs snag on loose swings)."
        },
        {
            match: ['rime-etched balinok edge-fuller', 'balinok edge-fuller', 'edge-fuller'],
            name: "Rime-Etched Balinok Edge-Fuller",
            category: "UNCOMMON MAGICAL ATTACHMENT • Edge / Guard Slot",
            desc: "A pale steel fuller-rail engraved with frost runes that trails icy vapor along the flat of the blade.",
            effect: "• <strong>Bonus:</strong> Adds <strong>+1d4 Cold damage</strong> on every hit and counts as <strong>Magical</strong>.<br>• <strong>Trade-Off (Brittle Chill):</strong> On a <strong>Natural 1</strong> attack roll, rime locks your wrist, imposing <strong>-1 AC</strong> until the start of your next turn."
        },
        {
            match: ['cinder-forged hearthguard', 'hearthguard'],
            name: "Cinder-Forged Hearthguard",
            category: "UNCOMMON MAGICAL ATTACHMENT • Edge / Guard Slot",
            desc: "A blackened iron quillon collar inlaid with slow-burning ember veins that ignite the blade's edge on impact.",
            effect: "• <strong>Bonus:</strong> Adds <strong>+1d4 Fire damage</strong> on every hit and counts as <strong>Magical</strong>.<br>• <strong>Trade-Off (Ember Glow):</strong> Sheds dim fiery light (10 ft) and imposes <strong>Disadvantage on Stealth checks</strong> while equipped."
        },
        {
            match: ['argynvost frostfire dragon-wing guard', 'frostfire dragon-wing', 'dragon-wing guard'],
            name: "Argynvost Frostfire Dragon-Wing Guard",
            category: "RARE MAGICAL ATTACHMENT • Edge / Guard Slot",
            desc: "Swept silver dragon-wing crossguards blazing with pale blue-white starlight forged by paladin bladesmiths.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Armor Class</strong>, adds <strong>+1d4 Radiant damage</strong> on hit, and treats strikes as <strong>Silvered &amp; Magical</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Initiative</strong> while equipped (heavy ornate silver wings)."
        },
        {
            match: ['mourning-iron soul-serrated edge', 'soul-serrated edge', 'mourning-iron'],
            name: "Mourning-Iron Soul-Serrated Edge",
            category: "RARE MAGICAL ATTACHMENT • Edge / Guard Slot",
            desc: "A dark-violet etched edge-clamp humming with shadow-cold necrotic whispers that shear through flesh and spirit.",
            effect: "• <strong>Bonus:</strong> Adds <strong>+1d6 Necrotic damage</strong> on every hit and counts as <strong>Magical</strong>.<br>• <strong>Trade-Off (Grave Chill):</strong> Imposes <strong>-1 to all Saving Throws</strong> while equipped."
        },
        {
            match: ['amber temple eclipse-rune crossguard', 'eclipse-rune crossguard', 'eclipse-rune'],
            name: "Amber Temple Eclipse-Rune Crossguard",
            category: "VERY RARE ENDGAME ATTACHMENT • Edge / Guard Slot",
            desc: "A dark obsidian-and-amber crossguard crowned with a hovering golden eclipse ring that bends gravity around the blade.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Damage rolls</strong>, adds <strong>+1d6 Force damage</strong> on hit, and counts as <strong>Magical</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Armor Class</strong> while equipped (dark amber drains defensive wards)."
        },
        {
            match: ['consecrated dawn-glass edge rail', 'dawn-glass edge rail', 'dawn-glass'],
            name: "Consecrated Dawn-Glass Edge Rail",
            category: "VERY RARE ENDGAME ATTACHMENT • Edge / Guard Slot",
            desc: "A slender lattice of sun-crystal prisms locked along the blade spine, burning with golden dawn radiance.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Damage rolls</strong>, adds <strong>+1d6 Radiant damage</strong> on hit, and treats strikes as <strong>Silvered &amp; Magical</strong>.<br>• <strong>Trade-Off (Blazing Beacon):</strong> Sheds 20-ft Bright Light and imposes <strong>Disadvantage on Stealth checks</strong> while equipped."
        },
        // SLOT 1 CASTER: ARCANE CORE / CROWN (Act II-IV Spell Power & Elemental Cores)
        {
            match: ['amber-inlaid focusing collar', 'focusing collar'],
            name: "Amber-Inlaid Focusing Collar",
            category: "RARE CASTER ATTACHMENT • Arcane Core / Crown Slot",
            desc: "An octagonal bronze ring set with warm amber shards that channel arcane weave cleanly through a staff or dagger.",
            effect: "• <strong>Arcane Core/Crown Slot (Staff / Dagger):</strong> Grants <strong>+1 to Spell Attack rolls</strong> and <strong>+1 to Weapon Attack rolls</strong> while equipped."
        },
        {
            match: ['cracked chaos-quartz core', 'cracked chaos-quartz staff crown', 'chaos-quartz'],
            name: "Cracked Chaos-Quartz Core",
            category: "RARE CASTER ATTACHMENT • Arcane Core / Crown Slot",
            desc: "A humming fractured prism of wild-magic crystal mounted in brass claws.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Spell Attack rolls</strong> and adds <strong>+1d4 Force damage</strong> to channeled strikes.<br>• <strong>Trade-Off:</strong> <strong>-1 to Armor Class</strong> while equipped (volatile arcana disrupts personal wards)."
        },
        {
            match: ['storm-glass fulgurite core', 'storm-glass fulgurite staff core', 'fulgurite'],
            name: "Storm-Glass Fulgurite Core",
            category: "RARE CASTER ATTACHMENT • Arcane Core / Crown Slot",
            desc: "A lightning-fused crystal core threaded into the head of an arcane staff, humming audibly with bottled storm static.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Spell Attack rolls</strong> and adds <strong>+1d4 Lightning damage</strong> to channeled strikes.<br>• <strong>Trade-Off (Static Hum):</strong> Imposes <strong>Disadvantage on Stealth checks</strong> while equipped."
        },
        {
            match: ['balinok frostveil resonator crown', 'frostveil resonator', 'frostveil'],
            name: "Balinok Frostveil Resonator Crown",
            category: "RARE CASTER ATTACHMENT • Arcane Core / Crown Slot",
            desc: "A jagged crown of glacial quartz that sharpens spell geometry and coats strikes in bitter frost.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Spell Save DC</strong> and adds <strong>+1d4 Cold damage</strong> to channeled strikes.<br>• <strong>Trade-Off:</strong> <strong>-1 to Weapon Attack rolls</strong> (numbing frost aura)."
        },
        {
            match: ['cinder-heart phoenix core', 'cinder-heart', 'phoenix core'],
            name: "Cinder-Heart Phoenix Core",
            category: "RARE CASTER ATTACHMENT • Arcane Core / Crown Slot",
            desc: "A glowing heart-coal of alchemical wildfire suspended inside a bronze staff cage.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Spell Attack rolls</strong> and adds <strong>+1d6 Fire damage</strong> to channeled strikes.<br>• <strong>Trade-Off (Ember Glow):</strong> Sheds 10-ft dim fiery light and imposes <strong>Disadvantage on Stealth checks</strong> while equipped."
        },
        {
            match: ['crimson bloodmoon conduit crown', 'bloodmoon conduit', 'bloodmoon'],
            name: "Crimson Bloodmoon Conduit Crown",
            category: "RARE CASTER ATTACHMENT • Arcane Core / Crown Slot",
            desc: "A ruby-veined crescent finial that feeds raw crimson energy into spellcraft at the expense of personal armor.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Spell Save DC</strong>, <strong>+1 to Spell Attack rolls</strong>, and adds <strong>+1d4 Necrotic damage</strong> to channeled strikes.<br>• <strong>Trade-Off:</strong> <strong>-1 to Armor Class</strong> while equipped (blood tithe siphons wards)."
        },
        {
            match: ['amber temple sovereign halo core', 'amber temple sovereign halo crown', 'sovereign halo'],
            name: "Amber Temple Sovereign Halo Core",
            category: "VERY RARE ENDGAME CASTER ATTACHMENT • Arcane Core / Crown Slot",
            desc: "A floating halo of cracked amber runes and violet lightning suspended above the staff head—pure glass-cannon arcane authority.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Spell Save DC</strong>, <strong>+1 to Spell Attack rolls</strong>, and adds <strong>+1d6 Force damage</strong> to channeled strikes.<br>• <strong>Trade-Off:</strong> <strong>-2 to Armor Class</strong> while equipped (intense arcane overcharge shreds personal defenses)."
        },
        // SLOT 2 CASTER: SHAFT GRIP / WARDING WRAP (Concentration, Saves, AC, Init & Sight)
        {
            match: ['weighted brass stage-cane ferrule', 'weighted brass stage-cane core', 'brass stage-cane', 'cane ferrule', 'cane core'],
            name: "Weighted Brass Stage-Cane Ferrule",
            category: "COMMON CASTER ATTACHMENT • Shaft Grip / Wrap Slot",
            desc: "A solid silver-plated brass rod hidden inside a hollow theatrical cane for self-defense.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Melee Damage rolls</strong> and treats strikes as <strong>Silvered</strong>.<br>• <strong>Trade-Off:</strong> Imposes <strong>Disadvantage on Stealth checks</strong> while equipped (audible metallic clink)."
        },
        {
            match: ['warding silk grip wrap', 'warding silk grip', 'silk grip wrap'],
            name: "Warding Silk Grip Wrap",
            category: "UNCOMMON CASTER ATTACHMENT • Shaft Grip / Wrap Slot",
            desc: "Silver-threaded silk ribbons woven tightly around a staff or focus grip.",
            effect: "• <strong>Shaft Grip Slot (Staff / Dagger):</strong> Grants <strong>+1 to all Saving Throws</strong> (including Concentration CON saves) while equipped."
        },
        {
            match: ['vistani tarokka star-prism grip-charm', 'vistani tarokka star-prism finial', 'star-prism'],
            name: "Vistani Tarokka Star-Prism Grip-Charm",
            category: "UNCOMMON CASTER ATTACHMENT • Shaft Grip / Wrap Slot",
            desc: "Miniature brass astrolabe rings dangling from the staff grip that quicken arcane reaction speed.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to Initiative</strong> while equipped.<br>• <strong>Trade-Off:</strong> <strong>-1 to Melee Weapon Attack rolls</strong> (delicate orbiting rings)."
        },
        {
            match: ['sanctified raven-feather concentration wrap', 'raven-feather concentration', 'concentration wrap'],
            name: "Sanctified Raven-Feather Concentration Wrap",
            category: "RARE CASTER ATTACHMENT • Shaft Grip / Wrap Slot",
            desc: "Iridescent black raven plumes braided with incense-cured linen around the caster's palm to anchor spell focus under fire.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+2 to all Saving Throws</strong> (including Concentration CON saves) while equipped.<br>• <strong>Trade-Off:</strong> <strong>-1 to Initiative</strong> while equipped (steady meditative focus)."
        },
        {
            match: ['argynvost silver-soul resonance wrap', 'argynvost silver-soul resonance core', 'silver-soul'],
            name: "Argynvost Silver-Soul Resonance Wrap",
            category: "RARE CASTER ATTACHMENT • Shaft Grip / Wrap Slot",
            desc: "Tempered silver dragon-scale cord woven along the staff shaft, anchoring the caster inside a shimmering bastion aura.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Armor Class</strong>, <strong>+1 to all Saving Throws</strong> (including Concentration), and treats weapon strikes as <strong>Silvered</strong>.<br>• <strong>Trade-Off:</strong> <strong>-1 to Initiative</strong> while equipped (heavy silver cord)."
        },
        {
            match: ['svalich mist-heart warding grip', 'svalich mist-heart hollow core', 'mist-heart'],
            name: "Svalich Mist-Heart Warding Grip",
            category: "VERY RARE ENDGAME CASTER ATTACHMENT • Shaft Grip / Wrap Slot",
            desc: "A translucent blown-glass grip casing swirling with living silver fog that shields the caster and pierces Barovian mist.",
            effect: "• <strong>Bonus:</strong> Grants <strong>+1 to Armor Class</strong>, <strong>+2 to all Saving Throws &amp; Concentration</strong>, and <strong>Mist-Piercing Sight</strong>.<br>• <strong>Trade-Off:</strong> <strong>-2 to Melee Weapon Damage</strong> (fragile mist-glass wrap)."
        }
    ];

    function lookupSharedItemLore(rawName) {
        if (!rawName) return null;
        const low = String(rawName).toLowerCase();
        for (const entry of SHARED_ITEM_LORE) {
            if (entry.match.some(m => low.includes(m))) {
                return { ...entry, origin: '' };
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
    let presetEditor = null; // null | { mode: 'save' | 'edit', targetId: '__new__' | string, draftName: string, slotDrafts: Object, errorMsg: string }
    let lastAppliedPresetId = null;
    let dmRemoteGearOverride = { enabled: false, note: '' };

    // Live Firebase State (Realtime Database primary + Firestore fallback)
    let rtdb = null;
    let firestoreDb = null;
    let firebaseReady = false;
    let incomingTrades = [];
    let outgoingTrades = [];
    let msgThreads = {}; // { [threadId]: { participants: [...], updatedAt, messages: { id: { senderId, senderName, text, ts } } } }
    let msgSelectedRecips = new Set(); // recipient IDs checked in Messages tab
    let msgActiveThreadId = null;
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
    // STORAGE: EQUIPPED SLOTS, PROFICIENCY RESTRICTIONS & SILVERED AMMO RESERVES
    // =========================================================================
    function getEquipStorageKey() { return `cos_equip_${adapter.heroId}_${adapter.equipStorageVersion || 'v1'}`; }
    function getCustomGearKey() { return `cos_custom_gear_${adapter.heroId}_v1`; }
    function getClaimedCodesKey() { return `cos_claimed_codes_${adapter.heroId}_v1`; }
    function getCustomPresetsKey() { return `cos_presets_${adapter.heroId}_v1`; }
    function getUnifiedPresetsKey() { return `cos_presets_${adapter.heroId}_v2`; }
    function getLocalDmOverrideKey() { return `cos_dm_override_${adapter.heroId}_v1`; }
    function getAmmoStorageKey() { return `cos_ammo_${adapter.heroId}_v1`; }
    function getUnlockedRecipesKey() { return `cos_unlocked_recipes_v1`; }
    function getFbUnlockedRecipesKey() { return `cos_fb_unlocked_recipes_v1`; }
    function getCheckpointBackupKey() { return `cos_synced_checkpoint_${adapter ? adapter.heroId : 'hero'}_v1`; }

    function getConsumableTurnSlot(useAction) {
        if (!useAction || !useAction.type || useAction.type === 'learnRecipe') return 'none';
        if (useAction.actionCost === 'action' || useAction.actionCost === 'bonus' || useAction.actionCost === 'reaction') {
            return useAction.actionCost;
        }
        if (['holyWater', 'alchemistsFire', 'phosphorBomb', 'utilityLog'].includes(useAction.type)) return 'action';
        return 'bonus';
    }

    const DEFAULT_HERO_PROFICIENCIES = {
        piper: {
            armor: ['robe'],
            weapons: ['simple'],
            label: 'Wild Magic Sorcerer (Robes & Simple Weapons)'
        },
        jacomir: {
            armor: ['light', 'medium', 'heavy', 'shield'],
            weapons: ['simple', 'martial'],
            label: 'Battle Master Fighter (All Armor, Shields, Simple & Martial Weapons)'
        },
        yvaine: {
            armor: ['light', 'medium', 'shield'],
            weapons: ['simple', 'martial', 'firearm'],
            label: 'Monster Slayer Ranger + Gunner (Light/Medium Armor, Shields, Simple/Martial & Firearms)'
        }
    };

    const PROF_LABELS = {
        light: 'Light Armor',
        medium: 'Medium Armor',
        heavy: 'Heavy Armor',
        shield: 'Shield Proficiency',
        robe: 'Cloth / Robe',
        simple: 'Simple Weapons',
        martial: 'Martial Weapons',
        firearm: 'Firearms (Gunner Feat)'
    };

    function getHeroProficiencies() {
        if (adapter && adapter.proficiencies) return adapter.proficiencies;
        return (adapter && DEFAULT_HERO_PROFICIENCIES[adapter.heroId])
            || { armor: ['robe', 'light', 'medium', 'heavy', 'shield'], weapons: ['simple', 'martial'] };
    }

    function isDmOverrideActive() {
        if (!adapter) return false;
        if (dmRemoteGearOverride && dmRemoteGearOverride.enabled) return true;
        try { return localStorage.getItem(getLocalDmOverrideKey()) === '1'; } catch (e) { return false; }
    }

    function toggleDmOverride() {
        if (!adapter) return;
        const next = !isDmOverrideActive();
        try {
            if (next) localStorage.setItem(getLocalDmOverrideKey(), '1');
            else localStorage.removeItem(getLocalDmOverrideKey());
        } catch (e) {}
        dmRemoteGearOverride = { enabled: next, note: next ? 'Scenario Override' : '' };
        if (firebaseReady && rtdb) {
            campaignRtdbRef(`heroes/${adapter.heroId}/dm_gear_override`).set(
                next ? { enabled: true, source: 'sheet', updatedAt: Date.now() } : null
            ).catch(() => {});
        }
        adapter.log(next
            ? `<strong>DM Override Enabled:</strong> Non-proficient gear can now be equipped for this scenario.`
            : `<strong>DM Override Disabled:</strong> Class &amp; feat equipment restrictions restored.`);
        applyEquipmentToSheet(true);
    }

    function checkItemProficiency(raw, meta) {
        const m = meta || (raw ? getItemMeta(raw) : {});
        const prof = getHeroProficiencies();
        const armorList = Array.isArray(prof.armor) ? prof.armor : ['robe'];
        const weaponList = Array.isArray(prof.weapons) ? prof.weapons : ['simple'];

        let reqArmor = m.reqArmor || null;
        if (!reqArmor) {
            if (m.isShield) reqArmor = 'shield';
            else if (m.armorWorn) {
                if (m.heavyArmor) reqArmor = 'heavy';
                else if (m.maxDex === 2) reqArmor = 'medium';
                else reqArmor = 'light';
            }
        }
        if (reqArmor && reqArmor !== 'robe' && !armorList.includes(reqArmor)) {
            return {
                allowed: false,
                reqKind: 'armor',
                reqLevel: reqArmor,
                requirement: PROF_LABELS[reqArmor] || reqArmor
            };
        }

        const reqWeapon = m.reqWeapon || null;
        if (reqWeapon && reqWeapon !== 'any' && !weaponList.includes(reqWeapon)) {
            return {
                allowed: false,
                reqKind: 'weapon',
                reqLevel: reqWeapon,
                requirement: PROF_LABELS[reqWeapon] || reqWeapon
            };
        }

        return { allowed: true, reqKind: null, reqLevel: null, requirement: '' };
    }

    // =========================================================================
    // PER-WEAPON SPECIALTY AMMUNITION ENGINE & LOADER MODAL
    // =========================================================================
    const AMMO_CATALOG = {
        silvered: {
            id: 'silvered',
            shortName: 'Silvered',
            fullName: 'Silvered Ammunition',
            badge: 'Bypasses Resist',
            accent: 'silver',
            atkBonus: 0,
            dmgBonus: 0,
            extraDice: null,
            extraType: null,
            isSilvered: true,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: null,
            note: 'Bypasses Werewolf immunity and Vampire Spawn, Wight & Night Hag nonmagical resistances.',
            packNames: {
                firearm: 'Silvered Bullets',
                bow: 'Silvered Arrows',
                crossbow: 'Silvered Bolts'
            }
        },
        incendiary: {
            id: 'incendiary',
            shortName: 'Incendiary',
            fullName: 'Incendiary Flame',
            badge: '+1d4 Fire',
            accent: 'fire',
            atkBonus: 0,
            dmgBonus: 0,
            extraDice: '1d4',
            extraType: 'Fire',
            isSilvered: false,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: null,
            note: '+1d4 Fire damage on hit; ignites flammable targets & disrupts flame-vulnerable regeneration.',
            packNames: {
                firearm: 'Incendiary Rounds',
                bow: 'Fire Arrows',
                crossbow: 'Fire Bolts'
            }
        },
        poison: {
            id: 'poison',
            shortName: 'Venom',
            fullName: 'Poisoned',
            badge: '+1d6 Poison',
            accent: 'poison',
            atkBonus: 0,
            dmgBonus: 0,
            extraDice: '1d6',
            extraType: 'Poison',
            isSilvered: false,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: 'DC 12 CON Save or Poisoned until end of next turn',
            note: '+1d6 Poison damage; target makes a DC 12 CON Save or becomes Poisoned until the end of its next turn.',
            packNames: {
                firearm: 'Poisoned Bullets',
                bow: 'Poisoned Arrows',
                crossbow: 'Poisoned Bolts'
            }
        },
        wyvern_venom: {
            id: 'wyvern_venom',
            shortName: 'Wyvern Venom',
            fullName: 'Wyvern Venom',
            badge: '+7d6 Poison (DC 15)',
            accent: 'poison',
            atkBonus: 0,
            dmgBonus: 0,
            extraDice: '7d6',
            extraType: 'Poison',
            isSilvered: false,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: 'DC 15 CON Save for half Venom damage',
            note: 'Assassin toxin: target makes a DC 15 CON Save or takes +7d6 Poison damage (half on success).',
            packNames: {
                firearm: 'Wyvern-Venom Bullets',
                bow: 'Wyvern-Venom Arrows',
                crossbow: 'Wyvern-Venom Bolts'
            }
        },
        sunburst: {
            id: 'sunburst',
            shortName: 'Sunburst',
            fullName: 'Sunburst Radiant',
            badge: '+1/+1 & +1d6 Rad',
            accent: 'radiant',
            atkBonus: 1,
            dmgBonus: 1,
            extraDice: '1d6',
            extraType: 'Radiant',
            isSilvered: true,
            haltsRegen: true,
            blocksHealing: false,
            saveNote: null,
            note: '+1 Attack & Damage, +1d6 Radiant, Silvered, and halts Vampire Regeneration for 1 round!',
            packNames: {
                firearm: 'Sunburst Rounds',
                bow: 'Sunburst Arrows',
                crossbow: 'Sunburst Bolts'
            }
        },
        sun_ash: {
            id: 'sun_ash',
            shortName: 'Sun-Ash',
            fullName: 'Sun-Ash Coated',
            badge: '+1d4 Radiant',
            accent: 'radiant',
            atkBonus: 0,
            dmgBonus: 0,
            extraDice: '1d4',
            extraType: 'Radiant',
            isSilvered: false,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: null,
            note: 'Blessed unguent coating: deals +1d4 Radiant damage (halts undead regen on Crit / DM ruling).',
            packNames: {
                firearm: 'Sun-Ash Bullets',
                bow: 'Sun-Ash Arrows',
                crossbow: 'Sun-Ash Bolts'
            }
        },
        necrotic: {
            id: 'necrotic',
            shortName: 'Necrotic',
            fullName: 'Necrotic',
            badge: '+1d6 Necrotic',
            accent: 'necrotic',
            atkBonus: 0,
            dmgBonus: 0,
            extraDice: '1d6',
            extraType: 'Necrotic',
            isSilvered: false,
            haltsRegen: false,
            blocksHealing: true,
            saveNote: null,
            note: '+1d6 Necrotic damage; struck target cannot regain Hit Points until the start of your next turn.',
            packNames: {
                firearm: 'Necrotic Bullets',
                bow: 'Necrotic Arrows',
                crossbow: 'Necrotic Bolts'
            }
        },
        plus1: {
            id: 'plus1',
            shortName: '+1 Hex-Iron',
            fullName: 'Witch-Iron Oil Coated',
            badge: '+1 Hit / +1 Dmg',
            accent: 'magic',
            atkBonus: 1,
            dmgBonus: 1,
            extraDice: null,
            extraType: null,
            isSilvered: false,
            isMagical: true,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: null,
            note: 'Witch-Iron Oil enhancement: +1 Attack & +1 Magical Damage (overcomes nonmagical resistances).',
            packNames: {
                firearm: 'Hex-Iron Bullets',
                bow: 'Hex-Iron Arrows',
                crossbow: 'Hex-Iron Bolts'
            }
        },
        sharpness: {
            id: 'sharpness',
            shortName: '+3 Sharpness',
            fullName: 'Oil of Sharpness Coated',
            badge: '+3 Hit / +3 Dmg',
            accent: 'magic',
            atkBonus: 3,
            dmgBonus: 3,
            extraDice: null,
            extraType: null,
            isSilvered: false,
            isMagical: true,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: null,
            note: 'Ultra-rare Oil of Sharpness coating: +3 Attack & +3 Magical Damage.',
            packNames: {
                firearm: 'Sharpened Bullets (+3)',
                bow: 'Sharpened Arrows (+3)',
                crossbow: 'Sharpened Bolts (+3)'
            }
        }
    };

    let ammoLoaderState = {
        invIndex: null,
        weaponId: null,
        qty: 1
    };

    function encArg(s) {
        return encodeURIComponent(String(s || '')).replace(/'/g, '%27');
    }

    function detectWeaponMaxCap(rawName, meta) {
        const low = String(rawName || '').toLowerCase();
        if (meta && meta.maxCap) return meta.maxCap;
        if (low.includes('lament') || low.includes('heavy long rifle')) return 10;
        if (low.includes('revolver') || low.includes('six-shooter') || low.includes('pepperbox')) return 6;
        return null;
    }

    function normalizeWeaponAmmoEntry(wst) {
        const empty = { loadedId: null, count: 0, fromCoating: false, active: 'standard', lastShot: null };
        if (!wst || typeof wst !== 'object') return empty;

        let loadedId = (typeof wst.loadedId === 'string' && AMMO_CATALOG[wst.loadedId]) ? wst.loadedId : null;
        let count = Math.max(0, parseInt(wst.count) || 0);
        let fromCoating = Boolean(wst.fromCoating);

        // Migrate any legacy multi-pool record cleanly to the active/primary 1-type model
        if (!loadedId && wst.pools && typeof wst.pools === 'object') {
            const nonZero = Object.entries(wst.pools).filter(([aid, c]) => AMMO_CATALOG[aid] && (parseInt(c) || 0) > 0);
            if (nonZero.length > 0) {
                const matchAct = nonZero.find(([aid]) => aid === wst.active);
                const chosen = matchAct || nonZero[0];
                loadedId = chosen[0];
                count = parseInt(chosen[1]) || 0;
            }
        }

        if (!loadedId || count <= 0) {
            return {
                loadedId: null,
                count: 0,
                fromCoating: false,
                active: 'standard',
                lastShot: (wst.lastShot === 'standard' || AMMO_CATALOG[wst.lastShot]) ? wst.lastShot : null
            };
        }

        const active = fromCoating
            ? loadedId
            : (wst.active === loadedId ? loadedId : 'standard');
        const lastShot = (wst.lastShot === 'standard' || AMMO_CATALOG[wst.lastShot]) ? wst.lastShot : null;
        return { loadedId, count, fromCoating, active, lastShot };
    }

    function getWeaponAmmoStore() {
        const store = { weapons: {} };
        if (!adapter) return store;
        try {
            const raw = localStorage.getItem(getAmmoStorageKey());
            if (!raw) return store;
            const parsed = JSON.parse(raw);
            if (parsed && typeof parsed === 'object' && parsed.weapons && typeof parsed.weapons === 'object') {
                Object.entries(parsed.weapons).forEach(([wid, wst]) => {
                    store.weapons[wid] = normalizeWeaponAmmoEntry(wst);
                });
            }
        } catch (e) {}
        return store;
    }

    function saveWeaponAmmoStore(store) {
        if (!adapter) return;
        try { localStorage.setItem(getAmmoStorageKey(), JSON.stringify(store)); } catch (e) {}
    }

    function getWeaponAmmoEntry(weaponId) {
        const store = getWeaponAmmoStore();
        return store.weapons[weaponId] || normalizeWeaponAmmoEntry(null);
    }

    function getTotalLoadedSpecialty(entry) {
        return (entry && entry.loadedId && entry.count > 0) ? (parseInt(entry.count) || 0) : 0;
    }

    function getAmmoState() {
        return getWeaponAmmoStore();
    }

    function getHeroWeaponsForAmmo(includeBagRanged = false) {
        if (!adapter) return [];
        const list = [];
        const seenIds = new Set();
        const declared = Array.isArray(adapter.ammoWeapons) ? adapter.ammoWeapons : [];
        declared.forEach(w => {
            if (!w || !w.id || seenIds.has(w.id)) return;
            seenIds.add(w.id);
            list.push({
                id: w.id,
                label: w.label || w.id,
                kind: w.kind || 'firearm',
                maxCap: w.maxCap || null,
                mount: w.mount || null,
                isEquipped: true,
                isNative: true
            });
        });

        const eq = reconcileEquippedWithInventory();
        const nativeTags = new Set(adapter.nativeWeaponTags || []);
        const equippedKeys = new Set();
        ['ranged', 'mainHand', 'offHand', 'legSheath'].forEach(slotId => {
            const key = eq[slotId];
            if (!key || equippedKeys.has(key)) return;
            const raw = findInventoryRawByKey(key);
            if (!raw) return;
            const meta = getItemMeta(raw);
            if (meta.isShield || !meta.ammoKind) return;
            if (meta.weaponTag && nativeTags.has(meta.weaponTag)) return;
            equippedKeys.add(key);
            if (!seenIds.has(key)) {
                seenIds.add(key);
                list.push({
                    id: key,
                    label: shortLabel(raw),
                    kind: meta.ammoKind,
                    maxCap: detectWeaponMaxCap(raw, meta),
                    mount: null,
                    isEquipped: true,
                    isNative: false
                });
            }
        });

        if (includeBagRanged) {
            adapter.getItems().forEach(raw => {
                const key = normKey(raw);
                if (seenIds.has(key) || equippedKeys.has(key)) return;
                const meta = getItemMeta(raw);
                if (meta.isShield || meta.category !== 'weapon' || !meta.ammoKind) return;
                if (meta.weaponTag && nativeTags.has(meta.weaponTag)) return;
                seenIds.add(key);
                list.push({
                    id: key,
                    label: `${shortLabel(raw)} (In Bag)`,
                    kind: meta.ammoKind,
                    maxCap: detectWeaponMaxCap(raw, meta),
                    mount: null,
                    isEquipped: false,
                    isNative: false
                });
            });
        }
        return list;
    }

    function getLoadableAmmoItemsFromBackpack(filterKind = null) {
        if (!adapter) return [];
        const out = [];
        adapter.getItems().forEach((raw, idx) => {
            const meta = getItemMeta(raw);
            if (!meta.ammoMeta || !AMMO_CATALOG[meta.ammoMeta.ammoId]) return;
            const am = meta.ammoMeta;
            if (filterKind && !am.isCoating && am.ammoKind !== filterKind) return;
            const p = parseItem(raw);
            const unitCount = am.isCoating
                ? (p.qty || 1)
                : (p.hasQty ? p.qty : (am.packSizeDefault || 10));
            out.push({
                invIndex: idx,
                raw,
                label: shortLabel(raw),
                ammoId: am.ammoId,
                ammoDef: AMMO_CATALOG[am.ammoId],
                ammoKind: am.ammoKind,
                isCoating: !!am.isCoating,
                coatingFullMag: !!am.coatingFullMag,
                coatingRounds: am.coatingRounds || 1,
                coatMelee: meta.coatMelee || null,
                unitCount
            });
        });
        return out;
    }

    function hasBulletContainerInBag() {
        if (!adapter) return false;
        return adapter.getItems().some(raw => Boolean(getItemMeta(raw).isBulletContainer));
    }

    function getActiveWeaponAmmoDef(weaponId) {
        const entry = getWeaponAmmoEntry(weaponId);
        if (!entry || !entry.loadedId || entry.count <= 0) return null;
        if (entry.active === 'standard' && !entry.fromCoating) return null;
        return AMMO_CATALOG[entry.loadedId] || null;
    }

    function getWeaponLastShotDef(weaponId) {
        const entry = getWeaponAmmoEntry(weaponId);
        if (!entry) return null;
        if (entry.lastShot === 'standard') return null;
        if (entry.lastShot && AMMO_CATALOG[entry.lastShot]) return AMMO_CATALOG[entry.lastShot];
        return getActiveWeaponAmmoDef(weaponId);
    }

    function buildWeaponAmmoBarHtml(weaponId, weaponMeta) {
        const entry = getWeaponAmmoEntry(weaponId);
        const hasLoaded = Boolean(entry.loadedId && entry.count > 0 && AMMO_CATALOG[entry.loadedId]);
        const loadedDef = hasLoaded ? AMMO_CATALOG[entry.loadedId] : null;
        const activeId = (hasLoaded && (entry.fromCoating || entry.active === entry.loadedId)) ? entry.loadedId : 'standard';
        const activeDef = activeId !== 'standard' ? AMMO_CATALOG[activeId] : null;
        const accentCls = activeDef ? `accent-${activeDef.accent}` : '';

        const capTxt = (weaponMeta && weaponMeta.maxCap && hasLoaded)
            ? ` <span style="color:#64748b; font-weight:600;">(${entry.count}/${weaponMeta.maxCap} cap)</span>`
            : '';

        let statusTxt = `Chamber: <strong>Standard</strong>`;
        if (hasLoaded && activeDef) {
            statusTxt = entry.fromCoating
                ? `Coated Front: <strong style="color:#f8fafc;">${esc(activeDef.shortName)} (${entry.count})</strong>${capTxt}`
                : `Active: <strong style="color:#f8fafc;">${esc(activeDef.shortName)} (${entry.count})</strong>${capTxt}`;
        } else if (hasLoaded && loadedDef) {
            statusTxt = `Chamber: <strong>Standard</strong> <span style="color:#94a3b8;">(${esc(loadedDef.shortName)}: ${entry.count} ready)</span>`;
        }

        const stdLocked = Boolean(hasLoaded && entry.fromCoating);
        const pillsHtml = [
            `<button type="button" class="rpg-ammo-pill ${activeId === 'standard' ? 'is-active' : ''}" ${stdLocked ? 'disabled title="Vial-coated rounds sit at the front of the magazine — fire them or Reload/Unload first"' : `onclick="COS_RPG.selectWeaponAmmo(decodeURIComponent('${encArg(weaponId)}'), 'standard')"`}>Standard${stdLocked ? ' (Locked)' : ''}</button>`,
            ...(hasLoaded && loadedDef ? [
                `<button type="button" class="rpg-ammo-pill accent-${loadedDef.accent} ${activeId === loadedDef.id ? 'is-active' : ''}" onclick="COS_RPG.selectWeaponAmmo(decodeURIComponent('${encArg(weaponId)}'), '${loadedDef.id}')">${esc(loadedDef.shortName)} (${entry.count})</button>`
            ] : [])
        ].join('');

        const unloadBtn = hasLoaded
            ? `<button type="button" class="rpg-ammo-act-btn" onclick="COS_RPG.unloadWeaponAmmo(decodeURIComponent('${encArg(weaponId)}'))" title="Return unused rounds to Backpack">Unload</button>`
            : '';

        const needsContainer = (weaponMeta && weaponMeta.kind === 'firearm');
        const containerLocked = needsContainer && !hasBulletContainerInBag();
        const loadBtn = containerLocked
            ? `<button type="button" class="rpg-ammo-act-btn is-load" disabled title="Locked — Buy a Partitioned Bullet Sling &amp; Pouch (15 GP in any shop) to carry &amp; load specialty rounds">${hasLoaded ? 'Swap / Load' : 'Load'}</button>`
            : `<button type="button" class="rpg-ammo-act-btn is-load" onclick="COS_RPG.openAmmoLoaderModal({ targetWeaponId: decodeURIComponent('${encArg(weaponId)}') })">${hasLoaded ? 'Swap / Load' : 'Load'}</button>`;

        const hintParts = [];
        if (activeDef) hintParts.push(esc(activeDef.note));
        if (stdLocked) hintParts.push('Coated rounds fire first before Standard ammo underneath.');
        if (containerLocked) hintParts.push('Load Locked — Buy a Partitioned Bullet Sling &amp; Pouch (15 GP in any shop) to store &amp; load special rounds.');

        return `
            <div class="rpg-wpn-ammo-bar ${accentCls}">
                <div class="rpg-ammo-top">
                    <span class="rpg-ammo-status">${statusTxt}</span>
                    <span class="rpg-ammo-act-group">
                        ${unloadBtn}
                        ${loadBtn}
                    </span>
                </div>
                <div class="rpg-ammo-pills">${pillsHtml}</div>
                ${hintParts.length ? `<div class="rpg-ammo-effect-hint">${hintParts.join(' ')}</div>` : ''}
            </div>
        `;
    }

    function refreshAllAmmoDisplays() {
        if (!adapter) return;
        const nativeWeapons = Array.isArray(adapter.ammoWeapons) ? adapter.ammoWeapons : [];
        nativeWeapons.forEach(w => {
            if (!w || !w.mount) return;
            const el = typeof w.mount === 'string' ? document.querySelector(w.mount) : w.mount;
            if (el) el.innerHTML = buildWeaponAmmoBarHtml(w.id, w);
        });
        if (typeof window.syncWeaponAmmoVisuals === 'function') {
            try { window.syncWeaponAmmoVisuals(); } catch (e) {}
        } else if (typeof window.syncSilveredAmmoVisuals === 'function') {
            try { window.syncSilveredAmmoVisuals(); } catch (e) {}
        }
    }

    function returnLoadedAmmoToBackpack(weaponId, ammoId, count, silentLog = false) {
        if (!adapter || !ammoId || count <= 0) return null;
        const def = AMMO_CATALOG[ammoId];
        if (!def) return null;
        const weapons = getHeroWeaponsForAmmo(true);
        const wMeta = weapons.find(w => w.id === weaponId) || { label: weaponId, kind: 'firearm' };
        const packName = (def.packNames && def.packNames[wMeta.kind])
            || (def.packNames && Object.values(def.packNames)[0])
            || `${def.shortName} Rounds`;
        const items = adapter.getItems();
        addRawItemToList(items, `${count}x ${packName}`, 1);
        adapter.saveItems(items);
        if (!silentLog) {
            adapter.log(`Returned <strong>${count}x ${esc(packName)}</strong> from ${esc(wMeta.label)} back into Backpack.`);
        }
        return { count, packName, weaponLabel: wMeta.label };
    }

    function selectWeaponAmmo(weaponId, ammoId) {
        if (!adapter || !weaponId) return;
        const store = getWeaponAmmoStore();
        const entry = store.weapons[weaponId] || normalizeWeaponAmmoEntry(null);
        if (entry.fromCoating && entry.count > 0 && ammoId === 'standard') {
            adapter.log(`<strong>Coated Top Rounds Active:</strong> Fire remaining coated rounds first, or click <strong>Unload / Reload</strong> to return them to Backpack.`);
            return;
        }
        if (ammoId !== 'standard' && (entry.loadedId !== ammoId || entry.count <= 0)) return;
        entry.active = ammoId;
        entry.lastShot = null;
        store.weapons[weaponId] = entry;
        saveWeaponAmmoStore(store);
        refreshAllAmmoDisplays();
        renderDynamicWeaponCards(getGearBonuses());
        syncHeroStateToFirebase(false);
    }

    function consumeWeaponAmmo(weaponId) {
        const store = getWeaponAmmoStore();
        const entry = store.weapons[weaponId] || normalizeWeaponAmmoEntry(null);
        const useSpecialty = entry.loadedId && entry.count > 0 && (entry.fromCoating || entry.active === entry.loadedId) && AMMO_CATALOG[entry.loadedId];
        if (useSpecialty) {
            const actId = entry.loadedId;
            entry.count -= 1;
            const remaining = entry.count;
            entry.lastShot = actId;
            let exhausted = false;
            if (remaining <= 0) {
                entry.loadedId = null;
                entry.count = 0;
                entry.fromCoating = false;
                entry.active = 'standard';
                exhausted = true;
            }
            store.weapons[weaponId] = entry;
            saveWeaponAmmoStore(store);
            refreshAllAmmoDisplays();
            renderDynamicWeaponCards(getGearBonuses());
            syncHeroStateToFirebase(false);
            return { ammoId: actId, def: AMMO_CATALOG[actId], remaining, exhausted };
        }
        entry.lastShot = 'standard';
        store.weapons[weaponId] = entry;
        saveWeaponAmmoStore(store);
        return { ammoId: 'standard', def: null, remaining: 0, exhausted: false };
    }

    function unloadWeaponAmmo(weaponId) {
        if (!adapter || !weaponId) return;
        const store = getWeaponAmmoStore();
        const entry = store.weapons[weaponId];
        if (!entry || !entry.loadedId || entry.count <= 0) return;
        const ret = returnLoadedAmmoToBackpack(weaponId, entry.loadedId, entry.count, false);
        store.weapons[weaponId] = { loadedId: null, count: 0, fromCoating: false, active: 'standard', lastShot: null };
        saveWeaponAmmoStore(store);
        applyEquipmentToSheet(true);
        refreshAllAmmoDisplays();
        return ret;
    }

    function onWeaponReloaded(weaponId) {
        if (!adapter || !weaponId) return null;
        const store = getWeaponAmmoStore();
        const entry = store.weapons[weaponId];
        if (!entry || !entry.loadedId || entry.count <= 0) return null;
        const ret = returnLoadedAmmoToBackpack(weaponId, entry.loadedId, entry.count, true);
        store.weapons[weaponId] = { loadedId: null, count: 0, fromCoating: false, active: 'standard', lastShot: null };
        saveWeaponAmmoStore(store);
        if (ret) {
            adapter.log(`Reload returned <strong>${ret.count}x ${esc(ret.packName)}</strong> from ${esc(ret.weaponLabel)} back into Backpack.`);
        }
        applyEquipmentToSheet(true);
        refreshAllAmmoDisplays();
        return ret;
    }

    function getWeaponModsStorageKey() { return `cos_wpn_mods_${adapter.heroId}_v1`; }
    function getWeaponCoatingStorageKey() { return `cos_wpn_coat_${adapter.heroId}_v1`; }

    function getWeaponModsStore() {
        const store = { mods: {} };
        if (!adapter) return store;
        try {
            const raw = localStorage.getItem(getWeaponModsStorageKey());
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && parsed.mods && typeof parsed.mods === 'object') {
                    store.mods = parsed.mods;
                }
            }
        } catch (e) {}
        return store;
    }

    function saveWeaponModsStore(store) {
        if (!adapter) return;
        try { localStorage.setItem(getWeaponModsStorageKey(), JSON.stringify(store)); } catch (e) {}
    }

    function getWeaponCoatingStore() {
        const store = { coatings: {} };
        if (!adapter) return store;
        try {
            const raw = localStorage.getItem(getWeaponCoatingStorageKey());
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object' && parsed.coatings && typeof parsed.coatings === 'object') {
                    store.coatings = parsed.coatings;
                }
            }
        } catch (e) {}
        return store;
    }

    function saveWeaponCoatingStore(store) {
        if (!adapter) return;
        try { localStorage.setItem(getWeaponCoatingStorageKey(), JSON.stringify(store)); } catch (e) {}
    }

    function classifyWeaponClasses(rawName, meta) {
        const low = String(rawName || '').toLowerCase();
        const classes = new Set();
        const ammoKind = meta && (meta.ammoKind || meta.kind);
        if (ammoKind === 'firearm' || low.includes('lament') || low.includes('mercy') || low.includes('less') || low.includes('revolver') || low.includes('rifle') || low.includes('musket') || low.includes('pistol')) {
            classes.add('ranged');
            classes.add('firearm');
            return classes;
        }
        if (ammoKind === 'bow' || low.includes('longbow') || low.includes('shortbow') || /\bbow\b/.test(low)) {
            classes.add('ranged');
            classes.add('bow');
            return classes;
        }
        if (ammoKind === 'crossbow' || low.includes('crossbow')) {
            classes.add('ranged');
            classes.add('crossbow');
            return classes;
        }
        classes.add('melee');
        if (low.includes('sword') || low.includes('axe') || low.includes('treebane') || low.includes('dagger') || low.includes('knife') || low.includes('rapier') || low.includes('scimitar') || low.includes('spear') || /\bfan\b/.test(low)) {
            classes.add('slashing_piercing');
        }
        if (low.includes('mace') || low.includes('staff') || low.includes('thighbone')) {
            classes.add('blunt');
        }
        if (low.includes('staff') || low.includes('quarterstaff') || low.includes('dagger') || low.includes('knife') || low.includes('wand') || low.includes('rod')) {
            classes.add('caster_weapon');
        }
        return classes;
    }

    function getHeroAllWeapons(includeBag = true) {
        if (!adapter) return [];
        const list = [];
        const seenIds = new Set();
        const eq = reconcileEquippedWithInventory();
        const nativeTags = new Set(adapter.nativeWeaponTags || []);
        const equippedIds = new Set();

        const declared = Array.isArray(adapter.ammoWeapons) ? adapter.ammoWeapons : [];
        declared.forEach(w => {
            if (!w || !w.id || seenIds.has(w.id)) return;
            seenIds.add(w.id);
            equippedIds.add(w.id);
            const cls = classifyWeaponClasses(w.label || w.id, { ammoKind: w.kind || 'firearm' });
            const magDelta = getWeaponAttachmentBonuses(w.id).magCapDelta || 0;
            list.push({
                id: w.id,
                label: w.label || w.id,
                kind: w.kind || 'firearm',
                isRanged: true,
                classes: cls,
                maxCap: w.maxCap ? Math.max(1, w.maxCap + magDelta) : null,
                mount: w.mount || null,
                isEquipped: true,
                isNative: true
            });
        });

        const addWeaponEntry = (raw, isEq) => {
            const meta = getItemMeta(raw);
            if (meta.isShield || meta.category !== 'weapon') return;
            const id = (meta.weaponTag && nativeTags.has(meta.weaponTag)) ? meta.weaponTag : normKey(raw);
            if (id === 'revolvers') return; // Covers combined alias; Mercy & Less are listed individually
            if (seenIds.has(id)) return;
            seenIds.add(id);
            const cls = classifyWeaponClasses(raw, meta);
            const kind = meta.ammoKind || (cls.has('ranged') ? 'ranged' : 'melee');
            list.push({
                id,
                raw,
                label: isEq ? shortLabel(raw) : `${shortLabel(raw)} (In Bag)`,
                kind,
                isRanged: cls.has('ranged'),
                classes: cls,
                maxCap: detectWeaponMaxCap(raw, meta),
                mount: null,
                isEquipped: isEq,
                isNative: nativeTags.has(id)
            });
        };

        ['ranged', 'mainHand', 'offHand', 'legSheath'].forEach(slotId => {
            const key = eq[slotId];
            if (!key) return;
            const raw = findInventoryRawByKey(key);
            if (raw) {
                equippedIds.add(key);
                addWeaponEntry(raw, true);
            }
        });

        if (includeBag) {
            adapter.getItems().forEach(raw => {
                addWeaponEntry(raw, false);
            });
        }
        return list;
    }

    const LEGENDARY_ARTIFACT_KEYWORDS = [
        'sunsword', 'sun blade', 'staff of power', 'staff of frost', 'blood spear',
        'luck blade', 'gulthias staff', 'icon of ravenloft', 'holy symbol of ravenkind',
        'thighbone', 'treebane', 'mace of terror'
    ];

    function isLegendaryArtifactWeapon(rawName) {
        const low = String(rawName || '').toLowerCase();
        return LEGENDARY_ARTIFACT_KEYWORDS.some(k => low.includes(k));
    }

    function getWeaponSlotSchema(weaponMeta) {
        if (!weaponMeta) return [];
        if (isLegendaryArtifactWeapon(weaponMeta.raw || weaponMeta.label || weaponMeta.id)) {
            return [];
        }
        const cls = weaponMeta.classes || classifyWeaponClasses(weaponMeta.raw || weaponMeta.label || weaponMeta.id, weaponMeta);
        if (cls.has('firearm')) {
            return [
                { id: 'optic', label: 'Optic / Sight' },
                { id: 'barrel', label: 'Barrel / Magazine' }
            ];
        }
        if (cls.has('crossbow') || cls.has('bow')) {
            return [
                { id: 'optic', label: 'Sight / Frame' },
                { id: 'barrel', label: 'Draw-Cam / String' }
            ];
        }
        if (cls.has('caster_weapon') && !cls.has('slashing_piercing')) {
            return [
                { id: 'crown', label: 'Arcane Core / Crown' },
                { id: 'grip', label: 'Shaft Grip / Wrap' }
            ];
        }
        return [
            { id: 'hilt', label: 'Hilt / Pommel' },
            { id: 'guard', label: 'Edge / Guard' }
        ];
    }

    function modFitsWeaponSlot(attachMeta, weaponMeta, slotId) {
        if (!attachMeta || !weaponMeta || !slotId) return false;
        const schema = getWeaponSlotSchema(weaponMeta);
        if (!schema.some(s => s.id === slotId)) return false;
        const allowedSlots = Array.isArray(attachMeta.slotTypes) && attachMeta.slotTypes.length
            ? attachMeta.slotTypes
            : [attachMeta.slotType || 'hilt'];
        if (!allowedSlots.includes(slotId)) return false;
        const cls = weaponMeta.classes || classifyWeaponClasses(weaponMeta.raw || weaponMeta.label || weaponMeta.id, weaponMeta);
        return (attachMeta.targetClasses || []).some(c => cls.has(c));
    }

    function getWeaponSlotsMap(weaponId) {
        if (!weaponId) return {};
        const store = getWeaponModsStore();
        const entry = store.mods[weaponId];
        if (!entry || typeof entry !== 'object') return {};
        if (entry.slots && typeof entry.slots === 'object') {
            return entry.slots;
        }
        // Seamless migration for legacy single-mod records
        if (entry.modKey) {
            const inferredSlot = entry.slotType
                || (entry.modKey.includes('scope') ? 'optic'
                : (entry.modKey.includes('barrel') || entry.modKey.includes('cam') ? 'barrel'
                : (entry.modKey.includes('edge') || entry.modKey.includes('guard') ? 'guard'
                : (entry.modKey.includes('collar') || entry.modKey.includes('crown') ? 'crown' : 'hilt'))));
            return { [inferredSlot]: entry };
        }
        return {};
    }

    function hydrateSlottedMod(slotId, modObj) {
        if (!modObj || !modObj.modKey) return null;
        const meta = getItemMeta(modObj.raw || modObj.modName || '');
        const am = meta && meta.attachMeta ? meta.attachMeta : null;
        const atkBonus = am ? (am.atkBonus || 0) : (parseInt(modObj.atkBonus) || 0);
        const dmgBonus = am ? (am.dmgBonus || 0) : (parseInt(modObj.dmgBonus) || 0);
        const magCapDelta = am ? (am.magCapDelta || 0) : (parseInt(modObj.magCapDelta) || 0);
        const acBonus = am ? (am.acBonus || 0) : (parseInt(modObj.acBonus) || 0);
        const saveBonus = am ? (am.saveBonus || 0) : (parseInt(modObj.saveBonus) || 0);
        const spellDcBonus = am ? (am.spellDcBonus || 0) : (parseInt(modObj.spellDcBonus) || 0);
        const spellAtkBonus = am ? (am.spellAtkBonus || 0) : (parseInt(modObj.spellAtkBonus) || 0);
        const initBonus = am ? (am.initBonus || 0) : (parseInt(modObj.initBonus) || 0);
        const extraDice = am ? (am.extraDice || null) : (modObj.extraDice || null);
        const extraType = am ? (am.extraType || null) : (modObj.extraType || null);
        const isSilvered = am ? !!am.isSilvered : !!modObj.isSilvered;
        const isMagical = am ? !!am.isMagical : !!modObj.isMagical;
        const mistSight = am ? !!am.mistSight : !!modObj.mistSight;
        const silenced = am ? !!am.silenced : !!modObj.silenced;
        const stealthDisadv = am ? !!am.stealthDisadv : !!modObj.stealthDisadv;
        const debuffNote = am ? (am.debuffNote || null) : (modObj.debuffNote || null);
        const badge = (am && am.badgeLabel) || modObj.badgeLabel || modObj.modName || 'Attachment';
        return {
            ...modObj,
            slotId,
            atkBonus,
            dmgBonus,
            magCapDelta,
            acBonus,
            saveBonus,
            spellDcBonus,
            spellAtkBonus,
            initBonus,
            extraDice,
            extraType,
            isSilvered,
            isMagical,
            mistSight,
            silenced,
            stealthDisadv,
            debuffNote,
            badge
        };
    }

    function getWeaponAttachmentInfo(weaponId) {
        const slots = getWeaponSlotsMap(weaponId);
        const keys = Object.keys(slots);
        if (keys.length === 0) return null;
        return hydrateSlottedMod(keys[0], slots[keys[0]]);
    }

    function getWeaponAttachmentBonuses(weaponId) {
        const slotsRaw = getWeaponSlotsMap(weaponId);
        const mods = [];
        const slotsMap = {};
        let atkBonus = 0;
        let dmgBonus = 0;
        let magCapDelta = 0;
        let acBonus = 0;
        let saveBonus = 0;
        let spellDcBonus = 0;
        let spellAtkBonus = 0;
        let initBonus = 0;
        let isSilvered = false;
        let isMagical = false;
        let mistSight = false;
        let silenced = false;
        let stealthDisadv = false;
        const extras = [];
        const debuffNotes = [];

        Object.entries(slotsRaw).forEach(([slotId, rawMod]) => {
            const h = hydrateSlottedMod(slotId, rawMod);
            if (!h) return;
            mods.push(h);
            slotsMap[slotId] = h;
            atkBonus += (h.atkBonus || 0);
            dmgBonus += (h.dmgBonus || 0);
            magCapDelta += (h.magCapDelta || 0);
            acBonus += (h.acBonus || 0);
            saveBonus += (h.saveBonus || 0);
            spellDcBonus += (h.spellDcBonus || 0);
            spellAtkBonus += (h.spellAtkBonus || 0);
            initBonus += (h.initBonus || 0);
            if (h.isSilvered) isSilvered = true;
            if (h.isMagical) isMagical = true;
            if (h.mistSight) mistSight = true;
            if (h.silenced) silenced = true;
            if (h.stealthDisadv) stealthDisadv = true;
            if (h.extraDice) extras.push({ dice: h.extraDice, type: h.extraType || 'Bonus', label: h.modName || 'Attachment' });
            if (h.debuffNote) debuffNotes.push(h.debuffNote);
        });

        return {
            hasMod: mods.length > 0,
            atkBonus,
            dmgBonus,
            magCapDelta,
            acBonus,
            saveBonus,
            spellDcBonus,
            spellAtkBonus,
            initBonus,
            extras,
            extraDice: extras[0] ? extras[0].dice : null,
            extraType: extras[0] ? extras[0].type : null,
            isSilvered,
            isMagical,
            mistSight,
            silenced,
            stealthDisadv,
            debuffNotes,
            mods,
            slotsMap,
            mod: mods[0] || null
        };
    }

    function getWeaponMeleeCoating(weaponId) {
        if (!weaponId) return null;
        const store = getWeaponCoatingStore();
        return store.coatings[weaponId] || null;
    }

    function clearWeaponMeleeCoating(weaponId, silent = false) {
        if (!adapter || !weaponId) return;
        const store = getWeaponCoatingStore();
        const prev = store.coatings[weaponId];
        if (!prev) return;
        delete store.coatings[weaponId];
        saveWeaponCoatingStore(store);
        if (!silent) {
            adapter.log(`Wiped <strong>${esc(prev.label || prev.vialName)}</strong> coating from weapon.`);
        }
        applyEquipmentToSheet(true);
    }

    function detachWeaponMod(weaponId, slotId = null) {
        if (!adapter || !weaponId) return;
        const store = getWeaponModsStore();
        const slots = { ...getWeaponSlotsMap(weaponId) };
        const keys = Object.keys(slots);
        if (keys.length === 0) return;
        const targetSlot = (slotId && slots[slotId]) ? slotId : keys[0];
        const prev = slots[targetSlot];
        if (!prev) return;
        delete slots[targetSlot];
        if (Object.keys(slots).length === 0) {
            delete store.mods[weaponId];
        } else {
            store.mods[weaponId] = { slots };
        }
        saveWeaponModsStore(store);
        const items = adapter.getItems();
        addRawItemToList(items, prev.raw || prev.modName, 1);
        adapter.saveItems(items);
        adapter.log(`Detached <strong>${esc(shortLabel(prev.raw || prev.modName))}</strong> and returned it to Backpack.`);
        applyEquipmentToSheet(true);
        if (document.getElementById('rpg-weapon-mod-dialog')?.open) {
            renderAttachmentModal();
        }
    }

    function getWeaponCombatMods(weaponId) {
        const modB = getWeaponAttachmentBonuses(weaponId);
        const coat = getWeaponMeleeCoating(weaponId);
        const extras = [...(modB.extras || [])];
        if (coat && coat.extraDice) extras.push({ dice: coat.extraDice, type: coat.extraType || 'Coating', label: coat.label || 'Coating' });
        const saveNotes = [];
        if (coat && coat.saveNote) saveNotes.push(coat.saveNote);
        if (modB.debuffNotes && modB.debuffNotes.length) {
            modB.debuffNotes.forEach(n => saveNotes.push(n));
        }
        return {
            atkBonus: (modB.atkBonus || 0) + (coat ? (coat.atkBonus || 0) : 0),
            dmgBonus: (modB.dmgBonus || 0) + (coat ? (coat.dmgBonus || 0) : 0),
            magCapDelta: modB.magCapDelta || 0,
            acBonus: modB.acBonus || 0,
            saveBonus: modB.saveBonus || 0,
            spellDcBonus: modB.spellDcBonus || 0,
            spellAtkBonus: modB.spellAtkBonus || 0,
            initBonus: modB.initBonus || 0,
            extras,
            isSilvered: Boolean(modB.isSilvered || (coat && coat.isSilvered)),
            isMagical: Boolean(modB.isMagical || (coat && coat.isMagical)),
            mistSight: Boolean(modB.mistSight),
            silenced: Boolean(modB.silenced),
            stealthDisadv: Boolean(modB.stealthDisadv),
            saveNotes,
            debuffNotes: modB.debuffNotes || [],
            mods: modB.mods || [],
            slotsMap: modB.slotsMap || {},
            mod: modB.mod,
            coating: coat
        };
    }

    function resolveWeaponIdFromRaw(raw) {
        if (!raw) return null;
        const meta = getItemMeta(raw);
        if (meta.isShield || meta.category !== 'weapon') return null;
        const nativeTags = new Set((adapter && adapter.nativeWeaponTags) || []);
        const low = String(raw).toLowerCase();
        if (nativeTags.has('lament') && low.includes('lament')) return 'lament';
        if (nativeTags.has('mercy') && low.includes('mercy')) return 'mercy';
        if (nativeTags.has('less') && low.includes('less')) return 'less';
        if (meta.weaponTag && nativeTags.has(meta.weaponTag)) return meta.weaponTag;
        return normKey(raw);
    }

    function buildWeaponModalActionButtonsHtml(weaponId) {
        if (!adapter || !weaponId) return '';
        const allWpns = getHeroAllWeapons(true);
        const wpn = allWpns.find(w => w.id === weaponId);
        if (!wpn) return '';
        const schema = getWeaponSlotSchema(wpn);
        const slots = getWeaponSlotsMap(weaponId);
        const usedCnt = Object.keys(slots).length;
        const encId = encArg(weaponId);
        const attachBtn = schema.length > 0
            ? `<button type="button" class="btn-act btn-act-pre" style="border-color:#3b82f6; color:#93c5fd;" onclick="COS_RPG.openWeaponWorkbench(decodeURIComponent('${encId}'))">Attachments (${usedCnt}/${schema.length})</button>`
            : `<button type="button" class="btn-act btn-act-pre" disabled style="opacity:0.55; border-color:#475569; color:#94a3b8;" title="Legendary Artifacts are complete and have 0 attachment slots">Legendary (0 Slots)</button>`;
        const coatBtn = `<button type="button" class="btn-act btn-act-pre" style="border-color:#10b981; color:#6ee7b7;" onclick="COS_RPG.openCoatWeaponModal(decodeURIComponent('${encId}'))">Coat Weapon</button>`;
        return `${attachBtn} ${coatBtn}`;
    }

    let attachModalState = { mode: 'mod', invIndex: null, weaponId: null, activeSlotId: null };

    function openWeaponWorkbench(weaponId) {
        if (!adapter || !weaponId) return;
        const dlg = document.getElementById('rpg-weapon-mod-dialog');
        if (!dlg) return;
        const allWeapons = getHeroAllWeapons(true);
        const wpn = allWeapons.find(w => w.id === weaponId);
        if (!wpn) return;
        const schema = getWeaponSlotSchema(wpn);
        attachModalState = {
            mode: 'weapon',
            invIndex: null,
            weaponId: wpn.id,
            activeSlotId: schema[0] ? schema[0].id : null
        };
        renderAttachmentModal();
        if (!dlg.open) dlg.showModal();
    }

    function openCoatWeaponModal(weaponId) {
        if (!adapter || !weaponId) return;
        const allWeapons = getHeroAllWeapons(true);
        const wpn = allWeapons.find(w => w.id === weaponId);
        if (!wpn) return;
        if (wpn.kind === 'firearm' && !hasBulletContainerInBag()) {
            adapter.log(`<strong>Firearm Coating Locked:</strong> Carry a <strong>Bullet Sling</strong> (15 GP in any shop) in your Backpack first.`);
            return;
        }
        const dlg = document.getElementById('rpg-ammo-loader-dialog');
        if (!dlg) return;
        const allCoats = getLoadableAmmoItemsFromBackpack(null).filter(it => {
            if (!it.isCoating) return false;
            if (!wpn.isRanged) {
                return Boolean(it.coatMelee && it.coatMelee.targetClasses.some(cls => wpn.classes && wpn.classes.has(cls)));
            }
            return true;
        });
        const chosenInv = allCoats[0] || null;
        ammoLoaderState = {
            invIndex: chosenInv ? chosenInv.invIndex : null,
            weaponId: wpn.id,
            qty: 1,
            lockedFromInv: false,
            lockedWeaponId: wpn.id,
            coatOnly: true
        };
        renderAmmoLoaderModal();
        if (!dlg.open) dlg.showModal();
    }

    function openAttachmentModal({ invIndex = null, targetWeaponId = null, slotId = null } = {}) {
        if (!adapter) return;
        const dlg = document.getElementById('rpg-weapon-mod-dialog');
        if (!dlg) return;
        const items = adapter.getItems();
        let chosenIdx = invIndex;
        if (chosenIdx === null || chosenIdx === undefined) {
            chosenIdx = items.findIndex(r => Boolean(getItemMeta(r).attachMeta));
        }
        const rawMod = (chosenIdx >= 0 && items[chosenIdx]) ? items[chosenIdx] : null;
        const modMeta = rawMod ? getItemMeta(rawMod).attachMeta : null;
        if (!rawMod || !modMeta) return;

        const allWeapons = getHeroAllWeapons(true);
        const compat = allWeapons.filter(w => {
            const schema = getWeaponSlotSchema(w);
            return schema.some(s => modFitsWeaponSlot(modMeta, w, s.id));
        });
        const chosenWpn = targetWeaponId
            ? compat.find(w => w.id === targetWeaponId) || compat[0] || null
            : (compat.find(w => w.isEquipped) || compat[0] || null);
        let chosenSlot = slotId;
        if (chosenWpn && (!chosenSlot || !modFitsWeaponSlot(modMeta, chosenWpn, chosenSlot))) {
            const schema = getWeaponSlotSchema(chosenWpn);
            const fit = schema.find(s => modFitsWeaponSlot(modMeta, chosenWpn, s.id));
            chosenSlot = fit ? fit.id : null;
        }

        attachModalState = {
            mode: 'mod',
            invIndex: chosenIdx,
            weaponId: chosenWpn ? chosenWpn.id : null,
            activeSlotId: chosenSlot
        };
        renderAttachmentModal();
        if (!dlg.open) dlg.showModal();
    }

    function installAttachmentIntoSlot(weaponId, slotId, invIndex) {
        if (!adapter) return;
        const items = adapter.getItems();
        const rawMod = items[invIndex];
        const fullMeta = rawMod ? getItemMeta(rawMod) : null;
        const modMeta = fullMeta ? fullMeta.attachMeta : null;
        const allWeapons = getHeroAllWeapons(true);
        const wpn = allWeapons.find(w => w.id === weaponId);
        if (!rawMod || !modMeta || !wpn || !modFitsWeaponSlot(modMeta, wpn, slotId)) return;

        // Deduct 1x attachment from Backpack
        const p = parseItem(rawMod);
        const rem = (p.qty || 1) - 1;
        if (rem <= 0) items.splice(invIndex, 1);
        else items[invIndex] = `${p.emoji}${rem > 1 ? rem + 'x ' : ''}${p.name}`.trim();

        const store = getWeaponModsStore();
        const curSlots = { ...getWeaponSlotsMap(wpn.id) };
        if (curSlots[slotId] && (curSlots[slotId].raw || curSlots[slotId].modName)) {
            addRawItemToList(items, curSlots[slotId].raw || curSlots[slotId].modName, 1);
        }
        adapter.saveItems(items);

        curSlots[slotId] = {
            modKey: modMeta.modKey,
            slotType: slotId,
            raw: shortLabel(rawMod),
            modName: shortLabel(rawMod),
            atkBonus: modMeta.atkBonus || 0,
            dmgBonus: modMeta.dmgBonus || 0,
            magCapDelta: modMeta.magCapDelta || 0,
            acBonus: modMeta.acBonus || 0,
            saveBonus: modMeta.saveBonus || 0,
            spellDcBonus: modMeta.spellDcBonus || 0,
            spellAtkBonus: modMeta.spellAtkBonus || 0,
            initBonus: modMeta.initBonus || 0,
            extraDice: modMeta.extraDice || null,
            extraType: modMeta.extraType || null,
            isSilvered: !!modMeta.isSilvered,
            isMagical: !!modMeta.isMagical,
            mistSight: !!modMeta.mistSight,
            silenced: !!modMeta.silenced,
            stealthDisadv: !!modMeta.stealthDisadv,
            debuffNote: modMeta.debuffNote || null,
            badgeLabel: modMeta.badgeLabel || shortLabel(rawMod)
        };
        store.mods[wpn.id] = { slots: curSlots };
        saveWeaponModsStore(store);

        adapter.log(`Attached <strong>${esc(shortLabel(rawMod))}</strong> to <strong>${esc(wpn.label)}</strong>.`);
        applyEquipmentToSheet(true);
        refreshAllAmmoDisplays();
        if (attachModalState.mode === 'weapon') {
            renderAttachmentModal();
        } else {
            closeModal('rpg-weapon-mod-dialog');
        }
    }

    function renderAttachmentModal() {
        const body = document.getElementById('rpg-weapon-mod-body');
        const confirmBtn = document.getElementById('rpg-weapon-mod-confirm');
        const titleEl = document.getElementById('rpg-weapon-mod-title');
        if (!body) return;

        // MODE A: Weapon-First Slot Workbench (Opened by clicking "Attachments" inside any Weapon window!)
        if (attachModalState.mode === 'weapon') {
            const allWeapons = getHeroAllWeapons(true);
            const wpn = allWeapons.find(w => w.id === attachModalState.weaponId);
            if (!wpn) {
                body.innerHTML = `<div style="font-size:0.76rem; color:#fca5a5;">Weapon not found.</div>`;
                if (confirmBtn) confirmBtn.style.display = 'none';
                return;
            }
            if (titleEl) titleEl.textContent = `${wpn.label} — Weapon Attachments`;
            if (confirmBtn) confirmBtn.style.display = 'none';

            const schema = getWeaponSlotSchema(wpn);
            if (schema.length === 0) {
                body.innerHTML = `
                    <div class="rpg-loader-section">
                        <div style="font-size:0.82rem; color:#fde68a; font-weight:700;">Legendary Artifact — 0 Attachment Slots</div>
                        <div style="font-size:0.74rem; color:#cbd5e1; margin-top:4px;">Named legendary relics are already complete artifacts and cannot be modified with weapon attachments.</div>
                    </div>
                `;
                return;
            }

            if (!attachModalState.activeSlotId || !schema.some(s => s.id === attachModalState.activeSlotId)) {
                attachModalState.activeSlotId = schema[0].id;
            }

            const slotsMap = getWeaponSlotsMap(wpn.id);
            const items = adapter.getItems();

            const slotsHtml = schema.map(s => {
                const mounted = slotsMap[s.id] ? hydrateSlottedMod(s.id, slotsMap[s.id]) : null;
                const isSel = attachModalState.activeSlotId === s.id;
                const encW = encArg(wpn.id);
                return `
                    <div class="rpg-loader-choice ${isSel ? 'is-selected' : ''}" style="cursor:pointer; align-items:center;" onclick="COS_RPG.selectWorkbenchSlot('${s.id}')">
                        <span>
                            <small style="color:#93c5fd; font-weight:800; text-transform:uppercase; font-size:0.62rem;">${esc(s.label)}</small><br>
                            <strong style="color:${mounted ? '#fde68a' : '#94a3b8'};">${mounted ? esc(mounted.raw || mounted.modName) : 'Empty Slot'}</strong>
                            ${mounted ? `<br><small style="color:#cbd5e1;">${esc(mounted.badge)}</small>` : ''}
                        </span>
                        <span style="display:flex; gap:4px; align-items:center;">
                            ${mounted ? `<button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:24px; padding:0 7px; font-size:0.66rem;" onclick="event.stopPropagation(); COS_RPG.detachWeaponMod(decodeURIComponent('${encW}'), '${s.id}')">Detach</button>` : `<span class="rpg-loader-cap">${isSel ? 'Selected' : 'Slot'}</span>`}
                        </span>
                    </div>
                `;
            }).join('');

            const activeSlotObj = schema.find(s => s.id === attachModalState.activeSlotId) || schema[0];
            const compatBagMods = [];
            items.forEach((raw, idx) => {
                const m = getItemMeta(raw);
                if (m && m.attachMeta && modFitsWeaponSlot(m.attachMeta, wpn, activeSlotObj.id)) {
                    compatBagMods.push({ idx, raw, meta: m });
                }
            });

            const encW = encArg(wpn.id);
            const bagHtml = compatBagMods.length > 0
                ? `<div class="rpg-loader-choice-grid">${compatBagMods.map(item => `
                    <button type="button" class="rpg-loader-choice" onclick="COS_RPG.installAttachmentIntoSlot(decodeURIComponent('${encW}'), '${activeSlotObj.id}', ${item.idx})">
                        <span>
                            <strong>${esc(shortLabel(item.raw))}</strong><br>
                            <small style="color:#cbd5e1;">${esc(item.meta.summary || '')}</small>
                        </span>
                        <span class="rpg-loader-cap" style="color:#6ee7b7; border-color:rgba(52,211,153,0.45);">Install</span>
                    </button>
                `).join('')}</div>`
                : `<div style="font-size:0.74rem; color:#94a3b8; padding:6px 0;">No compatible <strong>${esc(activeSlotObj.label)}</strong> attachments currently in your Backpack.</div>`;

            body.innerHTML = `
                <div class="rpg-loader-section">
                    <div class="rpg-loader-label">Weapon Attachment Slots (${Object.keys(slotsMap).length}/${schema.length} Filled)</div>
                    <div class="rpg-loader-choice-grid">${slotsHtml}</div>
                </div>
                <div class="rpg-loader-section">
                    <div class="rpg-loader-label">Available in Backpack for ${esc(activeSlotObj.label)}</div>
                    ${bagHtml}
                </div>
            `;
            return;
        }

        // MODE B: Attachment-First Picker (Opened by clicking "Attach" on an attachment item in Backpack)
        if (titleEl) titleEl.textContent = 'Attach Weapon Upgrade';
        if (confirmBtn) confirmBtn.style.display = '';
        const items = adapter.getItems();
        const rawMod = items[attachModalState.invIndex];
        const modMeta = rawMod ? getItemMeta(rawMod).attachMeta : null;
        if (!rawMod || !modMeta) {
            body.innerHTML = `<div style="font-size:0.76rem; color:#fca5a5;">Attachment not found in Backpack.</div>`;
            if (confirmBtn) confirmBtn.disabled = true;
            return;
        }
        const allWeapons = getHeroAllWeapons(true);
        const compat = allWeapons.filter(w => {
            const schema = getWeaponSlotSchema(w);
            return schema.some(s => modFitsWeaponSlot(modMeta, w, s.id));
        });
        if (!compat.some(w => w.id === attachModalState.weaponId)) {
            attachModalState.weaponId = compat[0] ? compat[0].id : null;
        }
        const activeWpn = compat.find(w => w.id === attachModalState.weaponId) || null;
        if (activeWpn) {
            const schema = getWeaponSlotSchema(activeWpn);
            if (!attachModalState.activeSlotId || !modFitsWeaponSlot(modMeta, activeWpn, attachModalState.activeSlotId)) {
                const fit = schema.find(s => modFitsWeaponSlot(modMeta, activeWpn, s.id));
                attachModalState.activeSlotId = fit ? fit.id : null;
            }
        }
        const listHtml = compat.length > 0
            ? `<div class="rpg-loader-choice-grid">${compat.map(w => {
                const isSel = activeWpn && w.id === activeWpn.id;
                const schema = getWeaponSlotSchema(w);
                const fitSlot = schema.find(s => modFitsWeaponSlot(modMeta, w, s.id));
                const slotsMap = getWeaponSlotsMap(w.id);
                const curInSlot = fitSlot ? slotsMap[fitSlot.id] : null;
                const sub = curInSlot
                    ? `${fitSlot.label}: Replaces ${shortLabel(curInSlot.raw || curInSlot.modName)} to Bag`
                    : `${fitSlot ? fitSlot.label : 'Slot'} Open • ${w.isEquipped ? 'Equipped' : 'In Backpack'}`;
                return `<button type="button" class="rpg-loader-choice ${isSel ? 'is-selected' : ''}" onclick="COS_RPG.selectAttachTargetWeapon(decodeURIComponent('${encArg(w.id)}'))">
                    <span><strong>${esc(w.label)}</strong><br><small style="color:#94a3b8;">${esc(sub)}</small></span>
                    <span class="rpg-loader-cap">${isSel ? 'Selected' : 'Compatible'}</span>
                </button>`;
            }).join('')}</div>`
            : `<div style="font-size:0.74rem; color:#fca5a5;">No compatible non-legendary weapon owned (Legendary artifacts have 0 slots).</div>`;

        body.innerHTML = `
            <div class="rpg-loader-section">
                <div class="rpg-loader-label">Attachment</div>
                <div style="font-size:0.8rem; color:#fde68a; font-weight:700;">${esc(shortLabel(rawMod))}</div>
                <div style="font-size:0.72rem; color:#cbd5e1; margin-top:2px;">${esc(getItemMeta(rawMod).summary || '')}</div>
            </div>
            <div class="rpg-loader-section">
                <div class="rpg-loader-label">Select Compatible Weapon (Max 2 Slots per Weapon)</div>
                ${listHtml}
            </div>
        `;
        if (confirmBtn) confirmBtn.disabled = !(activeWpn && attachModalState.activeSlotId);
    }

    function confirmAttachWeaponMod() {
        if (!adapter || !attachModalState.weaponId || !attachModalState.activeSlotId) return;
        installAttachmentIntoSlot(attachModalState.weaponId, attachModalState.activeSlotId, attachModalState.invIndex);
    }

    function getActionEconomyNote(ammoItem, weaponMeta) {
        if (!ammoItem) return 'Bonus action in combat (free pre-combat).';
        if (ammoItem.ammoId === 'sharpness' && ammoItem.isCoating) {
            return '1 full action in combat (free pre-combat).';
        }
        if (ammoItem.isCoating) {
            return 'Bonus action in combat (free pre-combat).';
        }
        if (weaponMeta && (weaponMeta.kind === 'bow' || weaponMeta.kind === 'crossbow')) {
            return 'Bonus action to organize quiver (free per attack).';
        }
        return 'Bonus action to load into firearm in combat (free pre-combat).';
    }

    function getWeaponCoatingCeiling(ammoItem, weaponMeta) {
        if (weaponMeta && !weaponMeta.isRanged && weaponMeta.kind === 'melee') {
            return ammoItem && ammoItem.isCoating ? 1 : 0;
        }
        const chamberInfo = (adapter && typeof adapter.getWeaponCurrentChamber === 'function')
            ? adapter.getWeaponCurrentChamber(weaponMeta.id)
            : null;
        const entry = getWeaponAmmoEntry(weaponMeta.id);
        const sameLoaded = (entry.loadedId === ammoItem.ammoId && entry.count > 0);
        const alreadyCount = sameLoaded ? entry.count : 0;

        if (ammoItem.isCoating) {
            if (chamberInfo && chamberInfo.cur <= 0) return 0;
            const totalRoundsPresent = chamberInfo ? chamberInfo.cur : (weaponMeta.maxCap || ammoItem.coatingRounds || 10);
            return Math.max(0, totalRoundsPresent - alreadyCount);
        }

        if (weaponMeta.maxCap) {
            return Math.max(0, weaponMeta.maxCap - alreadyCount);
        }
        return Infinity;
    }

    function computeMaxLoadUnits(ammoItem, weaponMeta) {
        if (!ammoItem || !weaponMeta) return 0;
        if (!weaponMeta.isRanged && weaponMeta.kind === 'melee') {
            if (!ammoItem.isCoating || !ammoItem.coatMelee) return 0;
            const ok = ammoItem.coatMelee.targetClasses.some(cls => weaponMeta.classes && weaponMeta.classes.has(cls));
            return ok ? Math.min(ammoItem.unitCount, 1) : 0;
        }
        if ((ammoItem.ammoKind === 'firearm' || weaponMeta.kind === 'firearm') && !hasBulletContainerInBag()) {
            return 0;
        }
        const freeCap = getWeaponCoatingCeiling(ammoItem, weaponMeta);
        if (freeCap <= 0) return 0;
        if (ammoItem.isCoating && (ammoItem.coatingFullMag || ammoItem.coatingRounds > 1)) {
            return Math.min(ammoItem.unitCount, 1);
        }
        return Math.min(ammoItem.unitCount, freeCap);
    }

    function getCoatableOrLoadableTargets(ammoItem) {
        const ranged = getHeroWeaponsForAmmo(true).map(w => ({
            ...w,
            isRanged: true,
            classes: classifyWeaponClasses(w.label || w.id, { ammoKind: w.kind })
        }));
        if (!ammoItem || !ammoItem.isCoating) {
            return ranged.filter(w => !ammoItem || w.kind === ammoItem.ammoKind);
        }
        const allWpns = getHeroAllWeapons(true);
        const melee = allWpns.filter(w => !w.isRanged && ammoItem.coatMelee && ammoItem.coatMelee.targetClasses.some(cls => w.classes.has(cls)));
        return [...ranged, ...melee];
    }

    function openAmmoLoaderModal({ invIndex = null, targetWeaponId = null } = {}) {
        if (!adapter) return;
        const weapons = getHeroAllWeapons(true);
        const targetWeapon = targetWeaponId ? weapons.find(w => w.id === targetWeaponId) : null;
        if (targetWeapon && targetWeapon.kind === 'firearm' && !hasBulletContainerInBag()) {
            adapter.log(`<strong>Firearm Load Locked:</strong> Carry a <strong>Partitioned Bullet Sling &amp; Pouch</strong> (15 GP in any shop) in your Backpack first.`);
            return;
        }
        if (invIndex !== null && invIndex !== undefined) {
            const rawInv = adapter.getItems()[invIndex];
            const invMeta = rawInv ? getItemMeta(rawInv) : null;
            if (invMeta && invMeta.ammoMeta && !invMeta.ammoMeta.isCoating && invMeta.ammoMeta.ammoKind === 'firearm' && !hasBulletContainerInBag()) {
                adapter.log(`<strong>Firearm Load Locked:</strong> Buy a <strong>Partitioned Bullet Sling &amp; Pouch</strong> (15 GP in any shop) to carry and load special firearm rounds.`);
                return;
            }
        }
        const dlg = document.getElementById('rpg-ammo-loader-dialog');
        if (!dlg) return;
        const allItems = getLoadableAmmoItemsFromBackpack(targetWeapon && !invIndex ? targetWeapon.kind : null);

        let chosenInv = (invIndex !== null && invIndex !== undefined)
            ? allItems.find(it => it.invIndex === invIndex) || null
            : null;
        if (!chosenInv && allItems.length > 0) chosenInv = allItems[0];

        const targets = chosenInv ? getCoatableOrLoadableTargets(chosenInv) : weapons;
        let chosenWeapon = targetWeapon || null;
        if (!chosenWeapon && chosenInv) {
            chosenWeapon = targets.find(w => computeMaxLoadUnits(chosenInv, w) > 0) || targets[0] || null;
        }
        if (!chosenWeapon && targets.length > 0) chosenWeapon = targets[0];

        const maxQty = (chosenInv && chosenWeapon) ? computeMaxLoadUnits(chosenInv, chosenWeapon) : 0;
        let defQty = 1;
        if (chosenInv && maxQty > 0) {
            if (chosenInv.isCoating && (chosenInv.coatingFullMag || chosenInv.coatingRounds > 1)) defQty = 1;
            else defQty = Math.min(maxQty, chosenWeapon && chosenWeapon.maxCap ? chosenWeapon.maxCap : Math.min(maxQty, 10));
        }

        ammoLoaderState = {
            invIndex: chosenInv ? chosenInv.invIndex : null,
            weaponId: chosenWeapon ? chosenWeapon.id : null,
            qty: Math.max(1, defQty || 1),
            lockedFromInv: invIndex !== null && invIndex !== undefined,
            lockedWeaponId: null,
            coatOnly: false
        };

        renderAmmoLoaderModal();
        if (!dlg.open) dlg.showModal();
    }

    function renderAmmoLoaderModal() {
        const body = document.getElementById('rpg-ammo-loader-body');
        const confirmBtn = document.getElementById('rpg-ammo-loader-confirm');
        const titleEl = document.getElementById('rpg-ammo-loader-title');
        if (!body) return;

        const allAll = getHeroAllWeapons(true);
        const rangedAll = allAll.filter(w => w.isRanged);
        const targetId = ammoLoaderState.lockedWeaponId || ammoLoaderState.weaponId;
        const curWeapon = allAll.find(w => w.id === targetId) || rangedAll[0] || null;
        const loadable = getLoadableAmmoItemsFromBackpack(null);
        const curAmmo = loadable.find(it => it.invIndex === ammoLoaderState.invIndex) || null;

        let compatAmmo = curWeapon && !ammoLoaderState.lockedFromInv
            ? loadable.filter(it => (it.isCoating && (!curWeapon.isRanged ? (it.coatMelee && it.coatMelee.targetClasses.some(cls => curWeapon.classes.has(cls))) : true)) || (!it.isCoating && !ammoLoaderState.coatOnly && curWeapon.isRanged && it.ammoKind === curWeapon.kind))
            : loadable;
        if (ammoLoaderState.coatOnly) {
            compatAmmo = compatAmmo.filter(it => it.isCoating);
        }
        const activeAmmo = curAmmo && compatAmmo.some(a => a.invIndex === curAmmo.invIndex)
            ? curAmmo
            : (compatAmmo[0] || null);
        ammoLoaderState.invIndex = activeAmmo ? activeAmmo.invIndex : null;

        const compatWeapons = ammoLoaderState.lockedWeaponId && curWeapon
            ? [curWeapon]
            : (activeAmmo ? getCoatableOrLoadableTargets(activeAmmo) : rangedAll);
        const activeWeapon = curWeapon && compatWeapons.some(w => w.id === curWeapon.id)
            ? curWeapon
            : (compatWeapons.find(w => computeMaxLoadUnits(activeAmmo, w) > 0) || compatWeapons[0] || null);
        ammoLoaderState.weaponId = activeWeapon ? activeWeapon.id : null;

        if (titleEl) {
            titleEl.textContent = (ammoLoaderState.coatOnly || (activeAmmo && activeAmmo.isCoating)) ? 'Coat Weapon or Ammunition' : 'Load Specialty Ammunition';
        }
        if (confirmBtn) {
            confirmBtn.textContent = (ammoLoaderState.coatOnly || (activeAmmo && activeAmmo.isCoating)) ? 'Apply Coating' : 'Load into Weapon';
        }

        const maxUnits = (activeAmmo && activeWeapon) ? computeMaxLoadUnits(activeAmmo, activeWeapon) : 0;
        const safeQty = maxUnits > 0 ? Math.max(1, Math.min(maxUnits, parseInt(ammoLoaderState.qty) || 1)) : 0;
        ammoLoaderState.qty = safeQty;

        const ammoHtml = compatAmmo.length > 0
            ? `<div class="rpg-loader-choice-grid">${compatAmmo.map(a => {
                const isSel = activeAmmo && a.invIndex === activeAmmo.invIndex;
                const stockLabel = a.isCoating
                    ? (a.coatingFullMag ? `${a.unitCount} vial (Full Mag / Blade)` : (a.coatingRounds > 1 ? `${a.unitCount} vial (up to ${a.coatingRounds} rnds / Blade)` : `${a.unitCount} dose (Blade or 1 rnd/dose)`))
                    : `${a.unitCount} rounds left`;
                return `<button type="button" class="rpg-loader-choice ${isSel ? 'is-selected' : ''}" onclick="COS_RPG.selectLoaderAmmo(${a.invIndex})">
                    <span><strong>${esc(a.label)}</strong><br><small style="color:#94a3b8;">${esc(a.ammoDef.badge)}</small></span>
                    <span class="rpg-loader-cap">${esc(stockLabel)}</span>
                </button>`;
            }).join('')}</div>`
            : `<div style="font-size:0.74rem; color:#94a3b8; font-style:italic; padding:4px 0;">No compatible specialty ammunition or coatings found in your Backpack.</div>`;

        const wpnHtml = compatWeapons.length > 0
            ? `<div class="rpg-loader-choice-grid">${compatWeapons.map(w => {
                const isSel = activeWeapon && w.id === activeWeapon.id;
                if (!w.isRanged && w.kind === 'melee') {
                    const curCoat = getWeaponMeleeCoating(w.id);
                    const tag = curCoat ? `Coated: ${curCoat.label} (Replaces)` : (w.isEquipped ? 'Equipped Melee' : 'In Backpack');
                    return `<button type="button" class="rpg-loader-choice ${isSel ? 'is-selected' : ''}" onclick="COS_RPG.selectLoaderWeapon(decodeURIComponent('${encArg(w.id)}'))">
                        <span><strong>${esc(w.label)}</strong><br><small style="color:#94a3b8;">MELEE BLADE / HEAD</small></span>
                        <span class="rpg-loader-cap">${esc(tag)}</span>
                    </button>`;
                }
                const entry = getWeaponAmmoEntry(w.id);
                const chamberInfo = (adapter && typeof adapter.getWeaponCurrentChamber === 'function')
                    ? adapter.getWeaponCurrentChamber(w.id)
                    : null;
                const isCoatingEmpty = Boolean(activeAmmo && activeAmmo.isCoating && chamberInfo && chamberInfo.cur <= 0);
                const needsContainer = (w.kind === 'firearm' && !hasBulletContainerInBag());
                const isFullSame = Boolean(activeAmmo && entry.loadedId === activeAmmo.ammoId && computeMaxLoadUnits(activeAmmo, w) <= 0);
                const isDisabled = needsContainer || isCoatingEmpty || isFullSame;
                let capText = w.maxCap ? `Max ${w.maxCap} cap` : 'Quiver Ready';
                if (needsContainer) {
                    capText = 'Locked (Need Bullet Sling)';
                } else if (entry.loadedId && entry.count > 0 && AMMO_CATALOG[entry.loadedId]) {
                    const ed = AMMO_CATALOG[entry.loadedId];
                    capText = `${ed.shortName}: ${entry.count}${w.maxCap ? '/' + w.maxCap : ''}${activeAmmo && activeAmmo.ammoId !== entry.loadedId ? ' (Swaps to Bag)' : ''}`;
                } else if (chamberInfo) {
                    capText = `Chamber: ${chamberInfo.cur}/${chamberInfo.max}`;
                }
                const disabledTitle = needsContainer
                    ? 'Buy a Partitioned Bullet Sling &amp; Pouch (15 GP in any shop) first'
                    : (isCoatingEmpty ? 'Chamber empty — Reload standard bullets first before coating' : 'Capacity full');
                return `<button type="button" class="rpg-loader-choice ${isSel ? 'is-selected' : ''}" ${isDisabled ? `disabled title="${disabledTitle}"` : ''} onclick="COS_RPG.selectLoaderWeapon(decodeURIComponent('${encArg(w.id)}'))">
                    <span><strong>${esc(w.label)}</strong><br><small style="color:#94a3b8;">${esc(w.kind.toUpperCase())}</small></span>
                    <span class="rpg-loader-cap">${esc(needsContainer ? 'Need Bullet Sling' : (isCoatingEmpty ? 'Empty Chamber (Reload First)' : capText))}</span>
                </button>`;
            }).join('')}</div>`
            : `<div style="font-size:0.74rem; color:#fca5a5;">No compatible weapon available for this item.</div>`;

        let qtyBlockHtml = '';
        if (activeAmmo && activeWeapon && maxUnits > 0) {
            const actionTxt = getActionEconomyNote(activeAmmo, activeWeapon);
            if (!activeWeapon.isRanged && activeWeapon.kind === 'melee' && activeAmmo.coatMelee) {
                qtyBlockHtml = `
                    <div class="rpg-loader-section">
                        <div class="rpg-loader-label">Melee Weapon Coating</div>
                        <div style="font-size:0.74rem; color:#e2e8f0; line-height:1.4;">
                            Consumes <strong>1 vial/dose</strong> to coat <strong>${esc(activeWeapon.label)}</strong> with <strong>${esc(activeAmmo.coatMelee.label)}</strong> (${esc(activeAmmo.coatMelee.duration || '1 Combat')}). Attack &amp; damage rolls will apply this buff automatically!
                        </div>
                        <div class="rpg-loader-action-note">${esc(actionTxt)}</div>
                    </div>
                `;
            } else {
                const wEntry = getWeaponAmmoEntry(activeWeapon.id);
                const swappingOther = wEntry.loadedId && wEntry.count > 0 && wEntry.loadedId !== activeAmmo.ammoId;
                const prevDef = swappingOther ? AMMO_CATALOG[wEntry.loadedId] : null;
                const swapNote = swappingOther && prevDef
                    ? `<div style="color:#93c5fd; font-size:0.7rem; margin-top:4px;">Applying ${esc(activeAmmo.ammoDef.shortName)} will automatically return your <strong>${wEntry.count}x ${esc(prevDef.shortName)}</strong> rounds back to Backpack (1 specialty type per weapon).</div>`
                    : '';

                const coatCeil = getWeaponCoatingCeiling(activeAmmo, activeWeapon);
                if (activeAmmo.isCoating && (activeAmmo.coatingFullMag || activeAmmo.coatingRounds > 1)) {
                    const capLimit = activeAmmo.coatingFullMag ? coatCeil : activeAmmo.coatingRounds;
                    const coatedCount = Math.min(capLimit, coatCeil);
                    qtyBlockHtml = `
                        <div class="rpg-loader-section">
                            <div class="rpg-loader-label">Vial Coating Effect</div>
                            <div style="font-size:0.74rem; color:#e2e8f0; line-height:1.4;">
                                Consumes <strong>1 vial</strong> to coat ${activeAmmo.coatingFullMag ? 'the full magazine (' : 'the first '}<strong>${coatedCount} round${coatedCount === 1 ? '' : 's'}</strong>${activeAmmo.coatingFullMag ? ')' : ''} inside <strong>${esc(activeWeapon.label)}</strong>. Those rounds become <strong>${esc(activeAmmo.ammoDef.shortName)}</strong> and fire first (unspent rounds return to Backpack on Reload/Unload).
                                ${swapNote}
                            </div>
                            <div class="rpg-loader-action-note">${esc(actionTxt)}</div>
                        </div>
                    `;
                } else {
                    const isDose = activeAmmo.isCoating && activeAmmo.coatingRounds === 1;
                    qtyBlockHtml = `
                        <div class="rpg-loader-section">
                            <div class="rpg-loader-label">Quantity (${isDose ? '1 coated round per dose' : `1..${maxUnits}`})</div>
                            <div class="rpg-loader-qty-row">
                                <button type="button" class="rpg-ammo-act-btn" onclick="COS_RPG.stepLoaderQty(-1)" aria-label="Decrease quantity">-</button>
                                <input type="number" id="rpg-loader-qty-inp" class="rpg-loader-qty-input" min="1" max="${maxUnits}" value="${safeQty}" oninput="COS_RPG.setLoaderQty(this.value, true)">
                                <button type="button" class="rpg-ammo-act-btn" onclick="COS_RPG.stepLoaderQty(1)" aria-label="Increase quantity">+</button>
                                <button type="button" class="rpg-ammo-act-btn is-load" onclick="COS_RPG.setLoaderQty(${maxUnits})">Max (${maxUnits})</button>
                            </div>
                            ${isDose ? '<div style="font-size:0.7rem; color:#cbd5e1; margin-top:4px;">Coated front rounds fire first and return to Backpack as coated rounds if unloaded/reloaded.</div>' : ''}
                            ${swapNote}
                            <div class="rpg-loader-action-note">${esc(actionTxt)}</div>
                        </div>
                    `;
                }
            }
        }

        body.innerHTML = `
            <div class="rpg-loader-section">
                <div class="rpg-loader-label">1. Select Ammunition / Vial</div>
                ${ammoHtml}
            </div>
            <div class="rpg-loader-section">
                <div class="rpg-loader-label">2. Select Applicable Weapon</div>
                ${wpnHtml}
            </div>
            ${qtyBlockHtml}
        `;
        if (confirmBtn) confirmBtn.disabled = !(activeAmmo && activeWeapon && maxUnits > 0 && safeQty > 0);
    }

    function confirmLoadSpecialtyAmmo() {
        if (!adapter) return;
        const loadable = getLoadableAmmoItemsFromBackpack(null);
        const ammoItem = loadable.find(it => it.invIndex === ammoLoaderState.invIndex);
        const allWeapons = getCoatableOrLoadableTargets(ammoItem);
        const weaponMeta = allWeapons.find(w => w.id === ammoLoaderState.weaponId);
        if (!ammoItem || !weaponMeta) return;

        // Branch A: Applying Vial/Oil Coating onto a Melee Weapon
        if (!weaponMeta.isRanged && weaponMeta.kind === 'melee') {
            if (!ammoItem.isCoating || !ammoItem.coatMelee) return;
            const items = adapter.getItems();
            const raw = items[ammoItem.invIndex];
            if (!raw) return;
            const p = parseItem(raw);
            const remVials = (p.qty || 1) - 1;
            if (remVials <= 0) items.splice(ammoItem.invIndex, 1);
            else items[ammoItem.invIndex] = `${p.emoji}${remVials > 1 ? remVials + 'x ' : ''}${p.name}`.trim();
            adapter.saveItems(items);

            const coatStore = getWeaponCoatingStore();
            coatStore.coatings[weaponMeta.id] = {
                ...ammoItem.coatMelee,
                vialName: ammoItem.label
            };
            saveWeaponCoatingStore(coatStore);

            adapter.log(`Coated <strong>${esc(weaponMeta.label)}</strong> with <strong>${esc(ammoItem.coatMelee.label)}</strong> (${esc(ammoItem.coatMelee.duration || '1 Combat')} &bull; ${esc(getActionEconomyNote(ammoItem, weaponMeta))}).`);
            closeModal('rpg-ammo-loader-dialog');
            applyEquipmentToSheet(true);
            refreshAllAmmoDisplays();
            return;
        }

        if ((ammoItem.ammoKind === 'firearm' || weaponMeta.kind === 'firearm') && !hasBulletContainerInBag()) {
            adapter.log(`<strong>Firearm Load Locked:</strong> Carry a <strong>Partitioned Bullet Sling &amp; Pouch</strong> (15 GP in any shop) in your Backpack first.`);
            return;
        }

        const maxUnits = computeMaxLoadUnits(ammoItem, weaponMeta);
        if (maxUnits <= 0) {
            adapter.log(`<strong>Cannot Load:</strong> ${esc(weaponMeta.label)} is empty for coating or full for this ammo type.`);
            return;
        }
        const reqUnits = Math.max(1, Math.min(maxUnits, parseInt(ammoLoaderState.qty) || 1));

        const coatCeil = getWeaponCoatingCeiling(ammoItem, weaponMeta);
        let roundsToAdd = 0;
        let unitsConsumed = reqUnits;
        if (ammoItem.isCoating) {
            const perVial = ammoItem.coatingFullMag ? coatCeil : ammoItem.coatingRounds;
            roundsToAdd = Math.min(perVial * unitsConsumed, coatCeil);
        } else {
            roundsToAdd = Math.min(reqUnits, coatCeil);
            unitsConsumed = roundsToAdd;
        }
        if (roundsToAdd <= 0) return;

        // Deduct exact stack count from Backpack first using exact invIndex
        const items = adapter.getItems();
        const raw = items[ammoItem.invIndex];
        if (!raw) return;
        const p = parseItem(raw);
        if (ammoItem.isCoating) {
            const remVials = (p.qty || 1) - unitsConsumed;
            if (remVials <= 0) items.splice(ammoItem.invIndex, 1);
            else items[ammoItem.invIndex] = `${p.emoji}${remVials > 1 ? remVials + 'x ' : ''}${p.name}`.trim();
        } else {
            const packCount = p.hasQty ? p.qty : ammoItem.unitCount;
            const remRounds = packCount - unitsConsumed;
            if (remRounds <= 0) items.splice(ammoItem.invIndex, 1);
            else items[ammoItem.invIndex] = `${p.emoji}${remRounds > 1 ? remRounds + 'x ' : ''}${p.name}`.trim();
        }
        adapter.saveItems(items);

        const store = getWeaponAmmoStore();
        const prevEntry = store.weapons[weaponMeta.id] || normalizeWeaponAmmoEntry(null);

        // Enforce 1 specialty ammo type per weapon: eject previous unused type cleanly back to Backpack!
        if (prevEntry.loadedId && prevEntry.count > 0 && prevEntry.loadedId !== ammoItem.ammoId) {
            returnLoadedAmmoToBackpack(weaponMeta.id, prevEntry.loadedId, prevEntry.count, false);
            prevEntry.loadedId = null;
            prevEntry.count = 0;
            prevEntry.fromCoating = false;
        }

        const nextCount = (prevEntry.loadedId === ammoItem.ammoId ? prevEntry.count : 0) + roundsToAdd;
        const isCoatedEntry = Boolean(ammoItem.isCoating || (prevEntry.loadedId === ammoItem.ammoId && prevEntry.fromCoating));
        store.weapons[weaponMeta.id] = {
            loadedId: ammoItem.ammoId,
            count: nextCount,
            fromCoating: isCoatedEntry,
            active: ammoItem.ammoId,
            lastShot: null
        };
        saveWeaponAmmoStore(store);

        if (typeof adapter.onAmmoLoaded === 'function') {
            try { adapter.onAmmoLoaded(weaponMeta.id, roundsToAdd, ammoItem.ammoId, !!ammoItem.isCoating); } catch (e) {}
        }

        const verb = ammoItem.isCoating ? 'Coated first' : 'Loaded';
        adapter.log(`${verb} <strong>${roundsToAdd} ${esc(ammoItem.ammoDef.shortName)}</strong> in <strong>${esc(weaponMeta.label)}</strong> (${nextCount} ready &bull; ${esc(getActionEconomyNote(ammoItem, weaponMeta))}).`);
        closeModal('rpg-ammo-loader-dialog');
        applyEquipmentToSheet(true);
        refreshAllAmmoDisplays();
    }

    function makeStarterPresetId(p, idx) {
        const slug = String(p?.label || 'preset').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 24) || 'preset';
        return `starter_${idx}_${slug}`;
    }

    function findInventoryRawByPresetSpec(spec, itemsOverride) {
        if (!spec) return null;
        const items = itemsOverride || (adapter ? adapter.getItems() : []);
        const lower = String(spec).toLowerCase().trim();
        if (!lower) return null;
        const cleanLower = lower.replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
        return items.find(r => normKey(r) === lower)
            || items.find(r => r.toLowerCase().includes(lower))
            || (cleanLower ? items.find(r => normKey(r) === cleanLower || r.toLowerCase().includes(cleanLower)) : null)
            || null;
    }

    function computePresetSlotLabels(slots, itemsOverride) {
        const out = {};
        if (!slots || !adapter) return out;
        const items = itemsOverride || adapter.getItems();
        for (const s of getActiveSlots()) {
            if (!Object.prototype.hasOwnProperty.call(slots, s.id)) continue;
            const spec = slots[s.id];
            if (spec === null || spec === '') {
                out[s.label] = 'Cleared (Empty)';
            } else {
                const raw = findInventoryRawByPresetSpec(spec, items);
                const grip = (s.id === 'mainHand' && slots._grip === '2h') ? ' (2H)' : '';
                out[s.label] = (raw ? shortLabel(raw) : String(spec)) + grip;
            }
        }
        return out;
    }

    function getAllPresets() {
        if (!adapter) return [];
        try {
            const rawV2 = localStorage.getItem(getUnifiedPresetsKey());
            if (rawV2) {
                const parsed = JSON.parse(rawV2);
                if (parsed && parsed.initialized && Array.isArray(parsed.presets)) {
                    return parsed.presets.map((p, i) => ({
                        id: p.id || `preset_${i}`,
                        label: String(p.label || `Preset ${i + 1}`),
                        slots: p.slots && typeof p.slots === 'object' ? { ...p.slots } : {},
                        slotLabels: p.slotLabels || computePresetSlotLabels(p.slots),
                        isStarter: !!p.isStarter,
                        modified: !!p.modified,
                        isCustom: !p.isStarter || !!p.modified,
                        presetIdx: i
                    }));
                }
            }
        } catch (e) {}

        // First-time seed: convert starter presets + migrate any legacy v1 custom presets into editable v2 store
        const activeSlots = getActiveSlots();
        const items = adapter.getItems();
        const seeded = (adapter.presets || []).map((p, i) => ({
            id: makeStarterPresetId(p, i),
            label: p.label,
            slots: { ...(p.slots || {}) },
            slotLabels: computePresetSlotLabels(p.slots || {}, items),
            isStarter: true,
            modified: false
        }));

        try {
            const rawV1 = localStorage.getItem(getCustomPresetsKey());
            const v1Arr = rawV1 ? JSON.parse(rawV1) : [];
            if (Array.isArray(v1Arr)) {
                v1Arr.forEach((cp, i) => {
                    if (!cp || !cp.label) return;
                    const normalizedSlots = { ...(cp.slots || {}) };
                    // Legacy v1 snapshots matched empty slots too; preserve explicit clears for unset slots
                    activeSlots.forEach(s => {
                        if (!Object.prototype.hasOwnProperty.call(normalizedSlots, s.id)) {
                            normalizedSlots[s.id] = null;
                        }
                    });
                    const nextObj = {
                        id: `custom_v1_${i}_${Date.now()}`,
                        label: cp.label,
                        slots: normalizedSlots,
                        slotLabels: computePresetSlotLabels(normalizedSlots, items),
                        isStarter: false,
                        modified: true
                    };
                    const dupIdx = seeded.findIndex(sp => sp.label.toLowerCase() === cp.label.toLowerCase());
                    if (dupIdx !== -1) seeded[dupIdx] = nextObj;
                    else seeded.push(nextObj);
                });
            }
        } catch (e) {}

        saveAllPresets(seeded);
        return seeded.map((p, i) => ({ ...p, isCustom: !p.isStarter || !!p.modified, presetIdx: i }));
    }

    function saveAllPresets(list) {
        if (!adapter) return;
        const clean = (Array.isArray(list) ? list : []).map((p, i) => ({
            id: p.id || `preset_${Date.now()}_${i}`,
            label: String(p.label || `Preset ${i + 1}`),
            slots: p.slots && typeof p.slots === 'object' ? p.slots : {},
            slotLabels: p.slotLabels || computePresetSlotLabels(p.slots),
            isStarter: !!p.isStarter,
            modified: !!p.modified
        }));
        localStorage.setItem(getUnifiedPresetsKey(), JSON.stringify({ initialized: true, presets: clean }));
    }

    function getCustomPresets() {
        return getAllPresets().filter(p => !p.isStarter || p.modified);
    }

    function hasMissingOrModifiedStarters() {
        const starters = adapter?.presets || [];
        if (starters.length === 0) return false;
        const cur = getAllPresets();
        return starters.some((sp, i) => !cur.some(cp => cp.id === makeStarterPresetId(sp, i) || cp.label.toLowerCase() === sp.label.toLowerCase()));
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
        const idsToCheck = [recipe.id, ...(Array.isArray(recipe.legacyIds) ? recipe.legacyIds : [])];
        const localIds = getUnlockedRecipeIds();
        const fbIds = getFbUnlockedRecipeIds();
        return idsToCheck.some(id => localIds.includes(id) || fbIds.includes(id));
    }

    function unlockRecipeById(recipeId) {
        const match = CRAFTING_RECIPES.find(r => r.id === recipeId || (Array.isArray(r.legacyIds) && r.legacyIds.includes(recipeId)));
        if (!match) return false;
        const unlocked = getUnlockedRecipeIds();
        if (!unlocked.includes(match.id)) {
            unlocked.push(match.id);
            localStorage.setItem(getUnlockedRecipesKey(), JSON.stringify(unlocked));
        }
        adapter.log(`🔓 <strong>Recipe Unlocked: ${esc(match.name)} (${esc(match.badge)})!</strong> Added permanently to your Crafting Workbench.`);
        applyEquipmentToSheet(true);
        renderCraftModal();
        return true;
    }

    function unlockRecipeByCode(rawCode) {
        const inp = document.getElementById('rpg-unlock-recipe-input');
        const code = String(rawCode !== undefined ? rawCode : (inp ? inp.value : '')).trim().toUpperCase();
        if (!code) return;
        const match = CRAFTING_RECIPES.find(r =>
            (r.unlockCode && r.unlockCode.toUpperCase() === code) ||
            (Array.isArray(r.unlockAliases) && r.unlockAliases.some(a => a.toUpperCase() === code))
        );
        if (!match) {
            adapter.log(`⚠️ <strong>Unknown Recipe Code:</strong> "${esc(code)}". Check the formula code given by the DM.`);
            return;
        }
        if (inp) inp.value = '';
        unlockRecipeById(match.id);
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
        let idx = items.findIndex(raw => normKey(raw) === itemKey);
        if (idx === -1) {
            const cleanTarget = String(itemKey).replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim();
            if (cleanTarget) {
                idx = items.findIndex(raw => normKey(raw).replace(/\s*\([^)]*\)\s*/g, ' ').replace(/\s+/g, ' ').trim() === cleanTarget);
            }
        }
        return idx;
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
            if (['mainHand', 'offHand', 'ranged', 'legSheath'].includes(s.id) && meta.category === 'weapon' && !meta.isShield) {
                const nativeSet = new Set(adapter.nativeWeaponTags || []);
                const wId = (meta.weaponTag && nativeSet.has(meta.weaponTag)) ? meta.weaponTag : k;
                const wCombat = getWeaponCombatMods(wId);
                if (wCombat.acBonus) bonuses.acBonus += wCombat.acBonus;
                if (wCombat.saveBonus) bonuses.saveBonus += wCombat.saveBonus;
                if (wCombat.spellDcBonus) bonuses.spellDcBonus += wCombat.spellDcBonus;
                if (wCombat.spellAtkBonus) bonuses.spellAtkBonus += wCombat.spellAtkBonus;
                if (wCombat.initBonus) bonuses.initBonus += wCombat.initBonus;
                if (wCombat.stealthDisadv) bonuses.stealthDisadv = true;
                (wCombat.mods || []).forEach(m => {
                    bonuses.activePerks.push(`<strong>${esc(shortLabel(raw))} Mod:</strong> ${esc(m.badge || m.modName)}`);
                });
                if (wCombat.coating) bonuses.activePerks.push(`<strong>${esc(shortLabel(raw))} Coating:</strong> ${esc(wCombat.coating.label)}`);
            }
        }

        if (typeof hudState === 'object' && hudState && Array.isArray(hudState.statuses)) {
            if (hudState.statuses.includes('half_cover')) bonuses.acBonus += 2;
            if (hudState.statuses.includes('surge_ac')) bonuses.acBonus += 2;
        }
        return bonuses;
    }

    function isDynamicWeaponTwoHanded(raw, meta) {
        if (!raw || !meta) return false;
        if (meta.hands === 2) return true;
        if (!meta.versatile) return false;
        const eq = reconcileEquippedWithInventory();
        const key = normKey(raw);
        return Boolean(eq.mainHand === key && isMainHandTwoHanded(eq));
    }

    function resolveWeaponCombatStats(raw, meta, isTwoHanded = false) {
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
            magic = 2; dice = isTwoHanded ? '1d10' : '1d8'; dmgType = 'Radiant'; extraDice = '1d8'; extraType = 'Radiant vs Undead';
        } else if (low.includes('blood spear')) {
            magic = 2; dice = isTwoHanded ? '1d8' : '1d6'; dmgType = 'Piercing';
        } else if (low.includes('greatsword') || low.includes('vladimir')) {
            dice = '2d6'; dmgType = low.includes('silver') ? 'Silvered Slashing' : 'Slashing';
        } else if (low.includes('longsword') || low.includes('battleaxe') || low.includes('treebane')) {
            dice = isTwoHanded ? '1d10' : '1d8'; dmgType = low.includes('silver') ? 'Silvered Slashing' : 'Slashing';
        } else if (low.includes('hand crossbow')) {
            dice = '1d6'; dmgType = 'Piercing';
        } else if (low.includes('heavy crossbow')) {
            dice = '1d10'; dmgType = 'Piercing';
        } else if (low.includes('rapier') || low.includes('longbow') || low.includes('light crossbow') || low.includes('crossbow')) {
            dice = '1d8'; dmgType = low.includes('silver') ? 'Silvered Piercing' : 'Piercing';
        } else if (low.includes('spear') || low.includes('staff')) {
            dice = isTwoHanded ? '1d8' : '1d6';
            dmgType = low.includes('staff') ? (low.includes('silver') ? 'Silvered Bludgeoning' : 'Bludgeoning') : (low.includes('silver') ? 'Silvered Piercing' : 'Piercing');
        } else if (low.includes('shortsword') || low.includes('scimitar') || low.includes('shortbow') || low.includes('bow') || low.includes('handaxe') || low.includes('mace')) {
            dice = '1d6'; dmgType = low.includes('mace') ? (low.includes('silver') ? 'Silvered Bludgeoning' : 'Bludgeoning') : (low.includes('silver') ? 'Silvered Piercing' : 'Piercing');
        } else if (low.includes('sling')) {
            dice = '1d4'; dmgType = 'Bludgeoning';
        } else if (low.includes('dagger') || low.includes('knife') || low.includes('fan')) {
            dice = '1d4'; dmgType = low.includes('silver') ? 'Silvered Piercing' : 'Piercing';
        }
        return {
            atkBonus: heroAbil + pb + magic,
            dmgDice: dice,
            dmgBonus: heroAbil + magic,
            dmgType,
            extraDice,
            extraType,
            isTwoHanded: Boolean(isTwoHanded)
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
        const is2H = isDynamicWeaponTwoHanded(raw, meta);
        const st = resolveWeaponCombatStats(raw, meta, is2H);
        const weaponId = normKey(raw);
        let shotInfo = null;
        if (meta.ammoKind) {
            shotInfo = consumeWeaponAmmo(weaponId);
        }
        const aDef = shotInfo && shotInfo.def ? shotInfo.def : null;
        const wCombat = getWeaponCombatMods(weaponId);
        const effAtkBonus = st.atkBonus + (aDef ? (aDef.atkBonus || 0) : 0) + wCombat.atkBonus;
        const effDmgBonus = st.dmgBonus + (aDef ? (aDef.dmgBonus || 0) : 0) + wCombat.dmgBonus;
        const mode = (typeof window.rollMode === 'string') ? window.rollMode : 'norm';
        let d20 = Math.floor(Math.random() * 20) + 1;
        let modeNote = '';
        if (mode === 'adv' || mode === 'dis') {
            const d2 = Math.floor(Math.random() * 20) + 1;
            const chosen = mode === 'adv' ? Math.max(d20, d2) : Math.min(d20, d2);
            modeNote = ` <small style="color:#94a3b8;">(${mode === 'adv' ? 'Adv' : 'Dis'} [${d20}, ${d2}])</small>`;
            d20 = chosen;
            consumeTempRollMode();
        }
        const total = d20 + effAtkBonus;
        const name = shortLabel(raw);
        const ammoTag = aDef
            ? ` <span style="color:#e2e8f0; font-size:0.74rem; font-weight:700;">[${esc(aDef.shortName)} &bull; ${shotInfo.remaining} left${shotInfo.exhausted ? ' &mdash; last loaded round fired' : ''}]</span>`
            : '';
        const modBadgeTag = wCombat.mod ? ` <span style="color:#93c5fd; font-size:0.72rem;">[${esc(wCombat.mod.badge)}]</span>` : '';
        const coatBadgeTag = wCombat.coating ? ` <span style="color:#6ee7b7; font-size:0.72rem;">[${esc(wCombat.coating.label)}]</span>` : '';
        const makeSilver = Boolean((aDef && aDef.isSilvered) || wCombat.isSilvered);
        const effDmgType = (makeSilver && !String(st.dmgType).toLowerCase().includes('silver'))
            ? `Silvered ${st.dmgType}`
            : st.dmgType;

        spendTurnAction('action');

        if (d20 === 20) {
            const base = rollDiceExpr(st.dmgDice);
            let critTotal = base.max + base.sum + effDmgBonus;
            let extraHtml = '';
            if (st.extraDice) {
                const ex = rollDiceExpr(st.extraDice);
                critTotal += ex.max + ex.sum;
                extraHtml += ` + ${ex.max}+[${ex.rolls.join('+')}](${esc(st.extraType || 'Bonus')})`;
            }
            if (aDef && aDef.extraDice) {
                const exA = rollDiceExpr(aDef.extraDice);
                critTotal += exA.max + exA.sum;
                extraHtml += ` + ${exA.max}+[${exA.rolls.join('+')}](${esc(aDef.extraType || aDef.shortName)})`;
            }
            wCombat.extras.forEach(exM => {
                const exR = rollDiceExpr(exM.dice);
                critTotal += exR.max + exR.sum;
                extraHtml += ` + ${exR.max}+[${exR.rolls.join('+')}](${esc(exM.type)})`;
            });
            adapter.log(`<strong style="color:#facc15;">NAT 20 BRUTAL CRIT — ${esc(name)}!</strong> d20[<strong>20</strong>]${modeNote} + ${effAtkBonus} = <strong>${total} to Hit</strong>!${ammoTag}${modBadgeTag}${coatBadgeTag} Brutal Crit Damage: ${base.max} (Max) + [${base.rolls.join('+')}] + ${effDmgBonus}${extraHtml} = <span style="color:#f87171; font-size:1.12rem; font-weight:800;">${critTotal} ${esc(effDmgType)} Damage</span>!`);
            return;
        }
        setRollFollowup({
            label: `💥 Roll ${name} Damage`,
            isCrit: false,
            onDamage: () => rollDynamicWeaponDamage(invIdx)
        });
        const tag = d20 === 1 ? ' <strong style="color:#f87171;">(NAT 1 MISS!)</strong>' : '';
        adapter.log(`<strong>${esc(name)} Attack:</strong> d20[<strong>${d20}</strong>]${modeNote} + ${effAtkBonus} = <span style="color:#fde68a; font-size:1.1rem; font-weight:800;">${total} to Hit</span>${tag}${ammoTag}${modBadgeTag}${coatBadgeTag}`);
    }

    function rollDynamicWeaponDamage(invIdx) {
        const raw = adapter.getItems()[invIdx];
        if (!raw) return;
        const meta = getItemMeta(raw);
        const is2H = isDynamicWeaponTwoHanded(raw, meta);
        const st = resolveWeaponCombatStats(raw, meta, is2H);
        const gripTag = meta.versatile ? (is2H ? ' (2H)' : ' (1H)') : '';
        const weaponId = normKey(raw);
        const aDef = meta.ammoKind ? getWeaponLastShotDef(weaponId) : null;
        const wCombat = getWeaponCombatMods(weaponId);
        const effDmgBonus = st.dmgBonus + (aDef ? (aDef.dmgBonus || 0) : 0) + wCombat.dmgBonus;
        const base = rollDiceExpr(st.dmgDice);
        let total = base.sum + effDmgBonus;
        let breakdown = `${st.dmgDice}[<strong>${base.rolls.join('+')}</strong>]${effDmgBonus ? (effDmgBonus > 0 ? ' + ' + effDmgBonus : ' - ' + Math.abs(effDmgBonus)) : ''}`;
        if (st.extraDice) {
            const ex = rollDiceExpr(st.extraDice);
            total += ex.sum;
            breakdown += ` + <span style="color:#fb923c;">${st.extraDice}[${ex.rolls.join('+')} ${esc(st.extraType || 'Bonus')}]</span>`;
        }
        if (aDef && aDef.extraDice) {
            const exA = rollDiceExpr(aDef.extraDice);
            total += exA.sum;
            breakdown += ` + <span style="color:#fde68a;">${aDef.extraDice}[${exA.rolls.join('+')} ${esc(aDef.extraType || aDef.shortName)}]</span>`;
        }
        wCombat.extras.forEach(exM => {
            const exR = rollDiceExpr(exM.dice);
            total += exR.sum;
            breakdown += ` + <span style="color:#fde68a;">${exM.dice}[${exR.rolls.join('+')} ${esc(exM.type)}]</span>`;
        });
        const isSilv = Boolean((aDef && aDef.isSilvered) || wCombat.isSilvered);
        const effDmgType = (isSilv && !String(st.dmgType).toLowerCase().includes('silver'))
            ? `Silvered ${st.dmgType}`
            : st.dmgType;
        const notes = [];
        if (isSilv || String(effDmgType).toLowerCase().includes('silver')) notes.push('Bypasses Werewolf, Vampire &amp; Hag resistance');
        if (wCombat.isMagical) notes.push('Counts as Magical');
        if (aDef && aDef.haltsRegen) notes.push('Halts Vampire Regeneration for 1 round');
        if (aDef && aDef.blocksHealing) notes.push('Target cannot regain HP until start of your next turn');
        if (aDef && aDef.saveNote) notes.push(esc(aDef.saveNote));
        wCombat.saveNotes.forEach(sn => notes.push(esc(sn)));
        const noteHtml = notes.length ? ` <small style="color:#cbd5e1;">(${notes.join(' &bull; ')})</small>` : '';
        adapter.log(`<strong>${esc(shortLabel(raw))}${gripTag} Damage:</strong> ${breakdown} = <span style="color:#f87171; font-size:1.12rem; font-weight:800;">${total} ${esc(effDmgType)} Damage</span>!${noteHtml}`);
    }

    function buildWeaponModAndCoatingBadgesHtml(weaponId) {
        const wCombat = getWeaponCombatMods(weaponId);
        const pills = [];
        const encW = encArg(weaponId);
        (wCombat.mods || []).forEach(m => {
            pills.push(`<span class="rpg-card-equipped-pill" style="background:rgba(59,130,246,0.16); color:#93c5fd; border-color:rgba(59,130,246,0.45);">Attached: ${esc(m.badge)} <button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:18px; padding:0 5px; font-size:0.62rem;" onclick="COS_RPG.detachWeaponMod(decodeURIComponent('${encW}'), '${esc(m.slotId || '')}')">Detach</button></span>`);
        });
        if (wCombat.coating) {
            pills.push(`<span class="rpg-card-equipped-pill" style="background:rgba(16,185,129,0.16); color:#6ee7b7; border-color:rgba(52,211,153,0.45);">Coated: ${esc(wCombat.coating.label)} <button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:18px; padding:0 5px; font-size:0.62rem;" onclick="COS_RPG.clearWeaponMeleeCoating(decodeURIComponent('${encW}'))">Clear</button></span>`);
        }
        return pills.length ? `<div style="display:flex; flex-wrap:wrap; gap:4px; margin:4px 0;">${pills.join('')}</div>` : '';
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
            const is2H = (slotId === 'mainHand' && bonuses.mainHand2H) || meta.hands === 2;
            const st = resolveWeaponCombatStats(raw, meta, is2H);
            const gripLabel = meta.versatile ? (is2H ? '2H ' : '1H ') : '';
            const weaponId = normKey(raw);
            const aDef = meta.ammoKind ? getActiveWeaponAmmoDef(weaponId) : null;
            const wCombat = getWeaponCombatMods(weaponId);
            const effAtk = st.atkBonus + (aDef ? (aDef.atkBonus || 0) : 0) + wCombat.atkBonus;
            const effDmgBonus = st.dmgBonus + (aDef ? (aDef.dmgBonus || 0) : 0) + wCombat.dmgBonus;
            const dmgParts = [`${st.dmgDice}${effDmgBonus ? (effDmgBonus > 0 ? '+' + effDmgBonus : effDmgBonus) : ''}`];
            if (st.extraDice) dmgParts.push(`+${st.extraDice}`);
            if (aDef && aDef.extraDice) dmgParts.push(`+${aDef.extraDice}`);
            wCombat.extras.forEach(exM => dmgParts.push(`+${exM.dice}`));
            const dmgLabel = dmgParts.join(' ');
            const effDmgType = ((wCombat.isSilvered || (aDef && aDef.isSilvered)) && !String(st.dmgType).toLowerCase().includes('silver'))
                ? `Silvered ${st.dmgType}`
                : st.dmgType;
            const ammoStripHtml = meta.ammoKind ? buildWeaponAmmoBarHtml(weaponId, { id: weaponId, kind: meta.ammoKind, maxCap: detectWeaponMaxCap(raw, meta) }) : '';
            const modCoatHtml = buildWeaponModAndCoatingBadgesHtml(weaponId);
            const card = document.createElement('div');
            card.className = 'action-card rpg-dyn-weapon-card';
            card.style.borderLeft = '3px solid #f59e0b';
            card.innerHTML = `
                <div class="action-header">
                    <div>
                        <div onclick="COS_RPG.openItemDetails(${idx})" style="cursor:pointer; color:#f8fafc;">
                            ${esc(shortLabel(raw))} <span style="font-size:0.68rem; color:var(--text-muted);">ℹ️</span>
                        </div>
                        <div style="font-size:0.66rem; font-weight:700; color:#fde68a;">Equipped in ${slotObj.label}${meta.versatile ? (is2H ? ' (2H)' : ' (1H)') : (slotId === 'mainHand' && bonuses.mainHand2H ? ' (2-Handed)' : '')} • +${effAtk} Hit • ${esc(dmgLabel)} ${esc(effDmgType)}</div>
                    </div>
                    <span class="rpg-card-equipped-pill">${meta.versatile ? (is2H ? '2H' : '1H') : 'WORN'}</span>
                </div>
                <div class="action-desc">${esc(meta.summary || 'Equipped weapon from Backpack.')}</div>
                ${modCoatHtml}
                ${ammoStripHtml}
                <div class="action-btn-row" style="flex-wrap:wrap;">
                    <button type="button" class="btn-roll-action" data-rpg-turn-slot="${slotId === 'offHand' ? 'bonus' : 'action'}" onclick="COS_RPG.rollDynamicWeaponAttack(${idx})">Attack (+${effAtk})</button>
                    <button type="button" class="btn-roll-action btn-roll-dmg" data-rpg-turn-slot="none" onclick="COS_RPG.rollDynamicWeaponDamage(${idx})">Damage (${gripLabel}${esc(dmgLabel)})</button>
                    ${buildWeaponModalActionButtonsHtml(weaponId)}
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
        refreshAllAmmoDisplays();
        renderHubPanel();
        renderHeaderBadges();
        if (document.getElementById('rpg-equip-modal')?.open) renderEquipModal();
        if (document.getElementById('rpg-backpack-modal')?.open) renderBackpackModal();
        if (typeof syncCombatActionLocks === 'function') syncCombatActionLocks();
        syncHeroStateToFirebase();
    }

    function equipItemToSlot(slotId, itemKey, gripMode = null) {
        const eq = reconcileEquippedWithInventory();
        const raw = findInventoryRawByKey(itemKey);
        if (!raw) return;
        const meta = getItemMeta(raw);

        // Enforce class / feat equipment proficiency unless DM Override is active
        const profCheck = checkItemProficiency(raw, meta);
        if (!profCheck.allowed && !isDmOverrideActive()) {
            adapter.log(`<strong>Restricted Equipment:</strong> ${esc(shortLabel(raw))} requires <strong>${esc(profCheck.requirement)}</strong>. Enable <strong>DM Override</strong> inside Equipment if unlocked for this scenario.`);
            return;
        }

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

    function getSlotMatchScore(preset, eq) {
        if (!preset || !preset.slots) return -1;
        const entries = Object.entries(preset.slots);
        let slotCount = 0;
        const items = adapter.getItems();
        for (const [slotId, spec] of entries) {
            if (slotId === '_grip') {
                if ((preset.slots.mainHand || eq.mainHand) && (eq._grip || '1h') !== spec) return -1;
                continue;
            }
            if (spec === null || spec === '') {
                if (eq[slotId]) return -1;
                slotCount += 1;
                continue;
            }
            const curKey = eq[slotId];
            if (!curKey) return -1;
            const lowerSpec = String(spec).toLowerCase().trim();
            const curRaw = items.find(r => normKey(r) === curKey) || curKey;
            if (curKey !== lowerSpec && !curRaw.toLowerCase().includes(lowerSpec)) return -1;
            slotCount += 1;
        }
        return slotCount > 0 ? slotCount : -1;
    }

    function matchesPresetSlots(preset, eq) {
        return getSlotMatchScore(preset, eq) > 0;
    }

    function getActivePresetInfo(eqOverride) {
        const eq = eqOverride || reconcileEquippedWithInventory();
        const all = getAllPresets();
        const contextPreset = lastAppliedPresetId ? all.find(p => p.id === lastAppliedPresetId) || null : null;
        if (contextPreset && matchesPresetSlots(contextPreset, eq)) {
            return { label: contextPreset.label, isCustom: !!contextPreset.isCustom, isMatch: true, preset: contextPreset, contextPreset };
        }
        // Pick most specific matching preset (highest matched slot count, preferring user-edited presets on ties)
        let best = null;
        let bestScore = -1;
        for (const p of all) {
            const sc = getSlotMatchScore(p, eq);
            if (sc > bestScore || (sc === bestScore && p.modified && best && !best.modified)) {
                best = p;
                bestScore = sc;
            }
        }
        if (best) {
            return { label: best.label, isCustom: !!best.isCustom, isMatch: true, preset: best, contextPreset: contextPreset || best };
        }
        return { label: 'Custom Loadout', isCustom: false, isMatch: false, preset: null, contextPreset };
    }

    function applyLoadoutPreset(presetIdx) {
        const presets = getAllPresets();
        const p = presets[presetIdx];
        if (!p) return;
        const eq = reconcileEquippedWithInventory();
        const items = adapter.getItems();
        const overrideOn = isDmOverrideActive();
        const skipped = [];
        for (const [slotId, spec] of Object.entries(p.slots || {})) {
            if (slotId === '_grip') {
                eq._grip = spec;
                continue;
            }
            if (spec === null || spec === '') {
                delete eq[slotId];
                continue;
            }
            const found = findInventoryRawByPresetSpec(spec, items);
            if (found) {
                const meta = getItemMeta(found);
                const profCheck = checkItemProficiency(found, meta);
                if (!profCheck.allowed && !overrideOn) {
                    skipped.push(`${shortLabel(found)} (${profCheck.requirement})`);
                    continue;
                }
                eq[slotId] = normKey(found);
            }
        }
        if (isMainHandTwoHanded(eq)) delete eq.offHand;
        lastAppliedPresetId = p.id;
        saveEquippedState(eq);
        announceStatus(`Swapped loadout preset to ${p.label}.`);
        adapter.log(`⚡ <strong>Loadout Swapped:</strong> ${esc(p.label)}!${skipped.length ? `<br><small style="color:#fca5a5;">Skipped restricted items (DM Override OFF): ${esc(skipped.join(', '))}</small>` : ''}`);
        applyEquipmentToSheet();
    }

    let presetFocusTargetId = null;

    function buildSlotDrafts(sourceMode, targetPreset) {
        const eq = reconcileEquippedWithInventory();
        const items = adapter.getItems();
        const activeSlots = getActiveSlots();
        const slotDrafts = {};
        const presetSlots = (targetPreset && targetPreset.slots) ? targetPreset.slots : {};

        for (const s of activeSlots) {
            const hasSavedSpec = Object.prototype.hasOwnProperty.call(presetSlots, s.id);
            const savedSpec = presetSlots[s.id];
            const eqKey = eq[s.id] || '';
            const compatible = items.filter(r => (getItemMeta(r).slots || []).includes(s.id));

            if (sourceMode === 'preset' && targetPreset) {
                let resolvedVal = eqKey || (compatible[0] ? normKey(compatible[0]) : '__clear__');
                let checked = false;
                if (hasSavedSpec) {
                    checked = true;
                    if (savedSpec === null || savedSpec === '') {
                        resolvedVal = '__clear__';
                    } else {
                        const rawFound = findInventoryRawByPresetSpec(savedSpec, items);
                        resolvedVal = rawFound ? normKey(rawFound) : ('__raw__:' + String(savedSpec));
                    }
                }
                slotDrafts[s.id] = {
                    checked,
                    val: resolvedVal,
                    grip: (s.id === 'mainHand') ? (presetSlots._grip || eq._grip || '1h') : undefined
                };
            } else {
                const checked = Boolean(eqKey && findInventoryRawByKey(eqKey));
                let val = checked ? eqKey : (compatible[0] ? normKey(compatible[0]) : '__clear__');
                if (!checked && hasSavedSpec && (savedSpec === null || savedSpec === '')) {
                    val = '__clear__';
                }
                slotDrafts[s.id] = {
                    checked,
                    val,
                    grip: (s.id === 'mainHand') ? (eq._grip || '1h') : undefined
                };
            }
        }
        return slotDrafts;
    }

    function syncPresetDraftsFromDom() {
        if (!presetEditor) return;
        const nameInp = document.getElementById('rpg-new-preset-name');
        if (nameInp) presetEditor.draftName = nameInp.value;
        const container = document.getElementById('rpg-preset-slots-container');
        if (!container) return;
        for (const s of getActiveSlots()) {
            const chk = document.getElementById(`rpg-pslot-chk-${s.id}`);
            const sel = document.getElementById(`rpg-pslot-sel-${s.id}`);
            if (!presetEditor.slotDrafts[s.id]) continue;
            if (chk) presetEditor.slotDrafts[s.id].checked = !!chk.checked;
            if (sel) presetEditor.slotDrafts[s.id].val = sel.value;
            if (s.id === 'mainHand') {
                const gripSel = document.getElementById('rpg-preset-grip-sel');
                if (gripSel) presetEditor.slotDrafts[s.id].grip = gripSel.value;
            }
        }
    }

    function openSavePresetForm(targetPresetId = '__new__') {
        const all = getAllPresets();
        const tp = (targetPresetId && targetPresetId !== '__new__')
            ? all.find(p => p.id === targetPresetId)
            : null;
        presetEditor = {
            mode: 'save',
            targetId: tp ? tp.id : '__new__',
            draftName: tp ? tp.label : '',
            slotDrafts: buildSlotDrafts('equipped', tp),
            errorMsg: ''
        };
        presetFocusTargetId = 'rpg-new-preset-name';
        renderEquipModal();
    }

    function openEditPresetForm(presetIdx) {
        const all = getAllPresets();
        const p = all[presetIdx];
        if (!p) return;
        presetEditor = {
            mode: 'edit',
            targetId: p.id,
            draftName: p.label,
            slotDrafts: buildSlotDrafts('preset', p),
            errorMsg: ''
        };
        presetFocusTargetId = 'rpg-new-preset-name';
        renderEquipModal();
    }

    function closePresetForm() {
        presetEditor = null;
        presetFocusTargetId = null;
        renderEquipModal();
    }

    function onPresetTargetChange(newTargetId) {
        if (!presetEditor) return;
        syncPresetDraftsFromDom();
        const all = getAllPresets();
        const prevTp = all.find(p => p.id === presetEditor.targetId);
        const nextTp = (newTargetId && newTargetId !== '__new__') ? all.find(p => p.id === newTargetId) : null;
        presetEditor.targetId = nextTp ? nextTp.id : '__new__';
        if (nextTp) {
            presetEditor.draftName = nextTp.label;
        } else if (prevTp && presetEditor.draftName.trim() === prevTp.label) {
            presetEditor.draftName = '';
        }
        presetEditor.errorMsg = '';
        presetFocusTargetId = 'rpg-preset-target';
        renderEquipModal();
    }

    function pullEquippedIntoPresetEditor() {
        if (!presetEditor) return;
        const nameInp = document.getElementById('rpg-new-preset-name');
        if (nameInp) presetEditor.draftName = nameInp.value;
        presetEditor.slotDrafts = buildSlotDrafts('equipped', null);
        presetEditor.errorMsg = '';
        announceStatus('Loaded currently equipped gear into preset slots.');
        presetFocusTargetId = 'rpg-preset-pull-btn';
        renderEquipModal();
    }

    function togglePresetSlotScope(scope) {
        if (!presetEditor) return;
        syncPresetDraftsFromDom();
        const combatSet = new Set(['body', 'cape', 'amulet', 'mainHand', 'offHand', 'legSheath', 'ranged']);
        for (const s of getActiveSlots()) {
            const draft = presetEditor.slotDrafts[s.id];
            if (!draft) continue;
            if (scope === 'all') {
                draft.checked = Boolean(draft.val && draft.val !== '__clear__');
            } else if (scope === 'combat') {
                draft.checked = combatSet.has(s.id) && Boolean(draft.val && draft.val !== '__clear__');
            } else if (scope === 'none') {
                draft.checked = false;
            }
        }
        presetEditor.errorMsg = '';
        const grid = document.getElementById('rpg-preset-slots-container');
        if (grid) {
            for (const s of getActiveSlots()) {
                const draft = presetEditor.slotDrafts[s.id];
                const chk = document.getElementById(`rpg-pslot-chk-${s.id}`);
                const row = document.querySelector(`[data-slot-row="${s.id}"]`);
                if (chk && draft) chk.checked = !!draft.checked;
                if (row && draft) row.classList.toggle('is-checked', !!draft.checked);
            }
        }
    }

    function submitPresetEditorForm() {
        if (!presetEditor) return;
        syncPresetDraftsFromDom();
        const inp = document.getElementById('rpg-new-preset-name');
        const errEl = document.getElementById('rpg-preset-error');
        const label = (presetEditor.draftName || '').trim().slice(0, 36);
        if (!label) {
            presetEditor.errorMsg = 'Enter a short name for this equipment preset.';
            if (inp) {
                inp.setAttribute('aria-invalid', 'true');
                inp.focus();
            }
            if (errEl) errEl.textContent = presetEditor.errorMsg;
            return;
        }

        const items = adapter.getItems();
        const newSlots = {};
        let selectedCount = 0;

        for (const s of getActiveSlots()) {
            const draft = presetEditor.slotDrafts[s.id];
            if (!draft || !draft.checked) continue;
            selectedCount += 1;
            if (!draft.val || draft.val === '__clear__') {
                newSlots[s.id] = null;
            } else if (String(draft.val).startsWith('__raw__:')) {
                newSlots[s.id] = String(draft.val).slice(8);
            } else {
                newSlots[s.id] = draft.val;
            }
        }

        if (selectedCount === 0) {
            presetEditor.errorMsg = 'Select at least 1 gear slot to save into this preset.';
            if (errEl) errEl.textContent = presetEditor.errorMsg;
            const firstChk = document.querySelector('#rpg-preset-slots-container input[type="checkbox"]');
            if (firstChk) firstChk.focus();
            return;
        }

        if (newSlots.mainHand) {
            const mhRaw = findInventoryRawByPresetSpec(newSlots.mainHand, items);
            const mhMeta = mhRaw ? getItemMeta(mhRaw) : null;
            let grip = presetEditor.slotDrafts.mainHand?.grip || '1h';
            if (mhMeta && mhMeta.hands === 2) grip = '2h';
            else if (mhMeta && !mhMeta.versatile && mhMeta.hands === 1) grip = '1h';
            newSlots._grip = grip;
            if (grip === '2h' && newSlots.offHand) {
                delete newSlots.offHand;
            }
        }

        const list = getAllPresets().map(p => ({
            id: p.id,
            label: p.label,
            slots: p.slots,
            slotLabels: p.slotLabels,
            isStarter: p.isStarter,
            modified: p.modified
        }));
        const slotLabels = computePresetSlotLabels(newSlots, items);
        let savedObj = null;
        let actionWord = 'Saved New';

        if (presetEditor.targetId && presetEditor.targetId !== '__new__') {
            const tIdx = list.findIndex(p => p.id === presetEditor.targetId);
            if (tIdx !== -1) {
                const prev = list[tIdx];
                actionWord = presetEditor.mode === 'edit' ? 'Updated' : 'Saved Gear to';
                savedObj = {
                    id: prev.id,
                    label,
                    slots: newSlots,
                    slotLabels,
                    isStarter: !!prev.isStarter,
                    modified: true
                };
                list[tIdx] = savedObj;
            }
        }

        if (!savedObj) {
            const existingSameName = list.findIndex(p => p.label.toLowerCase() === label.toLowerCase());
            const newId = existingSameName !== -1 ? list[existingSameName].id : `custom_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
            savedObj = {
                id: newId,
                label,
                slots: newSlots,
                slotLabels,
                isStarter: existingSameName !== -1 ? !!list[existingSameName].isStarter : false,
                modified: true
            };
            if (existingSameName !== -1) {
                list[existingSameName] = savedObj;
                actionWord = 'Updated';
            } else {
                list.push(savedObj);
            }
        }

        saveAllPresets(list);
        lastAppliedPresetId = savedObj.id;
        presetEditor = null;
        presetFocusTargetId = null;
        const slotCount = Object.keys(slotLabels).length;
        announceStatus(`${actionWord} preset ${label} with ${slotCount} slots.`);
        adapter.log(`💾 <strong>${actionWord} Equipment Preset:</strong> "${esc(label)}" (${slotCount} slot${slotCount === 1 ? '' : 's'})!`);
        syncHeroStateToFirebase(false);
        renderEquipModal();
    }

    function saveCurrentAsPreset() {
        if (!presetEditor) {
            openSavePresetForm(lastAppliedPresetId || '__new__');
            return;
        }
        submitPresetEditorForm();
    }

    function deletePreset(idx) {
        const list = getAllPresets().map(p => ({
            id: p.id,
            label: p.label,
            slots: p.slots,
            slotLabels: p.slotLabels,
            isStarter: p.isStarter,
            modified: p.modified
        }));
        if (idx < 0 || idx >= list.length) return;
        const [removed] = list.splice(idx, 1);
        saveAllPresets(list);
        if (lastAppliedPresetId === removed.id) lastAppliedPresetId = null;
        if (presetEditor && presetEditor.targetId === removed.id) presetEditor = null;
        announceStatus(`Deleted preset ${removed.label}.`);
        adapter.log(`🗑️ Deleted preset "${esc(removed.label)}".`);
        syncHeroStateToFirebase(false);
        renderEquipModal();
    }

    function restoreStarterPresets() {
        const starters = adapter?.presets || [];
        if (starters.length === 0) return;
        const items = adapter.getItems();
        const list = getAllPresets().map(p => ({
            id: p.id,
            label: p.label,
            slots: p.slots,
            slotLabels: p.slotLabels,
            isStarter: p.isStarter,
            modified: p.modified
        }));
        let restored = 0;
        starters.forEach((sp, i) => {
            const sid = makeStarterPresetId(sp, i);
            if (!list.some(p => p.id === sid || p.label.toLowerCase() === sp.label.toLowerCase())) {
                list.unshift({
                    id: sid,
                    label: sp.label,
                    slots: { ...(sp.slots || {}) },
                    slotLabels: computePresetSlotLabels(sp.slots || {}, items),
                    isStarter: true,
                    modified: false
                });
                restored += 1;
            }
        });
        saveAllPresets(list);
        if (presetEditor && presetEditor.mode === 'save' && presetEditor.targetId === '__new__') {
            // keep editor open
        }
        announceStatus(`Restored ${restored} starter presets.`);
        adapter.log(`↺ <strong>Restored Starter Presets:</strong> ${restored > 0 ? restored + ' default preset(s) added back!' : 'All starter presets are already present.'}`);
        syncHeroStateToFirebase(false);
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

        const act = meta.useAction;
        if (act.type === 'learnRecipe' && act.recipeId) {
            const rec = CRAFTING_RECIPES.find(r => r.id === act.recipeId);
            if (rec && isRecipeUnlocked(rec)) {
                adapter.log(`Already learned recipe: <strong>${esc(rec.name)}</strong> (${esc(rec.badge)}).`);
                return;
            }
            if (unlockRecipeById(act.recipeId)) {
                adapter.log(`Studied <strong>${esc(shortLabel(raw))}</strong> — unlocked <strong>${esc(rec ? rec.name : act.recipeId)}</strong> on your Crafting Workbench.`);
            }
            return;
        }

        // Deduct 1 from inventory
        const newQty = parsed.qty - 1;
        if (newQty <= 0) items.splice(invIndex, 1);
        else items[invIndex] = `${parsed.emoji}${newQty > 1 ? newQty + 'x ' : ''}${parsed.name}`.trim();
        adapter.saveItems(items);
        if (act.type === 'heal') {
            spendTurnAction(act.actionCost || 'bonus');
            let rolls = [], sum = 0;
            for (let i = 0; i < act.dice; i++) {
                const r = Math.floor(Math.random() * act.sides) + 1;
                rolls.push(r); sum += r;
            }
            const total = sum + (act.bonus || 0);
            const res = adapter.healHP(total, false);
            const capNote = (res && typeof res.healed === 'number' && res.healed < total)
                ? ` <small style="color:#94a3b8;">(+${res.healed} restored, capped at Max HP — no Temp HP)</small>`
                : '';
            adapter.log(`💚 <strong>${act.verb} ${esc(shortLabel(raw))}:</strong> [${rolls.join('+')}]${act.bonus ? ' + ' + act.bonus : ''} = <span style="color:#4ade80; font-size:1.08rem; font-weight:800;">+${total} HP</span>${capNote}`);
        } else if (act.type === 'tempHp') {
            spendTurnAction(act.actionCost || 'bonus');
            let rolls = [], sum = 0;
            for (let i = 0; i < act.dice; i++) {
                const r = Math.floor(Math.random() * act.sides) + 1;
                rolls.push(r); sum += r;
            }
            const total = sum + (act.bonus || 0);
            const res = adapter.healHP(total, 'temp');
            const durTxt = act.duration ? ` (${esc(act.duration)})` : '';
            const keptTxt = (res && res.keptExisting)
                ? ` <small style="color:#94a3b8;">(kept higher existing +${res.prevTemp} Temp HP — 5e non-stacking)</small>`
                : '';
            const extraTxt = act.extraNote ? `<br><small style="color:#fde68a;">✨ ${esc(act.extraNote)}</small>` : '';
            adapter.log(`🛡️ <strong>${act.verb || 'Drank'} ${esc(shortLabel(raw))}:</strong> [${rolls.join('+')}]${act.bonus ? ' + ' + act.bonus : ''} = <span style="color:#38bdf8; font-size:1.08rem; font-weight:800;">+${total} Temp HP</span>${durTxt}!${keptTxt}${extraTxt}`);
        } else if (act.type === 'overheal') {
            spendTurnAction(act.actionCost || 'bonus');
            let rolls = [], sum = 0;
            for (let i = 0; i < act.dice; i++) {
                const r = Math.floor(Math.random() * act.sides) + 1;
                rolls.push(r); sum += r;
            }
            const total = sum + (act.bonus || 0);
            const res = adapter.healHP(total, 'overheal');
            const durTxt = act.duration ? ` for ${esc(act.duration)}` : '';
            let detailTxt = `<span style="color:#4ade80; font-size:1.08rem; font-weight:800;">+${total} HP</span> restored!`;
            if (res && typeof res.overflowTemp === 'number' && res.overflowTemp > 0) {
                const tempPart = res.keptExisting
                    ? `<span style="color:#94a3b8;">${res.overflowTemp} excess (kept higher +${res.prevTemp} Temp HP)</span>`
                    : `<span style="color:#38bdf8; font-weight:800;">+${res.overflowTemp} Temp HP</span>${durTxt}`;
                detailTxt = res.healed > 0
                    ? `<span style="color:#4ade80; font-weight:800;">+${res.healed} HP</span> + Overheal ➔ ${tempPart}!`
                    : `Full HP — Overheal ➔ ${tempPart}!`;
            }
            adapter.log(`✨ <strong>${act.verb || 'Drank'} ${esc(shortLabel(raw))}:</strong> [${rolls.join('+')}]${act.bonus ? ' + ' + act.bonus : ''} (${total}) ➔ ${detailTxt}`);
        } else if (act.type === 'holyWater') {
            spendTurnAction('action');
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            adapter.log(`💧 <strong>Splashed ${esc(shortLabel(raw))}:</strong> 2d6[${d1}+${d2}] = <span style="color:#fde68a; font-size:1.08rem; font-weight:800;">${d1 + d2} Radiant Damage</span> to Undead/Fiends — <strong>VAMPIRE REGEN HALTED FOR 1 ROUND!</strong>`);
        } else if (act.type === 'dreamPastry') {
            spendTurnAction('bonus');
            const d6 = Math.floor(Math.random() * 6) + 1;
            adapter.healHP(d6, true);
            adapter.log(`🥧 <strong>Ate Morgantha's Dream Pastry:</strong> Gained <span style="color:#38bdf8; font-size:1.08rem; font-weight:800;">+${d6} Temp HP</span> &amp; cured 1 Exhaustion! <small style="color:#f87171;">(⚠️ 8-hr blissful dream trance — DC 13 CON Save at dawn!)</small>`);
        } else if (act.type === 'alchemistsFire') {
            spendTurnAction('action');
            const d4 = Math.floor(Math.random() * 4) + 1;
            adapter.log(`🔥 <strong>Threw ${esc(shortLabel(raw))} (20 ft):</strong> Target takes <span style="color:#fb923c; font-size:1.08rem; font-weight:800;">${d4} Fire Damage</span> at the start of each of its turns until doused (<code>DC 10 DEX Check</code>)!`);
        } else if (act.type === 'phosphorBomb') {
            spendTurnAction('action');
            const d1 = Math.floor(Math.random() * 6) + 1;
            const d2 = Math.floor(Math.random() * 6) + 1;
            adapter.log(`💣 <strong>Threw ${esc(shortLabel(raw))} (30 ft, 10-ft radius):</strong> 2d6[${d1}+${d2}] = <span style="color:#fde68a; font-size:1.08rem; font-weight:800;">${d1 + d2} Fire/Radiant Damage</span> + <strong>Blinded 1 turn</strong> (<code>DC 13 DEX/CON Save</code>; lights up blood-mist &amp; invisible foes!).`);
        } else if (act.type === 'utilityLog') {
            adapter.log(`<strong>${esc(act.verb || 'Used')} ${esc(shortLabel(raw))}:</strong> ${esc(act.effect || act.label)}`);
        }
        applyEquipmentToSheet(true);
    }

    // =========================================================================
    // UNIFIED CRAFTING ENGINE
    // =========================================================================
    function matchesIngredient(itemName, keyword) {
        const meta = getItemMeta(itemName);
        if (meta && meta.useAction && meta.useAction.type === 'learnRecipe') return false;
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
        const batchCount = incoming.hasQty ? (incoming.qty * Math.max(1, addQty)) : Math.max(1, addQty);
        const existingIdx = items.findIndex(r => parseItem(r).name.toLowerCase().trim() === incKey);
        if (existingIdx !== -1) {
            const ex = parseItem(items[existingIdx]);
            const total = ex.qty + batchCount;
            items[existingIdx] = `${ex.emoji || incoming.emoji}${total > 1 ? total + 'x ' : ''}${ex.name}`.trim();
        } else if (batchCount > 1) {
            items.unshift(`${incoming.emoji}${batchCount}x ${incoming.name}`.trim());
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
            weaponAmmo: getWeaponAmmoStore().weapons,
            ammoState: getAmmoState(),
            weaponMods: getWeaponModsStore().mods,
            weaponCoatings: getWeaponCoatingStore().coatings,
            dmOverrideActive: isDmOverrideActive(),
            concentration: hudState.conc || null,
            conditions: Array.isArray(hudState.statuses) ? [...hudState.statuses] : [],
            deathSaves: hudState.deathSaves ? { ...hudState.deathSaves } : { succ: 0, fail: 0 },
            showPartyHud: Boolean(hudState.showPartyHud),
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
                    am: snap.ammoState,
                    wm: snap.weaponMods,
                    wc: snap.weaponCoatings,
                    ov: snap.dmOverrideActive,
                    cn: snap.concentration,
                    st: snap.conditions,
                    ds: snap.deathSaves,
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
        let rawUnifiedPresets = null;
        try {
            const pRaw = localStorage.getItem(getUnifiedPresetsKey());
            if (pRaw) rawUnifiedPresets = JSON.parse(pRaw);
        } catch (e) {}
        const checkpointPayload = {
            ...snap,
            equippedMap: getEquippedState(),
            customGearMap: getCustomGearMap(),
            rawUnifiedPresets,
            sheetState: (typeof adapter.captureSheetState === 'function') ? adapter.captureSheetState() : null,
            syncedAt: Date.now(),
            syncedTimeStr: timeStr
        };
        try {
            localStorage.setItem(getCheckpointBackupKey(), JSON.stringify(checkpointPayload));
        } catch (e) {}

        if (firebaseReady && rtdb) {
            if (!silentToast) {
                clearAllMyWhisperThreads();
            }
            campaignRtdbRef(`heroes/${adapter.heroId}/state`).set(snap).catch(() => {});
            campaignRtdbRef(`heroes/${adapter.heroId}/synced_checkpoint`).set(checkpointPayload).then(() => {
                const btn = document.getElementById('rpg-hdr-sync-btn');
                if (btn) {
                    btn.innerHTML = `✅ Synced (${timeStr})`;
                    btn.style.borderColor = 'var(--accent-green)';
                    setTimeout(() => {
                        if (btn) {
                            btn.innerHTML = `☁️ Sync`;
                            btn.style.borderColor = '';
                            btn.style.color = '';
                        }
                    }, 4000);
                }
                if (!silentToast) {
                    const combined = [snap.sheetExportStr, snap.notesExportStr].filter(Boolean).join('\n');
                    if (combined && navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(combined).catch(() => {});
                    }
                    adapter.log(`☁️ <strong>Synced Official Checkpoint to DM (${esc(timeStr)})!</strong><br><small style="color:var(--accent-green);">Sheet state saved to DM Screen &amp; set as your 🔄 Reset restore point.</small>`);
                }
            }).catch(err => {
                if (!silentToast) adapter.log(`⚠️ Cloud Sync failed: ${esc(err.message)}`);
            });
        } else if (!silentToast) {
            clearAllMyWhisperThreads();
            const combined = [snap.sheetExportStr, snap.notesExportStr].filter(Boolean).join('\n');
            if (combined && navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(combined).then(() => {
                    adapter.log(`📋 <strong>Saved Local Checkpoint (${esc(timeStr)}) &amp; Copied Sheet State to Clipboard!</strong>`);
                });
            } else {
                adapter.log(`💾 <strong>Saved Local Checkpoint (${esc(timeStr)})!</strong> Clicking 🔄 Reset will restore this checkpoint.`);
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
                adapter.log(`<strong>DM Unlocked Crafting Recipe:</strong> <strong>${esc(addedTitle)}</strong> is now available in your Crafting Workbench.`);
            }
            if (addedTitle || removedIds.length > 0) {
                renderHubPanel();
                if (document.getElementById('rpg-craft-modal')?.open) renderCraftModal();
            }
        });

        // 2b. Live sync remote DM Equipment Override flag (enables/disables restricted gear remotely!)
        let overrideListenerReady = false;
        campaignRtdbRef(`heroes/${adapter.heroId}/dm_gear_override`).on('value', snap => {
            const val = snap.val();
            const nextEnabled = Boolean(val && val.enabled);
            const prevActive = isDmOverrideActive();
            dmRemoteGearOverride = { enabled: nextEnabled, note: (val && val.note) || '' };
            try {
                if (nextEnabled) localStorage.setItem(getLocalDmOverrideKey(), '1');
                else localStorage.removeItem(getLocalDmOverrideKey());
            } catch (e) {}
            if (overrideListenerReady && nextEnabled !== prevActive) {
                adapter.log(nextEnabled
                    ? `<strong>DM Override Activated:</strong> Non-proficient equipment is now unlocked for this scenario.`
                    : `<strong>DM Override Removed:</strong> Class &amp; feat equipment restrictions re-enforced.`);
            }
            overrideListenerReady = true;
            applyEquipmentToSheet(true);
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
                    } else if (cmd.action === 'upgrade_item' && cmd.upgradedName) {
                        applyRemoteItemUpgrade(cmd);
                    } else if (cmd.action === 'request_checkpoint') {
                        pushSyncedCheckpoint(true);
                    } else if (cmd.action === 'reset_sheet_baseline') {
                        resetSheetToOfficialBaseline(true);
                    }
                }).catch(() => {});
            });
        });

        // 4. Discreet Multi-Recipient Messages Listener (ONLY loads threads where this hero is a participant!)
        startMessagesListener();

        // 5. Live Party Mini-HUD Listener (Reads ONLY piper, jacomir, yvaine states — never _dm_state)
        campaignRtdbRef('heroes').on('value', snap => {
            const val = snap.val() || {};
            const nextParty = {};
            ['jacomir', 'piper', 'yvaine'].forEach(hid => {
                if (val[hid] && val[hid].state) nextParty[hid] = val[hid].state;
            });
            livePartyMap = nextParty;
            renderPartyMiniHud();
        });

        // 6. Sanitized Fog-of-War Public Combat Turn-Order Listener (Read-Only)
        campaignRtdbRef('dm_state/public_combat').on('value', snap => {
            const val = snap.val();
            liveCombatState = (val && val.active && Array.isArray(val.combatants)) ? val : null;
            renderPublicCombatStrip();
        });
    }

    function applyRemoteItemUpgrade(cmd) {
        if (!adapter || !cmd || !cmd.upgradedName) return false;
        const matchList = Array.isArray(cmd.matchKeywords) ? cmd.matchKeywords.map(k => String(k).toLowerCase()) : [];
        const upgradedName = String(cmd.upgradedName).trim();
        const upgradedLow = upgradedName.toLowerCase();
        const matchesBase = (rawStr) => {
            const low = String(rawStr || '').toLowerCase();
            if (!low || low.includes(upgradedLow)) return false;
            return matchList.some(k => k && low.includes(k));
        };

        let upgradedSomething = false;
        let oldDisplay = '';

        // 1. Check Backpack items & keep equipped slot pointer synchronized!
        const items = adapter.getItems();
        const eq = getEquippedState();
        let eqChanged = false;
        for (let i = 0; i < items.length; i++) {
            if (matchesBase(items[i])) {
                const p = parseItem(items[i]);
                const oldKey = normKey(items[i]);
                oldDisplay = shortLabel(items[i]);
                const nextRaw = `${p.qty > 1 ? p.qty + 'x ' : ''}${upgradedName}`.trim();
                const nextKey = normKey(nextRaw);
                items[i] = nextRaw;
                Object.keys(eq).forEach(slotId => {
                    if (slotId !== '_grip' && eq[slotId] === oldKey) {
                        eq[slotId] = nextKey;
                        eqChanged = true;
                    }
                });
                upgradedSomething = true;
                break;
            }
        }
        if (upgradedSomething) {
            adapter.saveItems(items);
            if (eqChanged) saveEquippedState(eq);
        }

        // 2. Also check mounted weapon attachment slots in case the attachment is already slotted on a weapon!
        const modStore = getWeaponModsStore();
        let modChanged = false;
        Object.keys(modStore.mods).forEach(wid => {
            const slots = { ...getWeaponSlotsMap(wid) };
            let localHit = false;
            Object.entries(slots).forEach(([slotId, modObj]) => {
                if (!modObj) return;
                if (matchesBase(modObj.raw || modObj.modName || '')) {
                    oldDisplay = oldDisplay || shortLabel(modObj.raw || modObj.modName);
                    const upgMeta = getItemMeta(upgradedName);
                    const am = upgMeta && upgMeta.attachMeta ? upgMeta.attachMeta : null;
                    slots[slotId] = {
                        ...modObj,
                        modKey: am ? am.modKey : modObj.modKey,
                        raw: upgradedName,
                        modName: upgradedName,
                        atkBonus: am ? (am.atkBonus || 0) : (modObj.atkBonus || 0),
                        dmgBonus: am ? (am.dmgBonus || 0) : (modObj.dmgBonus || 0),
                        magCapDelta: am ? (am.magCapDelta || 0) : (modObj.magCapDelta || 0),
                        acBonus: am ? (am.acBonus || 0) : (modObj.acBonus || 0),
                        saveBonus: am ? (am.saveBonus || 0) : (modObj.saveBonus || 0),
                        spellDcBonus: am ? (am.spellDcBonus || 0) : (modObj.spellDcBonus || 0),
                        spellAtkBonus: am ? (am.spellAtkBonus || 0) : (modObj.spellAtkBonus || 0),
                        initBonus: am ? (am.initBonus || 0) : (modObj.initBonus || 0),
                        extraDice: am ? (am.extraDice || null) : (modObj.extraDice || null),
                        extraType: am ? (am.extraType || null) : (modObj.extraType || null),
                        isSilvered: am ? !!am.isSilvered : !!modObj.isSilvered,
                        isMagical: am ? !!am.isMagical : !!modObj.isMagical,
                        mistSight: am ? !!am.mistSight : !!modObj.mistSight,
                        silenced: am ? !!am.silenced : !!modObj.silenced,
                        stealthDisadv: am ? !!am.stealthDisadv : !!modObj.stealthDisadv,
                        debuffNote: am ? (am.debuffNote || null) : (modObj.debuffNote || null),
                        badgeLabel: (am && am.badgeLabel) || upgradedName
                    };
                    localHit = true;
                    modChanged = true;
                    upgradedSomething = true;
                }
            });
            if (localHit) {
                modStore.mods[wid] = { slots };
            }
        });
        if (modChanged) {
            saveWeaponModsStore(modStore);
        }

        if (upgradedSomething) {
            applyEquipmentToSheet(true);
            refreshAllAmmoDisplays();
            syncHeroStateToFirebase(true);
            adapter.log(`⬆️ <strong>DM Upgraded Gear:</strong> ${esc(oldDisplay || 'Item')} ➔ <strong>${esc(upgradedName)}</strong>${cmd.bonusSummary ? ` (${esc(cmd.bonusSummary)})` : ''}!`);
        } else {
            adapter.log(`⚠️ <strong>DM Upgrade Notice:</strong> Could not find base item for <strong>${esc(upgradedName)}</strong> in Backpack or mounted slots.`);
        }
        return upgradedSomething;
    }

    // =========================================================================
    // DISCREET PRIVATE & GROUP MESSAGING ENGINE (IN TRADE MODAL)
    // =========================================================================
    function getMsgReadStorageKey() { return `cos_msg_read_${adapter ? adapter.heroId : 'hero'}_v1`; }

    function getMsgReadMap() {
        try {
            const raw = localStorage.getItem(getMsgReadStorageKey());
            return raw ? (JSON.parse(raw) || {}) : {};
        } catch (e) { return {}; }
    }

    function saveMsgReadMap(map) {
        try { localStorage.setItem(getMsgReadStorageKey(), JSON.stringify(map)); } catch (e) {}
    }

    function computeThreadId(participantIds) {
        return [...new Set((participantIds || []).map(x => String(x).toLowerCase().trim()).filter(Boolean))].sort().join('_');
    }

    function formatThreadTitle(participants) {
        if (!Array.isArray(participants) || !adapter) return 'Conversation';
        const others = participants.filter(id => id !== adapter.heroId);
        if (others.length === 0) return 'Notes';
        return others.map(id => {
            if (id === 'dm') return 'DM';
            const m = PARTY_MEMBERS.find(p => p.id === id);
            return m ? m.name : id;
        }).join(' + ');
    }

    function getThreadMessagesList(threadObj) {
        if (!threadObj || !threadObj.messages || typeof threadObj.messages !== 'object') return [];
        return Object.entries(threadObj.messages)
            .map(([id, m]) => ({ id, ...(m || {}) }))
            .sort((a, b) => (a.ts || 0) - (b.ts || 0));
    }

    function getThreadUnreadCount(threadId) {
        if (!adapter) return 0;
        const t = msgThreads[threadId];
        if (!t) return 0;
        const readTs = getMsgReadMap()[threadId] || 0;
        return getThreadMessagesList(t).filter(m => m.senderId !== adapter.heroId && (m.ts || 0) > readTs).length;
    }

    function getTotalUnreadMessages() {
        return Object.keys(msgThreads).reduce((sum, tid) => sum + getThreadUnreadCount(tid), 0);
    }

    function markThreadRead(threadId) {
        if (!threadId) return;
        const map = getMsgReadMap();
        map[threadId] = Date.now();
        saveMsgReadMap(map);
        renderHubPanel();
        renderHeaderBadges();
    }

    function startMessagesListener() {
        if (!firebaseReady || !rtdb || !adapter) return;
        campaignRtdbRef('messages').on('value', snap => {
            const val = snap.val() || {};
            const myId = adapter.heroId;
            const filtered = {};
            Object.entries(val).forEach(([tid, tObj]) => {
                if (!tObj || typeof tObj !== 'object') return;
                const parts = Array.isArray(tObj.participants) ? tObj.participants : tid.split('_');
                if (parts.includes(myId)) {
                    filtered[tid] = {
                        participants: parts,
                        updatedAt: tObj.updatedAt || 0,
                        messages: tObj.messages || {}
                    };
                }
            });
            msgThreads = filtered;
            if (tradeActiveTab === 'messages' && msgActiveThreadId && document.getElementById('rpg-trade-modal')?.open) {
                markThreadRead(msgActiveThreadId);
                renderTradeModal();
            } else {
                renderHubPanel();
                renderHeaderBadges();
            }
        });
    }

    function toggleMsgRecipient(recipId) {
        if (!recipId || (adapter && recipId === adapter.heroId)) return;
        if (msgSelectedRecips.has(recipId)) msgSelectedRecips.delete(recipId);
        else msgSelectedRecips.add(recipId);
        if (msgSelectedRecips.size > 0 && adapter) {
            msgActiveThreadId = computeThreadId([adapter.heroId, ...Array.from(msgSelectedRecips)]);
            markThreadRead(msgActiveThreadId);
        } else {
            msgActiveThreadId = null;
        }
        renderTradeModal();
    }

    function selectMsgThread(threadId) {
        if (!threadId || !adapter) return;
        msgActiveThreadId = threadId;
        const t = msgThreads[threadId];
        const parts = (t && Array.isArray(t.participants)) ? t.participants : threadId.split('_');
        msgSelectedRecips = new Set(parts.filter(id => id !== adapter.heroId));
        markThreadRead(threadId);
        renderTradeModal();
    }

    function sendWhisperMessage(overrideText = null) {
        if (!adapter) return false;
        const inp = document.getElementById('rpg-msg-input');
        const text = String(overrideText !== null ? overrideText : (inp ? inp.value : '')).trim();
        if (!text) return false;
        const recips = Array.from(msgSelectedRecips).filter(id => id && id !== adapter.heroId);
        if (recips.length === 0) return false;
        const participants = [...new Set([adapter.heroId, ...recips])].sort();
        const tid = computeThreadId(participants);
        msgActiveThreadId = tid;
        const msgObj = {
            senderId: adapter.heroId,
            senderName: adapter.heroName,
            text,
            ts: Date.now()
        };
        if (inp && overrideText === null) inp.value = '';

        if (firebaseReady && rtdb) {
            const tRef = campaignRtdbRef(`messages/${tid}`);
            tRef.child('participants').set(participants).catch(() => {});
            tRef.child('updatedAt').set(msgObj.ts).catch(() => {});
            tRef.child('messages').push(msgObj).catch(() => {});
        } else {
            if (!msgThreads[tid]) msgThreads[tid] = { participants, updatedAt: msgObj.ts, messages: {} };
            msgThreads[tid].updatedAt = msgObj.ts;
            msgThreads[tid].messages['loc_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6)] = msgObj;
        }
        markThreadRead(tid);
        renderTradeModal();
        return true;
    }

    function clearWhisperThread(threadId = null) {
        const tid = threadId || msgActiveThreadId;
        if (!tid) return;
        delete msgThreads[tid];
        if (msgActiveThreadId === tid) msgActiveThreadId = null;
        if (firebaseReady && rtdb) {
            campaignRtdbRef(`messages/${tid}`).remove().catch(() => {});
        }
        renderHubPanel();
        renderHeaderBadges();
        if (document.getElementById('rpg-trade-modal')?.open) renderTradeModal();
    }

    function clearAllMyWhisperThreads() {
        if (!adapter) return;
        const myId = adapter.heroId;
        const myThreadIds = Object.keys(msgThreads).filter(tid => {
            const parts = msgThreads[tid]?.participants || tid.split('_');
            return parts.includes(myId);
        });
        myThreadIds.forEach(tid => {
            delete msgThreads[tid];
            if (firebaseReady && rtdb) {
                campaignRtdbRef(`messages/${tid}`).remove().catch(() => {});
            }
        });
        msgActiveThreadId = null;
        saveMsgReadMap({});
        renderHubPanel();
        renderHeaderBadges();
        if (document.getElementById('rpg-trade-modal')?.open && tradeActiveTab === 'messages') {
            renderTradeModal();
        }
    }

    function applyRestoredCheckpoint(cp) {
        if (!cp || !adapter) return;
        try {
            // 1. Restore Backpack Items first so equipped slots resolve against restored inventory
            if (Array.isArray(cp.items)) {
                adapter.saveItems([...cp.items]);
            }

            // 2. Restore Custom Gear metadata
            if (cp.customGearMap && typeof cp.customGearMap === 'object') {
                saveCustomGearMap(cp.customGearMap);
            }

            // 3. Restore Equipped Gear map (full raw map, or gracefully rebuild from legacy equippedSlots labels!)
            if (cp.equippedMap && typeof cp.equippedMap === 'object') {
                saveEquippedState(cp.equippedMap);
            } else if (cp.equippedSlots && typeof cp.equippedSlots === 'object') {
                const rebuilt = {};
                const activeSlots = getActiveSlots();
                const curItems = adapter.getItems();
                Object.entries(cp.equippedSlots).forEach(([slotLabel, itemLabel]) => {
                    const slotObj = activeSlots.find(s => s.label === slotLabel);
                    if (!slotObj || !itemLabel) return;
                    const is2H = /\(2H\)/i.test(String(itemLabel));
                    const cleanLbl = String(itemLabel).replace(/\s*\(2H\)\s*/ig, '').trim();
                    const cleanNorm = normKey(cleanLbl);
                    const foundRaw = curItems.find(r => normKey(r) === cleanNorm || normKey(shortLabel(r)) === cleanNorm || normKey(r).includes(cleanNorm));
                    if (foundRaw) {
                        rebuilt[slotObj.id] = normKey(foundRaw);
                        if (slotObj.id === 'mainHand') rebuilt._grip = is2H ? '2h' : '1h';
                    }
                });
                if (Object.keys(rebuilt).length > 0) saveEquippedState(rebuilt);
            }

            // 4. Restore Presets, Weapon Mods, Coatings & Specialty Ammo
            if (cp.rawUnifiedPresets && typeof cp.rawUnifiedPresets === 'object') {
                try { localStorage.setItem(getUnifiedPresetsKey(), JSON.stringify(cp.rawUnifiedPresets)); } catch (e) {}
            }
            if (cp.weaponMods && typeof cp.weaponMods === 'object') {
                saveWeaponModsStore({ mods: cp.weaponMods });
            } else {
                localStorage.removeItem(getWeaponModsStorageKey());
            }
            if (cp.weaponCoatings && typeof cp.weaponCoatings === 'object') {
                saveWeaponCoatingStore({ coatings: cp.weaponCoatings });
            } else {
                localStorage.removeItem(getWeaponCoatingStorageKey());
            }
            if (cp.weaponAmmo && typeof cp.weaponAmmo === 'object') {
                try { localStorage.setItem(getAmmoStorageKey(), JSON.stringify({ weapons: cp.weaponAmmo })); } catch (e) {}
            } else {
                localStorage.removeItem(getAmmoStorageKey());
            }

            // 5. Restore HUD State (Concentration, Statuses, Death Saves) & fresh Turn Pips
            hudState = {
                conc: (typeof cp.concentration === 'string' && cp.concentration.trim()) ? cp.concentration.trim() : null,
                statuses: Array.isArray(cp.conditions) ? cp.conditions.filter(id => STATUS_CATALOG.some(s => s.id === id)) : [],
                deathSaves: (cp.deathSaves && typeof cp.deathSaves === 'object')
                    ? { succ: Math.max(0, Math.min(3, parseInt(cp.deathSaves.succ) || 0)), fail: Math.max(0, Math.min(3, parseInt(cp.deathSaves.fail) || 0)) }
                    : { succ: 0, fail: 0 },
                turn: { action: true, bonus: true, reaction: true, move: true },
                advLocked: false,
                rightTab: hudState.rightTab || 'combat',
                tabPrefV3: true,
                skillsTrainedOnly: Boolean(hudState.skillsTrainedOnly),
                showPartyHud: typeof cp.showPartyHud === 'boolean' ? cp.showPartyHud : Boolean(hudState.showPartyHud)
            };
            saveHudState();
            syncPartyHudVisibility();

            // 6. Restore native sheet variables (HP, Temp HP, Gold/SP, Slots, Resources, Notes)
            if (typeof adapter.restoreSheetState === 'function') {
                const statePayload = (cp.sheetState && typeof cp.sheetState === 'object')
                    ? { ...cp.sheetState, notes: Array.isArray(cp.sheetState.notes) ? cp.sheetState.notes : cp.notes }
                    : {
                        curHP: typeof cp.curHp === 'number' ? cp.curHp : undefined,
                        tempHP: typeof cp.tempHp === 'number' ? cp.tempHp : 0,
                        curGP: typeof cp.gp === 'number' ? cp.gp : undefined,
                        curSilver: typeof cp.sp === 'number' ? cp.sp : undefined,
                        notes: Array.isArray(cp.notes) ? cp.notes : undefined
                    };
                adapter.restoreSheetState(statePayload);
            }

            // 7. Refresh all UI panels and sync LIVE state ONLY (never overwrite synced_checkpoint!)
            lastAppliedPresetId = null;
            presetEditor = null;
            applyEquipmentToSheet(true);
            renderStatusStrip();
            renderActionEconomyBar();
            renderDeathSavesBox(parseCurrentVitalsFromDom().cur);
            renderPartyMiniHud();
            syncCombatActionLocks();
            syncHeroStateToFirebase(true);

            const whenTxt = cp.syncedTimeStr
                ? cp.syncedTimeStr
                : (cp.syncedAt ? new Date(cp.syncedAt).toLocaleString() : 'Last Saved');
            adapter.log(`🔄 <strong>Restored to Last ☁️ Sync to DM Checkpoint (${esc(whenTxt)})!</strong> All unsaved changes since your last sync have been undone.`);
        } catch (e) {
            console.warn('[COS_RPG] Checkpoint restore error:', e);
        }
    }

    function executeSession1FactoryReset() {
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
            localStorage.removeItem(getUnifiedPresetsKey());
            localStorage.removeItem(getLocalDmOverrideKey());
            localStorage.removeItem(getAmmoStorageKey());
            localStorage.removeItem(getWeaponModsStorageKey());
            localStorage.removeItem(getWeaponCoatingStorageKey());
            localStorage.removeItem(getHudStorageKey());
            hudState = {
                conc: null,
                statuses: [],
                deathSaves: { succ: 0, fail: 0 },
                turn: { action: true, bonus: true, reaction: true, move: true },
                advLocked: false,
                rightTab: 'all',
                skillsTrainedOnly: false
            };
            renderStatusStrip();
            renderActionEconomyBar();
            setRightColumnTab('all');
            applySkillsFilter();
            renderDeathSavesBox(parseCurrentVitalsFromDom().cur);
            dmRemoteGearOverride = { enabled: false, note: '' };
            if (firebaseReady && rtdb) {
                campaignRtdbRef(`heroes/${adapter.heroId}/dm_gear_override`).set(null).catch(() => {});
            }
            lastAppliedPresetId = null;
            presetEditor = null;
            applyEquipmentToSheet(true);
            syncCombatActionLocks();
            syncHeroStateToFirebase(true);
            adapter.log(`🔄 <strong>Sheet Reset to Official Session 1 Baseline!</strong> (No prior ☁️ Sync to DM checkpoint existed yet.)`);
        } catch (e) {
            console.warn('[COS_RPG] Reset error:', e);
        }
    }

    function resetSheetToOfficialBaseline(skipConfirm = false) {
        if (!adapter) return;
        let localCp = null;
        try {
            const raw = localStorage.getItem(getCheckpointBackupKey());
            if (raw) localCp = JSON.parse(raw);
        } catch (e) {}

        const finishReset = (cloudCp) => {
            let bestCp = null;
            const localTs = (localCp && localCp.syncedAt) ? Number(localCp.syncedAt) : 0;
            const cloudTs = (cloudCp && cloudCp.syncedAt) ? Number(cloudCp.syncedAt) : 0;
            if (cloudCp && cloudTs >= localTs) bestCp = cloudCp;
            else if (localCp) bestCp = localCp;
            else if (cloudCp) bestCp = cloudCp;

            if (bestCp) {
                const whenTxt = bestCp.syncedTimeStr
                    ? bestCp.syncedTimeStr
                    : (bestCp.syncedAt ? new Date(bestCp.syncedAt).toLocaleString() : 'last saved');
                if (!skipConfirm && typeof window.confirm === 'function') {
                    const ok = window.confirm(`Restore ${adapter.heroName}'s sheet back to your last ☁️ Sync to DM checkpoint (${whenTxt})? This undoes unsaved changes since your last sync.`);
                    if (!ok) return;
                }
                applyRestoredCheckpoint(bestCp);
                return;
            }

            // Fallback ONLY if no ☁️ Sync to DM checkpoint has ever been saved
            if (!skipConfirm && typeof window.confirm === 'function') {
                const ok = window.confirm(`No ☁️ Sync to DM checkpoint found yet for ${adapter.heroName}. Reset sheet back to the Session 1 starting baseline?`);
                if (!ok) return;
            }
            executeSession1FactoryReset();
        };

        if (firebaseReady && rtdb) {
            campaignRtdbRef(`heroes/${adapter.heroId}/synced_checkpoint`).once('value').then(snap => {
                finishReset(snap.val() || null);
            }).catch(() => {
                finishReset(null);
            });
        } else {
            finishReset(null);
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

        // Inject ultra-clean 3-button right-header bar: ONLY [🛡️ Gear] [🎒 Bag] [☁️ Sync]
        // (Live Party, Trade & Chat, Quick Dice, Rules, Reset, & Portal live cleanly in the Bottom-Right ✦ Menu!)
        const badgeGroup = document.querySelector('.pill-badge-group');
        if (badgeGroup && !document.getElementById('rpg-hdr-equip-btn')) {
            badgeGroup.style.marginLeft = 'auto';
            badgeGroup.style.justifyContent = 'flex-end';
            const portalLink = badgeGroup.querySelector('a[href*="index.html"]');
            if (portalLink) portalLink.remove();

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
            syncBtn.className = 'rpg-header-btn rpg-btn-sync';
            syncBtn.title = 'Save official Session Checkpoint (Vitals, Slots, Gear, Presets, Notes & Live Party preference) directly to DM via Firebase';
            syncBtn.onclick = () => pushSyncedCheckpoint(false);
            syncBtn.innerHTML = `☁️ Sync`;

            // Ultra-clean 3-button right bar: [🛡️ Gear] [🎒 Bag] [☁️ Sync]
            badgeGroup.insertBefore(syncBtn, badgeGroup.firstChild);
            badgeGroup.insertBefore(bpBtn, badgeGroup.firstChild);
            badgeGroup.insertBefore(equipBtn, badgeGroup.firstChild);
        }

        // Mount 👥 Live Party Mini-HUD & ⚔️ Fog-of-War Combat Turn Strip right under Header / Incoming Banner
        const topAnchor = document.getElementById('rpg-incoming-banner') || document.querySelector('.top-dice-console') || header;
        if (topAnchor && !document.getElementById('rpg-party-hud')) {
            const partyHud = document.createElement('section');
            partyHud.id = 'rpg-party-hud';
            partyHud.className = 'rpg-party-hud';
            partyHud.setAttribute('aria-label', 'Live Party Vitals');
            topAnchor.insertAdjacentElement('afterend', partyHud);

            const combatStrip = document.createElement('section');
            combatStrip.id = 'rpg-combat-strip';
            combatStrip.className = 'rpg-combat-strip';
            combatStrip.setAttribute('aria-label', 'Combat Initiative Order');
            partyHud.insertAdjacentElement('afterend', combatStrip);
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
                            <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
                                <button type="button" class="rpg-mini-btn" onclick="COS_RPG.openBackpackModal()">Open Full Backpack</button>
                                <span id="rpg-equip-foot-save-mount" style="display:inline-flex; gap:6px; flex-wrap:wrap; align-items:center;"></span>
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

                <!-- PER-WEAPON SPECIALTY AMMO & COATING MODAL -->
                <dialog class="rpg-dialog" id="rpg-ammo-loader-dialog" closedby="any" aria-labelledby="rpg-ammo-loader-title" style="max-width:480px;">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-ammo-loader-title">Load Specialty Ammunition</h2>
                            <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-ammo-loader-dialog')" aria-label="Close Ammo Loader">✕</button>
                        </div>
                        <div class="rpg-modal-body" id="rpg-ammo-loader-body"></div>
                        <div class="rpg-modal-foot">
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-ammo-loader-dialog')">Cancel</button>
                            <button type="button" class="rpg-mini-btn btn-use" id="rpg-ammo-loader-confirm" onclick="COS_RPG.confirmLoadSpecialtyAmmo()">Load into Weapon</button>
                        </div>
                    </div>
                </dialog>

                <!-- WEAPON ATTACHMENT PICKER MODAL -->
                <dialog class="rpg-dialog" id="rpg-weapon-mod-dialog" closedby="any" aria-labelledby="rpg-weapon-mod-title" style="max-width:460px;">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-weapon-mod-title">Attach Weapon Upgrade</h2>
                            <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-weapon-mod-dialog')" aria-label="Close Weapon Attachment">✕</button>
                        </div>
                        <div class="rpg-modal-body" id="rpg-weapon-mod-body"></div>
                        <div class="rpg-modal-foot">
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-weapon-mod-dialog')">Cancel</button>
                            <button type="button" class="rpg-mini-btn btn-equip" id="rpg-weapon-mod-confirm" onclick="COS_RPG.confirmAttachWeaponMod()">Attach to Weapon</button>
                        </div>
                    </div>
                </dialog>

                <!-- ❓ COMBAT CONTROLS & TABLE HOUSE RULES MODAL -->
                <dialog class="rpg-dialog" id="rpg-rules-modal" closedby="any" aria-labelledby="rpg-rules-title" style="max-width:680px;">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-rules-title">❓ Combat Controls &amp; Barovian Table Rules</h2>
                            <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-rules-modal')" aria-label="Close Rules">✕</button>
                        </div>
                        <div class="rpg-modal-body">
                            <div class="rpg-rules-grid">
                                <div class="rpg-rules-card">
                                    <h3>🟢 Actions (1 / Turn)</h3>
                                    <div><strong>Attack:</strong> Strike with weapon or unarmed (Grapple/Shove).</div>
                                    <div><strong>Magic:</strong> Cast a spell with a 1 Action casting time.</div>
                                    <div><strong>Dash:</strong> Gain extra movement equal to your Speed.</div>
                                    <div><strong>Disengage:</strong> Movement doesn't provoke Opportunity Attacks.</div>
                                    <div><strong>Dodge:</strong> Attacks vs you have <strong>Disadvantage</strong>; Adv on DEX saves.</div>
                                    <div><strong>Help:</strong> Grant an ally Advantage on their next check or attack.</div>
                                    <div><strong>Hide / Search / Study / Ready:</strong> Stealth, Perception, Lore, or held trigger.</div>
                                </div>
                                <div class="rpg-rules-card">
                                    <h3>🟠 Bonus, 🟣 Reaction &amp; 🥾 Free</h3>
                                    <div><strong>Bonus Action:</strong> Only when a spell, potion, off-hand light weapon, or class feature grants one (e.g., <em>Second Wind, Hunter's Mark, Reload, Drinking a Potion</em>).</div>
                                    <div><strong>Reaction (1 / Round):</strong> <em>Opportunity Attack</em> (when a foe leaves 5 ft), <em>Shield</em>, <em>Parry</em>, <em>Riposte</em>, <em>Bend Fate</em>.</div>
                                    <div><strong>Free Interaction:</strong> Speak briefly, drop Prone (standing costs half speed), open an unlocked door, or draw/stow 1 weapon as part of an attack.</div>
                                    <div><strong>Cover:</strong> Half Cover = <strong>+2 AC &amp; DEX Saves</strong> • Three-Quarters = <strong>+5 AC &amp; DEX Saves</strong>.</div>
                                </div>
                                <div class="rpg-rules-card">
                                    <h3>🔥 Curse of Strahd Table Rules</h3>
                                    <div><strong>Brutal Crits (Nat 20):</strong> <code>Max Base Die + 1 Normal Roll + Modifiers</code> (auto-calculated in the Roll HUD!).</div>
                                    <div><strong>Potions:</strong> <strong>Bonus Action</strong> for yourself (<code>2d6+1 HP</code>); <strong>Action</strong> to feed a downed ally.</div>
                                    <div><strong>Help Tokens:</strong> Spend 1 to grant <strong>+1d6</strong> to any ally within 30 ft (<code>2/LR</code>, <code>+1</code> on Short Rest).</div>
                                    <div><strong>Short Rest:</strong> Heals <strong>25% Max HP</strong> (up to 2/day) + restores Short Rest features &amp; +1 Help Token.</div>
                                </div>
                                <div class="rpg-rules-card">
                                    <h3>💀 Standard 5e Death Saves &amp; Concentration</h3>
                                    <div><strong>At 0 HP (Unconscious):</strong> Roll a flat d20 at the start of each turn:</div>
                                    <div>• <strong>10–19:</strong> +1 Success (<strong>3 Successes</strong> = Stabilized at 0 HP).</div>
                                    <div>• <strong>2–9:</strong> +1 Failure (<strong>3 Failures</strong> = Dead!).</div>
                                    <div>• <strong>Nat 20:</strong> Regain <strong>1 HP</strong> immediately! • <strong>Nat 1:</strong> <strong>2 Failures</strong>!</div>
                                    <div><strong>Concentration:</strong> Taking damage triggers a <strong>CON Save</strong> (<code>DC 10</code> or <code>half damage taken</code>, whichever is higher).</div>
                                </div>
                            </div>
                        </div>
                        <div class="rpg-modal-foot">
                            <span style="font-size:0.7rem; color:#94a3b8;">Tip: Click your character's name at the top to view Ability Scores, Passives &amp; Origin Story.</span>
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-rules-modal')">Close</button>
                        </div>
                    </div>
                </dialog>

                <!-- ⛺ REST CHOOSER MODAL (Short Rest vs Long Rest) -->
                <dialog class="rpg-dialog" id="rpg-rest-modal" closedby="any" aria-labelledby="rpg-rest-title" style="max-width:560px;">
                    <div class="rpg-modal-shell">
                        <div class="rpg-modal-head">
                            <h2 id="rpg-rest-title">⛺ Take a Rest</h2>
                            <button type="button" class="rpg-modal-close" onclick="COS_RPG.closeModal('rpg-rest-modal')" aria-label="Close Rest Chooser">✕</button>
                        </div>
                        <div class="rpg-modal-body" id="rpg-rest-body"></div>
                        <div class="rpg-modal-foot">
                            <span style="font-size:0.7rem; color:#94a3b8;">Choose Short Rest (quick recovery) or Long Rest (full camp reset).</span>
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closeModal('rpg-rest-modal')">Cancel</button>
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
        const alertCount = incomingTrades.length + getTotalUnreadMessages();
        const tradeBadge = document.getElementById('rpg-fab-trade-badge');
        if (tradeBadge) {
            tradeBadge.textContent = alertCount > 0 ? String(alertCount) : '';
            tradeBadge.style.display = alertCount > 0 ? 'inline-flex' : 'none';
        }
        const fabDot = document.getElementById('rpg-fab-alert-dot');
        if (fabDot) fabDot.style.display = alertCount > 0 ? 'inline-block' : 'none';
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

        // Build Quick-Belt combat consumables & coating vials
        const quickBtns = [];
        items.forEach((raw, idx) => {
            const meta = getItemMeta(raw);
            if (!meta.quickBelt) return;
            const p = parseItem(raw);
            if (meta.coatMelee && !meta.useAction) {
                quickBtns.push(`
                    <button type="button" class="rpg-qb-btn" onclick="COS_RPG.openAmmoLoaderModal({ invIndex: ${idx} })" title="Coat Weapon or Magazine (${esc(p.name)})">
                        Coat: ${esc(meta.coatMelee.label)}${p.qty > 1 ? ` <span style="color:#6ee7b7; font-family:'JetBrains Mono',monospace;">(${p.qty}x)</span>` : ''}
                    </button>
                `);
                return;
            }
            if (!meta.useAction) return;
            const qbSlot = getConsumableTurnSlot(meta.useAction);
            quickBtns.push(`
                <button type="button" class="rpg-qb-btn" data-rpg-turn-slot="${qbSlot}" onclick="COS_RPG.useConsumableByIndex(${idx})" title="1-Tap Combat Use (${esc(p.name)})">
                    ${p.emoji}${esc(meta.useAction.label)}${p.qty > 1 ? ` <span style="color:#6ee7b7; font-family:'JetBrains Mono',monospace;">(${p.qty}x)</span>` : ''}
                </button>
            `);
        });

        const inCombat = (typeof isCombatActive === 'function') && isCombatActive();
        const beltHtml = quickBtns.length > 0
            ? `<span class="rpg-quickbelt-lbl">⚡ Belt:</span>${quickBtns.join('')}`
            : '';

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

                <button type="button" class="rpg-hub-tile tile-trade" onclick="COS_RPG.openTradeModal(${pendingCnt > 0 ? "'inbox'" : (getTotalUnreadMessages() > 0 ? "'messages'" : "'send'")})">
                    <div class="rpg-hub-tile-top">
                        <span>🤝 Trade &amp; Chat</span>
                        <span class="rpg-badge-count ${(pendingCnt + getTotalUnreadMessages()) > 0 ? 'pulse-alert' : ''}">${pendingCnt > 0 ? pendingCnt + ' drop' : (getTotalUnreadMessages() > 0 ? getTotalUnreadMessages() + ' msg' : 'Open')}</span>
                    </div>
                    <span class="rpg-hub-tile-sub">Trade items, gold &amp; private whispers</span>
                </button>
            </div>

            <div class="rpg-equipped-strip">
                ${chips.length > 0 ? chips.join('') : '<span style="font-size:0.71rem; color:#64748b; font-style:italic;">No gear equipped yet — click 🛡️ Equipment to slot your loadout!</span>'}
            </div>

            <div id="rpg-hub-quickbelt" class="rpg-hub-quickbelt">${inCombat ? '' : beltHtml}</div>
        `;

        // Smart Repositioning Belt: Top with Action Bar during Active Combat; down in Adventure Gear Hub during Free Roam!
        const topQb = document.getElementById('rpg-top-quickbelt');
        if (topQb) {
            topQb.innerHTML = inCombat ? beltHtml : '';
        }
        const mobQb = document.getElementById('rpg-mobile-combat-belt');
        if (mobQb) {
            mobQb.innerHTML = (!inCombat && beltHtml) ? beltHtml : '';
        }
        if (typeof syncCombatActionLocks === 'function') syncCombatActionLocks();
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

        // Live Stat Pills + Active Preset + Unified Preset Builder/Editor
        const acTxt = document.getElementById('ac-disp')?.innerText || '--';
        const allPresets = getAllPresets();
        const activePreset = getActivePresetInfo(eq);
        const currentTargetPreset = activePreset.preset || activePreset.contextPreset || null;

        const presetsHtml = allPresets.length > 0
            ? allPresets.map((p, idx) => {
                const isAct = activePreset.isMatch && activePreset.preset && activePreset.preset.id === p.id;
                const isCtx = !isAct && currentTargetPreset && currentTargetPreset.id === p.id;
                return `<span class="rpg-preset-wrap"><button type="button" class="rpg-preset-btn ${isAct ? 'preset-active' : ''}" onclick="COS_RPG.applyLoadoutPreset(${idx})">${esc(p.label)}${isCtx ? ' •' : ''}</button><button type="button" class="rpg-preset-edit" onclick="COS_RPG.openEditPresetForm(${idx})" aria-label="Edit preset ${esc(p.label)}" title="Edit preset name &amp; gear">✏️</button><button type="button" class="rpg-preset-del" onclick="COS_RPG.deletePreset(${idx})" aria-label="Delete preset ${esc(p.label)}" title="Delete preset">✕</button></span>`;
            }).join('')
            : `<button type="button" class="rpg-mini-btn" style="min-block-size:28px;" onclick="COS_RPG.restoreStarterPresets()">↺ Restore Starter Presets</button>`;

        const contextSaveBtnHtml = currentTargetPreset
            ? `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.openSavePresetForm('${esc(currentTargetPreset.id).replace(/'/g, "\\'")}')">💾 Save to: &ldquo;${esc(currentTargetPreset.label)}&rdquo;</button>`
            : (allPresets.length > 0
                ? `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.openSavePresetForm('${esc(allPresets[0].id).replace(/'/g, "\\'")}')">💾 Save to: Preset...</button>`
                : '');

        let presetFormHtml = '';
        if (presetEditor) {
            const isEditMode = presetEditor.mode === 'edit';
            const editingTargetObj = (presetEditor.targetId && presetEditor.targetId !== '__new__')
                ? allPresets.find(p => p.id === presetEditor.targetId)
                : null;
            const formTitle = isEditMode && editingTargetObj
                ? `✏️ Edit Preset: ${editingTargetObj.label}`
                : (editingTargetObj ? `💾 Update Existing Preset: ${editingTargetObj.label}` : '💾 Save New Equipment Preset');
            const submitLabel = editingTargetObj ? '💾 Save Changes' : '💾 Save Preset';

            const targetSelectHtml = !isEditMode ? `
                <div class="rpg-preset-field-grp" style="flex:0.9 1 190px;">
                    <label for="rpg-preset-target" class="rpg-preset-field-lbl">Save Target</label>
                    <select id="rpg-preset-target" name="presetTarget" class="rpg-select" onchange="COS_RPG.onPresetTargetChange(this.value)">
                        <option value="__new__" ${presetEditor.targetId === '__new__' ? 'selected' : ''}>➕ Create New Preset</option>
                        ${allPresets.map(p => `<option value="${esc(p.id)}" ${presetEditor.targetId === p.id ? 'selected' : ''}>💾 Update: ${esc(p.label)}</option>`).join('')}
                    </select>
                </div>
            ` : '';

            const slotRowsHtml = activeSlots.map(s => {
                const draft = presetEditor.slotDrafts[s.id];
                if (!draft) return '';
                const compatible = items.filter(r => (getItemMeta(r).slots || []).includes(s.id));
                const eqKey = eq[s.id] || '';
                const hasPreservedRaw = String(draft.val || '').startsWith('__raw__:');
                if (compatible.length === 0 && !eqKey && !draft.checked) return '';

                const seenKeys = new Set();
                const optionItems = [];
                compatible.forEach(raw => {
                    const k = normKey(raw);
                    if (seenKeys.has(k)) return;
                    seenKeys.add(k);
                    const suffix = eqKey === k ? ' (Equipped)' : '';
                    optionItems.push(`<option value="${esc(k)}" ${draft.val === k ? 'selected' : ''}>${esc(shortLabel(raw))}${suffix}</option>`);
                });
                if (eqKey && !seenKeys.has(eqKey)) {
                    const eqRaw = findInventoryRawByKey(eqKey);
                    if (eqRaw) {
                        seenKeys.add(eqKey);
                        optionItems.push(`<option value="${esc(eqKey)}" ${draft.val === eqKey ? 'selected' : ''}>${esc(shortLabel(eqRaw))} (Equipped)</option>`);
                    }
                }
                if (hasPreservedRaw) {
                    const rawSpec = String(draft.val).slice(8);
                    optionItems.push(`<option value="${esc(draft.val)}" selected>Saved: ${esc(rawSpec)}</option>`);
                }
                optionItems.push(`<option value="__clear__" ${draft.val === '__clear__' ? 'selected' : ''}>— Clear / Unequip Slot —</option>`);

                let gripHtml = '';
                if (s.id === 'mainHand') {
                    const selRaw = (draft.val && draft.val !== '__clear__' && !hasPreservedRaw)
                        ? findInventoryRawByKey(draft.val)
                        : (hasPreservedRaw ? findInventoryRawByPresetSpec(String(draft.val).slice(8), items) : null);
                    const selMeta = selRaw ? getItemMeta(selRaw) : null;
                    if (selMeta && selMeta.versatile) {
                        gripHtml = `
                            <select id="rpg-preset-grip-sel" class="rpg-preset-grip-sel" aria-label="Main Hand grip mode">
                                <option value="1h" ${(draft.grip || '1h') === '1h' ? 'selected' : ''}>1H</option>
                                <option value="2h" ${draft.grip === '2h' ? 'selected' : ''}>2H</option>
                            </select>
                        `;
                    } else if (selMeta && selMeta.hands === 2) {
                        gripHtml = `<span style="font-size:0.65rem; color:#c4b5fd; font-weight:800;">2H</span>`;
                    }
                }

                return `
                    <div class="rpg-preset-slot-row ${draft.checked ? 'is-checked' : ''}" data-slot-row="${s.id}">
                        <input type="checkbox" id="rpg-pslot-chk-${s.id}" class="rpg-preset-slot-chk" data-slot-id="${s.id}" ${draft.checked ? 'checked' : ''}>
                        <label for="rpg-pslot-chk-${s.id}" class="rpg-preset-slot-chk-lbl">${s.icon} ${esc(s.label)}</label>
                        <select id="rpg-pslot-sel-${s.id}" class="rpg-preset-slot-sel" data-slot-id="${s.id}" aria-label="${esc(s.label)} item for preset">
                            ${optionItems.join('')}
                        </select>
                        ${gripHtml}
                    </div>
                `;
            }).join('');

            presetFormHtml = `
                <form id="rpg-preset-form" class="rpg-preset-form" aria-labelledby="rpg-preset-form-title" novalidate>
                    <div class="rpg-preset-form-head">
                        <span id="rpg-preset-form-title" style="font-size:0.78rem; font-weight:800; color:#fde68a;">${esc(formTitle)}</span>
                        <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closePresetForm()" aria-label="Cancel preset editor">✕ Cancel</button>
                    </div>
                    <div class="rpg-preset-form-fields">
                        ${targetSelectHtml}
                        <div class="rpg-preset-field-grp" style="flex:1.4 1 220px;">
                            <label for="rpg-new-preset-name" class="rpg-preset-field-lbl">Preset Name <span aria-hidden="true" style="color:#f87171;">*</span></label>
                            <input type="text" id="rpg-new-preset-name" name="presetName" class="rpg-input rpg-preset-name-input" maxlength="36" required enterkeyhint="done" placeholder="e.g. Boss Fight, Stealth, Vampire Raid" value="${esc(presetEditor.draftName)}" aria-describedby="rpg-preset-error" ${presetEditor.errorMsg ? 'aria-invalid="true"' : ''}>
                        </div>
                    </div>
                    <fieldset class="rpg-preset-fieldset">
                        <legend>Certain Gear Slots to Save (uncheck any slot to leave untouched)</legend>
                        <div class="rpg-preset-scope-bar">
                            <span style="font-size:0.66rem; color:#94a3b8;">Checked slots are saved when you apply this preset.</span>
                            <div style="display:flex; gap:4px; flex-wrap:wrap;">
                                <button type="button" id="rpg-preset-pull-btn" class="rpg-mini-btn btn-equip" style="min-block-size:24px; padding:2px 6px; font-size:0.65rem;" onclick="COS_RPG.pullEquippedIntoPresetEditor()">⚡ Pull Equipped Gear</button>
                                <button type="button" class="rpg-mini-btn" style="min-block-size:24px; padding:2px 6px; font-size:0.65rem;" onclick="COS_RPG.togglePresetSlotScope('all')">All Gear</button>
                                <button type="button" class="rpg-mini-btn" style="min-block-size:24px; padding:2px 6px; font-size:0.65rem;" onclick="COS_RPG.togglePresetSlotScope('combat')">Combat Only</button>
                                <button type="button" class="rpg-mini-btn" style="min-block-size:24px; padding:2px 6px; font-size:0.65rem;" onclick="COS_RPG.togglePresetSlotScope('none')">Clear</button>
                            </div>
                        </div>
                        <div id="rpg-preset-slots-container" class="rpg-preset-slots-grid">
                            ${slotRowsHtml || '<span style="font-size:0.72rem; color:#94a3b8;">No equippable gear found in Backpack yet.</span>'}
                        </div>
                    </fieldset>
                    <div class="rpg-preset-form-foot">
                        <div id="rpg-preset-error" class="rpg-preset-form-error" role="status" aria-live="polite">${esc(presetEditor.errorMsg || '')}</div>
                        <div style="display:flex; gap:6px; flex-wrap:wrap; margin-left:auto;">
                            ${hasMissingOrModifiedStarters() ? `<button type="button" class="rpg-mini-btn" onclick="COS_RPG.restoreStarterPresets()">↺ Restore Starters</button>` : ''}
                            <button type="button" class="rpg-mini-btn" onclick="COS_RPG.closePresetForm()">Cancel</button>
                            <button type="submit" class="rpg-mini-btn btn-use">${submitLabel}</button>
                        </div>
                    </div>
                </form>
            `;
        }

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
        const dmOverrideOn = isDmOverrideActive();

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
                const profCheck = checkItemProficiency(item.raw, item.meta);
                const isRestricted = !profCheck.allowed && !dmOverrideOn;
                const isOverrideUnlocked = !profCheck.allowed && dmOverrideOn;

                const gripToggleHtml = isRestricted
                    ? `<button type="button" class="rpg-mini-btn btn-restricted" disabled title="Requires ${esc(profCheck.requirement)}">Restricted</button>`
                    : ((selectedSlot === 'mainHand' && item.meta.versatile)
                        ? `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('mainHand', '${esc(item.key).replace(/'/g, "\\'")}', '1h')">Equip 1H</button>
                           <button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('mainHand', '${esc(item.key).replace(/'/g, "\\'")}', '2h')">Equip 2H</button>`
                        : `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.equipItemToSlot('${selectedSlot}', '${esc(item.key).replace(/'/g, "\\'")}')">Equip${item.meta.hands === 2 && selectedSlot === 'mainHand' ? ' (2H)' : ''}</button>`);

                const restrictTagHtml = isRestricted
                    ? ` <span class="rpg-restrict-tag">Requires ${esc(profCheck.requirement)}</span>`
                    : (isOverrideUnlocked ? ` <span class="rpg-restrict-tag is-override">DM Override (${esc(profCheck.requirement)})</span>` : '');

                const safeKeyAttr = esc(item.key).replace(/'/g, "\\'");
                return `
                    <div class="rpg-picker-item ${isEqHere ? 'is-equipped' : (isRestricted ? 'is-restricted' : (isOverrideUnlocked ? 'is-override' : ''))}">
                        <div class="rpg-picker-item-top">
                            <div>
                                <div class="rpg-picker-item-name">${esc(shortLabel(item.raw))}${item.meta.isCustom ? ' <span class="rpg-card-unequipped-pill" style="color:#fde68a; border-color:rgba(245,158,11,0.45);">CUSTOM</span>' : ''}${restrictTagHtml}</div>
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
                    <label class="rpg-field-lbl">Proficiency Required
                        <select id="rpg-tag-prof" class="rpg-select">
                            <option value="">None / Standard</option>
                            <option value="weapon:simple">Simple Weapons</option>
                            <option value="weapon:martial">Martial Weapons</option>
                            <option value="weapon:firearm">Firearms (Gunner Feat)</option>
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
                            <option value="heal">Restore Hit Points (Standard Heal — Caps at Max HP)</option>
                            <option value="tempHp">Pure Temporary HP Potion (Non-Stacking)</option>
                            <option value="overheal">Overheal Elixir (Heal + Excess ➔ Temp HP)</option>
                            <option value="holyWater">Radiant / Fire Splash Damage</option>
                            <option value="dreamPastry">Dream Pastry (+1d6 Temp HP + Hag Trance)</option>
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
                    <label class="rpg-field-lbl">Armor / Shield Proficiency
                        <select id="rpg-tag-prof" class="rpg-select">
                            <option value="">Auto (From Base Armor / None)</option>
                            <option value="armor:robe">Cloth / Robe (Any)</option>
                            <option value="armor:light">Light Armor</option>
                            <option value="armor:medium">Medium Armor</option>
                            <option value="armor:heavy">Heavy Armor</option>
                            <option value="armor:shield">Shield Proficiency</option>
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
                    <span class="rpg-stat-pill" style="border-color:#60a5fa; color:#bfdbfe;">Preset: ${esc(activePreset.label)}${!activePreset.isMatch && activePreset.contextPreset ? ` (from ${esc(activePreset.contextPreset.label)})` : ''}</span>
                    ${bonuses.saveBonus ? `<span class="rpg-stat-pill blue">Saves: ${bonuses.saveBonus > 0 ? '+' : ''}${bonuses.saveBonus}</span>` : ''}
                    ${bonuses.spellDcBonus ? `<span class="rpg-stat-pill purple">Spell DC: ${bonuses.spellDcBonus > 0 ? '+' : ''}${bonuses.spellDcBonus}</span>` : ''}
                    ${bonuses.spellAtkBonus ? `<span class="rpg-stat-pill purple">Spell Atk: ${bonuses.spellAtkBonus > 0 ? '+' : ''}${bonuses.spellAtkBonus}</span>` : ''}
                    ${bonuses.initBonus ? `<span class="rpg-stat-pill gold">Init: ${bonuses.initBonus > 0 ? '+' : ''}${bonuses.initBonus}</span>` : ''}
                    ${bonuses.spellFireBonus ? `<span class="rpg-stat-pill" style="border-color:#ef4444; color:#fca5a5;">Spell Fire: +${esc(bonuses.spellFireBonus)}</span>` : ''}
                    ${bonuses.skillAdv.length ? `<span class="rpg-stat-pill green">Adv: ${esc(bonuses.skillAdv.join(', '))}</span>` : ''}
                    <span class="rpg-stat-pill purple" title="D&D 5e Attunement Limit: You can bond with at most 3 powerful magic items at the same time (e.g. Cloak of Protection, Sunsword, Bloodwell Vial).">Attuned: ${bonuses.attunedCount} / 3</span>
                </div>
                <div class="rpg-override-bar">
                    <span style="font-size:0.68rem; color:#94a3b8;">
                        <strong style="color:#cbd5e1;">Proficiency Rules:</strong> ${esc(getHeroProficiencies().label || 'Class & Feat Enforced')}
                    </span>
                    <button type="button" class="rpg-override-btn ${dmOverrideOn ? 'is-active' : ''}" onclick="COS_RPG.toggleDmOverride()" title="Allow equipping restricted armor or weapons for special DM scenarios">${dmOverrideOn ? 'DM Override: ON' : 'DM Override: OFF'}</button>
                </div>
                <div class="rpg-presets-bar">
                    <span style="font-size:0.66rem; font-weight:800; color:#94a3b8;">PRESETS:</span>
                    ${presetsHtml}
                    <button type="button" class="rpg-mini-btn btn-use" style="min-block-size:28px;" onclick="COS_RPG.openSavePresetForm('__new__')">+ New Preset</button>
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
        const footSaveMount = document.getElementById('rpg-equip-foot-save-mount');
        if (footSaveMount) footSaveMount.innerHTML = contextSaveBtnHtml;
        if (presetEditor) {
            if (presetFocusTargetId === 'rpg-new-preset-name') body.scrollTop = 0;
            const pForm = document.getElementById('rpg-preset-form');
            const pInp = document.getElementById('rpg-new-preset-name');
            const pErr = document.getElementById('rpg-preset-error');
            if (pForm) {
                pForm.addEventListener('submit', e => {
                    e.preventDefault();
                    submitPresetEditorForm();
                });
            }
            if (pInp) {
                if (presetFocusTargetId === 'rpg-new-preset-name') {
                    pInp.focus();
                    if (presetEditor.mode === 'edit' && typeof pInp.select === 'function') pInp.select();
                }
                pInp.addEventListener('input', () => {
                    if (presetEditor) presetEditor.draftName = pInp.value;
                    if (pInp.value.trim()) {
                        pInp.removeAttribute('aria-invalid');
                        if (presetEditor) presetEditor.errorMsg = '';
                        if (pErr) pErr.textContent = '';
                    }
                });
                pInp.addEventListener('keydown', e => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        if (e.isComposing || e.keyCode === 229) return;
                        if (pForm && typeof pForm.requestSubmit === 'function') pForm.requestSubmit();
                        else submitPresetEditorForm();
                    }
                });
            }
            if (presetFocusTargetId && presetFocusTargetId !== 'rpg-new-preset-name') {
                const focusEl = document.getElementById(presetFocusTargetId);
                if (focusEl && typeof focusEl.focus === 'function') focusEl.focus();
            }
            presetFocusTargetId = null;

            const slotsContainer = document.getElementById('rpg-preset-slots-container');
            if (slotsContainer) {
                slotsContainer.addEventListener('change', e => {
                    if (!presetEditor) return;
                    const t = e.target;
                    const slotId = t?.getAttribute?.('data-slot-id');
                    if (slotId && presetEditor.slotDrafts[slotId]) {
                        const row = slotsContainer.querySelector(`[data-slot-row="${slotId}"]`);
                        const chk = document.getElementById(`rpg-pslot-chk-${slotId}`);
                        if (t.classList.contains('rpg-preset-slot-chk')) {
                            presetEditor.slotDrafts[slotId].checked = !!t.checked;
                            if (row) row.classList.toggle('is-checked', !!t.checked);
                        } else if (t.classList.contains('rpg-preset-slot-sel')) {
                            presetEditor.slotDrafts[slotId].val = t.value;
                            if (chk && !chk.checked) {
                                chk.checked = true;
                                presetEditor.slotDrafts[slotId].checked = true;
                                if (row) row.classList.toggle('is-checked', true);
                            }
                            if (slotId === 'mainHand') {
                                syncPresetDraftsFromDom();
                                presetFocusTargetId = `rpg-pslot-sel-mainHand`;
                                renderEquipModal();
                                return;
                            }
                        }
                        if (pErr) pErr.textContent = '';
                    } else if (t && t.id === 'rpg-preset-grip-sel' && presetEditor.slotDrafts.mainHand) {
                        presetEditor.slotDrafts.mainHand.grip = t.value;
                    }
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
            const profRaw = document.getElementById('rpg-tag-prof')?.value || '';
            const reqWeapon = profRaw.startsWith('weapon:') ? profRaw.slice(7) : null;

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
                reqWeapon,
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
            const actObj = cType === 'heal'
                ? { type: 'heal', dice: diceCnt, sides: diceSides, bonus, verb: 'Used', label: `${sLbl} (${fStr})` }
                : (cType === 'tempHp'
                    ? { type: 'tempHp', dice: diceCnt, sides: diceSides, bonus, verb: 'Drank', duration: '1 hour', label: `${sLbl} (+${fStr} Temp)` }
                    : (cType === 'overheal'
                        ? { type: 'overheal', dice: diceCnt, sides: diceSides, bonus, verb: 'Drank', duration: '1 hour', label: `${sLbl} (${fStr}➔Temp)` }
                        : (cType === 'holyWater'
                            ? { type: 'holyWater', label: `${sLbl} (2d6 Rad)` }
                            : { type: 'dreamPastry', label: `${sLbl} (+1d6 Temp)` })));
            const baseSum = cType === 'heal'
                ? `Heal ${fStr} HP (Caps at Max HP)`
                : (cType === 'tempHp'
                    ? `Grant ${fStr} Temp HP (1 hr • Non-Stacking)`
                    : (cType === 'overheal'
                        ? `Heal ${fStr} HP; excess ➔ Temp HP (1 hr)`
                        : (cType === 'holyWater' ? '2d6 Radiant Splash' : '+1d6 Temp HP (Hag Trance)')));
            meta = {
                category: 'consumable',
                slots: [],
                quickBelt: qb,
                useAction: actObj,
                summary: `${baseSum}${note ? ' • ' + note : ''}`
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
            const profRaw = document.getElementById('rpg-tag-prof')?.value || '';
            const reqArmor = profRaw.startsWith('armor:') ? profRaw.slice(6) : null;

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
                reqArmor,
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
        const dmOverrideOn = isDmOverrideActive();
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
            const profCheck = canEquip ? checkItemProficiency(raw, meta) : { allowed: true, requirement: '' };
            const isRestricted = canEquip && !profCheck.allowed && !dmOverrideOn;
            const hasLoadableAmmo = Boolean(meta.ammoMeta && AMMO_CATALOG[meta.ammoMeta.ammoId]);
            const isCoatingVial = Boolean(hasLoadableAmmo && meta.ammoMeta.isCoating);
            const isAttachMod = Boolean(meta.attachMeta);
            const ammoNeedsContainer = Boolean(hasLoadableAmmo && !isCoatingVial && meta.ammoMeta.ammoKind === 'firearm' && !hasBulletContainerInBag());
            const isStudyAction = Boolean(meta.useAction && meta.useAction.type === 'learnRecipe');
            const catLbl = BP_CATS.find(c => c.id === meta.category)?.label || '📦 Gear';

            rows.push(`
                <div class="rpg-bp-row ${isEquipped ? 'row-equipped' : ''}">
                    <div class="rpg-bp-main">
                        <div>
                            <button type="button" class="rpg-bp-name-btn" onclick="COS_RPG.openItemDetails(${idx})">
                                ${p.hasQty ? `${p.emoji}${p.name}` : esc(raw)}
                            </button>
                            ${isEquipped ? `<span class="rpg-card-equipped-pill">✓ ${eqSlot.icon} ${eqSlot.label}</span>` : ''}
                            ${isRestricted ? ` <span class="rpg-restrict-tag">Requires ${esc(profCheck.requirement)}</span>` : ''}
                            ${canEquip && !profCheck.allowed && dmOverrideOn ? ` <span class="rpg-restrict-tag is-override">DM Override</span>` : ''}
                        </div>
                        <div class="rpg-bp-tags">
                            <span class="rpg-bp-cat-tag">${catLbl}</span>
                            ${meta.summary ? `<span>${esc(meta.summary)}</span>` : ''}
                        </div>
                    </div>
                    <div class="rpg-bp-actions">
                        ${canEquip
                            ? (isRestricted
                                ? `<button type="button" class="rpg-mini-btn btn-restricted" disabled title="Requires ${esc(profCheck.requirement)} (or enable DM Override)">Restricted</button>`
                                : `<button type="button" class="rpg-mini-btn ${isEquipped ? 'btn-equipped' : 'btn-equip'}" onclick="COS_RPG.quickToggleEquipByIndex(${idx})">${isEquipped ? 'Unequip' : 'Equip'}</button>`)
                            : ''}
                        ${isAttachMod ? `<button type="button" class="rpg-mini-btn btn-equip" onclick="COS_RPG.openAttachmentModal({ invIndex: ${idx} })">Attach</button>` : ''}
                        ${hasLoadableAmmo
                            ? (isCoatingVial
                                ? `<button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.openAmmoLoaderModal({ invIndex: ${idx} })">Coat</button>`
                                : (ammoNeedsContainer
                                    ? `<button type="button" class="rpg-mini-btn btn-restricted" disabled title="Buy a Partitioned Bullet Sling &amp; Pouch (15 GP in any shop) first">Load (Locked)</button>`
                                    : `<button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.openAmmoLoaderModal({ invIndex: ${idx} })">Load</button>`))
                            : ''}
                        ${meta.useAction ? `<button type="button" class="rpg-mini-btn ${isStudyAction ? 'btn-equip' : 'btn-use'}" data-rpg-turn-slot="${getConsumableTurnSlot(meta.useAction)}" onclick="COS_RPG.useConsumableByIndex(${idx})">${isStudyAction ? 'Study' : 'Use'}</button>` : ''}
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
        if (typeof syncCombatActionLocks === 'function') syncCombatActionLocks();
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

        const unreadTotal = getTotalUnreadMessages();
        const msgPeers = PARTY_MEMBERS.filter(m => m.id !== adapter.heroId).map(m => ({
            id: m.id,
            label: m.id === 'dm' ? 'DM' : m.name
        }));
        const myThreadsList = Object.entries(msgThreads)
            .map(([tid, t]) => ({ tid, ...t, unread: getThreadUnreadCount(tid) }))
            .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
        const activeThreadObj = msgActiveThreadId ? msgThreads[msgActiveThreadId] : null;
        const activeMsgs = getThreadMessagesList(activeThreadObj);
        const selArr = Array.from(msgSelectedRecips).filter(id => id !== adapter.heroId);
        const activeLabel = selArr.length > 0
            ? formatThreadTitle([adapter.heroId, ...selArr])
            : 'Select 1 or more recipients above';
        const isDmInThread = selArr.includes('dm');

        const messagesTabHtml = `
            <div style="display:flex; flex-direction:column; gap:10px;">
                <div>
                    <div style="font-size:0.68rem; font-weight:800; color:#94a3b8; text-transform:uppercase; margin-bottom:5px;">
                        Pick Recipients (1-on-1 or Group Chat — Player-only chats stay hidden from DM)
                    </div>
                    <div style="display:flex; flex-wrap:wrap; gap:6px;">
                        ${msgPeers.map(peer => {
                            const checked = msgSelectedRecips.has(peer.id);
                            return `<button type="button" class="rpg-tab-btn" style="padding:5px 10px; font-size:0.74rem;" aria-pressed="${checked ? 'true' : 'false'}" onclick="COS_RPG.toggleMsgRecipient('${peer.id}')">${checked ? '✓ ' : ''}${esc(peer.label)}</button>`;
                        }).join('')}
                    </div>
                </div>

                ${myThreadsList.length > 0 ? `
                    <div style="display:flex; flex-wrap:wrap; gap:5px; align-items:center;">
                        <span style="font-size:0.66rem; color:#94a3b8; font-weight:700;">Active Threads:</span>
                        ${myThreadsList.map(th => {
                            const isCur = th.tid === msgActiveThreadId;
                            return `<button type="button" class="rpg-mini-btn ${isCur ? 'btn-equip' : ''}" style="min-block-size:24px; padding:2px 8px; font-size:0.68rem;" onclick="COS_RPG.selectMsgThread('${esc(th.tid)}')">${esc(formatThreadTitle(th.participants))}${th.unread > 0 ? ` <strong style="color:#fde68a;">(${th.unread})</strong>` : ''}</button>`;
                        }).join('')}
                    </div>
                ` : ''}

                <div style="background:#080d18; border:1px solid #26344b; border-radius:8px; padding:10px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; gap:6px; border-bottom:1px solid #1e293b; padding-bottom:6px; margin-bottom:8px;">
                        <div>
                            <div style="font-size:0.76rem; font-weight:700; color:#f8fafc;">${esc(activeLabel)}</div>
                            ${selArr.length > 0 ? `<div style="font-size:0.65rem; color:${isDmInThread ? '#93c5fd' : '#6ee7b7'};">${isDmInThread ? 'Includes DM (Discreet DM Whisper)' : 'Private Party Chat (Hidden from DM)'}</div>` : ''}
                        </div>
                        ${msgActiveThreadId && activeMsgs.length > 0 ? `<button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:24px; padding:2px 8px; font-size:0.66rem;" onclick="COS_RPG.clearWhisperThread('${esc(msgActiveThreadId)}')">Clear Thread</button>` : ''}
                    </div>
                    <div id="rpg-msg-log" style="max-height:220px; overflow-y:auto; display:flex; flex-direction:column; gap:6px; padding-right:4px; margin-bottom:8px;">
                        ${selArr.length === 0
                            ? `<div style="font-size:0.74rem; color:#64748b; text-align:center; padding:16px;">Tick one or more names above to start a private message or group chat.</div>`
                            : (activeMsgs.length === 0
                                ? `<div style="font-size:0.74rem; color:#64748b; text-align:center; padding:16px;">No messages yet. Say something discreet!</div>`
                                : activeMsgs.map(m => {
                                    const mine = m.senderId === adapter.heroId;
                                    const timeStr = m.ts ? new Date(m.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                                    return `
                                        <div style="align-self:${mine ? 'flex-end' : 'flex-start'}; max-width:84%; background:${mine ? '#1e3a5f' : '#141f35'}; border:1px solid ${mine ? '#3b82f6' : '#334155'}; border-radius:8px; padding:6px 9px;">
                                            <div style="font-size:0.64rem; color:${mine ? '#93c5fd' : '#fde68a'}; font-weight:700; margin-bottom:2px;">${esc(m.senderName || m.senderId)} <span style="color:#64748b; font-weight:400;">${esc(timeStr)}</span></div>
                                            <div style="font-size:0.78rem; color:#f8fafc; line-height:1.35; word-break:break-word;">${esc(m.text)}</div>
                                        </div>
                                    `;
                                }).join(''))}
                    </div>
                    <div style="display:flex; gap:6px;">
                        <input type="text" id="rpg-msg-input" class="rpg-input" style="flex:1;" placeholder="${selArr.length > 0 ? 'Type a discreet message...' : 'Select recipients first...'}" ${selArr.length === 0 ? 'disabled' : ''} onkeydown="if(event.key==='Enter'){event.preventDefault();COS_RPG.sendWhisperMessage();}">
                        <button type="button" class="rpg-mini-btn btn-use" style="padding:6px 14px; font-size:0.76rem;" ${selArr.length === 0 ? 'disabled' : ''} onclick="COS_RPG.sendWhisperMessage()">Send</button>
                    </div>
                    <div style="font-size:0.65rem; color:#64748b; margin-top:5px;">Messages automatically clear when you click <strong>Sync to DM</strong> at session end.</div>
                </div>
            </div>
        `;

        body.innerHTML = `
            <div class="rpg-tab-bar">
                <button type="button" class="rpg-tab-btn" aria-pressed="${tradeActiveTab === 'send' ? 'true' : 'false'}" onclick="COS_RPG.setTradeTab('send')">Send Item / Gold</button>
                <button type="button" class="rpg-tab-btn" aria-pressed="${tradeActiveTab === 'inbox' ? 'true' : 'false'}" onclick="COS_RPG.setTradeTab('inbox')">Inbox &amp; Claim Code ${incomingTrades.length > 0 ? `(${incomingTrades.length})` : ''}</button>
                <button type="button" class="rpg-tab-btn" aria-pressed="${tradeActiveTab === 'messages' ? 'true' : 'false'}" onclick="COS_RPG.setTradeTab('messages')">Messages ${unreadTotal > 0 ? `(${unreadTotal})` : ''}</button>
            </div>
            ${tradeActiveTab === 'send' ? sendTabHtml : (tradeActiveTab === 'messages' ? messagesTabHtml : inboxTabHtml)}
        `;
    }

    // =========================================================================
    // MODAL OPEN / CLOSE & PUBLIC API
    // =========================================================================
    function openEquipModal(slotId) {
        if (slotId) selectedSlot = slotId;
        showCustomTagger = false;
        presetEditor = null;
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

    // =========================================================================
    // 🎮 VIDEO-GAME RPG HUD ENGINE (TURN BAR, CONCENTRATION, STATUS, DEATH SAVES,
    //    LIVE PARTY FRAMES, FOG-OF-WAR COMBAT STRIP, TABS, SKILLS FILTER & CRITS)
    // =========================================================================
    const STATUS_CATALOG = [
        { id: 'blessed',     kind: 'buff',   label: '✨ Blessed (+1d4)',      rule: 'Add +1d4 to all Attack Rolls and Saving Throws while Blessed.' },
        { id: 'invisible',   kind: 'buff',   label: '👻 Invisible',           rule: 'Attacks against you have Disadvantage; your attacks have Advantage.' },
        { id: 'dodging',     kind: 'buff',   label: '🛡️ Dodging',             rule: 'Until start of next turn, attacks against you have Disadvantage & you have Advantage on DEX Saves.' },
        { id: 'half_cover',  kind: 'buff',   label: '🧱 Half Cover (+2 AC)',  rule: '+2 Bonus to AC (applied automatically!) and +2 to Dexterity Saving Throws.' },
        { id: 'surge_ac',    kind: 'buff',   label: '✨ Spectral Shield (+2 AC)', rule: 'Wild Magic Surge #51: +2 AC & immune to Magic Missile for 1 minute.' },
        { id: 'poisoned',    kind: 'debuff', label: '🤢 Poisoned',            rule: 'Disadvantage on all Attack Rolls and Ability Checks.' },
        { id: 'frightened',  kind: 'debuff', label: '😱 Frightened',          rule: 'Disadvantage on Ability Checks & Attack Rolls while source is in sight; cannot move closer to source.' },
        { id: 'prone',       kind: 'debuff', label: '💫 Prone',               rule: 'Crawl only (standing costs half speed). Disadvantage on attacks; melee attacks within 5 ft vs you have Advantage, ranged have Disadvantage.' },
        { id: 'restrained',  kind: 'debuff', label: '🕸️ Restrained',          rule: 'Speed 0. Attacks vs you have Advantage; your attacks & DEX Saves have Disadvantage.' },
        { id: 'grappled',    kind: 'debuff', label: '🪢 Grappled',            rule: 'Speed becomes 0 until you break free (Action: Athletics/Acrobatics vs Escape DC).' },
        { id: 'blinded',     kind: 'debuff', label: '🕶️ Blinded',             rule: 'Auto-fail sight checks. Attacks vs you have Advantage; your attacks have Disadvantage.' },
        { id: 'charmed',     kind: 'debuff', label: '💖 Charmed',             rule: 'Cannot attack or harm the charmer; charmer has Advantage on social checks vs you.' },
        { id: 'stunned',     kind: 'debuff', label: '😵 Stunned',             rule: 'Incapacitated, cannot move, auto-fail STR & DEX saves, attacks vs you have Advantage.' },
        { id: 'burning',     kind: 'debuff', label: '🔥 Burning',             rule: 'Takes fire damage at start/end of turn until spending an Action to douse flames.' },
        { id: 'bane',        kind: 'debuff', label: '🩸 Bane (-1d4)',         rule: 'Subtract 1d4 from all Attack Rolls and Saving Throws while under Bane.' },
        { id: 'silenced',    kind: 'debuff', label: '🔇 Silenced',            rule: 'Cannot speak or cast spells with Verbal (V) components (Subtle Spell bypasses!).' }
    ];

    let hudState = {
        conc: null,
        statuses: [],
        deathSaves: { succ: 0, fail: 0 },
        turn: { action: true, bonus: true, reaction: true, move: true },
        advLocked: false,
        rightTab: 'combat',
        mobileTab: 'combat',
        tabPrefV3: true,
        skillsTrainedOnly: false,
        showPartyHud: false
    };
    let statusPickerOpen = false;
    let inspectedStatusId = null;
    let livePartyMap = {};
    let liveCombatState = null;
    let lastCombatTurnToken = '';
    let prevTrackedHp = null;
    let pendingRollFollowup = null;
    let pendingConcAlert = null;
    let pendingConcFallbackTimer = null;

    function getHudStorageKey() {
        return `cos_rpg_hud_${adapter ? adapter.heroId : 'hero'}_v1`;
    }

    function loadHudState() {
        try {
            const raw = localStorage.getItem(getHudStorageKey());
            if (!raw) return;
            const p = JSON.parse(raw);
            if (!p || typeof p !== 'object') return;
            hudState.conc = typeof p.conc === 'string' && p.conc.trim() ? p.conc.trim() : null;
            hudState.statuses = Array.isArray(p.statuses) ? p.statuses.filter(id => STATUS_CATALOG.some(s => s.id === id)) : [];
            if (p.deathSaves && typeof p.deathSaves === 'object') {
                hudState.deathSaves = {
                    succ: Math.max(0, Math.min(3, parseInt(p.deathSaves.succ) || 0)),
                    fail: Math.max(0, Math.min(3, parseInt(p.deathSaves.fail) || 0))
                };
            }
            if (p.turn && typeof p.turn === 'object') {
                hudState.turn = {
                    action: p.turn.action !== false,
                    bonus: p.turn.bonus !== false,
                    reaction: p.turn.reaction !== false,
                    move: p.turn.move !== false
                };
            }
            hudState.advLocked = Boolean(p.advLocked);
            hudState.rightTab = (p.tabPrefV3 && typeof p.rightTab === 'string') ? p.rightTab : 'combat';
            hudState.mobileTab = (typeof p.mobileTab === 'string' && ['combat', 'magic', 'checks', 'gear', 'notes', 'all'].includes(p.mobileTab)) ? p.mobileTab : 'combat';
            hudState.tabPrefV3 = true;
            hudState.skillsTrainedOnly = Boolean(p.skillsTrainedOnly);
            hudState.showPartyHud = Boolean(p.showPartyHud);
        } catch (e) {}
    }

    function saveHudState() {
        try { localStorage.setItem(getHudStorageKey(), JSON.stringify(hudState)); } catch (e) {}
    }

    function parseCurrentVitalsFromDom() {
        const hpTxt = (document.getElementById('hp-disp')?.innerText || '').replace(/\s+/g, ' ').trim();
        let cur = 10, max = 10, temp = 0;
        const m1 = hpTxt.match(/(\d+)\s*(?:\(\+(\d+)T?\)|\+\s*(\d+))\s*\/\s*(\d+)/i);
        const m2 = hpTxt.match(/(\d+)\s*\/\s*(\d+)/);
        if (m1) {
            cur = parseInt(m1[1], 10) || 0;
            temp = parseInt(m1[2] || m1[3], 10) || 0;
            max = parseInt(m1[4], 10) || 10;
        } else if (m2) {
            cur = parseInt(m2[1], 10) || 0;
            max = parseInt(m2[2], 10) || 10;
        }
        const statusTxt = (document.getElementById('hp-status-header')?.innerText || '');
        const mt = statusTxt.match(/\+(\d+)\s*Temp/i);
        if (mt) temp = parseInt(mt[1], 10) || temp;
        const acTxt = (document.getElementById('ac-disp')?.innerText || '10').trim();
        return { cur, max, temp, ac: acTxt };
    }

    function getLiveConSaveBonus() {
        const el = document.getElementById('save-val-con');
        if (!el) return 0;
        const m = String(el.innerText || '').match(/[+-]?\d+/);
        return m ? parseInt(m[0], 10) : 0;
    }

    function getLiveHeroSpeed() {
        const speedEl = document.getElementById('sub-speed-disp') || document.getElementById('badge-speed-toggle');
        if (speedEl) {
            const m = String(speedEl.innerText || '').match(/(\d+)\s*ft/i);
            if (m) return `${m[1]} ft`;
        }
        return (adapter && adapter.speed) ? adapter.speed : '30 ft';
    }

    // Modern Web Guidance: Toolbar roving-tabindex fallback ONLY when focusgroup is unsupported
    function installToolbarRovingFallback(bar) {
        if (!bar || ('focusGroup' in HTMLElement.prototype) || bar.dataset.rovingWired) return;
        bar.dataset.rovingWired = '1';
        const getItems = () => Array.from(bar.querySelectorAll('button:not([disabled])'));
        const initTabs = () => {
            const items = getItems();
            items.forEach((b, i) => { b.tabIndex = i === 0 ? 0 : -1; });
        };
        initTabs();
        bar.addEventListener('focusin', (e) => {
            const items = getItems();
            if (items.includes(e.target)) {
                items.forEach(b => { b.tabIndex = (b === e.target) ? 0 : -1; });
            }
        });
        bar.addEventListener('keydown', (e) => {
            const items = getItems();
            const idx = items.indexOf(document.activeElement);
            if (idx === -1 || items.length < 2) return;
            let nextIdx = -1;
            if (e.key === 'ArrowRight') nextIdx = (idx + 1) % items.length;
            else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + items.length) % items.length;
            else if (e.key === 'Home') nextIdx = 0;
            else if (e.key === 'End') nextIdx = items.length - 1;
            if (nextIdx !== -1) {
                e.preventDefault();
                items[nextIdx].focus();
            }
        });
    }

    // 👥 RENDER LIVE PARTY MINI-HUD (Teammates ONLY — no redundant self-HP & clean names without emojis!)
    function renderPartyMiniHud() {
        const host = document.getElementById('rpg-party-hud');
        if (!host || !adapter) return;
        const roster = [
            { id: 'jacomir', name: 'Jacomir', defCur: 23, defMax: 31, defAc: '17' },
            { id: 'piper',   name: 'Piper',   defCur: 17, defMax: 17, defAc: '13' },
            { id: 'yvaine',  name: 'Yvaine',  defCur: 28, defMax: 28, defAc: '16' }
        ].filter(r => r.id !== adapter.heroId);
        const chipsHtml = roster.map(r => {
            const remote = livePartyMap[r.id] || null;
            const cur = (remote && typeof remote.curHp === 'number') ? remote.curHp : r.defCur;
            const max = (remote && typeof remote.maxHp === 'number') ? remote.maxHp : r.defMax;
            const temp = (remote && typeof remote.tempHp === 'number') ? remote.tempHp : 0;
            const ac = (remote && remote.acDisplay) ? remote.acDisplay : r.defAc;
            const conc = (remote && remote.concentration) ? remote.concentration : null;
            const pct = Math.max(0, Math.min(100, Math.round((cur / Math.max(1, max)) * 100)));
            const isDown = cur <= 0;
            const fillCol = isDown ? '#ef4444' : (pct > 50 ? '#22c55e' : (pct > 25 ? '#f59e0b' : '#ef4444'));
            const hpColor = isDown ? '#f87171' : (temp > 0 ? '#38bdf8' : (pct > 50 ? '#86efac' : (pct > 25 ? '#fde68a' : '#fca5a5')));
            return `
                <button type="button" class="rpg-party-chip ${isDown ? 'is-down' : ''}" onclick="COS_RPG.openDirectWhisper('${r.id}')" title="Click to whisper or trade directly with ${esc(r.name)}">
                    <div class="rpg-party-chip-main">
                        <div class="rpg-party-chip-top">
                            <span class="rpg-party-chip-name">${esc(r.name)}</span>
                            <span class="rpg-party-chip-stats" style="color:${hpColor};">${isDown ? '💀 0/' + max : `${cur}${temp > 0 ? `+${temp}` : ''}/${max}`}</span>
                        </div>
                        <div class="rpg-party-hp-track">
                            <div class="rpg-party-hp-fill" style="width:${pct}%; background:${fillCol};"></div>
                        </div>
                        <div class="rpg-party-meta-tags">
                            <span>🛡️ AC ${esc(ac)}</span>
                            ${conc ? `<span class="rpg-party-conc-dot">• 🧠 ${esc(conc)}</span>` : `<span style="color:#64748b;">• 💬 Whisper</span>`}
                        </div>
                    </div>
                </button>
            `;
        }).join('');
        host.innerHTML = `<span class="rpg-party-hud-lbl">👥 Party</span>${chipsHtml}`;
    }

    function openDirectWhisper(targetHeroId) {
        if (!targetHeroId || !adapter || targetHeroId === adapter.heroId) return;
        msgSelectedRecips = new Set([targetHeroId]);
        msgActiveThreadId = computeThreadId([adapter.heroId, targetHeroId]);
        if (msgActiveThreadId) markThreadRead(msgActiveThreadId);
        tradeRecipient = targetHeroId;
        openTradeModal('messages');
    }

    let prevCombatActiveFlag = false;
    let lastAllowedTurnSpend = null;

    function isCombatActive() {
        return Boolean(liveCombatState && liveCombatState.active && Array.isArray(liveCombatState.combatants) && liveCombatState.combatants.length > 0);
    }

    function syncCombatModeLayout() {
        const active = isCombatActive();
        const wrap = document.getElementById('rpg-action-bar-wrap');
        if (wrap) {
            wrap.classList.toggle('is-combat-active', active);
        }
        if (active !== prevCombatActiveFlag) {
            prevCombatActiveFlag = active;
            hudState.turn = { action: true, bonus: true, reaction: true, move: true };
            saveHudState();
            renderActionEconomyBar();
        }
        renderHubPanel();
        syncCombatActionLocks();
    }

    function getButtonTurnSlot(btn) {
        if (!btn) return null;
        if (btn.closest('#rpg-action-bar, #rpg-party-hud, #rpg-combat-strip, #rpg-dice-fab-wrap, #floating-roll-hud, .hp-ctrl-container, .gold-pouch-card')) {
            return null;
        }
        const explicit = btn.getAttribute('data-rpg-turn-slot');
        if (explicit === 'none') return null;
        if (explicit === 'action' || explicit === 'bonus' || explicit === 'reaction') return explicit;

        const oc = btn.getAttribute('onclick') || '';
        if (!oc) return null;
        // Always free / damage rolls / Action Surge / utility triggers
        if (/useActionSurge|rollSavage|rollFormulaDamage|rollFireBoltDamage|rollLamentDamage|rollMercyDamage|rollLessDamage|rollKnifeDamage|rollStrappedDaggerDamage|rollSlayerDieOnly|execRiposteDamage|execRiposteSilverLongswordDamage|rollDynamicWeaponDamage|useTacticalMind|useTidesOfChaos|useMetamagic|triggerWildMagicSurge|open.*Modal|close.*Modal|toggleAdvantage|rollCustomDie|rollD20|rollSkill|rollSave|rollInitiative|rollJacomirInitiative|stepHP|applyDamage|applyHeal|applyTempHP|clearTempHP|shortRest|longRest|modSup|refillSup|modSorcery|refillSorcery|modSpellSlots|refillSpellSlots|rollHelpToken|modHelpToken|resetHelpTokens|useHeroicInspiration/i.test(oc)) {
            return null;
        }
        // Reactions
        if (/useBendFate/i.test(oc)) return 'reaction';
        // Bonus Actions
        if (/toggleSlayersPreyManual/i.test(oc)) {
            // Untoggling Slayer's Prey when an enemy dies is free; designating a target costs Bonus Action!
            return /Untoggle/i.test(btn.innerText || '') ? null : 'bonus';
        }
        if (/useSecondWindHeal|reloadLament|reloadBothRevolvers|useHuntersSense|castTracerRoundFree|fireLessShot|rollStrappedDaggerAttack|castPhosphorGrenade|convertSlotToSP|convertSPToSlot/i.test(oc)) {
            return 'bonus';
        }
        // Standard 1-Action combat attacks & spells
        if (/rollWeaponAttack|rollDynamicWeaponAttack|fireLamentShot|fireMercyShot|rollKnifeAttack|rollSpellAttack|castFriendsCantrip|castLongstriderStim|castProtectionEvilGood|castSmokescreen|castSpeakWithDeadAmulet|castFiernaFreeCharmPerson|castUtility/i.test(oc)) {
            return 'action';
        }
        return null;
    }

    function flashSpentTurnPip(slot) {
        const pip = document.querySelector(`#rpg-action-bar .pip-${slot}`);
        if (!pip) return;
        pip.classList.remove('pip-shake');
        void pip.offsetWidth;
        pip.classList.add('pip-shake');
        setTimeout(() => pip.classList.remove('pip-shake'), 420);
    }

    function syncCombatActionLocks() {
        const active = isCombatActive();
        const slotMeta = {
            action:   { label: '🟢 Action',   hint: 'Action already spent this turn — click 🟢 Action above to refund (or use Action Surge)' },
            bonus:    { label: '🟠 Bonus',    hint: 'Bonus Action already spent this turn — click 🟠 Bonus above to refund' },
            reaction: { label: '🟣 Reaction', hint: 'Reaction already spent this round — click 🟣 Reaction above to refund' }
        };
        const buttons = document.querySelectorAll('button, .toggle-btn-card');
        buttons.forEach(btn => {
            const slot = getButtonTurnSlot(btn);
            const shouldLock = Boolean(active && slot && hudState.turn && hudState.turn[slot] === false);
            if (shouldLock) {
                if (!btn.dataset.rpgOrigTitle && btn.hasAttribute('title')) {
                    btn.dataset.rpgOrigTitle = btn.getAttribute('title');
                }
                btn.classList.add('rpg-turn-locked');
                btn.setAttribute('aria-disabled', 'true');
                btn.dataset.rpgLockSlot = slot;
                btn.setAttribute('title', slotMeta[slot].hint);
            } else if (btn.classList.contains('rpg-turn-locked')) {
                btn.classList.remove('rpg-turn-locked');
                btn.removeAttribute('aria-disabled');
                delete btn.dataset.rpgLockSlot;
                if (btn.dataset.rpgOrigTitle) {
                    btn.setAttribute('title', btn.dataset.rpgOrigTitle);
                    delete btn.dataset.rpgOrigTitle;
                } else {
                    btn.removeAttribute('title');
                }
            }
        });
    }

    // ⚔️ RENDER SANITIZED FOG-OF-WAR COMBAT TURN-ORDER STRIP
    function renderPublicCombatStrip() {
        const host = document.getElementById('rpg-combat-strip');
        if (!host || !adapter) return;
        const st = liveCombatState;
        if (!st || !st.active || !Array.isArray(st.combatants) || st.combatants.length === 0) {
            host.classList.remove('is-active', 'is-my-turn');
            host.innerHTML = '';
            lastCombatTurnToken = '';
            syncCombatModeLayout();
            return;
        }
        const list = st.combatants;
        const activeIdx = list.findIndex(c => c.isCurrent);
        const curUnit = activeIdx >= 0 ? list[activeIdx] : null;
        const isMyTurn = Boolean(curUnit && curUnit.heroId && curUnit.heroId === adapter.heroId);

        // Determine if this player is directly "UP NEXT" (skipping defeated combatants)
        let isUpNext = false;
        if (!isMyTurn && activeIdx >= 0 && list.length > 1) {
            for (let step = 1; step < list.length; step++) {
                const cand = list[(activeIdx + step) % list.length];
                if (cand && !cand.isDefeated) {
                    isUpNext = Boolean(cand.heroId && cand.heroId === adapter.heroId);
                    break;
                }
            }
        }

        // Auto-refresh player's BG3 Action Economy pips once per new turn when spotlight lands on them!
        const turnToken = `${st.round || 1}:${st.activeUid || ''}`;
        if (isMyTurn && turnToken !== lastCombatTurnToken) {
            lastCombatTurnToken = turnToken;
            resetTurnActions(true);
            announceStatus(`Round ${st.round || 1}: It is your turn! Action, Bonus Action, and Reaction refreshed.`);
        } else if (!isMyTurn && st.activeUid) {
            lastCombatTurnToken = turnToken;
        }

        host.classList.add('is-active');
        host.classList.toggle('is-my-turn', isMyTurn);

        const tierClass = (tier) => {
            const t = String(tier || '').toLowerCase();
            if (t.includes('defeat')) return 'tier-defeated';
            if (t.includes('near') || t.includes('crit')) return 'tier-critical';
            if (t.includes('blood')) return 'tier-bloodied';
            if (t.includes('wound')) return 'tier-wounded';
            if (t.includes('unharm') || t.includes('health')) return 'tier-unharmed';
            return 'tier-unknown';
        };

        const calloutHtml = isMyTurn
            ? `<span class="rpg-combat-banner-call is-now">⚔️ YOUR TURN! (Actions Refreshed)</span>`
            : (isUpNext
                ? `<span class="rpg-combat-banner-call is-next">⚡ UP NEXT — Prep Your Move!</span>`
                : `<span style="font-size:0.71rem; color:#94a3b8;">Current: <strong style="color:#fde68a;">${esc(curUnit ? curUnit.label : 'Combat Active')}</strong></span>`);

        const tilesHtml = list.map(c => {
            const kindCls = c.kind === 'enemy' ? 'kind-enemy' : (c.kind === 'party' ? 'kind-party' : 'kind-ally');
            const conds = Array.isArray(c.conditions) ? c.conditions : [];
            const tierHtml = c.tier
                ? `<div class="rpg-combat-tier ${tierClass(c.tier)}">${c.isDefeated ? '💀' : '●'} ${esc(c.tier)}</div>`
                : (c.isDefeated ? `<div class="rpg-combat-tier tier-defeated">💀 Down</div>` : '');
            const condsHtml = conds.length > 0
                ? `<div class="rpg-combat-conds">${conds.map(cd => `<span class="rpg-combat-cond-pill">${esc(cd)}</span>`).join('')}</div>`
                : '';
            return `
                <div class="rpg-combat-tile ${kindCls} ${c.isCurrent ? 'is-current' : ''} ${c.isDefeated ? 'is-defeated' : ''}">
                    <div class="rpg-combat-tile-top">
                        <span class="rpg-combat-tile-name">${esc(c.label)}</span>
                        ${c.isCurrent ? `<span class="rpg-combat-now-tag">▶ NOW</span>` : ''}
                    </div>
                    ${tierHtml}
                    ${condsHtml}
                </div>
            `;
        }).join('');

        host.innerHTML = `
            <div class="rpg-combat-strip-head">
                <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
                    <span class="rpg-combat-round-pill">⚔️ COMBAT • ROUND ${st.round || 1}</span>
                    ${calloutHtml}
                </div>
                <span style="font-size:0.65rem; color:#94a3b8;">Turn Order (Fog of War)</span>
            </div>
            <div class="rpg-combat-ribbon">${tilesHtml}</div>
        `;
        syncCombatModeLayout();
    }

    // ⚡ BG3 TURN ACTION ECONOMY BAR + RIGHT-COLUMN TABS (Shown ONLY during Active Combat!)
    function renderActionEconomyBar() {
        const bar = document.getElementById('rpg-action-bar');
        if (!bar) return;
        const speedStr = getLiveHeroSpeed();
        const t = hudState.turn;
        bar.innerHTML = `
            <div class="rpg-action-pips-group" role="group" aria-label="Turn Resources">
                <button type="button" class="rpg-act-pip pip-action" aria-pressed="${t.action ? 'true' : 'false'}" onclick="COS_RPG.toggleTurnAction('action')" title="Click to toggle or refund Action (Ready / Used)">🟢 Action</button>
                <button type="button" class="rpg-act-pip pip-bonus" aria-pressed="${t.bonus ? 'true' : 'false'}" onclick="COS_RPG.toggleTurnAction('bonus')" title="Click to toggle or refund Bonus Action (Ready / Used)">🟠 Bonus</button>
                <button type="button" class="rpg-act-pip pip-reaction" aria-pressed="${t.reaction ? 'true' : 'false'}" onclick="COS_RPG.toggleTurnAction('reaction')" title="Click to toggle or refund Reaction (Ready / Used)">🟣 Reaction</button>
                <button type="button" class="rpg-act-pip pip-move" aria-pressed="${t.move ? 'true' : 'false'}" onclick="COS_RPG.toggleTurnAction('move')" title="Click to mark Movement used / available">🥾 ${esc(speedStr)}</button>
            </div>
            <button type="button" class="rpg-act-reset-btn" onclick="COS_RPG.resetTurnActions(false)" title="Refresh Action, Bonus Action, Reaction &amp; Movement for your next turn">⏭️ New Turn</button>
        `;
        installToolbarRovingFallback(bar);
        syncCombatActionLocks();
    }

    function toggleTurnAction(slot) {
        if (!hudState.turn || typeof hudState.turn[slot] === 'undefined') return;
        hudState.turn[slot] = !hudState.turn[slot];
        saveHudState();
        renderActionEconomyBar();
    }

    function spendTurnAction(slot) {
        if (!isCombatActive()) return;
        if (!hudState.turn || typeof hudState.turn[slot] === 'undefined') return;
        if (!hudState.turn[slot]) return;
        hudState.turn[slot] = false;
        saveHudState();
        renderActionEconomyBar();
    }

    function restoreTurnAction(slot) {
        if (!hudState.turn || typeof hudState.turn[slot] === 'undefined') return;
        hudState.turn[slot] = true;
        saveHudState();
        renderActionEconomyBar();
    }

    function resetTurnActions(silent = false) {
        hudState.turn = { action: true, bonus: true, reaction: true, move: true };
        saveHudState();
        renderActionEconomyBar();
        if (!silent) announceStatus('New turn: Action, Bonus Action, Reaction, and Movement refreshed.');
    }

    function classifyRightColumnPanels() {
        const leftCol = document.querySelector('.main-layout > div:nth-child(1)');
        const rightCol = document.querySelector('.main-layout > div:nth-child(2)');

        if (leftCol) {
            Array.from(leftCol.children).forEach(el => {
                if (!el.classList) return;
                if (el.classList.contains('vitals-plate')) {
                    el.dataset.mobileAlways = '1';
                    el.dataset.mobileOrder = '10';
                } else if (el.classList.contains('perks-compact-panel')) {
                    el.dataset.mobileCats = 'combat checks';
                    el.dataset.mobileOrder = '25';
                } else if (el.classList.contains('rpg-gold-panel')) {
                    el.dataset.mobileCats = 'gear';
                    el.dataset.mobileOrder = '55';
                } else if (el.id === 'player-notes-panel' || el.classList.contains('notes-panel')) {
                    el.dataset.mobileCats = 'notes';
                    el.dataset.mobileOrder = '60';
                } else if (el.classList.contains('panel') && (el.querySelector('.saves-grid-2x3') || el.querySelector('.stat-row-list'))) {
                    el.dataset.mobileCats = 'checks';
                    el.dataset.mobileOrder = '40';
                } else if (el.classList.contains('panel')) {
                    el.dataset.mobileCats = 'checks';
                    el.dataset.mobileOrder = '42';
                }
            });
        }

        if (!rightCol) return;
        const panels = Array.from(rightCol.children).filter(el => el.classList && el.classList.contains('panel'));
        panels.forEach((p, idx) => {
            if (p.querySelector('#rpg-hub-mount')) {
                p.dataset.rpgCats = 'gear';
                p.dataset.mobileCats = 'gear';
                p.dataset.mobileOrder = '50';
                return;
            }
            const titleTxt = (p.querySelector('.panel-title')?.innerText || '').toLowerCase();
            if (titleTxt.includes('weapon') || titleTxt.includes('firearm') || titleTxt.includes('arsenal')) {
                p.dataset.rpgCats = 'combat';
                p.dataset.mobileCats = 'combat';
                p.dataset.mobileOrder = '30';
            } else if (titleTxt.includes('wild magic')) {
                p.dataset.rpgCats = 'magic';
                p.dataset.mobileCats = 'combat magic';
                p.dataset.mobileOrder = '28';
            } else if (titleTxt.includes('maneuver') || titleTxt.includes('monster slayer')) {
                p.dataset.rpgCats = 'combat magic';
                p.dataset.mobileCats = 'combat magic';
                p.dataset.mobileOrder = '32';
            } else if (titleTxt.includes('fighter')) {
                p.dataset.rpgCats = 'combat magic';
                p.dataset.mobileCats = 'combat magic';
                p.dataset.mobileOrder = '34';
            } else if (titleTxt.includes('spell') || titleTxt.includes('occult')) {
                p.dataset.rpgCats = 'combat magic';
                p.dataset.mobileCats = (adapter && adapter.heroId === 'piper') ? 'combat magic' : 'magic';
                p.dataset.mobileOrder = '33';
            } else if (titleTxt.includes('font of magic') || titleTxt.includes('metamagic')) {
                p.dataset.rpgCats = 'magic';
                p.dataset.mobileCats = 'magic';
                p.dataset.mobileOrder = '36';
            } else {
                p.dataset.rpgCats = 'combat magic';
                p.dataset.mobileCats = 'combat magic';
                p.dataset.mobileOrder = String(35 + idx);
            }
        });
    }

    function setRightColumnTab(tabId) {
        hudState.rightTab = tabId || 'all';
        saveHudState();
        classifyRightColumnPanels();
        const isMobileMode = document.documentElement.getAttribute('data-view-mode') === 'mobile';
        const rightCol = document.querySelector('.main-layout > div:nth-child(2)');
        if (rightCol) {
            Array.from(rightCol.children).forEach(el => {
                if (!el.classList || !el.classList.contains('panel')) return;
                if (isMobileMode) {
                    el.classList.remove('rpg-tab-hidden');
                    return;
                }
                const cats = (el.dataset.rpgCats || 'combat magic gear').split(/\s+/);
                const show = (hudState.rightTab === 'all') || cats.includes(hudState.rightTab);
                el.classList.toggle('rpg-tab-hidden', !show);
            });
        }
        const tabsBar = document.getElementById('rpg-right-tabs');
        if (tabsBar) {
            tabsBar.querySelectorAll('.rpg-view-tab').forEach(btn => {
                btn.setAttribute('aria-pressed', btn.dataset.tab === hudState.rightTab ? 'true' : 'false');
            });
        }
        if (isMobileMode) {
            applyMobileTabLayout();
        }
    }

    function applyMobileTabLayout() {
        classifyRightColumnPanels();
        const isMobileMode = document.documentElement.getAttribute('data-view-mode') === 'mobile';
        const mobTab = hudState.mobileTab || 'combat';

        // Clear desktop right-tab hiding when in Mobile mode; clear mobile-tab hiding when in PC/Tablet mode
        document.querySelectorAll('.main-layout [data-mobile-cats]').forEach(el => {
            if (!isMobileMode) {
                el.classList.remove('rpg-mobile-tab-hidden');
                return;
            }
            el.classList.remove('rpg-tab-hidden');
            const cats = (el.dataset.mobileCats || '').split(/\s+/).filter(Boolean);
            const show = (mobTab === 'all') || cats.includes(mobTab);
            el.classList.toggle('rpg-mobile-tab-hidden', !show);
        });

        if (!isMobileMode) {
            const rightCol = document.querySelector('.main-layout > div:nth-child(2)');
            if (rightCol) {
                Array.from(rightCol.children).forEach(el => {
                    if (!el.classList || !el.classList.contains('panel')) return;
                    const cats = (el.dataset.rpgCats || 'combat magic gear').split(/\s+/);
                    const show = (hudState.rightTab === 'all') || cats.includes(hudState.rightTab);
                    el.classList.toggle('rpg-tab-hidden', !show);
                });
            }
        }

        const mobBar = document.getElementById('rpg-mobile-tabs');
        if (mobBar) {
            mobBar.querySelectorAll('.rpg-mobile-tab').forEach(btn => {
                const active = btn.dataset.mobTab === mobTab;
                btn.setAttribute('aria-pressed', active ? 'true' : 'false');
                if (active && isMobileMode && typeof btn.scrollIntoView === 'function') {
                    try { btn.scrollIntoView({ block: 'nearest', inline: 'nearest', container: 'nearest' }); } catch (e) {}
                }
            });
        }
    }

    function setMobileTab(tabId) {
        const valid = ['combat', 'magic', 'checks', 'gear', 'notes', 'all'];
        hudState.mobileTab = valid.includes(tabId) ? tabId : 'combat';
        saveHudState();
        applyMobileTabLayout();
    }

    // 🧠 AUTO-CONCENTRATION & QUICK STATUS PILLS
    function setConcentration(spellName, silent = false) {
        const clean = String(spellName || '').trim();
        if (!clean) return;
        const prev = hudState.conc;
        hudState.conc = clean;
        saveHudState();
        renderStatusStrip();
        renderPartyMiniHud();
        syncHeroStateToFirebase(false);
        if (!silent && prev && prev.toLowerCase() !== clean.toLowerCase()) {
            announceStatus(`Switched concentration from ${prev} to ${clean}.`);
        }
    }

    function dropConcentration(silent = false) {
        const prev = hudState.conc;
        if (!prev) return;
        hudState.conc = null;
        pendingConcAlert = null;
        saveHudState();
        renderStatusStrip();
        renderPartyMiniHud();
        syncHeroStateToFirebase(false);
        if (!silent && adapter && adapter.log) {
            adapter.log(`🧠 <strong>Concentration Ended:</strong> Stopped concentrating on <strong>${esc(prev)}</strong>.`);
        }
    }

    function promptManualConcentration() {
        const val = window.prompt('Which spell or effect are you concentrating on?', hudState.conc || '');
        if (val && val.trim()) {
            setConcentration(val.trim(), false);
            if (adapter && adapter.log) {
                adapter.log(`🧠 <strong>Concentrating on ${esc(val.trim())}</strong> — taking damage will automatically prompt a CON Save!`);
            }
        }
    }

    function buildConcAlertHtml(info) {
        const conMod = getLiveConSaveBonus();
        const modStr = conMod >= 0 ? `+${conMod}` : `${conMod}`;
        return `
            <div class="rpg-hud-conc-alert">
                <div>
                    <strong>🧠 CONCENTRATION CHECK!</strong> Took <strong>${info.dmg} dmg</strong> while concentrating on <strong style="color:#fde68a;">${esc(info.spell)}</strong> ➔ <strong>DC ${info.dc} CON Save</strong>
                </div>
                <button type="button" class="rpg-hud-crit-btn" style="padding:4px 10px; font-size:0.75rem;" onclick="COS_RPG.rollConcentrationSave(${info.dc})">🎲 Roll CON Save (${modStr})</button>
            </div>
        `;
    }

    function triggerConcentrationCheck(dmgAmount) {
        if (!hudState.conc || dmgAmount <= 0) return;
        const dc = Math.max(10, Math.floor(dmgAmount / 2));
        pendingConcAlert = { spell: hudState.conc, dc, dmg: dmgAmount, ts: Date.now() };
        const cBar = document.querySelector('#rpg-status-strip .rpg-conc-bar');
        if (cBar) {
            cBar.classList.add('needs-check');
            setTimeout(() => cBar.classList.remove('needs-check'), 4000);
        }
        clearTimeout(pendingConcFallbackTimer);
        pendingConcFallbackTimer = setTimeout(() => {
            if (!pendingConcAlert) return;
            const info = pendingConcAlert;
            pendingConcAlert = null;
            if (typeof window.__origLogRoll === 'function') {
                window.__origLogRoll(buildConcAlertHtml(info));
            }
        }, 70);
    }

    function rollConcentrationSave(dc) {
        const targetDc = Math.max(10, parseInt(dc) || 10);
        const spell = hudState.conc || 'Spell';
        const conMod = getLiveConSaveBonus();
        const mode = (typeof window.rollMode === 'string') ? window.rollMode : 'norm';
        let d20 = Math.floor(Math.random() * 20) + 1;
        let modeNote = '';
        if (mode === 'adv' || mode === 'dis') {
            const d2 = Math.floor(Math.random() * 20) + 1;
            const chosen = mode === 'adv' ? Math.max(d20, d2) : Math.min(d20, d2);
            modeNote = ` (${mode === 'adv' ? 'Adv' : 'Dis'} [${d20}, ${d2}])`;
            d20 = chosen;
            consumeTempRollMode();
        }
        let blessNote = '';
        let blessVal = 0;
        if (hudState.statuses.includes('blessed')) {
            blessVal = Math.floor(Math.random() * 4) + 1;
            blessNote += ` + Bless(${blessVal})`;
        }
        if (hudState.statuses.includes('bane')) {
            const b = Math.floor(Math.random() * 4) + 1;
            blessVal -= b;
            blessNote += ` - Bane(${b})`;
        }
        const total = d20 + conMod + blessVal;
        const passed = total >= targetDc;
        const modStr = conMod >= 0 ? `+ ${conMod}` : `- ${Math.abs(conMod)}`;
        if (!passed) {
            hudState.conc = null;
            saveHudState();
            renderStatusStrip();
            renderPartyMiniHud();
            syncHeroStateToFirebase(false);
        }
        const resultBadge = passed
            ? `<span style="color:#4ade80; font-weight:900;">✅ CONCENTRATION HELD!</span>`
            : `<span style="color:#f87171; font-weight:900;">💔 CONCENTRATION BROKEN! (${esc(spell)} ends)</span>`;
        if (adapter && adapter.log) {
            adapter.log(`🧠 <strong>Concentration CON Save (DC ${targetDc} — ${esc(spell)}):</strong> d20[${d20}]${modeNote} ${modStr}${blessNote} = <strong style="font-size:1.1rem; color:${passed ? '#4ade80' : '#f87171'};">${total}</strong> ➔ ${resultBadge}`);
        }
    }

    function toggleStatus(statusId) {
        const idx = hudState.statuses.indexOf(statusId);
        if (idx === -1) {
            hudState.statuses.push(statusId);
            inspectedStatusId = statusId;
        } else {
            hudState.statuses.splice(idx, 1);
            if (inspectedStatusId === statusId) inspectedStatusId = null;
        }
        saveHudState();
        renderStatusStrip();
        if (statusId === 'half_cover' || statusId === 'surge_ac') {
            applyEquipmentToSheet(true);
            if (typeof window.updateACDisplay === 'function') window.updateACDisplay();
        }
        syncHeroStateToFirebase(false);
    }

    function toggleStatusPicker() {
        statusPickerOpen = !statusPickerOpen;
        renderStatusStrip();
    }

    function inspectStatus(statusId) {
        inspectedStatusId = (inspectedStatusId === statusId) ? null : statusId;
        renderStatusStrip();
    }

    function renderStatusStrip() {
        const host = document.getElementById('rpg-status-strip');
        if (!host) return;
        const conMod = getLiveConSaveBonus();
        const modStr = conMod >= 0 ? `+${conMod}` : `${conMod}`;
        const concHtml = hudState.conc
            ? `
                <div class="rpg-conc-bar">
                    <span class="rpg-conc-title">🧠 Conc: <span style="color:#fde68a;">${esc(hudState.conc)}</span></span>
                    <div style="display:flex; gap:4px; align-items:center;">
                        <button type="button" class="rpg-mini-btn btn-equip" style="min-block-size:22px; padding:1px 7px; font-size:0.65rem;" onclick="COS_RPG.rollConcentrationSave(10)" title="Roll DC 10 Constitution Save">🎲 CON (${modStr})</button>
                        <button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:22px; padding:1px 6px; font-size:0.65rem;" onclick="COS_RPG.dropConcentration(false)" title="End Concentration">✕</button>
                    </div>
                </div>
            `
            : '';

        const activeChipsHtml = hudState.statuses.map(id => {
            const def = STATUS_CATALOG.find(s => s.id === id);
            if (!def) return '';
            return `<button type="button" class="rpg-status-chip ${def.kind === 'buff' ? 'is-buff' : 'is-debuff'}" onclick="COS_RPG.inspectStatus('${def.id}')" title="${esc(def.rule)}">${esc(def.label)}</button>`;
        }).join('');

        const inspDef = inspectedStatusId ? STATUS_CATALOG.find(s => s.id === inspectedStatusId) : null;
        const ruleHtml = (inspDef && hudState.statuses.includes(inspDef.id))
            ? `
                <div class="rpg-status-rule-box">
                    <div><strong style="color:#fde68a;">${esc(inspDef.label)}:</strong> ${esc(inspDef.rule)}</div>
                    <button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:22px; padding:1px 6px; font-size:0.64rem; flex-shrink:0;" onclick="COS_RPG.toggleStatus('${inspDef.id}')">Remove</button>
                </div>
            `
            : '';

        const pickerHtml = `
            <div class="rpg-status-picker ${statusPickerOpen ? 'is-open' : ''}">
                <div style="font-size:0.64rem; font-weight:800; color:#86efac; text-transform:uppercase;">Buffs &amp; Cover</div>
                <div class="rpg-status-picker-grid">
                    ${STATUS_CATALOG.filter(s => s.kind === 'buff').map(s => `
                        <button type="button" class="rpg-status-opt opt-buff" aria-pressed="${hudState.statuses.includes(s.id) ? 'true' : 'false'}" onclick="COS_RPG.toggleStatus('${s.id}')" title="${esc(s.rule)}">${esc(s.label)}</button>
                    `).join('')}
                </div>
                <div style="font-size:0.64rem; font-weight:800; color:#fca5a5; text-transform:uppercase; margin-top:2px;">Conditions &amp; Debuffs</div>
                <div class="rpg-status-picker-grid">
                    ${STATUS_CATALOG.filter(s => s.kind === 'debuff').map(s => `
                        <button type="button" class="rpg-status-opt opt-debuff" aria-pressed="${hudState.statuses.includes(s.id) ? 'true' : 'false'}" onclick="COS_RPG.toggleStatus('${s.id}')" title="${esc(s.rule)}">${esc(s.label)}</button>
                    `).join('')}
                </div>
            </div>
        `;

        host.innerHTML = `
            ${concHtml}
            <div class="rpg-status-row">
                ${activeChipsHtml || (!hudState.conc ? '<span style="font-size:0.67rem; color:#64748b;">No active conditions</span>' : '')}
                <button type="button" class="rpg-status-add-btn" onclick="COS_RPG.toggleStatusPicker()" aria-expanded="${statusPickerOpen ? 'true' : 'false'}">${statusPickerOpen ? '▴ Done' : '+ Status'}</button>
                ${!hudState.conc ? `<button type="button" class="rpg-status-add-btn" style="color:#c4b5fd; border-color:rgba(167,139,250,0.45);" onclick="COS_RPG.promptManualConcentration()" title="Set a Concentration spell manually">+ 🧠 Conc</button>` : ''}
            </div>
            ${ruleHtml}
            ${pickerHtml}
        `;
    }

    // 💀 STANDARD D&D 5E DEATH SAVES (3 Successes / 3 Failures, Nat 20 = 1 HP, Nat 1 = 2 Fails)
    function renderDeathSavesBox(curHp) {
        const box = document.getElementById('rpg-death-saves-box');
        if (!box) return;
        const isDying = (curHp <= 0);
        if (!isDying) {
            if (hudState.deathSaves.succ > 0 || hudState.deathSaves.fail > 0) {
                hudState.deathSaves = { succ: 0, fail: 0 };
                saveHudState();
            }
            box.classList.remove('is-dying');
            return;
        }
        box.classList.add('is-dying');
        const { succ, fail } = hudState.deathSaves;
        const statusBanner = succ >= 3
            ? `<span style="color:#4ade80; font-weight:800;">✅ STABILIZED (0 HP)</span>`
            : (fail >= 3
                ? `<span style="color:#f87171; font-weight:900;">💀 3 FAILURES — FALLEN</span>`
                : `<span style="color:#fecaca; font-weight:800;">💀 DYING — 5e DEATH SAVES</span>`);

        const succPips = [1, 2, 3].map(n => `
            <button type="button" class="rpg-ds-pip ${succ >= n ? 'is-succ' : ''}" onclick="COS_RPG.setDeathSavePip('succ', ${n})" aria-label="Death Save Success ${n}" title="Toggle Success ${n}">${succ >= n ? '✓' : ''}</button>
        `).join('');
        const failPips = [1, 2, 3].map(n => `
            <button type="button" class="rpg-ds-pip ${fail >= n ? 'is-fail' : ''}" onclick="COS_RPG.setDeathSavePip('fail', ${n})" aria-label="Death Save Failure ${n}" title="Toggle Failure ${n}">${fail >= n ? '✕' : ''}</button>
        `).join('');

        box.innerHTML = `
            <div class="rpg-ds-row">
                ${statusBanner}
                <button type="button" class="rpg-mini-btn btn-danger" style="min-block-size:24px; padding:2px 9px; font-size:0.7rem;" onclick="COS_RPG.rollDeathSave()" ${succ >= 3 || fail >= 3 ? 'disabled' : ''}>🎲 Roll Death Save</button>
            </div>
            <div class="rpg-ds-row">
                <span style="color:#86efac;">Successes (${succ}/3)</span>
                <div class="rpg-ds-pips">${succPips}</div>
            </div>
            <div class="rpg-ds-row">
                <span style="color:#fca5a5;">Failures (${fail}/3)</span>
                <div class="rpg-ds-pips">${failPips}</div>
            </div>
        `;
    }

    function setDeathSavePip(kind, n) {
        const cur = hudState.deathSaves[kind] || 0;
        hudState.deathSaves[kind] = (cur === n) ? n - 1 : n;
        saveHudState();
        renderDeathSavesBox(parseCurrentVitalsFromDom().cur);
        syncHeroStateToFirebase(false);
    }

    function rollDeathSave() {
        const d20 = Math.floor(Math.random() * 20) + 1;
        if (d20 === 20) {
            hudState.deathSaves = { succ: 0, fail: 0 };
            saveHudState();
            if (adapter && adapter.healHP) adapter.healHP(1, false);
            if (adapter && adapter.log) {
                adapter.log(`🌟 <strong>NAT 20 DEATH SAVE!</strong> You gasp back to consciousness and immediately regain <strong style="color:#4ade80;">1 HP</strong>!`);
            }
            return;
        }
        if (d20 === 1) {
            hudState.deathSaves.fail = Math.min(3, (hudState.deathSaves.fail || 0) + 2);
            saveHudState();
            renderDeathSavesBox(0);
            syncHeroStateToFirebase(true);
            if (adapter && adapter.log) {
                adapter.log(`💀 <strong>NAT 1 DEATH SAVE!</strong> Suffers <strong style="color:#f87171;">2 Failures</strong> (${hudState.deathSaves.fail}/3 Fails, ${hudState.deathSaves.succ}/3 Successes)!${hudState.deathSaves.fail >= 3 ? ' <strong>CHARACTER HAS FALLEN!</strong>' : ''}`);
            }
            return;
        }
        if (d20 >= 10) {
            hudState.deathSaves.succ = Math.min(3, (hudState.deathSaves.succ || 0) + 1);
            saveHudState();
            renderDeathSavesBox(0);
            syncHeroStateToFirebase(true);
            if (adapter && adapter.log) {
                adapter.log(`💚 <strong>Death Save SUCCESS (d20: ${d20}):</strong> ${hudState.deathSaves.succ}/3 Successes, ${hudState.deathSaves.fail}/3 Failures.${hudState.deathSaves.succ >= 3 ? ' <strong style="color:#4ade80;">✅ STABILIZED AT 0 HP!</strong>' : ''}`);
            }
        } else {
            hudState.deathSaves.fail = Math.min(3, (hudState.deathSaves.fail || 0) + 1);
            saveHudState();
            renderDeathSavesBox(0);
            syncHeroStateToFirebase(true);
            if (adapter && adapter.log) {
                adapter.log(`🩸 <strong>Death Save FAILURE (d20: ${d20}):</strong> ${hudState.deathSaves.fail}/3 Failures, ${hudState.deathSaves.succ}/3 Successes.${hudState.deathSaves.fail >= 3 ? ' <strong style="color:#f87171;">💀 3 FAILURES — CHARACTER HAS FALLEN!</strong>' : ''}`);
            }
        }
    }

    // ✨ TACTILE HP FLOATING NUMBERS & BLOODIED PULSE
    function spawnHpFloat(delta, isTemp = false) {
        if (!delta) return;
        const hpBox = document.getElementById('hp-bar')?.closest('.hp-ctrl-container, .panel');
        if (!hpBox) return;
        hpBox.classList.add('rpg-hp-host');
        const el = document.createElement('span');
        el.className = `rpg-hp-float ${isTemp ? 'is-temp' : (delta > 0 ? 'is-heal' : 'is-dmg')}`;
        el.textContent = isTemp ? `+${delta} TEMP` : (delta > 0 ? `+${delta} HP` : `${delta} HP`);
        hpBox.appendChild(el);
        setTimeout(() => el.remove(), 1100);
    }

    function handleHpUpdateEffects() {
        const v = parseCurrentVitalsFromDom();
        const hpBox = document.getElementById('hp-bar')?.closest('.hp-ctrl-container, .panel');
        if (hpBox) {
            hpBox.classList.toggle('hp-critical-pulse', v.cur > 0 && (v.cur / Math.max(1, v.max)) <= 0.25);
        }
        // Smart Clear Temp visibility (show ONLY when temp > 0!)
        const clrBtn = document.getElementById('btn-clear-temp');
        if (clrBtn) clrBtn.style.display = v.temp > 0 ? 'inline-flex' : 'none';

        if (prevTrackedHp) {
            const prevTot = prevTrackedHp.cur + prevTrackedHp.temp;
            const nextTot = v.cur + v.temp;
            const diff = nextTot - prevTot;
            if (diff < 0) {
                spawnHpFloat(diff, false);
                if (hudState.conc) triggerConcentrationCheck(Math.abs(diff));
            } else if (diff > 0) {
                const onlyTemp = (v.cur === prevTrackedHp.cur && v.temp > prevTrackedHp.temp);
                spawnHpFloat(diff, onlyTemp);
            }
        }
        prevTrackedHp = { cur: v.cur, max: v.max, temp: v.temp };
        renderDeathSavesBox(v.cur);
        renderPartyMiniHud();
    }

    // 🎯 SKILLS QUICK-FILTER (Search + Trained-Only Toggle)
    function applySkillsFilter() {
        const q = (document.getElementById('rpg-skills-search')?.value || '').trim().toLowerCase();
        const trainedOnly = Boolean(hudState.skillsTrainedOnly);
        const list = document.querySelector('.stat-row-list');
        if (!list) return;
        list.querySelectorAll('li.stat-row-item').forEach(li => {
            const isTrained = li.classList.contains('prof-item') || li.classList.contains('exp-item');
            const matchesTrained = !trainedOnly || isTrained;
            const matchesQuery = !q || (li.innerText || '').toLowerCase().includes(q);
            li.style.display = (matchesTrained && matchesQuery) ? '' : 'none';
        });
        const btn = document.getElementById('rpg-skills-trained-btn');
        if (btn) btn.setAttribute('aria-pressed', trainedOnly ? 'true' : 'false');
    }

    function toggleSkillsTrainedFilter() {
        hudState.skillsTrainedOnly = !hudState.skillsTrainedOnly;
        saveHudState();
        applySkillsFilter();
    }

    // 🎮 BOTTOM-RIGHT RPG SPEED-DIAL (FLOATING BUBBLES + DICE TRAY + LIVE PARTY TOGGLE)
    function syncPartyHudVisibility() {
        const host = document.getElementById('rpg-party-hud');
        const btn = document.getElementById('rpg-fab-party-btn');
        const visible = Boolean(hudState.showPartyHud);
        if (host) host.classList.toggle('is-visible', visible);
        if (btn) {
            btn.setAttribute('aria-pressed', visible ? 'true' : 'false');
            btn.innerHTML = visible ? `👥 Live Party <span style="color:#6ee7b7; font-size:0.64rem;">ON</span>` : `👥 Live Party`;
        }
    }

    function togglePartyHud(forceState) {
        hudState.showPartyHud = typeof forceState === 'boolean' ? forceState : !hudState.showPartyHud;
        saveHudState();
        syncPartyHudVisibility();
        if (hudState.showPartyHud) renderPartyMiniHud();
        announceStatus(hudState.showPartyHud ? 'Live Party vitals bar shown.' : 'Live Party vitals bar hidden.');
    }

    const THEME_STORAGE_KEY = 'cos_sheet_theme_v1';
    const THEME_CATALOG = [
        {
            id: 'obsidian',
            name: 'Obsidian Brass',
            desc: 'Smoked charcoal & antique brass',
            scheme: 'dark',
            swatches: ['#0c0d10', '#c8a45c', '#5eb88a']
        },
        {
            id: 'midnight',
            name: 'Midnight Slate',
            desc: 'Deep indigo Ravenloft twilight',
            scheme: 'dark',
            swatches: ['#0c1220', '#7ea8dc', '#c8a45c']
        },
        {
            id: 'velvet',
            name: 'Barovian Velvet',
            desc: 'Smoked plum & candlelight gold',
            scheme: 'dark',
            swatches: ['#150d14', '#d48b9c', '#c8a45c']
        },
        {
            id: 'pine',
            name: 'Pine Forest Slate',
            desc: 'Svalich evergreen & moss brass',
            scheme: 'dark',
            swatches: ['#0c1512', '#6fa884', '#c2a65c']
        },
        {
            id: 'parchment',
            name: 'Warm Parchment',
            desc: 'Soft aged vellum (Light Mode)',
            scheme: 'light',
            swatches: ['#f1eadc', '#8a5d1c', '#9c3333']
        }
    ];

    function getStoredThemeId() {
        try {
            const raw = localStorage.getItem(THEME_STORAGE_KEY);
            return THEME_CATALOG.some(t => t.id === raw) ? raw : null;
        } catch (e) {
            return null;
        }
    }

    function syncThemeTrayUI() {
        const currentId = getStoredThemeId();
        const sysDark = typeof window.matchMedia === 'function'
            ? window.matchMedia('(prefers-color-scheme: dark)').matches
            : true;
        document.querySelectorAll('#rpg-theme-list .rpg-theme-option').forEach(btn => {
            const active = btn.dataset.themeId === currentId;
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        const sysBtn = document.getElementById('rpg-theme-system-btn');
        if (sysBtn) {
            sysBtn.setAttribute('aria-pressed', currentId === null ? 'true' : 'false');
        }
        const sysLabel = document.getElementById('rpg-theme-system-mode');
        if (sysLabel) {
            sysLabel.textContent = sysDark ? 'Currently Dark' : 'Currently Light';
        }
    }

    function applySheetTheme(themeId, persist = true) {
        const root = document.documentElement;
        const meta = document.querySelector('meta[name="color-scheme"]');
        const entry = THEME_CATALOG.find(t => t.id === themeId) || null;
        if (entry) {
            root.setAttribute('data-theme', entry.id);
            if (meta) meta.setAttribute('content', entry.scheme);
            if (persist) {
                try { localStorage.setItem(THEME_STORAGE_KEY, entry.id); } catch (e) {}
            }
        } else {
            root.removeAttribute('data-theme');
            if (meta) meta.setAttribute('content', 'light dark');
            if (persist) {
                try { localStorage.removeItem(THEME_STORAGE_KEY); } catch (e) {}
            }
        }
        syncThemeTrayUI();
    }

    function setSheetTheme(themeId) {
        applySheetTheme(themeId === 'system' ? null : themeId, true);
    }

    const VIEW_MODE_STORAGE_KEY = 'cos_sheet_view_mode_v1';
    const VIEW_MODE_CATALOG = [
        {
            id: 'pc',
            icon: '🖥️',
            shortLabel: 'PC',
            name: 'PC (Default)',
            desc: 'Full 2-column desktop command sheet'
        },
        {
            id: 'tablet',
            icon: '📟',
            shortLabel: 'Tablet',
            name: 'Tablet',
            desc: 'Medium touch-sized hybrid layout'
        },
        {
            id: 'mobile',
            icon: '📱',
            shortLabel: 'Mobile',
            name: 'Mobile Phone',
            desc: 'Thumb-first 5-tab mobile RPG app'
        }
    ];

    function getStoredViewMode() {
        try {
            const raw = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
            return VIEW_MODE_CATALOG.some(v => v.id === raw) ? raw : 'pc';
        } catch (e) {
            return 'pc';
        }
    }

    function syncFormatTrayUI() {
        const curMode = document.documentElement.getAttribute('data-view-mode') || getStoredViewMode();
        const entry = VIEW_MODE_CATALOG.find(v => v.id === curMode) || VIEW_MODE_CATALOG[0];
        document.querySelectorAll('#rpg-format-tray [data-format-id]').forEach(btn => {
            const active = btn.dataset.formatId === entry.id;
            btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        });
        const fabFormatBtn = document.getElementById('rpg-fab-format-btn');
        if (fabFormatBtn) {
            fabFormatBtn.innerHTML = `${entry.icon} Format: <strong style="color:var(--accent-gold-bright, #fde68a);">${esc(entry.shortLabel)}</strong>`;
        }
    }

    function applySheetViewMode(modeId, persist = true) {
        const entry = VIEW_MODE_CATALOG.find(v => v.id === modeId) || VIEW_MODE_CATALOG[0];
        document.documentElement.setAttribute('data-view-mode', entry.id);
        if (persist) {
            try { localStorage.setItem(VIEW_MODE_STORAGE_KEY, entry.id); } catch (e) {}
        }
        syncFormatTrayUI();
        applyMobileTabLayout();
    }

    function setSheetViewMode(modeId) {
        const entry = VIEW_MODE_CATALOG.find(v => v.id === modeId) || VIEW_MODE_CATALOG[0];
        applySheetViewMode(entry.id, true);
        announceStatus(`Switched display format to ${entry.name}.`);
    }

    function initThemeListeners() {
        applySheetTheme(getStoredThemeId(), false);
        applySheetViewMode(getStoredViewMode(), false);
        if (window.__cosThemeListenersAttached) return;
        window.__cosThemeListenersAttached = true;
        window.addEventListener('storage', (e) => {
            if (e.key === THEME_STORAGE_KEY) {
                applySheetTheme(e.newValue, false);
            } else if (e.key === VIEW_MODE_STORAGE_KEY) {
                applySheetViewMode(e.newValue || 'pc', false);
            }
        });
        if (typeof window.matchMedia === 'function') {
            const mql = window.matchMedia('(prefers-color-scheme: dark)');
            const onSysChange = () => syncThemeTrayUI();
            if (typeof mql.addEventListener === 'function') mql.addEventListener('change', onSysChange);
            else if (typeof mql.addListener === 'function') mql.addListener(onSysChange);
        }
    }

    function toggleFabMenu(forceState) {
        const bubbles = document.getElementById('rpg-fab-bubbles');
        const mainBtn = document.getElementById('rpg-dice-fab-btn');
        const tray = document.getElementById('rpg-dice-tray');
        const themeTray = document.getElementById('rpg-theme-tray');
        const formatTray = document.getElementById('rpg-format-tray');
        if (!bubbles) return;
        if (typeof forceState !== 'boolean' && ((tray && tray.classList.contains('is-open')) || (themeTray && themeTray.classList.contains('is-open')) || (formatTray && formatTray.classList.contains('is-open')))) {
            toggleDiceTray(false);
            toggleThemeTray(false);
            toggleFormatTray(false);
            return;
        }
        const next = typeof forceState === 'boolean' ? forceState : !bubbles.classList.contains('is-open');
        bubbles.classList.toggle('is-open', next);
        if (next && tray) tray.classList.remove('is-open');
        if (next && themeTray) themeTray.classList.remove('is-open');
        if (next && formatTray) formatTray.classList.remove('is-open');
        if (mainBtn) {
            mainBtn.classList.toggle('is-open', next);
            mainBtn.setAttribute('aria-expanded', next ? 'true' : 'false');
        }
        syncDiceFabBadge();
    }

    function toggleDiceTray(forceState) {
        const tray = document.getElementById('rpg-dice-tray');
        const themeTray = document.getElementById('rpg-theme-tray');
        const formatTray = document.getElementById('rpg-format-tray');
        const bubbles = document.getElementById('rpg-fab-bubbles');
        const mainBtn = document.getElementById('rpg-dice-fab-btn');
        if (!tray) return;
        const next = typeof forceState === 'boolean' ? forceState : !tray.classList.contains('is-open');
        tray.classList.toggle('is-open', next);
        if (next && bubbles) bubbles.classList.remove('is-open');
        if (next && themeTray) themeTray.classList.remove('is-open');
        if (next && formatTray) formatTray.classList.remove('is-open');
        if (mainBtn) {
            const anyOpen = next || Boolean(bubbles && bubbles.classList.contains('is-open')) || Boolean(themeTray && themeTray.classList.contains('is-open')) || Boolean(formatTray && formatTray.classList.contains('is-open'));
            mainBtn.classList.toggle('is-open', anyOpen);
            mainBtn.setAttribute('aria-expanded', anyOpen ? 'true' : 'false');
        }
        syncDiceFabBadge();
    }

    function toggleThemeTray(forceState) {
        const themeTray = document.getElementById('rpg-theme-tray');
        const tray = document.getElementById('rpg-dice-tray');
        const formatTray = document.getElementById('rpg-format-tray');
        const bubbles = document.getElementById('rpg-fab-bubbles');
        const mainBtn = document.getElementById('rpg-dice-fab-btn');
        if (!themeTray) return;
        const next = typeof forceState === 'boolean' ? forceState : !themeTray.classList.contains('is-open');
        themeTray.classList.toggle('is-open', next);
        if (next && bubbles) bubbles.classList.remove('is-open');
        if (next && tray) tray.classList.remove('is-open');
        if (next && formatTray) formatTray.classList.remove('is-open');
        if (next) syncThemeTrayUI();
        syncDiceFabBadge();
        if (mainBtn) {
            const anyOpen = next || Boolean(bubbles && bubbles.classList.contains('is-open')) || Boolean(tray && tray.classList.contains('is-open')) || Boolean(formatTray && formatTray.classList.contains('is-open'));
            mainBtn.classList.toggle('is-open', anyOpen);
            mainBtn.setAttribute('aria-expanded', anyOpen ? 'true' : 'false');
        }
    }

    function toggleFormatTray(forceState) {
        const formatTray = document.getElementById('rpg-format-tray');
        const themeTray = document.getElementById('rpg-theme-tray');
        const tray = document.getElementById('rpg-dice-tray');
        const bubbles = document.getElementById('rpg-fab-bubbles');
        const mainBtn = document.getElementById('rpg-dice-fab-btn');
        if (!formatTray) return;
        const next = typeof forceState === 'boolean' ? forceState : !formatTray.classList.contains('is-open');
        formatTray.classList.toggle('is-open', next);
        if (next && bubbles) bubbles.classList.remove('is-open');
        if (next && tray) tray.classList.remove('is-open');
        if (next && themeTray) themeTray.classList.remove('is-open');
        if (next) syncFormatTrayUI();
        syncDiceFabBadge();
        if (mainBtn) {
            const anyOpen = next || Boolean(bubbles && bubbles.classList.contains('is-open')) || Boolean(tray && tray.classList.contains('is-open')) || Boolean(themeTray && themeTray.classList.contains('is-open'));
            mainBtn.classList.toggle('is-open', anyOpen);
            mainBtn.setAttribute('aria-expanded', anyOpen ? 'true' : 'false');
        }
    }

    function syncDiceFabBadge() {
        const mainBtn = document.getElementById('rpg-dice-fab-btn');
        const diceBubble = document.getElementById('rpg-fab-dice-btn');
        const bubblesOpen = Boolean(document.getElementById('rpg-fab-bubbles')?.classList.contains('is-open'));
        const trayOpen = Boolean(document.getElementById('rpg-dice-tray')?.classList.contains('is-open'));
        const themeOpen = Boolean(document.getElementById('rpg-theme-tray')?.classList.contains('is-open'));
        const formatOpen = Boolean(document.getElementById('rpg-format-tray')?.classList.contains('is-open'));
        const mode = (typeof window.rollMode === 'string') ? window.rollMode : 'norm';
        if (diceBubble) {
            diceBubble.classList.toggle('is-adv', mode === 'adv');
            diceBubble.classList.toggle('is-dis', mode === 'dis');
            if (mode === 'adv') diceBubble.textContent = hudState.advLocked ? '🎲 Quick Dice (ADV 🔒)' : '🎲 Quick Dice (ADV)';
            else if (mode === 'dis') diceBubble.textContent = hudState.advLocked ? '🎲 Quick Dice (DIS 🔒)' : '🎲 Quick Dice (DIS)';
            else diceBubble.textContent = '🎲 Quick Dice';
        }
        if (mainBtn) {
            mainBtn.classList.toggle('is-adv', mode === 'adv');
            mainBtn.classList.toggle('is-dis', mode === 'dis');
            const lbl = document.getElementById('rpg-fab-label') || mainBtn;
            if (bubblesOpen || trayOpen || themeOpen || formatOpen) {
                lbl.textContent = mode === 'adv' ? '✕ ADV' : (mode === 'dis' ? '✕ DIS' : '✕ Close');
            } else if (mode === 'adv') {
                lbl.textContent = hudState.advLocked ? '✦ ADV 🔒' : '✦ ADV';
            } else if (mode === 'dis') {
                lbl.textContent = hudState.advLocked ? '✦ DIS 🔒' : '✦ DIS';
            } else {
                lbl.textContent = '✦ Menu';
            }
        }
    }

    function toggleAdvLock() {
        hudState.advLocked = !hudState.advLocked;
        saveHudState();
        const btn = document.getElementById('rpg-adv-lock-btn');
        if (btn) {
            btn.setAttribute('aria-pressed', hudState.advLocked ? 'true' : 'false');
            btn.textContent = hudState.advLocked ? '🔒' : '🔓';
            btn.title = hudState.advLocked
                ? 'Adv/Dis LOCKED (stays active across rolls) — click to unlock'
                : 'Adv/Dis auto-resets after 1 roll — click to lock for multi-turn buffs/debuffs';
        }
        syncDiceFabBadge();
    }

    function consumeTempRollMode() {
        if (hudState.advLocked) return;
        if (typeof window.rollMode === 'string' && window.rollMode !== 'norm' && typeof window.toggleAdvantage === 'function') {
            window.toggleAdvantage(window.rollMode);
        }
    }

    // 💥 1-CLICK ATTACK ➔ DAMAGE & BRUTAL CRIT ENGINE INSIDE FLOATING ROLL HUD
    function setRollFollowup(spec) {
        pendingRollFollowup = spec ? { ...spec, ts: Date.now() } : null;
    }

    function triggerRollFollowup(useCrit) {
        const f = pendingRollFollowup;
        pendingRollFollowup = null;
        if (!f) return;
        if (useCrit && typeof f.onCrit === 'function') f.onCrit();
        else if (typeof f.onDamage === 'function') f.onDamage();
    }

    function rollBrutalCrit(opts) {
        const diceCount = Math.max(1, parseInt(opts.diceCount) || 1);
        const sides = Math.max(4, parseInt(opts.sides) || 6);
        const flatMod = parseInt(opts.flatMod) || 0;
        const maxBase = diceCount * sides;
        const rollOneSet = () => {
            const arr = [];
            let sum = 0;
            for (let i = 0; i < diceCount; i++) {
                const r = Math.floor(Math.random() * sides) + 1;
                arr.push(r); sum += r;
            }
            return { arr, sum };
        };
        let rolled = rollOneSet();
        let savageNote = '';
        if (opts.isSavage) {
            const set2 = rollOneSet();
            if (set2.sum > rolled.sum) {
                savageNote = ` <em>(Savage: [${rolled.arr.join('+')}] vs <strong>[${set2.arr.join('+')}]</strong>)</em>`;
                rolled = set2;
            } else {
                savageNote = ` <em>(Savage: <strong>[${rolled.arr.join('+')}]</strong> vs [${set2.arr.join('+')}])</em>`;
            }
        }
        let total = maxBase + rolled.sum + flatMod;
        let extraHtml = '';
        (opts.extras || []).forEach(ex => {
            if (!ex || !ex.dice) return;
            const r = rollDiceExpr(ex.dice);
            total += r.max + r.sum;
            extraHtml += ` + <span style="color:#fde68a;">${r.max}+[${r.rolls.join('+')}] ${esc(ex.type || 'Bonus')}</span>`;
        });
        const modStr = flatMod > 0 ? ` + ${flatMod}` : (flatMod < 0 ? ` - ${Math.abs(flatMod)}` : '');
        const msg = `🔥 <strong style="color:#facc15;">BRUTAL CRIT — ${esc(opts.label || 'Attack')}!</strong> Max(<strong>${maxBase}</strong>) + Roll([<strong>${rolled.arr.join('+')}</strong>])${savageNote}${modStr}${extraHtml} = <span style="font-size:1.18rem; color:#f87171; font-weight:900;">${total} ${esc(opts.dmgType || '')} Damage!</span>`;
        if (adapter && adapter.log) adapter.log(msg);
    }

    function openRulesModal() {
        const m = document.getElementById('rpg-rules-modal');
        if (m && !m.open) m.showModal();
    }

    function openRestModal() {
        const m = document.getElementById('rpg-rest-modal');
        const body = document.getElementById('rpg-rest-body');
        if (!m || !body || !adapter) return;
        const v = parseCurrentVitalsFromDom();
        const shortHeal = Math.max(1, Math.ceil((v.max || 20) * 0.25));
        const hid = adapter.heroId;
        const shortBullets = hid === 'jacomir'
            ? [
                `Restore <strong>+${shortHeal} HP</strong> (25% Max HP, capped at Max)`,
                `Refill all <strong>4/4 Superiority Dice (d8)</strong>`,
                `Recharge <strong>Action Surge</strong> &amp; regain <strong>+1 Second Wind</strong>`,
                `Regain <strong>+1 Help Token</strong> (up to 2/day)`
            ]
            : (hid === 'piper'
                ? [
                    `Restore <strong>+${shortHeal} HP</strong> (25% Max HP, capped at Max)`,
                    `Regain <strong>+1 Help Token</strong> (up to 2/day)`,
                    `Good time to craft Potions or Bandages in <strong>Craft</strong>`
                ]
                : [
                    `Restore <strong>+${shortHeal} HP</strong> (25% Max HP, capped at Max)`,
                    `Top off all <strong>Firearm Chambers</strong> (Lament, Mercy &amp; Less)`,
                    `Regain <strong>+1 Help Token</strong>`
                ]);
        const longBullets = hid === 'jacomir'
            ? [
                `Restore full <strong>${v.max}/${v.max} HP</strong> &amp; clear Temporary HP`,
                `Restore all <strong>Superiority Dice</strong>, <strong>Second Wind (3/3)</strong> &amp; <strong>Action Surge</strong>`,
                `Restore <strong>Heroic Inspiration</strong>, <strong>Help Tokens (2/2)</strong> &amp; Short Rests`
            ]
            : (hid === 'piper'
                ? [
                    `Restore full <strong>${v.max}/${v.max} HP</strong> &amp; clear Temporary HP`,
                    `Restore all <strong>Spell Slots</strong>, <strong>Sorcery Points (3/3)</strong> &amp; <strong>Tides of Chaos</strong>`,
                    `Restore <strong>Fierna Charm (1/1)</strong>, <strong>Help Tokens (2/2)</strong> &amp; Short Rests`
                ]
                : [
                    `Restore full <strong>${v.max}/${v.max} HP</strong> &amp; clear Temporary HP`,
                    `Restore all <strong>Spell Slots</strong>, <strong>Hunter's Mark</strong> &amp; <strong>Hunter's Sense (2/2)</strong>`,
                    `Refill all <strong>Ammo Reserves</strong>, <strong>Whispering Grave</strong>, <strong>Inspiration</strong> &amp; <strong>Help (2/2)</strong>`
                ]);

        body.innerHTML = `
            <div class="rpg-rest-grid">
                <div class="rpg-rest-card">
                    <h3><span>☕ Short Rest</span><span class="pill-badge pill-blue">1 Hour</span></h3>
                    <ul>${shortBullets.map(b => `<li>${b}</li>`).join('')}</ul>
                    <button type="button" class="btn-act btn-act-temp" style="width:100%; min-block-size:34px;" onclick="COS_RPG.closeModal('rpg-rest-modal'); if(typeof shortRest==='function'){shortRest();}">☕ Take Short Rest</button>
                </div>
                <div class="rpg-rest-card" style="border-color: rgba(63, 185, 128, 0.32);">
                    <h3><span>⛺ Long Rest</span><span class="pill-badge" style="color:#86efac; border-color:rgba(63,185,128,0.4);">8 Hours</span></h3>
                    <ul>${longBullets.map(b => `<li>${b}</li>`).join('')}</ul>
                    <button type="button" class="btn-act btn-act-heal" style="width:100%; min-block-size:34px;" onclick="COS_RPG.closeModal('rpg-rest-modal'); if(typeof longRest==='function'){longRest();}">⛺ Take Long Rest</button>
                </div>
            </div>
        `;
        if (!m.open) m.showModal();
    }

    function mountVideoGameHudWidgets() {
        loadHudState();

        // 1. Mount BG3 Action Economy Toolbar + Pinned Quick-Belt + Right-Column View Tabs + Mobile 5-Tab Navigation
        const leftCol = document.querySelector('.main-layout > div:nth-child(1)');
        const rightCol = document.querySelector('.main-layout > div:nth-child(2)');
        if (rightCol && !document.getElementById('rpg-action-bar-wrap')) {
            const wrap = document.createElement('div');
            wrap.id = 'rpg-action-bar-wrap';
            wrap.className = 'rpg-action-bar-wrap';
            wrap.innerHTML = `
                <div id="rpg-action-bar" class="rpg-action-toolbar" role="toolbar" focusgroup="toolbar wrap" aria-label="Turn Action Economy"></div>
                <div id="rpg-top-quickbelt" class="rpg-top-quickbelt"></div>
            `;
            const tabs = document.createElement('div');
            tabs.id = 'rpg-right-tabs';
            tabs.className = 'rpg-view-tabs';
            tabs.setAttribute('role', 'toolbar');
            tabs.setAttribute('focusgroup', 'toolbar wrap');
            tabs.setAttribute('aria-label', 'Sheet View Filter');
            tabs.innerHTML = `
                <button type="button" class="rpg-view-tab" data-tab="combat" aria-pressed="true" onclick="COS_RPG.setRightColumnTab('combat')">⚔️ Combat</button>
                <button type="button" class="rpg-view-tab" data-tab="magic" aria-pressed="false" onclick="COS_RPG.setRightColumnTab('magic')">✨ Magic &amp; Features</button>
                <button type="button" class="rpg-view-tab" data-tab="gear" aria-pressed="false" onclick="COS_RPG.setRightColumnTab('gear')">🎒 Gear &amp; Bag</button>
                <button type="button" class="rpg-view-tab" data-tab="all" aria-pressed="false" onclick="COS_RPG.setRightColumnTab('all')">📋 All</button>
            `;
            const magicLbl = (adapter && adapter.heroId === 'jacomir') ? 'Feats' : 'Magic';
            const mobTabs = document.createElement('div');
            mobTabs.id = 'rpg-mobile-tabs';
            mobTabs.className = 'rpg-mobile-tabs';
            mobTabs.setAttribute('role', 'toolbar');
            mobTabs.setAttribute('focusgroup', 'toolbar wrap');
            mobTabs.setAttribute('aria-label', 'Mobile Sheet Sections');
            mobTabs.innerHTML = `
                <button type="button" class="rpg-mobile-tab" data-mob-tab="combat" aria-pressed="true" onclick="COS_RPG.setMobileTab('combat')">
                    <span class="mob-tab-ico" aria-hidden="true">⚔️</span>
                    <span class="mob-tab-lbl">Combat</span>
                </button>
                <button type="button" class="rpg-mobile-tab" data-mob-tab="magic" aria-pressed="false" onclick="COS_RPG.setMobileTab('magic')">
                    <span class="mob-tab-ico" aria-hidden="true">✨</span>
                    <span class="mob-tab-lbl">${magicLbl}</span>
                </button>
                <button type="button" class="rpg-mobile-tab" data-mob-tab="checks" aria-pressed="false" onclick="COS_RPG.setMobileTab('checks')">
                    <span class="mob-tab-ico" aria-hidden="true">🎯</span>
                    <span class="mob-tab-lbl">Checks</span>
                </button>
                <button type="button" class="rpg-mobile-tab" data-mob-tab="gear" aria-pressed="false" onclick="COS_RPG.setMobileTab('gear')">
                    <span class="mob-tab-ico" aria-hidden="true">🎒</span>
                    <span class="mob-tab-lbl">Gear</span>
                </button>
                <button type="button" class="rpg-mobile-tab" data-mob-tab="notes" aria-pressed="false" onclick="COS_RPG.setMobileTab('notes')">
                    <span class="mob-tab-ico" aria-hidden="true">📓</span>
                    <span class="mob-tab-lbl">Notes</span>
                </button>
                <button type="button" class="rpg-mobile-tab" data-mob-tab="all" aria-pressed="false" onclick="COS_RPG.setMobileTab('all')" title="View all sections stacked">
                    <span class="mob-tab-ico" aria-hidden="true">📋</span>
                    <span class="mob-tab-lbl">All</span>
                </button>
            `;
            const mobCombatBelt = document.createElement('div');
            mobCombatBelt.id = 'rpg-mobile-combat-belt';
            mobCombatBelt.className = 'rpg-mobile-combat-belt';
            mobCombatBelt.dataset.mobileCats = 'combat';
            mobCombatBelt.dataset.mobileOrder = '29';

            rightCol.insertBefore(mobCombatBelt, rightCol.firstChild);
            rightCol.insertBefore(mobTabs, rightCol.firstChild);
            rightCol.insertBefore(tabs, rightCol.firstChild);
            rightCol.insertBefore(wrap, rightCol.firstChild);
            installToolbarRovingFallback(tabs);
            installToolbarRovingFallback(mobTabs);
        }

        // 1b. Mount Mobile Ability Scores, Passives & Origin Quick-Launch Card (shown on Mobile Checks & Notes tabs)
        if (leftCol && !document.getElementById('rpg-mobile-dossier-bar')) {
            const dossierBar = document.createElement('div');
            dossierBar.id = 'rpg-mobile-dossier-bar';
            dossierBar.className = 'rpg-mobile-dossier-bar';
            dossierBar.dataset.mobileCats = 'checks notes';
            dossierBar.dataset.mobileOrder = '38';
            dossierBar.innerHTML = `
                <button type="button" class="rpg-mobile-dossier-btn" onclick="if(typeof openSpellDetailsModal==='function') openSpellDetailsModal('backstory_full')">
                    <span class="rpg-mobile-dossier-left">
                        <span class="rpg-mobile-dossier-ico" aria-hidden="true">📜</span>
                        <span class="rpg-mobile-dossier-txt">
                            <strong>6 Ability Scores (STR–CHA), Passives &amp; Origin</strong>
                            <span>Tap to view core attributes, traits, resistances &amp; backstory</span>
                        </span>
                    </span>
                    <span class="rpg-mobile-dossier-arrow" aria-hidden="true">➔</span>
                </button>
            `;
            leftCol.appendChild(dossierBar);
        }

        // 2. Mount Concentration & Quick Status Strip seamlessly inside Unified Vitals Plate (or below buffsBar fallback)
        const vitalsPlate = document.querySelector('.vitals-plate');
        const buffsBar = document.querySelector('.buffs-toggle-bar');
        if ((vitalsPlate || buffsBar) && !document.getElementById('rpg-status-strip')) {
            const strip = document.createElement('div');
            strip.id = 'rpg-status-strip';
            strip.className = 'rpg-status-panel';
            if (vitalsPlate) vitalsPlate.appendChild(strip);
            else buffsBar.insertAdjacentElement('afterend', strip);
        }

        // 3. Mount Standard 5e Death Saves Overlay inside the HP box (hidden unless curHP === 0)
        const hpBox = document.getElementById('hp-bar')?.closest('.hp-ctrl-container, .panel');
        if (hpBox && !document.getElementById('rpg-death-saves-box')) {
            const ds = document.createElement('div');
            ds.id = 'rpg-death-saves-box';
            ds.className = 'rpg-death-saves-box';
            hpBox.appendChild(ds);
        }

        // 4. Mount Skills Quick-Filter Bar inside the 18 Skills panel
        const skillsList = document.querySelector('.stat-row-list');
        if (skillsList && !document.getElementById('rpg-skills-filter-bar')) {
            const fBar = document.createElement('div');
            fBar.id = 'rpg-skills-filter-bar';
            fBar.className = 'rpg-skills-filter-bar';
            fBar.innerHTML = `
                <input type="search" id="rpg-skills-search" class="rpg-skills-search" placeholder="🔍 Filter skills..." aria-label="Filter skills" oninput="COS_RPG.applySkillsFilter()">
                <button type="button" id="rpg-skills-trained-btn" class="rpg-skills-mode-btn" aria-pressed="${hudState.skillsTrainedOnly ? 'true' : 'false'}" onclick="COS_RPG.toggleSkillsTrainedFilter()" title="Toggle showing only proficient / expertise skills">★ Trained</button>
            `;
            skillsList.insertAdjacentElement('beforebegin', fBar);
        }

        // 5. Mount Bottom-Right Video-Game Speed-Dial (Floating Bubbles: Dice, Live Party Toggle, Rules, Portal)
        if (!document.getElementById('rpg-dice-fab-wrap')) {
            const specialDieBtn = adapter.heroId === 'piper'
                ? `<button type="button" class="dice-btn" style="grid-column: span 4; border-color:#7c3aed; color:#fde68a; background:#1e1633;" onclick="triggerWildMagicSurge('Manual d100 Surge Roll')">💥 Wild Surge (d100)</button>`
                : (adapter.heroId === 'jacomir'
                    ? `<button type="button" class="dice-btn" style="grid-column: span 4; border-color:#f59e0b; color:#fde68a; background:#271a0c;" onclick="rollSuperiorityDieRaw()">⚔️ Superiority Die (1d8)</button>`
                    : '');
            const fabWrap = document.createElement('div');
            fabWrap.id = 'rpg-dice-fab-wrap';
            fabWrap.className = 'rpg-dice-fab-wrap';
            fabWrap.innerHTML = `
                <div id="rpg-dice-tray" class="rpg-dice-tray" role="region" aria-label="Quick Dice Roller">
                    <div class="rpg-dice-tray-head">
                        <span>🎲 Quick Dice &amp; Modifiers</span>
                        <button type="button" class="btn-act btn-act-pre" style="padding:1px 6px; font-size:0.66rem;" onclick="COS_RPG.toggleDiceTray(false)" aria-label="Close Dice Tray">✕</button>
                    </div>
                    <div class="rpg-dice-tray-grid">
                        <button type="button" class="dice-btn" onclick="rollCustomDie(20)">d20</button>
                        <button type="button" class="dice-btn" onclick="rollCustomDie(12)">d12</button>
                        <button type="button" class="dice-btn" onclick="rollCustomDie(10)">d10</button>
                        <button type="button" class="dice-btn" onclick="rollCustomDie(8)">d8</button>
                        <button type="button" class="dice-btn" onclick="rollCustomDie(6)">d6</button>
                        <button type="button" class="dice-btn" onclick="rollCustomDie(4)">d4</button>
                        <button type="button" class="dice-btn" style="grid-column: span 2;" onclick="rollCustomDie(100)">d100</button>
                        ${specialDieBtn}
                    </div>
                    <div class="rpg-dice-tray-modrow">
                        <div style="display:flex; align-items:center; gap:3px;">
                            <span style="font-size:0.7rem; font-weight:700; color:#94a3b8;">Mod:</span>
                            <input type="number" id="dice-mod" class="hp-input-num" value="0" style="width:40px; height:24px; padding:1px 3px; font-size:0.76rem; text-align:center;">
                            <button type="button" class="btn-act btn-act-pre" style="padding:2px 6px; font-size:0.7rem;" onclick="modDiceMod(-1)">−1</button>
                            <button type="button" class="btn-act btn-act-pre" style="padding:2px 6px; font-size:0.7rem;" onclick="modDiceMod(1)">+1</button>
                            <button type="button" class="btn-act btn-act-pre" style="padding:2px 6px; font-size:0.7rem;" onclick="document.getElementById('dice-mod').value=0">0</button>
                        </div>
                        <div style="display:flex; align-items:center; gap:3px;">
                            <button type="button" class="btn-act btn-act-pre" id="btn-adv" style="padding:3px 7px; font-size:0.7rem;" onclick="toggleAdvantage('adv')">Adv</button>
                            <button type="button" class="btn-act btn-act-pre" id="btn-dis" style="padding:3px 7px; font-size:0.7rem;" onclick="toggleAdvantage('dis')">Dis</button>
                            <button type="button" id="rpg-adv-lock-btn" class="rpg-adv-lock-btn" aria-pressed="${hudState.advLocked ? 'true' : 'false'}" onclick="COS_RPG.toggleAdvLock()" title="${hudState.advLocked ? 'Adv/Dis LOCKED (stays active across rolls) — click to unlock' : 'Adv/Dis auto-resets after 1 roll — click to lock'}">${hudState.advLocked ? '🔒' : '🔓'}</button>
                        </div>
                    </div>
                </div>
                <div id="rpg-theme-tray" class="rpg-theme-tray" role="region" aria-label="Sheet Color Themes">
                    <div class="rpg-dice-tray-head">
                        <span>🎨 Sheet Theme</span>
                        <button type="button" class="btn-act btn-act-pre" style="padding:1px 6px; font-size:0.66rem;" onclick="COS_RPG.toggleThemeTray(false)" aria-label="Close Theme Picker">✕</button>
                    </div>
                    <div id="rpg-theme-list" class="rpg-theme-list">
                        ${THEME_CATALOG.map(t => `
                            <button type="button" class="rpg-theme-option" data-theme-id="${esc(t.id)}" aria-pressed="false" onclick="COS_RPG.setSheetTheme('${esc(t.id)}')">
                                <span class="rpg-theme-opt-left">
                                    <span class="rpg-theme-swatches">${t.swatches.map(c => `<span class="rpg-theme-dot" style="background:${c};"></span>`).join('')}</span>
                                    <span class="rpg-theme-meta">
                                        <span class="rpg-theme-name">${esc(t.name)}</span>
                                        <span class="rpg-theme-desc">${esc(t.desc)}</span>
                                    </span>
                                </span>
                                <span class="rpg-theme-check" aria-hidden="true">✓</span>
                            </button>
                        `).join('')}
                    </div>
                    <button type="button" id="rpg-theme-system-btn" class="rpg-theme-option rpg-theme-system-btn" aria-pressed="false" onclick="COS_RPG.setSheetTheme('system')">
                        <span>🌓 Follow System</span>
                        <span id="rpg-theme-system-mode" class="rpg-theme-desc">Currently Dark</span>
                    </button>
                </div>
                <div id="rpg-format-tray" class="rpg-theme-tray rpg-format-tray" role="region" aria-label="Display Format Switcher">
                    <div class="rpg-dice-tray-head">
                        <span>📱 Display Format</span>
                        <button type="button" class="btn-act btn-act-pre" style="padding:1px 6px; font-size:0.66rem;" onclick="COS_RPG.toggleFormatTray(false)" aria-label="Close Display Format Switcher">✕</button>
                    </div>
                    <div class="rpg-format-pill-bar" role="group" aria-label="Quick Format Switch">
                        ${VIEW_MODE_CATALOG.map(v => `
                            <button type="button" class="rpg-format-seg-btn" data-format-id="${esc(v.id)}" aria-pressed="false" onclick="COS_RPG.setSheetViewMode('${esc(v.id)}')">
                                <span aria-hidden="true">${v.icon}</span>
                                <span>${esc(v.shortLabel)}</span>
                            </button>
                        `).join('')}
                    </div>
                    <div id="rpg-format-list" class="rpg-theme-list">
                        ${VIEW_MODE_CATALOG.map(v => `
                            <button type="button" class="rpg-theme-option rpg-format-option" data-format-id="${esc(v.id)}" aria-pressed="false" onclick="COS_RPG.setSheetViewMode('${esc(v.id)}')">
                                <span class="rpg-theme-opt-left">
                                    <span class="rpg-format-ico" aria-hidden="true">${v.icon}</span>
                                    <span class="rpg-theme-meta">
                                        <span class="rpg-theme-name">${esc(v.name)}</span>
                                        <span class="rpg-theme-desc">${esc(v.desc)}</span>
                                    </span>
                                </span>
                                <span class="rpg-theme-check" aria-hidden="true">✓</span>
                            </button>
                        `).join('')}
                    </div>
                </div>
                <div id="rpg-fab-bubbles" class="rpg-fab-bubbles" role="menu" aria-label="Quick Utility Menu">
                    <a href="index.html" class="rpg-fab-bubble bubble-portal" role="menuitem" title="Back to Campaign Portal">🏰 Portal</a>
                    <button type="button" class="rpg-fab-bubble bubble-reset" role="menuitem" onclick="COS_RPG.toggleFabMenu(false); COS_RPG.resetSheetToOfficialBaseline(false);" title="Undo unsaved changes &amp; restore last ☁️ Sync checkpoint">🔄 Reset</button>
                    <button type="button" class="rpg-fab-bubble bubble-rules" role="menuitem" onclick="COS_RPG.toggleFabMenu(false); COS_RPG.openRulesModal();" title="Open Combat Controls &amp; Table House Rules">❓ Rules</button>
                    <button type="button" id="rpg-fab-format-btn" class="rpg-fab-bubble bubble-format" role="menuitem" onclick="COS_RPG.toggleFormatTray(true)" title="Swap sheet display format between PC (Default), Tablet, and Mobile">🖥️ Format: PC</button>
                    <button type="button" id="rpg-fab-theme-btn" class="rpg-fab-bubble bubble-theme" role="menuitem" onclick="COS_RPG.toggleThemeTray(true)" title="Choose Sheet Color Theme (Obsidian, Midnight, Velvet, Pine Forest, Parchment, System)">🎨 Theme</button>
                    <button type="button" id="rpg-fab-dice-btn" class="rpg-fab-bubble bubble-dice" role="menuitem" onclick="COS_RPG.toggleDiceTray(true)" title="Open Quick Dice Roller &amp; Adv/Dis Modifiers">🎲 Quick Dice</button>
                    <button type="button" id="rpg-fab-trade-btn" class="rpg-fab-bubble bubble-trade" role="menuitem" onclick="COS_RPG.toggleFabMenu(false); COS_RPG.openTradeModal('messages');" title="Open Party Chat, Whispers &amp; Item/Gold Trade">💬 Chat <span id="rpg-fab-trade-badge" class="rpg-badge-count pulse-alert" style="display:none;"></span></button>
                    <button type="button" id="rpg-fab-party-btn" class="rpg-fab-bubble bubble-party" role="menuitemcheckbox" aria-pressed="false" onclick="COS_RPG.togglePartyHud()" title="Toggle Live Teammate HP &amp; Status Row">👥 Live Party</button>
                </div>
                <button type="button" id="rpg-dice-fab-btn" class="rpg-dice-fab" aria-expanded="false" aria-controls="rpg-fab-bubbles" onclick="COS_RPG.toggleFabMenu()" title="Open Quick Menu (Live Party, Chat, Dice, Theme, Format, Rules, Reset &amp; Portal)"><span id="rpg-fab-label">✦ Menu</span> <span id="rpg-fab-alert-dot" class="rpg-fab-dot" style="display:none;"></span></button>
            `;
            document.body.appendChild(fabWrap);
            syncThemeTrayUI();
            syncFormatTrayUI();

            // Light-dismiss floating speed-dial, theme tray, format tray & dice tray on outside click or Escape
            document.addEventListener('click', (e) => {
                const tray = document.getElementById('rpg-dice-tray');
                const themeTray = document.getElementById('rpg-theme-tray');
                const formatTray = document.getElementById('rpg-format-tray');
                const bubbles = document.getElementById('rpg-fab-bubbles');
                const openAny = (tray && tray.classList.contains('is-open')) || (themeTray && themeTray.classList.contains('is-open')) || (formatTray && formatTray.classList.contains('is-open')) || (bubbles && bubbles.classList.contains('is-open'));
                if (!openAny) return;
                if (!fabWrap.contains(e.target)) {
                    toggleDiceTray(false);
                    toggleThemeTray(false);
                    toggleFormatTray(false);
                    toggleFabMenu(false);
                }
            });
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    toggleDiceTray(false);
                    toggleThemeTray(false);
                    toggleFormatTray(false);
                    toggleFabMenu(false);
                }
            });
        }
        syncPartyHudVisibility();
        syncDiceFabBadge();

        renderActionEconomyBar();
        renderStatusStrip();
        setRightColumnTab(hudState.rightTab || 'all');
        applyMobileTabLayout();
        renderHubPanel();
        applySkillsFilter();
        // Initialize HP baseline silently before first diff so boot doesn't spawn a fake float
        prevTrackedHp = parseCurrentVitalsFromDom();
        handleHpUpdateEffects();
        renderPartyMiniHud();
    }

    function startLiveSheetWatcher() {
        // Wrap updateHPUI so any HP decrease/increase triggers floating deltas, Concentration Check, Death Saves & Firebase sync!
        if (typeof window.updateHPUI === 'function' && !window.__origUpdateHPUI) {
            window.__origUpdateHPUI = window.updateHPUI;
            window.updateHPUI = function () {
                window.__origUpdateHPUI();
                handleHpUpdateEffects();
                if (!isCapturingExports) syncHeroStateToFirebase(true);
            };
        }
        // Wrap logRoll to append 1-click Damage / Brutal Crit follow-up & Auto-Concentration Check banners cleanly!
        if (typeof window.logRoll === 'function' && !window.__origLogRoll) {
            window.__origLogRoll = window.logRoll;
            window.logRoll = function (htmlMsg) {
                window.__origLogRoll(htmlMsg);
                const hudBody = document.getElementById('floating-roll-body');
                if (!hudBody) return;
                if (pendingRollFollowup && (Date.now() - pendingRollFollowup.ts < 350)) {
                    const f = pendingRollFollowup;
                    const isNat20 = /NAT 20|CRITICAL/i.test(String(htmlMsg || ''));
                    const wrap = document.createElement('div');
                    wrap.className = 'rpg-hud-followup-wrap';
                    if (isNat20 && typeof f.onCrit === 'function') {
                        wrap.innerHTML = `<button type="button" class="rpg-hud-crit-btn" onclick="COS_RPG.triggerRollFollowup(true)">${esc(f.critLabel || '🔥 ROLL BRUTAL CRIT!')}</button>`;
                    } else if (typeof f.onDamage === 'function') {
                        wrap.innerHTML = `<button type="button" class="rpg-hud-followup-btn" onclick="COS_RPG.triggerRollFollowup(false)">${esc(f.label || '💥 Roll Damage')}</button>`;
                    }
                    if (wrap.innerHTML) hudBody.appendChild(wrap);
                }
                if (pendingConcAlert && (Date.now() - pendingConcAlert.ts < 350)) {
                    const info = pendingConcAlert;
                    pendingConcAlert = null;
                    clearTimeout(pendingConcFallbackTimer);
                    const cDiv = document.createElement('div');
                    cDiv.style.width = '100%';
                    cDiv.innerHTML = buildConcAlertHtml(info);
                    hudBody.appendChild(cDiv);
                }
            };
        }
        // Wrap rollD20 & rollCustomDie so unlocked Adv/Dis auto-resets cleanly after 1 d20 roll
        if (typeof window.rollD20 === 'function' && !window.__origRollD20) {
            window.__origRollD20 = window.rollD20;
            window.rollD20 = function () {
                const res = window.__origRollD20.apply(this, arguments);
                consumeTempRollMode();
                return res;
            };
        }
        if (typeof window.rollCustomDie === 'function' && !window.__origRollCustomDie) {
            window.__origRollCustomDie = window.rollCustomDie;
            window.rollCustomDie = function (sides) {
                const res = window.__origRollCustomDie.apply(this, arguments);
                if (sides === 20) consumeTempRollMode();
                return res;
            };
        }
        if (typeof window.toggleAdvantage === 'function' && !window.__origToggleAdvantage) {
            window.__origToggleAdvantage = window.toggleAdvantage;
            window.toggleAdvantage = function (mode) {
                const res = window.__origToggleAdvantage.apply(this, arguments);
                syncDiceFabBadge();
                return res;
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
        // Option 1 Strict Combat Action Locking (Capture-Phase Guard — ONLY during Active Combat!)
        document.addEventListener('click', (e) => {
            lastAllowedTurnSpend = null;
            if (!isCombatActive()) return;
            const btn = e.target && e.target.closest ? e.target.closest('button, .toggle-btn-card') : null;
            if (!btn) return;
            const slot = getButtonTurnSlot(btn);
            if (!slot) return;
            if (hudState.turn && hudState.turn[slot] === false) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();
                flashSpentTurnPip(slot);
                const labels = {
                    action: '🟢 Action',
                    bonus: '🟠 Bonus Action',
                    reaction: '🟣 Reaction'
                };
                const surgeHint = (slot === 'action' && adapter && adapter.heroId === 'jacomir')
                    ? ' or activate <strong>⚡ Action Surge</strong>'
                    : '';
                if (adapter && adapter.log) {
                    adapter.log(`⛔ <strong>${labels[slot]} Already Used This Turn!</strong> Click the greyed <strong>${labels[slot]}</strong> pip above to refund${surgeHint}.`);
                }
                announceStatus(`${labels[slot]} already used this turn. Click the pip above to refund.`);
                return;
            }
            lastAllowedTurnSpend = { btn, slot, ts: Date.now() };
        }, true);

        // Smart Action Economy Auto-Ticking on Combat Card Buttons + Refresh Speed on Longstrider toggle
        document.addEventListener('click', (e) => {
            const btn = e.target && e.target.closest ? e.target.closest('button, .toggle-btn-card') : null;
            if (btn) {
                const oc = btn.getAttribute('onclick') || '';
                if (isCombatActive()) {
                    if (lastAllowedTurnSpend && lastAllowedTurnSpend.btn === btn && (Date.now() - lastAllowedTurnSpend.ts < 300)) {
                        spendTurnAction(lastAllowedTurnSpend.slot);
                    }
                    setTimeout(syncCombatActionLocks, 25);
                }
                if (/toggleLongstriderBuff|castLongstriderStim/i.test(oc)) {
                    setTimeout(renderActionEconomyBar, 30);
                }
            }
            lastAllowedTurnSpend = null;
            if (!isCapturingExports) syncHeroStateToFirebase(false);
        });
        document.addEventListener('change', () => {
            if (!isCapturingExports) syncHeroStateToFirebase(false);
        });
        setInterval(() => {
            if (!isCapturingExports) syncHeroStateToFirebase(false);
        }, 2500);
    }

    // =========================================================================
    // 📓 CAMPAIGN JOURNAL & ENHANCED PLAYER NOTES WORKSPACE
    // =========================================================================
    const JOURNAL_CATEGORIES = [
        { id: 'all', label: 'All' },
        { id: 'pinned', label: '★ Pinned' },
        { id: 'quest', label: 'Quest' },
        { id: 'npc', label: 'NPC' },
        { id: 'clue', label: 'Clue' },
        { id: 'lore', label: 'Lore' },
        { id: 'loot', label: 'Loot' },
        { id: 'session', label: 'Session' },
        { id: 'general', label: 'General' }
    ];
    const JOURNAL_EDIT_TAGS = JOURNAL_CATEGORIES.filter(c => c.id !== 'all' && c.id !== 'pinned');
    const MAX_JOURNAL_TITLE = 80;
    const MAX_JOURNAL_BODY = 1500;

    let supportsDisplayTransCache;
    function canTransitionDialogDisplay() {
        if (supportsDisplayTransCache !== undefined) return supportsDisplayTransCache;
        if (!window.CSS?.supports?.('transition-behavior', 'allow-discrete') || !document.body) {
            return false;
        }
        const probe = document.createElement('div');
        probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
        document.body.appendChild(probe);
        getComputedStyle(probe).display;
        probe.style.display = 'none';
        supportsDisplayTransCache = getComputedStyle(probe).display === 'block';
        probe.remove();
        return supportsDisplayTransCache;
    }

    function supportsDialogTopLayerExit() {
        return Boolean(window.CSS?.supports?.('overlay', 'auto')) && canTransitionDialogDisplay();
    }

    async function closeDialogTopLayer(dialog) {
        if (!dialog || !dialog.open) return;
        if (!supportsDialogTopLayerExit()) {
            dialog.setAttribute('data-closing', '');
            const animations = typeof dialog.getAnimations === 'function' ? dialog.getAnimations({ subtree: true }) : [];
            if (animations.length > 0) {
                await Promise.race([
                    Promise.allSettled(animations.map(a => a.finished)),
                    new Promise(r => setTimeout(r, 400))
                ]);
            }
            if (!dialog.hasAttribute('data-closing')) return;
            dialog.removeAttribute('data-closing');
        }
        if (dialog.open) dialog.close();
    }

    const journalState = {
        mounted: false,
        mode: 'read', // 'read' | 'edit'
        selectedId: null,
        editingId: null,
        editTag: 'general',
        editPinned: false,
        search: '',
        filter: 'all',
        mobileDetailOpen: false,
        snapshot: null,
        pendingDiscardAction: null,
        confirmDeleteId: null,
        resetArmed: false,
        resetTimer: null
    };

    function getNotesSafe() {
        try {
            const list = typeof window.getStoredNotes === 'function' ? window.getStoredNotes() : [];
            return Array.isArray(list) ? list.map(n => ({ ...n })) : [];
        } catch (e) {
            return [];
        }
    }

    function saveNotesSafe(notes) {
        if (typeof window.saveStoredNotes === 'function') {
            window.saveStoredNotes(notes);
        }
    }

    function getDefaultNotesList() {
        return Array.isArray(adapter?.defaultNotes) ? adapter.defaultNotes : [];
    }

    function isJournalNoteModified(note) {
        if (!note) return false;
        const base = getDefaultNotesList().find(b => b.id === note.id);
        return !base || base.title !== note.title || base.text !== note.text;
    }

    function getCategoryLabel(tagId) {
        const hit = JOURNAL_EDIT_TAGS.find(c => c.id === tagId);
        return hit ? hit.label : 'General';
    }

    function getSortedNotes(notes) {
        return [...notes].sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));
    }

    function getFilteredNotes(notes) {
        const sorted = getSortedNotes(notes);
        const q = (journalState.search || '').trim().toLowerCase();
        return sorted.filter(n => {
            const tag = n.tag || 'general';
            if (journalState.filter === 'pinned' && !n.pinned) return false;
            if (journalState.filter !== 'all' && journalState.filter !== 'pinned' && tag !== journalState.filter) return false;
            if (q) {
                const hay = `${n.title || ''} ${n.text || ''} ${getCategoryLabel(tag)}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }

    function formatNoteRelativeTime(ts) {
        if (!ts || typeof ts !== 'number') return '';
        const diffSec = Math.max(0, Math.floor((Date.now() - ts) / 1000));
        if (diffSec < 60) return 'Just now';
        if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
        if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
        return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    }

    function isJournalEditorDirty() {
        if (journalState.mode !== 'edit' || !journalState.snapshot) return false;
        const tEl = document.getElementById('note-title-input');
        const bEl = document.getElementById('note-body-input');
        if (!tEl || !bEl) return false;
        return (
            tEl.value !== journalState.snapshot.title ||
            bEl.value !== journalState.snapshot.text ||
            journalState.editTag !== journalState.snapshot.tag ||
            journalState.editPinned !== journalState.snapshot.pinned
        );
    }

    function syncJournalModalDismissMode() {
        const modal = document.getElementById('player-notes-modal');
        if (!modal) return;
        modal.setAttribute('closedby', isJournalEditorDirty() ? 'none' : 'any');
    }

    function showJournalDirtyBanner(pendingAction) {
        journalState.pendingDiscardAction = typeof pendingAction === 'function' ? pendingAction : null;
        const banner = document.getElementById('notes-dirty-banner');
        if (banner) banner.classList.remove('is-hidden');
        document.getElementById('notes-keep-edit-btn')?.focus();
    }

    function hideJournalDirtyBanner() {
        journalState.pendingDiscardAction = null;
        const banner = document.getElementById('notes-dirty-banner');
        if (banner) banner.classList.add('is-hidden');
    }

    function guardJournalDirty(action) {
        if (isJournalEditorDirty()) {
            showJournalDirtyBanner(action);
            return false;
        }
        return true;
    }

    function buildFormattedNoteFragment(text, noteId) {
        const frag = document.createDocumentFragment();
        const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
        lines.forEach((rawLine, lineIdx) => {
            const trimmed = rawLine.trim();
            if (!trimmed) {
                const spacer = document.createElement('div');
                spacer.style.height = '4px';
                frag.appendChild(spacer);
                return;
            }
            if (/^(-{3,}|─{3,})$/.test(trimmed)) {
                const hr = document.createElement('hr');
                hr.className = 'note-divider';
                frag.appendChild(hr);
                return;
            }
            const checkMatch = rawLine.match(/^\s*(?:[-*•]\s*)?\[([ xX])\]\s*(.*)$/);
            if (checkMatch) {
                const isDone = checkMatch[1].toLowerCase() === 'x';
                const label = document.createElement('label');
                label.className = `note-check-line${isDone ? ' is-done' : ''}`;
                const cb = document.createElement('input');
                cb.type = 'checkbox';
                cb.checked = isDone;
                cb.dataset.noteId = noteId;
                cb.dataset.lineIdx = String(lineIdx);
                const span = document.createElement('span');
                span.className = 'note-check-text';
                span.textContent = checkMatch[2];
                label.appendChild(cb);
                label.appendChild(span);
                frag.appendChild(label);
                return;
            }
            const bulletMatch = rawLine.match(/^\s*[-*•]\s+(.+)$/);
            if (bulletMatch) {
                const row = document.createElement('div');
                row.className = 'note-bullet-line';
                const glyph = document.createElement('span');
                glyph.className = 'note-bullet-glyph';
                glyph.setAttribute('aria-hidden', 'true');
                glyph.textContent = '•';
                const txt = document.createElement('span');
                txt.textContent = bulletMatch[1];
                row.appendChild(glyph);
                row.appendChild(txt);
                frag.appendChild(row);
                return;
            }
            const p = document.createElement('p');
            p.className = 'note-para';
            p.textContent = rawLine;
            frag.appendChild(p);
        });
        return frag;
    }

    function toggleChecklistLine(noteId, lineIdx) {
        const notes = getNotesSafe();
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        const lines = String(note.text || '').replace(/\r\n/g, '\n').split('\n');
        const line = lines[lineIdx];
        if (typeof line !== 'string') return;
        const m = line.match(/^(\s*(?:[-*•]\s*)?)\[([ xX])\](\s*.*)$/);
        if (!m) return;
        const nextMark = m[2].toLowerCase() === 'x' ? ' ' : 'x';
        lines[lineIdx] = `${m[1]}[${nextMark}]${m[3]}`;
        note.text = lines.join('\n');
        note.updatedAt = Date.now();
        saveNotesSafe(notes);
        renderJournalWorkspace();
        if (!isCapturingExports) syncHeroStateToFirebase(false);
    }

    function togglePinJournalNote(noteId) {
        const notes = getNotesSafe();
        const note = notes.find(n => n.id === noteId);
        if (!note) return;
        note.pinned = !note.pinned;
        saveNotesSafe(notes);
        renderJournalWorkspace();
        if (!isCapturingExports) syncHeroStateToFirebase(false);
    }

    function commitDeleteJournalNote(noteId) {
        const notes = getNotesSafe();
        const idx = notes.findIndex(n => n.id === noteId);
        if (idx === -1) return;
        const removed = notes[idx];
        notes.splice(idx, 1);
        saveNotesSafe(notes);

        if (typeof window.getRemovedNoteTitles === 'function' && typeof window.saveRemovedNoteTitles === 'function') {
            const removedTitles = window.getRemovedNoteTitles();
            if (!removedTitles.includes(removed.title)) {
                removedTitles.push(removed.title);
                window.saveRemovedNoteTitles(removedTitles);
            }
        }

        journalState.confirmDeleteId = null;
        if (journalState.editingId === noteId) {
            journalState.mode = 'read';
            journalState.editingId = null;
            journalState.snapshot = null;
        }
        const remaining = getFilteredNotes(notes);
        journalState.selectedId = remaining[0]?.id || getSortedNotes(notes)[0]?.id || null;
        if (!journalState.selectedId) journalState.mobileDetailOpen = false;
        renderJournalWorkspace();
        syncJournalModalDismissMode();
        if (adapter?.log) {
            adapter.log(`🗑️ <strong>Removed Note:</strong> "${esc(removed.title)}"`);
        }
        if (!isCapturingExports) syncHeroStateToFirebase(false);
    }

    function saveJournalEditorNote() {
        const titleEl = document.getElementById('note-title-input');
        const bodyEl = document.getElementById('note-body-input');
        const errEl = document.getElementById('note-editor-error');
        if (!titleEl || !bodyEl) return;

        const rawTitle = (titleEl.value || '').trim().slice(0, MAX_JOURNAL_TITLE);
        const rawText = (bodyEl.value || '').replace(/\r\n/g, '\n').trim().slice(0, MAX_JOURNAL_BODY);
        if (!rawTitle || !rawText) {
            if (errEl) errEl.textContent = 'Please enter both a note title and some content before saving.';
            if (!rawTitle) titleEl.focus();
            else bodyEl.focus();
            return;
        }

        const notes = getNotesSafe();
        let savedId = journalState.editingId;
        if (savedId) {
            const idx = notes.findIndex(n => n.id === savedId);
            if (idx !== -1) {
                notes[idx] = {
                    ...notes[idx],
                    title: rawTitle,
                    text: rawText,
                    tag: journalState.editTag || 'general',
                    pinned: Boolean(journalState.editPinned),
                    updatedAt: Date.now()
                };
            }
        } else {
            savedId = 'note_' + Date.now();
            notes.unshift({
                id: savedId,
                title: rawTitle,
                text: rawText,
                tag: journalState.editTag || 'general',
                pinned: Boolean(journalState.editPinned),
                updatedAt: Date.now()
            });
            if (typeof window.getRemovedNoteTitles === 'function' && typeof window.saveRemovedNoteTitles === 'function') {
                const cleaned = window.getRemovedNoteTitles().filter(t => t.toLowerCase() !== rawTitle.toLowerCase());
                window.saveRemovedNoteTitles(cleaned);
            }
        }

        saveNotesSafe(notes);
        journalState.mode = 'read';
        journalState.selectedId = savedId;
        journalState.editingId = null;
        journalState.snapshot = null;
        journalState.confirmDeleteId = null;
        journalState.mobileDetailOpen = true;
        hideJournalDirtyBanner();
        renderJournalWorkspace();
        syncJournalModalDismissMode();
        if (adapter?.log) {
            adapter.log(`📓 <strong>Saved Note:</strong> "${esc(rawTitle)}"`);
        }
        if (!isCapturingExports) syncHeroStateToFirebase(false);
    }

    function quickJotNote(rawInput) {
        const cleaned = String(rawInput || '').trim();
        if (!cleaned) return false;
        let title = '';
        let text = cleaned;
        const colonIdx = cleaned.indexOf(':');
        if (colonIdx >= 2 && colonIdx <= 45) {
            const candidateTitle = cleaned.slice(0, colonIdx).trim();
            const candidateBody = cleaned.slice(colonIdx + 1).trim();
            if (candidateTitle && candidateBody) {
                title = candidateTitle;
                text = candidateBody;
            }
        }
        if (!title) {
            if (cleaned.length <= 44) {
                title = cleaned;
            } else {
                const cut = cleaned.slice(0, 44);
                const lastSpace = cut.lastIndexOf(' ');
                title = (lastSpace > 18 ? cut.slice(0, lastSpace) : cut).trim() + '...';
            }
        }
        const notes = getNotesSafe();
        const newNote = {
            id: 'note_' + Date.now(),
            title: title.slice(0, MAX_JOURNAL_TITLE),
            text: text.slice(0, MAX_JOURNAL_BODY),
            tag: 'general',
            pinned: false,
            updatedAt: Date.now()
        };
        notes.unshift(newNote);
        if (typeof window.getRemovedNoteTitles === 'function' && typeof window.saveRemovedNoteTitles === 'function') {
            const cleanedRemoved = window.getRemovedNoteTitles().filter(t => t.toLowerCase() !== newNote.title.toLowerCase());
            window.saveRemovedNoteTitles(cleanedRemoved);
        }
        saveNotesSafe(notes);
        journalState.selectedId = newNote.id;
        renderJournalWorkspace();
        if (adapter?.log) {
            adapter.log(`📓 <strong>Jotted Note:</strong> "${esc(newNote.title)}"`);
        }
        if (!isCapturingExports) syncHeroStateToFirebase(false);
        return true;
    }

    function insertToolbarSnippet(kind) {
        const ta = document.getElementById('note-body-input');
        if (!ta) return;
        const start = typeof ta.selectionStart === 'number' ? ta.selectionStart : ta.value.length;
        const end = typeof ta.selectionEnd === 'number' ? ta.selectionEnd : ta.value.length;
        const before = ta.value.slice(0, start);
        const needsNewline = before.length > 0 && !before.endsWith('\n');
        let snippet = '';
        if (kind === 'bullet') snippet = `${needsNewline ? '\n' : ''}• `;
        else if (kind === 'task') snippet = `${needsNewline ? '\n' : ''}- [ ] `;
        else if (kind === 'divider') snippet = `${needsNewline ? '\n' : ''}---\n`;
        else if (kind === 'time') {
            const now = new Date();
            const hh = String(now.getHours()).padStart(2, '0');
            const mm = String(now.getMinutes()).padStart(2, '0');
            snippet = `[${hh}:${mm}] `;
        }
        const nextVal = (before + snippet + ta.value.slice(end)).slice(0, MAX_JOURNAL_BODY);
        ta.value = nextVal;
        const caret = Math.min(nextVal.length, start + snippet.length);
        ta.focus();
        ta.setSelectionRange(caret, caret);
        updateJournalCharCounter();
        syncJournalModalDismissMode();
    }

    function updateJournalCharCounter() {
        const bodyEl = document.getElementById('note-body-input');
        const counterEl = document.getElementById('note-char-counter');
        if (!bodyEl || !counterEl) return;
        const len = bodyEl.value.length;
        counterEl.textContent = `${len} / ${MAX_JOURNAL_BODY}`;
        counterEl.style.color = len >= MAX_JOURNAL_BODY ? 'var(--accent-red)' : (len >= 1350 ? 'var(--accent-gold)' : 'var(--text-muted)');
    }

    function renderJournalMiniPanel(notes) {
        const miniList = document.getElementById('player-notes-mini-list');
        const countBadge = document.getElementById('player-notes-count-badge');
        if (countBadge) countBadge.textContent = String(notes.length);
        if (!miniList) return;
        const prevScrollTop = miniList.scrollTop;

        const sorted = getSortedNotes(notes);
        if (sorted.length === 0) {
            miniList.innerHTML = `<div style="font-size:0.73rem; color:var(--text-muted); font-style:italic; padding:6px 2px;">No notes saved yet. Jot one below or click + New.</div>`;
            return;
        }
        miniList.innerHTML = sorted.map(n => {
            const tag = n.tag || 'general';
            const isNew = isJournalNoteModified(n);
            const snippet = String(n.text || '').replace(/\s+/g, ' ').trim();
            return `
                <button type="button" class="notes-mini-card${n.pinned ? ' is-pinned' : ''}" data-mini-note-id="${esc(n.id)}" title="Click to open in Campaign Journal">
                    <div class="notes-mini-top">
                        <span class="notes-mini-title-wrap">
                            <span class="notes-cat-dot cat-${esc(tag)}" aria-hidden="true"></span>
                            ${n.pinned ? '<span class="notes-pin-mark" aria-label="Pinned">★</span>' : ''}
                            <span class="notes-mini-title">${esc(n.title)}</span>
                        </span>
                        ${isNew ? '<span class="notes-new-dot">New</span>' : ''}
                        ${tag !== 'general' ? `<span class="notes-cat-tag cat-${esc(tag)}">${esc(getCategoryLabel(tag))}</span>` : ''}
                    </div>
                    <div class="notes-mini-snippet">${esc(snippet)}</div>
                </button>
            `;
        }).join('');
        miniList.scrollTop = prevScrollTop;
    }

    function renderJournalSidebar(notes) {
        const modalCount = document.getElementById('modal-notes-count');
        const filterRow = document.getElementById('notes-filter-pills');
        const listEl = document.getElementById('player-notes-full-list');
        const clearBtn = document.getElementById('notes-search-clear');
        if (modalCount) modalCount.textContent = String(notes.length);
        if (clearBtn) clearBtn.style.display = journalState.search ? 'inline-block' : 'none';

        if (filterRow) {
            filterRow.innerHTML = JOURNAL_CATEGORIES.map(c => {
                const active = journalState.filter === c.id;
                return `<button type="button" class="notes-filter-pill" data-filter-cat="${esc(c.id)}" aria-pressed="${active ? 'true' : 'false'}">${esc(c.label)}</button>`;
            }).join('');
        }

        if (!listEl) return;
        const prevScrollTop = listEl.scrollTop;
        const filtered = getFilteredNotes(notes);
        if (filtered.length === 0) {
            const q = (journalState.search || '').trim();
            listEl.innerHTML = `
                <div class="notes-empty-state">
                    <div>${notes.length === 0 ? 'Your Campaign Journal is empty.' : 'No notes match your search or filter.'}</div>
                    <div style="display:flex; gap:6px; flex-wrap:wrap; justify-content:center;">
                        ${(journalState.search || journalState.filter !== 'all')
                            ? '<button type="button" class="btn-act btn-act-pre" id="notes-clear-filters-btn">Clear Filters</button>'
                            : ''}
                        <button type="button" class="btn-act btn-act-heal" id="notes-empty-create-btn">${q ? `+ Create "${esc(q.slice(0, 26))}"` : '+ New Note'}</button>
                    </div>
                </div>
            `;
            return;
        }

        listEl.innerHTML = filtered.map(n => {
            const tag = n.tag || 'general';
            const isActive = journalState.mode === 'read' && journalState.selectedId === n.id;
            const isNew = isJournalNoteModified(n);
            const snippet = String(n.text || '').replace(/\s+/g, ' ').trim();
            const rel = formatNoteRelativeTime(n.updatedAt);
            return `
                <button type="button" class="notes-list-card${n.pinned ? ' is-pinned' : ''}${isActive ? ' is-active' : ''}" data-sidebar-note-id="${esc(n.id)}">
                    <div class="notes-list-card-head">
                        <span class="notes-mini-title-wrap">
                            <span class="notes-cat-dot cat-${esc(tag)}" aria-hidden="true"></span>
                            ${n.pinned ? '<span class="notes-pin-mark" aria-label="Pinned">★</span>' : ''}
                            <span class="notes-list-card-title">${esc(n.title)}</span>
                        </span>
                        ${isNew ? '<span class="notes-new-dot">New</span>' : ''}
                    </div>
                    <div class="notes-list-card-snippet">${esc(snippet)}</div>
                    <div class="notes-list-card-foot">
                        <span class="notes-cat-tag cat-${esc(tag)}">${esc(getCategoryLabel(tag))}</span>
                        ${rel ? `<span style="font-size:0.64rem; color:var(--text-muted);">${esc(rel)}</span>` : ''}
                    </div>
                </button>
            `;
        }).join('');
        listEl.scrollTop = prevScrollTop;
    }

    function renderJournalDetail(notes) {
        const ws = document.getElementById('notes-journal-workspace');
        const detail = document.getElementById('notes-detail-scroll');
        if (ws) ws.classList.toggle('is-detail-open', Boolean(journalState.mobileDetailOpen));
        if (!detail) return;

        if (journalState.mode === 'edit') {
            const titleVal = journalState.snapshot ? journalState.snapshot.title : '';
            const bodyVal = journalState.snapshot ? journalState.snapshot.text : '';
            const isEdit = Boolean(journalState.editingId);
            detail.innerHTML = `
                <div class="notes-editor-pane">
                    <div id="notes-dirty-banner" class="notes-dirty-banner is-hidden" role="alert">
                        <span id="notes-dirty-msg">You have unsaved edits. Save or discard before leaving.</span>
                        <div style="display:inline-flex; gap:6px; align-items:center;">
                            <button type="button" class="btn-act btn-act-pre" id="notes-keep-edit-btn">Keep Editing</button>
                            <button type="button" class="btn-act btn-act-dmg" id="notes-discard-btn" aria-describedby="notes-dirty-msg">Discard</button>
                        </div>
                    </div>

                    <div class="notes-editor-head">
                        <strong style="font-size:0.86rem; color:var(--accent-gold-bright);">${isEdit ? '✏️ Edit Note' : '+ New Journal Entry'}</strong>
                        <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.74rem; color:var(--text-dim); cursor:pointer;">
                            <input type="checkbox" id="note-pin-checkbox" ${journalState.editPinned ? 'checked' : ''}>
                            <span>★ Pin to top</span>
                        </label>
                    </div>

                    <div>
                        <label for="note-title-input" class="notes-editor-label">Title</label>
                        <input type="text" id="note-title-input" class="notes-title-input" maxlength="${MAX_JOURNAL_TITLE}" placeholder="e.g., Madam Eva's Tarokka Reading, Vallaki Lead..." value="${esc(titleVal)}">
                    </div>

                    <div>
                        <span class="notes-editor-label">Category</span>
                        <div class="notes-cat-picker" id="note-editor-cat-picker">
                            ${JOURNAL_EDIT_TAGS.map(c => `
                                <button type="button" class="notes-filter-pill" data-edit-cat="${esc(c.id)}" aria-pressed="${journalState.editTag === c.id ? 'true' : 'false'}">${esc(c.label)}</button>
                            `).join('')}
                        </div>
                    </div>

                    <div>
                        <label for="note-body-input" class="sr-only">Note Content</label>
                        <div class="notes-toolbar">
                            <div class="notes-toolbar-btns">
                                <button type="button" class="notes-tool-btn" data-insert-tool="bullet">• Bullet</button>
                                <button type="button" class="notes-tool-btn" data-insert-tool="task">☑ Task</button>
                                <button type="button" class="notes-tool-btn" data-insert-tool="divider">— Divider</button>
                                <button type="button" class="notes-tool-btn" data-insert-tool="time">🕒 Time</button>
                            </div>
                            <span id="note-char-counter" style="font-size:0.69rem; font-family:var(--font-num); color:var(--text-muted);">${bodyVal.length} / ${MAX_JOURNAL_BODY}</span>
                        </div>
                        <textarea id="note-body-input" class="notes-body-textarea" maxlength="${MAX_JOURNAL_BODY}" placeholder="Write clues, NPC motives, checklist items (- [ ] ...), or session notes...">${esc(bodyVal)}</textarea>
                    </div>

                    <div id="note-editor-error" class="notes-error-msg" role="alert"></div>

                    <div class="notes-editor-foot">
                        <button type="button" class="btn-act btn-act-pre" id="note-cancel-edit-btn">Cancel</button>
                        <button type="button" class="btn-act btn-act-heal" id="btn-save-note">💾 ${isEdit ? 'Update Note' : 'Save Note'}</button>
                    </div>
                </div>
            `;
            const tEl = document.getElementById('note-title-input');
            const bEl = document.getElementById('note-body-input');
            const pEl = document.getElementById('note-pin-checkbox');
            tEl?.addEventListener('input', () => {
                const errEl = document.getElementById('note-editor-error');
                if (errEl) errEl.textContent = '';
                syncJournalModalDismissMode();
            });
            bEl?.addEventListener('input', () => {
                const errEl = document.getElementById('note-editor-error');
                if (errEl) errEl.textContent = '';
                updateJournalCharCounter();
                syncJournalModalDismissMode();
            });
            pEl?.addEventListener('change', () => {
                journalState.editPinned = Boolean(pEl.checked);
                syncJournalModalDismissMode();
            });
            const shortcutSave = (e) => {
                if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                    e.preventDefault();
                    saveJournalEditorNote();
                }
            };
            tEl?.addEventListener('keydown', shortcutSave);
            bEl?.addEventListener('keydown', shortcutSave);
            updateJournalCharCounter();
            return;
        }

        // Reader Mode
        const sorted = getSortedNotes(notes);
        let activeNote = sorted.find(n => n.id === journalState.selectedId);
        if (!activeNote) {
            const filtered = getFilteredNotes(notes);
            activeNote = filtered[0] || sorted[0] || null;
            journalState.selectedId = activeNote ? activeNote.id : null;
        }

        if (!activeNote) {
            detail.innerHTML = `
                <div class="notes-empty-state" style="margin:auto;">
                    <div style="font-size:0.95rem; color:var(--text-light); font-weight:600;">No Journal Entries Yet</div>
                    <div>Capture NPC names, Barovian leads, quests, or checklists so your party never loses a thread.</div>
                    <button type="button" class="btn-act btn-act-heal" id="notes-detail-new-btn">+ Write First Note</button>
                </div>
            `;
            return;
        }

        const tag = activeNote.tag || 'general';
        const modified = isJournalNoteModified(activeNote);
        const rel = formatNoteRelativeTime(activeNote.updatedAt);
        const confirmingDelete = journalState.confirmDeleteId === activeNote.id;

        detail.innerHTML = `
            <div class="notes-reader-meta">
                <div class="notes-reader-meta-left">
                    <span class="notes-cat-tag cat-${esc(tag)}">${esc(getCategoryLabel(tag))}</span>
                    <span style="font-size:0.7rem; font-weight:600; color:${modified ? 'var(--accent-green)' : 'var(--text-muted)'};">
                        ${modified ? '● Unsynced Edit' : '● Synced'}
                    </span>
                    ${rel ? `<span style="font-size:0.69rem; color:var(--text-muted);">· ${esc(rel)}</span>` : ''}
                </div>
                <div class="notes-reader-actions">
                    <button type="button" class="btn-act btn-act-pre" id="reader-btn-pin" aria-pressed="${activeNote.pinned ? 'true' : 'false'}" style="${activeNote.pinned ? 'border-color:var(--border-gold); color:var(--accent-gold-bright); background:var(--accent-gold-soft);' : ''}">★ ${activeNote.pinned ? 'Pinned' : 'Pin'}</button>
                    <button type="button" class="btn-act btn-act-pre" id="reader-btn-copy">📋 Copy</button>
                    <button type="button" class="btn-act btn-act-pre" id="reader-btn-edit">✏️ Edit</button>
                    <button type="button" class="btn-act btn-act-dmg" id="reader-btn-delete">🗑️ Delete</button>
                </div>
            </div>

            <div class="notes-reader-canvas">
                <div class="notes-reader-title" id="reader-note-title">${esc(activeNote.title)}</div>
                <div class="notes-reader-body" id="reader-note-body"></div>
            </div>

            <div class="notes-confirm-strip${confirmingDelete ? '' : ' is-hidden'}" id="notes-delete-confirm-strip" role="region" aria-label="Confirm note deletion">
                <span>Remove <strong>"${esc(activeNote.title)}"</strong> from your journal?</span>
                <div style="display:inline-flex; gap:6px;">
                    <button type="button" class="btn-act btn-act-pre" id="notes-cancel-del-btn">Keep Note</button>
                    <button type="button" class="btn-act btn-act-dmg" id="notes-confirm-del-btn">Confirm Remove</button>
                </div>
            </div>
        `;

        const bodyContainer = document.getElementById('reader-note-body');
        if (bodyContainer) {
            bodyContainer.appendChild(buildFormattedNoteFragment(activeNote.text, activeNote.id));
        }
    }

    function renderJournalWorkspace() {
        const notes = getNotesSafe();
        renderJournalMiniPanel(notes);
        renderJournalSidebar(notes);
        renderJournalDetail(notes);
    }

    function openJournalEditor(noteId = null, prefillTitle = '') {
        const openWork = () => {
            const modal = document.getElementById('player-notes-modal');
            if (modal) {
                modal.removeAttribute('data-closing');
                if (!modal.open) modal.showModal();
            }
            const notes = getNotesSafe();
            const existing = noteId ? notes.find(n => n.id === noteId) : null;
            journalState.mode = 'edit';
            journalState.editingId = existing ? existing.id : null;
            journalState.selectedId = existing ? existing.id : journalState.selectedId;
            journalState.editTag = existing ? (existing.tag || 'general') : (journalState.filter !== 'all' && journalState.filter !== 'pinned' ? journalState.filter : 'general');
            journalState.editPinned = existing ? Boolean(existing.pinned) : false;
            journalState.confirmDeleteId = null;
            journalState.mobileDetailOpen = true;
            journalState.snapshot = {
                title: existing ? (existing.title || '') : (prefillTitle || ''),
                text: existing ? (existing.text || '') : '',
                tag: journalState.editTag,
                pinned: journalState.editPinned
            };
            renderJournalWorkspace();
            syncJournalModalDismissMode();
            const focusTarget = existing ? document.getElementById('note-body-input') : document.getElementById('note-title-input');
            focusTarget?.focus();
        };

        if (journalState.mode === 'edit' && !guardJournalDirty(openWork)) return;
        openWork();
    }

    function openJournalReader(noteId) {
        const openWork = () => {
            const modal = document.getElementById('player-notes-modal');
            if (modal) {
                modal.removeAttribute('data-closing');
                if (!modal.open) modal.showModal();
            }
            journalState.mode = 'read';
            journalState.editingId = null;
            journalState.snapshot = null;
            journalState.confirmDeleteId = null;
            if (noteId) journalState.selectedId = noteId;
            journalState.mobileDetailOpen = Boolean(noteId);
            renderJournalWorkspace();
            syncJournalModalDismissMode();
        };

        if (journalState.mode === 'edit' && !guardJournalDirty(openWork)) return;
        openWork();
    }

    function closeJournalModal(forceDiscard = false) {
        const modal = document.getElementById('player-notes-modal');
        if (!forceDiscard && !guardJournalDirty(() => closeJournalModal(true))) return;
        journalState.mode = 'read';
        journalState.editingId = null;
        journalState.snapshot = null;
        journalState.confirmDeleteId = null;
        hideJournalDirtyBanner();
        syncJournalModalDismissMode();
        if (modal && modal.open) closeDialogTopLayer(modal);
    }

    function performJournalBaselineReset() {
        const defaults = getDefaultNotesList().map(n => ({ ...n }));
        saveNotesSafe(defaults);
        if (typeof window.saveRemovedNoteTitles === 'function') window.saveRemovedNoteTitles([]);
        journalState.mode = 'read';
        journalState.editingId = null;
        journalState.snapshot = null;
        journalState.confirmDeleteId = null;
        journalState.filter = 'all';
        journalState.search = '';
        journalState.selectedId = defaults[0]?.id || null;
        const searchEl = document.getElementById('notes-search-input');
        if (searchEl) searchEl.value = '';
        renderJournalWorkspace();
        syncJournalModalDismissMode();
        if (adapter?.log) {
            adapter.log(`📓 <strong>Player Notes Reset</strong> to official baseline notes.`);
        }
    }

    function mountPlayerNotesJournal() {
        if (journalState.mounted) return;
        journalState.mounted = true;

        // 1. Upgrade Left-Column Notes Card
        const miniList = document.getElementById('player-notes-mini-list');
        const notesPanel = miniList?.closest('.panel');
        if (notesPanel && !notesPanel.dataset.journalUpgraded) {
            notesPanel.dataset.journalUpgraded = '1';
            notesPanel.id = 'player-notes-panel';
            notesPanel.className = 'panel notes-panel';
            notesPanel.removeAttribute('style');
            notesPanel.innerHTML = `
                <div class="notes-panel-head">
                    <button type="button" class="notes-panel-trigger" id="notes-panel-open-btn" title="Open Campaign Journal">
                        <span>📓 Player Notes</span>
                        <span id="player-notes-count-badge" class="notes-count-pill">0</span>
                    </button>
                    <button type="button" class="notes-quick-add-btn" id="notes-panel-new-btn" title="Write a new structured note">+ New</button>
                </div>
                <div id="player-notes-mini-list" class="notes-mini-list"></div>
                <form id="notes-quick-jot-form" class="notes-quick-jot-form">
                    <label for="notes-quick-jot-input" class="sr-only">Quick jot a note</label>
                    <input type="text" id="notes-quick-jot-input" class="notes-quick-jot-input" maxlength="300" placeholder="Quick jot (Title: Note) &amp; Enter...">
                    <button type="submit" class="notes-quick-jot-btn" title="Save quick note">+</button>
                </form>
            `;

            document.getElementById('notes-panel-open-btn')?.addEventListener('click', () => openJournalReader(null));
            document.getElementById('notes-panel-new-btn')?.addEventListener('click', () => openJournalEditor(null));

            const miniEl = document.getElementById('player-notes-mini-list');
            miniEl?.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-mini-note-id]');
                if (btn) openJournalReader(btn.dataset.miniNoteId);
            });

            const jotForm = document.getElementById('notes-quick-jot-form');
            const jotInput = document.getElementById('notes-quick-jot-input');
            jotInput?.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    if (event.isComposing || event.keyCode === 229) return;
                    jotForm?.requestSubmit();
                }
            });
            jotForm?.addEventListener('submit', (event) => {
                event.preventDefault();
                if (jotInput && quickJotNote(jotInput.value)) {
                    jotInput.value = '';
                }
            });
        }

        // 2. Upgrade #player-notes-modal into Split-Pane Campaign Journal
        const modal = document.getElementById('player-notes-modal');
        if (modal && !modal.dataset.journalUpgraded) {
            modal.dataset.journalUpgraded = '1';
            modal.className = 'sheet-dialog notes-journal-dialog';
            modal.setAttribute('closedby', 'any');
            modal.innerHTML = `
                <div class="modal-card notes-journal-card">
                    <div class="modal-header">
                        <h3 id="player-notes-modal-title">📓 Campaign Journal <span id="modal-notes-count" class="notes-count-pill">0</span></h3>
                        <div class="notes-journal-head-actions">
                            <button type="button" class="btn-act btn-act-heal" id="journal-head-new-btn">+ New Note</button>
                            <button type="button" class="modal-close-btn" id="journal-head-close-btn" aria-label="Close Campaign Journal">✕</button>
                        </div>
                    </div>
                    <div id="notes-journal-workspace" class="notes-journal-workspace">
                        <aside class="notes-sidebar" aria-label="Saved Notes">
                            <div class="notes-sidebar-controls">
                                <div class="notes-search-wrap">
                                    <span aria-hidden="true" style="font-size:0.78rem; color:var(--text-muted);">🔍</span>
                                    <label for="notes-search-input" class="sr-only">Search notes</label>
                                    <input type="search" id="notes-search-input" class="notes-search-input" placeholder="Search titles &amp; notes...">
                                    <button type="button" id="notes-search-clear" class="notes-search-clear" aria-label="Clear search" style="display:none;">✕</button>
                                </div>
                                <div class="notes-filter-pills" id="notes-filter-pills"></div>
                            </div>
                            <div id="player-notes-full-list" class="notes-sidebar-list"></div>
                        </aside>
                        <section class="notes-detail-pane" aria-label="Note Workspace">
                            <button type="button" id="notes-mobile-back-btn" class="btn-act btn-act-pre notes-mobile-back-btn">← Back to Notes</button>
                            <div id="notes-detail-scroll" class="notes-detail-scroll"></div>
                        </section>
                    </div>
                    <div class="notes-modal-foot">
                        <div style="display:inline-flex; align-items:center; gap:6px; flex-wrap:wrap;">
                            <button type="button" class="btn-act btn-act-pre" id="journal-foot-sync-btn" style="color:var(--accent-green); border-color:rgba(94,184,138,0.38);">☁️ Sync to DM</button>
                            <button type="button" class="btn-act btn-act-pre" id="journal-foot-reset-btn" title="Restore baseline session notes">↺ Reset Baseline</button>
                        </div>
                        <div style="display:inline-flex; align-items:center; gap:10px;">
                            <span style="font-size:0.68rem; color:var(--text-muted);">Ctrl+Enter to save · Esc to close</span>
                            <button type="button" class="btn-act btn-act-pre" id="journal-foot-close-btn">Close</button>
                        </div>
                    </div>
                </div>
            `;

            document.getElementById('journal-head-new-btn')?.addEventListener('click', () => openJournalEditor(null));
            document.getElementById('journal-head-close-btn')?.addEventListener('click', () => closeJournalModal(false));
            document.getElementById('journal-foot-close-btn')?.addEventListener('click', () => closeJournalModal(false));
            document.getElementById('journal-foot-sync-btn')?.addEventListener('click', () => pushSyncedCheckpoint(false));

            const resetBtn = document.getElementById('journal-foot-reset-btn');
            resetBtn?.addEventListener('click', () => {
                if (!journalState.resetArmed) {
                    journalState.resetArmed = true;
                    resetBtn.textContent = 'Confirm Reset?';
                    resetBtn.classList.add('btn-act-dmg');
                    clearTimeout(journalState.resetTimer);
                    journalState.resetTimer = setTimeout(() => {
                        journalState.resetArmed = false;
                        resetBtn.textContent = '↺ Reset Baseline';
                        resetBtn.classList.remove('btn-act-dmg');
                    }, 4000);
                } else {
                    clearTimeout(journalState.resetTimer);
                    journalState.resetArmed = false;
                    resetBtn.textContent = '↺ Reset Baseline';
                    resetBtn.classList.remove('btn-act-dmg');
                    performJournalBaselineReset();
                    syncHeroStateToFirebase(false);
                }
            });

            document.getElementById('notes-mobile-back-btn')?.addEventListener('click', () => {
                const goBack = () => {
                    journalState.mode = 'read';
                    journalState.editingId = null;
                    journalState.snapshot = null;
                    journalState.mobileDetailOpen = false;
                    renderJournalWorkspace();
                    syncJournalModalDismissMode();
                };
                if (journalState.mode === 'edit' && !guardJournalDirty(goBack)) return;
                goBack();
            });

            const searchInp = document.getElementById('notes-search-input');
            searchInp?.addEventListener('input', () => {
                journalState.search = searchInp.value;
                renderJournalSidebar(getNotesSafe());
            });
            document.getElementById('notes-search-clear')?.addEventListener('click', () => {
                journalState.search = '';
                if (searchInp) searchInp.value = '';
                renderJournalSidebar(getNotesSafe());
                searchInp?.focus();
            });

            // Sidebar delegation
            document.getElementById('notes-filter-pills')?.addEventListener('click', (e) => {
                const btn = e.target.closest('[data-filter-cat]');
                if (!btn) return;
                journalState.filter = btn.dataset.filterCat;
                renderJournalSidebar(getNotesSafe());
            });

            document.getElementById('player-notes-full-list')?.addEventListener('click', (e) => {
                const card = e.target.closest('[data-sidebar-note-id]');
                if (card) {
                    openJournalReader(card.dataset.sidebarNoteId);
                    return;
                }
                if (e.target.closest('#notes-clear-filters-btn')) {
                    journalState.search = '';
                    journalState.filter = 'all';
                    if (searchInp) searchInp.value = '';
                    renderJournalSidebar(getNotesSafe());
                } else if (e.target.closest('#notes-empty-create-btn')) {
                    openJournalEditor(null, (journalState.search || '').trim().slice(0, MAX_JOURNAL_TITLE));
                }
            });

            // Detail workspace delegation (Reader + Editor)
            const detailScroll = document.getElementById('notes-detail-scroll');
            detailScroll?.addEventListener('click', (e) => {
                const editCatBtn = e.target.closest('[data-edit-cat]');
                if (editCatBtn) {
                    journalState.editTag = editCatBtn.dataset.editCat;
                    detailScroll.querySelectorAll('[data-edit-cat]').forEach(el => {
                        el.setAttribute('aria-pressed', el === editCatBtn ? 'true' : 'false');
                    });
                    syncJournalModalDismissMode();
                    return;
                }
                const toolBtn = e.target.closest('[data-insert-tool]');
                if (toolBtn) {
                    insertToolbarSnippet(toolBtn.dataset.insertTool);
                    return;
                }
                if (e.target.closest('#reader-btn-pin')) {
                    if (journalState.selectedId) togglePinJournalNote(journalState.selectedId);
                } else if (e.target.closest('#reader-btn-edit')) {
                    if (journalState.selectedId) openJournalEditor(journalState.selectedId);
                } else if (e.target.closest('#reader-btn-copy')) {
                    const copyBtn = e.target.closest('#reader-btn-copy');
                    const note = getNotesSafe().find(n => n.id === journalState.selectedId);
                    if (note && navigator.clipboard?.writeText) {
                        navigator.clipboard.writeText(`${note.title}\n\n${note.text}`).then(() => {
                            if (copyBtn) {
                                copyBtn.textContent = '✓ Copied';
                                setTimeout(() => { if (copyBtn.isConnected) copyBtn.textContent = '📋 Copy'; }, 1400);
                            }
                        }).catch(() => {});
                    }
                } else if (e.target.closest('#reader-btn-delete')) {
                    journalState.confirmDeleteId = journalState.selectedId;
                    renderJournalDetail(getNotesSafe());
                } else if (e.target.closest('#notes-cancel-del-btn')) {
                    journalState.confirmDeleteId = null;
                    renderJournalDetail(getNotesSafe());
                } else if (e.target.closest('#notes-confirm-del-btn')) {
                    if (journalState.confirmDeleteId) commitDeleteJournalNote(journalState.confirmDeleteId);
                } else if (e.target.closest('#notes-detail-new-btn')) {
                    openJournalEditor(null);
                } else if (e.target.closest('#btn-save-note')) {
                    saveJournalEditorNote();
                } else if (e.target.closest('#note-cancel-edit-btn')) {
                    const backToRead = () => {
                        journalState.mode = 'read';
                        journalState.editingId = null;
                        journalState.snapshot = null;
                        hideJournalDirtyBanner();
                        renderJournalWorkspace();
                        syncJournalModalDismissMode();
                    };
                    if (!guardJournalDirty(backToRead)) return;
                    backToRead();
                } else if (e.target.closest('#notes-keep-edit-btn')) {
                    hideJournalDirtyBanner();
                    document.getElementById('note-body-input')?.focus();
                } else if (e.target.closest('#notes-discard-btn')) {
                    const pending = journalState.pendingDiscardAction;
                    journalState.mode = 'read';
                    journalState.editingId = null;
                    journalState.snapshot = null;
                    hideJournalDirtyBanner();
                    syncJournalModalDismissMode();
                    if (typeof pending === 'function') pending();
                    else renderJournalWorkspace();
                }
            });

            // Interactive checkboxes inside Reader View
            detailScroll?.addEventListener('change', (e) => {
                const cb = e.target;
                if (cb && cb.matches('input[type="checkbox"][data-note-id][data-line-idx]')) {
                    toggleChecklistLine(cb.dataset.noteId, parseInt(cb.dataset.lineIdx, 10));
                }
            });

            // Intercept Esc / cancel when editor has unsaved changes
            modal.addEventListener('cancel', (event) => {
                if (journalState.mode === 'edit' && isJournalEditorDirty()) {
                    event.preventDefault();
                    showJournalDirtyBanner(() => closeJournalModal(true));
                } else if (!supportsDialogTopLayerExit()) {
                    event.preventDefault();
                    closeDialogTopLayer(modal);
                }
            });

            // Intercept backdrop click when dirty so unsaved edits are protected
            let pressedBackdrop = false;
            modal.addEventListener('pointerdown', (e) => {
                const r = modal.getBoundingClientRect();
                pressedBackdrop = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
            });
            modal.addEventListener('pointerup', (e) => {
                const r = modal.getBoundingClientRect();
                const releasedOutside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
                if (pressedBackdrop && releasedOutside && journalState.mode === 'edit' && isJournalEditorDirty()) {
                    showJournalDirtyBanner(() => closeJournalModal(true));
                }
                pressedBackdrop = false;
            });
        }

        // Override global sheet note hooks cleanly so Firebase restores & shortcuts stay unified
        window.renderPlayerNotes = renderJournalWorkspace;
        window.openPlayerNotesModal = () => openJournalReader(null);
        window.openNoteReader = (id) => openJournalReader(id);
        window.closePlayerNotesModal = () => closeJournalModal(false);
        window.resetPlayerNotes = performJournalBaselineReset;

        renderJournalWorkspace();
    }

    function init(sheetAdapter) {
        adapter = sheetAdapter;
        initThemeListeners();
        injectDialogsAndBanner();
        mountVideoGameHudWidgets();
        mountPlayerNotesJournal();
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
        toggleDmOverride,
        isDmOverrideActive,
        checkItemProficiency,
        getAmmoState,
        getWeaponAmmoStore,
        getHeroWeaponsForAmmo,
        getActiveWeaponAmmoDef,
        getWeaponLastShotDef,
        hasBulletContainerInBag,
        openAmmoLoaderModal,
        selectLoaderAmmo: (idx) => { ammoLoaderState.invIndex = idx; renderAmmoLoaderModal(); },
        selectLoaderWeapon: (wid) => { ammoLoaderState.weaponId = wid; renderAmmoLoaderModal(); },
        stepLoaderQty: (delta) => {
            const loadable = getLoadableAmmoItemsFromBackpack(null);
            const a = loadable.find(it => it.invIndex === ammoLoaderState.invIndex);
            const w = getHeroWeaponsForAmmo(true).find(x => x.id === ammoLoaderState.weaponId);
            const mx = (a && w) ? computeMaxLoadUnits(a, w) : 1;
            const inp = document.getElementById('rpg-loader-qty-inp');
            const cur = inp ? (parseInt(inp.value) || ammoLoaderState.qty || 1) : (ammoLoaderState.qty || 1);
            const n = Math.max(1, Math.min(mx || 1, cur + (parseInt(delta) || 0)));
            ammoLoaderState.qty = n;
            if (inp) inp.value = String(n);
        },
        setLoaderQty: (val, skipInputDom = false) => {
            const loadable = getLoadableAmmoItemsFromBackpack(null);
            const a = loadable.find(it => it.invIndex === ammoLoaderState.invIndex);
            const w = getHeroWeaponsForAmmo(true).find(x => x.id === ammoLoaderState.weaponId);
            const mx = (a && w) ? computeMaxLoadUnits(a, w) : 1;
            const n = Math.max(1, Math.min(mx || 1, parseInt(val) || 1));
            ammoLoaderState.qty = n;
            if (!skipInputDom) {
                const inp = document.getElementById('rpg-loader-qty-inp');
                if (inp) inp.value = String(n);
            }
        },
        confirmLoadSpecialtyAmmo,
        selectWeaponAmmo,
        unloadWeaponAmmo,
        onWeaponReloaded,
        consumeWeaponAmmo,
        buildWeaponAmmoBarHtml,
        refreshAllAmmoDisplays,
        getHeroAllWeapons,
        isLegendaryArtifactWeapon,
        getWeaponSlotSchema,
        getWeaponSlotsMap,
        resolveWeaponIdFromRaw,
        buildWeaponModalActionButtonsHtml,
        getWeaponModsStore,
        getWeaponCoatingStore,
        getWeaponAttachmentInfo,
        getWeaponAttachmentBonuses,
        getWeaponMeleeCoating,
        clearWeaponMeleeCoating,
        getWeaponCombatMods,
        buildWeaponModAndCoatingBadgesHtml,
        openWeaponWorkbench,
        openCoatWeaponModal,
        openAttachmentModal,
        installAttachmentIntoSlot,
        selectWorkbenchSlot: (slotId) => { attachModalState.activeSlotId = slotId; renderAttachmentModal(); },
        selectAttachTargetWeapon: (wid) => { attachModalState.weaponId = wid; attachModalState.activeSlotId = null; renderAttachmentModal(); },
        confirmAttachWeaponMod,
        detachWeaponMod,
        applyRemoteItemUpgrade,
        computeThreadId,
        toggleMsgRecipient,
        selectMsgThread,
        sendWhisperMessage,
        clearWhisperThread,
        clearAllMyWhisperThreads,
        getTotalUnreadMessages,
        getMsgThreads: () => msgThreads,
        rollDiceExpr,
        rollDynamicWeaponAttack,
        rollDynamicWeaponDamage,
        syncHeroStateToFirebase,
        equipItemToSlot,
        unequipSlot,
        toggleMainHandGrip,
        applyLoadoutPreset,
        openSavePresetForm,
        openEditPresetForm,
        closePresetForm,
        onPresetTargetChange,
        pullEquippedIntoPresetEditor,
        togglePresetSlotScope,
        submitPresetEditorForm,
        togglePresetForm: () => {
            if (presetEditor) closePresetForm();
            else openSavePresetForm(lastAppliedPresetId || '__new__');
        },
        saveCurrentAsPreset,
        deletePreset,
        deleteCustomPreset: deletePreset,
        restoreStarterPresets,
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
        unlockRecipeById,
        unlockRecipeByCode,
        setTradeTab: (tab) => {
            tradeActiveTab = tab;
            if (tab === 'messages' && msgActiveThreadId) markThreadRead(msgActiveThreadId);
            renderTradeModal();
        },
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
        lookupSharedItemLore,
        getItemMeta,
        // Video-Game RPG HUD API
        openDirectWhisper,
        openRulesModal,
        openRestModal,
        isCombatActive,
        syncCombatModeLayout,
        syncCombatActionLocks,
        toggleTurnAction,
        spendTurnAction,
        restoreTurnAction,
        resetTurnActions,
        renderActionEconomyBar,
        setRightColumnTab,
        setMobileTab,
        applyMobileTabLayout,
        setConcentration,
        dropConcentration,
        promptManualConcentration,
        triggerConcentrationCheck,
        rollConcentrationSave,
        toggleStatus,
        toggleStatusPicker,
        inspectStatus,
        renderStatusStrip,
        setDeathSavePip,
        rollDeathSave,
        applySkillsFilter,
        toggleSkillsTrainedFilter,
        toggleAdvLock,
        toggleFabMenu,
        togglePartyHud,
        toggleDiceTray,
        toggleThemeTray,
        toggleFormatTray,
        setSheetTheme,
        setSheetViewMode,
        getStoredViewMode,
        syncDiceFabBadge,
        consumeTempRollMode,
        setRollFollowup,
        triggerRollFollowup,
        rollBrutalCrit,
        renderPartyMiniHud,
        renderPublicCombatStrip,
        openPlayerNotesModal: () => openJournalReader(null),
        openNoteEditor: openJournalEditor,
        openNoteReader: openJournalReader
    };
})();
