export function* binarySearch(initialArray, extraArgs = {}) {
    let arr = [...initialArray].sort((a,b) => a.val - b.val);
    let target = extraArgs.target || (arr.length > 0 ? arr[Math.floor(arr.length/2)].val : 0);
    
    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [], foundIndex: -1, pseudoLine: 0, isFinished: false };
    
    let l = 0;
    let r = arr.length - 1;
    let discarded = [];

    // left ← 0, right ← n-1
    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [], foundIndex: -1, pseudoLine: 1, isFinished: false };
    
    while (l <= r) {
        let mid = Math.floor((l + r) / 2);
        let active = [];
        for(let i=l; i<=r; i++) active.push(i);

        // mid ← (left + right) / 2
        yield { array: arr, activeIndices: active, swapIndices: [mid], sortedIndices: [...discarded], foundIndex: -1, pseudoLine: 3, isFinished: false };

        // So sánh A[mid] với target
        yield { array: arr, activeIndices: active, swapIndices: [mid], sortedIndices: [...discarded], foundIndex: -1, pseudoLine: 4, isFinished: false };
        
        if (arr[mid].val === target) {
            // Tìm thấy!
            yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [...discarded], foundIndex: mid, pseudoLine: 5, pseudoLineStatus: 'success', isFinished: true };
            return;
        }
        
        if (arr[mid].val < target) {
            for(let i=l; i<=mid; i++) discarded.push(i);
            l = mid + 1;
            // left ← mid + 1
            yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [...discarded], foundIndex: -1, pseudoLine: 7, isFinished: false };
        } else {
            for(let i=mid; i<=r; i++) discarded.push(i);
            r = mid - 1;
            // right ← mid - 1
            yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [...discarded], foundIndex: -1, pseudoLine: 9, isFinished: false };
        }
    }
    // Không tìm thấy
    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: arr.map((_, i)=>i), foundIndex: -1, pseudoLine: 10, pseudoLineStatus: 'error', isFinished: true };
}
