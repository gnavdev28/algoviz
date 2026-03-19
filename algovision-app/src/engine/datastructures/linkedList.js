/**
 * Singly Linked List Engine
 * Chứa logic thuần (không phụ thuộc React) cho thao tác trên DSLK đơn.
 */

/**
 * Tạo một node mới.
 */
export function createNode(val) {
  return { id: Math.random(), val, isNew: true };
}

/**
 * Tính toán vị trí chèn (targetIdx) dựa trên lựa chọn của người dùng.
 * @param {'head'|'tail'|'middle'} insertPos - Vị trí chèn
 * @param {string|number} insertIdx - Index nhập tay (dùng cho 'middle')
 * @param {number} listLength - Độ dài hiện tại của danh sách
 * @returns {number} targetIdx
 */
export function calcInsertIndex(insertPos, insertIdx, listLength) {
  if (insertPos === 'head') return 0;
  if (insertPos === 'tail') return listLength;
  
  let idx = parseInt(insertIdx);
  if (isNaN(idx) || idx < 0) idx = 0;
  if (idx > listLength) idx = listLength;
  return idx;
}

/**
 * Generator sinh ra từng bước animation cho thao tác CHÈN node vào DSLK.
 * Mỗi bước yield một object mô tả trạng thái animation.
 * 
 * @param {Array} nodes - Mảng node hiện tại
 * @param {object} newNode - Node mới cần chèn
 * @param {number} targetIdx - Vị trí chèn
 * @yields {object} step - { type, ...data }
 */
export function* linkedListInsert(nodes, newNode, targetIdx) {
  // Duyệt tìm vị trí chèn (highlight từng node)
  for (let i = 0; i < targetIdx; i++) {
    yield { type: 'HIGHLIGHT', activeId: nodes[i].id };
  }

  // Xác định node trước vị trí chèn
  const prevNodeId = targetIdx > 0 ? nodes[targetIdx - 1].id : 'HEAD';
  yield { type: 'HIGHLIGHT', activeId: prevNodeId };

  // Bước 1: Popup node mới tại vị trí chèn (inline giữa prev và next)
  yield { type: 'POPUP_NODE', node: { ...newNode, targetIdx } };

  // Bước 2: Nối mũi tên từ New Node sang Next Node (mũi tên xanh)
  yield { type: 'CONNECT_NEXT' };

  // Bước 3: Nối mũi tên từ Prev Node sang New Node (mũi tên vàng)
  yield { type: 'CONNECT_PREV', prevNodeId };

  // Bước 4: Chèn thật vào mảng, reset trạng thái
  const newNodes = [...nodes];
  newNodes.splice(targetIdx, 0, newNode);
  yield { type: 'FINALIZE', nodes: newNodes };
}

/**
 * Generator sinh ra từng bước animation cho thao tác XÓA node khỏi DSLK.
 * 
 * @param {Array} nodes - Mảng node hiện tại
 * @param {*} nodeId - ID của node cần xóa
 * @yields {object} step - { type, ...data }
 */
export function* linkedListDelete(nodes, nodeId) {
  const targetIdx = nodes.findIndex(n => n.id === nodeId);
  if (targetIdx === -1) return;

  // Duyệt highlight đến node cần xóa
  for (let i = 0; i <= targetIdx; i++) {
    yield { type: 'HIGHLIGHT', activeId: nodes[i].id };
  }

  // Đánh dấu xóa (animation fade-out)
  yield { type: 'MARK_DELETE', nodeId };

  // Xóa thật khỏi mảng
  yield { type: 'FINALIZE', nodes: nodes.filter(n => n.id !== nodeId) };
}
