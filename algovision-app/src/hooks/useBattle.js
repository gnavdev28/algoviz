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

  // Refs cho thời gian để đảm bảo độc lập tuyệt đối và không bị delay bởi React render
  const startTime1Ref = useRef(null);
  const startTime2Ref = useRef(null);
  const accumulatedTime1Ref = useRef(0);
  const accumulatedTime2Ref = useRef(0);

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
    startTime1Ref.current = null;
    startTime2Ref.current = null;
    accumulatedTime1Ref.current = 0;
    accumulatedTime2Ref.current = 0;
  }, [gen1Fn, gen2Fn, extraArgs1, extraArgs2]);

  // Đồng bộ trạng thái khi initialArray hoặc Thuật toán thay đổi (Sync state in render)
  const [prev, setPrev] = useState({ arr: initialArray, gen1: gen1Fn, gen2: gen2Fn });

  if (initialArray !== prev.arr || gen1Fn !== prev.gen1 || gen2Fn !== prev.gen2) {
    setPrev({ arr: initialArray, gen1: gen1Fn, gen2: gen2Fn });

    // Reset toàn bộ mảng và trạng thái ngay trong lúc render (Tuân thủ set-state-in-render)
    setArray1([...initialArray]);
    setArray2([...initialArray]);
    const newState = createInitialState();
    setState1(newState);
    setState2(newState);
    setIsPlaying(false);
  }

  // Đồng bộ Refs (trong effect) - Giải quyết lỗi 'Cannot update ref during render'
  useEffect(() => {
    // Reset refs thời gian khi thuật toán hoặc mảng thay đổi
    accumulatedTime1Ref.current = 0;
    accumulatedTime2Ref.current = 0;
    startTime1Ref.current = null;
    startTime2Ref.current = null;
    
    // Cập nhật generator refs mới
    gen1Ref.current = gen1Fn([...initialArray], extraArgs1);
    gen2Ref.current = gen2Fn([...initialArray], extraArgs2);
  }, [initialArray, gen1Fn, gen2Fn, extraArgs1, extraArgs2]);

  const step1 = useCallback(() => {
    if (gen1Ref.current && !state1.isFinished) {
      const { value, done } = gen1Ref.current.next();
      if (value || done) {
        if (value) setArray1(value.array);
        setState1(prev => {
          if (prev.isFinished) return prev;
          const merged = value || {};
          return {
            ...prev,
            ...merged,
            isFinished: merged.isFinished || done
          };
        });
      }
    }
  }, [state1.isFinished]);

  const step2 = useCallback(() => {
    if (gen2Ref.current && !state2.isFinished) {
      const { value, done } = gen2Ref.current.next();
      if (value || done) {
        if (value) setArray2(value.array);
        setState2(prev => {
          if (prev.isFinished) return prev;
          const merged = value || {};
          return {
            ...prev,
            ...merged,
            isFinished: merged.isFinished || done
          };
        });
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

  // Bộ đếm thời gian độc lập (Đã sửa: nhân với speed để phản ánh thời gian thuật toán)
  useEffect(() => {
    let timer;
    if (isPlaying) {
      if (!state1.isFinished && startTime1Ref.current === null) {
        startTime1Ref.current = performance.now();
      }
      if (!state2.isFinished && startTime2Ref.current === null) {
        startTime2Ref.current = performance.now();
      }

      timer = setInterval(() => {
        // Cập nhật state1 chỉ để hiển thị UI
        if (startTime1Ref.current !== null) {
          const now = performance.now();
          const currentTotal = accumulatedTime1Ref.current + (now - startTime1Ref.current) * speed;
          setState1(prev => {
            if (prev.isFinished) {
              // Nếu đã xong thì dừng ngay (cleanup sẽ handle việc lưu ref)
              return prev;
            }
            return { ...prev, totalTime: Math.round(currentTotal) };
          });
        }

        // Cập nhật state2 chỉ để hiển thị UI
        if (startTime2Ref.current !== null) {
          const now = performance.now();
          const currentTotal = accumulatedTime2Ref.current + (now - startTime2Ref.current) * speed;
          setState2(prev => {
            if (prev.isFinished) {
              return prev;
            }
            return { ...prev, totalTime: Math.round(currentTotal) };
          });
        }

        if (startTime1Ref.current === null && startTime2Ref.current === null) {
          clearInterval(timer);
        }
      }, 16);
    }

    return () => {
      if (timer) clearInterval(timer);
      // Checkpoint: Lưu lại thời gian đã chạy nhân với speed hiện tại khi Pause hoặc đổi Speed
      if (startTime1Ref.current !== null) {
        accumulatedTime1Ref.current += (performance.now() - startTime1Ref.current) * speed;
        startTime1Ref.current = null;
      }
      if (startTime2Ref.current !== null) {
        accumulatedTime2Ref.current += (performance.now() - startTime2Ref.current) * speed;
        startTime2Ref.current = null;
      }
    };
  }, [isPlaying, speed, state1.isFinished, state2.isFinished]);

  useEffect(() => {
    if (state1.isFinished && startTime1Ref.current !== null) {
      accumulatedTime1Ref.current += (performance.now() - startTime1Ref.current) * speed;
      startTime1Ref.current = null;
      setState1(prev => ({ ...prev, totalTime: Math.round(accumulatedTime1Ref.current) }));
    }
  }, [state1.isFinished, speed]);

  useEffect(() => {
    if (state2.isFinished && startTime2Ref.current !== null) {
      accumulatedTime2Ref.current += (performance.now() - startTime2Ref.current) * speed;
      startTime2Ref.current = null;
      setState2(prev => ({ ...prev, totalTime: Math.round(accumulatedTime2Ref.current) }));
    }
  }, [state2.isFinished, speed]);

  const play = () => {
    if (state1.isFinished && state2.isFinished) {
      init(initialArray);
    }
    setIsPlaying(true);
  };

  const pause = () => setIsPlaying(false);

  return {
    array1, state1,
    array2, state2,
    isPlaying, speed, setSpeed,
    play, pause, init
  };
};
