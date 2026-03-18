export function* linearSearch(initialArray, extraArgs = {}) {
    let arr = [...initialArray];
    let target = extraArgs.target || (arr.length > 0 ? arr[0].val : 0);
    
    for (let i = 0; i < arr.length; i++) {
        yield { array: arr, activeIndices: [i], swapIndices: [], sortedIndices: [], foundIndex: -1, isFinished: false };
        if (arr[i].val === target) {
            yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [], foundIndex: i, isFinished: true };
            return;
        }
    }
    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: arr.map((_, i)=>i), foundIndex: -1, isFinished: true };
}
