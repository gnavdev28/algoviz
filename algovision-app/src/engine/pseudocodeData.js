/**
 * Pseudocode data cho tất cả thuật toán.
 * Mỗi mảng tương ứng với các pseudoLine mà engine yield ra.
 * Index 0 = dòng khởi tạo, các index tiếp theo map 1:1 với pseudoLine.
 */
export const PSEUDOCODE = {
  bubble: [
    'procedure bubbleSort(A[], n)',
    '  for i ← 0 to n-2 do          // Vòng lặp ngoài',
    '    for j ← 0 to n-i-2 do      // Vòng lặp trong',
    '      if A[j] > A[j+1] then    // So sánh cặp kề',
    '        swap(A[j], A[j+1])     // Hoán đổi',
    '  return A                      // ✓ Đã sắp xếp xong',
  ],

  quick: [
    'procedure quickSort(A[], low, high)',
    '  if low < high then',
    '    quickSort(A, low, pi - 1)   // Đệ quy nửa trái',
    '    quickSort(A, pi + 1, high)  // Đệ quy nửa phải',
    '  ─── partition(A, low, high) ───',
    '  pivot ← A[high]              // Chọn phần tử chốt',
    '  i ← low - 1',
    '  for j ← low to high-1 do     // Duyệt so sánh',
    '    if A[j] < pivot → swap     // Hoán đổi nếu nhỏ hơn pivot',
    '  swap(A[i+1], A[high])        // Đặt pivot vào giữa',
    '  return i + 1                  // Trả về vị trí pivot',
    '  return A                      // ✓ Đã sắp xếp xong',
  ],

  merge: [
    'procedure mergeSort(A[], l, r)',
    '  if l < r then',
    '    mid ← (l + r) / 2',
    '    mergeSort(A, l, mid)        // Đệ quy nửa trái',
    '    mergeSort(A, mid+1, r)      // Đệ quy nửa phải',
    '  ─── merge(A, l, mid, r) ───',
    '  Tách thành L[] và R[]         // Tạo mảng phụ',
    '  So sánh L[i] vs R[j]         // Chọn phần tử nhỏ hơn',
    '  Gộp phần tử vào A[k]         // Đưa về mảng chính',
    '  return A                      // ✓ Đã sắp xếp xong',
  ],

  linear: [
    'procedure linearSearch(A[], target)',
    '  for i ← 0 to n-1 do          // Duyệt tuần tự',
    '    if A[i] == target then      // So sánh',
    '      return i                  // ✓ Tìm thấy!',
    '  return -1                     // ✗ Không tìm thấy',
  ],

  binary: [
    'procedure binarySearch(A[], target)',
    '  A ← sort(A)                  // ⚠ Sắp xếp mảng trước',
    '  while left ≤ right do        // Thu hẹp phạm vi',
    '    mid ← (left + right) / 2',
    '    if A[mid] == target then    // So sánh giữa',
    '      return mid                // ✓ Tìm thấy!',
    '    if A[mid] < target then',
    '      left ← mid + 1           // Bỏ nửa trái',
    '    else',
    '      right ← mid - 1          // Bỏ nửa phải',
    '  return -1                     // ✗ Không tìm thấy',
  ],

  linkedlist_insert: [
    'procedure insert(list, value, pos)',
    '  Duyệt tìm vị trí chèn       // Traverse',
    '  newNode ← createNode(value)  // Tạo node mới tại vị trí',
    '  newNode.next ← current.next  // Nối con trỏ →',
    '  prev.next ← newNode          // Cập nhật prev →',
    '  return list                   // ✓ Chèn hoàn tất',
  ],

  linkedlist_delete: [
    'procedure delete(list, nodeId)',
    '  Duyệt tìm node cần xóa      // Traverse',
    '  Đánh dấu node sẽ xóa        // Mark delete',
    '  prev.next ← node.next       // Bỏ qua node',
    '  Giải phóng bộ nhớ            // ✓ Xóa hoàn tất',
  ],

  gnome: [
    'procedure gnomeSort(A[], n)',
    '  i ← 0',
    '  while i < n do',
    '    if i == 0 or A[i] >= A[i-1] then',
    '      i ← i + 1              // Bước tới',
    '    else',
    '      swap(A[i], A[i-1])     // Đẩy lùi',
    '      i ← i - 1              // Quay lại để kiểm tra',
    '  return A',
  ],

  thanos: [
    'procedure thanosSort(A[])',
    '  while !isSorted(A) do',
    '    Snap! (Phân rã ngẫu nhiên 1/2)',
    '    Wait for survivors...     // Chờ đợi hồi kết',
    '    if length <= 1 break      // Chỉ còn lại một nửa',
    '  return A                    // ✓ Vũ trụ đã được cân bằng',
  ],
};
