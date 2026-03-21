import { useState, useEffect, useRef, useCallback } from 'react';

export const useAlgorithm = (generatorFn, initialArray, extraArgs = {}) => {
  const [array, setArray] = useState([...initialArray]);
  const [state, setState] = useState({
    activeIndices: [],
    swapIndices: [],
    auxIndices: [],
    sortedIndices: [],
    foundIndex: -1,
    pseudoLine: 0,
    pseudoLineStatus: 'active',
    isFinished: false
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const generatorRef = useRef(null);

  const extraArgsRef = useRef(extraArgs);
  useEffect(() => {
    extraArgsRef.current = extraArgs;
  }, [extraArgs]);

  const init = useCallback((initArr) => {
    setArray([...initArr]);
    setState({
      activeIndices: [],
      swapIndices: [],
      auxIndices: [],
      sortedIndices: [],
      foundIndex: -1,
      pseudoLine: 0,
      isFinished: false
    });
    setIsPlaying(false);
    generatorRef.current = generatorFn(initArr, extraArgsRef.current);
  }, [generatorFn]);

  // Đồng bộ trạng thái khi initialArray thay đổi (pattern để đồng bộ trạng thái từ props)
  const [prevInitialArray, setPrevInitialArray] = useState(initialArray);
  if (initialArray !== prevInitialArray) {
    setPrevInitialArray(initialArray);
    // Đặt lại các state trực tiếp trong lúc render để tối ưu và đáp ứng quy tắc lint
    setArray([...initialArray]);
    setState({
        activeIndices: [],
        swapIndices: [],
        auxIndices: [],
        sortedIndices: [],
        foundIndex: -1,
        pseudoLine: 0,
        pseudoLineStatus: 'active',
        isFinished: false
    });
    setIsPlaying(false);
  }

  // Cập nhật generator ref trong effect (nơi an toàn để cập nhật ref)
  useEffect(() => {
    generatorRef.current = generatorFn(initialArray, extraArgsRef.current);
  }, [initialArray, generatorFn]);

  const play = useCallback(() => {
    if (state.isFinished || !generatorRef.current) {
        if (state.isFinished) {
            init(initialArray); 
        }
    }
    setIsPlaying(true);
  }, [state.isFinished, initialArray, init]);

  const pause = () => setIsPlaying(false);

  const step = useCallback(() => {
    if (generatorRef.current) {
      const { value, done } = generatorRef.current.next();
      if (value || done) {
        if (value) setArray(value.array);
        setState(prev => {
          const merged = value || {};
          return {
            ...prev,
            ...merged,
            activeIndices: merged.activeIndices || [],
            swapIndices: merged.swapIndices || [],
            auxIndices: merged.auxIndices || [],
            sortedIndices: merged.sortedIndices || [],
            foundIndex: merged.foundIndex !== undefined ? merged.foundIndex : -1,
            pseudoLine: merged.pseudoLine || 0,
            pseudoLineStatus: merged.pseudoLineStatus || 'active',
            isFinished: merged.isFinished || done
          };
        });
        if ((value && value.isFinished) || done) {
          setIsPlaying(false);
        }
      }
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isPlaying) {
      const delay = Math.max(20, 200 / speed);
      timer = setInterval(step, delay);
    }
    return () => clearInterval(timer);
  }, [isPlaying, speed, step]);

  return { array, state, isPlaying, speed, setSpeed, play, pause, step, init };
};
