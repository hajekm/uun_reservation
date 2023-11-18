// Importov�n� Express
const express = require('express');

// Vytvo�en� Express aplikace
const app = express();

// Middleware pro zpracov�n� JSON po�adavk�
app.use(express.json());

// Z�kladn� route
app.get('/', (req, res) => {
    res.send('V�tejte v m� Node.js aplikaci s Express!');
});

// Nastaven� portu
const PORT = process.env.PORT || 3001;

// Spu�t�n� serveru
app.listen(PORT, () => {
    console.log(`Server b�� na portu ${PORT}`);
});
