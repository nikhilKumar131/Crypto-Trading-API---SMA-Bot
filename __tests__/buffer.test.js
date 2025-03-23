const CircularBuffer = require('../utilities/circularBuffer');

describe('CircularBuffer', () => {
    let buffer;

    beforeEach(() => {
        buffer = new CircularBuffer(5); // Initialize buffer with size 5
    });

    test('Should add elements and maintain size (FIFO)', () => {
        buffer.add(1);
        buffer.add(2);
        buffer.add(3);
        buffer.add(4);
        buffer.add(5);
        expect(buffer.getAll()).toEqual([1, 2, 3, 4, 5]);

        buffer.add(6); // Should remove 1 and keep last 5
        expect(buffer.getAll()).toEqual([2, 3, 4, 5, 6]);
    });

    test('Should compute SMA correctly', () => {
        buffer.add(10);
        buffer.add(20);
        buffer.add(30);
        buffer.add(40);
        buffer.add(50);
        expect(buffer.getAll().reduce((sum, p) => sum + p, 0) / 5).toBe(30); // SMA(5)
    });

    test('Should return null when not enough data for SMA', () => {
        expect(buffer.getAll().length).toBe(0);
        expect(buffer.getAll().reduce((sum, p) => sum + p, 0) / 5 || null).toBe(null);
    });

    test('Should maintain correct trade intervals', () => {
        // Simulate trade intervals by adding prices every cycle
        buffer.add(100);
        buffer.add(101);
        buffer.add(102);
        buffer.add(103);
        buffer.add(104);
        expect(buffer.getAll()).toEqual([100, 101, 102, 103, 104]); // Full buffer

        buffer.add(105); // Oldest (100) should be removed
        expect(buffer.getAll()).toEqual([101, 102, 103, 104, 105]);

        buffer.add(106);
        buffer.add(107);
        expect(buffer.getAll()).toEqual([103, 104, 105, 106, 107]); // Always last 5
    });

    test('Should not exceed buffer size', () => {
        for (let i = 1; i <= 10; i++) {
            buffer.add(i * 10);
        }
        expect(buffer.getAll().length).toBe(5); // Should only store last 5
        expect(buffer.getAll()).toEqual([60, 70, 80, 90, 100]); // Last 5 values
    });
});
