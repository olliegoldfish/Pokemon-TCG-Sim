const fs = require('fs');
const path = require('path');

const cardRarityList = [
                "Promo",
                "Common",
                "Uncommon",
                "Rare",
                "Rare Holo",
                "Rare Holo EX",
                "Rare Holo GX",
                "Rare Holo V",
                "Rare Ultra",
                "Rare Rainbow",
                "Rare Secret",
                // New
                "Rare Shining",
                "Rare Secret",
                "Rare Holo Star",
                "Rare Holo LV.X",
                "Rare Prime",
                "LEGEND",
                'Rare ACE',
                'Classic Collection',
                'Double Rare',
                'Illustration Rare',
                'Ultra Rare',
                'Special Illustration Rare',
                'Black White Rare',
                'Rare Prism Star',
                'Rare Shiny',
                'Rare Shiny GX',
                'Hyper Rare',
                'Shiny Rare',
                'Shiny Ultra Rare',
                'ACE SPEC Rare',
                'Trainer Gallery Rare Holo',
                'Amazing Rare',
                'Rare BREAK',
                'Rare Holo VMAX',
                'Radiant Rare',
                'Rare Holo VSTAR'
                ];  
        

const cardsDir = path.join(__dirname, 'cards', 'en');
const foundRarities = new Set();

fs.readdirSync(cardsDir).forEach(file => {
    if (file.endsWith('.json')) {
        const cards = JSON.parse(fs.readFileSync(path.join(cardsDir, file), 'utf8'));
        cards.forEach(card => {
            if (card.rarity) foundRarities.add(card.rarity);
        });
    }
});

const missing = [...foundRarities].filter(r => !cardRarityList.includes(r));
console.log("All rarities found:", [...foundRarities]);
console.log("Missing from cardRarity:", missing);