require('dotenv').config();

const express = require('express');
const cron = require('node-cron');
const ordersRouter = require('./routes/orders');
const basicAuth = require('./utils/basicAuth');
const idoSellService = require('./services/idoSellService');
const orderStore = require('./services/orderStore');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(basicAuth);

app.use('/orders', ordersRouter);

// Sprawdzamy, czy plik z zamówieniami istnieje oraz czy magazyn nie jest pusty
const ordersFilePath = path.join(__dirname, 'orders.json');
if (!fs.existsSync(ordersFilePath) || orderStore.getAllOrders().length === 0) {
    console.log("Plik z zamówieniami nie istnieje lub dane są puste. Wymuszam pobranie danych z API...");
    idoSellService.fetchAndUpdateOrders().catch(err => {
        console.error("Błąd podczas pobierania zamówień przy starcie:", err);
        process.exit(1)
    });
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serwer działa na porcie ${PORT}`);
});

// pobieranie zamówień codziennie o północy
cron.schedule('0 0 * * *', async () => {
    console.log('Pobieranie zamówień z API idoSell...');
    try {
        await idoSellService.fetchAndUpdateOrders();
        console.log('Zamówienia zostały zaktualizowane');
    } catch (error) {
        console.error('Błąd podczas aktualizacji zamówień:', error);
    }
});