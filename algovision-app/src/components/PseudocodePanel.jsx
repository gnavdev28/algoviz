import { useState, useRef, useCallback } from 'react';
import { PSEUDOCODE } from '../engine/pseudocodeData';

/**
 * @param {string} algoType - key trong PSEUDOCODE
 * @param {number} activeLine - index dòng đang active
 * @param {'active'|'success'|'error'} lineStatus - trạng thái màu của dòng active
 *   - 'active' (default): amber/vàng — đang thực thi
 *   - 'success': emerald/xanh — hoàn thành thành công
 *   - 'error': red/đỏ — không đạt điều kiện
 */
const PseudocodePanel = ({ algoType, activeLine, lineStatus = 'active' }) => {
  const lines = PSEUDOCODE[algoType] || [];
  const [height, setHeight] = useState(140);
  const isDragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(0);

  const onMouseDown = useCallback((e) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startH.current = height;
    document.body.style.cursor = 'ns-resize';
    document.body.style.userSelect = 'none';

    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const delta = startY.current - e.clientY;
      setHeight(Math.max(60, Math.min(500, startH.current + delta)));
    };
    const onMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [height]);

  // Biến thể màu sắc dựa trên lineStatus
  const getLineStyles = (isActive) => {
    if (!isActive) {
      return {
        bg: 'border-l-[3px] border-transparent text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-gray-800/50',
        num: 'text-slate-300 dark:text-gray-600',
      };
    }
    switch (lineStatus) {
      case 'success':
        return {
          bg: 'bg-emerald-100 dark:bg-emerald-500/15 border-l-[3px] border-emerald-500 ml-0 text-emerald-900 dark:text-emerald-200 font-bold',
          num: 'text-emerald-600 dark:text-emerald-400',
        };
      case 'error':
        return {
          bg: 'bg-red-100 dark:bg-red-500/15 border-l-[3px] border-red-500 ml-0 text-red-900 dark:text-red-200 font-bold',
          num: 'text-red-600 dark:text-red-400',
        };
      default: // 'active'
        return {
          bg: 'bg-amber-100 dark:bg-amber-500/15 border-l-[3px] border-amber-500 ml-0 text-amber-900 dark:text-amber-200 font-bold',
          num: 'text-amber-600 dark:text-amber-400',
        };
    }
  };

  return (
    <div className="w-full shrink-0 flex flex-col" style={{ height: `${height}px` }}>
      {/* Drag handle */}
      <div
        onMouseDown={onMouseDown}
        className="h-2 cursor-ns-resize bg-gradient-to-b from-slate-200 to-slate-100 dark:from-gray-700 dark:to-gray-800 border-t border-b border-slate-300 dark:border-gray-600 flex items-center justify-center hover:from-indigo-100 hover:to-slate-100 dark:hover:from-indigo-900/30 dark:hover:to-gray-800 transition-colors group"
      >
        <div className="w-10 h-[3px] rounded-full bg-slate-400 dark:bg-gray-500 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-400 transition-colors" />
      </div>

      {/* Header */}
      <div className="px-4 py-1.5 bg-slate-100 dark:bg-gray-900/80 flex items-center justify-between border-b border-slate-200 dark:border-gray-700/50">
        <h3 className="font-bold text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400 inline-block" />
          PSEUDOCODE
        </h3>
        <span className="text-[9px] text-slate-400 dark:text-slate-500">
          kéo để thay đổi kích thước
        </span>
      </div>

      {/* Code lines */}
      <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-[#0d1117] px-3 py-1.5 font-mono text-[11px] leading-[1.6]">
        {lines.map((line, idx) => {
          const isActive = idx === activeLine;
          const styles = getLineStyles(isActive);
          return (
            <div
              key={idx}
              className={`flex items-center gap-2 px-2 py-[2px] rounded transition-all duration-200 ${styles.bg}`}
            >
              <span className={`w-4 text-right shrink-0 select-none tabular-nums text-[9px] ${styles.num}`}>
                {idx}
              </span>
              <code className="whitespace-pre">{line}</code>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PseudocodePanel;
