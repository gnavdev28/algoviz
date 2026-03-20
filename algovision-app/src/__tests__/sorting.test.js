import { describe, it, expect } from 'vitest';
import { bubbleSort } from '../engine/sorting/bubbleSort';
import { quickSort } from '../engine/sorting/quickSort';
import { mergeSort } from '../engine/sorting/mergeSort';

const createTestData = (arr) => arr.map((val, idx) => ({ id: idx, val }));

describe('Sorting Algorithms', () => {
    const testCases = [
        [5, 3, 8, 1, 2],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [10],
        []
    ];

    const runSort = (genFunc, data) => {
        const gen = genFunc(data);
        let lastState = null;
        let result = gen.next();
        while (!result.done) {
            lastState = result.value;
            result = gen.next();
        }
        return lastState ? lastState.array.map(i => i.val) : [];
    };

    it('Bubble Sort should sort correctly', () => {
        testCases.forEach(tc => {
            const data = createTestData(tc);
            const sorted = runSort(bubbleSort, data);
            expect(sorted).toEqual([...tc].sort((a, b) => a - b));
        });
    });

    it('Quick Sort should sort correctly', () => {
        testCases.forEach(tc => {
            const data = createTestData(tc);
            const sorted = runSort(quickSort, data);
            expect(sorted).toEqual([...tc].sort((a, b) => a - b));
        });
    });

    it('Merge Sort should sort correctly', () => {
        testCases.forEach(tc => {
            const data = createTestData(tc);
            const sorted = runSort(mergeSort, data);
            expect(sorted).toEqual([...tc].sort((a, b) => a - b));
        });
    });
});
