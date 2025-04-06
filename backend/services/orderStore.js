const fs = require('fs');
const path = require('path');

const ordersFilePath = path.join(__dirname, '../orders.json');

let orders = [];

// Wczytywanie
function loadOrders() {
    if (fs.existsSync(ordersFilePath)) {
        try {
            const data = fs.readFileSync(ordersFilePath, 'utf8');
            orders = JSON.parse(data);
            console.log("Zamówienia zostały wczytane z pliku.");
        } catch (err) {
            console.error("Błąd podczas wczytywania pliku z zamówieniami:", err);
            orders = [];
        }
    } else {
        console.log("Plik z zamówieniami nie istnieje. Inicjalizuję pusty magazyn.");
        orders = [];
    }
}

// Zapisywanie 
function saveOrders() {
    try {
        fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2));
        console.log("Zamówienia zostały zapisane do pliku.");
    } catch (err) {
        console.error("Błąd podczas zapisywania zamówień do pliku:", err);
    }
}

exports.getAllOrders = () => orders;
exports.getOrder = (orderID) => orders.find(order => order.orderID == orderID);
exports.updateOrders = (newOrders) => {
    orders = newOrders;
    saveOrders();
};

loadOrders();