const express = require('express');
const axios = require('axios');
const { price } = require('./utilities/functions');
const CircularBuffer = require('./utilities/circularBuffer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize price buffer for the last 20 price points
const priceBuffer = new CircularBuffer(20);

/**
 * Fetches historical price data from CoinGecko and fills the buffer initially.
 * Ensures SMA calculations have enough data from the start.
 */
const initializeBuffer = async () => {
    try {
        const response = await axios.get(`https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1`);
        const prices = response.data.prices.map(entry => entry[1]).slice(-20);

        prices.reverse(); // Ensure oldest prices are added first
        prices.forEach(price => priceBuffer.add(price)); // Populate buffer with historical data

        console.log("✅ Buffer initialized with historical Bitcoin prices:", priceBuffer.getAll());
    } catch (error) {
        console.error("❌ Error initializing buffer:", error.message);
    }
};

/**
 * Fetches the latest Bitcoin price and updates the buffer every minute.
 */
const pollCryptoPrice = async () => {
    const latestPrice = await price('bitcoin');
    if (latestPrice) {
        priceBuffer.add(latestPrice);
        console.log(`✅ Updated Bitcoin prices:`, priceBuffer.getAll());
    }
};

/**
 * Calculates the Simple Moving Average (SMA) based on the last `period` price points.
 */
const getSMA = (period) => {
    const prices = priceBuffer.getAll();
    if (prices.length < period) return null;
    return prices.slice(-period).reduce((sum, price) => sum + price, 0) / period;
};

/**
 * Checks trade signals based on SMA5 and SMA20 crossover strategy.
 * Logs BUY, SELL, or HOLD decisions.
 */
const tradeExecution = async () => {
    const sma5 = getSMA(5);
    const sma20 = getSMA(20);
    const latestPrice = await price('bitcoin');

    if (sma5 === null || sma20 === null) {
        console.log("⚠️ Not enough data for SMA calculation.");
        return;
    }

    if (sma5 > sma20) {
        console.log(`📈 [TRADE] BUY at $${latestPrice} | Time: ${new Date().toISOString()}`);
    } else if (sma20 > sma5) {
        console.log(`📉 [TRADE] SELL at $${latestPrice} | Time: ${new Date().toISOString()}`);
    } else {
        console.log("🔄 [TRADE] No action.");
    }
};

/**
 * API Endpoints
 */

// Get the latest price of a coin
app.get('/price/:coin', async (req, res) => {
    const coin = req.params.coin.toLowerCase();
    res.json({ coin, price: await price(coin) });
});

// Get SMA values for Bitcoin
app.get('/sma/:coin', async (req, res) => {
    res.json({ coin: "bitcoin", sma5: getSMA(5), sma20: getSMA(20) });
});

// Get the historical price buffer
app.get('/history', (req, res) => {
    res.json({ prices: priceBuffer.getAll() });
});

// Get the latest trade signal based on SMA crossover
app.get('/trade/:coin', async (req, res) => {
    const sma5 = getSMA(5);
    const sma20 = getSMA(20);
    const latestPrice = await price('bitcoin');

    let trade = "HOLD";
    if (sma5 > sma20) trade = "BUY";
    else if (sma20 > sma5) trade = "SELL";

    res.json({ trade, price: latestPrice, timestamp: new Date().toISOString() });
});

// **Export `app` for testing**
module.exports = { app, initializeBuffer, pollCryptoPrice, tradeExecution };

// **Main Function to Start Everything**
const startApp = async () => {
    await initializeBuffer(); // Ensure buffer is populated before polling starts
    
    // Schedule price updates and trade execution every 60 seconds
    setInterval(async () => {
        await pollCryptoPrice();
        await tradeExecution();
    }, 60000);

    // Start Express Server (only if not in test mode)
    if (require.main === module) {
        app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
    }
};

// Start the app if not testing
if (require.main === module) {
    startApp();
};
