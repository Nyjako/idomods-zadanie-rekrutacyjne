const orderStore = require('../services/orderStore');
const { Parser } = require('json2csv');

exports.getOrdersCSV = (req, res) => {
    let orders = orderStore.getAllOrders();
    const { minWorth, maxWorth } = req.query;
    
    // Filtrowanie
    if(minWorth || maxWorth) {
        orders = orders.filter(order => {
            const worth = parseFloat(order.orderWorth);
            if(minWorth && worth < parseFloat(minWorth)) return false;
            if(maxWorth && worth > parseFloat(maxWorth)) return false;
            return true;
        });
    }
    
    try {
        const csvData = orders.map(order => ({
            orderID: order.orderID,
            orderWorth: order.orderWorth,
            products: JSON.stringify(order.products)
        }));
        
        const fields = ['orderID', 'orderWorth', 'products'];
        const parser = new Parser({ fields });
        const csv = parser.parse(csvData);
        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        return res.send(csv);
    } catch(err) {
        console.error('Błąd przy generowaniu CSV:', err);
        res.status(500).json({ error: 'Błąd przy generowaniu CSV' });
    }
};

exports.getOrder = (req, res) => {
    const orderID = req.params.orderID;
    const order = orderStore.getOrder(orderID);
    if(!order){
        return res.status(404).json({ error: 'Nie znaleziono zamówienia' });
    }
    res.json(order);
};