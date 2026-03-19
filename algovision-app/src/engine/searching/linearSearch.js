export function* linearSearch(initialArray, extraArgs = {}) {
    let arr = [...initialArray];
    let target = extraArgs.target || (arr.length > 0 ? arr[0].val : 0);

    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [], foundIndex: -1, pseudoLine: 0, isFinished: false };
    
    for (let i = 0; i < arr.length; i++) {
        // Duyệt tuần tự
        yield { array: arr, activeIndices: [i], swapIndices: [], sortedIndices: [], foundIndex: -1, pseudoLine: 1, isFinished: false };
        
        if (arr[i].val === target) {
            // So sánh → Tìm thấy!
            yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: [], foundIndex: i, pseudoLine: 3, pseudoLineStatus: 'success', isFinished: true };
            return;
        }
        // So sánh → Không khớp, tiếp tục
        yield { array: arr, activeIndices: [i], swapIndices: [], sortedIndices: [], foundIndex: -1, pseudoLine: 2, isFinished: false };
    }
    // Không tìm thấy
    yield { array: arr, activeIndices: [], swapIndices: [], sortedIndices: arr.map((_, i)=>i), foundIndex: -1, pseudoLine: 4, pseudoLineStatus: 'error', isFinished: true };
}
