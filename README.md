# Crypto-Trading-API---SMA-Bot
Crypto Trading API is a Node.js-based trading bot that fetches Bitcoin prices from CoinGecko, calculates Simple Moving Averages (SMA), and generates Buy/Sell signals based on SMA crossover strategy.

## Installation & Setup
1️⃣ Clone the Repository
```
git clone https://github.com/your-username/crypto-trading-api.git
cd crypto-trading-api
```

2️⃣ Install Dependencies
```
npm install
```

3️⃣ Run the Application
```
npm start
```

Run the Tests
```
npm test
```

The server will start at http://localhost:3000.

## Features
Fetches real-time Bitcoin prices from CoinGecko
Calculates SMA5 (Short-term) and SMA20 (Long-term)
Logs:
1. Latest last 20 bitcoin price values
2. Trade Log
      
Trade Strategy:

    📈 BUY when SMA5 crosses above SMA20

    📉 SELL when SMA5 crosses below SMA20

    ⏳ HOLD if no signal is generated
    ✅ Stores the last 20 prices in a Circular Buffer for efficiency
    ✅ Runs every minute to check for trade signals
    ✅ REST API support for fetching latest price, SMA values, and trade signals
    ✅ Unit & API tests using Jest & Supertest

## Assumptions
1. Only Bitcoin (BTC) is Tracked

Why?

    The API is designed to track multiple coins, but the focus is only on Bitcoin for simplicity.
    The CoinGecko API supports other coins, but adding more requires modifying pollCryptoPrice().

Future Expansion?

    Support for Ethereum, Dogecoin, etc. can be easily added by modifying coinsToTrack in index.js.

## Design Decisions

    1. Apis can track any coin but automatic trade bot is implemented for Bitcoin only.
    2. CoinGecko free api allow data inveral of 5 minutes for free apis, which is used initially.
    3. Then uses circular buffer and latest value every minute
    4. Api seperation from servers initialization for testing.
          In index.js, the server doesn’t start during tests (require.main === module)

## Info
author: Nikhil Kumar
email: nikhilkumarrrr19@gmail.com
    
