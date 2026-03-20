import { useState, useMemo } from 'react';
import { bubbleSort } from '../engine/sorting/bubbleSort';
import { quickSort } from '../engine/sorting/quickSort';
import { mergeSort } from '../engine/sorting/mergeSort';
import { linearSearch } from '../engine/searching/linearSearch';
import { binarySearch } from '../engine/searching/binarySearch';
import { gnomeSort } from '../engine/sorting/gnomeSort';
import { thanosSort } from '../engine/sorting/thanosSort';
import { useAlgorithm } from '../hooks/useAlgorithm';
import { generateRandomArray } from '../utils/arrayUtils';
import { createNode, calcInsertIndex, linkedListInsert, linkedListDelete } from '../engine/datastruct/linkedList';
import PseudocodePanel from '../components/PseudocodePanel';
import UnlockModal from '../components/UnlockModal';

import { useEffect } from 'react';

const Workspace = ({ initialModule }) => {
  const [algoType, setAlgoType] = useState('bubble');

  useEffect(() => {
    if (initialModule === 'sort') setAlgoType('bubble');
    else if (initialModule === 'search') setAlgoType('linear');
    else if (initialModule === 'list') setAlgoType('linkedlist');
  }, [initialModule]);
  const [baseArray, setBaseArray] = useState(generateRandomArray(15));
  const [inputSize, setInputSize] = useState('15');
  const [inputManual, setInputManual] = useState('');
  const [inputError, setInputError] = useState('');
  const [targetVal, setTargetVal] = useState('');
  
  const [llNodes, setLlNodes] = useState(() => {
     let arr = [];
     for(let i=0; i<4; i++) arr.push({ id: Math.random(), val: Math.floor(Math.random() * 99) + 1 });
     return arr;
  });
  const [llInput, setLlInput] = useState('');
  const [llActiveId, setLlActiveId] = useState(null);
  const [llNewNode, setLlNewNode] = useState(null);
  const [llIsBusy, setLlIsBusy] = useState(false);
  const [llInsertPos, setLlInsertPos] = useState('tail');
  const [llInsertIdx, setLlInsertIdx] = useState('1');
  const [llPointerStatus, setLlPointerStatus] = useState(null);
  const [llOperation, setLlOperation] = useState(null);
  const [llPseudoLine, setLlPseudoLine] = useState(0);
  const [llPseudoLineStatus, setLlPseudoLineStatus] = useState('active');

  const [unlockedAlgos, setUnlockedAlgos] = useState(() => {
    const saved = localStorage.getItem('unlocked_algos');
    return saved ? JSON.parse(saved) : [];
  });
  const [unlockModal, setUnlockModal] = useState({ isOpen: false, algo: '' });

  const premiumAlgos = ['gnome', 'thanos'];

  const handleAlgoSelect = (val) => {
    if (premiumAlgos.includes(val) && !unlockedAlgos.includes(val)) {
      setUnlockModal({ isOpen: true, algo: val });
    } else {
      setAlgoType(val);
    }
  };

  const unlockAlgo = (name) => {
    const newList = [...unlockedAlgos, name];
    setUnlockedAlgos(newList);
    localStorage.setItem('unlocked_algos', JSON.stringify(newList));
    setAlgoType(name);
    setUnlockModal({ isOpen: false, algo: '' });
  };

  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const getGenerator = (type) => {
    switch (type) {
      case 'bubble': return bubbleSort;
      case 'quick': return quickSort;
      case 'merge': return mergeSort;
      case 'linear': return linearSearch;
      case 'binary': return binarySearch;
      case 'gnome': return gnomeSort;
      case 'thanos': return thanosSort;
      default: return bubbleSort;
    }
  };

  const extraArgs = useMemo(() => ({ target: targetVal === '' ? 0 : parseInt(targetVal) }), [targetVal]);

  const {
    array,
    state,
    isPlaying,
    speed,
    setSpeed,
    play,
    pause
  } = useAlgorithm(getGenerator(algoType), baseArray, extraArgs);

  const isSearching = ['linear', 'binary'].includes(algoType);
  const isLinkedList = algoType === 'linkedlist';

  const handleApplySize = () => {
    setInputError('');
    let size = parseInt(inputSize);
    if (isNaN(size) || size <= 0) {
       setInputError("Nhập số 1-50");
       return;
    }
    if (size > 50) {
      setInputError("Tối đa 50 phần tử");
      size = 50;
    }
    setBaseArray(generateRandomArray(size));
  };

  const handleApplyManual = () => {
    setInputError('');
    if (!inputManual.trim()) return;

    const vals = inputManual.split(',').map(v => parseInt(v.trim())).filter(v => !isNaN(v));
    if (vals.length === 0) {
      setInputError("Lỗi định dạng (VD: 1, 2, 3)");
      return;
    }
    if (vals.length > 50) {
      setInputError("Mảng quá lớn (>50)");
      return;
    }
    setBaseArray(vals.map(v => ({ id: Math.random(), val: v })));
  };

  const handleSetPreset = (type) => {
    setInputError('');
    let arr = [...baseArray];
    if (type === 'random') {
      setBaseArray(generateRandomArray(baseArray.length));
    } else if (type === 'sorted') {
      setBaseArray(arr.sort((a,b) => a.val - b.val).map(i => ({...i, id: Math.random()})));
    } else if (type === 'reversed') {
      setBaseArray(arr.sort((a,b) => b.val - a.val).map(i => ({...i, id: Math.random()})));
    }
  };

  const handleLLInsert = async () => {
      if(llIsBusy) return;
      let v = parseInt(llInput);
      if(isNaN(v)) return;
      
      setLlIsBusy(true);
      setLlInput('');
      setLlOperation('insert');
      setLlPseudoLine(0);
      setLlPseudoLineStatus('active');
      const newNode = createNode(v);
      const targetIdx = calcInsertIndex(llInsertPos, llInsertIdx, llNodes.length);
      const gen = linkedListInsert(llNodes, newNode, targetIdx);

      for (const step of gen) {
        switch (step.type) {
          case 'HIGHLIGHT':
            setLlActiveId(step.activeId);
            setLlPseudoLine(1);
            await sleep(500);
            break;
          case 'POPUP_NODE':
            setLlNewNode(step.node);
            setLlPointerStatus({ step: 1 });
            setLlPseudoLine(2);
            await sleep(800);
            break;
          case 'CONNECT_NEXT':
            setLlPointerStatus({ step: 2 });
            setLlPseudoLine(3);
            await sleep(800);
            break;
          case 'CONNECT_PREV':
            setLlPointerStatus({ step: 3, activeArrowNodeId: step.prevNodeId });
            setLlPseudoLine(4);
            await sleep(800);
            break;
          case 'FINALIZE':
            setLlPointerStatus(null);
            setLlNodes(step.nodes);
            setLlNewNode(null);
            setLlActiveId(null);
            setLlPseudoLine(5);
            setLlPseudoLineStatus('success');
            break;
        }
      }
      setLlIsBusy(false);
      setTimeout(() => { setLlOperation(null); setLlPseudoLine(0); setLlPseudoLineStatus('active'); }, 2000);
  };

  const handleLLDelete = async (id) => {
      if(llIsBusy) return;
      setLlIsBusy(true);
      setLlOperation('delete');
      setLlPseudoLine(0);
      setLlPseudoLineStatus('active');
      const gen = linkedListDelete(llNodes, id);

      for (const step of gen) {
        switch (step.type) {
          case 'HIGHLIGHT':
            setLlActiveId(step.activeId);
            setLlPseudoLine(1);
            await sleep(500);
            break;
          case 'MARK_DELETE':
            setLlNodes(prev => prev.map(n => n.id === step.nodeId ? { ...n, isDeleting: true } : n));
            setLlPseudoLine(2);
            await sleep(300);
            break;
          case 'FINALIZE':
            setLlNodes(step.nodes);
            setLlActiveId(null);
            setLlPseudoLine(4);
            setLlPseudoLineStatus('success');
            break;
        }
      }
      setLlIsBusy(false);
      setTimeout(() => { setLlOperation(null); setLlPseudoLine(0); setLlPseudoLineStatus('active'); }, 2000);
  };


  const maxValue = Math.max(...baseArray.map(i => i.val));
  const animTime = Math.max(20, 200 / speed);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-white dark:bg-[#0d1117] text-black dark:text-white">
      {/* Sidebar Controls */}
      <div className="w-full md:w-72 border-r-4 border-black dark:border-r dark:border-gray-800 flex flex-col shrink-0 overflow-y-auto bg-slate-50 dark:bg-[#161b22]">
        <div className="p-5">
          <h2 className="font-black text-xl mb-6 uppercase tracking-tighter border-b-4 border-black dark:border-b dark:border-gray-700 pb-2">BẢNG ĐIỀU KHIỂN</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 dark:text-slate-400">Bước 1: Chọn Module</label>
              <select 
                value={algoType}
                onChange={(e) => handleAlgoSelect(e.target.value)}
                disabled={isPlaying}
                className="w-full bg-white dark:bg-gray-800/80 text-black dark:text-white border-4 border-black dark:border dark:border-gray-700 shadow-[4px_4px_0_0_#000] dark:shadow-none rounded-none dark:rounded-md py-3 px-3 text-xs font-bold uppercase cursor-pointer"
              >
                <optgroup label="Sắp xếp">
                  <option value="bubble">Bubble Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="merge">Merge Sort</option>
                  <option value="gnome">{unlockedAlgos.includes('gnome') ? 'Gnome Sort' : 'Gnome Sort 🔒'}</option>
                  <option value="thanos">{unlockedAlgos.includes('thanos') ? 'Thanos Sort' : 'Thanos Sort 🔒'}</option>
                </optgroup>
                <optgroup label="Tìm kiếm">
                  <option value="linear">Linear Search</option>
                  <option value="binary">Binary Search</option>
                </optgroup>
                <optgroup label="Cấu trúc dữ liệu">
                  <option value="linkedlist">Singly Linked List</option>
                </optgroup>
              </select>
            </div>

            {!isLinkedList && (
              <>
                <div className="pt-2 border-t-4 border-black dark:border-t dark:border-gray-700">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 dark:text-slate-400">TỐC ĐỘ [{speed.toFixed(1)}x]</label>
                  <input 
                    type="range" min="0.5" max="5.0" step="0.5" 
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-black dark:accent-white cursor-ew-resize" 
                  />
                </div>

                <div className="border-t-4 border-black dark:border-t dark:border-gray-700 pt-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-500">1. Số lượng ngẫu nhiên</label>
                      <div className="flex gap-2">
                        <input 
                          type="number"
                          placeholder="Size"
                          value={inputSize}
                          onChange={(e) => { setInputSize(e.target.value); setInputError(''); }}
                          disabled={isPlaying}
                          className="flex-1 border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-bold outline-none"
                        />
                        <button onClick={handleApplySize} disabled={isPlaying} className="bg-black dark:bg-indigo-600 text-white px-4 py-2 text-[10px] font-black uppercase">Tạo</button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest mb-2 text-slate-500">2. Nhập mảng tay</label>
                      <input 
                        type="text"
                        placeholder="VD: 10, 2, 35, 8"
                        value={inputManual}
                        onChange={(e) => { setInputManual(e.target.value); setInputError(''); }}
                        disabled={isPlaying}
                        className="w-full border-4 border-black dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-mono outline-none mb-2"
                      />
                      <button onClick={handleApplyManual} disabled={isPlaying || !inputManual} className="w-full bg-black dark:bg-indigo-600 text-white py-2 text-[10px] font-black uppercase">Áp dụng mảng</button>
                    </div>

                    {inputError && <p className="text-[10px] text-red-500 font-bold uppercase">{inputError}</p>}
                    
                    <div className="grid grid-cols-3 gap-1 pt-2 border-t-2 border-dashed border-slate-200 dark:border-gray-800">
                        <button onClick={() => handleSetPreset('random')} disabled={isPlaying} className="text-[9px] font-bold border-2 border-black dark:border-gray-700 py-1 hover:bg-slate-100 dark:hover:bg-gray-700 uppercase">Reshuffle</button>
                        <button onClick={() => handleSetPreset('sorted')} disabled={isPlaying} className="text-[9px] font-bold border-2 border-black dark:border-gray-700 py-1 hover:bg-slate-100 dark:hover:bg-gray-700 uppercase">Sắp xếp</button>
                        <button onClick={() => handleSetPreset('reversed')} disabled={isPlaying} className="text-[9px] font-bold border-2 border-black dark:border-gray-700 py-1 hover:bg-slate-100 dark:hover:bg-gray-700 uppercase">Ngược</button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {isSearching && (
              <div className="border-t-4 border-black dark:border-t dark:border-gray-700 pt-6">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 dark:text-slate-400">Target (Số cần tìm)</label>
                  <input 
                    type="number"
                    value={targetVal}
                    onChange={(e) => setTargetVal(e.target.value)}
                    disabled={isPlaying}
                    className="w-full border-4 border-black dark:border dark:border-gray-700 bg-white dark:bg-gray-800/80 text-black dark:text-white px-3 py-2 text-xl font-black font-mono outline-none shadow-[4px_4px_0_0_#000] dark:shadow-none dark:rounded-md"
                  />
              </div>
            )}

            {isLinkedList && (
              <div className="border-t-4 border-black dark:border-t dark:border-gray-700 pt-6">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500 dark:text-slate-400">Thao tác Singly Linked List</label>
                  <div className="flex flex-col gap-4">
                      <div className="flex flex-col xl:flex-row gap-2">
                          <select 
                             value={llInsertPos} 
                             onChange={e=>setLlInsertPos(e.target.value)} 
                             disabled={llIsBusy}
                             className="flex-1 border-4 border-black dark:border dark:border-gray-700 bg-white dark:bg-gray-800/80 text-black dark:text-white px-2 py-2 text-xs font-black uppercase outline-none shadow-[4px_4px_0_0_#000] dark:shadow-none dark:rounded-md"
                          >
                             <option value="head">Vào Đầu (Head)</option>
                             <option value="tail">Vào Cuối (Tail)</option>
                             <option value="middle">Thêm vào giữa</option>
                          </select>
                          {llInsertPos === 'middle' && (
                              <input 
                                type="number" 
                                value={llInsertIdx}
                                onChange={e => setLlInsertIdx(e.target.value)}
                                disabled={llIsBusy}
                                className="w-full xl:w-20 border-4 border-black dark:border dark:border-gray-700 bg-white dark:bg-gray-800/80 text-black dark:text-white font-black text-center outline-none shadow-[4px_4px_0_0_#000] dark:shadow-none dark:rounded-md p-1" 
                                min="0" max={llNodes.length}
                                placeholder="Idx"
                              />
                          )}
                      </div>
                      <input 
                        type="number"
                        placeholder="Nhập giá trị..."
                        value={llInput}
                        onChange={(e) => setLlInput(e.target.value)}
                        disabled={llIsBusy}
                        className="w-full border-4 border-black dark:border dark:border-gray-700 bg-white dark:bg-gray-800/80 text-black dark:text-white px-3 py-3 text-xl font-black font-mono outline-none shadow-[4px_4px_0_0_#000] dark:shadow-none dark:rounded-md"
                      />
                      <button onClick={handleLLInsert} disabled={!llInput || llIsBusy} className="w-full uppercase font-black border-4 border-black dark:border dark:border-gray-600 text-sm px-4 py-3 bg-black dark:bg-indigo-600 text-white hover:-translate-y-1 hover:bg-white dark:hover:bg-indigo-500 hover:text-black dark:hover:text-white hover:shadow-[4px_4px_0_0_#000] dark:hover:shadow-none dark:rounded-md transition-all disabled:opacity-50">CHÈN NODE (INSERT)</button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase mt-4 text-center border-2 border-dashed border-slate-300 dark:border-gray-700/50 p-2">💡 Hover & Click vào Node để Xóa</p>
              </div>
            )}
          </div>
          
          {!isLinkedList && (
             <div className="flex flex-col gap-4 mt-6 pt-6 border-t-4 border-black dark:border-t dark:border-gray-700">
                {isPlaying ? (
                  <button onClick={pause} className="uppercase tracking-widest text-sm font-black border-4 border-black dark:border dark:border-gray-600 shadow-[4px_4px_0_0_#000] dark:shadow-none bg-white dark:bg-gray-800 text-black dark:text-white py-4 hover:shadow-none hover:translate-y-1 transition-all dark:rounded-md">TẠM DỪNG</button>
                ) : (
                  <button onClick={play} className="uppercase tracking-widest text-sm font-black border-4 border-black dark:border dark:border-indigo-500 shadow-[6px_6px_0_0_#000] dark:shadow-lg dark:shadow-indigo-500/20 bg-black dark:bg-indigo-600 text-white py-4 hover:shadow-none hover:translate-y-1 dark:hover:bg-indigo-500 transition-all dark:rounded-md">BẮT ĐẦU CHẠY</button>
                )}
             </div>
          )}
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 flex flex-col min-w-0 p-6 pb-2 bg-white dark:bg-[#0d1117] relative overflow-auto pattern-grid">
          {!isLinkedList && !isSearching && (
            <div className="w-full max-w-5xl flex-1 relative mx-auto border-b-8 border-black dark:border-gray-600 pb-1 mt-auto">
              {baseArray.map((block) => {
                const currentIdx = array.findIndex(x => x.id === block.id);
                if (currentIdx === -1) return null;
                
                const isActive = state.activeIndices.includes(currentIdx);
                const isSwapping = state.swapIndices.includes(currentIdx);
                const isAux = state.auxIndices?.includes(currentIdx);
                const isSorted = state.sortedIndices.includes(currentIdx);
                
                let colorClass = "bg-blue-500 border-black dark:border-blue-400";
                let transformClass = "";
                
                if (state.isFinished || isSorted) {
                    colorClass = "bg-green-500 border-black dark:border-green-400";
                } else {
                    if (isAux) {
                        transformClass = "-translate-y-8 md:-translate-y-16 scale-95";
                        colorClass = "bg-purple-400 border-black dark:border-purple-300 shadow-[4px_8px_0_0_#000] dark:shadow-[4px_8px_0_0_rgba(0,0,0,0.5)] opacity-80 z-10";
                    }
                    
                    if (isActive) {
                        colorClass = isAux ? "bg-yellow-400 border-black dark:border-yellow-300 shadow-[8px_16px_0_0_#000] z-20 scale-100" : "bg-yellow-400 border-black dark:border-yellow-300 scale-105 shadow-xl z-20";
                    }
                    
                    if (isSwapping) {
                        colorClass = isAux ? "bg-red-500 border-black dark:border-red-400 shadow-[8px_16px_0_0_#000] z-30 scale-110" : "bg-red-500 border-black dark:border-red-400 scale-105 shadow-xl z-30";
                    }
                }
                
                const heightPercent = maxValue > 0 ? `${(block.val / maxValue) * 100}%` : '5%';
                const leftPercent = `calc(${(currentIdx / baseArray.length) * 100}% + 1px)`;
                const widthPercent = `calc(${(1 / baseArray.length) * 100}% - 2px)`;
                
                return (
                  <div key={block.id} className={`absolute bottom-0 ease-in-out ${colorClass} ${transformClass} flex flex-col justify-start items-center overflow-hidden border-4 z-10 box-border`}
                    style={{ height: heightPercent, left: leftPercent, width: widthPercent, transitionProperty: "left, background-color, transform, box-shadow", transitionDuration: `${animTime}ms` }}>
                    <span className="text-[12px] font-black mt-2 bg-black text-white px-1 leading-none z-10">{block.val}</span>
                  </div>
                );
              })}
            </div>
          )}

          {isSearching && (
              <div className="w-full max-w-5xl mx-auto flex flex-wrap justify-center items-center gap-4 mt-auto mb-auto">
                  {array.map((block, idx) => {
                      const isActive = state.activeIndices.includes(idx);
                      const isMid = state.swapIndices.includes(idx); 
                      const isFound = state.foundIndex === idx;
                      const isDiscarded = state.sortedIndices.includes(idx);

                      let colorClass = "bg-white dark:bg-gray-800 text-black dark:text-white shadow-[6px_6px_0_0_#000] dark:shadow-[6px_6px_0_0_rgba(255,255,255,0.15)]";
                      if (isFound) colorClass = "bg-green-500 text-white scale-110 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_rgba(16,185,129,0.4)] -translate-y-2";
                      else if (isMid) colorClass = "bg-yellow-400 text-black scale-110 shadow-[8px_8px_0_0_#000] dark:shadow-[8px_8px_0_0_rgba(250,204,21,0.4)] -translate-y-2";
                      else if (isActive) colorClass = "bg-blue-200 dark:bg-blue-800 text-black dark:text-white";
                      else if (isDiscarded) colorClass = "bg-slate-200 dark:bg-gray-700 text-slate-400 dark:text-slate-500 border-slate-400 dark:border-gray-600 shadow-none scale-95";

                      return (
                          <div key={idx} className={`w-20 h-20 sm:w-24 sm:h-24 border-4 border-black dark:border-gray-600 flex items-center justify-center font-black text-3xl transition-transform duration-300 ${colorClass}`}>
                              {block.val}
                          </div>
                      )
                  })}
              </div>
          )}

          {isLinkedList && (
              <div className="w-full h-full flex flex-col items-center justify-center relative p-4 bg-slate-50 dark:bg-[#0d1117]">
                  <style>{`
                    @keyframes llNodeEnter {
                      from { opacity: 0; transform: scale(0.5); }
                      to { opacity: 1; transform: scale(1); }
                    }
                    .ll-node-enter { animation: llNodeEnter 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                    @keyframes popupNode {
                      0% { opacity: 0; transform: scale(0) translateY(15px); }
                      60% { opacity: 1; transform: scale(1.1) translateY(-2px); }
                      100% { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .animate-popup { animation: popupNode 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
                    @keyframes arrowGrow {
                      0% { opacity: 0; transform: scaleX(0); }
                      100% { opacity: 1; transform: scaleX(1); }
                    }
                    .arrow-grow { animation: arrowGrow 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards; transform-origin: left center; }
                    .ll-arrow { transition: all 0.3s ease; }
                  `}</style>
                  
                  <div className="w-full flex flex-nowrap items-center justify-start gap-0 px-6 z-10 overflow-x-auto min-h-[120px] py-12">
                      {/* HEAD */}
                      <div className="flex items-center flex-shrink-0">
                          <div className={`font-bold text-xs px-2.5 py-1 rounded-md transition-all duration-300 ${llActiveId === 'HEAD' ? 'bg-amber-400 text-black scale-105 shadow-md' : 'bg-gray-800 dark:bg-gray-700 text-white border border-gray-700 dark:border-gray-600'}`}>HEAD</div>
                          <svg className={`w-5 h-5 ll-arrow ${(llPointerStatus?.activeArrowNodeId === 'HEAD' && llPointerStatus?.step >= 3) ? 'opacity-0' : ''}`} viewBox="0 0 20 10"><path d="M0 5 L14 5 M10 1 L16 5 L10 9" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-400 dark:text-slate-500"/></svg>
                      </div>

                      {/* New node insertion at head (targetIdx === 0) */}
                      {llNewNode && llNewNode.targetIdx === 0 && llPointerStatus && (
                          <div className="flex items-center flex-shrink-0 animate-popup">
                              {/* Arrow from prev (HEAD) to new node — shown via amber arrow when step >= 3 */}
                              {llPointerStatus.step >= 3 && llPointerStatus.activeArrowNodeId === 'HEAD' && (
                                  <svg className="w-5 h-5 shrink-0 arrow-grow" viewBox="0 0 20 10"><path d="M0 5 L14 5 M10 1 L16 5 L10 9" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400"/></svg>
                              )}
                              <div className="relative">
                                  <span className="absolute -top-4 left-0 text-[8px] font-bold uppercase text-emerald-400 tracking-wider">new</span>
                                  <div className="flex items-center rounded-md border-2 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/25">
                                      <div className="px-2 py-1 font-bold text-sm text-emerald-300 border-r border-emerald-500/30">{llNewNode.val}</div>
                                      <div className="px-1.5 py-1 text-emerald-400 text-[8px]">→</div>
                                  </div>
                              </div>
                              {/* Arrow from new node to next — green arrow */}
                              {llPointerStatus.step >= 2 && (
                                  <svg className="w-5 h-5 shrink-0 arrow-grow" viewBox="0 0 20 10"><path d="M0 5 L14 5 M10 1 L16 5 L10 9" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500"/></svg>
                              )}
                          </div>
                      )}

                      {/* Nodes */}
                      {llNodes.map((node, idx) => {
                          const isDeleting = node.isDeleting;
                          const isActive = node.id === llActiveId;
                          const isPrevArrowActive = llPointerStatus?.activeArrowNodeId === node.id;
                          const isTargetAfter = llNewNode && llNewNode.targetIdx === idx + 1;

                          return (
                              <div key={node.id} className="flex items-center group ll-node-enter flex-shrink-0" style={{ transition: 'all 0.3s ease', opacity: isDeleting ? 0 : 1, transform: isDeleting ? 'scale(0.5) translateY(-20px)' : 'none' }}>
                                  <div className="relative">
                                      <div className="absolute -top-4 left-0.5 text-[8px] font-mono text-slate-400 dark:text-slate-600">{idx}</div>
                                      <div 
                                        className={`flex items-center rounded-md cursor-pointer transition-all duration-300 relative border
                                          ${isActive 
                                            ? 'bg-amber-500/15 border-amber-400 shadow-md shadow-amber-500/20 scale-105 -translate-y-0.5' 
                                            : 'bg-white dark:bg-gray-800 border-slate-300 dark:border-gray-600 hover:-translate-y-0.5 hover:shadow-md hover:border-red-400 dark:hover:border-red-400'
                                          }
                                        `} 
                                        onClick={() => handleLLDelete(node.id)}
                                      >
                                          <div className={`px-2 py-1 font-bold text-sm border-r transition-colors ${isActive ? 'text-amber-300 border-amber-400/50' : 'text-black dark:text-slate-200 border-slate-200 dark:border-gray-600 group-hover:text-red-500'}`}>{node.val}</div>
                                          <div className={`px-1.5 py-1 text-[8px] font-bold transition-colors ${isActive ? 'text-amber-400' : 'text-indigo-500 dark:text-indigo-400 group-hover:text-red-400'}`}>→</div>
                                          
                                          {!llIsBusy && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-[8px] leading-none shadow-sm">✕</div>}
                                      </div>
                                  </div>
                                  
                                  {/* Arrow to next — hide if this node's arrow is being redirected */}
                                  <svg className={`w-4 h-5 ll-arrow shrink-0 ${(isPrevArrowActive && llPointerStatus?.step >= 3) ? 'opacity-0' : ''}`} viewBox="0 0 16 10">
                                    <path d="M0 5 L10 5 M7 2 L12 5 L7 8" fill="none" stroke="currentColor" strokeWidth="1.5" className={isActive ? 'text-amber-400' : 'text-slate-300 dark:text-gray-600'}/>
                                  </svg>
                                  
                                  {/* New node inserting AFTER this node */}
                                  {isTargetAfter && llPointerStatus && (
                                      <div className="flex items-center flex-shrink-0 animate-popup">
                                          {/* Arrow from prev node to new node — amber */}
                                          {llPointerStatus.step >= 3 && isPrevArrowActive && (
                                              <svg className="w-5 h-5 shrink-0 arrow-grow" viewBox="0 0 20 10"><path d="M0 5 L14 5 M10 1 L16 5 L10 9" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-amber-400"/></svg>
                                          )}
                                          <div className="relative">
                                              <span className="absolute -top-4 left-0 text-[8px] font-bold uppercase text-emerald-400 tracking-wider">new</span>
                                              <div className="flex items-center rounded-md border-2 border-emerald-500 bg-emerald-500/10 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/25">
                                                  <div className="px-2 py-1 font-bold text-sm text-emerald-300 border-r border-emerald-500/30">{llNewNode.val}</div>
                                                  <div className="px-1.5 py-1 text-emerald-400 text-[8px]">→</div>
                                              </div>
                                          </div>
                                          {/* Arrow from new node to next — green */}
                                          {llPointerStatus.step >= 2 && (
                                              <svg className="w-5 h-5 shrink-0 arrow-grow" viewBox="0 0 20 10"><path d="M0 5 L14 5 M10 1 L16 5 L10 9" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-emerald-500"/></svg>
                                          )}
                                      </div>
                                  )}
                              </div>
                          )
                      })}
                      {/* NULL terminator */}
                      <div className="text-xs font-mono text-slate-400 dark:text-gray-600 border border-dashed border-slate-300 dark:border-gray-700 px-2 py-1 rounded-md flex-shrink-0">NULL</div>
                  </div>
              </div>
          )}
        </div>

        {/* Pseudocode Panel - hiển thị bên dưới cho tất cả module */}
        {!isLinkedList && (
          <PseudocodePanel algoType={algoType} activeLine={state.pseudoLine} lineStatus={state.pseudoLineStatus} />
        )}
        {isLinkedList && llOperation && (
          <PseudocodePanel algoType={`linkedlist_${llOperation}`} activeLine={llPseudoLine} lineStatus={llPseudoLineStatus} />
        )}
      </div>

      <UnlockModal 
        isOpen={unlockModal.isOpen} 
        algoName={unlockModal.algo} 
        onClose={() => setUnlockModal({ isOpen: false, algo: '' })}
        onUnlock={unlockAlgo}
      />
    </div>
  );
};
export default Workspace;
