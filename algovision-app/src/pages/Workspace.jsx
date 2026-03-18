import { useState, useMemo } from 'react';
import { bubbleSort } from '../engine/sorting/bubbleSort';
import { quickSort } from '../engine/sorting/quickSort';
import { mergeSort } from '../engine/sorting/mergeSort';
import { linearSearch } from '../engine/searching/linearSearch';
import { binarySearch } from '../engine/searching/binarySearch';
import { useAlgorithm } from '../hooks/useAlgorithm';
import { generateRandomArray } from '../utils/arrayUtils';
import { createNode, calcInsertIndex, linkedListInsert, linkedListDelete } from '../engine/datastructures/linkedList';

const Workspace = () => {
  const [algoType, setAlgoType] = useState('bubble');
  const [baseArray, setBaseArray] = useState(generateRandomArray(15));
  const [customInput, setCustomInput] = useState('');
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
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));

  const getGenerator = (type) => {
    switch (type) {
      case 'bubble': return bubbleSort;
      case 'quick': return quickSort;
      case 'merge': return mergeSort;
      case 'linear': return linearSearch;
      case 'binary': return binarySearch;
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

  const handleRandomize = () => {
    setBaseArray(generateRandomArray(15));
    setCustomInput('');
  };

  const handleApplyCustom = () => {
    let size = parseInt(customInput);
    if (isNaN(size) || size <= 0) {
       alert("Vui lòng nhập số lượng hợp lệ (1-50)");
       return;
    }
    if (size > 50) size = 50;
    setBaseArray(generateRandomArray(size));
  };

  const handleLLInsert = async () => {
      if(llIsBusy) return;
      let v = parseInt(llInput);
      if(isNaN(v)) return;
      
      setLlIsBusy(true);
      setLlInput('');
      const newNode = createNode(v);
      const targetIdx = calcInsertIndex(llInsertPos, llInsertIdx, llNodes.length);
      const gen = linkedListInsert(llNodes, newNode, targetIdx);

      for (const step of gen) {
        switch (step.type) {
          case 'SHOW_NEW_NODE':
            setLlNewNode(step.node);
            setLlPointerStatus({ step: 0 });
            await sleep(1000);
            break;
          case 'HIGHLIGHT':
            setLlActiveId(step.activeId);
            await sleep(600);
            break;
          case 'FLY_UP':
            setLlNewNode(step.node);
            setLlPointerStatus({ step: 1, activeArrowNodeId: null });
            await sleep(1000);
            break;
          case 'CONNECT_NEXT':
            setLlPointerStatus({ step: 2, activeArrowNodeId: null });
            await sleep(1000);
            break;
          case 'CONNECT_PREV':
            setLlPointerStatus({ step: 3, activeArrowNodeId: step.prevNodeId });
            await sleep(1000);
            break;
          case 'FINALIZE':
            setLlPointerStatus(null);
            setLlNodes(step.nodes);
            setLlNewNode(null);
            setLlActiveId(null);
            break;
        }
      }
      setLlIsBusy(false);
  };

  const handleLLDelete = async (id) => {
      if(llIsBusy) return;
      setLlIsBusy(true);
      const gen = linkedListDelete(llNodes, id);

      for (const step of gen) {
        switch (step.type) {
          case 'HIGHLIGHT':
            setLlActiveId(step.activeId);
            await sleep(500);
            break;
          case 'MARK_DELETE':
            setLlNodes(prev => prev.map(n => n.id === step.nodeId ? { ...n, isDeleting: true } : n));
            await sleep(300);
            break;
          case 'FINALIZE':
            setLlNodes(step.nodes);
            setLlActiveId(null);
            break;
        }
      }
      setLlIsBusy(false);
  };


  const maxValue = Math.max(...baseArray.map(i => i.val));
  const animTime = Math.max(20, 200 / speed);

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-white text-black">
      {/* Sidebar Controls */}
      <div className="w-full md:w-80 border-r-4 border-black flex flex-col shrink-0 overflow-y-auto bg-slate-50">
        <div className="p-6">
          <h2 className="font-black text-2xl mb-8 uppercase tracking-tighter border-b-4 border-black pb-2">BẢNG ĐIỀU KHIỂN</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Bước 1: Chọn Module</label>
              <select 
                value={algoType}
                onChange={(e) => setAlgoType(e.target.value)}
                disabled={isPlaying}
                className="w-full bg-white text-black border-4 border-black shadow-[4px_4px_0_0_#000] rounded-none py-3 px-3 text-xs font-bold uppercase cursor-pointer"
              >
                <optgroup label="Sắp xếp">
                  <option value="bubble">Bubble Sort</option>
                  <option value="quick">Quick Sort</option>
                  <option value="merge">Merge Sort</option>
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
                <div className="pt-2">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">TỐC ĐỘ [{speed.toFixed(1)}x]</label>
                  <input 
                    type="range" min="0.5" max="5.0" step="0.5" 
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-full accent-black cursor-ew-resize" 
                  />
                </div>

                <div className="border-t-4 border-black pt-6">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Sinh mảng ngẫu nhiên</label>
                  <div className="flex flex-col gap-2">
                     <input 
                        type="number"
                        placeholder="Số lượng (Max 50)"
                        value={customInput}
                        onChange={(e) => setCustomInput(e.target.value)}
                        disabled={isPlaying}
                        min="1" max="50"
                        className="w-full border-4 border-black px-3 py-2 text-xs font-mono outline-none shadow-[4px_4px_0_0_#000]"
                     />
                     <button onClick={handleApplyCustom} disabled={isPlaying || !customInput} className="w-full uppercase font-black border-4 border-black text-xs py-2 bg-black text-white hover:bg-white hover:text-black hover:shadow-[4px_4px_0_0_#000] transition-all">Tạo Mảng Random</button>
                  </div>
                </div>
              </>
            )}

            {isSearching && (
              <div className="border-t-4 border-black pt-6">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Target (Số cần tìm)</label>
                  <input 
                    type="number"
                    value={targetVal}
                    onChange={(e) => setTargetVal(e.target.value)}
                    disabled={isPlaying}
                    className="w-full border-4 border-black px-3 py-2 text-xl font-black font-mono outline-none shadow-[4px_4px_0_0_#000]"
                  />
              </div>
            )}

            {isLinkedList && (
              <div className="border-t-4 border-black pt-6">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-3 text-slate-500">Thao tác Singly Linked List</label>
                  <div className="flex flex-col gap-4">
                      <div className="flex flex-col xl:flex-row gap-2">
                          <select 
                             value={llInsertPos} 
                             onChange={e=>setLlInsertPos(e.target.value)} 
                             disabled={llIsBusy}
                             className="flex-1 border-4 border-black px-2 py-2 text-xs font-black uppercase outline-none shadow-[4px_4px_0_0_#000]"
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
                                className="w-full xl:w-20 border-4 border-black font-black text-center outline-none shadow-[4px_4px_0_0_#000] p-1" 
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
                        className="w-full border-4 border-black px-3 py-3 text-xl font-black font-mono outline-none shadow-[4px_4px_0_0_#000]"
                      />
                      <button onClick={handleLLInsert} disabled={!llInput || llIsBusy} className="w-full uppercase font-black border-4 border-black text-sm px-4 py-3 bg-black text-white hover:shadow-[4px_4px_0_0_#000] hover:-translate-y-1 hover:bg-white hover:text-black transition-all disabled:opacity-50">CHÈN NODE (INSERT)</button>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-4 text-center border-2 border-dashed border-slate-300 p-2">💡 Hover & Click vào Node để Xóa</p>
              </div>
            )}
          </div>
          
          {!isLinkedList && (
             <div className="flex flex-col gap-4 mt-8 pt-8 border-t-4 border-black">
                {isPlaying ? (
                  <button onClick={pause} className="uppercase tracking-widest text-sm font-black border-4 border-black shadow-[4px_4px_0_0_#000] bg-white text-black py-4 hover:shadow-none hover:translate-y-1 transition-all">TẠM DỪNG</button>
                ) : (
                  <button onClick={play} className="uppercase tracking-widest text-sm font-black border-4 border-black shadow-[6px_6px_0_0_#000] bg-black text-white py-4 hover:shadow-none hover:translate-y-1 transition-all">BẮT ĐẦU CHẠY</button>
                )}
             </div>
          )}
        </div>
      </div>
      
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0 p-8 bg-white relative overflow-auto pattern-grid">
        {!isLinkedList && !isSearching && (
          <div className="w-full max-w-5xl h-[60vh] relative mx-auto border-b-8 border-black pb-1 mt-auto">
            {baseArray.map((block) => {
              const currentIdx = array.findIndex(x => x.id === block.id);
              if (currentIdx === -1) return null;
              
              const isActive = state.activeIndices.includes(currentIdx);
              const isSwapping = state.swapIndices.includes(currentIdx);
              const isAux = state.auxIndices?.includes(currentIdx);
              const isSorted = state.sortedIndices.includes(currentIdx);
              
              let colorClass = "bg-blue-500 border-black";
              let transformClass = "";
              
              if (state.isFinished || isSorted) {
                  colorClass = "bg-green-500 border-black";
              } else {
                  if (isAux) {
                      transformClass = "-translate-y-8 md:-translate-y-16 scale-95";
                      colorClass = "bg-purple-400 border-black shadow-[4px_8px_0_0_#000] opacity-80 z-10";
                  }
                  
                  if (isActive) {
                      colorClass = isAux ? "bg-yellow-400 border-black shadow-[8px_16px_0_0_#000] z-20 scale-100" : "bg-yellow-400 border-black scale-105 shadow-xl z-20";
                  }
                  
                  if (isSwapping) {
                      colorClass = isAux ? "bg-red-500 border-black shadow-[8px_16px_0_0_#000] z-30 scale-110" : "bg-red-500 border-black scale-105 shadow-xl z-30";
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

                    let colorClass = "bg-white text-black shadow-[6px_6px_0_0_#000]";
                    if (isFound) colorClass = "bg-green-500 text-white scale-110 shadow-[8px_8px_0_0_#000] -translate-y-2";
                    else if (isMid) colorClass = "bg-yellow-400 text-black scale-110 shadow-[8px_8px_0_0_#000] -translate-y-2";
                    else if (isActive) colorClass = "bg-blue-200 text-black";
                    else if (isDiscarded) colorClass = "bg-slate-200 text-slate-400 border-slate-400 shadow-none scale-95";

                    return (
                        <div key={idx} className={`w-20 h-20 sm:w-24 sm:h-24 border-4 border-black flex items-center justify-center font-black text-3xl transition-transform duration-300 ${colorClass}`}>
                            {block.val}
                        </div>
                    )
                })}
            </div>
        )}

        {isLinkedList && (
            <div className="w-full h-full flex flex-col items-center justify-center relative p-8 bg-slate-50">
                <style>{`
                  @keyframes llInsert {
                    from { opacity: 0; transform: translateY(40px) scale(0.5); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                  }
                  .ll-node-enter {
                    animation: llInsert 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                  }
                  @keyframes flyUp {
                    0% { transform: translate(-150px, 150px); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translate(0, 0); opacity: 1; }
                  }
                  .animate-fly-up {
                    animation: flyUp 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                  }
                `}</style>
                
                <div className="w-full flex flex-nowrap items-center justify-start gap-x-2 p-8 z-10 overflow-x-auto pb-48 min-h-[300px] pt-16 custom-scrollbar">
                    <div className="flex items-center gap-1 relative flex-shrink-0">
                        <div className={`font-black text-lg border-[3px] border-black px-3 py-1.5 text-white transition-all duration-300 ${llActiveId === 'HEAD' ? 'bg-yellow-400 text-black scale-110 shadow-[3px_3px_0_0_#000] -translate-y-1' : 'bg-black'}`}>HEAD</div>
                        
                        <div className="relative flex flex-col items-center justify-center w-8">
                            <div className={`text-xl font-black transition-all duration-300 ${(llPointerStatus?.activeArrowNodeId === 'HEAD' && llPointerStatus?.step >= 3) ? 'opacity-0' : 'text-slate-400'}`}>→</div>
                            
                            {llNewNode && llNewNode.targetIdx === 0 && llPointerStatus?.step >= 1 && (
                                <div className="absolute top-full mt-2 flex flex-col items-center z-20 animate-fly-up">
                                    {llPointerStatus?.step >= 2 && (
                                        <div className="absolute bottom-[92%] left-[80%] flex items-center animate-arrow-connect origin-bottom-left -rotate-[40deg]">
                                            <div className="w-10 h-[4px] bg-green-500 rounded"></div>
                                            <div className="w-4 h-4 border-t-[4px] border-r-[4px] border-green-500 transform rotate-45 -ml-1.5"></div>
                                        </div>
                                    )}
                                    {llPointerStatus?.step >= 3 && llPointerStatus?.activeArrowNodeId === 'HEAD' && (
                                        <div className="absolute bottom-[92%] right-[80%] flex items-center animate-arrow-connect origin-top-left rotate-[40deg]">
                                            <div className="w-10 h-[4px] bg-yellow-500 rounded"></div>
                                            <div className="w-4 h-4 border-t-[4px] border-r-[4px] border-yellow-500 transform rotate-45 -ml-1.5"></div>
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black uppercase text-green-600 mb-1 bg-green-100 px-1 py-0.5 rounded border-[2px] border-green-400 shadow-sm mt-2">vtx</span>
                                    <div className="flex border-[3px] border-black shadow-[3px_3px_0_0_#10B981] bg-white relative">
                                        <div className="px-3 py-1.5 font-black text-xl sm:text-2xl border-r-[3px] border-black">{llNewNode.val}</div>
                                        <div className="px-2 py-1.5 font-black text-white flex items-center justify-center bg-blue-500 text-xs">•</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {llNodes.map((node, idx) => {
                        const isDeleting = node.isDeleting;
                        const isActive = node.id === llActiveId;
                        const isPrevArrowActive = llPointerStatus?.activeArrowNodeId === node.id;
                        const isTargetAnim = llNewNode && llNewNode.targetIdx === idx + 1;

                        return (
                            <div key={node.id} className="flex items-center gap-1 group ll-node-enter flex-shrink-0" style={{ transition: 'all 0.3s ease', opacity: isDeleting ? 0 : 1, transform: isDeleting ? 'scale(0.5) translateY(-30px)' : 'none' }}>
                                <div className="relative">
                                    <div className={`flex border-[3px] border-black shadow-[3px_3px_0_0_#000] cursor-pointer transition-all duration-300 relative ${isActive ? 'bg-yellow-200 scale-110 -translate-y-1' : 'bg-white hover:-translate-y-1'}`} onClick={() => handleLLDelete(node.id)}>
                                        <div className="absolute -top-5 left-1 bg-black text-white text-[10px] font-black px-1 border-2 border-black">IDX: {idx}</div>
                                        
                                        <div className="px-3 py-1.5 font-black text-xl sm:text-2xl border-r-[3px] border-black group-hover:bg-red-50 transition-colors">{node.val}</div>
                                        <div className={`px-2 py-1.5 font-black text-white flex items-center justify-center transition-colors duration-300 text-xs ${isActive ? 'bg-yellow-500' : 'bg-blue-500 group-hover:bg-red-500'}`}>•</div>
                                        
                                        {!llIsBusy && <button className="absolute -top-3 -right-3 w-6 h-6 bg-black text-white rounded-full border-[3px] border-black flex items-center justify-center opacity-0 group-hover:opacity-100 font-bold hover:scale-110 transition-all z-10 shadow-[2px_2px_0_0_#000] group-hover:bg-red-500 pointer-events-none text-[10px]">✕</button>}
                                    </div>
                                </div>
                                
                                <div className="relative flex flex-col items-center justify-center w-8">
                                    <div className={`text-xl font-black transition-all duration-300 ${isActive ? 'text-yellow-500' : 'text-slate-400'} ${(isPrevArrowActive && llPointerStatus?.step >= 3) ? 'opacity-0' : ''}`}>→</div>
                                    
                                    {isTargetAnim && llPointerStatus?.step >= 1 && (
                                        <div className="absolute top-full mt-2 flex flex-col items-center z-20 animate-fly-up">
                                            {llPointerStatus?.step >= 2 && (
                                                <div className="absolute bottom-[92%] left-[80%] flex items-center animate-arrow-connect origin-bottom-left -rotate-[40deg]">
                                                    <div className="w-10 h-[4px] bg-green-500 rounded"></div>
                                                    <div className="w-4 h-4 border-t-[4px] border-r-[4px] border-green-500 transform rotate-45 -ml-1.5"></div>
                                                </div>
                                            )}
                                            {llPointerStatus?.step >= 3 && isPrevArrowActive && (
                                                <div className="absolute bottom-[92%] right-[80%] flex items-center animate-arrow-connect origin-top-left rotate-[40deg]">
                                                    <div className="w-10 h-[4px] bg-yellow-500 rounded"></div>
                                                    <div className="w-4 h-4 border-t-[4px] border-r-[4px] border-yellow-500 transform rotate-45 -ml-1.5"></div>
                                                </div>
                                            )}
                                            <span className="text-[10px] font-black uppercase text-green-600 mb-1 bg-green-100 px-1 py-0.5 rounded border-[2px] border-green-400 shadow-sm mt-2">vtx</span>
                                            <div className="flex border-[3px] border-black shadow-[3px_3px_0_0_#10B981] bg-white relative">
                                                <div className="px-3 py-1.5 font-black text-xl sm:text-2xl border-r-[3px] border-black">{llNewNode.val}</div>
                                                <div className="px-2 py-1.5 font-black text-white flex items-center justify-center text-xs bg-blue-500">•</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                    <div className="font-black text-lg border-[3px] text-slate-500 border-slate-500 border-dashed px-3 py-1.5 mt-2 ml-2 flex-shrink-0">NULL</div>
                </div>
                
                {/* Khu vực tạo Node: Kho bãi cố định ở dưới */}
                <div className="h-32 w-full flex justify-center items-center mt-8 border-t-4 border-dashed border-slate-300 relative shrink-0 z-0">
                    {llNewNode && llPointerStatus?.step === 0 && (
                        <div className="absolute flex flex-col items-center animate-bounce z-20">
                            <span className="text-[10px] font-black uppercase text-green-600 mb-1 bg-green-100 px-1 py-0.5 rounded border-[2px] border-green-400 shadow-sm mt-2">vtx</span>
                            <div className="flex border-[3px] border-black shadow-[3px_3px_0_0_#10B981] bg-white relative">
                                <div className="px-3 py-1.5 font-black text-xl sm:text-2xl border-r-[3px] border-black">{llNewNode.val}</div>
                                <div className="px-2 py-1.5 font-black text-white flex items-center justify-center text-xs bg-blue-500">•</div>
                            </div>
                        </div>
                    )}
                    {(!llNewNode || llPointerStatus?.step > 0) && <span className="absolute top-2 left-4 text-slate-300 text-sm font-bold uppercase tracking-widest">Khu vực chứa Thực thể Mới</span>}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
export default Workspace;
