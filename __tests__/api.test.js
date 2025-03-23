const request = require('supertest');
const { app, initializeBuffer } = require('../index'); // Import app & initialization
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

// Mock CoinGecko API responses
mock.onGet(/simple\/price/).reply(200, {
    bitcoin: { usd: 60500 }
});

mock.onGet(/market_chart/).reply(200, {
    prices: [...Array(20).keys()].map(i => [i, 60000 + i * 100]) // Generate 20 fake prices
});

beforeAll(async () => {
    await initializeBuffer(); // Ensure buffer is initialized before running tests
});

describe('API Endpoints', () => {
    test('GET /price/bitcoin should return a price', async () => {
        const res = await request(app).get('/price/bitcoin');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('price');
        expect(typeof res.body.price).toBe('number');
    });

    test('GET /sma/bitcoin should return SMA values', async () => {
        const res = await request(app).get('/sma/bitcoin');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('sma5');
        expect(res.body).toHaveProperty('sma20');
        expect(typeof res.body.sma5).toBe('number');
        expect(typeof res.body.sma20).toBe('number');
    });

    test('GET /trade/bitcoin should return trade decision', async () => {
        const res = await request(app).get('/trade/bitcoin');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('trade');
        expect(['BUY', 'SELL', 'HOLD']).toContain(res.body.trade);
    });

    test('GET /history should return price buffer', async () => {
        const res = await request(app).get('/history');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('prices');
        expect(Array.isArray(res.body.prices)).toBe(true);
    });
});
