import { useState, useEffect, useRef, useCallback } from 'react';

export const useBattle = (gen1Fn, gen2Fn, initialArray, extraArgs1 = {}, extraArgs2 = {}) => {
  const [array1, setArray1] = useState([...initialArray]);
  const [array2, setArray2] = useState([...initialArray]);
  
  const createInitialState = () => ({
    activeIndices: [],
    swapIndices: [],
    auxIndices: [],
    sortedIndices: [],
    foundIndex: -1,
    pseudoLine: 0,
    isFinished: false,
    startTime: null,
    endTime: null,
    totalTime: 0
  });

  const [state1, setState1] = useState(createInitialState());
  const [state2, setState2] = useState(createInitialState());
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  
  const gen1Ref = useRef(null);
  const gen2Ref = useRef(null);
  const timer1Ref = useRef(null);
  const timer2Ref = useRef(null);

  const init = useCallback((initArr) => {
    const copy1 = [...initArr];
    const copy2 = [...initArr];
    setArray1(copy1);
    setArray2(copy2);
    setState1(createInitialState());
    setState2(createInitialState());
    setIsPlaying(false);
    gen1Ref.current = gen1Fn(copy1, extraArgs1);
    gen2Ref.current = gen2Fn(copy2, extraArgs2);
    if (timer1Ref.current) clearInterval(timer1Ref.current);
    if (timer2Ref.current) clearInterval(timer2Ref.current);
  }, [gen1Fn, gen2Fn, extraArgs1, extraArgs2]);

  useEffect(() => {
    init(initialArray);
  }, [initialArray, init]);

  const step1 = useCallback(() => {
    if (gen1Ref.current && !state1.isFinished) {
      const { value, done } = gen1Ref.current.next();
      if (value) {
        setArray1(value.array);
        setState1(prev => ({
          ...value,
          startTime: prev.startTime || Date.now(),
          endTime: (value.isFinished || done) ? Date.now() : null,
          totalTime: (value.isFinished || done) ? (Date.now() - (prev.startTime || Date.now())) : 0,
          isFinished: value.isFinished || done
        }));
      }
    }
  }, [state1.isFinished]);

  const step2 = useCallback(() => {
    if (gen2Ref.current && !state2.isFinished) {
      const { value, done } = gen2Ref.current.next();
      if (value) {
        setArray2(value.array);
        setState2(prev => ({
          ...value,
          startTime: prev.startTime || Date.now(),
          endTime: (value.isFinished || done) ? Date.now() : null,
          totalTime: (value.isFinished || done) ? (Date.now() - (prev.startTime || Date.now())) : 0,
          isFinished: value.isFinished || done
        }));
      }
    }
  }, [state2.isFinished]);

  useEffect(() => {
    let t1, t2;
    if (isPlaying) {
      const delay = Math.max(10, 200 / speed);
      if (!state1.isFinished) t1 = setInterval(step1, delay);
      if (!state2.isFinished) t2 = setInterval(step2, delay);
    }
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [isPlaying, speed, step1, step2, state1.isFinished, state2.isFinished]);

  const play = () => {
    if (state1.isFinished && state2.isFinished) {
      init(initialArray);
    }
    setIsPlaying(true);
    // Mark start time if not already marked
    setState1(p => ({...p, startTime: p.startTime || Date.now()}));
    setState2(p => ({...p, startTime: p.startTime || Date.now()}));
  };
  
  const pause = () => setIsPlaying(false);

  return { 
    array1, state1, 
    array2, state2, 
    isPlaying, speed, setSpeed, 
    play, pause, init 
  };
};
