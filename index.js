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
        div.style.opacity = '1'; // Fade in the image once it has loaded
    }
}

// Only used for testing purposes
function createImages(data) {
    data.forEach(card => {
        createImage(card.images.small, card.rarity)
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
    "McDonald's Collection 2022"
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
        } else if (randomNum <= 75) {
            to_return = "Rare Holo";
        } else {
            to_return = "Rare Holo +";
        }
        if (to_return === "Rare Holo +") {
            if (["Rare Holo EX", "Rare Holo GX", "Rare Holo V"].some(rarity => cardRarity[rarity].length > 0)) {
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
        } else if (randomNum <= 97) {
            to_return = "Rare Ultra";
        } else if (randomNum <= 99) {
            to_return = "Rare Rainbow";
        } else if (randomNum === 100) {
            to_return = "Rare Secret";
        }
        if (cardRarity[to_return].length > 0) {
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
        ["Rare Holo EX", "Rare Holo GX", "Rare Holo V"].forEach(rarity => {
            if (cardRarity[rarity].length > 0) {
                if (added) throw new Error(`Multiple of EX, GX and V exist`); // Only add one of these rarities
                pulledCards.push(cardRarity[rarity][getRandomInt(0, cardRarity[rarity].length - 1)]);
                added = true;
            }
        })
    } else {
        pulledCards.push(cardRarity[card9Rarity][getRandomInt(0, cardRarity[card9Rarity].length - 1)]);
    }
    // Get rare or secret/rainbow
    const card10Rarity = chooseCard10Rarity(cardRarity);
    if (cardRarity[card10Rarity].length === 0) throw new Error(`No cards of rarity ${card10Rarity} found`);
    pulledCards.push(cardRarity[card10Rarity][getRandomInt(0, cardRarity[card10Rarity].length - 1)]);

    // Get images
    displayCards(pulledCards, cards);
}

function generatePromoPack(cardRarity, cards) {
    const promoCards = [];
    for (let i = 0; i < 5; i++) {
        promoCards.push(cardRarity["Promo"][getRandomInt(0, cardRarity["Promo"].length - 1)]);
    }
    displayCards(promoCards, cards);
}

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
                "Rare Secret": []
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
                pullPack();
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
});
