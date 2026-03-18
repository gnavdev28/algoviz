export function* mergeSort(initialArray) {
    let arr = initialArray.map(obj => ({ ...obj }));
    let activeIndices = [];
    let swapIndices = [];
    let sortedIndices = [];
    let auxIndices = [];

    yield { array: [...arr], activeIndices, swapIndices, auxIndices, sortedIndices, pseudoLine: 0, isFinished: false };

    function* mergeHelper(l, m, r) {
        let n1 = m - l + 1;
        let n2 = r - m;
        let L = new Array(n1);
        let R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = { ...arr[l + i] };
        for (let j = 0; j < n2; j++) R[j] = { ...arr[m + 1 + j] };

        let i = 0, j = 0, k = l;
        
        let getAux = () => {
            let res = [];
            for(let p = i; p < n1; p++) res.push(arr.findIndex(x => x.id === L[p].id));
            for(let p = j; p < n2; p++) res.push(arr.findIndex(x => x.id === R[p].id));
            return res;
        };

        // Đẩy trồi lên
        yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };

        while (i < n1 && j < n2) {
            let idL = L[i].id;
            let idR = R[j].id;
            let posL = arr.findIndex(x => x.id === idL);
            let posR = arr.findIndex(x => x.id === idR);

            yield { array: [...arr], activeIndices: [posL, posR], swapIndices: [], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            
            let chosenId = null;
            if (L[i].val <= R[j].val) {
                chosenId = idL;
                i++;
            } else {
                chosenId = idR;
                j++;
            }

            let currentPos = arr.findIndex(x => x.id === chosenId);
            // Highlight đỏ phần tử chuẩn bị rớt xuống
            yield { array: [...arr], activeIndices: [], swapIndices: [currentPos], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            
            let element = arr[currentPos];
            for(let p = currentPos; p > k; p--) {
                arr[p] = arr[p - 1]; 
            }
            arr[k] = element; 

            // Rớt xuống mảng chính, không còn trong aux
            yield { array: [...arr], activeIndices: [], swapIndices: [k], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            k++;
        }

        while (i < n1) {
            let chosenId = L[i].id;
            let currentPos = arr.findIndex(x => x.id === chosenId);
            
            yield { array: [...arr], activeIndices: [currentPos], swapIndices: [], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            yield { array: [...arr], activeIndices: [], swapIndices: [currentPos], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            
            let element = arr[currentPos];
            for(let p = currentPos; p > k; p--) arr[p] = arr[p - 1];
            arr[k] = element;
            
            yield { array: [...arr], activeIndices: [], swapIndices: [k], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            i++; k++;
        }
        
        while (j < n2) {
            let chosenId = R[j].id;
            let currentPos = arr.findIndex(x => x.id === chosenId);
            
            yield { array: [...arr], activeIndices: [currentPos], swapIndices: [], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            yield { array: [...arr], activeIndices: [], swapIndices: [currentPos], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            
            let element = arr[currentPos];
            for(let p = currentPos; p > k; p--) arr[p] = arr[p - 1];
            arr[k] = element;
            
            yield { array: [...arr], activeIndices: [], swapIndices: [k], auxIndices: getAux(), sortedIndices, pseudoLine: 0, isFinished: false };
            j++; k++;
        }
    }

    function* doMergeSort(l, r) {
        if (l >= r) return;
        let m = l + Math.floor((r - l) / 2);
        yield* doMergeSort(l, m);
        yield* doMergeSort(m + 1, r);
        yield* mergeHelper(l, m, r);
    }

    yield* doMergeSort(0, arr.length - 1);
    
    sortedIndices = arr.map((_, i) => i);
    yield { array: [...arr], activeIndices: [], swapIndices: [], auxIndices: [], sortedIndices, pseudoLine: 0, isFinished: true };
}
