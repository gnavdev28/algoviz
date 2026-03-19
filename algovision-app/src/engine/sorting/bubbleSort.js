export function* bubbleSort(array) {
  let arr = [...array];
  let n = arr.length;
  
  yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: [], pseudoLine: 0 };

  for (let i = 0; i < n - 1; i++) {
    yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: Array.from({length: i}, (_, k) => n - 1 - k), pseudoLine: 1 };
    
    for (let j = 0; j < n - i - 1; j++) {
      yield { array: [...arr], activeIndices: [j, j + 1], swapIndices: [], sortedIndices: Array.from({length: i}, (_, k) => n - 1 - k), pseudoLine: 2 };
      
      if (arr[j].val > arr[j + 1].val) {
        yield { array: [...arr], activeIndices: [], swapIndices: [j, j + 1], sortedIndices: Array.from({length: i}, (_, k) => n - 1 - k), pseudoLine: 3 };
        
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
        
        yield { array: [...arr], activeIndices: [], swapIndices: [j, j + 1], sortedIndices: Array.from({length: i}, (_, k) => n - 1 - k), pseudoLine: 4 };
      }
    }
  }
  
  // Finish state
  yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: Array.from({length: n}, (_, k) => k), pseudoLine: 5, pseudoLineStatus: 'success', isFinished: true };
}
