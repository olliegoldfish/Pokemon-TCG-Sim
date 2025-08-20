import CONSTANTS from './constants.js';

const output = document.getElementById('output');
const select = document.getElementById('select');
const openPack = document.getElementById('open-pack');

// Set html variables
document.getElementsByTagName('html')[0].style.setProperty('--fade-in-duration', CONSTANTS.FADE_IN_DURATION);

function createImage(imageLink, rarity) {
    const div = document.createElement('div');
    const rarityP = document.createElement('p');
    const img = document.createElement('img');
    img.src = imageLink;
    img.alt = 'Card Image';
    div.classList.add('card-image')
    rarityP.textContent = 'Rarity: ' + rarity;
    div.appendChild(img);
    div.appendChild(rarityP);
    output.appendChild(div);
    div.style.opacity = '0'; // Start with opacity 0 for fade-in effect \
    img.onload = () => {
        requestAnimationFrame(() => {
            div.style.opacity = '1'; // Fade in the image once it has loaded
        });
    };
    if (img.complete) {
        requestAnimationFrame(() => {
            div.style.opacity = '1'; // Fade in the image once it has loaded
        });
    }
}


// Only used for testing purposes
function createImages(data) {
    data.forEach(card => {
        createImage(card.images.small, card.rarity);
    })    
}

const BLACKLIST = [
    "McDonald's Collection 2011",
    "McDonald's Collection 2012",
    "McDonald's Collection 2013",
    "McDonald's Collection 2014",
    "McDonald's Collection 2015",
    "McDonald's Collection 2016",
    "McDonald's Collection 2017",
    "McDonald's Collection 2018",
    "McDonald's Collection 2019",
    "McDonald's Collection 2020",
    "McDonald's Collection 2021",
    "McDonald's Collection 2022",
    "Southern Islands",
    "EX Trainer Kit Latias",
    "EX Trainer Kit Latios",
    "Ex Trainer Kit 2 Plusle",
    "Ex Trainer Kit 2 Minun",
    "Pokémon Rumble",
    "Hidden Fates Shiny Vault",
    "Shining Fates Shiny Vault",
    "Brilliant Stars Trainer Gallery",
    "Astral Radiance Trainer Gallery",
    "Silver Tempest Trainer Gallery",
    "Lost Origin Trainer Gallery",
    "Crown Zenith Galarian Gallery"
]

