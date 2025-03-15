
// chatbot_allergenes/app.js

import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Charger les données des plats depuis un fichier JSON
const dataFilePath = path.join(__dirname, 'data', 'plats.json');
let plats = JSON.parse(fs.readFileSync(dataFilePath, 'utf-8'));

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

app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
