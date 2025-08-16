const output = document.getElementById('output');
const select = document.getElementById('select');


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
    const selectedSet = select.value;
    await fetch(`http://localhost:8888/cards/en/${selectedSet}.json`)
        .then(response => response.text())
        .then(data => {
            createImages(JSON.parse(data));
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
})