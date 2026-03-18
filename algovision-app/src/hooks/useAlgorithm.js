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

  useEffect(() => {
    init(initialArray);
  }, [initialArray, init]);

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
      if (value) {
        setArray(value.array);
        setState({
          activeIndices: value.activeIndices || [],
          swapIndices: value.swapIndices || [],
          auxIndices: value.auxIndices || [],
          sortedIndices: value.sortedIndices || [],
          foundIndex: value.foundIndex !== undefined ? value.foundIndex : -1,
          pseudoLine: value.pseudoLine || 0,
          isFinished: value.isFinished || done
        });
        if (value.isFinished || done) {
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
