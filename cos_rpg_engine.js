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

        // --- AMMUNITION PACKS (Match BEFORE weapons so bolts/arrows never parse as ranged weapons!) ---
        {
            match: ['ezmerelda', 'sunburst cartridges', 'sunburst bullets', 'dawn-powder'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sunburst', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1/+1 & +1d6 Radiant Firearm Rounds (Halts Regen)'
        },
        {
            match: ['sunburst arrows', 'morninglord sunburst arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sunburst', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1/+1 & +1d6 Radiant Arrows (Silvered, Halts Regen)'
        },
        {
            match: ['sunburst crossbow bolts', 'sunburst bolts', 'morninglord sunburst bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sunburst', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: '+1/+1 & +1d6 Radiant Bolts (Silvered, Halts Regen)'
        },
        {
            match: ['baba lysaga', '+1 magical sling', '+1 firearm bullets', '+1 bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'plus1', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1 Hit & +1 Magical Firearm/Sling Rounds'
        },
        {
            match: ['incendiary bullets', 'brimstone bullets', 'fire bullets'],
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
            match: ['fire crossbow bolts', 'brimstone fire crossbow bolts', 'fire bolts', 'incendiary bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'incendiary', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: '+1d4 Fire Crossbow Bolts'
        },
        {
            match: ['pale tincture poisoned bullets', 'poisoned bullets', 'poison bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'poison', ammoKind: 'firearm', packSizeDefault: 10 },
            summary: '+1d6 Poison + DC 12 CON Save Bullets'
        },
        {
            match: ['venom arrows', 'poison arrows', 'poisoned arrows', 'nightshade venom arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'poison', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1d6 Poison + DC 12 CON Save Arrows'
        },
        {
            match: ['venom-dipped', 'venom bolts', 'poison bolts', 'poisoned bolts'],
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
            summary: '+1d6 Necrotic (Blocks Healing Until Next Turn)'
        },
        {
            match: ['necrotic arrows', 'shadow-bone necrotic arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'necrotic', ammoKind: 'bow', packSizeDefault: 10 },
            summary: '+1d6 Necrotic Arrows (Blocks Healing)'
        },
        {
            match: ['necrotic crossbow bolts', 'necrotic bolts', 'grave-salt necrotic bolts'],
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
            match: ['silvered crossbow bolts', 'silvered bolts', 'silver bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'silvered', ammoKind: 'crossbow', packSizeDefault: 10 },
            summary: 'Silvered Crossbow Bolts (Bypasses Resist)'
        },
        {
            match: ['sun-ash coated bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'firearm', packSizeDefault: 1 },
            summary: '+1d4 Radiant Coated Firearm Bullets'
        },
        {
            match: ['sun-ash coated arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'bow', packSizeDefault: 1 },
            summary: '+1d4 Radiant Coated Arrows'
        },
        {
            match: ['sun-ash coated crossbow bolts', 'sun-ash coated bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'crossbow', packSizeDefault: 1 },
            summary: '+1d4 Radiant Coated Bolts'
        },
        {
            match: ['oil of sharpness (+3) bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'firearm', packSizeDefault: 1 },
            summary: '+3 Hit / +3 Dmg Coated Firearm Bullets'
        },
        {
            match: ['oil of sharpness (+3) arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'bow', packSizeDefault: 1 },
            summary: '+3 Hit / +3 Dmg Coated Arrows'
        },
        {
            match: ['oil of sharpness (+3) crossbow bolts', 'oil of sharpness (+3) bolts'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'crossbow', packSizeDefault: 1 },
            summary: '+3 Hit / +3 Dmg Coated Crossbow Bolts'
        },
        {
            match: ['wyvern-venom tipped bullets'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'wyvern_venom', ammoKind: 'firearm', packSizeDefault: 1 },
            summary: '+7d6 Poison (DC 15 CON) Bullets'
        },
        {
            match: ['wyvern-venom tipped arrows'],
            category: 'gear',
            slots: [],
            ammoMeta: { ammoId: 'wyvern_venom', ammoKind: 'bow', packSizeDefault: 1 },
            summary: '+7d6 Poison (DC 15 CON) Arrows'
        },
        {
            match: ['wyvern-venom tipped crossbow bolts', 'wyvern-venom tipped bolts'],
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
            match: ['silvered longsword'],
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
            ammoMeta: { ammoId: 'silvered', ammoKind: 'coating', isCoating: true, coatingRounds: 10 },
            useAction: { type: 'utilityLog', verb: 'Applied (Bonus Action)', label: 'Liquid Silver (1h Blade)', effect: 'Coated 1 melee weapon in gleaming silver for 1 hour (Bonus Action) — or click Load in Backpack to coat the first 10 rounds of a loaded weapon (turning them into Silvered rounds!).' },
            summary: 'Bonus Action: Coat Blade (1h) or Top 10 Rounds Silvered'
        },
        {
            match: ['sun-ash'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'sun_ash', ammoKind: 'coating', isCoating: true, coatingRounds: 6 },
            useAction: { type: 'utilityLog', verb: 'Applied (Bonus Action)', label: 'Sun-Ash (+1d4 Rad Blade)', effect: 'Coated 1 melee weapon for +1d4 Radiant damage for 10 minutes (Bonus Action) — or click Load in Backpack to coat the first 6 loaded rounds!' },
            summary: 'Bonus Action: Coat Blade or Top 6 Rounds (+1d4 Rad)'
        },
        {
            match: ['oil of sharpness'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'sharpness', ammoKind: 'coating', isCoating: true, coatingRounds: 5 },
            useAction: { type: 'utilityLog', verb: 'Applied (1 Action)', label: 'Oil of Sharpness (+3 Blade)', effect: 'Coated 1 slashing/piercing melee weapon for +3 Attack & +3 Damage for 1 hour (1 Action in combat / Free pre-combat) — or click Load to coat the first 5 loaded rounds!' },
            summary: '1 Action: Coat Blade or Top 5 Rounds (+3 Hit / +3 Dmg)'
        },
        {
            match: ['wyvern venom'],
            category: 'consumable',
            slots: [],
            quickBelt: true,
            ammoMeta: { ammoId: 'wyvern_venom', ammoKind: 'coating', isCoating: true, coatingRounds: 1 },
            useAction: { type: 'utilityLog', verb: 'Applied (Bonus Action)', label: 'Wyvern Venom (7d6 Blade)', effect: 'Coated 1 melee weapon with assassin Wyvern Venom (Bonus Action; next hit DC 15 CON Save or +7d6 Poison) — or click Load in Backpack to tip front rounds (1 dose = 1 round)!' },
            summary: 'Bonus Action: Coat Blade or 1 Front Round/Dose (7d6 Poison)'
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
            match: ['specialty cartridge rig', 'cartridge rig', 'munitions sling', 'specialty bullet', 'bullet sling', 'ammo rig', 'cartridge case', 'munitions belt'],
            category: 'gear',
            slots: [],
            isBulletContainer: true,
            summary: 'Stores Multiple Specialty Bullet Types (Unlocks Firearm Load)'
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
            id: 'craft_incendiary_bullets',
            unlocked: false,
            unlockCode: 'INCENDIARY-ROUNDS',
            tierHint: 'Gunsmith & Fletcher Munitions',
            name: 'Brimstone Incendiary Bullets (x10)',
            badge: 'x10 • +1d4 Fire',
            desc: 'Swage brimstone sulfur & pitch oil into hollow-point rounds (+1d4 Fire damage on hit; disrupts Troll/Plant regeneration). Learned from Blinsky, Rictavio, or Ezmerelda.',
            ingredients: [
                { keyword: 'sulfur', label: 'Brimstone & Pitch Sulfur', qty: 1 },
                { keyword: ['pine pitch', 'pitch oil', 'lamp oil'], label: 'Pine Pitch & Lamp Oil', qty: 1 }
            ],
            outputRaw: '10x Brimstone Incendiary Bullets (+1d4 Fire)',
            outputMatch: 'incendiary bullets'
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
        },
        {
            id: 'craft_elixir_of_health',
            unlocked: false,
            unlockCode: 'HEART-ELIXIR',
            tierHint: 'Legendary Revival (Amber Temple Secret)',
            name: 'Elixir of Health (Legendary Revival)',
            badge: '50% HP Revive • Heartstone Ritual',
            desc: 'Distill EITHER Strahd\'s Shard of the Heart of Sorrow (K20) OR Morgantha\'s Night Hag Heartstone into a legendary draught that revives within 1 minute of death (50% Max HP, severed limbs knit, -2 penalty until Long Rest). Consumes the sacrificed Heartstone permanently; formula carved behind Amber Temple walls (X30) or whispered by Exethanter / The Abbot.',
            ingredients: [
                { keyword: ['shard of the heart of sorrow', 'sorrow-crystal core', 'sorrow shard', 'heart of sorrow', 'hag heartstone', 'night hag heartstone'], label: 'Heart of Sorrow Shard OR Night Hag Heartstone', qty: 1 },
                { keyword: 'alchemical catalyst', label: 'Alchemical Catalyst', qty: 2 },
                { keyword: 'moonpetal', label: 'Svalich Moonpetal Blossom', qty: 1 },
                { keyword: 'spring water', label: 'Pure Spring Water', qty: 1 }
            ],
            outputRaw: '1x Elixir of Health (Legendary Revival)',
            outputMatch: 'elixir of health'
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
            match: ['silvered greatsword'],
            name: "⚔️ Silvered Greatsword",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Heavy • Two-Handed",
            origin: "Vistani Silver Forge (Tser Pool G — 150 GP / +100 GP Plating) / Barovian Vaults",
            desc: "A massive two-handed steel greatsword whose beveled edges have been alchemically bonded with pure Barovian silver.",
            effect: "• <strong>Damage:</strong> <code>2d6 + STR</code> <strong>Silvered Slashing</strong> (Two-Handed, Heavy).<br>• <strong>Silvered Bane:</strong> Bypasses the nonmagical B/P/S damage resistances and immunities of <strong>Werewolves, Vampire Spawn, Wights, and Night Hags</strong>.<br>• <strong>5.5e Graze Mastery:</strong> If your attack roll misses a creature, you still deal damage equal to your <strong>STR modifier</strong>!"
        },
        {
            match: ['silvered rapier'],
            name: "⚔️ Silvered Rapier",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Finesse • Vex",
            origin: "Amber Temple Treasury (X40), Vistani Forge (125 GP) or Ezmerelda (+1 Variant)",
            desc: "A balanced duelist's thrusting blade laminated in bright mirror-silver down the fuller.",
            effect: "• <strong>Damage:</strong> <code>1d8 + DEX/STR</code> <strong>Silvered Piercing</strong> (Finesse).<br>• <strong>Silvered Bane:</strong> Bypasses the nonmagical B/P/S damage resistances and immunities of Werewolves, Vampire Spawn, and Night Hags.<br>• <strong>5.5e Vex Mastery:</strong> Hitting grants you <strong>Advantage on your next attack roll</strong> against that creature before the end of your next turn!"
        },
        {
            match: ['silvered shortsword'],
            name: "⚔️ Silvered Shortsword",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Finesse • Light • Vex",
            origin: "Ismark's Cellar Armory (E4), Rictavio's Wagon (N5) or Vistani Forge (110 GP)",
            desc: "A quick, close-quarters silver-plated short blade ideal for off-hand pairing or agile strikes.",
            effect: "• <strong>Damage:</strong> <code>1d6 + DEX/STR</code> <strong>Silvered Piercing</strong> (Finesse, Light).<br>• <strong>Silvered Bane:</strong> Bypasses Werewolf, Vampire Spawn &amp; Night Hag nonmagical resistances.<br>• <strong>5.5e Vex Mastery:</strong> Hitting grants <strong>Advantage on your next attack</strong> against that target before the end of your next turn!"
        },
        {
            match: ['silvered handaxe'],
            name: "🪓 Silvered Handaxe",
            category: "UNCOMMON SILVERED MARTIAL WEAPON • Light • Thrown • Vex",
            origin: "Tser Pool Vistani Forge (G — 105 GP) or Arasek Stockyard (N5)",
            desc: "A keen, silver-edged boarding hatchet balanced cleanly for dual-wielding or hurled strikes at fleeing wolves.",
            effect: "• <strong>Damage:</strong> <code>1d6 + STR</code> <strong>Silvered Slashing</strong> (Light, Thrown <code>20/60 ft</code>).<br>• <strong>Silvered Bane &amp; Vex Mastery:</strong> Bypasses Werewolf/Vampire/Hag nonmagical resistances and grants <strong>Advantage on your next attack</strong> after hitting!"
        },
        {
            match: ['silvered mace'],
            name: "🔨 Silvered Mace of the Morninglord",
            category: "UNCOMMON SILVERED SIMPLE WEAPON • Sap Mastery",
            origin: "Barovia Church (E5) or Vistani Silver Forge (105 GP)",
            desc: "A flanged war-mace crowned with sun-stamped silver flanges for crushing undead ribs.",
            effect: "• <strong>Damage:</strong> <code>1d6 + STR</code> <strong>Silvered Bludgeoning</strong> (Simple, 1H).<br>• <strong>Silvered Bane &amp; Sap Mastery:</strong> Bypasses Werewolf/Undead nonmagical resistances and imposes <strong>Disadvantage on the target's next attack roll</strong>!"
        },
        {
            match: ['silver-capped quarterstaff', 'silvered quarterstaff'],
            name: "🪄 Silver-Capped Quarterstaff",
            category: "UNCOMMON SILVERED SIMPLE WEAPON • Versatile • Topple",
            origin: "Vistani Forge (102 GP) or Barovian Scholar Stash",
            desc: "An ironwood mage's staff bound at both ferrules with heavy bands of stamped silver.",
            effect: "• <strong>Damage:</strong> <code>1d6</code> (1H) / <code>1d8</code> (2H) <strong>Silvered Bludgeoning</strong>.<br>• <strong>Silvered Bane &amp; Topple Mastery:</strong> Bypasses nonmagical resistances and forces targets hit to pass a <strong>CON Save or fall Prone</strong>!"
        },
        {
            match: ['silvered firearm', 'silvered bullets'],
            name: "💥 Silvered Firearm & Sling Bullets (x10)",
            category: "UNCOMMON SILVERED AMMUNITION • Vistani Forge (5 GP) / Ismark (E4)",
            origin: "Ismark's Cellar Armory (E4), Tser Pool Vistani (5 GP) & Arasek Stockyard (N5)",
            desc: "Ten heavy spherical rounds cast from melted silver Barovian coins.",
            effect: "• <strong>Ammunition (10 Rounds):</strong> Shots fired bypass Werewolf immunity and Vampire Spawn/Night Hag nonmagical resistance!"
        },
        {
            match: ['silvered arrows'],
            name: "🏹 Silvered Arrows (x10)",
            category: "UNCOMMON SILVERED AMMUNITION • Vistani Forge (G) / Dusk Elves (N9a)",
            origin: "Tser Pool Vistani Caravan (G) & Vallaki Dusk Elf Camp (N9a)",
            desc: "Ten goose-fletched hunting arrows fitted with razor-edged broadheads of beaten silver.",
            effect: "• <strong>Ammunition (10 Arrows):</strong> Hits with bows bypass Werewolf, Vampire Spawn &amp; Hag nonmagical damage resistance."
        },
        {
            match: ['hand crossbow'],
            name: "🏹 Rictavio's Jeweled Hand Crossbow (250 GP)",
            category: "UNIQUE RANGED WEAPON • 1-Handed • Light • Vex",
            origin: "Rictavio's Carnival Wagon Secret Box (Vallaki Area N5)",
            desc: "A compact, silver-inlaid repeating wrist crossbow worth 250 GP to Barovian collectors.",
            effect: "• <strong>Damage:</strong> <code>1d6 + DEX</code> Piercing (<code>30/120 ft</code>, <strong>1-Handed Light</strong> — can be fired off-hand alongside a 1H sword or gun!).<br>• <strong>5.5e Vex Mastery:</strong> Hitting gives Advantage on your next attack!"
        },
        {
            match: ['ezmerelda', 'sunburst cartridges', 'sunburst bullets', 'dawn-powder'],
            name: "Ezmerelda's Sunburst & Silver Cartridges (x10)",
            category: "RARE RADIANT AMMUNITION • Firearms",
            origin: "Ezmerelda's Wagon (V1) or Abbey Barracks (S19)",
            desc: "Brass paper cartridges packed with silver filings and consecrated sunburst quartz.",
            effect: "• <strong>Load Into Specific Firearm:</strong> Grants <strong>+1 Attack &amp; +1 Damage</strong>, deals an extra <strong>+1d6 Radiant</strong> on hit, counts as <strong>Silvered</strong>, and <strong>halts Vampire Regeneration for 1 round</strong>."
        },
        {
            match: ['sunburst arrows', 'morninglord sunburst arrows'],
            name: "Morninglord Sunburst Arrows (x10)",
            category: "RARE RADIANT AMMUNITION • Bows",
            origin: "Shrine of the White Sun (S4) / Ezmerelda (V1)",
            desc: "Ashwood arrows tipped with sun-forged bronze and silvered broadheads.",
            effect: "• <strong>Load Into Bow Quiver:</strong> Grants <strong>+1 Attack &amp; +1 Damage</strong>, deals an extra <strong>+1d6 Radiant</strong> on hit, counts as <strong>Silvered</strong>, and <strong>halts Vampire Regeneration for 1 round</strong>."
        },
        {
            match: ['sunburst crossbow bolts', 'sunburst bolts', 'morninglord sunburst bolts'],
            name: "Morninglord Sunburst Crossbow Bolts (x10)",
            category: "RARE RADIANT AMMUNITION • Crossbows",
            origin: "St. Andral Sanctuary (N1) / Van Richten Stockpile (N5)",
            desc: "Heavy oak bolts winged in white swan vanes and blessed sunburst iron.",
            effect: "• <strong>Load Into Crossbow Quiver:</strong> Grants <strong>+1 Attack &amp; +1 Damage</strong>, deals an extra <strong>+1d6 Radiant</strong> on hit, counts as <strong>Silvered</strong>, and <strong>halts Vampire Regeneration for 1 round</strong>."
        },
        {
            match: ['baba lysaga', '+1 magical sling', '+1 firearm bullets', '+1 bullets'],
            name: "Baba Lysaga's +1 Magical Bullets (x10)",
            category: "UNCOMMON MAGICAL AMMUNITION • Firearms / Slings",
            origin: "Baba Lysaga's Creeping Hut Iron Trunk (Berez U3)",
            desc: "Lead-and-silver slugs etched with microscopic Mother Night runes.",
            effect: "• <strong>Load Into Firearm:</strong> Grants a <strong>+1 bonus to Attack and Damage rolls</strong> and overcomes nonmagical resistances."
        },
        {
            match: ['incendiary bullets', 'brimstone bullets', 'fire bullets'],
            name: "Brimstone Incendiary Bullets (x10)",
            category: "ALCHEMICAL FIRE AMMUNITION • Craftable (INCENDIARY-ROUNDS)",
            origin: "Arasek Stockyard (N5), Blinsky/Petru Forge, or Craftable (1x Sulfur + 1x Pitch Oil)",
            desc: "Hollow-point firearm slugs sealed with yellow brimstone paste that sparks on muzzle flash.",
            effect: "• <strong>Load Into Individual Firearm:</strong> Adds <strong>+1d4 Fire damage</strong> on hit, ignites flammable objects, and disrupts regeneration stopped by flame."
        },
        {
            match: ['fire arrows', 'pitch-tipped fire arrows', 'incendiary arrows'],
            name: "Pitch-Tipped Fire Arrows (x10)",
            category: "ALCHEMICAL FIRE AMMUNITION • Bows",
            origin: "Arasek Stockyard (N5) / Tser Pool Caravan Forge (G)",
            desc: "Barbed broadheads wrapped in oil-soaked pitchcloth.",
            effect: "• <strong>Load Into Bow Quiver:</strong> Adds <strong>+1d4 Fire damage</strong> on hit and ignites flammable webs, thatch, or blight tendrils."
        },
        {
            match: ['fire crossbow bolts', 'brimstone fire crossbow bolts', 'fire bolts', 'incendiary bolts'],
            name: "Brimstone Fire Crossbow Bolts (x10)",
            category: "ALCHEMICAL FIRE AMMUNITION • Crossbows",
            origin: "Arasek Stockyard (N5) / Vallaki Guard Armory",
            desc: "Short steel quarrels collared with striker flint and pine-pitch rings.",
            effect: "• <strong>Load Into Crossbow Quiver:</strong> Adds <strong>+1d4 Fire damage</strong> on hit."
        },
        {
            match: ['pale tincture poisoned bullets', 'poisoned bullets', 'poison bullets'],
            name: "Pale Tincture Poisoned Bullets (x10)",
            category: "TOXIC AMMUNITION • Firearms",
            origin: "Old Bonegrinder (O3), Wachterhaus Cellar, or Arrigal (N9)",
            desc: "Wax-capped bullets housing a slow-acting alchemical toxin inside a hollow tip.",
            effect: "• <strong>Load Into Firearm:</strong> Deals an extra <strong>+1d6 Poison damage</strong> on hit; struck creatures must pass a <strong>DC 12 CON Save or become Poisoned</strong> until the end of their next turn."
        },
        {
            match: ['venom arrows', 'poison arrows', 'poisoned arrows', 'nightshade venom arrows'],
            name: "Nightshade Venom Arrows (x10)",
            category: "TOXIC AMMUNITION • Bows",
            origin: "Svalich Woods Scouts / Old Bonegrinder (O3) / Vistani Camp (N9)",
            desc: "Dark green-fletched arrows grooved along the tip to hold belladonna serum.",
            effect: "• <strong>Load Into Bow Quiver:</strong> Deals an extra <strong>+1d6 Poison damage</strong> on hit; target must pass a <strong>DC 12 CON Save or become Poisoned</strong> until the end of its next turn."
        },
        {
            match: ['venom-dipped', 'venom bolts', 'poison bolts', 'poisoned bolts'],
            name: "Arrigal's Venom-Dipped Crossbow Bolts (x10)",
            category: "TOXIC AMMUNITION • Crossbows",
            origin: "Vallaki Vistani Camp (Arrigal — Area N9)",
            desc: "Blackened iron bolts steeped in serpentine gall by Vistani assassins.",
            effect: "• <strong>Load Into Crossbow Quiver:</strong> Deals an extra <strong>+1d6 Poison damage</strong> on hit; target must pass a <strong>DC 12 CON Save or become Poisoned</strong> until the end of its next turn."
        },
        {
            match: ['necrotic bullets', 'grave-salt necrotic bullets'],
            name: "Grave-Salt Necrotic Bullets (x10)",
            category: "SHADOW AMMUNITION • Firearms",
            origin: "Ruins of Berez (U3) / Amber Temple Vaults (X40)",
            desc: "Charcoal-gray rounds packed with chilled grave salt and ground crypt bone.",
            effect: "• <strong>Load Into Firearm:</strong> Deals an extra <strong>+1d6 Necrotic damage</strong> on hit, and the target <strong>cannot regain Hit Points</strong> until the start of your next turn."
        },
        {
            match: ['necrotic arrows', 'shadow-bone necrotic arrows'],
            name: "Shadow-Bone Necrotic Arrows (x10)",
            category: "SHADOW AMMUNITION • Bows",
            origin: "Dusk Elf Sanctuary / Amber Temple Vaults (X40)",
            desc: "Blackened bone-tipped arrows humming with icy Shadowfell stillness.",
            effect: "• <strong>Load Into Bow Quiver:</strong> Deals an extra <strong>+1d6 Necrotic damage</strong> on hit, and the target <strong>cannot regain Hit Points</strong> until the start of your next turn."
        },
        {
            match: ['necrotic crossbow bolts', 'necrotic bolts', 'grave-salt necrotic bolts'],
            name: "Grave-Salt Necrotic Crossbow Bolts (x10)",
            category: "SHADOW AMMUNITION • Crossbows",
            origin: "Amber Temple Treasury (X40) / Ravenloft Crypts",
            desc: "Cold iron quarrels dusted in grave-salt and preserved lich-ash.",
            effect: "• <strong>Load Into Crossbow Quiver:</strong> Deals an extra <strong>+1d6 Necrotic damage</strong> on hit, and the target <strong>cannot regain Hit Points</strong> until the start of your next turn."
        },
        {
            match: ['oil of sharpness'],
            name: "Oil of Sharpness",
            category: "VERY RARE WEAPON / AMMO COATING • Area U3",
            origin: "Baba Lysaga's Creeping Hut Chest (Berez Area U3)",
            desc: "Clear, gelatinous alchemical oil shimmering with suspended silver diamond-shards.",
            effect: "• <strong>Load Ammo or Coat Blade:</strong> Coat 1 slashing/piercing melee blade OR click <strong>Load</strong> in Backpack to coat up to <strong>5 rounds</strong> in a chosen weapon for <strong>+3 Attack and +3 Damage</strong>!"
        },
        {
            match: ['wyvern venom', 'wyvern-venom'],
            name: "Arrigal's Assassin Wyvern Venom",
            category: "RARE LETHAL VENOM COATING • Area N9",
            origin: "Arrigal's Assassin Belt (Vallaki Vistani Camp Area N9)",
            desc: "Concentrated amber mountain-wyvern venom bottled in slender black glass ampoules.",
            effect: "• <strong>1 Round or Blade per Dose:</strong> Use on a melee weapon OR click <strong>Load</strong> in Backpack to coat individual bullets/arrows/bolts (1 dose = 1 round). Hit forces a <strong>DC 15 CON Save or takes 7d6 Poison damage</strong> (half on success)."
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
            match: ['specialty cartridge rig', 'cartridge rig', 'munitions sling', 'ammo rig', 'cartridge case', 'munitions belt'],
            name: "Partitioned Specialty Cartridge Rig",
            category: "FIREARM STORAGE GEAR • 15 GP (Any Shop)",
            origin: "Bildrath's (E1), Tser Pool Outfitters (G), Arasek Stockyard (N5), or Krezk Supply (S3)",
            desc: "A rugged oiled-leather cross-strap sling fitted with five numbered waterproof brass compartments for keeping volatile specialty ammunition safely separated by type.",
            effect: "• <strong>Unlocks Firearm Specialty Load:</strong> Carrying this container in your Backpack lets you safely carry multiple specialty bullet types (<em>Silvered, Incendiary, Poisoned, Sunburst, Necrotic</em>) and unlocks the <strong>Load</strong> button on your firearms.<br>• <em>(Standard brass clips &amp; speedloaders still use your normal Gunslinger Bandolier).</em>"
        },
        {
            match: ['rictavio\'s silvered crossbow bolts'],
            name: "Rictavio's Silvered Crossbow Bolts (x20)",
            category: "UNCOMMON SILVERED AMMUNITION • Area N5",
            origin: "Rictavio's Carnival Wagon Secret Chest (Vallaki Area N5)",
            desc: "Twenty needle-pointed bolts sheathed in pure sterling silver.",
            effect: "• <strong>Ammunition (20 Bolts):</strong> Click <strong>Load</strong> to load into any Crossbow to fire Silvered shots that bypass Werewolf, Vampire Spawn &amp; Night Hag nonmagical damage resistances."
        },
        {
            match: ['silvered crossbow bolts', 'silver bolts'],
            name: "Silvered Crossbow Bolts (x10)",
            category: "UNCOMMON SILVERED AMMUNITION • Vistani Forge (G) / Arasek (N5)",
            origin: "Tser Pool Vistani Silver Forge (G) & Arasek Stockyard (Vallaki N5)",
            desc: "Ten crisp-fletched crossbow bolts plated cleanly in hammered Barovian silver.",
            effect: "• <strong>Ammunition (10 Bolts):</strong> Click <strong>Load</strong> to load into a specific Crossbow to bypass Werewolf, Vampire Spawn &amp; Night Hag resistances."
        },
        {
            match: ['cloak of protection'],
            name: "🧥 Cloak of Protection",
            category: "UNCOMMON WONDROUS CLOAK • Attunement Required",
            origin: "Barovian Vaults / Death House Reliquary (M34)",
            desc: "A heavy, silver-hemmed charcoal wool mantle stitched with abjuration threads.",
            effect: "• <strong>Protective Ward:</strong> Grants <strong>+1 bonus to Armor Class</strong> and <strong>+1 bonus to ALL Saving Throws</strong> while attuned."
        },
        {
            match: ['gold statuette of saint markovia', 'gold statuette'],
            name: "🗿 Gold Statuette of Saint Markovia (250 GP • +1 Saves)",
            category: "UNCOMMON HOLY RELIC • Abbey of St. Markovia (S13)",
            origin: "Abbey of Saint Markovia Altar Reliquary (Krezk Area S13)",
            desc: "A fist-sized solid gold effigy of the sainted priestess Markovia (No Attunement required).",
            effect: "• <strong>Saint's Blessing:</strong> Any Good-aligned creature carrying this statuette gains a <strong>+1 bonus to ALL Saving Throws</strong>!"
        },
        {
            match: ['shard of the heart of sorrow', 'sorrow-crystal core', 'sorrow shard', 'heart of sorrow'],
            name: "Shard of the Heart of Sorrow (Unique Sorrow-Crystal Core)",
            category: "LEGENDARY UNIQUE CRAFTING RELIC • Strict 1-Per-Campaign Opportunity",
            origin: "Castle Ravenloft North Tower (Recovered ONLY Upon Shattering K20 Heart of Sorrow)",
            desc: "A cold, fist-sized prism of Khazan's blood-forged ruby crystal recovered intact from the shattered ruins of Strahd's 50-HP Heart of Sorrow (Area K20) — entirely distinct from Morgantha's Night Hag Heartstone and the Winery Life-Gems.",
            effect: "• <strong>Single Campaign Opportunity (1 Only):</strong> Only ONE intact Sorrow-Crystal core can ever be salvaged before the rest dissolves into crimson mist.<br>• <strong>Legendary Recipe Reagent (<code>HEART-ELIXIR</code>):</strong> Combine <code>1x Shard of the Heart of Sorrow</code> with <code>2x Alchemical Catalyst + 1x Svalich Moonpetal Blossom + 1x Pure Spring Water</code> to distill Barovia's sole crafted <strong>Elixir of Health (Legendary Revival)</strong>. Crafting consumes this crystal permanently.",
            isCraftableReagent: true
        },
        {
            match: ['elixir of health', 'elixir of life'],
            name: "Elixir of Health (Legendary Revival)",
            category: "LEGENDARY REVIVAL POTION • Extra Rare (5,000 GP / 15,000 GP Royal Market)",
            origin: "Martikov Secret Loft (Area N2q) OR Heartstone Transmutation Ritual (HEART-ELIXIR)",
            desc: "A glowing golden-crimson draught radiating uncorrupted vitality and divine restoration—an ultra-rare heirloom either hidden in the Martikov loft (N2q) or distilled once via ancient Barovian alchemy.",
            effect: "• <strong>Action (Within 1 Minute of Death):</strong> Administer to a creature that has died within the last minute. The creature returns to life with <strong>Hit Points equal to half of its maximum HP (50%)</strong>, and any <strong>severed limbs are knit back together</strong>!<br>• <strong>Aftermath Penalty:</strong> The revived creature suffers a <strong>-2 penalty to all attack rolls, saving throws, and ability checks</strong> until finishing a Long Rest.<br>• <strong>Extra Rare &amp; Expensive (<code>5,000 GP</code> Base / <code>15,000 GP</code> Royal Market):</strong> Cannot be brewed from ordinary herbs—requires ancient secrets and a sacrificed Heartstone artifact."
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
            name: "Vial of Liquid Silver Coating",
            category: "CRAFTED TACTICAL COATING • Unlock Code: SILVER-COAT",
            origin: "Crafted (1x Powdered Silver Dust + 1x Pine Pitch & Lamp Oil)",
            desc: "A swirling glass phial of pure silver filings suspended in amber pine resin oil.",
            effect: "• <strong>Bonus Action / Prep (1-Hour Duration):</strong> Coat <strong>1 melee weapon</strong> or load <strong>+10 Silvered Rounds/Arrows/Bolts</strong> into your ranged reserve. Coated strikes count as <strong>Silvered</strong>, bypassing the nonmagical B/P/S resistances &amp; immunities of Vampire Spawn, Werewolves, Wights, and Night Hags!"
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
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Potion of Greater Healing</strong> (<code>GREATER-HEAL</code>), <strong>Phosphor Flash-Bomb</strong> (<code>PHOSPHOR</code>), <strong>Potion of Superior Healing</strong> (<code>MOONPETAL</code>), and <strong>Elixir of Health</strong> (<code>HEART-ELIXIR</code>).",
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
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Potion of Superior Healing</strong> (<code>MOONPETAL</code>), <strong>Sun-Ash Repellent Balm</strong> (<code>SUN-ASH</code>), and <strong>Elixir of Health</strong> (<code>HEART-ELIXIR</code>).",
            isCraftableReagent: true
        },
        {
            match: ['spring water', 'mountain spring water'],
            name: "💧 Pure Mountain Spring Water (Unblessed Reagent)",
            category: "COMMON FORAGE MATERIAL • DC 10 Survival / 2 SP",
            origin: "Tser Falls, Luna River & White Sun Spring",
            desc: "Crystal-clear glacier melt free of Barovia's bog rot.",
            effect: "• <strong>Crafting Ingredient:</strong> Used in <strong>Morninglord Holy Water</strong> (<code>MORNINGLORD</code>), <strong>Sun-Ash Balm</strong> (<code>SUN-ASH</code>), and <strong>Elixir of Health</strong> (<code>HEART-ELIXIR</code>).",
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
    let presetEditor = null; // null | { mode: 'save' | 'edit', targetId: '__new__' | string, draftName: string, slotDrafts: Object, errorMsg: string }
    let lastAppliedPresetId = null;
    let dmRemoteGearOverride = { enabled: false, note: '' };

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
                firearm: 'Silvered Firearm & Sling Bullets',
                bow: 'Silvered Arrows',
                crossbow: 'Silvered Crossbow Bolts'
            }
        },
        incendiary: {
            id: 'incendiary',
            shortName: 'Incendiary',
            fullName: 'Brimstone Incendiary',
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
                firearm: 'Brimstone Incendiary Bullets',
                bow: 'Pitch-Tipped Fire Arrows',
                crossbow: 'Brimstone Fire Crossbow Bolts'
            }
        },
        poison: {
            id: 'poison',
            shortName: 'Venom',
            fullName: 'Nightshade / Pale Tincture Venom',
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
                firearm: 'Pale Tincture Poisoned Bullets',
                bow: 'Nightshade Venom Arrows',
                crossbow: "Arrigal's Venom-Dipped Crossbow Bolts"
            }
        },
        wyvern_venom: {
            id: 'wyvern_venom',
            shortName: 'Wyvern Venom',
            fullName: "Arrigal's Assassin Wyvern Venom",
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
                firearm: 'Wyvern-Venom Tipped Bullets',
                bow: 'Wyvern-Venom Tipped Arrows',
                crossbow: 'Wyvern-Venom Tipped Crossbow Bolts'
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
                firearm: "Ezmerelda's Sunburst & Silver Alchemical Cartridges",
                bow: 'Morninglord Sunburst Arrows',
                crossbow: 'Morninglord Sunburst Crossbow Bolts'
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
                firearm: 'Sun-Ash Coated Bullets',
                bow: 'Sun-Ash Coated Arrows',
                crossbow: 'Sun-Ash Coated Crossbow Bolts'
            }
        },
        necrotic: {
            id: 'necrotic',
            shortName: 'Necrotic',
            fullName: 'Grave-Salt Necrotic',
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
                firearm: 'Grave-Salt Necrotic Bullets',
                bow: 'Shadow-Bone Necrotic Arrows',
                crossbow: 'Grave-Salt Necrotic Crossbow Bolts'
            }
        },
        plus1: {
            id: 'plus1',
            shortName: '+1 Arcane',
            fullName: "Baba Lysaga's +1 Round",
            badge: '+1 Hit / +1 Dmg',
            accent: 'magic',
            atkBonus: 1,
            dmgBonus: 1,
            extraDice: null,
            extraType: null,
            isSilvered: false,
            haltsRegen: false,
            blocksHealing: false,
            saveNote: null,
            note: 'Mother Night rune-etched bullet: +1 Attack & +1 Magical Damage.',
            packNames: {
                firearm: "Baba Lysaga's +1 Magical Sling / Firearm Bullets"
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
            haltsRegen: false,
            blocksHealing: false,
            saveNote: null,
            note: 'Ultra-rare Oil of Sharpness coating: +3 Attack & +3 Magical Damage.',
            packNames: {
                firearm: 'Oil of Sharpness (+3) Bullets',
                bow: 'Oil of Sharpness (+3) Arrows',
                crossbow: 'Oil of Sharpness (+3) Crossbow Bolts'
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
                coatingRounds: am.coatingRounds || 1,
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
            ? `<button type="button" class="rpg-ammo-act-btn is-load" disabled title="Locked — Buy a Partitioned Specialty Cartridge Rig (15 GP in any shop) to carry &amp; load specialty rounds">${hasLoaded ? 'Swap / Load' : 'Load'}</button>`
            : `<button type="button" class="rpg-ammo-act-btn is-load" onclick="COS_RPG.openAmmoLoaderModal({ targetWeaponId: decodeURIComponent('${encArg(weaponId)}') })">${hasLoaded ? 'Swap / Load' : 'Load'}</button>`;

        const hintParts = [];
        if (activeDef) hintParts.push(esc(activeDef.note));
        if (stdLocked) hintParts.push('Coated rounds fire first before Standard ammo underneath.');
        if (containerLocked) hintParts.push('Load Locked — Carry a Partitioned Specialty Cartridge Rig (15 GP in any shop) to store &amp; load special rounds.');

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

    function getActionEconomyNote(ammoItem, weaponMeta) {
        if (!ammoItem) return 'Bonus Action in combat (Free pre-combat)';
        if (ammoItem.ammoId === 'sharpness' && ammoItem.isCoating) {
            return '1 Full Action in combat (Free pre-combat)';
        }
        if (ammoItem.isCoating) {
            return 'Bonus Action in combat (Free pre-combat)';
        }
        if (weaponMeta && (weaponMeta.kind === 'bow' || weaponMeta.kind === 'crossbow')) {
            return 'Bonus Action to ready quiver / Free per Attack';
        }
        return 'Bonus Action to load into firearm (Free pre-combat)';
    }

    function getWeaponCoatingCeiling(ammoItem, weaponMeta) {
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
        if ((ammoItem.ammoKind === 'firearm' || weaponMeta.kind === 'firearm') && !hasBulletContainerInBag()) {
            return 0;
        }
        const freeCap = getWeaponCoatingCeiling(ammoItem, weaponMeta);
        if (freeCap <= 0) return 0;
        if (ammoItem.isCoating && ammoItem.coatingRounds > 1) {
            return Math.min(ammoItem.unitCount, 1);
        }
        return Math.min(ammoItem.unitCount, freeCap);
    }

    function openAmmoLoaderModal({ invIndex = null, targetWeaponId = null } = {}) {
        if (!adapter) return;
        const weapons = getHeroWeaponsForAmmo(true);
        const targetWeapon = targetWeaponId ? weapons.find(w => w.id === targetWeaponId) : null;
        if (targetWeapon && targetWeapon.kind === 'firearm' && !hasBulletContainerInBag()) {
            adapter.log(`<strong>Firearm Load Locked:</strong> Carry a <strong>Partitioned Specialty Cartridge Rig</strong> (15 GP in any shop) in your Backpack first.`);
            return;
        }
        if (invIndex !== null && invIndex !== undefined) {
            const rawInv = adapter.getItems()[invIndex];
            const invMeta = rawInv ? getItemMeta(rawInv) : null;
            if (invMeta && invMeta.ammoMeta && invMeta.ammoMeta.ammoKind === 'firearm' && !hasBulletContainerInBag()) {
                adapter.log(`<strong>Firearm Load Locked:</strong> Buy a <strong>Partitioned Specialty Cartridge Rig</strong> (15 GP in any shop) to carry and load special firearm rounds.`);
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

        let chosenWeapon = targetWeapon || null;
        if (!chosenWeapon && chosenInv) {
            const compat = weapons.filter(w => chosenInv.isCoating || w.kind === chosenInv.ammoKind);
            chosenWeapon = compat.find(w => computeMaxLoadUnits(chosenInv, w) > 0) || compat[0] || null;
        }
        if (!chosenWeapon && weapons.length > 0) chosenWeapon = weapons[0];

        const maxQty = (chosenInv && chosenWeapon) ? computeMaxLoadUnits(chosenInv, chosenWeapon) : 0;
        let defQty = 1;
        if (chosenInv && maxQty > 0) {
            if (chosenInv.isCoating && chosenInv.coatingRounds > 1) defQty = 1;
            else defQty = Math.min(maxQty, chosenWeapon && chosenWeapon.maxCap ? chosenWeapon.maxCap : Math.min(maxQty, 10));
        }

        ammoLoaderState = {
            invIndex: chosenInv ? chosenInv.invIndex : null,
            weaponId: chosenWeapon ? chosenWeapon.id : null,
            qty: Math.max(1, defQty || 1),
            lockedFromInv: invIndex !== null && invIndex !== undefined
        };

        renderAmmoLoaderModal();
        if (!dlg.open) dlg.showModal();
    }

    function renderAmmoLoaderModal() {
        const body = document.getElementById('rpg-ammo-loader-body');
        const confirmBtn = document.getElementById('rpg-ammo-loader-confirm');
        if (!body) return;

        const weapons = getHeroWeaponsForAmmo(true);
        const curWeapon = weapons.find(w => w.id === ammoLoaderState.weaponId) || null;
        const loadable = getLoadableAmmoItemsFromBackpack(null);
        const curAmmo = loadable.find(it => it.invIndex === ammoLoaderState.invIndex) || null;

        const compatAmmo = curWeapon && !ammoLoaderState.lockedFromInv
            ? loadable.filter(it => it.isCoating || it.ammoKind === curWeapon.kind)
            : loadable;
        const activeAmmo = curAmmo && compatAmmo.some(a => a.invIndex === curAmmo.invIndex)
            ? curAmmo
            : (compatAmmo[0] || null);
        ammoLoaderState.invIndex = activeAmmo ? activeAmmo.invIndex : null;

        const compatWeapons = activeAmmo
            ? weapons.filter(w => activeAmmo.isCoating || w.kind === activeAmmo.ammoKind)
            : weapons;
        const activeWeapon = curWeapon && compatWeapons.some(w => w.id === curWeapon.id)
            ? curWeapon
            : (compatWeapons[0] || null);
        ammoLoaderState.weaponId = activeWeapon ? activeWeapon.id : null;

        const maxUnits = (activeAmmo && activeWeapon) ? computeMaxLoadUnits(activeAmmo, activeWeapon) : 0;
        const safeQty = maxUnits > 0 ? Math.max(1, Math.min(maxUnits, parseInt(ammoLoaderState.qty) || 1)) : 0;
        ammoLoaderState.qty = safeQty;

        const ammoHtml = compatAmmo.length > 0
            ? `<div class="rpg-loader-choice-grid">${compatAmmo.map(a => {
                const isSel = activeAmmo && a.invIndex === activeAmmo.invIndex;
                const stockLabel = a.isCoating
                    ? (a.coatingRounds > 1 ? `${a.unitCount} vial (coats up to ${a.coatingRounds})` : `${a.unitCount} dose (1 round/dose)`)
                    : `${a.unitCount} rounds left`;
                return `<button type="button" class="rpg-loader-choice ${isSel ? 'is-selected' : ''}" onclick="COS_RPG.selectLoaderAmmo(${a.invIndex})">
                    <span><strong>${esc(a.label)}</strong><br><small style="color:#94a3b8;">${esc(a.ammoDef.badge)}</small></span>
                    <span class="rpg-loader-cap">${esc(stockLabel)}</span>
                </button>`;
            }).join('')}</div>`
            : `<div style="font-size:0.74rem; color:#94a3b8; font-style:italic; padding:4px 0;">No compatible specialty ammunition or coatings found in your Backpack.</div>`;

        const wpnHtml = compatWeapons.length > 0
            ? `<div class="rpg-loader-choice-grid">${compatWeapons.map(w => {
                const entry = getWeaponAmmoEntry(w.id);
                const chamberInfo = (adapter && typeof adapter.getWeaponCurrentChamber === 'function')
                    ? adapter.getWeaponCurrentChamber(w.id)
                    : null;
                const isCoatingEmpty = Boolean(activeAmmo && activeAmmo.isCoating && chamberInfo && chamberInfo.cur <= 0);
                const needsContainer = (w.kind === 'firearm' && !hasBulletContainerInBag());
                const isFullSame = Boolean(activeAmmo && entry.loadedId === activeAmmo.ammoId && computeMaxLoadUnits(activeAmmo, w) <= 0);
                const isDisabled = needsContainer || isCoatingEmpty || isFullSame;
                const isSel = activeWeapon && w.id === activeWeapon.id;
                let capText = w.maxCap ? `Max ${w.maxCap} cap` : 'Quiver Ready';
                if (needsContainer) {
                    capText = 'Locked (Need Cartridge Rig)';
                } else if (entry.loadedId && entry.count > 0 && AMMO_CATALOG[entry.loadedId]) {
                    const ed = AMMO_CATALOG[entry.loadedId];
                    capText = `${ed.shortName}: ${entry.count}${w.maxCap ? '/' + w.maxCap : ''}${activeAmmo && activeAmmo.ammoId !== entry.loadedId ? ' (Swaps to Bag)' : ''}`;
                } else if (chamberInfo) {
                    capText = `Chamber: ${chamberInfo.cur}/${chamberInfo.max}`;
                }
                const disabledTitle = needsContainer
                    ? 'Buy a Partitioned Specialty Cartridge Rig (15 GP in any shop) first'
                    : (isCoatingEmpty ? 'Chamber empty — Reload standard bullets first before coating' : 'Capacity full');
                return `<button type="button" class="rpg-loader-choice ${isSel ? 'is-selected' : ''}" ${isDisabled ? `disabled title="${disabledTitle}"` : ''} onclick="COS_RPG.selectLoaderWeapon(decodeURIComponent('${encArg(w.id)}'))">
                    <span><strong>${esc(w.label)}</strong><br><small style="color:#94a3b8;">${esc(w.kind.toUpperCase())}</small></span>
                    <span class="rpg-loader-cap">${esc(needsContainer ? 'Need Cartridge Rig' : (isCoatingEmpty ? 'Empty Chamber (Reload First)' : capText))}</span>
                </button>`;
            }).join('')}</div>`
            : `<div style="font-size:0.74rem; color:#fca5a5;">No compatible weapon available for this ammunition type.</div>`;

        let qtyBlockHtml = '';
        if (activeAmmo && activeWeapon && maxUnits > 0) {
            const wEntry = getWeaponAmmoEntry(activeWeapon.id);
            const swappingOther = wEntry.loadedId && wEntry.count > 0 && wEntry.loadedId !== activeAmmo.ammoId;
            const prevDef = swappingOther ? AMMO_CATALOG[wEntry.loadedId] : null;
            const swapNote = swappingOther && prevDef
                ? `<div style="color:#93c5fd; font-size:0.7rem; margin-top:4px;">Loading ${esc(activeAmmo.ammoDef.shortName)} will automatically return your <strong>${wEntry.count}x ${esc(prevDef.shortName)}</strong> rounds back to Backpack (1 specialty type per weapon).</div>`
                : '';

            const coatCeil = getWeaponCoatingCeiling(activeAmmo, activeWeapon);
            const actionTxt = getActionEconomyNote(activeAmmo, activeWeapon);
            if (activeAmmo.isCoating && activeAmmo.coatingRounds > 1) {
                const coatedCount = Math.min(activeAmmo.coatingRounds, coatCeil);
                qtyBlockHtml = `
                    <div class="rpg-loader-section">
                        <div class="rpg-loader-label">Vial Coating Effect &bull; <span style="color:#fde68a;">${esc(actionTxt)}</span></div>
                        <div style="font-size:0.74rem; color:#e2e8f0; line-height:1.4;">
                            Consumes <strong>1 vial</strong> to coat the first <strong>${coatedCount} round${coatedCount === 1 ? '' : 's'}</strong> inside <strong>${esc(activeWeapon.label)}</strong>. Those front rounds become <strong>${esc(activeAmmo.ammoDef.shortName)}</strong> and fire first (cannot switch to Standard until fired, Unloaded, or Reloaded back into Backpack).
                            ${swapNote}
                        </div>
                    </div>
                `;
            } else {
                const isDose = activeAmmo.isCoating && activeAmmo.coatingRounds === 1;
                const quickPills = [1, 3, 6].filter(n => n < maxUnits).map(n =>
                    `<button type="button" class="rpg-ammo-act-btn" onclick="COS_RPG.setLoaderQty(${n})">${n}</button>`
                ).join('');
                qtyBlockHtml = `
                    <div class="rpg-loader-section">
                        <div class="rpg-loader-label">Quantity (${isDose ? '1 coated round per dose' : '1..Max'}) &bull; <span style="color:#fde68a;">${esc(actionTxt)}</span></div>
                        <div class="rpg-loader-qty-row">
                            <button type="button" class="rpg-ammo-act-btn" onclick="COS_RPG.setLoaderQty(${Math.max(1, safeQty - 1)})">-</button>
                            <input type="number" id="rpg-loader-qty-inp" class="rpg-loader-qty-input" min="1" max="${maxUnits}" value="${safeQty}" oninput="COS_RPG.setLoaderQty(this.value, true)">
                            <button type="button" class="rpg-ammo-act-btn" onclick="COS_RPG.setLoaderQty(${Math.min(maxUnits, safeQty + 1)})">+</button>
                            ${quickPills}
                            <button type="button" class="rpg-ammo-act-btn is-load" onclick="COS_RPG.setLoaderQty(${maxUnits})">Max (${maxUnits})</button>
                        </div>
                        ${isDose ? '<div style="font-size:0.7rem; color:#cbd5e1; margin-top:4px;">Coated front rounds fire first and return to Backpack as coated rounds if unloaded/reloaded.</div>' : ''}
                        ${swapNote}
                    </div>
                `;
            }
        }

        body.innerHTML = `
            <div class="rpg-loader-section">
                <div class="rpg-loader-label">1. Select Ammunition / Coating</div>
                ${ammoHtml}
            </div>
            <div class="rpg-loader-section">
                <div class="rpg-loader-label">2. Select Target Weapon (1 Specialty Type Max)</div>
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
        const weapons = getHeroWeaponsForAmmo(true);
        const weaponMeta = weapons.find(w => w.id === ammoLoaderState.weaponId);
        if (!ammoItem || !weaponMeta) return;

        if ((ammoItem.ammoKind === 'firearm' || weaponMeta.kind === 'firearm') && !hasBulletContainerInBag()) {
            adapter.log(`<strong>Firearm Load Locked:</strong> Carry a <strong>Partitioned Specialty Cartridge Rig</strong> (15 GP in any shop) in your Backpack first.`);
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
            roundsToAdd = Math.min(ammoItem.coatingRounds * unitsConsumed, coatCeil);
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
        return items.find(r => normKey(r) === lower)
            || items.find(r => r.toLowerCase().includes(lower))
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
            dice = '2d6'; dmgType = low.includes('silver') ? 'Silvered Slashing' : 'Slashing';
        } else if (low.includes('longsword') || low.includes('battleaxe') || low.includes('treebane')) {
            dice = '1d8'; dmgType = low.includes('silver') ? 'Silvered Slashing' : 'Slashing';
        } else if (low.includes('hand crossbow')) {
            dice = '1d6'; dmgType = 'Piercing';
        } else if (low.includes('heavy crossbow')) {
            dice = '1d10'; dmgType = 'Piercing';
        } else if (low.includes('rapier') || low.includes('longbow') || low.includes('light crossbow') || low.includes('crossbow')) {
            dice = '1d8'; dmgType = low.includes('silver') ? 'Silvered Piercing' : 'Piercing';
        } else if (low.includes('shortsword') || low.includes('scimitar') || low.includes('shortbow') || low.includes('bow') || low.includes('handaxe') || low.includes('mace') || low.includes('spear') || low.includes('staff')) {
            dice = '1d6'; dmgType = (low.includes('mace') || low.includes('staff')) ? (low.includes('silver') ? 'Silvered Bludgeoning' : 'Bludgeoning') : (low.includes('silver') ? 'Silvered Piercing' : 'Piercing');
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
        const weaponId = normKey(raw);
        let shotInfo = null;
        if (meta.ammoKind) {
            shotInfo = consumeWeaponAmmo(weaponId);
        }
        const aDef = shotInfo && shotInfo.def ? shotInfo.def : null;
        const effAtkBonus = st.atkBonus + (aDef ? (aDef.atkBonus || 0) : 0);
        const effDmgBonus = st.dmgBonus + (aDef ? (aDef.dmgBonus || 0) : 0);
        const d20 = Math.floor(Math.random() * 20) + 1;
        const total = d20 + effAtkBonus;
        const name = shortLabel(raw);
        const ammoTag = aDef
            ? ` <span style="color:#e2e8f0; font-size:0.74rem; font-weight:700;">[${esc(aDef.shortName)} &bull; ${shotInfo.remaining} left${shotInfo.exhausted ? ' &mdash; last loaded round fired' : ''}]</span>`
            : '';
        const effDmgType = (aDef && aDef.isSilvered && !String(st.dmgType).toLowerCase().includes('silver'))
            ? `Silvered ${st.dmgType}`
            : st.dmgType;

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
            adapter.log(`<strong style="color:#facc15;">NAT 20 BRUTAL CRIT — ${esc(name)}!</strong> d20[<strong>20</strong>] + ${effAtkBonus} = <strong>${total} to Hit</strong>!${ammoTag} Brutal Crit Damage: ${base.max} (Max) + [${base.rolls.join('+')}] + ${effDmgBonus}${extraHtml} = <span style="color:#f87171; font-size:1.12rem; font-weight:800;">${critTotal} ${esc(effDmgType)} Damage</span>!`);
            return;
        }
        const tag = d20 === 1 ? ' <strong style="color:#f87171;">(NAT 1 MISS!)</strong>' : '';
        adapter.log(`<strong>${esc(name)} Attack:</strong> d20[<strong>${d20}</strong>] + ${effAtkBonus} = <span style="color:#fde68a; font-size:1.1rem; font-weight:800;">${total} to Hit</span>${tag}${ammoTag}`);
    }

    function rollDynamicWeaponDamage(invIdx) {
        const raw = adapter.getItems()[invIdx];
        if (!raw) return;
        const meta = getItemMeta(raw);
        const st = resolveWeaponCombatStats(raw, meta);
        const weaponId = normKey(raw);
        const aDef = meta.ammoKind ? getWeaponLastShotDef(weaponId) : null;
        const effDmgBonus = st.dmgBonus + (aDef ? (aDef.dmgBonus || 0) : 0);
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
        const isSilv = Boolean(aDef && aDef.isSilvered);
        const effDmgType = (isSilv && !String(st.dmgType).toLowerCase().includes('silver'))
            ? `Silvered ${st.dmgType}`
            : st.dmgType;
        const notes = [];
        if (isSilv || String(effDmgType).toLowerCase().includes('silver')) notes.push('Bypasses Werewolf, Vampire &amp; Hag resistance');
        if (aDef && aDef.haltsRegen) notes.push('Halts Vampire Regeneration for 1 round');
        if (aDef && aDef.blocksHealing) notes.push('Target cannot regain HP until start of your next turn');
        if (aDef && aDef.saveNote) notes.push(esc(aDef.saveNote));
        const noteHtml = notes.length ? ` <small style="color:#cbd5e1;">(${notes.join(' &bull; ')})</small>` : '';
        adapter.log(`<strong>${esc(shortLabel(raw))} Damage:</strong> ${breakdown} = <span style="color:#f87171; font-size:1.12rem; font-weight:800;">${total} ${esc(effDmgType)} Damage</span>!${noteHtml}`);
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
            const weaponId = normKey(raw);
            const aDef = meta.ammoKind ? getActiveWeaponAmmoDef(weaponId) : null;
            const effAtk = st.atkBonus + (aDef ? (aDef.atkBonus || 0) : 0);
            const effDmgBonus = st.dmgBonus + (aDef ? (aDef.dmgBonus || 0) : 0);
            const dmgParts = [`${st.dmgDice}${effDmgBonus ? (effDmgBonus > 0 ? '+' + effDmgBonus : effDmgBonus) : ''}`];
            if (st.extraDice) dmgParts.push(`+${st.extraDice}`);
            if (aDef && aDef.extraDice) dmgParts.push(`+${aDef.extraDice}`);
            const dmgLabel = dmgParts.join(' ');
            const ammoStripHtml = meta.ammoKind ? buildWeaponAmmoBarHtml(weaponId, { id: weaponId, kind: meta.ammoKind, maxCap: detectWeaponMaxCap(raw, meta) }) : '';
            const card = document.createElement('div');
            card.className = 'action-card rpg-dyn-weapon-card';
            card.style.borderLeft = '3px solid #f59e0b';
            card.innerHTML = `
                <div class="action-header">
                    <div>
                        <div onclick="COS_RPG.openItemDetails(${idx})" style="cursor:pointer; color:#f8fafc;">
                            ${esc(shortLabel(raw))} <span style="font-size:0.68rem; color:var(--text-muted);">ℹ️</span>
                        </div>
                        <div style="font-size:0.66rem; font-weight:700; color:#fde68a;">Equipped in ${slotObj.label}${slotId === 'mainHand' && bonuses.mainHand2H ? ' (2-Handed)' : ''} • +${effAtk} Hit • ${esc(dmgLabel)} ${esc(st.dmgType)}</div>
                    </div>
                    <span class="rpg-card-equipped-pill">WORN</span>
                </div>
                <div class="action-desc">${esc(meta.summary || 'Equipped weapon from Backpack.')}</div>
                ${ammoStripHtml}
                <div class="action-btn-row" style="flex-wrap:wrap;">
                    <button type="button" class="btn-roll-action" onclick="COS_RPG.rollDynamicWeaponAttack(${idx})">Attack (+${effAtk})</button>
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
        refreshAllAmmoDisplays();
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
            adapter.log(`<strong>${esc(act.verb || 'Used')} ${esc(shortLabel(raw))}:</strong> ${esc(act.effect || act.label)}`);
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
            dmOverrideActive: isDmOverrideActive(),
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
                    ov: snap.dmOverrideActive,
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
            localStorage.removeItem(getUnifiedPresetsKey());
            localStorage.removeItem(getLocalDmOverrideKey());
            localStorage.removeItem(getAmmoStorageKey());
            dmRemoteGearOverride = { enabled: false, note: '' };
            if (firebaseReady && rtdb) {
                campaignRtdbRef(`heroes/${adapter.heroId}/dm_gear_override`).set(null).catch(() => {});
            }
            lastAppliedPresetId = null;
            presetEditor = null;
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

                <!-- PER-WEAPON SPECIALTY AMMO LOADER MODAL -->
                <dialog class="rpg-dialog" id="rpg-ammo-loader-dialog" closedby="any" aria-labelledby="rpg-ammo-loader-title" style="max-width:460px;">
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
                    ${bonuses.saveBonus ? `<span class="rpg-stat-pill blue">Saves: +${bonuses.saveBonus}</span>` : ''}
                    ${bonuses.spellDcBonus ? `<span class="rpg-stat-pill purple">Spell DC/Hit: +${bonuses.spellDcBonus}</span>` : ''}
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
            const ammoNeedsContainer = Boolean(meta.ammoMeta && meta.ammoMeta.ammoKind === 'firearm' && !hasBulletContainerInBag());
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
                        ${hasLoadableAmmo
                            ? (ammoNeedsContainer
                                ? `<button type="button" class="rpg-mini-btn btn-restricted" disabled title="Buy a Partitioned Specialty Cartridge Rig (15 GP in any shop) first">Load (Locked)</button>`
                                : `<button type="button" class="rpg-mini-btn btn-use" onclick="COS_RPG.openAmmoLoaderModal({ invIndex: ${idx} })">Load</button>`)
                            : ''}
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