async function createSelect() {
    await fetch('http://localhost:8888/sets/en.json')
        .then(response => response.text())
        .then(data => {
            const sets = JSON.parse(data);
            sets.forEach(set => {
                if (BLACKLIST.includes(set.name)) {
                    return; // Skip blacklisted sets
                }
                const option = document.createElement('option');
                option.value = set.id;
                option.textContent = set.name;
                select.appendChild(option);
            })
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

createSelect();

select.addEventListener('change', async () => {
    output.innerHTML = ''; // Clear previous images    
})


function displayCards(cardIds, cards) {
    let delay = 0;
    cardIds.forEach(cardId => {
        const card = cards.find(c => c.id === cardId);
        if (card) {
            setTimeout(() => createImage(card.images.small, card.rarity), delay);
        } else {
            console.error(`Card with ID ${cardId} not found.`);
        }
        delay += CONSTANTS.DELAY_BETWEEN_CARDS; // Increment delay for each card
    })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function chooseCard9Rarity(cardRarity) {
    let attempts = 0;
    while (attempts < 1000) {
        attempts++;
        let to_return = "";
        const randomNum = getRandomInt(0, 100);
        if (randomNum <= 45) {
            to_return = "Rare";
        } else if (randomNum <= 55 && cardRarity["Rare ACE"].length > 0) {
            to_return = "Rare ACE";
        } else if (randomNum <= 65 && cardRarity["Rare Prism Star"].length > 0) {
            to_return = "Rare Prism Star";
        } else if (randomNum <= 75) {
            to_return = "Rare Holo";
        } else if (randomNum <= 85 && cardRarity["ACE SPEC Rare"].length > 0) {
            to_return = "ACE SPEC Rare";
        } else {
            to_return = "Rare Holo +";
        }
        if (to_return === "Rare Holo +") {
            if (RARE_HOLO_PLUS.some(rarity => cardRarity[rarity].length > 0)) {
                return to_return;
            }
        } else if (cardRarity[to_return].length > 0) {
            return to_return;
        }
    }
    throw new Error("Could not find a valid rarity for card 9 after 1000 attempts");
}

function chooseCard10Rarity(cardRarity) {
    let attempts = 0;
    while (attempts < 1000) {
        attempts++;
        let to_return = "";
        const randomNum = getRandomInt(0, 100);
        if (randomNum <= 75) {
            to_return = "Rare Holo";
        } else if (randomNum <= 86 && cardRarity["Illustration Rare"].length > 0) {
            to_return = "Illustration Rare";
        } else if (randomNum <= 96) {
            to_return = "Rare Ultra or Ultra Rare";
        } else if (randomNum <= 98) {
            to_return = "Rare Rainbow Equivalent";
        } else if (randomNum <= 99) {
            to_return = "Rare Secret Equivalent";
        } else if (randomNum === 100) {
            to_return = "Special Illustration Rare";
        }
        if (to_return === "Rare Ultra or Ultra Rare") {
            if (RARE_ULTRA_ULTRA_RARE.some(rarity => cardRarity[rarity].length > 0)) {
                return to_return;
            }
        } else if (to_return === "Rare Secret Equivalent") {
            if (RARE_SECRET_EQUIVALENT.some(rarity => cardRarity[rarity].length > 0)) {
                return to_return;
            }
        } else if (to_return === "Rare Rainbow Equivalent") {
            if (RARE_RAINBOW_EQUIVALENT.some(rarity => cardRarity[rarity].length > 0)) {
                return to_return;
            }
        } else if (cardRarity[to_return].length > 0) {
            return to_return;
        }
    }
    throw new Error("Could not find a valid rarity for card 10 after 1000 attempts");
}

function generatePack(cardRarity, cards) {
    const pulledCards = []
    // Get commons
    for (let i = 0; i < 4; i++) {
        pulledCards.push(cardRarity["Common"][getRandomInt(0, cardRarity["Common"].length - 1)]);
    }
    // Get uncommons
    for (let i = 0; i < 3; i++) {
        pulledCards.push(cardRarity["Uncommon"][getRandomInt(0, cardRarity["Uncommon"].length - 1)]);
    }
    // Get rare
    pulledCards.push(cardRarity["Rare"][getRandomInt(0, cardRarity["Rare"].length - 1)]);
    // Get rare or holo
    const card9Rarity = chooseCard9Rarity(cardRarity);
    if (card9Rarity === "Rare Holo +") {
        let added = false;
        RARE_HOLO_PLUS.forEach(rarity => {
            if (cardRarity[rarity].length > 0) {
                if (added) throw new Error(`Multiple of EX, GX, V, LV.X, VMAX, VSTAR exist`); // Only add one of these rarities
                pulledCards.push(cardRarity[rarity][getRandomInt(0, cardRarity[rarity].length - 1)]);
                added = true;
            }
        })
    } else if (card9Rarity === "Rare") {
        const rare = cardRarity["Rare"].concat(cardRarity["Amazing Rare"], cardRarity["Radiant Rare"]);
        pulledCards.push(rare[getRandomInt(0, rare.length - 1)])
    } else {
        pulledCards.push(cardRarity[card9Rarity][getRandomInt(0, cardRarity[card9Rarity].length - 1)]);
    }
    // Get rare or secret/rainbow
    const card10Rarity = chooseCard10Rarity(cardRarity);
    if (card10Rarity === "Rare Ultra or Ultra Rare") {
        let added = false;
        RARE_ULTRA_ULTRA_RARE.forEach(rarity => {
            if (cardRarity[rarity].length > 0) {
                if (added) throw new Error(`Multiple of Ultra Rare, Rare Ultra exist`); // Only add one of these rarities
                pulledCards.push(cardRarity[rarity][getRandomInt(0, cardRarity[rarity].length - 1)]);
                added = true;
            }
        })
    } else if (card10Rarity === "Rare Secret Equivalent") {
        let added = false;
        RARE_SECRET_EQUIVALENT.forEach(rarity => {
            if (cardRarity[rarity].length > 0) {
                if (added) throw new Error(`Multiple of Rare Secret Equivalent exist`); // Only add one of these rarities
                pulledCards.push(cardRarity[rarity][getRandomInt(0, cardRarity[rarity].length - 1)]);
                added = true;
            }
        })
    } else if (card10Rarity === "Rare Rainbow Equivalent") {
        let added = false;
        RARE_RAINBOW_EQUIVALENT.forEach(rarity => {
            if (cardRarity[rarity].length > 0) {
                if (added) throw new Error(`Multiple of Rare Rainbow Equivalent exist`); // Only add one of these rarities
                pulledCards.push(cardRarity[rarity][getRandomInt(0, cardRarity[rarity].length - 1)]);
                added = true;
            }
        })
    } else{
        pulledCards.push(cardRarity[card10Rarity][getRandomInt(0, cardRarity[card10Rarity].length - 1)]);
    }

    // Get images
    displayCards(pulledCards, cards);
}

function generatePromoPack(cardRarity, cards, rarity = "Promo") {
    const promoCards = [];
    for (let i = 0; i < 5; i++) {
        promoCards.push(cardRarity[rarity][getRandomInt(0, cardRarity[rarity].length - 1)]);
    }
    displayCards(promoCards, cards);
}

const RARE_HOLO_PLUS = ["Rare Holo EX", "Rare Holo GX", "Rare Holo V", "Rare Holo LV.X", "Rare Holo VMAX", "Rare Holo VSTAR", "Rare Prime", "Double Rare"];
const RARE_ULTRA_ULTRA_RARE = ["Rare Ultra", "Ultra Rare", "Rare Holo Star", "LEGEND", "Rare Shining"];
const RARE_SECRET_EQUIVALENT = ["Rare Secret", "Hyper Rare", "Black White Rare"];
const RARE_RAINBOW_EQUIVALENT = ["Rare Rainbow", "Shiny Rare", "Shiny Ultra Rare", "Rare BREAK"]

function pullPack() {
    output.innerHTML = '';
    const selectedSet = select.value;
    fetch(`http://localhost:8888/cards/en/${selectedSet}.json`)
        .then(response => response.text())
        .then(data => {
            const cardRarity = {
                "Promo": [],
                "Common": [],
                "Uncommon": [],
                "Rare": [],
                "Rare Holo": [],
                "Rare Holo EX": [],
                "Rare Holo GX": [],
                "Rare Holo V": [],
                "Rare Ultra": [],
                "Rare Rainbow": [],
                "Rare Secret": [],
                "Rare Holo LV.X": [],
                "Rare Holo VMAX": [],
                "Rare Holo VSTAR": [],
                "Special Illustration Rare": [],
                "Rare Holo Star": [],
                "Rare Prime": [],
                "LEGEND": [],
                "Rare Shining": [],
                "Double Rare": [],
                "Classic Collection": [],
                "Illustration Rare": [],
                "Rare ACE": [],
                "Ultra Rare": [],
                "Black White Rare": [],
                "Hyper Rare": [],
                "Rare Prism Star": [],
                "Shiny Rare": [],
                "Shiny Ultra Rare": [],
                "ACE SPEC Rare": [],
                "Amazing Rare": [],
                "Rare BREAK": [],
                "Radiant Rare": [],
            }
            const cards = JSON.parse(data);
            cards.forEach(card => {
                if (card.supertype === 'Energy') {
                    return; // Skip energy cards
                }
                if (cardRarity[card.rarity]) {
                    cardRarity[card.rarity].push(card.id);
                } else if (cardRarity[card.rarity] === undefined) {
                    throw new Error(`Unknown rarity: ${card.rarity}`);
                }
            })

            if (cardRarity["Promo"].length > 0) {
                generatePromoPack(cardRarity, cards);
            } else if (cardRarity["Classic Collection"].length > 0) {
                generatePromoPack(cardRarity, cards, "Classic Collection");
            } else {
                generatePack(cardRarity, cards);
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

openPack.addEventListener('click', async () => {
    const selectedSet = select.value;
        await fetch(`http://localhost:8888/cards/en/${selectedSet}.json`)
            .then(response => response.text())
            .then(data => {
                //createImages(JSON.parse(data));
                pullPack();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
});
