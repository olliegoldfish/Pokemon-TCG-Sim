const output = document.getElementById('output');

function createImage(imageLink) {
    const img = document.createElement('img');
    img.src = imageLink;
    img.alt = 'Card Image';
    img.class = 'card-image';
    output.appendChild(img);
}

function createImages(data) {
    data.forEach(card => {
        createImage(card.images.small)
    })
}

async function getCard() {
    await fetch('http://localhost:8888/cards/en/xyp.json')
        .then(response => response.text())
        .then(data => {
            createImages(JSON.parse(data));
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
}

getCard();