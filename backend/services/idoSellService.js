const axios = require('axios');
const orderStore = require('./orderStore');

function validate_env() {
    let domain = process.env.IDOSELL_DOMAIN;
    if (!domain || domain === 'undefined') {
        console.error('Zmienna IDOSELL_DOMAIN nie jest ustawiona lub ma nieprawidłową wartość.');
        process.exit(1)
    }

    let apiKey = process.env.IDOSELL_API_KEY;
    if (!apiKey || apiKey === 'undefined') {
        console.error('Zmienna IDOSELL_API_KEY nie jest ustawiona lub ma nieprawidłową wartość.');
        process.exit(1)
    }

    return {
        apiKey: apiKey,
        baseURL: domain
    }
}

const idoSellConfig = validate_env();

exports.fetchAndUpdateOrders = async () => {
    try {
        const response = await axios.post(
            `https://${idoSellConfig.baseURL}/api/admin/v5/orders/orders/search`,
            {
                params: {
                    shippmentStatus: "all"
                }
            },
            {
                headers: {
                    'X-API-KEY': idoSellConfig.apiKey,
                    'accept': 'application/json',
                    'content-type': 'application/json'
                }
            }
        );
        
        const results = response.data.Results;

        const orders = results.map(order => {
            const orderID = order.orderSerialNumber;
            const orderWorth = parseFloat(order.orderDetails.payments.orderCurrency.orderProductsCost);

            const products = order.orderDetails.productsResults.map(product => ({
                productID: product.productId,
                quantity: product.productQuantity
            }));
            
            return { orderID, products, orderWorth };
        }) // Podejrzewam że puste zamówienia powinny być ignorowane
        .filter(order => !(order.products.length === 0 || order.orderWorth === 0));
        
        orderStore.updateOrders(orders);
    } catch(error) {
        console.error('Błąd przy pobieraniu zamówień z API idoSell:', error);
        throw error;
    }
};
