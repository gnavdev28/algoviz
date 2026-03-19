import React, { useState, useMemo } from 'react';
import { bubbleSort } from '../engine/sorting/bubbleSort';
import { quickSort } from '../engine/sorting/quickSort';
import { mergeSort } from '../engine/sorting/mergeSort';
import { linearSearch } from '../engine/searching/linearSearch';
import { binarySearch } from '../engine/searching/binarySearch';
import { useBattle } from '../hooks/useBattle';
import { generateRandomArray } from '../utils/arrayUtils';
import { Play, Pause, RotateCcw, Zap, Trophy, Timer } from 'lucide-react';

const ALGORITHMS = {
  bubble: { name: 'Bubble Sort', gen: bubbleSort, type: 'sort' },
  quick: { name: 'Quick Sort', gen: quickSort, type: 'sort' },
  merge: { name: 'Merge Sort', gen: mergeSort, type: 'sort' },
  linear: { name: 'Linear Search', gen: linearSearch, type: 'search' },
  binary: { name: 'Binary Search', gen: binarySearch, type: 'search' },
};

const Battle = () => {
  const [algoLeft, setAlgoLeft] = useState('bubble');
  const [algoRight, setAlgoRight] = useState('quick');
  const [baseArray, setBaseArray] = useState(generateRandomArray(15));
  const [targetVal, setTargetVal] = useState('42');

  const extraArgs = useMemo(() => ({ target: parseInt(targetVal) || 0 }), [targetVal]);

  const {
    array1, state1,
    array2, state2,
    isPlaying, speed, setSpeed,
    play, pause, init
  } = useBattle(
    ALGORITHMS[algoLeft].gen,
    ALGORITHMS[algoRight].gen,
    baseArray,
    extraArgs,
    extraArgs
  );

  const [battleType, setBattleType] = useState('sort'); // 'sort' or 'search'

  const filteredAlgos = Object.entries(ALGORITHMS).filter(([, v]) => v.type === battleType);

  const handleTypeChange = (type) => {
    setBattleType(type);
    const firstOfNewType = Object.entries(ALGORITHMS).find(([, v]) => v.type === type)[0];
    setAlgoLeft(firstOfNewType);
    setAlgoRight(firstOfNewType);
    
    // For Search Battle, it's better to show a sorted array because Binary Search requires it
    const newArr = type === 'search' ? [...baseArray].sort((a, b) => a.val - b.val) : [...baseArray];
    setBaseArray(newArr);
    init(newArr);
  };

  const handleRandomize = () => {
    const newArr = generateRandomArray(15);
    setBaseArray(newArr);
    init(newArr);
  };

  const getBarColor = (idx, state, algoKey) => {
    const isSearch = ALGORITHMS[algoKey].type === 'search';
    
    // When finished
    if (state.isFinished) {
      if (isSearch) {
        if (state.foundIndex !== -1) {
          return idx === state.foundIndex ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)] scale-110 z-10' : 'bg-slate-300 dark:bg-gray-700 opacity-50';
        }
        return 'bg-red-400 dark:bg-red-900/40 opacity-50'; // Not found
      } else {
        return 'bg-emerald-500'; // Sorting finished -> all green
      }
    }

    if (state.sortedIndices.includes(idx)) return 'bg-emerald-500';
    if (state.swapIndices.includes(idx)) return 'bg-red-500 scale-110 z-10';
    if (state.activeIndices.includes(idx)) return 'bg-amber-400 scale-105 z-10';
    if (state.foundIndex === idx) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    return isSearch ? 'bg-slate-400 dark:bg-gray-600' : 'bg-indigo-500 dark:bg-indigo-600';
  };

  const renderViz = (array, state, title, algoKey) => {
    const maxValue = Math.max(...array.map(i => i.val), 1);
    const isSearch = ALGORITHMS[algoKey].type === 'search';

    return (
      <div className="flex-1 flex flex-col border-4 border-black dark:border-gray-800 bg-slate-50 dark:bg-gray-900 overflow-hidden relative group">
        <div className="p-4 border-b-4 border-black dark:border-gray-800 bg-white dark:bg-gray-800 flex items-center justify-between">
            <h3 className="font-black uppercase tracking-tighter text-lg flex items-center gap-2">
                <Zap className="text-amber-500" size={20} />
                {ALGORITHMS[algoKey].name}
            </h3>
            <div className="flex items-center gap-3 font-mono text-sm">
                <div className="flex items-center gap-1 text-slate-500">
                    <Timer size={14} />
                    <span>{state.totalTime || 0}ms</span>
                </div>
                {state.isFinished && (
                    <span className="bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                        {isSearch && state.foundIndex === -1 ? 'NOT FOUND' : 'FINISHED'}
                    </span>
                )}
            </div>
        </div>

        <div className="flex-1 p-6 flex items-end justify-center gap-1 min-h-[300px]">
          {array.map((item, idx) => (
            <div
              key={item.id}
              className={`transition-all duration-200 rounded-t-sm relative ${getBarColor(idx, state, algoKey)}`}
              style={{
                height: `${(item.val / maxValue) * 80 + 10}%`,
                width: `${Math.max(12, 100 / array.length)}%`,
              }}
            >
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                {item.val}
              </span>
            </div>
          ))}
        </div>
        
        {state.isFinished && (
            <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
                {/* Visual indicator of completion */}
            </div>
        )}
      </div>
    );
  };

  // Winner logic
  const winner = useMemo(() => {
    if (state1.isFinished && state2.isFinished) {
        if (state1.totalTime < state2.totalTime) return 'left';
        if (state2.totalTime < state1.totalTime) return 'right';
        return 'tie';
    }
    return null;
  }, [state1.isFinished, state2.isFinished, state1.totalTime, state2.totalTime]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-950">
      {/* Top Controls */}
      <div className="p-4 border-b-4 border-black dark:border-gray-800 flex flex-wrap items-center gap-6 bg-slate-50 dark:bg-gray-900/50">
        
        {/* Battle Type Segmented Control */}
        <div className="flex bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 p-1 rounded-sm">
            <button 
                onClick={() => handleTypeChange('sort')}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${battleType === 'sort' ? 'bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0_0_#ccc] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.1)]' : 'hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500'}`}
            >
                Sắp xếp
            </button>
            <button 
                onClick={() => handleTypeChange('search')}
                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-all ${battleType === 'search' ? 'bg-black text-white dark:bg-white dark:text-black shadow-[2px_2px_0_0_#ccc] dark:shadow-[2px_2px_0_0_rgba(255,255,255,0.1)]' : 'hover:bg-slate-100 dark:hover:bg-gray-700 text-slate-500'}`}
            >
                Tìm kiếm
            </button>
        </div>

        {battleType === 'search' && (
          <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-2 border-2 border-indigo-200 dark:border-indigo-800 rounded-sm animate-in fade-in zoom-in duration-300">
             <div className="flex flex-col">
                <label className="text-[10px] font-black uppercase text-indigo-500 dark:text-indigo-400">Giá trị cần tìm</label>
                <input 
                  type="number" 
                  value={targetVal}
                  onChange={(e) => setTargetVal(e.target.value)}
                  className="bg-transparent border-none p-0 text-sm font-black focus:ring-0 w-16"
                  placeholder="0"
                />
             </div>
          </div>
        )}

        <div className="flex items-center gap-4">
           <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Thuật toán 1</label>
              <select 
                value={algoLeft}
                onChange={(e) => setAlgoLeft(e.target.value)}
                className="block w-40 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 px-2 py-1.5 text-xs font-bold uppercase focus:ring-0"
              >
                {filteredAlgos.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
           </div>
           <div className="pt-4 text-xl font-black italic text-slate-400">VS</div>
           <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Thuật toán 2</label>
              <select 
                value={algoRight}
                onChange={(e) => setAlgoRight(e.target.value)}
                className="block w-40 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 px-2 py-1.5 text-xs font-bold uppercase focus:ring-0"
              >
                {filteredAlgos.map(([k, v]) => <option key={k} value={k}>{v.name}</option>)}
              </select>
           </div>
        </div>

        <div className="h-10 w-[1px] bg-slate-300 dark:bg-gray-700 mx-2 hidden md:block"></div>

        {/* Speed Control */}
        <div className="flex flex-col gap-1 min-w-[120px]">
          <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-500">
            <span>Tốc độ</span>
            <span className="text-indigo-600 dark:text-indigo-400">{speed}x</span>
          </div>
          <input 
            type="range" 
            min="0.5" 
            max="4" 
            step="0.5" 
            value={speed}
            onChange={(e) => setSpeed(parseFloat(e.target.value))}
            className="w-full h-1 bg-slate-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>

        <div className="h-10 w-[1px] bg-slate-300 dark:bg-gray-700 mx-2 hidden md:block"></div>

        <div className="flex items-center gap-2">
           <button 
             onClick={isPlaying ? pause : play}
             className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-widest text-xs flex items-center gap-2 border-b-4 border-indigo-900 transition-all active:border-b-0 active:translate-y-1"
           >
             {isPlaying ? <Pause size={14} /> : <Play size={14} />}
             {isPlaying ? 'Tạm dừng' : 'Bắt đầu đối đầu'}
           </button>
           <button 
             onClick={() => init(baseArray)}
             className="p-2 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors"
           >
             <RotateCcw size={16} />
           </button>
        </div>

        <button 
           onClick={handleRandomize}
           className="px-4 py-2 border-2 border-black dark:border-gray-700 text-xs font-black uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all ml-auto"
        >
          Tầng dữ liệu mới
        </button>
      </div>

      {/* Battle Arena */}
      <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 overflow-y-auto">
        <div className="flex-1 flex flex-col relative">
            {winner === 'left' && (
                <div className="absolute top-12 -right-4 z-10 animate-bounce">
                    <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                        <Trophy size={20} />
                    </div>
                </div>
            )}
            {renderViz(array1, state1, 'Trái', algoLeft)}
        </div>

        <div className="flex-1 flex flex-col relative">
            {winner === 'right' && (
                <div className="absolute top-12 -left-4 z-10 animate-bounce">
                    <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
                        <Trophy size={20} />
                    </div>
                </div>
            )}
            {renderViz(array2, state2, 'Phải', algoRight)}
        </div>
      </div>

      {/* Results Banner */}
      {winner && (
        <div className="bg-black text-white px-6 py-3 flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Trophy className="text-yellow-400" />
            <span className="font-black uppercase tracking-[0.2em]">
                {winner === 'tie' ? 'KẾT QUẢ HÒA!' : 
                 winner === 'left' ? `${ALGORITHMS[algoLeft].name} CHIẾN THẮNG!` : 
                 `${ALGORITHMS[algoRight].name} CHIẾN THẮNG!`}
            </span>
            <div className="h-4 w-[1px] bg-gray-700 mx-2"></div>
            <span className="text-xs font-mono text-gray-400">
                Lệch: {Math.abs(state1.totalTime - state2.totalTime)}ms
            </span>
        </div>
      )}
    </div>
  );
};

export default Battle;
