const axios = require('axios');



// Function to fetch the latest price
async function price(coin) {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`);
        return response.data[coin]?.usd || null;
    } catch (error) {
        console.error(`Error fetching price for ${coin}:`, error.message);
        return null;
    }
}

// Function to calculate SMA5
// async function sma5(coin) {
//     const latestPrice = await price(coin);
//     if (latestPrice) {
//         sma5Buffer.add(latestPrice);
//     }
//     return sma5Buffer.getAverage();
// }

// // Function to calculate SMA20
// async function sma20(coin) {
//     const latestPrice = await price(coin);
//     if (latestPrice) {
//         sma20Buffer.add(latestPrice);
//     }
//     return sma20Buffer.getAverage();
// }

// // Function to check for a Buy Signal (SMA5 crosses above SMA20)
// async function buySignal(coin) {
//     const shortSMA = await sma5(coin);
//     const longSMA = await sma20(coin);
    
//     if (shortSMA !== null && longSMA !== null && shortSMA > longSMA) {
//         return true; // Buy Signal
//     }
//     return false;
// }

// // Function to check for a Sell Signal (SMA5 crosses below SMA20)
// async function sellSignal(coin) {
//     const shortSMA = await sma5(coin);
//     const longSMA = await sma20(coin);

//     if (shortSMA !== null && longSMA !== null && shortSMA < longSMA) {
//         return true; // Sell Signal
//     }
//     return false;
// }

// // Function to simulate a trade execution based on signals
// async function trade(coin) {
//     if (await buySignal(coin)) {
//         console.log(`[TRADE] Buying ${coin} at current price.`);
//         return { action: 'BUY', coin, price: await price(coin) };
//     } 
//     if (await sellSignal(coin)) {
//         console.log(`[TRADE] Selling ${coin} at current price.`);
//         return { action: 'SELL', coin, price: await price(coin) };
//     }
//     console.log(`[TRADE] No trade action for ${coin} at this time.`);
//     return { action: 'HOLD', coin };
// }

module.exports = { price };
