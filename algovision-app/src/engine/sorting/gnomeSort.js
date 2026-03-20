export function* gnomeSort(array) {
  let arr = [...array];
  let n = arr.length;
  let i = 0;

  yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: [], pseudoLine: 1 };

  while (i < n) {
    yield { array: [...arr], activeIndices: [i, i > 0 ? i - 1 : i], swapIndices: [], sortedIndices: [], pseudoLine: 3 };

    if (i === 0 || arr[i].val >= arr[i - 1].val) {
      i++;
      yield { array: [...arr], activeIndices: [i - 1], swapIndices: [], sortedIndices: [], pseudoLine: 4 };
    } else {
      yield { array: [...arr], activeIndices: [], swapIndices: [i, i - 1], sortedIndices: [], pseudoLine: 6 };
      let temp = arr[i];
      arr[i] = arr[i - 1];
      arr[i - 1] = temp;
      
      yield { array: [...arr], activeIndices: [], swapIndices: [i, i - 1], sortedIndices: [], pseudoLine: 7 };
      i--;
    }
  }
  
  yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: Array.from({length: n}, (_, k) => k), pseudoLine: 8, pseudoLineStatus: 'success', isFinished: true };
}
