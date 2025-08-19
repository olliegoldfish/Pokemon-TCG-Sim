const fs = require('fs');

function search(cards, set) {
    // Search the cards as needed
    const rarity = "Radiant Rare";
    if (cards.some(card => card.rarity === rarity)) {
        console.log(`Set ${set.name} contains ${rarity} cards.`);
    }
}

fs.readFile('sets/en.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    // Parse data as JSON
    const sets = JSON.parse(data);

    // Iterate through each set
    sets.forEach(set => {
        // Construct the filename for each set
        const filename = `cards/en/${set.id}.json`;

        // Check if the file exists
        fs.access(filename, fs.constants.F_OK, (err) => {
            if (err) {
                console.error(`File ${filename} does not exist.`);
            } else {
                // Read the file and process it as needed
                fs.readFile(filename, 'utf8', (err, fileData) => {
                    if (err) {
                        console.error(`Error reading file ${filename}:`, err);
                    } else {
                        const cards = JSON.parse(fileData);
                        // Process cards as needed
                        search(cards, set);
                    }
                });
            }
        });
    });
})