const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Charger les données des plats depuis un fichier JSON
const dataFilePath = path.join(__dirname, 'data', 'plats.json');

let plats;
try {
    plats = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));
} catch (error) {
    console.error("Erreur de chargement du fichier plats.json:", error);
    plats = [];
}

// Route API pour rechercher des plats en fonction des allergies
app.post('/rechercher', (req, res) => {
    const { allergies } = req.body;
    if (!allergies || allergies.length === 0) {
        return res.json({ message: 'Veuillez entrer au moins une allergie.' });
    }

    const results = plats.map(plat => {
        let status = 'compatible';
        let modifiableIngredients = [];
        
        allergies.forEach(allergie => {
            if (plat.allergenes.includes(allergie)) {
                if (plat.modifiable.includes(allergie)) {
                    status = 'modifiable';
                    modifiableIngredients.push(allergie);
                } else {
                    status = 'interdit';
                }
            }
        });

        return { ...plat, status, modifiableIngredients };
    });

    res.json(results);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
