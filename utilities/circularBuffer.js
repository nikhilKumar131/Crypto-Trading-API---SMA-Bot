class CircularBuffer {
    constructor(size) {
        this.size = size;
        this.buffer = [];
    }

    add(price) {
        if (this.buffer.length >= this.size) {
            this.buffer.shift(); // Remove the oldest price when full
        }
        this.buffer.push(price);
    }

    getAverage() {
        if (this.buffer.length === 0) return null; // Avoid division by zero
        return this.buffer.reduce((sum, price) => sum + price, 0) / this.buffer.length;
    }

    getAll() {
        return [...this.buffer]; // Returns a copy of buffer data
    }
}

module.exports = CircularBuffer;
