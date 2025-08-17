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

function createImages(data) {
    data.forEach(card => {
        createImage(card.images.small, card.rarity)
    })
}


async function createSelect() {
    await fetch('http://localhost:8888/sets/en.json')
        .then(response => response.text())
        .then(data => {
            const sets = JSON.parse(data);
            sets.forEach(set => {
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


openPack.addEventListener('click', async () => {
    const selectedSet = select.value;
        await fetch(`http://localhost:8888/cards/en/${selectedSet}.json`)
            .then(response => response.text())
            .then(data => {
                createImages(JSON.parse(data));
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
});
