export function* binarySearch(initialArray, extraArgs = {}) {
    let arr = [...initialArray].sort((a,b) => a.val - b.val);
    let target = extraArgs.target || (arr.length > 0 ? arr[Math.floor(arr.length/2)].val : 0);
    
    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [], foundIndex: -1, isFinished: false };
    
    let l = 0;
    let r = arr.length - 1;
    let discarded = [];
    
    while (l <= r) {
        let mid = Math.floor((l + r) / 2);
        let active = [];
        for(let i=l; i<=r; i++) active.push(i);
        
        yield { array: arr, activeIndices: active, swapIndices: [mid], sortedIndices: [...discarded], foundIndex: -1, isFinished: false };
        
        if (arr[mid].val === target) {
            yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [...discarded], foundIndex: mid, isFinished: true };
            return;
        }
        
        if (arr[mid].val < target) {
            for(let i=l; i<=mid; i++) discarded.push(i);
            l = mid + 1;
        } else {
            for(let i=mid; i<=r; i++) discarded.push(i);
            r = mid - 1;
        }
    }
    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: arr.map((_, i)=>i), foundIndex: -1, isFinished: true };
}
