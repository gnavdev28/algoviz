import React, { useState, useMemo } from 'react';
import { bubbleSort } from '../engine/sorting/bubbleSort';
import { quickSort } from '../engine/sorting/quickSort';
import { mergeSort } from '../engine/sorting/mergeSort';
import { linearSearch } from '../engine/searching/linearSearch';
import { binarySearch } from '../engine/searching/binarySearch';
import { useBattle } from '../hooks/useBattle';
import { generateRandomArray } from '../utils/arrayUtils';
import { Play, Pause, RotateCcw, Zap, Trophy, Timer, Lock, ChevronDown, ChevronUp, Settings as SettingsIcon } from 'lucide-react';
import { gnomeSort } from '../engine/sorting/gnomeSort';
import { thanosSort } from '../engine/sorting/thanosSort';
import UnlockModal from '../components/UnlockModal';

const ALGORITHMS = {
  bubble: { name: 'Bubble Sort', gen: bubbleSort, type: 'sort' },
  quick: { name: 'Quick Sort', gen: quickSort, type: 'sort' },
  merge: { name: 'Merge Sort', gen: mergeSort, type: 'sort' },
  gnome: { name: 'Gnome Sort', gen: gnomeSort, type: 'sort', isPremium: true },
  thanos: { name: 'Thanos Sort', gen: thanosSort, type: 'sort', isPremium: true },
  linear: { name: 'Linear Search', gen: linearSearch, type: 'search' },
  binary: { name: 'Binary Search', gen: binarySearch, type: 'search' },
};

