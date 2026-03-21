export function* thanosSort(array) {
  let arr = [...array];
  
  const isSorted = (a) => {
    for(let i=1; i<a.length; i++) if(a[i].val < a[i-1].val) return false;
    return true;
  }

  yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: [], pseudoLine: 0 };

  while (!isSorted(arr) && arr.length > 1) {
    // Kiểm tra xem đã sắp xếp chưa
    yield { array: [...arr], activeIndices: arr.map((_, i) => i), swapIndices: [], sortedIndices: [], pseudoLine: 1 };
    
    // Búng tay! (Đánh dấu tất cả cho hiệu ứng "búng tay")
    yield { array: [...arr], activeIndices: [], swapIndices: arr.map((_, i) => i), sortedIndices: [], pseudoLine: 2 };

    const mid = Math.floor(arr.length / 2);
    let indices = Array.from({length: arr.length}, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const survivors = indices.slice(0, mid).sort((a,b) => a - b);
    const newArr = survivors.map(idx => arr[idx]);
    
    arr = newArr;
    yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: [], pseudoLine: 3 };
    
    if (arr.length <= 1) {
        yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: [], pseudoLine: 4 };
        break;
    }
  }
  
  yield { array: [...arr], activeIndices: [], swapIndices: [], sortedIndices: arr.map((_, i) => i), pseudoLine: 5, pseudoLineStatus: 'success', isFinished: true };
}
