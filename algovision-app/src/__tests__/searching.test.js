import { describe, it, expect } from 'vitest';
import { linearSearch } from '../engine/searching/linearSearch';
import { binarySearch } from '../engine/searching/binarySearch';

const createTestData = (arr) => arr.map((val, idx) => ({ id: idx, val }));

describe('Searching Algorithms', () => {
    const testData = createTestData([1, 5, 8, 12, 20, 35, 50]);

    const runSearch = (genFunc, data, target) => {
        const gen = genFunc(data, { target });
        let lastState = { foundIndex: -1 };
        let result = gen.next();
        while (!result.done) {
            lastState = result.value;
            result = gen.next();
            if (lastState.isFinished) break;
        }
        return lastState ? lastState.foundIndex : -1;
    };

    it('Linear Search should find existing element', () => {
        const idx = runSearch(linearSearch, testData, 12);
        expect(idx).toBe(3);
    });

    it('Linear Search should return -1 if not found', () => {
        const idx = runSearch(linearSearch, testData, 100);
        expect(idx).toBe(-1);
    });

    it('Binary Search should find existing element', () => {
        const idx = runSearch(binarySearch, testData, 35);
        expect(idx).toBe(5);
    });

    it('Binary Search should return -1 if not found', () => {
        const idx = runSearch(binarySearch, testData, 7);
        expect(idx).toBe(-1);
    });
});
