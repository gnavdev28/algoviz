export function* quickSort(initialArray) {
    let arr = [...initialArray];
    let activeIndices = [];
    let swapIndices = [];
    let sortedIndices = [];
    
    yield { array: [...arr], activeIndices, swapIndices, auxIndices: [], sortedIndices, pseudoLine: 0, isFinished: false };

    function* partition(low, high) {
        let pivot = arr[high].val;
        let i = low - 1;

        // Nhấc bổng Pivot (Phần tử chốt) lên để làm chuẩn so sánh
        yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [high], sortedIndices, pseudoLine: 5, isFinished: false };

        for (let j = low; j <= high - 1; j++) {
            // Highlight phần tử đang xét (Vàng)
            yield { array: [...arr], activeIndices: [j], swapIndices: [], auxIndices: [high], sortedIndices, pseudoLine: 7, isFinished: false };
            
            if (arr[j].val < pivot) {
                i++;
                // Chuyển sang Hoán vị (Đỏ)
                yield { array: [...arr], activeIndices: [], swapIndices: [i, j], auxIndices: [high], sortedIndices, pseudoLine: 8, isFinished: false };
                let temp = arr[i];
                arr[i] = arr[j];
                arr[j] = temp;
                yield { array: [...arr], activeIndices: [], swapIndices: [i, j], auxIndices: [high], sortedIndices, pseudoLine: 8, isFinished: false };
            }
        }
        
        // Pivot tiến hành chèn vào giữa
        yield { array: [...arr], activeIndices: [], swapIndices: [i + 1, high], auxIndices: [high], sortedIndices, pseudoLine: 9, isFinished: false };
        let temp = arr[i + 1];
        arr[i + 1] = arr[high];
        arr[high] = temp;
        
        // Thả Pivot rơi xuống vị trí đúng
        yield { array: [...arr], activeIndices: [], swapIndices: [i + 1, high], auxIndices: [], sortedIndices, pseudoLine: 10, isFinished: false };
        
        return i + 1;
    }

    function* qs(low, high) {
        yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [], sortedIndices, pseudoLine: 1, isFinished: false };
        if (low < high) {
            let pi = yield* partition(low, high);
            
            // Xóa pivot khỏi vùng chưa hoàn thành, đánh dấu Đã Xong (Xanh)
            sortedIndices.push(pi);
            yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [], sortedIndices, pseudoLine: 5, isFinished: false };

            yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [], sortedIndices, pseudoLine: 2, isFinished: false };
            yield* qs(low, pi - 1);
            
            yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [], sortedIndices, pseudoLine: 3, isFinished: false };
            yield* qs(pi + 1, high);
        } else if (low === high) {
            // Phần tử cuối cùng là đơn nguyên nên đương nhiên đã xong
            sortedIndices.push(low);
            yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [], sortedIndices, pseudoLine: 11, isFinished: false };
        }
    }

    yield* qs(0, arr.length - 1);
    
    // Gán cờ hoàn thành toàn bộ mảng
    sortedIndices = arr.map((_, idx) => idx);
    yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [], sortedIndices, pseudoLine: 11, isFinished: true };
}
