// Importování Express
const express = require('express');

// Vytvoøení Express aplikace
const app = express();

// Middleware pro zpracování JSON požadavkù
app.use(express.json());

// Základní route
app.get('/', (req, res) => {
    res.send('Vítejte v mé Node.js aplikaci s Express!');
});

// Nastavení portu
const PORT = process.env.PORT || 3001;

// Spuštìní serveru
app.listen(PORT, () => {
    console.log(`Server bìží na portu ${PORT}`);
});
