const output = document.getElementById('output');
const select = document.getElementById('select');
const openPack = document.getElementById('open-pack');

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
}

// Only used for testing purposes
function createImages(data) {
    data.forEach(card => {
        createImage(card.images.small, card.rarity)
    })
}

BLACKLIST = [
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
    cardIds.forEach(cardId => {
        const card = cards.find(c => c.id === cardId);
        if (card) {
            createImage(card.images.small, card.rarity);
        } else {
            console.error(`Card with ID ${cardId} not found.`);
        }
    })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
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
    const holos = cardRarity["Rare"].concat(cardRarity["Rare Holo"], cardRarity["Rare Holo EX"], cardRarity["Rare Holo GX"]);
    pulledCards.push(holos[getRandomInt(0, holos.length - 1)]);
    // Get rare or secret/rainbow
    const secret = cardRarity["Rare Holo"].concat(cardRarity["Rare Ultra"], cardRarity["Rare Rainbow"], cardRarity["Rare Secret"]);
    pulledCards.push(secret[getRandomInt(0, secret.length - 1)]);

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