const Battle = () => {
  const [algoLeft, setAlgoLeft] = useState('bubble');
  const [algoRight, setAlgoRight] = useState('quick');
  const [baseArray, setBaseArray] = useState(generateRandomArray(15));
  const [inputSize, setInputSize] = useState('15');
  const [inputManual, setInputManual] = useState('');
  const [inputError, setInputError] = useState('');
  const [targetVal, setTargetVal] = useState('42');
  const [isControlsOpen, setIsControlsOpen] = useState(true);

  const [unlockedAlgos, setUnlockedAlgos] = useState(() => {
    const saved = localStorage.getItem('unlocked_algos');
    return saved ? JSON.parse(saved) : [];
  });
  const [unlockModal, setUnlockModal] = useState({ isOpen: false, algo: '', side: 'left' });

  const handleSelectAlgo = (val, side) => {
    if (ALGORITHMS[val].isPremium && !unlockedAlgos.includes(val)) {
      setUnlockModal({ isOpen: true, algo: val, side });
    } else {
      if (side === 'left') setAlgoLeft(val);
      else setAlgoRight(val);
    }
  };

  const unlockAlgo = (name) => {
    const newList = [...unlockedAlgos, name];
    setUnlockedAlgos(newList);
    localStorage.setItem('unlocked_algos', JSON.stringify(newList));
    if (unlockModal.side === 'left') setAlgoLeft(name);
    else setAlgoRight(name);
    setUnlockModal({ isOpen: false, algo: '', side: 'left' });
  };

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
    
    // Do not force sort anymore, let user decide
    const newArr = [...baseArray];
    setBaseArray(newArr);
    init(newArr);
  };


  const handleApplySize = () => {
    setInputError('');
    let size = parseInt(inputSize);
    if (isNaN(size) || size <= 0) {
       setInputError("Lỗi");
       return;
    }
    if (size > 50) size = 50;
    const newArr = generateRandomArray(size);
    setBaseArray(newArr);
    init(newArr);
  };

  const handleApplyManual = () => {
    setInputError('');
    if (!inputManual.trim()) return;

    const vals = inputManual.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (vals.length === 0) {
      setInputError("Sai định dạng");
      return;
    }
    if (vals.length > 50) {
      setInputError("Máx 50");
      return;
    }
    const newArr = vals.map(v => ({ id: Math.random(), val: v }));
    setBaseArray(newArr);
    init(newArr);
  };

  const handleSetPreset = (type) => {
    setInputError('');
    let arr = [...baseArray];
    let newArr = [];
    if (type === 'random') {
      newArr = generateRandomArray(baseArray.length);
    } else if (type === 'sorted') {
      newArr = arr.sort((a,b) => a.val - b.val).map(i => ({...i, id: Math.random()}));
    } else if (type === 'reversed') {
      newArr = arr.sort((a,b) => b.val - a.val).map(i => ({...i, id: Math.random()}));
    }
    
    setBaseArray(newArr);
    init(newArr);
  };


  const getBarColorInHex = (idx, state, algoKey) => {
    const isSearch = ALGORITHMS[algoKey].type === 'search';
    const isDark = document.documentElement.classList.contains('dark');

    if (state.isFinished) {
      if (isSearch) {
        if (state.foundIndex !== -1) {
          return idx === state.foundIndex ? '#10b981' : (isDark ? '#374151' : '#cbd5e1'); // emerald-500 : Gray-700 / Slate-300
        }
        return isDark ? 'rgba(127, 29, 29, 0.4)' : '#f87171'; // red-900/40 : red-400
      }
      return '#10b981'; // emerald-500
    }

    if (state.sortedIndices.includes(idx)) return '#10b981';
    if (state.swapIndices.includes(idx)) return '#ef4444'; // red-500
    if (state.activeIndices.includes(idx)) return '#fbbf24'; // amber-400
    if (state.foundIndex === idx) return '#10b981';
    
    // Default blue
    return isSearch ? (isDark ? '#4b5563' : '#94a3b8') : (isDark ? '#2563eb' : '#3b82f6'); // blue-600 : blue-500
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

        <div className="p-4 flex items-end justify-center gap-1 h-[280px] sm:flex-1 bg-slate-100 dark:bg-gray-800/10 overflow-visible relative border-t-2 border-black dark:border-gray-800">
          {array.map((item, idx) => {
            const barHeight = (item.val / (maxValue || 1)) * 90 + 5;
            const barColor = getBarColorInHex(idx, state, algoKey);
            return (
              <div
                key={item.id}
                className="transition-all duration-300 rounded-t-sm relative border-t-2 border-black/40 dark:border-white/20 shadow-sm"
                style={{
                  height: `${barHeight}%`,
                  width: `${Math.floor(92 / array.length)}%`,
                  background: `linear-gradient(to top, ${barColor}, ${barColor}cc)`,
                  boxShadow: `0 0 10px ${barColor}33`,
                }}
              >
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white px-1 rounded pointer-events-none">
                  {item.val}
                </span>
              </div>
            );
          })}
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
      {/* Mobile Toggle Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b-2 border-black dark:border-gray-800 bg-slate-100 dark:bg-gray-900 z-50">
        <div className="flex items-center gap-2">
           <SettingsIcon size={14} className="text-slate-500" />
           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Bảng điều khiển</span>
        </div>
        <button 
          onClick={() => setIsControlsOpen(!isControlsOpen)}
          className="p-1 border-2 border-black dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[2px_2px_0_0_#000] dark:shadow-none transition-transform active:translate-y-0.5 active:shadow-none"
        >
          {isControlsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* Top Controls */}
      <div className={`${isControlsOpen ? 'flex' : 'hidden md:flex'} p-4 border-b-4 border-black dark:border-gray-800 flex flex-wrap items-center gap-6 bg-slate-50 dark:bg-gray-900/50 transition-all duration-300`}>
        
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
                onChange={(e) => handleSelectAlgo(e.target.value, 'left')}
                className="block w-40 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 px-2 py-1.5 text-xs font-bold uppercase focus:ring-0"
              >
                {filteredAlgos.map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.isPremium && !unlockedAlgos.includes(k) ? `${v.name} 🔒` : v.name}
                  </option>
                ))}
              </select>
           </div>
           <div className="pt-4 text-xl font-black italic text-slate-400">VS</div>
           <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-500">Thuật toán 2</label>
              <select 
                value={algoRight}
                onChange={(e) => handleSelectAlgo(e.target.value, 'right')}
                className="block w-40 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 px-2 py-1.5 text-xs font-bold uppercase focus:ring-0"
              >
                {filteredAlgos.map(([k, v]) => (
                  <option key={k} value={k}>
                    {v.isPremium && !unlockedAlgos.includes(k) ? `${v.name} 🔒` : v.name}
                  </option>
                ))}
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

        <div className="flex items-center gap-3">
           <div className="flex gap-1 border-r-2 border-slate-300 dark:border-gray-700 pr-3">
              <input 
                type="number"
                placeholder="Size"
                value={inputSize}
                onChange={(e) => { setInputSize(e.target.value); setInputError(''); }}
                disabled={isPlaying}
                className="w-12 bg-white dark:bg-gray-800 border-2 border-black dark:border-gray-700 px-1 py-1 text-[10px] font-bold"
              />
              <button 
                onClick={handleApplySize} 
                disabled={isPlaying}
                className="bg-purple-600 dark:bg-purple-700 text-white px-2 text-[8px] font-black uppercase hover:bg-purple-500 transition-colors"
              >
                Tạo
              </button>
           </div>
           
           <div className="flex flex-col relative">
              <div className="flex gap-1">
                <input 
                  type="text"
                  placeholder="Mảng: 1,2,3"
                  value={inputManual}
                  onChange={(e) => { setInputManual(e.target.value); setInputError(''); }}
                  disabled={isPlaying}
                  className={`w-28 bg-white dark:bg-gray-800 border-2 ${inputError ? 'border-red-500' : 'border-black dark:border-gray-700'} px-2 py-1 text-[10px] font-bold outline-none`}
                />
                <button 
                  onClick={handleApplyManual}
                  disabled={isPlaying || !inputManual}
                  className="bg-purple-600 dark:bg-purple-700 text-white px-2 py-1 flex items-center justify-center hover:bg-purple-500 text-[8px] font-black uppercase transition-colors"
                  title="Áp dụng mảng tay"
                >
                  Tạo
                </button>
              </div>
              {inputError && <span className="absolute -bottom-3 left-0 text-[7px] text-red-500 font-bold uppercase">{inputError}</span>}
           </div>

           <div className="flex border-2 border-black dark:border-gray-700">
              <button onClick={() => handleSetPreset('random')} disabled={isPlaying} className="px-2 py-1 text-[8px] font-bold border-r border-black dark:border-gray-700 hover:bg-slate-200 dark:hover:bg-gray-700" title="Reshuffle">⟳</button>
              <button onClick={() => handleSetPreset('sorted')} disabled={isPlaying} className="px-2 py-1 text-[8px] font-bold border-r border-black dark:border-gray-700 hover:bg-slate-200 dark:hover:bg-gray-700" title="Tăng">↑</button>
              <button onClick={() => handleSetPreset('reversed')} disabled={isPlaying} className="px-2 py-1 text-[8px] font-bold hover:bg-slate-200 dark:hover:bg-gray-700" title="Giảm">↓</button>
           </div>
        </div>
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
        </div>
      )}

      <UnlockModal 
        isOpen={unlockModal.isOpen}
        algoName={unlockModal.algo}
        onClose={() => setUnlockModal({ isOpen: false, algo: '', side: 'left' })}
        onUnlock={unlockAlgo}
      />
    </div>
  );
};

export default Battle;
